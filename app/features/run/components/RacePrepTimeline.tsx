import { Text } from "@/app/components/text";
import type { RacePrepActivity } from "../types";
import {
  formatDistance,
  formatDuration,
  formatPacePerKm,
  formatShortDate,
} from "../lib/format";

interface RacePrepTimelineProps {
  activities: RacePrepActivity[];
}

export function RacePrepTimeline({ activities }: RacePrepTimelineProps) {
  if (activities.length === 0) {
    return (
      <Text className="text-pretty">
        No prep activities found in this training window.
      </Text>
    );
  }

  return (
    <div className="flex flex-col">
      {activities.map((activity) => (
        <article
          key={activity.id}
          className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-1 py-4 border-t border-border first:border-t-0"
        >
          <time
            dateTime={activity.startDate}
            className="tabular-nums text-muted-foreground pt-0.5"
          >
            {formatShortDate(activity.startDate)}
          </time>
          <div className="flex flex-col gap-1 min-w-0">
            <Text as="span" contrast="high" className="truncate">
              {activity.name}
            </Text>
            <div className="flex flex-wrap gap-x-3 gap-y-1 tabular-nums text-muted-foreground">
              <span>{formatDistance(activity.distanceMeters)}</span>
              <span>{formatDuration(activity.movingTimeSeconds)}</span>
              {activity.pacePerKmSeconds != null && (
                <span>
                  {formatPacePerKm(
                    activity.movingTimeSeconds,
                    activity.distanceMeters
                  )}
                </span>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
