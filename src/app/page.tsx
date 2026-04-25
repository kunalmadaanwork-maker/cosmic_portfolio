"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Scene from "@/components/canvas/Scene";
import HUD_Overlay from "@/components/ui/HUD_Overlay";
import Loader from "@/components/ui/Loader";
import { useScroll, useSpring } from "framer-motion";

export default function Page() {
  const [stage, setStage] = useState<"BOOT" | "VOYAGE">("BOOT");
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  const handleLaunch = () => {
    window.scrollTo(0, 0);
    setStage("VOYAGE");
  };

  return (
    <main className={`relative w-full bg-black overflow-x-hidden transition-all duration-1000 ${
      stage === "BOOT" ? "h-screen" : "h-[1000vh]"
    }`}>
      <AnimatePresence mode="wait">
        {stage === "BOOT" && (
          <Loader onComplete={handleLaunch} />
        )}
      </AnimatePresence>

      {stage === "VOYAGE" && (
        <>
          <div className="fixed inset-0 z-0 bg-black">
            <Scene progress={smoothProgress} onPanelChange={() => {}} />
          </div>
          
          <HUD_Overlay />

          {/* Scrollable spacer */}
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