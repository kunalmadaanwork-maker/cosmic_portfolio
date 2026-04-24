"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import BootSequence from "@/components/ui/BootSequence";
import HUD_Overlay from "@/components/ui/HUD_Overlay";
import { PortfolioDataPanels } from "@/components/ui/DataPanel";

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Page() {
  const [stage, setStage] = useState<"BOOT" | "VOYAGE">("BOOT");

  // Panel state — ref avoids re-rendering the 3D scene
  const activePanelRef = useRef<string | null>(null);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);

  // Custom cursor
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const ringX = useRef(0);
  const ringY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouse);

    const animateRing = () => {
      ringX.current += (mouseX.current - ringX.current) * 0.1;
      ringY.current += (mouseY.current - ringY.current) * 0.1;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringX.current - 18}px, ${ringY.current - 18}px)`;
      }
      rafRef.current = requestAnimationFrame(animateRing);
    };
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleLaunch = () => {
    window.scrollTo(0, 0);
    setStage("VOYAGE");
  };

  const handlePanelChange = (id: string | null) => {
    if (activePanelRef.current !== id) {
      activePanelRef.current = id;
      setActivePanelId(id);
    }
  };

  return (
    <>
      {/* Custom cursor */}
      <div
        ref={cursorDotRef}
        className="cursor-dot fixed pointer-events-none z-[9999]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={cursorRingRef}
        className="cursor-ring fixed pointer-events-none z-[9998]"
        style={{ willChange: "transform" }}
      />

      <main className="relative w-full bg-black overflow-x-hidden">
        {/* ── Boot screen ── */}
        <AnimatePresence>
          {stage === "BOOT" && <BootSequence onComplete={handleLaunch} />}
        </AnimatePresence>

        {/* ── Main voyage ── */}
        {stage === "VOYAGE" && (
          <>
            {/* Scroll height — 10 screens gives time for the full path */}
            <div className="h-[1000vh] pointer-events-none" />

            {/* 3D Canvas — fixed behind everything */}
            <div className="fixed inset-0 z-0">
              <Scene onPanelChange={handlePanelChange} />
            </div>

            {/* HUD */}
            <div className="fixed inset-0 z-50 pointer-events-none">
              <HUD_Overlay />
            </div>

            {/* Data panels — pointer-events-auto so links work */}
            <div className="fixed inset-0 z-[100] pointer-events-none">
              <PortfolioDataPanels activePanelId={activePanelId} />
            </div>
          </>
        )}
      </main>
    </>
  );
}