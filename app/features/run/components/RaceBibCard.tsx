import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { RunRaceSummary } from "../types";
import { formatDateLong, formatDistance, formatDuration } from "../lib/format";

interface RaceBibCardProps {
  race: RunRaceSummary;
}

export function RaceBibCard({ race }: RaceBibCardProps) {
  return (
    <Link href={`/run/races/${race.id}`} className="group block h-full">
      <Card className="h-full transition-colors hover:bg-muted/30 py-5 gap-4">
        <CardHeader className="px-5 pb-0">
          <CardDescription className="tabular-nums uppercase tracking-wide text-xs">
            {formatDateLong(race.date)}
          </CardDescription>
          <CardTitle className="text-lg leading-snug">{race.name}</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pt-0">
          <div className="flex flex-wrap gap-x-3 gap-y-1 tabular-nums text-muted-foreground">
            <span>{race.distanceLabel}</span>
            {race.finishTimeSeconds != null && (
              <span>{formatDuration(race.finishTimeSeconds)}</span>
            )}
            {race.distanceMeters != null && (
              <span>{formatDistance(race.distanceMeters)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
