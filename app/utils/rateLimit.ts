import { kv } from "@vercel/kv";

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

// In-memory fallback for development or when KV is unavailable
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup interval for expired entries (runs every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let cleanupInterval: NodeJS.Timeout | null = null;

function startCleanupInterval() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((data, key) => {
      if (now > data.resetAt) {
        memoryStore.delete(key);
      }
    });
  }, CLEANUP_INTERVAL_MS);
  // Don't prevent process exit
  cleanupInterval.unref?.();
}

// Start cleanup on module load
startCleanupInterval();

/**
 * Check and update rate limit for an identifier (usually IP address)
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  try {
    // Try Vercel KV first
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      return await checkRateLimitKV(key, config, now);
    }
  } catch (error) {
    console.error("KV rate limit failed, falling back to memory:", error);
  }

  // Fallback to in-memory
  return checkRateLimitMemory(key, config, now);
}

async function checkRateLimitKV(
  key: string,
  config: RateLimitConfig,
  now: number
): Promise<RateLimitResult> {
  const countKey = `${key}:count`;
  const ttlSeconds = Math.ceil(config.windowMs / 1000);

  // Use atomic INCR operation to avoid race conditions
  // If key doesn't exist, INCR creates it with value 1
  const count = await kv.incr(countKey);

  // If this is the first request (count === 1), set the expiration
  if (count === 1) {
    await kv.expire(countKey, ttlSeconds);
  }

  // Get TTL to calculate resetAt
  const ttl = await kv.ttl(countKey);
  const resetAt = now + (ttl > 0 ? ttl * 1000 : config.windowMs);

  if (count > config.maxAttempts) {
    return { allowed: false, remaining: 0, resetAt };
  }

  return {
    allowed: true,
    remaining: config.maxAttempts - count,
    resetAt,
  };
}

function checkRateLimitMemory(
  key: string,
  config: RateLimitConfig,
  now: number
): RateLimitResult {
  const data = memoryStore.get(key);

  if (!data || now > data.resetAt) {
    const resetAt = now + config.windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxAttempts - 1, resetAt };
  }

  if (data.count >= config.maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: data.resetAt };
  }

  data.count++;
  return {
    allowed: true,
    remaining: config.maxAttempts - data.count,
    resetAt: data.resetAt,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}
