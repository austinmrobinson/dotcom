const METERS_TO_MILES = 1609.34;
const METERS_TO_KM = 1000;
const SECONDS_PER_MINUTE = 60;

export function formatDistance(meters: number): string {
  const miles = meters / METERS_TO_MILES;
  if (miles >= 0.1) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${Math.round(meters)} m`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / SECONDS_PER_MINUTE);
  const secs = seconds % SECONDS_PER_MINUTE;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatPaceFromSpeed(averageSpeedMps: number): string | null {
  if (!averageSpeedMps || averageSpeedMps <= 0) {
    return null;
  }

  const secondsPerMile = METERS_TO_MILES / averageSpeedMps;
  const minutes = Math.floor(secondsPerMile / SECONDS_PER_MINUTE);
  const seconds = Math.round(secondsPerMile % SECONDS_PER_MINUTE);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatPacePerKm(
  elapsedSeconds: number,
  distanceMeters: number
): string {
  if (distanceMeters <= 0) {
    return "—";
  }

  const paceSeconds = (elapsedSeconds / distanceMeters) * METERS_TO_KM;
  const minutes = Math.floor(paceSeconds / SECONDS_PER_MINUTE);
  const seconds = Math.round(paceSeconds % SECONDS_PER_MINUTE);
  return `${minutes}:${String(seconds).padStart(2, "0")}/km`;
}

export function formatShortDate(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateLong(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
