import {
  fetchAllRunActivities,
  fetchStravaActivity,
  getStravaAccessToken,
  type StravaActivityRaw,
} from "@/app/features/run/lib/strava";
import {
  toRunActivity,
  mapActivitiesToRacePrep,
} from "@/app/features/run/lib/format-activity";
import { buildRacePrepWindow, isWithinPrepWindow } from "@/app/features/run/lib/prep-window";
import { getRaceById, getAllRaces } from "@/app/features/run/data/races";
import type {
  ActivitiesPage,
  RacePrepData,
  RunActivity,
  RunRaceSummary,
} from "@/app/features/run/types";

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

async function resolveRaceSummary(
  race: ReturnType<typeof getRaceById>,
  activities: RunActivity[],
  accessToken: string | null
): Promise<RunRaceSummary> {
  if (!race) {
    throw new Error("Race not found");
  }

  let finishTimeSeconds: number | null = null;
  let distanceMeters: number | null = race.distanceMeters ?? null;
  let stravaActivityId = race.stravaActivityId ?? null;

  if (race.stravaActivityId && accessToken) {
    const activity = await fetchStravaActivity(accessToken, race.stravaActivityId);
    if (activity) {
      finishTimeSeconds = activity.moving_time;
      distanceMeters = activity.distance;
      stravaActivityId = activity.id;
    }
  } else {
    const raceDay = race.date;
    const raceActivity = activities.find((activity) =>
      activity.startDate.startsWith(raceDay)
    );
    if (raceActivity) {
      finishTimeSeconds = raceActivity.movingTimeSeconds;
      distanceMeters = raceActivity.distanceMeters;
      stravaActivityId = raceActivity.id;
    }
  }

  return {
    id: race.id,
    name: race.name,
    date: race.date,
    distanceLabel: race.distanceLabel,
    distanceMeters,
    finishTimeSeconds,
    stravaActivityId,
  };
}

export async function listRunActivities(options: {
  cursor?: string;
  limit?: number;
}): Promise<ActivitiesPage> {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);
  const activities = await getRunActivities();

  let startIndex = 0;
  if (options.cursor) {
    const cursorIndex = activities.findIndex(
      (activity) => activity.startDate === options.cursor
    );
    if (cursorIndex >= 0) {
      startIndex = cursorIndex + 1;
    }
  }

  const page = activities.slice(startIndex, startIndex + limit);
  const nextItem = activities[startIndex + limit];

  return {
    activities: page,
    nextCursor: nextItem?.startDate ?? null,
  };
}

export async function listRunRaces(): Promise<RunRaceSummary[]> {
  const accessToken = await getStravaAccessToken();
  const activities = await getRunActivities();
  const races = getAllRaces();

  return Promise.all(
    races.map((race) => resolveRaceSummary(race, activities, accessToken))
  );
}

export async function getRunRacePrep(raceId: string): Promise<RacePrepData | null> {
  const race = getRaceById(raceId);
  if (!race) {
    return null;
  }

  const accessToken = await getStravaAccessToken();
  const allActivities = await getRunActivities();
  const raceSummary = await resolveRaceSummary(race, allActivities, accessToken);
  const window = buildRacePrepWindow(race);

  const prepActivities = allActivities.filter((activity) => {
    if (raceSummary.stravaActivityId && activity.id === raceSummary.stravaActivityId) {
      return false;
    }
    return isWithinPrepWindow(activity.startDate, window);
  });

  const mapped = mapActivitiesToRacePrep(prepActivities);
  const totalDistanceMeters = mapped.reduce(
    (sum, activity) => sum + activity.distanceMeters,
    0
  );
  const totalMovingTimeSeconds = mapped.reduce(
    (sum, activity) => sum + activity.movingTimeSeconds,
    0
  );

  return {
    race: raceSummary,
    goal: race.goal ?? null,
    stats: {
      totalActivities: mapped.length,
      totalDistanceMeters,
      totalMovingTimeSeconds,
      prepStartDate: window.startIso,
      prepEndDate: window.endIso,
    },
    activities: mapped.reverse(),
    checkpoints: race.checkpoints ?? [],
    segments: race.segments ?? [],
  };
}

export function mapStravaActivities(raw: StravaActivityRaw[]): RunActivity[] {
  return sortActivitiesNewestFirst(raw.map(toRunActivity));
}
