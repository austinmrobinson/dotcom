"use client";

import { useActivityData } from "@/app/hooks/useActivityData";
import { ActivityGrid } from "./ActivityGrid";
import { Text } from "@/app/components/text";
import { ActivityData } from "@/app/types/activity";

// Empty data structure for loading state
const EMPTY_DATA: ActivityData = {
  year: new Date().getFullYear(),
  days: {},
  totals: {
    github: 0,
    strava: 0,
    osrs: 0,
    overall: 0,
  },
};

export function ActivitySection() {
  const currentYear = new Date().getFullYear();
  const { data, loading, error } = useActivityData(currentYear);

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-overlay-subtle">
        <Text className="text-destructive">Failed to load activity data</Text>
        <Text className="text-text-secondary text-sm">{error.message}</Text>
      </div>
    );
  }

  // Always render ActivityGrid - pass empty data during loading
  return <ActivityGrid data={data || EMPTY_DATA} isLoading={loading} />;
}
