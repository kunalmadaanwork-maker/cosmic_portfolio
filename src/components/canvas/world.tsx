"use client";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function World() {
  return (
    <group>
      {/* WAYPOINT 1: The Hero Planet (S-Tier Detail) */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[30, 10, -200]}>
          <mesh castShadow>
            <sphereGeometry args={[18, 64, 64]} />
            <meshStandardMaterial color="#1e40af" emissive="#0c2a6b" roughness={0.7} />
          </mesh>
          {/* Atmospheric Glow Shell */}
          <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[18, 64, 64]} />
            <meshStandardMaterial color="#22d3ee" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Saturn-style Rings */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[22, 35, 64]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>

      {/* WAYPOINT 2: The Nebula (Volumetric Gas) */}
      <group position={[-30, 0, -500]}>
        {[...Array(10)].map((_, i) => (
          <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh position={[Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20]}>
              <sphereGeometry args={[Math.random() * 12 + 5, 32, 32]} />
              <MeshDistortMaterial 
                color={i % 2 === 0 ? "#7000ff" : "#00d4ff"} 
                speed={2} distort={0.5} transparent opacity={0.2} blending={THREE.AdditiveBlending} 
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* WAYPOINT 3: Data Crystals (Refractive Glass) */}
      <group position={[30, -10, -800]}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[i * 25 - 25, 0, 0]}>
            <mesh>
              <octahedronGeometry args={[4, 0]} />
              <meshPhysicalMaterial transmission={1} thickness={2} roughness={0} transparent opacity={0.6} />
            </mesh>
            <mesh>
              <icosahedronGeometry args={[1.2, 0]} />
              <meshStandardMaterial color="#ffcc33" emissive="#ffcc33" emissiveIntensity={15} />
            </mesh>
          </group>
        ))}
      </group>

      {/* WAYPOINT 4: The Singularity (Black Hole) */}
      <group position={[0, 0, -1200]}>
        <mesh><sphereGeometry args={[20, 64, 64]} /><meshBasicMaterial color="black" /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[30, 3, 2, 100]} />
          <meshStandardMaterial color="#ff4400" emissive="#ffaa00" emissiveIntensity={25} />
        </mesh>
      </group>
    </group>
  );
}