"use client";

import type { RaceCheckpoint } from "../types";
import { formatDuration, formatPacePerKm } from "../lib/format";
import { Text } from "@/app/components/text";

interface RaceCheckpointChartProps {
  checkpoints: RaceCheckpoint[];
  totalDistanceMeters: number;
}

export function RaceCheckpointChart({
  checkpoints,
  totalDistanceMeters,
}: RaceCheckpointChartProps) {
  if (checkpoints.length === 0) {
    return null;
  }

  const maxDistance = Math.max(
    totalDistanceMeters,
    ...checkpoints.map((checkpoint) => checkpoint.distanceMeters)
  );
  const maxElapsed = Math.max(
    ...checkpoints.map((checkpoint) => checkpoint.elapsedSeconds)
  );

  const width = 640;
  const height = 200;
  const padding = { top: 16, right: 16, bottom: 32, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = checkpoints.map((checkpoint) => {
    const x =
      padding.left +
      (checkpoint.distanceMeters / maxDistance) * chartWidth;
    const y =
      padding.top +
      chartHeight -
      (checkpoint.elapsedSeconds / maxElapsed) * chartHeight;
    return { ...checkpoint, x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="flex flex-col gap-3">
      <Text contrast="high" weight="medium">
        Race checkpoints
      </Text>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[320px] max-w-2xl text-muted-foreground"
          role="img"
          aria-label="Checkpoint pace chart"
        >
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="currentColor"
            strokeOpacity={0.2}
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            points={polyline}
          />
          {points.map((point) => (
            <g key={`${point.distanceMeters}-${point.elapsedSeconds}`}>
              <circle cx={point.x} cy={point.y} r={4} fill="currentColor" />
              {point.label && (
                <text
                  x={point.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-current text-[10px]"
                >
                  {point.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {checkpoints.map((checkpoint) => (
          <div
            key={`${checkpoint.distanceMeters}-${checkpoint.elapsedSeconds}`}
            className="flex justify-between gap-4 tabular-nums text-sm"
          >
            <span className="text-muted-foreground">
              {checkpoint.label ??
                `${Math.round(checkpoint.distanceMeters / 1000)}K`}
            </span>
            <span>{formatDuration(checkpoint.elapsedSeconds)}</span>
            <span>{formatPacePerKm(checkpoint.elapsedSeconds, checkpoint.distanceMeters)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
