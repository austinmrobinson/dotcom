import type { RaceDefinition } from "../types";

export const raceDefinitions: RaceDefinition[] = [
  {
    id: "boston-2024",
    name: "Boston Marathon",
    date: "2024-04-15",
    distanceLabel: "Marathon",
    distanceMeters: 42195,
    prepWeeks: 16,
    goal: {
      title: "Boston 2024",
      description:
        "Run under 2:35 and stay controlled through the Newton hills. Build weekly mileage to 55–60 with a long run peaking at 22 miles.",
    },
    checkpoints: [
      { distanceMeters: 5000, elapsedSeconds: 1080, label: "5K" },
      { distanceMeters: 10000, elapsedSeconds: 2160, label: "10K" },
      { distanceMeters: 21097, elapsedSeconds: 4620, label: "Half" },
      { distanceMeters: 30000, elapsedSeconds: 6480, label: "30K" },
      { distanceMeters: 42195, elapsedSeconds: 9204, label: "Finish" },
    ],
    segments: [
      { name: "Mile 1", bestLapSeconds: 348, avgOfFiveSeconds: 355 },
      { name: "Mile 2", bestLapSeconds: 351, avgOfFiveSeconds: 356 },
      { name: "Mile 3", bestLapSeconds: 354, avgOfFiveSeconds: 358 },
    ],
  },
  {
    id: "austin-2023",
    name: "Austin Marathon",
    date: "2023-02-19",
    distanceLabel: "Marathon",
    distanceMeters: 42195,
    prepWeeks: 14,
    goal: {
      description:
        "First marathon — finish strong and negative split the second half if possible.",
    },
    checkpoints: [
      { distanceMeters: 5000, elapsedSeconds: 1320, label: "5K" },
      { distanceMeters: 21097, elapsedSeconds: 5580, label: "Half" },
      { distanceMeters: 42195, elapsedSeconds: 11400, label: "Finish" },
    ],
  },
  {
    id: "houston-half-2024",
    name: "Houston Half Marathon",
    date: "2024-01-14",
    distanceLabel: "Half Marathon",
    distanceMeters: 21097,
    prepWeeks: 10,
    goal: {
      description: "Break 1:25 on a flat, fast course.",
    },
  },
];

export function getRaceById(raceId: string): RaceDefinition | undefined {
  return raceDefinitions.find((race) => race.id === raceId);
}

export function getAllRaces(): RaceDefinition[] {
  return [...raceDefinitions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
