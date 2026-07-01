import type { RaceSegment } from "../types";
import { formatDuration } from "../lib/format";
import { Text } from "@/app/components/text";

interface SegmentComparisonTableProps {
  segments: RaceSegment[];
}

function formatDiffPercent(best: number, average: number): string {
  if (average <= 0) return "—";
  const diff = ((best - average) / average) * 100;
  const sign = diff <= 0 ? "" : "+";
  return `${sign}${diff.toFixed(1)}%`;
}

export function SegmentComparisonTable({
  segments,
}: SegmentComparisonTableProps) {
  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <Text contrast="high" weight="medium">
        Segment comparison
      </Text>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Segment</th>
              <th className="py-2 pr-4 font-medium">Best lap</th>
              <th className="py-2 pr-4 font-medium">Avg of 5</th>
              <th className="py-2 font-medium">Diff</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr key={segment.name} className="border-b border-border/60">
                <td className="py-2.5 pr-4">{segment.name}</td>
                <td className="py-2.5 pr-4 tabular-nums">
                  {formatDuration(segment.bestLapSeconds)}
                </td>
                <td className="py-2.5 pr-4 tabular-nums">
                  {formatDuration(segment.avgOfFiveSeconds)}
                </td>
                <td className="py-2.5 tabular-nums">
                  {formatDiffPercent(
                    segment.bestLapSeconds,
                    segment.avgOfFiveSeconds
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
