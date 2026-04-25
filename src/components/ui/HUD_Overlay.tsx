// ─────────────────────────────────────────────────────────────
//  HUD_Overlay  –  minimal ambient overlay
//  Intentionally subtle – the universe is the hero.
//  No cockpit chrome, no robot panels.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZONES } from "@/hooks/useScrollEngine";
import { portfolioData } from "@/data/portfolio";

// Zone labels shown as a small indicator when entering a zone
const ZONE_LABELS: Record<string, string> = {
  launch:      "Launching from Earth",
  void:        "Open Space",
  "project-1": "Nebula UI",
  skills:      "Systems Online",
  "project-2": "Orbit Engine",
  "project-3": "Singularity API",
  experience:  "Mission Log",
  contact:     "Deep Space",
};

export default function HUD_Overlay() {
  const [progress, setProgress]       = useState(0);
  const [activeZone, setActiveZone]   = useState<string | null>(null);
  const [showLabel, setShowLabel]     = useState(false);
  const [labelText, setLabelText]     = useState("");
  const labelTimerRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef                        = useRef<number>(0);
  const lastZoneRef                   = useRef<string | null>(null);

  // Track scroll progress for the dots
  useEffect(() => {
    const tick = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const p = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setProgress(p);

      // Determine zone from progress
      let zone: string | null = null;
      for (const z of ZONES) {
        if (p >= z.enter && p <= z.exit) { zone = z.id; break; }
      }
      setActiveZone(zone);

      // Flash label on zone entry
      if (zone && zone !== lastZoneRef.current) {
        lastZoneRef.current = zone;
        setLabelText(ZONE_LABELS[zone] ?? "");
        setShowLabel(true);
        if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
        labelTimerRef.current = setTimeout(() => setShowLabel(false), 2200);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    };
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">

      {/* ── Name watermark  (top-left) ── */}
      <div className="absolute top-7 left-8">
        <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/18">
          {portfolioData.name}
        </p>
      </div>

      {/* ── Scroll hint (only at very top) ── */}
      <AnimatePresence>
        {progress < 0.03 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
              Scroll to launch
            </p>
            {/* Animated chevron */}
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
              <motion.path
                d="M7 1 L7 17 M3 13 L7 17 L11 13"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vertical progress bar (right edge) ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-40 bg-white/6 relative overflow-hidden rounded-full">
          <div
            className="absolute top-0 left-0 w-full rounded-full transition-none"
            style={{
              height: `${pct}%`,
              background: "linear-gradient(to bottom, #38bdf8, #7c3aed, #fb923c)",
            }}
          />
        </div>

        {/* Zone dots */}
        <div className="flex flex-col gap-2 mt-1">
          {ZONES.map((z) => {
            const isActive  = activeZone === z.id;
            const isPassed  = progress > z.exit;
            return (
              <div
                key={z.id}
                className="w-1 h-1 rounded-full transition-all duration-500"
                style={{
                  background: isActive
                    ? "#38bdf8"
                    : isPassed
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: isActive ? "0 0 6px #38bdf8" : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Zone entry flash label (bottom-centre) ── */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
              — {labelText} —
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
