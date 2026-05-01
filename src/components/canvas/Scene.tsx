// components/canvas/Scene.tsx
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

// MUST HAVE BRACKETS: These are named exports from the library
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// MUST HAVE BRACKETS: This is a named export from your store
import { useVoyageStore } from "@/store/useVoyageStore";

// MUST HAVE NO BRACKETS: These are Default exports from your files
import CinematicController from "./CinematicController";
import Astronaut from "./Astronaut";
import LaunchPad from "./zones/LaunchPad"; 
import Singularity from "./zones/Singularity";

export default function Scene() {
  const phase = useVoyageStore((state) => state.phase);
  const bloomIntensity = useVoyageStore((state) => state.bloomIntensity);
  const bloomThreshold = useVoyageStore((state) => state.bloomThreshold);

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 2, 15], fov: 60 }}
    >
      <color attach="background" args={["#000000"]} />
      
      {/* If the error persists, comment these out one-by-one to find the culprit */}
      <CinematicController />
      <Astronaut />

      <Suspense fallback={null}>
        {(phase === 'PAD' || phase === 'LIFTOFF') && <LaunchPad />}
        {phase === 'SINGULARITY' && <Singularity />}
      </Suspense>

      <EffectComposer>
        <Bloom 
          intensity={bloomIntensity} 
          luminanceThreshold={bloomThreshold} 
          luminanceSmoothing={0.9} 
          mipmapBlur 
        />
      </EffectComposer>
    </Canvas>
  );
}