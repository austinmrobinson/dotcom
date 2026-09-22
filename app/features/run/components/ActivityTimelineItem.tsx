"use client";

import type { TimelineActivityView } from "../types";

interface ActivityTimelineItemProps {
  activity: TimelineActivityView;
}

export function ActivityTimelineItem({ activity }: ActivityTimelineItemProps) {
  return (
    <article className="grid grid-cols-[4.75rem_1fr_auto] sm:grid-cols-[5.5rem_1fr_auto] items-baseline gap-x-4 py-2.5 border-t border-border/70 first:border-t-0">
      <time
        dateTime={activity.dateIso}
        className="tabular-nums text-muted-foreground"
      >
        {activity.dateLabel}
      </time>
      <p className="min-w-0 truncate text-foreground">{activity.name}</p>
      <p className="tabular-nums text-foreground whitespace-nowrap">
        {activity.distanceLabel}
      </p>
    </article>
  );
}
