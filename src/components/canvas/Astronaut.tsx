// src/components/canvas/Astronaut.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useVoyageStore } from "@/store/useVoyageStore";

export default function Astronaut() {
  const progress = useVoyageStore((state) => state.progress);
  const phase = useVoyageStore((state) => state.phase);
  const groupRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Bone | null>(null);
  
  const { scene } = useGLTF('/models/Astronaut.glb');
  const ASTRO_SCALE = 0.035; 

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 40),
    new THREE.Vector3(50, 0, -100),
    new THREE.Vector3(100, 0, -300),
    new THREE.Vector3(-150, 20, -600),
    new THREE.Vector3(0, 0, -1000),
    new THREE.Vector3(0, 0, -1250),
  ]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'mixamorigSpine' || child.name.toLowerCase().includes('spine')) {
        spineRef.current = child as THREE.Bone;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const mx = state.pointer.x; 
    const my = state.pointer.y; 

    if (phase !== 'LOADING' && phase !== 'PAD' && phase !== 'LIFTOFF') {
      const targetPos = curve.getPointAt(progress);
      groupRef.current.position.lerp(targetPos, delta * 5); 
    } else {
      const padPos = new THREE.Vector3(-4, 0.85, 35); 
      groupRef.current.position.lerp(padPos, delta * 4);
    }

    if (spineRef.current && phase !== 'PAD') {
      spineRef.current.rotation.x = THREE.MathUtils.lerp(spineRef.current.rotation.x, my * 0.5, delta * 3);
      spineRef.current.rotation.y = THREE.MathUtils.lerp(spineRef.current.rotation.y, mx * 0.5, delta * 3);
    }

    groupRef.current.position.y += Math.sin(t * 0.5) * 0.002;
  });

  return (
    <group ref={groupRef} scale={ASTRO_SCALE}>
      <pointLight position={[2, 2, 2]} intensity={2} color="#ffffff" distance={10} />
      <primitive object={scene} />
    </group>
  );
}