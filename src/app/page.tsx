// ─────────────────────────────────────────────────────────────
//  page.tsx  –  root page
//
//  Responsibilities:
//  1. Show Loader until assets are ready
//  2. Lock/unlock body scroll during loader
//  3. Instantiate the scroll engine (ONE place)
//  4. Pass progressRef down to Scene (no MotionValue)
//  5. Manage activeZone state for DataPanels
// ─────────────────────────────────────────────────────────────
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

import Loader      from "@/components/ui/Loader";
import HUD_Overlay from "@/components/ui/HUD_Overlay";
import DataPanels  from "@/components/ui/DataPanel";
import { useScrollEngine } from "@/hooks/useScrollEngine";

// Dynamically import Scene (Three.js must not run on server)
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

// ── Custom cursor ─────────────────────────────────────────────
function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0), my = useRef(0);
  const rx = useRef(0), ry = useRef(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; };
    window.addEventListener("mousemove", move);

    const tick = () => {
      // Instant dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx.current - 4}px, ${my.current - 4}px)`;
      }
      // Lagging ring
      rx.current += (mx.current - rx.current) * 0.1;
      ry.current += (my.current - ry.current) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx.current - 18}px, ${ry.current - 18}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-sky-400 pointer-events-none z-[9999]"
        style={{ willChange: "transform", mixBlendMode: "screen" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-sky-400/35 pointer-events-none z-[9998]"
        style={{ willChange: "transform" }}
      />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Page() {
  const [stage, setStage] = useState<"LOADING" | "VOYAGE">("LOADING");
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // THE single scroll engine – lives here, shared via ref
  const { progressRef } = useScrollEngine(0.055);

  // Lock scroll during loading
  useEffect(() => {
    if (stage === "LOADING") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      // Ensure we start at top when voyage begins
      window.scrollTo(0, 0);
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [stage]);

  const handleLoadComplete = useCallback(() => {
    setStage("VOYAGE");
  }, []);

  const handleZoneChange = useCallback((zone: string | null) => {
    setActiveZone(zone);
  }, []);

  return (
    <>
      {/* Custom cursor (outside AnimatePresence so it persists) */}
      <Cursor />

      {/* ── Loader ── */}
      <AnimatePresence>
        {stage === "LOADING" && (
          <Loader onComplete={handleLoadComplete} />
        )}
      </AnimatePresence>

      {/* ── Voyage ── */}
      {stage === "VOYAGE" && (
        <main
          className="relative w-full bg-black"
          style={{ height: "1000vh" }}  // 10 screens of scroll travel
        >
          {/* 3-D canvas – fixed behind everything */}
          <div className="fixed inset-0 z-0">
            <Scene
              progressRef={progressRef}
              onZoneChange={handleZoneChange}
            />
          </div>

          {/* Ambient HUD overlay (pointer-events: none) */}
          <HUD_Overlay />

          {/* Content panels (fade in per zone) */}
          <DataPanels activeZone={activeZone} />
        </main>
      )}
    </>
  );
}
