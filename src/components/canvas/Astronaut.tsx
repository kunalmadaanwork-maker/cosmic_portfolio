"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Astronaut() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !headRef.current || !bodyRef.current) return;

    // MOUSE LOOK: Map mouse -1 to 1 to rotation
    const targetRotY = state.mouse.x * 0.6;
    const targetRotX = -state.mouse.y * 0.3;

    // Smoothly rotate the body and head separately for a natural feel
    bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, targetRotY, 0.1);
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY * 1.3, 0.1);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.1);
    
    // Idle float
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* HEAVY TORSO */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.5]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* GOLD VISOR HELMET */}
        <group ref={headRef} position={[0, 0.7, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            {/* Gold Reflective Visor */}
            <meshStandardMaterial color="#ffcc33" metalness={1} roughness={0} />
          </mesh>
        </group>

        {/* ARMS & LEGS (Structured) */}
        <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, 0.2]}><capsuleGeometry args={[0.1, 0.4, 4, 8]} /><meshStandardMaterial color="#f8fafc" /></mesh>
        <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, -0.2]}><capsuleGeometry args={[0.1, 0.4, 4, 8]} /><meshStandardMaterial color="#f8fafc" /></mesh>
        <mesh position={[0.2, -0.6, 0]}><capsuleGeometry args={[0.15, 0.5, 4, 8]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
        <mesh position={[-0.2, -0.6, 0]}><capsuleGeometry args={[0.15, 0.5, 4, 8]} /><meshStandardMaterial color="#cbd5e1" /></mesh>

        {/* LIFE SUPPORT PACK */}
        <mesh position={[0, 0.1, -0.3]}>
          <boxGeometry args={[0.4, 0.6, 0.3]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}