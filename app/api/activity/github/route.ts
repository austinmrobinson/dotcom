import { kv } from "@vercel/kv";

const GITHUB_USERNAME = "austinmrobinson";
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
          totalContributions
        }
      }
    }
  }
`;

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: { contributionDays: ContributionDay[] }[];
          totalContributions: number;
        };
      };
    };
  };
  errors?: { message: string }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);

  // Validate year
  if (isNaN(year) || year < 2008 || year > new Date().getFullYear()) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }

  const cacheKey = `activity:github:${GITHUB_USERNAME}:${year}`;

  // Try cache first
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const cached = await kv.get<{ days: Record<string, number>; total: number }>(cacheKey);
      if (cached) {
        return Response.json({ success: true, data: cached, cached: true });
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  // Fetch from GitHub
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    return Response.json({ error: "GitHub token not configured" }, { status: 500 });
  }

  try {
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username: GITHUB_USERNAME, from, to },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const result: GitHubResponse = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const calendar = result.data.user.contributionsCollection.contributionCalendar;

    // Transform to day-keyed object
    const days: Record<string, number> = {};
    calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (day.contributionCount > 0) {
          days[day.date] = day.contributionCount;
        }
      });
    });

    const data = {
      days,
      total: calendar.totalContributions,
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
  } catch (error) {
    console.error("GitHub API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
