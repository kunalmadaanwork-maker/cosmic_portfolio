// src/components/canvas/Astronaut.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useVoyageStore } from "@/store/useVoyageStore";

export default function Astronaut() {
  const phase = useVoyageStore((state) => state.phase);
  const groupRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Bone | null>(null);
  
  // Load the model
  const { scene } = useGLTF('/models/Astronaut.glb');

  const ASTRO_SCALE = 0.035; 

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

    // Keep scale consistent
    groupRef.current.scale.lerp(new THREE.Vector3(ASTRO_SCALE, ASTRO_SCALE, ASTRO_SCALE), delta * 5);

    const isEarth = phase === 'PAD' || phase === 'LIFTOFF' || phase === 'LANDING' || phase === 'LOADING';

    if (isEarth) {
      // Position him clearly visible on the launchpad
      const padPos = new THREE.Vector3(-4, 0.85, 35); 
      groupRef.current.position.lerp(padPos, delta * 4);
      
      const lookTarget = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 8, 0));
      groupRef.current.quaternion.slerp(lookTarget, delta * 3);
    } else {
      // Deep Space Logic
      if (spineRef.current) {
        spineRef.current.rotation.x = THREE.MathUtils.lerp(spineRef.current.rotation.x, my * 0.5, delta * 3);
        spineRef.current.rotation.y = THREE.MathUtils.lerp(spineRef.current.rotation.y, mx * 0.5, delta * 3);
      }

      const basePos = state.camera.position.clone().add(
        new THREE.Vector3(0, -1.5, -5).applyQuaternion(state.camera.quaternion)
      );

      if (groupRef.current.position.distanceTo(basePos) > 20) {
        groupRef.current.position.copy(basePos);
      }

      const driftX = Math.sin(t * 0.3) * 1.5;
      const driftY = Math.cos(t * 0.4) * 0.8;
      const driftZ = Math.sin(t * 0.2) * 0.5;
      
      groupRef.current.position.lerp(basePos.add(new THREE.Vector3(driftX, driftY, driftZ)), delta * 2);

      const targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        Math.sin(t * 0.5) * 0.2,
        Math.cos(t * 0.3) * 0.2,
        Math.sin(t * 0.2) * 0.15
      ));
      groupRef.current.quaternion.slerp(targetQuaternion, delta * 2);
    }
  });

  return (
    <group ref={groupRef} scale={ASTRO_SCALE} position={[-4, 0.85, 35]}>
      <pointLight position={[2, 2, 2]} intensity={2} color="#ffffff" distance={10} />
      <ambientLight intensity={1.5} />
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/Astronaut.glb');