"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/app/lib/utils";

const enterEase = [0.25, 0.46, 0.45, 0.94] as const;

interface HomeEnterSectionProps {
  index: number;
  children: React.ReactNode;
  className?: string;
}

export function HomeEnterSection({
  index,
  children,
  className,
}: HomeEnterSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: enterEase,
        delay: index * 0.08,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
