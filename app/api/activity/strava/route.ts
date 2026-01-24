import { kv } from "@vercel/kv";

const STRAVA_ATHLETE_ID = "13603808";
const CACHE_TTL_SECONDS = 60 * 60 * 6; // 6 hours
const METERS_TO_MILES = 1609.34;

interface StravaActivity {
  id: number;
  type: string;
  start_date_local: string;
  distance: number;
}

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

async function getStravaAccessToken(): Promise<string | null> {
  const tokenKey = `strava:token:${STRAVA_ATHLETE_ID}`;

  // Check for cached token
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<{ accessToken: string; expiresAt: number }>(tokenKey);
      if (cached && cached.expiresAt > Date.now() / 1000 + 60) {
        return cached.accessToken;
      }
    }
  } catch (error) {
    console.error("Token cache read error:", error);
  }

  // Refresh token
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET || !process.env.STRAVA_REFRESH_TOKEN) {
    return null;
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: process.env.STRAVA_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data: StravaTokenResponse = await response.json();

    // Cache the new token
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(
          tokenKey,
          { accessToken: data.access_token, expiresAt: data.expires_at },
          { ex: data.expires_at - Math.floor(Date.now() / 1000) }
        );
      }
    } catch (error) {
      console.error("Token cache write error:", error);
    }

    return data.access_token;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);

  // Validate year
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }

  const cacheKey = `activity:strava:${STRAVA_ATHLETE_ID}:${year}`;

  // Try cache first
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<{ days: Record<string, number>; totalMiles: number }>(cacheKey);
      if (cached) {
        return Response.json({ success: true, data: cached, cached: true });
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  // Get access token
  const accessToken = await getStravaAccessToken();
  if (!accessToken) {
    return Response.json({ error: "Strava not configured or token refresh failed" }, { status: 500 });
  }

  try {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year}-12-31T23:59:59Z`);
    const after = Math.floor(startDate.getTime() / 1000);
    const before = Math.floor(endDate.getTime() / 1000);

    // Fetch activities with pagination
    const allActivities: StravaActivity[] = [];
    let page = 1;
    const perPage = 200;

    while (true) {
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&page=${page}&per_page=${perPage}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Strava API error: ${response.status}`);
      }

      const activities: StravaActivity[] = await response.json();

      if (activities.length === 0) break;

      allActivities.push(...activities);

      if (activities.length < perPage) break;
      page++;
    }

    // Filter for running activities and group by date
    const days: Record<string, number> = {};
    let totalMiles = 0;

    allActivities
      .filter(activity => activity.type === "Run")
      .forEach(activity => {
        const date = activity.start_date_local.split("T")[0];
        const miles = activity.distance / METERS_TO_MILES;
        days[date] = (days[date] || 0) + miles;
        totalMiles += miles;
      });

    // Round values
    Object.keys(days).forEach(date => {
      days[date] = Math.round(days[date] * 100) / 100;
    });
    totalMiles = Math.round(totalMiles * 100) / 100;

    const data = { days, totalMiles };

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
    console.error("Strava API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch Strava data" },
      { status: 500 }
    );
  }
}
