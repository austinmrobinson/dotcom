"use client";

import { Badge } from "@/app/components/ui/badge";
import { Text } from "@/app/components/text";
import type { TimelineActivityView } from "../types";

interface ActivityTimelineItemProps {
  activity: TimelineActivityView;
}

export function ActivityTimelineItem({ activity }: ActivityTimelineItemProps) {
  return (
    <article className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-1 py-4 border-t border-border first:border-t-0">
      <time
        dateTime={activity.dateIso}
        className="tabular-nums text-muted-foreground pt-0.5"
      >
        {activity.dateLabel}
      </time>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Text as="span" contrast="high" className="truncate">
            {activity.name}
          </Text>
          <Badge variant="outline">{activity.type}</Badge>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 tabular-nums text-muted-foreground">
          <span>{activity.distanceLabel}</span>
          {activity.paceLabel && <span>{activity.paceLabel} /mi</span>}
        </div>
      </div>
    </article>
  );
}
