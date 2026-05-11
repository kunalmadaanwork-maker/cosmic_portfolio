// src/components/canvas/zones/Nebula.tsx
"use client";

import { Clouds, Cloud, Float } from "@react-three/drei";
import * as THREE from "three";
import Wormhole from "../Wormhole";

export default function Nebula() {
  return (
    // Positioned at Z: -400
    <group position={[0, 0, -400]}>
      <ambientLight intensity={1} color="#a78bfa" />
      <pointLight position={[0, 0, 0]} intensity={10} color="#f472b6" distance={100} />
      
      {/* 
          Symmetric Spacing:
          Group(-400) + Relative(100) = Total Z(-300).
          Camera stops at -300, so clouds are exactly where the planet was.
      */}
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={40} bounds={[30, 10, 30]} volume={20} color="#a78bfa" position={[-15, 0, 100]} opacity={0.4} />
        <Cloud segments={40} bounds={[30, 10, 30]} volume={20} color="#f472b6" position={[15, 5, 120]} opacity={0.4} />
      </Clouds>

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

      {/* 
          Symmetric Spacing:
          Group(-400) + Relative(-50) = Total Z(-450).
          Matches the Hero Planet wormhole distance.
      */}
      <Wormhole position={[0, 0, -50]} />
      
      <ambientLight intensity={0.5} />
    </group>
  );
}