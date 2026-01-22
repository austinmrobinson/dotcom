"use client";

import { Heading } from "./text";
import { IconButton } from "./button";
import { ArrowUp } from "react-feather";
import { motion, useScroll, useTransform } from "framer-motion";

interface StickyHeaderProps {
  title: string;
}

export default function StickyHeader({ title }: StickyHeaderProps) {
  const { scrollY } = useScroll();

  // Show sticky header after scrolling past threshold
  const shouldShow = useTransform(scrollY, [160, 190], [0, 1]);

  // Hoist all useTransform hooks to the top level
  const headerY = useTransform(shouldShow, [0, 1], [-20, 0]);
  const contentY = useTransform(shouldShow, [0, 1], [20, 0]);
  const blur = useTransform(shouldShow, [0, 1], ["blur(4px)", "blur(0px)"]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      style={{
        opacity: shouldShow,
        y: headerY,
        borderBottomWidth: "0.5px",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-10 bg-neutral-100/80 backdrop-blur-md border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-800"
    >
      <div className="max-w-screen-sm px-6 mx-auto flex relative items-center">
        <motion.div
          className="flex items-center gap-1 py-3 grow min-w-0"
          style={{
            y: contentY,
            opacity: shouldShow,
            filter: blur,
          }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
        >
          <IconButton
            onClick={scrollToTop}
            variant="text"
            size="small"
            label="Scroll to top"
          >
            <ArrowUp size="16" />
          </IconButton>
          <Heading size="h3" className="truncate">
            {title}
          </Heading>
        </motion.div>
      </div>
    </motion.header>
  );
}
