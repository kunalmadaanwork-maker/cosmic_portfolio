"use client";
import React, { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Sphere, useTexture, Stars } from "@react-//three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FlightController from "./FlightController";
import Astronaut from "./Astronaut";
import World from "./World";
import CityLaunch from "./CityLaunch";
import * as THREE from "three";

function Skybox() {
  const texture = useTexture("/universe_bg.jpg");
  const skyRef = useRef<THREE.Mesh>(null);
  React.useFrame((state, delta) => {
    if (skyRef.current) skyRef.current.rotation.y += delta * 0.001;
  });
  return (
    <Sphere ref={skyRef} args={[2000, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  );
}

export default function Scene({ progress, onPanelChange }: { progress: any, onPanelChange: (id: string | null) => void }) {
  const astronautRef = useRef<THREE.Group>(null);

  return (
    <Canvas 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'auto' }} 
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <fogExp2 args={["#020617", 0.001]} attach="fog" />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} far={10000} />
      
      <directionalLight position={[10, 20, 5]} intensity={2} color="#ffffff" />
      <ambientLight intensity={0.4} />
      
      <Suspense fallback={null}>
        <Skybox />
        <Stars radius={1000} depth={50} count={5000} factor={4} saturation={0} fade />
        <CityLaunch />
        <World />
        <group ref={astronautRef}>
          <Astronaut />
        </group>
        <FlightController astronautRef={astronautRef} onPanelChange={onPanelChange} />
      </Suspense>

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
}