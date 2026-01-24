import { kv } from "@vercel/kv";
import { ActivityData, DayActivity } from "@/app/types/activity";
import { SCORING } from "@/app/utils/activity";

const CACHE_TTL_SECONDS = 60 * 30; // 30 minutes

interface GitHubData {
  days: Record<string, number>;
  total: number;
}

interface StravaData {
  days: Record<string, number>;
  totalMiles: number;
}

interface OSRSData {
  days: Record<string, number>;
  totalHours: number;
}

function createEmptyDayActivity(date: string): DayActivity {
  return {
    date,
    github: { commits: 0, points: 0 },
    strava: { miles: 0, points: 0 },
    osrs: { hours: 0, points: 0 },
    totalPoints: 0,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);

  // Validate year
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }

  const cacheKey = `activity:combined:${year}`;

  // Try cache first
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<ActivityData>(cacheKey);
      if (cached) {
        return Response.json({ success: true, data: cached, cached: true });
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  // Fetch from all three sources in parallel
  const baseUrl = new URL(request.url).origin;

  const [githubRes, stravaRes, osrsRes] = await Promise.all([
    fetch(`${baseUrl}/api/activity/github?year=${year}`).then(r => r.json()).catch(() => null),
    fetch(`${baseUrl}/api/activity/strava?year=${year}`).then(r => r.json()).catch(() => null),
    fetch(`${baseUrl}/api/activity/osrs?year=${year}`).then(r => r.json()).catch(() => null),
  ]);

  const githubData: GitHubData = githubRes?.success ? githubRes.data : { days: {}, total: 0 };
  const stravaData: StravaData = stravaRes?.success ? stravaRes.data : { days: {}, totalMiles: 0 };
  const osrsData: OSRSData = osrsRes?.success ? osrsRes.data : { days: {}, totalHours: 0 };

  // Combine all dates
  const allDates = new Set<string>([
    ...Object.keys(githubData.days),
    ...Object.keys(stravaData.days),
    ...Object.keys(osrsData.days),
  ]);

  // Build combined activity data
  const days: Record<string, DayActivity> = {};
  let totalGithubPoints = 0;
  let totalStravaPoints = 0;
  let totalOsrsPoints = 0;

  allDates.forEach(date => {
    const day = createEmptyDayActivity(date);

    // GitHub
    if (githubData.days[date]) {
      day.github.commits = githubData.days[date];
      day.github.points = day.github.commits * SCORING.GITHUB_COMMIT_POINTS;
      totalGithubPoints += day.github.points;
    }

    // Strava
    if (stravaData.days[date]) {
      day.strava.miles = stravaData.days[date];
      day.strava.points = day.strava.miles / SCORING.STRAVA_MILES_PER_POINT;
      totalStravaPoints += day.strava.points;
    }

    // OSRS
    if (osrsData.days[date]) {
      day.osrs.hours = osrsData.days[date];
      day.osrs.points = day.osrs.hours / SCORING.OSRS_HOURS_PER_POINT;
      totalOsrsPoints += day.osrs.points;
    }

    day.totalPoints = day.github.points + day.strava.points + day.osrs.points;
    days[date] = day;
  });

  const data: ActivityData = {
    year,
    days,
    totals: {
      github: Math.round(totalGithubPoints * 100) / 100,
      strava: Math.round(totalStravaPoints * 100) / 100,
      osrs: Math.round(totalOsrsPoints * 100) / 100,
      overall: Math.round((totalGithubPoints + totalStravaPoints + totalOsrsPoints) * 100) / 100,
    },
  };

  // Cache the result
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(cacheKey, data, { ex: CACHE_TTL_SECONDS });
    }
  } catch (error) {
    console.error("Cache write error:", error);
  }

  return Response.json({ success: true, data, cached: false });
}
