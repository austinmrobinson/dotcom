"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState } from "react";
import { Clock, Grid } from "react-feather";
import WorkTimeline from "../components/workTimeline";
import WorkGrid from "../components/workGrid";
import { AnimatePresence, motion } from "framer-motion";

export default function WorkView({ companyPosts, postsByYear }) {
  const [value, setValue] = useState("grid");
  const [focused, setFocused] = useState(null);

  return (
    <div className="flex flex-col">
      <ToggleGroup.Root
        className="self-end flex items-center justify-center h-8 p-[2px] rounded-[3px] bg-yellow-1050/10 dark:bg-yellow-50/10"
        type="single"
        value={value}
        onValueChange={(value) => {
          if (value) setValue(value);
        }}
        aria-label="Post View Type"
        onMouseLeave={() => setFocused(null)}
      >
        <ToggleGroup.Item
          className={`${
            value === "grid" ? "text-yellow-1050 dark:text-yellow-50" : ""
          } relative flex items-center justify-center h-7 w-7 rounded-[3px] transition-colors duration-300 hover:text-yellow-1050 dark:hover:text-yellow-50`}
          value="grid"
          onFocus={() => setFocused("grid")}
          onMouseEnter={() => setFocused("grid")}
          aria-label="Grid View"
        >
          <Grid size="16" className="z-10" />
          <AnimatePresence>
            {focused === "grid" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                }}
                className="absolute bg-yellow-1050/605 dark:bg-yellow-50/5 inset-0 rounded-[3px] h-7 w-7 z-0"
                layoutId="highlight"
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {value === "grid" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                }}
                className="absolute bg-yellow-50 shadow dark:bg-yellow-1050/90 inset-0 rounded-[3px] h-7 w-7 -z-5"
                layoutId="active"
              />
            ) : null}
          </AnimatePresence>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          className={`${
            value === "timeline" ? "text-yellow-1050 dark:text-yellow-50" : ""
          } relative flex items-center justify-center h-7 w-7 rounded-[3px] transition-colors duration-300 hover:text-yellow-1050 dark:hover:text-yellow-50`}
          value="timeline"
          onFocus={() => setFocused("timeline")}
          onMouseEnter={() => setFocused("timeline")}
          aria-label="Timeline View"
        >
          <Clock size="16" className="z-10" />
          <AnimatePresence>
            {focused === "timeline" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                }}
                className="absolute bg-yellow-1050/605 dark:bg-yellow-50/5 inset-0 rounded-[3px] h-7 w-7 z-0"
                layoutId="highlight"
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {value === "timeline" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                }}
                className="absolute bg-yellow-50 shadow dark:bg-yellow-1050/90 inset-0 rounded-[3px] h-7 w-7 -z-5"
                layoutId="active"
              />
            ) : null}
          </AnimatePresence>
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <AnimatePresence>
        {value === "grid" ? (
          <WorkGrid items={companyPosts} />
        ) : (
          <WorkTimeline items={postsByYear} />
        )}
      </AnimatePresence>
    </div>
  );
}
