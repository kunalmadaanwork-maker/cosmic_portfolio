"use client";
import React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/Loader";
import HUD_Overlay from "@/components/ui/HUD_Overlay";
import DataPanels from "@/components/ui/DataPanel";
import CustomCursor from "@/components/ui/CustomCursor"; 
import { useVoyageStore } from "@/store/useVoyageStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function Page() {
  const phase = useVoyageStore((state) => state.phase);
  const setPhase = useVoyageStore((state) => state.setPhase);

  let activeZone = null;
  if (phase === 'VOID') activeZone = 'void';
  else if (phase === 'NEBULA') activeZone = 'project-1';
  else if (phase === 'BLACKHOLE') activeZone = 'project-2';
  else if (phase === 'SINGULARITY') activeZone = 'contact';

  return (
    <>
      <div className="canvas-container"><Scene /></div>
      {phase !== 'LOADING' && (
        <>
          <CustomCursor /> 
          <HUD_Overlay />
          <DataPanels activeZone={activeZone} />
        </>
      )}
      <AnimatePresence>
        {phase === 'LOADING' && <Loader onComplete={() => setPhase('PAD')} />}
      </AnimatePresence>
    </>
  );
}