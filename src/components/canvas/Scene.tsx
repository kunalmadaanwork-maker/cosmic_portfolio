"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import CameraPath from "./CameraPath";
import Astronaut from "./Astronaut";
import World from "./World";
import GalaxyWorld from "./GalaxyWorld";

// ── Glowing starfield points ────────────────────────────────────────────────
function GlowingStars() {
  const count = 5000;

  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(200,220,255,0.6)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3000;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={1.8}
        map={starTexture}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ── Canvas loading fallback ──────────────────────────────────────────────────
function CanvasLoader() {
  return null; // Three.js renders black during load — that's fine
}

// ── Scene Props ──────────────────────────────────────────────────────────────
interface SceneProps {
  onPanelChange: (id: string | null) => void;
}

export default function Scene({ onPanelChange }: SceneProps) {
  const astronautRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
    >
      {/* Explicit black background so no white flash ever occurs */}
      <color attach="background" args={["#000000"]} />

      <fogExp2 args={["#020617", 0.0008]} attach="fog" />

      <PerspectiveCamera
        makeDefault
        position={[0, 5, 15]}
        fov={70}
        near={0.1}
        far={8000}
      />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[50, 80, 30]}
        intensity={1.5}
        color="#e0f2fe"
        castShadow
      />
      <pointLight position={[-100, 50, -200]} intensity={2} color="#7c3aed" />
      <pointLight position={[100, -50, -400]} intensity={1.5} color="#22d3ee" />

      <Suspense fallback={<CanvasLoader />}>
        <GlowingStars />
        <GalaxyWorld />
        <World />
      </Suspense>

      {/* Astronaut as a group so CameraPath can move it */}
      <group ref={astronautRef}>
        <Astronaut />
      </group>

      {/* Camera & scroll driver */}
      <CameraPath
        astronautRef={astronautRef}
        onPanelChange={onPanelChange}
      />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0004, 0.0004)}
        />
        <Vignette eskil={false} offset={0.35} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}