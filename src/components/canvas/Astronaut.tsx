// components/canvas/Astronaut.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVoyageStore } from "@/store/useVoyageStore";

// Reusing your original custom colors
const WHITE  = new THREE.Color("#e8eef4");
const DARK   = new THREE.Color("#2d3748");
const VISOR  = new THREE.Color("#fbbf24");
const STRIPE = new THREE.Color("#38bdf8");
const ACCENT = new THREE.Color("#1e293b");

function SharedMat({ color }: { color: THREE.Color }) {
  return <meshStandardMaterial color={color} metalness={0.4} roughness={0.35} />;
}

export default function Astronaut() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef  = useRef<THREE.Group>(null);
  const headRef  = useRef<THREE.Group>(null);
  const lArmRef  = useRef<THREE.Mesh>(null);
  const rArmRef  = useRef<THREE.Mesh>(null);
  
  const phase = useVoyageStore((state) => state.phase);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. FLOAT IN FRONT OF CAMERA
    // The astronaut hides during the launchpad and liftoff phases
    const isVisible = phase !== 'PAD' && phase !== 'LIFTOFF';
    
    // Smoothly scale the astronaut up when it appears in the Void
    const targetScale = isVisible ? 1 : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);

    // Always follow the camera with an offset (Z -5, Y -1.5)
    const targetPos = state.camera.position.clone().add(new THREE.Vector3(0, -1.5, -5));
    groupRef.current.position.lerp(targetPos, delta * 4);

    // Make the entire group face the same way as the camera
    groupRef.current.quaternion.slerp(state.camera.quaternion, delta * 3);

    // 2. ZERO-GRAVITY IDLE ANIMATION
    const t = state.clock.getElapsedTime();
    const mx = state.pointer.x; // Mouse X (-1 to 1)
    const my = state.pointer.y; // Mouse Y (-1 to 1)

    if (bodyRef.current) {
      // Body gently bobs up and down and tracks mouse slightly
      bodyRef.current.position.y = Math.sin(t * 0.8) * 0.1;
      bodyRef.current.rotation.z = Math.sin(t * 0.4) * 0.03;
      bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, mx * 0.5, 0.07);
    }

    if (headRef.current) {
      // Head tracks the mouse aggressively
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mx * 1.2, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -my * 0.5, 0.08);
    }

    // Arms float organically
    if (lArmRef.current) lArmRef.current.rotation.z = -0.3 + Math.sin(t * 0.8) * 0.06;
    if (rArmRef.current) rArmRef.current.rotation.z =  0.3 - Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={groupRef} scale={0}>
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.65, 0.84, 0.54]} />
          <SharedMat color={WHITE} />
        </mesh>

        {/* Chest insignia stripe */}
        <mesh position={[0, 0.12, 0.28]}>
          <boxGeometry args={[0.28, 0.06, 0.02]} />
          <meshStandardMaterial color={STRIPE} emissive={STRIPE} emissiveIntensity={2} />
        </mesh>

        {/* Life-support pack */}
        <mesh position={[0, 0.05, -0.34]} castShadow>
          <boxGeometry args={[0.44, 0.64, 0.20]} />
          <meshStandardMaterial color={ACCENT} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Helmet */}
        <group ref={headRef} position={[0, 0.66, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.29, 48, 48]} />
            <SharedMat color={WHITE} />
          </mesh>
          <mesh position={[0, 0.02, 0.14]}>
            <sphereGeometry args={[0.20, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={VISOR} metalness={1} roughness={0} />
          </mesh>
          <pointLight position={[0, 0, 0.32]} intensity={1.2} distance={7} color="#fbbf24" />
        </group>

        {/* Arms */}
        <mesh ref={lArmRef} position={[-0.44, 0.14, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.1, 0.42, 4, 8]} />
          <SharedMat color={WHITE} />
        </mesh>
        <mesh ref={rArmRef} position={[ 0.44, 0.14, 0]} rotation={[0, 0,  0.3]} castShadow>
          <capsuleGeometry args={[0.1, 0.42, 4, 8]} />
          <SharedMat color={WHITE} />
        </mesh>

        {/* Legs */}
        {[-0.18, 0.18].map((x, i) => (
          <mesh key={i} position={[x, -0.63, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.44, 4, 8]} />
            <meshStandardMaterial color={new THREE.Color("#c8d5e0")} metalness={0.2} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}