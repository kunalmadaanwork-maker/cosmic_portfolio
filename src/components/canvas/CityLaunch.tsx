"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CityLaunch() {
  const cityRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Fade out the city as the camera moves up (Z increases/decreases)
    if (cityRef.current) {
      const opacity = Math.max(0, 1 - state.camera.position.z / -100);
      cityRef.current.children.forEach(child => {
        if ((child as THREE.Mesh).material instanceof THREE.MeshStandardMaterial) {
          (child as THREE.Mesh).material.opacity = opacity;
          (child as THREE.Mesh).material.transparent = true;
        }
      });
    }
  });

  return (
    <group ref={cityRef}>
      {/* THE CITY: Simplified towering blocks for a cinematic silhouette */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const r = 60 + Math.random() * 20;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <boxGeometry args={[5 + Math.random() * 5, 40 + Math.random() * 100, 5 + Math.random() * 5]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.8} />
          </mesh>
        );
      })}

      {/* THE CLOUD CEILING: A giant, soft disc we "break through" */}
      <mesh position={[0, 50, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial 
          color="#444" 
          transparent 
          opacity={0.8} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
    </group>
  );
}