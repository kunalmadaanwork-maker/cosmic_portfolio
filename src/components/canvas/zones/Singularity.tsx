// src/components/canvas/zones/Singularity.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

export default function Singularity() {
  return (
    <group position={[0, 0, -1250]}>
      {/* The Recursive Data Grid */}
      <mesh scale={200}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#111" wireframe />
      </mesh>

      <RoundedBox args={[14, 18, 0.5]} radius={0.5} position={[0, 0, -15]}>
        <meshPhysicalMaterial transmission={0.95} roughness={0.15} ior={1.5} thickness={2.0} color="#000" />
      </RoundedBox>

      <Html position={[0, 0, 0]} center>
        <div className="text-center pointer-events-none">
          <h1 className="font-display text-6xl text-white uppercase">End of Voyage</h1>
        </div>
      </Html>
    </group>
  );
}