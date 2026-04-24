"use client";

import React, { useEffect, useState, useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { PANEL_ZONES } from "@/hooks/useCameraPath";

const ZONE_LABELS: Record<string, string> = {
  hero: "SECTOR_01 / ARCHITECT",
  "project-1": "SECTOR_02 / NEBULA_UI",
  "project-2": "SECTOR_03 / ORBIT_ENGINE",
  "project-3": "SECTOR_04 / SINGULARITY_API",
  contact: "SECTOR_05 / UPLINK",
};

export default function HUD_Overlay() {
  const [progress, setProgress] = useState(0);
  const [zoneLabel, setZoneLabel] = useState("SECTOR_00 / LAUNCHPAD");
  const [coords, setCoords] = useState({ x: "000.00", y: "000.00" });
  const frameRef = useRef<number>(0);

  // Read scroll progress in a rAF loop — smooth and cheap
  useEffect(() => {
    const tick = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setProgress(p);

      // Determine active zone
      let label = "SECTOR_00 / LAUNCHPAD";
      for (const zone of PANEL_ZONES) {
        if (p >= zone.min && p <= zone.max) {
          label = ZONE_LABELS[zone.id] ?? label;
          break;
        }
      }
      setZoneLabel(label);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Mouse coords display
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const nx = ((e.clientX / window.innerWidth) * 200 - 100).toFixed(2);
      const ny = ((e.clientY / window.innerHeight) * 200 - 100).toFixed(2);
      setCoords({
        x: nx.padStart(7, " "),
        y: ny.padStart(7, " "),
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* ── Cockpit vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* ── Corner brackets ── */}
      {[
        "top-8 left-8 border-t border-l",
        "top-8 right-8 border-t border-r",
        "bottom-8 left-8 border-b border-l",
        "bottom-8 right-8 border-b border-r",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-10 h-10 ${cls} border-cyan-500/40 hud-flicker`}
        />
      ))}

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-3 border-b border-white/5">
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-500/50 hud-flicker">
          {portfolioData.name} // {portfolioData.role}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-500/40">
          {zoneLabel}
        </span>
        <span className="font-mono text-[9px] text-white/20 tabular-nums">
          T+{String(pct).padStart(3, "0")}%
        </span>
      </div>

      {/* ── Vertical scroll progress bar (left side) ── */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest [writing-mode:vertical-rl]">
          Progress
        </span>
        <div className="w-px h-48 bg-white/5 relative overflow-hidden rounded-full">
          <div
            className="absolute top-0 left-0 w-full rounded-full"
            style={{
              height: `${pct}%`,
              background: "linear-gradient(to bottom, #22d3ee, #7c3aed)",
              transition: "height 0.1s linear",
            }}
          />
        </div>
        <span className="font-mono text-[8px] text-cyan-500/50 tabular-nums">
          {pct}%
        </span>
      </div>

      {/* ── Center reticle ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 border border-cyan-500/20 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        </div>
        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-1/2 w-20 h-px bg-cyan-500/10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-px h-20 bg-cyan-500/10 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ── Bottom status bar ── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-6 py-3 border-t border-white/5">
        {/* Mouse coords */}
        <span className="font-mono text-[9px] text-white/20 tabular-nums">
          X:{coords.x} Y:{coords.y}
        </span>

        {/* Voyage milestones */}
        <div className="flex items-center gap-3">
          {PANEL_ZONES.map((zone, i) => (
            <div key={zone.id} className="flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: progress >= zone.min ? "#22d3ee" : "#ffffff20",
                  boxShadow: progress >= zone.min ? "0 0 6px #22d3ee" : "none",
                }}
              />
            </div>
          ))}
        </div>

        <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
          SCROLL_TO_NAVIGATE
        </span>
      </div>
    </div>
  );
}