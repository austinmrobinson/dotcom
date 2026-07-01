import Link from "next/link";
import TopOfPage from "@/app/components/topOfPage";
import { Text } from "@/app/components/text";
import { listRunActivities, listRunRaces } from "@/app/features/run/lib/run-service";
import { ActivityTimeline } from "@/app/features/run/components/ActivityTimeline";
import { RaceBibWall } from "@/app/features/run/components/RaceBibWall";
import { formatDistance } from "@/app/features/run/lib/format";

export default async function RunPage() {
  const [{ activities, nextCursor }, races] = await Promise.all([
    listRunActivities({ limit: 10 }),
    listRunRaces(),
  ]);

  const totalDistanceMeters = activities.reduce(
    (sum, activity) => sum + activity.distanceMeters,
    0
  );

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      <TopOfPage title="Run">
        <Text className="text-pretty">
          All-time activities and race prep — a running log inspired by the
          simplicity of a lifetime timeline and a bib wall of races.
        </Text>
      </TopOfPage>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Text contrast="high" weight="medium">
              Recent activities
            </Text>
            {activities.length > 0 && (
              <Text className="tabular-nums">
                {activities.length} loaded
                {totalDistanceMeters > 0 &&
                  ` • ${formatDistance(totalDistanceMeters)}`}
              </Text>
            )}
          </div>
          <Link
            href="/run/activities"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        <ActivityTimeline
          initialActivities={activities}
          initialCursor={nextCursor}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <Text contrast="high" weight="medium">
            Races
          </Text>
          <Link
            href="/run/races"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Bib wall
          </Link>
        </div>
        <RaceBibWall races={races.slice(0, 3)} />
      </section>
    </div>
  );
}
