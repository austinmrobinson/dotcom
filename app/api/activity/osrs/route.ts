import { kv } from "@vercel/kv";

const OSRS_USERNAME = "maximvs597";
const CACHE_TTL_SECONDS = 60 * 60 * 2; // 2 hours

interface WOMSnapshot {
  value: number; // EHP value
  rank: number;
  date: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);

  // Validate year
  if (isNaN(year) || year < 2013 || year > new Date().getFullYear()) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }

  const cacheKey = `activity:osrs:${OSRS_USERNAME}:${year}`;

  // Try cache first
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<{ days: Record<string, number>; totalHours: number }>(cacheKey);
      if (cached) {
        return Response.json({ success: true, data: cached, cached: true });
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  try {
    // Wise Old Man API - fetch snapshots timeline
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const url = `https://api.wiseoldman.net/v2/players/${encodeURIComponent(OSRS_USERNAME)}/snapshots/timeline?metric=ehp&startDate=${startDate}&endDate=${endDate}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Optional API key for higher rate limits
    if (process.env.WOM_API_KEY) {
      headers["x-api-key"] = process.env.WOM_API_KEY;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        // Player not found - return empty data
        return Response.json({
          success: true,
          data: { days: {}, totalHours: 0 },
          cached: false,
        });
      }
      throw new Error(`WOM API error: ${response.status}`);
    }

    const snapshots: WOMSnapshot[] = await response.json();

    if (!Array.isArray(snapshots) || snapshots.length === 0) {
      return Response.json({
        success: true,
        data: { days: {}, totalHours: 0 },
        cached: false,
      });
    }

    // Calculate daily hours played from EHP deltas
    const days: Record<string, number> = {};
    let totalHours = 0;

    // Sort snapshots by date (oldest first)
    const sortedSnapshots = snapshots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate EHP delta between consecutive snapshots
    for (let i = 1; i < sortedSnapshots.length; i++) {
      const prevSnapshot = sortedSnapshots[i - 1];
      const currSnapshot = sortedSnapshots[i];

      const prevEHP = prevSnapshot.value;
      const currEHP = currSnapshot.value;
      const ehpDelta = currEHP - prevEHP;

      // Only count positive deltas (XP gains)
      if (ehpDelta > 0) {
        const date = currSnapshot.date.split("T")[0];

        // EHP is already in hours
        days[date] = (days[date] || 0) + ehpDelta;
        totalHours += ehpDelta;
      }
    }

    // Round values
    Object.keys(days).forEach(date => {
      days[date] = Math.round(days[date] * 100) / 100;
    });
    totalHours = Math.round(totalHours * 100) / 100;

    const data = { days, totalHours };

    // Cache the result
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(cacheKey, data, { ex: CACHE_TTL_SECONDS });
      }
    } catch (error) {
      console.error("Cache write error:", error);
    }

    return Response.json({ success: true, data, cached: false });
  } catch (error) {
    console.error("WOM API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch OSRS data" },
      { status: 500 }
    );
  }
}
