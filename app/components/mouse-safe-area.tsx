"use client";

import * as React from "react";
import { useMousePosition } from "@/app/hooks/use-mouse-position";

interface MouseSafeAreaProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export function MouseSafeArea({ parentRef }: MouseSafeAreaProps) {
  const [mouseX, mouseY] = useMousePosition();
  const parentRect = parentRef.current?.getBoundingClientRect();

  if (!parentRect) return null;

  const { left: targetLeft, top: targetTop, height: targetHeight } = parentRect;
  const gapWidth = targetLeft - mouseX;

  if (gapWidth <= 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: targetTop,
        left: mouseX,
        width: gapWidth,
        height: targetHeight,
        clipPath: `polygon(0% ${(100 * (mouseY - targetTop)) / targetHeight}%, 100% 0%, 100% 100%)`,
        pointerEvents: "none",
      }}
    />
  );
}
