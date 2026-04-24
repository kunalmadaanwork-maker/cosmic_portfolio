"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Sphere, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CameraPath from "./CameraPath";
import Astronaut from "./Astronaut";
import World from "./world";
import * as THREE from "three";
import { useRef, useMemo, Suspense } from "react";

// --- Loading Fallback Component ---
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  );
}

function Skybox() {
  // Ensure this file exists exactly at /public/universe_bg.jpg
  const texture = useTexture("/universe_bg.jpg");
  const skyRef = useRef<THREE.Mesh>(null);
  
  return (
    <Sphere ref={skyRef} args={[1000, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  );
}

function GlowingStars() {
  const count = 3000;
  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const starGeometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 2000;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  return (
    <points geometry={starGeometry}>
      <pointsMaterial size={1.5} map={starTexture} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function Scene() {
  const astronautRef = useRef<THREE.Group>(null);

  return (
    <Canvas 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }} 
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <fogExp2 args={["#020617", 0.001]} attach="fog" />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} far={10000} />
      
      <directionalLight position={[10, 20, 5]} intensity={2} color="#ffffff" />
      <ambientLight intensity={0.4} />
      
      {/* THE FIX: Wrap everything that uses textures in Suspense */}
      <Suspense fallback={<Loader />}>
        <Skybox />
        <GlowingStars />
        <World />
      </Suspense>

      <group ref={astronautRef}>
        <Astronaut />
      </group>

      <CameraPath astronautRef={astronautRef} />

      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
}