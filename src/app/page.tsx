"use client";

import React, { useState, useEffect } from "react";
import { useScroll, useSpring, AnimatePresence } from "framer-motion";
import Scene from "@/components/canvas/Scene";
import HUD_Overlay from "@/components/ui/HUD_Overlay";
import BootSequence from "@/components/ui/BootSequence";
import DataPanel from "@/components/ui/DataPanel";
import { portfolioData } from "@/data/portfolio";

export default function Page() {
  const [stage, setStage] = useState<"BOOT" | "VOYAGE">("BOOT");
  const [activePanel, setActivePanel] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    return smoothProgress.onChange((latest) => {
      if (latest > 0.1 && latest < 0.25) setActivePanel("hero");
      else if (latest > 0.3 && latest < 0.45) setActivePanel("project-1");
      else if (latest > 0.5 && latest < 0.65) setActivePanel("project-2");
      else if (latest > 0.7 && latest < 0.85) setActivePanel("project-3");
      else if (latest > 0.9) setActivePanel("contact");
      else setActivePanel(null);
    });
  }, [smoothProgress]);

  // --- THE FIX: THE LAUNCH HANDLER ---
  const handleLaunch = () => {
    // 1. Force the window to the absolute top immediately
    window.scrollTo(0, 0); 
    
    // 2. Switch to voyage state
    setStage("VOYAGE");
  };

  return (
    <main className="relative w-full h-[1000vh] bg-black overflow-x-hidden">
      <AnimatePresence>
        {stage === "BOOT" && (
          // Pass the new handleLaunch function instead of setStage
          <BootSequence onComplete={handleLaunch} />
        )}
      </AnimatePresence>

      {stage === "VOYAGE" && (
        <>
          <div className="fixed inset-0 z-0 bg-black">
            <Scene />
          </div>
          
          <HUD_Overlay />

          <div className="fixed inset-0 z-[100] pointer-events-none">
            <DataPanel 
              isOpen={activePanel === "hero"} 
              title="Kunal Madaan" 
              category="The Architect" 
              description={portfolioData.about} 
            />
            
            {portfolioData.projects.map((proj) => (
              <DataPanel 
                key={proj.id}
                isOpen={activePanel === `project-${proj.id}`} 
                title={proj.title} 
                category={proj.category} 
                description={proj.description} 
                link={proj.link}
              />
            ))}

            <DataPanel 
              isOpen={activePanel === "contact"} 
              title="Establish Uplink" 
              category="Communication" 
              description="Ready to discuss the next galactic project? Send a transmission." 
              link="mailto:your-email@example.com"
            />
          </div>

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