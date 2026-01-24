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
} from "@tabler/icons-react";

interface ActivityGridProps {
  data: ActivityData;
  isLoading?: boolean;
}

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

  // Generate 4 weeks for month view
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day);
      grid[day].push(date.toISOString().split("T")[0]);
    }
  }

  return grid;
}

/**
 * Get dot size based on activity value
 * Returns size in pixels: 4 (none), 6 (low), 10 (medium), 16 (high)
 */
function getDotSize(value: number, activityType: ActivityType): number {
  if (activityType === "github") {
    if (value === 0) return 4;
    if (value < 3) return 6;
    if (value < 6) return 10;
    return 16;
  } else if (activityType === "strava") {
    if (value === 0) return 4;
    if (value < 2) return 6;
    if (value < 5) return 10;
    return 16;
  } else {
    // OSRS hours
    if (value === 0) return 4;
    if (value < 1) return 6;
    if (value < 2) return 10;
    return 16;
  }
}

/**
 * Get dot opacity based on size
 */
function getDotOpacity(size: number): number {
  switch (size) {
    case 4: return 0.15;
    case 6: return 0.3;
    case 10: return 0.6;
    case 16: return 0.75;
    default: return 0.15;
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
    return <div className="h-[27px] flex items-center justify-center" />;
  }

  const value = day ? activityConfig.getValue(day) : 0;
  const size = getDotSize(value, selectedType);
  const opacity = getDotOpacity(size);

  const dotElement = (
    <div className="h-[27px] flex items-center justify-center">
      <div
        className="rounded-full bg-foreground transition-all"
        style={{
          width: `${size}px`,
          height: `${size}px`,
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

export function ActivityGrid({ data, isLoading = false }: ActivityGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => data.year);
  const [selectedType, setSelectedType] = useState<ActivityType>("github");

  const selectedConfig = ACTIVITY_TYPES.find(t => t.type === selectedType)!;

  // Check if we're on the current month (can't go into future)
  const now = new Date();
  const isAtCurrentPeriod = currentYear === now.getFullYear() && currentMonth === now.getMonth();

  // Debounce ref for gestures
  const lastNavigationTime = useRef<number>(0);

  // Generate month grid
  const grid = useMemo(() => {
    return generateMonthGrid(currentYear, currentMonth);
  }, [currentYear, currentMonth]);


  // Navigate to next/previous month
  const navigate = useCallback((direction: "next" | "prev") => {
    const timestamp = Date.now();
    // Debounce navigation to prevent rapid firing
    if (timestamp - lastNavigationTime.current < 300) return;
    lastNavigationTime.current = timestamp;

    const currentDate = new Date();

    if (direction === "next") {
      // Prevent going into future
      const nextMonth = currentMonth < 11 ? currentMonth + 1 : 0;
      const nextYear = currentMonth < 11 ? currentYear : currentYear + 1;
      if (nextYear > currentDate.getFullYear() ||
          (nextYear === currentDate.getFullYear() && nextMonth > currentDate.getMonth())) {
        return;
      }
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
  }, [currentMonth, currentYear]);

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

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <div ref={containerRef} className="select-none">
        {/* Card container */}
        <div className="rounded-3xl border border-black/12 overflow-hidden">
          {/* Activity type tabs */}
          <div className="flex bg-black/5">
            {ACTIVITY_TYPES.map((config, index) => {
              const isSelected = selectedType === config.type;
              const isFirst = index === 0;
              const isLast = index === ACTIVITY_TYPES.length - 1;

              // Build shadow styles (looks better with rounded corners than borders)
              const shadows: string[] = [];
              const selectedIndex = ACTIVITY_TYPES.findIndex(t => t.type === selectedType);

              if (isSelected) {
                // Active tabs: first gets right, last gets left, middle gets both
                if (isFirst) {
                  shadows.push("1px 0 0 0 rgba(0,0,0,0.12)");
                } else if (isLast) {
                  shadows.push("-1px 0 0 0 rgba(0,0,0,0.12)");
                } else {
                  shadows.push("1px 0 0 0 rgba(0,0,0,0.12)");
                  shadows.push("-1px 0 0 0 rgba(0,0,0,0.12)");
                }
              } else {
                // Inactive tabs need dividers between other inactive tabs
                // Right shadow: if active tab is to the left AND there's an inactive tab to the right
                if (selectedIndex < index && !isLast) {
                  shadows.push("1px 0 0 0 rgba(0,0,0,0.12)");
                }
                // Left shadow: if active tab is to the right AND there's an inactive tab to the left
                if (selectedIndex > index && !isFirst) {
                  shadows.push("-1px 0 0 0 rgba(0,0,0,0.12)");
                }
                // Bottom shadow for inactive tabs
                shadows.push("0 1px 0 0 rgba(0,0,0,0.12)");
              }

              const tabStyles: React.CSSProperties = {
                boxShadow: shadows.join(", ") || "none",
              };

              return (
                <button
                  key={config.type}
                  onClick={() => setSelectedType(config.type)}
                  className={cn(
                    "flex-1 flex flex-col gap-1 px-5 py-4 pb-2 transition-colors rounded-t-3xl",
                    isSelected
                      ? "bg-[#f4f4f4]"
                      : "hover:bg-black/5"
                  )}
                  style={tabStyles}
                >
                  <span className="text-sm text-black/60 font-medium text-left">
                    {config.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <div className="h-10 w-16 bg-black/10 rounded animate-pulse" />
                    ) : (
                      <span
                        className={cn(
                          "text-[38px] font-medium font-mono tabular-nums leading-none",
                          isSelected ? "text-black" : "text-black/60"
                        )}
                      >
                        {config.getTotalValue(data)}
                      </span>
                    )}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center ml-auto",
                        isSelected ? "bg-black/10" : "border border-black/10"
                      )}
                    >
                      <span className={isSelected ? "text-black" : "text-black/60"}>
                        {config.icon}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Grid section */}
          <div className="bg-[#f4f4f4]">
            {/* Day labels row - outside AnimatePresence to prevent re-render */}
            <div className="grid grid-cols-7 px-3 pt-6">
              {DAY_LABELS.map((label, index) => (
                <div
                  key={index}
                  className="h-[27px] text-sm text-black/45 font-medium flex items-center justify-center"
                >
                  {label}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentYear}-${currentMonth}-${selectedType}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="px-3"
              >
                {/* Activity grid - 7 columns for days */}
                <div className="grid grid-cols-7">
                  {isLoading ? (
                    // Skeleton grid - 6 weeks x 7 days
                    Array.from({ length: 42 }).map((_, i) => (
                      <div key={i} className="h-[27px] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black/10 animate-pulse" />
                      </div>
                    ))
                  ) : (
                    grid[0].map((_, weekIndex) =>
                      grid.map((dayRow, dayIndex) => (
                        <ActivityDot
                          key={`${weekIndex}-${dayIndex}`}
                          date={dayRow[weekIndex]}
                          day={dayRow[weekIndex] ? data.days[dayRow[weekIndex]] || null : null}
                          selectedType={selectedType}
                          activityConfig={selectedConfig}
                        />
                      ))
                    )
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom navigation */}
            <div className="flex items-center justify-center px-1.5 py-1.5 border-t border-black/12">
              <button
                onClick={() => navigate("prev")}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-black/60"
                aria-label="Previous"
              >
                <IconChevronLeft size={16} stroke={2} />
              </button>
              <span className="text-sm text-black/60 font-medium min-w-[100px] text-center">
                {MONTH_LABELS_FULL[currentMonth]} {currentYear}
              </span>
              <button
                onClick={() => navigate("next")}
                disabled={isAtCurrentPeriod}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isAtCurrentPeriod
                    ? "text-black/20 cursor-not-allowed"
                    : "text-black/60 hover:bg-black/5"
                )}
                aria-label="Next"
              >
                <IconChevronRight size={16} stroke={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  );
}
