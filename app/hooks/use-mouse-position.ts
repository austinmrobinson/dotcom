import { useState, useEffect, useCallback } from "react";

type MousePosition = [number, number];

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>([0, 0]);

  const updateMousePosition = useCallback((ev: MouseEvent) => {
    setMousePosition([ev.clientX, ev.clientY]);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [updateMousePosition]);

  return mousePosition;
}
