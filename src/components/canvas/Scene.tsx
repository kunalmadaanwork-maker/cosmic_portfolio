// src/components/canvas/Scene.tsx
"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Environment } from "@react-three/drei";
import { useVoyageStore, globalBloom } from "@/store/useVoyageStore";

import CinematicController from "./CinematicController";
import Astronaut from "./Astronaut";
import ParticleField from "./ParticleField";

import CityLaunch from "./CityLaunch";
import HeroPlanet from "./zones/HeroPlanet";
import Nebula from "./zones/Nebula";
import BlackHole from "./zones/Blackhole";
import Singularity from "./zones/Singularity";

function BloomAnimator() {
  const bloomRef = useRef<any>(null);
  useFrame(() => {
    if (bloomRef.current) {
      const safeIntensity = isFinite(globalBloom.intensity) ? globalBloom.intensity : 1.5;
      const safeThreshold = isFinite(globalBloom.threshold) ? globalBloom.threshold : 0.8;
      bloomRef.current.intensity = safeIntensity;
      if (bloomRef.current.luminanceMaterial) {
        bloomRef.current.luminanceMaterial.threshold = safeThreshold;
      }
    }
  });
  return <Bloom ref={bloomRef} intensity={1.5} luminanceThreshold={0.8} luminanceSmoothing={0.9} mipmapBlur />;
}

export default function Scene() {
  const phase = useVoyageStore((state) => state.phase);

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position:[0, 1.5, 40], fov: 60 }}
    >
      <color attach="background" args={["#020205"]} />
      <ambientLight intensity={0.5} />
      
      <CinematicController />

      <Suspense fallback={null}>
        <Astronaut />

        {(phase === 'LOADING' || phase === 'PAD' || phase === 'LIFTOFF' || phase === 'LANDING') && (
          <CityLaunch /> 
        )}

        {phase !== 'LOADING' && phase !== 'PAD' && phase !== 'LIFTOFF' && phase !== 'LANDING' && (
          <>
            <ParticleField count={2000} spread={1000} zOffset={-300} />
            <Environment preset="studio" environmentIntensity={0.3} />
          </>
        )}

        {phase === 'VOID' && <HeroPlanet />}
        
        {/* FIXED: Nebula now renders during the BLACKHOLE phase as well, 
            acting as the background environment for the Black Hole. */}
        {(phase === 'NEBULA' || phase === 'BLACKHOLE') && <Nebula />}
        
        {phase === 'BLACKHOLE' && <BlackHole />}
        {phase === 'SINGULARITY' && <Singularity />}
      </Suspense>

      <EffectComposer>
        <BloomAnimator />
      </EffectComposer>
    </Canvas>
  );
}