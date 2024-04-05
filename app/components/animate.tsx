"use client";

import { motion } from "framer-motion";

interface AnimateProps {
  children: React.ReactNode;
  className?: string;
}

export default function Animate({ children, className }: AnimateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
