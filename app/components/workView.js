"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState } from "react";
import { IconClock, IconLayoutGrid } from "@tabler/icons-react";
import WorkTimeline from "../components/workTimeline";
import WorkGrid from "../components/workGrid";
import { AnimatePresence, motion } from "framer-motion";

export default function WorkView({ companyPosts, postsByYear }) {
  const [value, setValue] = useState("grid");
  const [focused, setFocused] = useState(null);

  return (
    <div className="flex flex-col">
      <ToggleGroup.Root
        className="self-end flex items-center justify-center h-8 p-[2px] rounded-full bg-neutral-900/10 dark:bg-white/10"
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
            value === "grid" ? "text-neutral-900 dark:text-white" : ""
          } relative flex items-center justify-center h-7 w-7 rounded-full transition-colors duration-300 hover:text-neutral-900 dark:hover:text-white`}
          value="grid"
          onFocus={() => setFocused("grid")}
          onMouseEnter={() => setFocused("grid")}
          aria-label="Grid View"
        >
          <IconLayoutGrid size={16} stroke={1.5} className="z-10" />
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
                className="absolute bg-neutral-900/5 dark:bg-white/5 inset-0 rounded-full h-7 w-7 z-0"
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
                className="absolute bg-white shadow dark:bg-neutral-700 inset-0 rounded-full h-7 w-7 -z-5"
                layoutId="active"
              />
            ) : null}
          </AnimatePresence>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          className={`${
            value === "timeline" ? "text-neutral-900 dark:text-white" : ""
          } relative flex items-center justify-center h-7 w-7 rounded-full transition-colors duration-300 hover:text-neutral-900 dark:hover:text-white`}
          value="timeline"
          onFocus={() => setFocused("timeline")}
          onMouseEnter={() => setFocused("timeline")}
          aria-label="Timeline View"
        >
          <IconClock size={16} stroke={1.5} className="z-10" />
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
                className="absolute bg-neutral-900/5 dark:bg-white/5 inset-0 rounded-full h-7 w-7 z-0"
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
                className="absolute bg-white shadow dark:bg-neutral-700 inset-0 rounded-full h-7 w-7 -z-5"
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
