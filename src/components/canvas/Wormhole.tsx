// src/components/canvas/Wormhole.tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Wormhole({ position }: { position: [number, number, number] }) {
  const ringCount = 25; // Deep tunnel
  const ringsRef = useRef<THREE.Group>(null);

  // Pre-calculate ring properties for performance
  const rings = useMemo(() => {
    return Array.from({ length: ringCount }).map((_, i) => ({
      z: -i * 15, // Space them out deeply along the Z axis
      scale: 1 + Math.random() * 0.8,
      speed: 0.5 + Math.random() * 1.5,
      color: i % 3 === 0 ? "#ea580c" : i % 2 === 0 ? "#7c3aed" : "#38bdf8" // Orange, Purple, Blue
    }));
  },[]);

  useFrame((_, delta) => {
    if (!ringsRef.current) return;
    
    // Pull rings toward the camera to simulate warp speed
    ringsRef.current.children.forEach((ring, i) => {
      ring.position.z += 40 * delta; // Speed of travel
      ring.rotation.z += delta * rings[i].speed; // Swirling effect
      
      // If the ring passes behind the camera, loop it back to the end of the tunnel
      if (ring.position.z > 10) {
        ring.position.z -= ringCount * 15;
      }
    });
  });

  return (
    <group position={position} ref={ringsRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} scale={ring.scale}>
          <torusGeometry args={[18, 0.4, 16, 100]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}