"use client";

import { useState } from "react";
import { RiTimeLine, RiGridLine } from "@remixicon/react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import WorkTimeline from "../components/workTimeline";
import WorkGrid from "../components/workGrid";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "../types";

interface PostsByYear {
  year: Date;
  items: Project[];
}

interface WorkViewProps {
  companyPosts: Project[];
  postsByYear: PostsByYear[];
}

export default function WorkView({ companyPosts, postsByYear }: WorkViewProps) {
  const [value, setValue] = useState(["grid"]);
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <ToggleGroup
        className="self-end flex items-center justify-center h-8 p-[2px] rounded-full bg-overlay-light"
        value={value}
        onValueChange={(newValue) => {
          if (newValue.length > 0) setValue(newValue);
        }}
        aria-label="Post View Type"
        onMouseLeave={() => setFocused(null)}
      >
        <ToggleGroupItem
          className="relative flex items-center justify-center size-7 rounded-full bg-transparent border-0 shadow-none"
          value="grid"
          onFocus={() => setFocused("grid")}
          onMouseEnter={() => setFocused("grid")}
          aria-label="Grid View"
        >
          <RiGridLine size={16} className="z-10" />
          <AnimatePresence>
            {focused === "grid" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                className="absolute bg-overlay-subtle inset-0 rounded-full size-7 z-0"
                layoutId="highlight"
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {value[0] === "grid" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                className="absolute bg-background shadow inset-0 rounded-full size-7 -z-5"
                layoutId="active"
              />
            ) : null}
          </AnimatePresence>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="relative flex items-center justify-center size-7 rounded-full bg-transparent border-0 shadow-none"
          value="timeline"
          onFocus={() => setFocused("timeline")}
          onMouseEnter={() => setFocused("timeline")}
          aria-label="Timeline View"
        >
          <RiTimeLine size={16} className="z-10" />
          <AnimatePresence>
            {focused === "timeline" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                className="absolute bg-overlay-subtle inset-0 rounded-full size-7 z-0"
                layoutId="highlight"
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {value[0] === "timeline" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                className="absolute bg-background shadow inset-0 rounded-full size-7 -z-5"
                layoutId="active"
              />
            ) : null}
          </AnimatePresence>
        </ToggleGroupItem>
      </ToggleGroup>
      <AnimatePresence>
        {value[0] === "grid" ? (
          <WorkGrid items={companyPosts} />
        ) : (
          <WorkTimeline items={postsByYear} />
        )}
      </AnimatePresence>
    </div>
  );
}
