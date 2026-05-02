// src/components/ui/HUD_Overlay.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoyageStore, Phase } from "@/store/useVoyageStore";

const HUD_PHASES: Phase[] =['PAD', 'VOID', 'PLANET', 'NEBULA', 'SINGULARITY'];

const PHASE_LABELS: Record<string, string> = {
  PAD: "Earth Launchpad",
  LIFTOFF: "Ascension",
  VOID: "Deep Space",
  PLANET: "Exoplanet Orbit",
  NEBULA: "Volumetric Nebula",
  SINGULARITY: "Event Horizon",
};

export default function HUD_Overlay() {
  const phase = useVoyageStore((state) => state.phase);
  
  const [showLabel, setShowLabel] = useState(false);
  const [labelText, setLabelText] = useState("");
  const labelTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentIndex = HUD_PHASES.indexOf(phase);
  const progressPct = currentIndex >= 0 ? (currentIndex / (HUD_PHASES.length - 1)) * 100 : 0;

  useEffect(() => {
    if (phase === 'LOADING') return;

    setLabelText(PHASE_LABELS[phase] || "");
    setShowLabel(true);
    
    if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    labelTimerRef.current = setTimeout(() => setShowLabel(false), 2500);

    return () => {
      if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    };
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">

      {/* ── Scroll hint (FIXED: Added frosted glass pill for 100% visibility) ── */}
      <AnimatePresence>
        {phase === 'PAD' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white drop-shadow-md font-bold">
              Scroll to launch
            </p>
            <svg width="16" height="24" viewBox="0 0 14 22" fill="none">
              <motion.path
                d="M7 1 L7 17 M3 13 L7 17 L11 13"
                stroke="rgba(255,255,255,1)"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ y:[0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vertical progress bar (right edge) ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-40 bg-white/10 relative overflow-hidden rounded-full">
          <div
            className="absolute top-0 left-0 w-full rounded-full transition-all duration-1000 ease-in-out"
            style={{
              height: `${progressPct}%`,
              background: "linear-gradient(to bottom, #38bdf8, #7c3aed, #fb923c)",
            }}
          />
        </div>

        <div className="flex flex-col gap-2 mt-1">
          {HUD_PHASES.map((p, index) => {
            const isActive = phase === p;
            const isPassed = currentIndex >= index;
            return (
              <div
                key={p}
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: isActive
                    ? "#38bdf8"
                    : isPassed
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.1)",
                  boxShadow: isActive ? "0 0 8px #38bdf8" : "none",
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Zone entry flash label (bottom-centre) ── */}
      <AnimatePresence>
        {showLabel && phase !== 'PAD' && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
              — {labelText} —
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}