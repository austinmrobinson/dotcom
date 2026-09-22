const DEFAULT_STRAVA_ATHLETE_ID = "13603808";

export function getRunPageAthleteId(): string {
  return (
    process.env.STRAVA_ATHLETE_ID ??
    process.env.RUN_PAGE_USER_ID ??
    DEFAULT_STRAVA_ATHLETE_ID
  );
}
