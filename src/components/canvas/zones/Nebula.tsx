// src/components/canvas/zones/Nebula.tsx
"use client";

import { Clouds, Cloud, Float } from "@react-three/drei";
import * as THREE from "three";
import Wormhole from "../Wormhole";

export default function Nebula() {
  return (
    // Positioned at Z: -300 (Camera arrives at -200)
    <group position={[0, 0, -300]}>
      <ambientLight intensity={1} color="#a78bfa" />
      <pointLight position={[0, 0, 0]} intensity={10} color="#f472b6" distance={100} />
      
      {/* Volumetric Gas Clouds */}
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={40} bounds={[30, 10, 30]} volume={20} color="#a78bfa" position={[-15, 0, -10]} opacity={0.4} />
        <Cloud segments={40} bounds={[30, 10, 30]} volume={20} color="#f472b6" position={[15, 5, -20]} opacity={0.4} />
      </Clouds>

      {/* Sci-Fi Crystals (Representing your AI Projects) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[-10, 0, 0]}>
          <mesh>
            <octahedronGeometry args={[4, 0]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} thickness={2} />
          </mesh>
          <mesh scale={0.4}>
            <octahedronGeometry args={[4, 0]} />
            <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={5} />
          </mesh>
        </group>
      </Float>

      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <group position={[10, 5, -10]}>
          <mesh>
            <octahedronGeometry args={[3, 0]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} thickness={2} />
          </mesh>
          <mesh scale={0.4}>
            <octahedronGeometry args={[3, 0]} />
            <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={5} />
          </mesh>
        </group>
      </Float>

      {/* The Exit Wormhole */}
      <Wormhole position={[0, -5, -30]} />
    </group>
  );
}