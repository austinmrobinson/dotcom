import type { RunActivity, TimelineActivityView } from "../types";
import {
  formatDistance,
  formatPaceFromSpeed,
  formatTimelineDate,
} from "./format";

export function toRunActivity(activity: {
  id: number;
  name: string;
  type: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  average_speed: number;
}): RunActivity {
  return {
    id: activity.id,
    name: activity.name,
    type: activity.type,
    startDate: activity.start_date_local,
    distanceMeters: activity.distance,
    movingTimeSeconds: activity.moving_time,
    averageSpeed: activity.average_speed,
  };
}

export function formatActivityForTimeline(
  activity: RunActivity
): TimelineActivityView {
  return {
    id: activity.id,
    name: activity.name,
    type: activity.type,
    dateLabel: formatTimelineDate(activity.startDate),
    dateIso: activity.startDate,
    distanceLabel: formatDistance(activity.distanceMeters),
    paceLabel: formatPaceFromSpeed(activity.averageSpeed),
  };
}
