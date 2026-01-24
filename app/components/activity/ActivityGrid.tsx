"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityData, DayActivity, ActivityType } from "@/app/types/activity";
import { cn } from "@/app/utils";
import {
  IconBrandGithub,
  IconRun,
  IconSword,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";

interface ActivityGridProps {
  data: ActivityData;
}

type ZoomLevel = "month" | "year";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_LABELS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ActivityTypeConfig {
  type: ActivityType;
  label: string;
  icon: React.ReactNode;
  getValue: (day: DayActivity) => number;
  formatValue: (value: number) => string;
  getTotalValue: (data: ActivityData) => number;
}

const ACTIVITY_TYPES: ActivityTypeConfig[] = [
  {
    type: "github",
    label: "Contributions",
    icon: <IconBrandGithub size={24} stroke={1.5} />,
    getValue: (day) => day.github.commits,
    formatValue: (v) => v.toString(),
    getTotalValue: (data) => {
      let total = 0;
      Object.values(data.days).forEach((day) => {
        total += day.github.commits;
      });
      return total;
    },
  },
  {
    type: "strava",
    label: "Miles",
    icon: <IconRun size={24} stroke={1.5} />,
    getValue: (day) => day.strava.miles,
    formatValue: (v) => Math.round(v).toString(),
    getTotalValue: (data) => {
      let total = 0;
      Object.values(data.days).forEach((day) => {
        total += day.strava.miles;
      });
      return Math.round(total);
    },
  },
  {
    type: "osrs",
    label: "Hours played",
    icon: <IconSword size={24} stroke={1.5} />,
    getValue: (day) => day.osrs.hours,
    formatValue: (v) => Math.round(v).toString(),
    getTotalValue: (data) => {
      let total = 0;
      Object.values(data.days).forEach((day) => {
        total += day.osrs.hours;
      });
      return Math.round(total);
    },
  },
];

/**
 * Generate dates for a specific month view (showing 6 weeks)
 */
function generateMonthGrid(year: number, month: number): (string | null)[][] {
  const grid: (string | null)[][] = Array.from({ length: 7 }, () => []);

  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1;

  const startDate = new Date(firstOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfWeek);

  // Generate 6 weeks to ensure we cover all month layouts
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day);
      grid[day].push(date.toISOString().split("T")[0]);
    }
  }

  return grid;
}

/**
 * Generate year grid with weeks as columns and days as rows
 */
function generateYearGrid(year: number): (string | null)[][] {
  const grid: (string | null)[][] = Array.from({ length: 7 }, () => []);

  const jan1 = new Date(year, 0, 1);
  const jan1DayOfWeek = jan1.getDay() === 0 ? 6 : jan1.getDay() - 1;

  const startDate = new Date(jan1);
  startDate.setDate(startDate.getDate() - jan1DayOfWeek);

  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day);

      if (date.getFullYear() === year) {
        grid[day].push(date.toISOString().split("T")[0]);
      } else {
        grid[day].push(null);
      }
    }
  }

  return grid;
}

/**
 * Get week positions where months start
 */
function getMonthPositions(grid: (string | null)[][]): { month: number; weekIndex: number }[] {
  const positions: { month: number; weekIndex: number }[] = [];
  let currentMonth = -1;

  grid[0].forEach((date, weekIndex) => {
    if (date) {
      const month = new Date(date + "T00:00:00").getMonth();
      if (month !== currentMonth) {
        currentMonth = month;
        positions.push({ month, weekIndex });
      }
    }
  });

  return positions;
}

/**
 * Get dot size and opacity based on activity value
 */
function getDotStyle(value: number, activityType: ActivityType): { scale: number; opacity: number } {
  // Different thresholds for different activity types
  if (activityType === "github") {
    if (value === 0) return { scale: 0.25, opacity: 0.15 };
    if (value < 3) return { scale: 0.4, opacity: 0.3 };
    if (value < 6) return { scale: 0.6, opacity: 0.5 };
    if (value < 10) return { scale: 0.8, opacity: 0.7 };
    return { scale: 1, opacity: 1 };
  } else if (activityType === "strava") {
    if (value === 0) return { scale: 0.25, opacity: 0.15 };
    if (value < 2) return { scale: 0.4, opacity: 0.3 };
    if (value < 5) return { scale: 0.6, opacity: 0.5 };
    if (value < 10) return { scale: 0.8, opacity: 0.7 };
    return { scale: 1, opacity: 1 };
  } else {
    // OSRS hours
    if (value === 0) return { scale: 0.25, opacity: 0.15 };
    if (value < 1) return { scale: 0.4, opacity: 0.3 };
    if (value < 2) return { scale: 0.6, opacity: 0.5 };
    if (value < 4) return { scale: 0.8, opacity: 0.7 };
    return { scale: 1, opacity: 1 };
  }
}

/**
 * Format date for tooltip display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

interface ActivityDotProps {
  date: string | null;
  day: DayActivity | null;
  selectedType: ActivityType;
  activityConfig: ActivityTypeConfig;
}

function ActivityDot({ date, day, selectedType, activityConfig }: ActivityDotProps) {
  if (!date) {
    return <div className="aspect-square" />;
  }

  const value = day ? activityConfig.getValue(day) : 0;
  const { scale, opacity } = getDotStyle(value, selectedType);

  const dotElement = (
    <div className="aspect-square flex items-center justify-center">
      <div
        className="rounded-full bg-foreground transition-all"
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          opacity,
        }}
      />
    </div>
  );

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        {dotElement}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={4}
          className={cn(
            "bg-foreground text-background",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "z-50 rounded-lg px-3 py-2 text-xs shadow-lg",
            "max-w-[200px]"
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium">{formatDate(date)}</span>
            {day && value > 0 ? (
              <div className="flex flex-col gap-0.5 text-background/80">
                {selectedType === "github" && day.github.commits > 0 && (
                  <span>{day.github.commits} commit{day.github.commits !== 1 ? "s" : ""}</span>
                )}
                {selectedType === "strava" && day.strava.miles > 0 && (
                  <span>{day.strava.miles.toFixed(1)} miles</span>
                )}
                {selectedType === "osrs" && day.osrs.hours > 0 && (
                  <span>{day.osrs.hours.toFixed(1)} hrs played</span>
                )}
              </div>
            ) : (
              <span className="text-background/60">No activity</span>
            )}
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export function ActivityGrid({ data }: ActivityGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("month");
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => data.year);
  const [selectedType, setSelectedType] = useState<ActivityType>("github");

  const selectedConfig = ACTIVITY_TYPES.find(t => t.type === selectedType)!;

  // Debounce refs for gestures
  const lastNavigationTime = useRef<number>(0);
  const initialPinchDistance = useRef<number | null>(null);

  // Generate appropriate grid based on zoom level
  const grid = useMemo(() => {
    if (zoomLevel === "month") {
      return generateMonthGrid(currentYear, currentMonth);
    }
    return generateYearGrid(currentYear);
  }, [zoomLevel, currentYear, currentMonth]);


  // Navigate to next/previous time period
  const navigate = useCallback((direction: "next" | "prev") => {
    const now = Date.now();
    // Debounce navigation to prevent rapid firing
    if (now - lastNavigationTime.current < 300) return;
    lastNavigationTime.current = now;

    if (zoomLevel === "month") {
      if (direction === "next") {
        if (currentMonth < 11) {
          setCurrentMonth(m => m + 1);
        } else {
          setCurrentMonth(0);
          setCurrentYear(y => y + 1);
        }
      } else {
        if (currentMonth > 0) {
          setCurrentMonth(m => m - 1);
        } else {
          setCurrentMonth(11);
          setCurrentYear(y => y - 1);
        }
      }
    } else {
      if (direction === "next") {
        setCurrentYear(y => y + 1);
      } else {
        setCurrentYear(y => y - 1);
      }
    }
  }, [zoomLevel, currentMonth]);

  // Handle pinch gesture
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const delta = currentDistance - initialPinchDistance.current;

      if (Math.abs(delta) > 40) {
        if (delta < 0 && zoomLevel === "month") {
          setZoomLevel("year");
          initialPinchDistance.current = null;
        } else if (delta > 0 && zoomLevel === "year") {
          setZoomLevel("month");
          initialPinchDistance.current = null;
        }
      }
    }
  }, [zoomLevel]);

  const handleTouchEnd = useCallback(() => {
    initialPinchDistance.current = null;
  }, []);

  // Handle wheel for horizontal scroll navigation
  const handleWheel = useCallback((e: WheelEvent) => {
    // Handle horizontal scroll (trackpad) or shift+scroll
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const delta = isHorizontal ? e.deltaX : (e.shiftKey ? e.deltaY : 0);

    if (Math.abs(delta) > 10) {
      e.preventDefault();
      navigate(delta > 0 ? "next" : "prev");
    }
  }, [navigate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <div ref={containerRef} className="flex flex-col gap-4 select-none">
        {/* Activity type tabs */}
        <div className="grid grid-cols-3 gap-0 rounded-xl bg-black/[0.06] p-1 overflow-hidden">
          {ACTIVITY_TYPES.map((config) => (
            <button
              key={config.type}
              onClick={() => setSelectedType(config.type)}
              className={cn(
                "flex items-center justify-between px-3 py-2 transition-colors rounded-lg",
                selectedType === config.type
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-text-secondary">{config.label}</span>
                <span className="text-2xl font-semibold tabular-nums">
                  {config.getTotalValue(data)}
                </span>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                selectedType === config.type ? "bg-black/[0.06]" : "bg-black/[0.04]"
              )}>
                {config.icon}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${zoomLevel}-${currentYear}-${currentMonth}-${selectedType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-1"
          >
            {/* Day labels row */}
            <div className="grid grid-cols-7 gap-2 mb-1">
              {DAY_LABELS.map((label, index) => (
                <div
                  key={index}
                  className="text-xs text-text-tertiary flex items-center justify-center"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Activity grid - 7 columns for days */}
            <div className="grid grid-cols-7 gap-2">
              {grid[0].map((_, weekIndex) =>
                grid.map((dayRow, dayIndex) => (
                  <ActivityDot
                    key={`${weekIndex}-${dayIndex}`}
                    date={dayRow[weekIndex]}
                    day={dayRow[weekIndex] ? data.days[dayRow[weekIndex]] || null : null}
                    selectedType={selectedType}
                    activityConfig={selectedConfig}
                  />
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("prev")}
              className="p-1 rounded-md hover:bg-overlay-subtle transition-colors text-text-secondary"
              aria-label="Previous"
            >
              <IconChevronLeft size={18} stroke={1.5} />
            </button>
            <span className="text-sm text-text-secondary font-medium min-w-[120px] text-center">
              {zoomLevel === "month"
                ? `${MONTH_LABELS_FULL[currentMonth]} ${currentYear}`
                : `${currentYear}`}
            </span>
            <button
              onClick={() => navigate("next")}
              className="p-1 rounded-md hover:bg-overlay-subtle transition-colors text-text-secondary"
              aria-label="Next"
            >
              <IconChevronRight size={18} stroke={1.5} />
            </button>
          </div>
          <button
            onClick={() => setZoomLevel(z => z === "month" ? "year" : "month")}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {zoomLevel === "month" ? "Month" : "Year"}
            <IconChevronDown size={16} stroke={1.5} />
          </button>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  );
}
