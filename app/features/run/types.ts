export interface RunActivity {
  id: number;
  name: string;
  type: string;
  startDate: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  averageSpeed: number;
}

export interface ActivitiesPage {
  activities: RunActivity[];
  nextCursor: string | null;
  totalDistanceMeters: number;
  totalCount: number;
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
