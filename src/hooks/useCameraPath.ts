"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref whose `.current` value is always the latest scroll progress
 * (0→1). This is safe to read inside R3F's `useFrame` without stale closures
 * or framer-motion sync issues.
 */
export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = maxScroll > 0 ? scrollTop / maxScroll : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial read
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progressRef;
}

/**
 * Zone definitions: maps a scroll range to a named panel ID.
 * Keeping this in a single place makes it trivial to adjust timing.
 */
export const PANEL_ZONES: Array<{ min: number; max: number; id: string }> = [
  { min: 0.08, max: 0.22, id: "hero" },
  { min: 0.28, max: 0.43, id: "project-1" },
  { min: 0.48, max: 0.63, id: "project-2" },
  { min: 0.68, max: 0.82, id: "project-3" },
  { min: 0.88, max: 1.00, id: "contact" },
];

export function getPanelForProgress(t: number): string | null {
  for (const zone of PANEL_ZONES) {
    if (t >= zone.min && t <= zone.max) return zone.id;
  }
  return null;
}