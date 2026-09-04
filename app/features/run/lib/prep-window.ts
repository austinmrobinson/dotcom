import type { RaceDefinition } from "../types";

const DEFAULT_PREP_WEEKS = 16;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export interface PrepWindow {
  startDate: Date;
  endDate: Date;
  startIso: string;
  endIso: string;
}

export function buildRacePrepWindow(race: RaceDefinition): PrepWindow {
  const endDate = new Date(`${race.date}T23:59:59`);
  const prepWeeks = race.prepWeeks ?? DEFAULT_PREP_WEEKS;
  const startDate = new Date(endDate.getTime() - prepWeeks * MS_PER_WEEK);

  return {
    startDate,
    endDate,
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
  };
}

export function isWithinPrepWindow(
  activityDateIso: string,
  window: PrepWindow
): boolean {
  const activityDate = new Date(activityDateIso);
  return activityDate >= window.startDate && activityDate < window.endDate;
}
