export type ActivityType = "github" | "strava" | "osrs";

export interface GitHubActivity {
  commits: number;
  points: number;
}

export interface StravaActivity {
  miles: number;
  points: number;
}

export interface OSRSActivity {
  hours: number;
  points: number;
}

export interface DayActivity {
  date: string;
  github: GitHubActivity;
  strava: StravaActivity;
  osrs: OSRSActivity;
  totalPoints: number;
}

export interface ActivityTotals {
  github: number;
  strava: number;
  osrs: number;
  overall: number;
}

export interface ActivityData {
  year: number;
  days: Record<string, DayActivity>;
  totals: ActivityTotals;
}

export interface ActivityAPIResponse {
  success: boolean;
  data?: ActivityData;
  error?: string;
}

// Raw API response types
export interface GitHubContributionDay {
  contributionCount: number;
  date: string;
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export interface GitHubContributionsResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: GitHubContributionWeek[];
          totalContributions: number;
        };
      };
    };
  };
}

export interface StravaActivityResponse {
  id: number;
  type: string;
  start_date_local: string;
  distance: number; // in meters
}

export interface WOMSnapshotResponse {
  date: string;
  data: {
    computed: {
      ehp: {
        value: number;
      };
    };
  };
}
