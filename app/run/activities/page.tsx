import TopOfPage from "@/app/components/topOfPage";
import { Text } from "@/app/components/text";
import { listRunActivities } from "@/app/features/run/lib/run-service";
import { ActivityTimeline } from "@/app/features/run/components/ActivityTimeline";

export const metadata = {
  title: "Activities",
};

export default async function RunActivitiesPage() {
  const { activities, nextCursor } = await listRunActivities({ limit: 50 });

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <TopOfPage back="/run" title="Activities">
        <Text className="text-pretty">
          All-time running activities, newest first.
        </Text>
      </TopOfPage>

      <ActivityTimeline
        initialActivities={activities}
        initialCursor={nextCursor}
      />
    </div>
  );
}
