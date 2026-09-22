import {
  fetchAllRunActivities,
  getStravaAccessToken,
} from "@/app/features/run/lib/strava";
import { toRunActivity } from "@/app/features/run/lib/format-activity";
import type { ActivitiesPage, RunActivity } from "@/app/features/run/types";

function sortActivitiesNewestFirst(activities: RunActivity[]): RunActivity[] {
  return [...activities].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

async function getRunActivities(): Promise<RunActivity[]> {
  const accessToken = await getStravaAccessToken();
  if (!accessToken) {
    return [];
  }

  const raw = await fetchAllRunActivities(accessToken);
  return sortActivitiesNewestFirst(raw.map(toRunActivity));
}

export async function listRunActivities(options: {
  cursor?: string;
  limit?: number;
}): Promise<ActivitiesPage> {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);
  const activities = await getRunActivities();
  const totalDistanceMeters = activities.reduce(
    (sum, activity) => sum + activity.distanceMeters,
    0
  );

  let startIndex = 0;
  if (options.cursor) {
    const cursorIndex = activities.findIndex(
      (activity) => String(activity.id) === options.cursor
    );
    if (cursorIndex >= 0) {
      startIndex = cursorIndex + 1;
    }
  }

  const page = activities.slice(startIndex, startIndex + limit);
  const nextItem = activities[startIndex + limit];

  return {
    activities: page,
    nextCursor: nextItem ? String(nextItem.id) : null,
    totalDistanceMeters,
    totalCount: activities.length,
  };
}
