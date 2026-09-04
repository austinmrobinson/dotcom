import Link from "next/link";
import TopOfPage from "@/app/components/topOfPage";
import { Text } from "@/app/components/text";
import { GoalBlockquote } from "./GoalBlockquote";
import { RaceCheckpointChart } from "./RaceCheckpointChart";
import { RacePrepTimeline } from "./RacePrepTimeline";
import { SegmentComparisonTable } from "./SegmentComparisonTable";
import type { RacePrepData } from "../types";
import {
  formatDateLong,
  formatDistance,
  formatDuration,
} from "../lib/format";

interface RacePrepViewProps {
  data: RacePrepData;
}

export function RacePrepView({ data }: RacePrepViewProps) {
  const { race, goal, stats, activities, checkpoints, segments } = data;

  return (
    <div className="flex flex-col gap-10 sm:gap-12 max-w-3xl">
      <div className="flex flex-col gap-4">
        <TopOfPage back="/run/races" title={race.name}>
          <Text>
            {race.distanceLabel}
            {race.finishTimeSeconds != null &&
              ` • ${formatDuration(race.finishTimeSeconds)}`}
            {` • ${formatDateLong(race.date)}`}
          </Text>
        </TopOfPage>

        {goal && <GoalBlockquote goal={goal} />}
      </div>

      <section className="flex flex-col gap-3">
        <Text contrast="high" weight="medium">
          Result
        </Text>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
          <div>
            <dt className="text-muted-foreground">Finish</dt>
            <dd className="text-foreground">
              {race.finishTimeSeconds != null
                ? formatDuration(race.finishTimeSeconds)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Distance</dt>
            <dd className="text-foreground">
              {race.distanceMeters != null
                ? formatDistance(race.distanceMeters)
                : race.distanceLabel}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Prep runs</dt>
            <dd className="text-foreground">{stats.totalActivities}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Prep miles</dt>
            <dd className="text-foreground">
              {formatDistance(stats.totalDistanceMeters)}
            </dd>
          </div>
        </dl>
      </section>

      {checkpoints.length > 0 && (
        <RaceCheckpointChart
          checkpoints={checkpoints}
          totalDistanceMeters={race.distanceMeters ?? checkpoints.at(-1)?.distanceMeters ?? 0}
        />
      )}

      {segments.length > 0 && <SegmentComparisonTable segments={segments} />}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Text contrast="high" weight="medium">
            Training block
          </Text>
          <Text className="tabular-nums">
            {formatDateLong(stats.prepStartDate)} – {formatDateLong(stats.prepEndDate)}
          </Text>
        </div>
        <RacePrepTimeline activities={activities} />
      </section>

      {race.stravaActivityId && (
        <Link
          href={`https://www.strava.com/activities/${race.stravaActivityId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/80 hover:text-foreground underline-offset-4 hover:underline w-fit"
        >
          View on Strava
        </Link>
      )}
    </div>
  );
}
