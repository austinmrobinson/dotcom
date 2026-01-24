"use client";

import { useState, useEffect, useCallback } from "react";
import { ActivityData } from "@/app/types/activity";

interface UseActivityDataResult {
  data: ActivityData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useActivityData(year: number): UseActivityDataResult {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/activity?year=${year}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch activity data");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch activity data");
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
