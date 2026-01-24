import { ActivityType } from "@/app/types/activity";

// Scoring constants
export const SCORING = {
  GITHUB_COMMIT_POINTS: 1,
  STRAVA_MILES_PER_POINT: 3, // 3 miles = 1 point
  OSRS_HOURS_PER_POINT: 1, // 1 hour = 1 point
} as const;

/**
 * Calculate points from raw activity data
 */
export function calculatePoints(type: ActivityType, value: number): number {
  switch (type) {
    case "github":
      return value * SCORING.GITHUB_COMMIT_POINTS;
    case "strava":
      return value / SCORING.STRAVA_MILES_PER_POINT;
    case "osrs":
      return value / SCORING.OSRS_HOURS_PER_POINT;
    default:
      return 0;
  }
}

/**
 * Get available years for the year selector
 * Returns last 5 years including current year
 */
export function getAvailableYears(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}
