"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Text } from "@/app/components/text";
import type { RunActivity } from "../types";
import { formatActivityForTimeline } from "../lib/format-activity";
import { ActivityTimelineItem } from "./ActivityTimelineItem";

interface ActivityTimelineProps {
  initialActivities: RunActivity[];
  initialCursor: string | null;
}

export function ActivityTimeline({
  initialActivities,
  initialCursor,
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    if (!cursor || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/run/activities?cursor=${encodeURIComponent(cursor)}&limit=50`
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Failed to load activities");
      }

      setActivities((current) => [...current, ...result.data.activities]);
      setCursor(result.data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setActivities(initialActivities);
    setCursor(initialCursor);
  }, [initialActivities, initialCursor]);

  if (activities.length === 0) {
    return (
      <Text className="text-pretty">
        No activities yet. Connect Strava to sync your running history.
      </Text>
    );
  }

  return (
    <div className="flex flex-col">
      <div>
        {activities.map((activity) => (
          <ActivityTimelineItem
            key={activity.id}
            activity={formatActivityForTimeline(activity)}
          />
        ))}
      </div>

      {error && <Text className="text-destructive pt-4">{error}</Text>}

      {cursor && (
        <div className="pt-6">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
