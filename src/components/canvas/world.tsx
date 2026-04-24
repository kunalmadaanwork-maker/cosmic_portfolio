"use client";

import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// --- 1. THE HERO PLANET: Layered Atmosphere & Rings ---
function HeroPlanet() {
  return (
    <group position={[30, 10, -200]}>
      {/* The Core Planet */}
      <mesh castShadow>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial 
          color="#1e40af" 
          roughness={0.8} 
          metalness={0.2} 
          emissive="#0c2a6b"
        />
      </mesh>
      
      {/* Atmospheric Glow Layer (Slightly larger, transparent) */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial 
          color="#22d3ee" 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Detailed Ring System (Flat Disc) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[25, 40, 64]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Local Light for the Planet */}
      <pointLight intensity={2} distance={100} color="#22d3ee" />
    </group>
  );
}

// --- 2. THE NEBULA: Volumetric Gas Clouds ---
function NebulaCluster() {
  return (
    <group position={[-30, 0, -500]}>
      {/* Layered distorted spheres to create "Cloud" depth */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20]}>
            <sphereGeometry args={[Math.random() * 10 + 5, 32, 32]} />
            <MeshDistortMaterial 
              color={i % 2 === 0 ? "#7000ff" : "#00d4ff"} 
              speed={3} 
              distort={0.6} 
              transparent 
              opacity={0.2} 
              blending={THREE.AdditiveBlending} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// --- 3. THE DATA CRYSTALS: Refractive Glass & Glowing Cores ---
function ProjectCrystals() {
  return (
    <group position={[30, -10, -800]}>
      {[...Array(3)].map((_, i) => (
        <group key={i} position={[i * 20 - 20, 0, 0]}>
          {/* The Outer Crystal (Glass) */}
          <mesh>
            <octahedronGeometry args={[4, 0]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transmission={1} // Makes it look like glass
              thickness={2} 
              roughness={0} 
              metalness={0} 
              transparent 
              opacity={0.5} 
            />
          </mesh>
          {/* The Glowing Core (The "Data" inside) */}
          <mesh>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial 
              color="#ffcc33" 
              emissive="#ffcc33" 
              emissiveIntensity={15} 
            />
          </mesh>
          <pointLight intensity={2} distance={20} color="#ffcc33" />
        </group>
      ))}
    </group>
  );
}

// --- 4. THE SINGULARITY: Swirling Accretion Disk ---
function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.y += delta * 0.5; // Fast spin
    }
  });

  return (
    <group position={[0, 0, -1200]}>
      {/* Event Horizon (The Void) */}
      <mesh>
        <sphereGeometry args={[15, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* The Accretion Disk (The glowing ring of fire) */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[25, 3, 2, 100]} />
        <meshStandardMaterial 
          color="#ff4400" 
          emissive="#ffaa00" 
          emissiveIntensity={20} 
          roughness={0} 
        />
      </mesh>

      {/* The Outer Halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[26, 40, 64]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
}

export default function World() {
  return (
    <group>
      <HeroPlanet />
      <NebulaCluster />
      <ProjectCrystals />
      <BlackHole />
    </group>
  );
}