"use client";

import React, { useEffect, useRef } from "react";

export interface ScrollEngine {
  /** Latest SMOOTHED progress 0→1 – read this inside useFrame */
  progressRef: React.MutableRefObject<number>;
  /** Latest RAW (unsmoothed) progress 0→1 */
  rawRef: React.MutableRefObject<number>;
}

export function useScrollEngine(smoothing = 0.06): ScrollEngine {
  const rawRef = useRef(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // ── 1. Track raw scroll ──────────────────────────────────
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      rawRef.current = maxScroll > 0 ? scrollTop / maxScroll : 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialise immediately

    // ── 2. Smooth in rAF (independent of Three.js) ──────────
    //  Using a fixed lerp factor per frame gives cinematic smoothing
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.667, 3); // cap at 3×
      lastTime = now;

      // delta-compensated lerp
      const factor = 1 - Math.pow(1 - smoothing, delta);
      progressRef.current = lerp(progressRef.current, rawRef.current, factor);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [smoothing]);

  return { progressRef, rawRef };
}

// ─────────────────────────────────────────────────────────────
//  Zone helpers
// ─────────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  enter: number; // progress at which content starts to fade in
  exit: number;  // progress at which content fully fades out
}

/** All narrative zones along the scroll journey (0 → 1) */
export const ZONES: Zone[] =[
  { id: "launch",    enter: 0.00, exit: 0.14 }, // city → atmosphere
  { id: "void",      enter: 0.15, exit: 0.28 }, // "who I am"
  { id: "project-1", enter: 0.30, exit: 0.43 }, // planet 1
  { id: "skills",    enter: 0.45, exit: 0.54 }, // asteroid belt
  { id: "project-2", enter: 0.55, exit: 0.65 }, // nebula
  { id: "project-3", enter: 0.66, exit: 0.75 }, // nebula deeper
  { id: "experience",enter: 0.76, exit: 0.86 }, // black hole approach
  { id: "contact",   enter: 0.88, exit: 1.00 }, // deep space
];

export function getActiveZone(progress: number): string | null {
  for (const z of ZONES) {
    if (progress >= z.enter && progress <= z.exit) return z.id;
  }
  return null;
}

/** 0→1 alpha for a zone at current progress (fade in + fade out) */
export function zoneAlpha(zone: Zone, progress: number): number {
  const fadeDuration = 0.025;
  if (progress < zone.enter || progress > zone.exit) return 0;
  const fadeIn  = Math.min((progress - zone.enter) / fadeDuration, 1);
  const fadeOut = Math.min((zone.exit - progress)  / fadeDuration, 1);
  return Math.min(fadeIn, fadeOut);
}

export function getActiveMounts(progress: number): Set<string> {
  const mounts = new Set<string>();

  // Using overlapping ranges to ensure models mount slightly before they are seen 
  // and unmount slightly after passing, to prevent visual pop-in/pop-out.
  if (progress >= 0.00 && progress <= 0.16) mounts.add("city");
  if (progress >= 0.13 && progress <= 0.26) mounts.add("wormhole-1");
  if (progress >= 0.18 && progress <= 0.48) mounts.add("planet");
  if (progress >= 0.38 && progress <= 0.52) mounts.add("wormhole-2");
  if (progress >= 0.44 && progress <= 0.72) mounts.add("nebula");
  if (progress >= 0.58 && progress <= 0.78) mounts.add("crystals");
  if (progress >= 0.68 && progress <= 0.82) mounts.add("wormhole-3");
  if (progress >= 0.74 && progress <= 1.00) mounts.add("blackhole");

  return mounts;
}