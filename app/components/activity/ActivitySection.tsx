"use client";

import { useActivityData } from "@/app/hooks/useActivityData";
import { ActivityGrid } from "./ActivityGrid";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Text } from "@/app/components/text";

function ActivityGridSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Day labels skeleton */}
      <div className="grid grid-cols-7 gap-4 px-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-4 mx-auto" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <Skeleton
                key={`${weekIndex}-${dayIndex}`}
                className="aspect-square rounded-full"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivitySection() {
  const currentYear = new Date().getFullYear();
  const { data, loading, error } = useActivityData(currentYear);

  if (loading) {
    return <ActivityGridSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-overlay-subtle">
        <Text className="text-destructive">Failed to load activity data</Text>
        <Text className="text-text-secondary text-sm">{error.message}</Text>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <ActivityGrid data={data} />;
}
