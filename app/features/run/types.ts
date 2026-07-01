export interface RunActivity {
  id: number;
  name: string;
  type: string;
  startDate: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  averageSpeed: number;
}

export interface RunRaceSummary {
  id: string;
  name: string;
  date: string;
  distanceLabel: string;
  distanceMeters: number | null;
  finishTimeSeconds: number | null;
  stravaActivityId: number | null;
}

export interface RaceCheckpoint {
  distanceMeters: number;
  elapsedSeconds: number;
  label?: string;
}

export interface RaceSegment {
  name: string;
  bestLapSeconds: number;
  avgOfFiveSeconds: number;
}

export interface RaceGoal {
  title?: string;
  description: string;
}

export interface RaceDefinition {
  id: string;
  name: string;
  date: string;
  distanceLabel: string;
  distanceMeters?: number;
  stravaActivityId?: number;
  prepWeeks?: number;
  goal?: RaceGoal;
  checkpoints?: RaceCheckpoint[];
  segments?: RaceSegment[];
}

export interface RacePrepActivity {
  id: number;
  name: string;
  type: string;
  startDate: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  pacePerKmSeconds: number | null;
}

export interface RacePrepStats {
  totalActivities: number;
  totalDistanceMeters: number;
  totalMovingTimeSeconds: number;
  prepStartDate: string;
  prepEndDate: string;
}

export interface RacePrepData {
  race: RunRaceSummary;
  goal: RaceGoal | null;
  stats: RacePrepStats;
  activities: RacePrepActivity[];
  checkpoints: RaceCheckpoint[];
  segments: RaceSegment[];
}

export interface ActivitiesPage {
  activities: RunActivity[];
  nextCursor: string | null;
}

export interface TimelineActivityView {
  id: number;
  name: string;
  type: string;
  dateLabel: string;
  dateIso: string;
  distanceLabel: string;
  paceLabel: string | null;
}
