// ─────────────────────────────────────────────────────────────
//  World  –  all scene objects mapped to the narrative arc
//
//  Z-axis journey (camera travels from 0 → −1200):
//   −200  :  HeroPlanet  (void zone)
//   −500  :  NebulaCluster  (project-2 / project-3)
//   −700  :  AsteroidBelt (skills)
//   −950  :  BlackHole (experience)
//  −1200  :  DeepSpaceGalaxy (contact)
// ─────────────────────────────────────────────────────────────
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { portfolioData } from "@/data/portfolio";

// ── 1. HERO PLANET  ───────────────────────────────────────────
//  A blue-white gas giant that the astronaut drifts past
function HeroPlanet() {
  const atmoRef   = useRef<THREE.Mesh>(null);
  const cloudRef  = useRef<THREE.Mesh>(null);
  const moonRef   = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (atmoRef.current)  atmoRef.current.rotation.y  += delta * 0.03;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.06;
    if (moonRef.current)  moonRef.current.rotation.y  += delta * 0.12;
  });

  return (
    <group position={[35, 12, -220]}>
      {/* Core */}
      <mesh castShadow>
        <sphereGeometry args={[22, 64, 64]} />
        <meshStandardMaterial
          color="#1a3a8f"
          roughness={0.7}
          metalness={0.1}
          emissive="#0a1d55"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Atmosphere shimmer */}
      <mesh ref={atmoRef} scale={1.04}>
        <sphereGeometry args={[22, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef} scale={1.07}>
        <sphereGeometry args={[22, 32, 32]} />
        <meshStandardMaterial
          color="#e0f2fe"
          transparent opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring system – 2 rings at different angles */}
      {[
        { rx: Math.PI / 2.4, rz: 0.25, ri: 27, ro: 44, op: 0.35, col: "#94a3b8" },
        { rx: Math.PI / 2.4, rz: 0.25, ri: 24, ro: 28, op: 0.55, col: "#bfdbfe" },
      ].map((r, i) => (
        <mesh key={i} rotation={[r.rx, 0, r.rz]}>
          <ringGeometry args={[r.ri, r.ro, 128]} />
          <meshStandardMaterial
            color={r.col}
            transparent opacity={r.op}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Orbiting moon */}
      <group ref={moonRef}>
        <mesh position={[38, 0, 0]}>
          <sphereGeometry args={[4.5, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
      </group>

      <pointLight intensity={5} distance={250} color="#38bdf8" />
    </group>
  );
}

// ── 2. NEBULA CLUSTER  ────────────────────────────────────────
//  Volumetric distorted cloud spheres – project-2 and project-3
function NebulaCluster() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        px: (((i * 131) % 70) - 35),
        py: (((i *  73) % 60) - 30),
        pz: (((i *  47) % 60) - 30),
        scale: ((i * 19) % 14) + 6,
        color: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#38bdf8" : "#ec4899",
        speed: ((i * 0.6) % 2) + 0.8,
        opacity: 0.12 + (i % 5) * 0.03,
      })),
    []
  );

  return (
    <group position={[-35, 0, -520]}>
      {clouds.map((c, i) => (
        <Float key={i} speed={c.speed} rotationIntensity={0.4} floatIntensity={1.2}>
          <mesh position={[c.px, c.py, c.pz]}>
            <sphereGeometry args={[c.scale, 24, 24]} />
            <MeshDistortMaterial
              color={c.color}
              speed={1.8}
              distort={0.5}
              transparent
              opacity={c.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </Float>
      ))}

      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[7, 32, 32]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#7c3aed"
          emissiveIntensity={4}
          transparent opacity={0.8}
        />
      </mesh>

      <pointLight intensity={8} distance={350} color="#7c3aed" />
      <pointLight intensity={4} distance={200} color="#ec4899" position={[30, 20, 0]} />
    </group>
  );
}

// ── 3. ASTEROID BELT  ─────────────────────────────────────────
//  Slowly rotating field of rocks – skills zone
function AsteroidBelt() {
  const groupRef = useRef<THREE.Group>(null);

  const asteroids = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => {
        const angle = (i / 90) * Math.PI * 2;
        const r     = 60 + ((i * 17) % 50);
        const yaw   = ((i * 11) % 20) - 10;
        return {
          px: Math.cos(angle) * r,
          py: yaw,
          pz: Math.sin(angle) * r,
          scale: 0.6 + ((i * 3.1) % 3.5),
          rx: (i * 0.7) % Math.PI,
          ry: (i * 1.3) % Math.PI,
        };
      }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.018;
  });

  return (
    <group ref={groupRef} position={[0, 0, -730]}>
      {asteroids.map((a, i) => (
        <mesh
          key={i}
          position={[a.px, a.py, a.pz]}
          rotation={[a.rx, a.ry, 0]}
        >
          <dodecahedronGeometry args={[a.scale, 0]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#475569" : "#334155"}
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── 4. PROJECT CRYSTALS  ──────────────────────────────────────
//  Three glass octahedra, one per project, near the nebula
function ProjectCrystals() {
  return (
    <group position={[30, -12, -800]}>
      {portfolioData.projects.map((proj, i) => (
        <Float key={proj.id} speed={1.2} floatIntensity={0.8} rotationIntensity={0.3}>
          <group position={[(i - 1) * 24, 0, i * 6]}>
            {/* Glass shell */}
            <mesh>
              <octahedronGeometry args={[5.5, 0]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.92}
                thickness={3}
                roughness={0.03}
                ior={1.75}
                transparent
                opacity={0.55}
              />
            </mesh>
            {/* Glowing core */}
            <mesh scale={0.38}>
              <icosahedronGeometry args={[5.5, 1]} />
              <meshStandardMaterial
                color={proj.accentColor}
                emissive={proj.accentColor}
                emissiveIntensity={10}
              />
            </mesh>
            {/* Light beam upward */}
            <mesh position={[0, 9, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 14, 6]} />
              <meshStandardMaterial
                color={proj.accentColor}
                emissive={proj.accentColor}
                emissiveIntensity={4}
                transparent opacity={0.35}
              />
            </mesh>
            <pointLight intensity={4} distance={50} color={proj.accentColor} />
          </group>
        </Float>
      ))}
    </group>
  );
}

// ── 5. BLACK HOLE  ────────────────────────────────────────────
//  Experience / singularity zone
function BlackHole() {
  const diskRef  = useRef<THREE.Mesh>(null);
  const haloRef  = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (diskRef.current)  diskRef.current.rotation.z  += delta * 0.9;
    if (haloRef.current)  haloRef.current.rotation.z  -= delta * 0.4;
  });

  return (
    <group position={[0, 0, -980]}>
      {/* Event horizon */}
      <mesh>
        <sphereGeometry args={[18, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Photon ring */}
      <mesh>
        <ringGeometry args={[18.5, 19.5, 128]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.5}
          transparent opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Hot accretion disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[30, 2.8, 4, 130]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ffaa00"
          emissiveIntensity={14}
          roughness={0}
        />
      </mesh>

      {/* Outer dust ring */}
      <mesh ref={haloRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[32, 55, 128]} />
        <meshStandardMaterial
          color="#ff4400"
          transparent opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Relativistic jets */}
      {[-1, 1].map((dir, i) => (
        <mesh key={i} position={[0, dir * 36, 0]}>
          <cylinderGeometry args={[0.1, 5, 28, 16, 1, true]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={6}
            transparent opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <pointLight intensity={25} distance={700} color="#ff6600" />
      <pointLight intensity={8}  distance={400} color="#7c3aed" position={[0, 40, 0]} />
    </group>
  );
}

// ── 6. DISTANT GALAXY  ───────────────────────────────────────
//  Contact zone – deep space background
function DistantGalaxy() {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const count = 2500;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 40 + ((i * 11) % 80);
      pos[i * 3]     = Math.cos(a) * r * (1 + ((i * 0.03) % 0.6));
      pos[i * 3 + 1] = ((i * 7.3) % 30) - 15;
      pos[i * 3 + 2] = Math.sin(a) * r * (1 + ((i * 0.03) % 0.6));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.01;
  });

  return (
    <group ref={groupRef} position={[0, 0, -1250]}>
      <points geometry={particles}>
        <pointsMaterial
          size={0.6}
          color="#a78bfa"
          transparent opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <pointLight intensity={3} distance={300} color="#a78bfa" />
    </group>
  );
}

// ── EXPORT ────────────────────────────────────────────────────
export default function World() {
  return (
    <group>
      <HeroPlanet />
      <NebulaCluster />
      <AsteroidBelt />
      <ProjectCrystals />
      <BlackHole />
      <DistantGalaxy />
    </group>
  );
}
