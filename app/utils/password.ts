import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";

const SALT_ROUNDS = 10;
const PASSWORDS_KEY = "passwords";

interface StoredPassword {
  id: string;
  hash: string;
  label?: string;
  createdAt: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a bcrypt hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if KV is configured
 */
function isKVConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Get all stored passwords from KV
 */
export async function getStoredPasswords(): Promise<StoredPassword[]> {
  if (!isKVConfigured()) {
    return [];
  }
  const passwords = await kv.get<StoredPassword[]>(PASSWORDS_KEY);
  return passwords || [];
}

/**
 * Add a new password to KV storage
 */
export async function addPassword(
  password: string,
  label?: string
): Promise<StoredPassword> {
  if (!isKVConfigured()) {
    throw new Error("Vercel KV is not configured");
  }

  const hash = await hashPassword(password);
  const id = crypto.randomUUID();
  const newPassword: StoredPassword = {
    id,
    hash,
    label,
    createdAt: Date.now(),
  };

  const existing = await getStoredPasswords();
  await kv.set(PASSWORDS_KEY, [...existing, newPassword]);

  return newPassword;
}

/**
 * Delete a password by ID
 */
export async function deletePassword(id: string): Promise<boolean> {
  if (!isKVConfigured()) {
    throw new Error("Vercel KV is not configured");
  }

  const existing = await getStoredPasswords();
  const filtered = existing.filter((p) => p.id !== id);

  if (filtered.length === existing.length) {
    return false; // Password not found
  }

  await kv.set(PASSWORDS_KEY, filtered);
  return true;
}

/**
 * Get password hashes - uses KV if configured, falls back to env var
 */
export async function getPasswordHashes(): Promise<string[]> {
  // Try KV first
  if (isKVConfigured()) {
    const passwords = await getStoredPasswords();
    if (passwords.length > 0) {
      return passwords.map((p) => p.hash);
    }
  }

  // Fall back to env var
  const hashesJson = process.env.PAGE_PASSWORD_HASHES;
  if (hashesJson) {
    return JSON.parse(hashesJson);
  }

  return [];
}

/**
 * Check if any stored password matches the provided password
 */
export async function verifyPasswordAgainstStored(
  password: string
): Promise<boolean> {
  const hashes = await getPasswordHashes();

  for (const hash of hashes) {
    if (await verifyPassword(password, hash)) {
      return true;
    }
  }
  return false;
}
