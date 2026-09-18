import type { Metadata } from "next";
import TopOfPage from "@/app/components/topOfPage";
import { Text } from "@/app/components/text";
import { listRunActivities } from "@/app/features/run/lib/run-service";
import { ActivityTimeline } from "@/app/features/run/components/ActivityTimeline";
import { formatTotalDistance } from "@/app/features/run/lib/format";

export const metadata: Metadata = {
  title: "Run",
  description: "All-time running activities",
};

export default async function RunPage() {
  const { activities, nextCursor, totalDistanceMeters, totalCount } =
    await listRunActivities({ limit: 50 });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 sm:gap-12">
      <div className="flex flex-col gap-4">
        <TopOfPage back="/" title="Run">
          <Text className="text-pretty">
            A timeline of every run — all time, newest first.
          </Text>
        </TopOfPage>

        {totalCount > 0 && (
          <p className="font-heading text-3xl sm:text-4xl tracking-tight tabular-nums text-foreground">
            {formatTotalDistance(totalDistanceMeters)}
          </p>
        )}
      </div>

      <ActivityTimeline
        initialActivities={activities}
        initialCursor={nextCursor}
      />
    </div>
  );
}
