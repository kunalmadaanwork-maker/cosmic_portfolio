"use client";

import React, { useState } from "react";
import Scene from "@/components/canvas/Scene";
import HUD_Overlay from "@/components/ui/HUD_Overlay";
import BootSequence from "@/components/ui/BootSequence";
import { AnimatePresence } from "framer-motion";

export default function Page() {
  const [stage, setStage] = useState<"BOOT" | "VOYAGE">("BOOT");

  return (
    // Force background black at the root level
    <main className="relative w-full min-h-screen bg-black overflow-x-hidden" style={{ backgroundColor: 'black' }}>
      
      <AnimatePresence>
        {stage === "BOOT" && (
          <BootSequence onComplete={() => setStage("VOYAGE")} />
        )}
      </AnimatePresence>

      {stage === "VOYAGE" && (
        <>
          {/* Wrap Scene in a black div to prevent white flash during GL load */}
          <div className="fixed inset-0 z-0 bg-black">
            <Scene />
          </div>
          
          <HUD_Overlay />
          
          <div className="relative z-10 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <section key={i} className="h-screen" />
            ))}
          </div>
        </>
      )}
    </main>
  );
}