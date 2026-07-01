import type { RunRaceSummary } from "../types";
import { Text } from "@/app/components/text";
import { RaceBibCard } from "./RaceBibCard";

interface RaceBibWallProps {
  races: RunRaceSummary[];
}

export function RaceBibWall({ races }: RaceBibWallProps) {
  if (races.length === 0) {
    return (
      <Text className="text-pretty">
        No races configured yet. Add races in your run data config.
      </Text>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {races.map((race) => (
        <RaceBibCard key={race.id} race={race} />
      ))}
    </div>
  );
}
