import { kv } from "@vercel/kv";
import { getRunPageAthleteId } from "./config";

export interface StravaActivityRaw {
  id: number;
  name: string;
  type: string;
  start_date: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  average_speed: number;
}

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export async function getStravaAccessToken(): Promise<string | null> {
  const athleteId = getRunPageAthleteId();
  const tokenKey = `strava:token:${athleteId}`;

  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<{ accessToken: string; expiresAt: number }>(
        tokenKey
      );
      if (cached && cached.expiresAt > Date.now() / 1000 + 60) {
        return cached.accessToken;
      }
    }
  } catch (error) {
    console.error("Token cache read error:", error);
  }

  if (
    !process.env.STRAVA_CLIENT_ID ||
    !process.env.STRAVA_CLIENT_SECRET ||
    !process.env.STRAVA_REFRESH_TOKEN
  ) {
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

export async function fetchAllRunActivities(
  accessToken: string
): Promise<StravaActivityRaw[]> {
  const athleteId = getRunPageAthleteId();
  const cacheKey = `run:activities:all:${athleteId}`;
  const cacheTtl = 60 * 60 * 6;

  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<StravaActivityRaw[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }
  } catch (error) {
    console.error("Activity cache read error:", error);
  }

  const allActivities: StravaActivityRaw[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`);
    }

    const activities: StravaActivityRaw[] = await response.json();
    if (activities.length === 0) break;

    allActivities.push(
      ...activities.filter((activity) => activity.type === "Run")
    );

    if (activities.length < perPage) break;
    page++;
  }

  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(cacheKey, allActivities, { ex: cacheTtl });
    }
  } catch (error) {
    console.error("Activity cache write error:", error);
  }

  return allActivities;
}

export async function fetchStravaActivity(
  accessToken: string,
  activityId: number
): Promise<StravaActivityRaw | null> {
  const cacheKey = `run:activity:${activityId}`;

  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<StravaActivityRaw>(cacheKey);
      if (cached) {
        return cached;
      }
    }
  } catch (error) {
    console.error("Activity cache read error:", error);
  }

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/activities/${activityId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      return null;
    }

    const activity: StravaActivityRaw = await response.json();

    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(cacheKey, activity, { ex: 60 * 60 * 24 });
      }
    } catch (error) {
      console.error("Activity cache write error:", error);
    }

    return activity;
  } catch (error) {
    console.error("Strava activity fetch error:", error);
    return null;
  }
}
