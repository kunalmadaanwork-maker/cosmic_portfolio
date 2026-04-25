"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { portfolioData } from "@/data/portfolio";

// ── 1. HERO PLANET ────────────────────────────────────────────────────────────
function HeroPlanet() {
  const atmoRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (atmoRef.current) atmoRef.current.rotation.y += delta * 0.04;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group position={[30, 10, -200]}>
      {/* Core */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.75}
          metalness={0.15}
          emissive="#0c2a6b"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Slow-rotating atmosphere band */}
      <mesh ref={atmoRef} scale={[1.03, 1.03, 1.03]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef} scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial
          color="#e0f2fe"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring system */}
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <ringGeometry args={[26, 42, 128]} />
        <meshStandardMaterial
          color="#94a3b8"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Inner bright ring */}
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <ringGeometry args={[24, 27, 64]} />
        <meshStandardMaterial
          color="#bfdbfe"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Moon */}
      <Float speed={1} floatIntensity={1}>
        <mesh position={[35, 8, 0]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
      </Float>

      <pointLight intensity={4} distance={200} color="#22d3ee" />
    </group>
  );
}

// ── 2. NEBULA CLUSTER ─────────────────────────────────────────────────────────
function NebulaCluster() {
  // Pre-compute random cloud positions/sizes so they're stable
  const clouds = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        px: (((i * 137.508) % 60) - 30),
        py: (((i * 73.2) % 50) - 25),
        pz: (((i * 49.1) % 50) - 25),
        scale: ((i * 17.3) % 10) + 5,
        color: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#22d3ee" : "#ec4899",
        speed: ((i * 0.7) % 2) + 1,
      })),
    []
  );

  return (
    <group position={[-30, 0, -500]}>
      {clouds.map((c, i) => (
        <Float key={i} speed={c.speed} rotationIntensity={0.5} floatIntensity={1.5}>
          <mesh position={[c.px, c.py, c.pz]}>
            <sphereGeometry args={[c.scale, 24, 24]} />
            <MeshDistortMaterial
              color={c.color}
              speed={2}
              distort={0.55}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </Float>
      ))}
      {/* Central bright core */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#7c3aed"
          emissiveIntensity={3}
          transparent
          opacity={0.7}
        />
      </mesh>
      <pointLight intensity={6} distance={300} color="#7c3aed" />
    </group>
  );
}

// ── 3. PROJECT CRYSTALS ───────────────────────────────────────────────────────
function ProjectCrystals() {
  const crystalColors = [
    portfolioData.projects[0].color,
    portfolioData.projects[1].color,
    portfolioData.projects[2].color,
  ];

  return (
    <group position={[30, -10, -800]}>
      {crystalColors.map((color, i) => (
        <Float key={i} speed={1.5} floatIntensity={1} rotationIntensity={0.4}>
          <group position={[(i - 1) * 22, 0, i * 4]}>
            {/* Glass outer */}
            <mesh>
              <octahedronGeometry args={[5, 0]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.95}
                thickness={3}
                roughness={0.02}
                metalness={0}
                transparent
                opacity={0.6}
                ior={1.8}
              />
            </mesh>
            {/* Glowing core */}
            <mesh scale={0.42}>
              <icosahedronGeometry args={[5, 1]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={8}
              />
            </mesh>
            {/* Crystal label text (light beam) */}
            <mesh position={[0, 8, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 12, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={3}
                transparent
                opacity={0.4}
              />
            </mesh>
            <pointLight intensity={3} distance={40} color={color} />
          </group>
        </Float>
      ))}
    </group>
  );
}

// ── 4. BLACK HOLE ─────────────────────────────────────────────────────────────
function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.8;
    if (haloRef.current) haloRef.current.rotation.z -= delta * 0.35;
    if (outerRef.current) outerRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group position={[0, 0, -1200]}>
      {/* Gravitational lens distortion (dark sphere) */}
      <mesh>
        <sphereGeometry args={[16, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Photon sphere — dim glow ring around horizon */}
      <mesh>
        <ringGeometry args={[16.5, 17.5, 128]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Accretion disk — hot inner ring */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[28, 2.5, 4, 120]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ffaa00"
          emissiveIntensity={12}
          roughness={0}
        />
      </mesh>

      {/* Outer dust ring */}
      <mesh ref={haloRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <ringGeometry args={[30, 50, 128]} />
        <meshStandardMaterial
          color="#ff4400"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Gravitational jets (top/bottom) */}
      {[-1, 1].map((dir, i) => (
        <mesh key={i} position={[0, dir * 30, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 4, 25, 16, 1, true]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={5}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <pointLight intensity={20} distance={600} color="#ff6600" />
      <pointLight intensity={6} distance={300} color="#7c3aed" />
    </group>
  );
}

// ── 5. DISTANT ASTEROIDS (ambient depth) ──────────────────────────────────────
function AsteroidBelt() {
  const asteroids = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const angle = (i / 60) * Math.PI * 2;
        const r = 80 + ((i * 13.7) % 40);
        return {
          px: Math.cos(angle) * r,
          py: (((i * 7.3) % 20) - 10),
          pz: -600 + Math.sin(angle) * r,
          scale: ((i * 3.1) % 3) + 0.5,
        };
      }),
    []
  );

  return (
    <>
      {asteroids.map((a, i) => (
        <mesh key={i} position={[a.px, a.py, a.pz]}>
          <dodecahedronGeometry args={[a.scale, 0]} />
          <meshStandardMaterial
            color="#374151"
            roughness={1}
            metalness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function World() {
  return (
    <group>
      <HeroPlanet />
      <NebulaCluster />
      <ProjectCrystals />
      <BlackHole />
      <AsteroidBelt />
    </group>
  );
}