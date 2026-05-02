// src/app/page.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

import Loader      from "@/components/ui/Loader";
import HUD_Overlay from "@/components/ui/HUD_Overlay";
import DataPanels  from "@/components/ui/DataPanel";
// 1. MAKE SURE THIS IMPORT IS HERE
import CustomCursor from "@/components/ui/CustomCursor"; 
import { useVoyageStore } from "@/store/useVoyageStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function Page() {
  const phase = useVoyageStore((state) => state.phase);
  const setPhase = useVoyageStore((state) => state.setPhase);

  let activeZone = null;
  if (phase === 'VOID') activeZone = 'void';
  else if (phase === 'PLANET') activeZone = 'project-1';
  else if (phase === 'NEBULA') activeZone = 'project-2';
  else if (phase === 'SINGULARITY') activeZone = 'contact';

  return (
    <>
      <main style={{ position: "relative", width: "100%", height: "100vh", backgroundColor: "#000", overflow: "hidden" }}>
        <div className="fixed inset-0 z-0">
          <Scene />
        </div>

        {phase !== 'LOADING' && (
          <>
            {/* 2. MAKE SURE CUSTOM CURSOR IS RENDERED HERE */}
            <CustomCursor /> 
            <HUD_Overlay />
            <DataPanels activeZone={activeZone} />
          </>
        )}
      </main>

      <AnimatePresence>
        {phase === 'LOADING' && <Loader onComplete={() => setPhase('PAD')} />}
      </AnimatePresence>
    </>
  );
}