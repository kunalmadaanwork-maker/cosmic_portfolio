// ─────────────────────────────────────────────────────────────
//  Scene  –  R3F Canvas root
//  Dynamically imported in page.tsx to avoid SSR issues.
// ─────────────────────────────────────────────────────────────
"use client";

import React, { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import FlightController from "./FlightController";
import Astronaut        from "./Astronaut";
import World            from "./World";
import CityLaunch       from "./CityLaunch";
import ParticleField    from "./ParticleField";

interface SceneProps {
  progressRef:  React.MutableRefObject<number>;
  onZoneChange: (zone: string | null) => void;
}

export default function Scene({ progressRef, onZoneChange }: SceneProps) {
  const astronautRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]}          // cap at 1.5× for performance
      shadows={false}          // disabled for perf; emissive materials look great without
    >
      {/* Explicit black background – prevents any white flash */}
      <color attach="background" args={["#000000"]} />
      <fogExp2 attach="fog" args={["#010206", 0.0007]} />

      <PerspectiveCamera
        makeDefault
        position={[0, -57, 10]}  // starts inside the city
        fov={68}
        near={0.2}
        far={6000}
      />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[60, 100, 40]} intensity={1.2} color="#dde8ff" />
      <pointLight position={[-80, 40, -200]} intensity={3}   color="#7c3aed" />
      <pointLight position={[ 80, -30, -400]} intensity={2}  color="#38bdf8" />

      {/* ── Scene objects ─────────────────────────────────── */}
      <Suspense fallback={null}>
        {/* Lightweight star field  */}
        <ParticleField count={4000} spread={2500} zOffset={-600} size={1.5} />
        {/* Extra close stars (more density near launch) */}
        <ParticleField count={800}  spread={400}  zOffset={0}    size={1.0} color="#ffe8c0" drift={0} />

        {/* City + atmosphere – visible during launch phase */}
        <CityLaunch progress={progressRef} />

        {/* Narrative world objects */}
        <World />
      </Suspense>

      {/* Astronaut group (moved by FlightController) */}
      <group ref={astronautRef}>
        <Astronaut />
      </group>

      {/* Flight logic – no JSX output, purely drives transforms */}
      <FlightController
        astronautRef={astronautRef}
        progressRef={progressRef}
        onZoneChange={onZoneChange}
      />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1.3}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.8}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0003, 0.0003)}
        />
        <Vignette eskil={false} offset={0.3} darkness={0.65} />
      </EffectComposer>
    </Canvas>
  );
}