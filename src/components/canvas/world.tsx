// ─────────────────────────────────────────────────────────────
//  World  –  lazy-mounted zone components
//
//  Each zone component is ONLY rendered when Scene passes
//  it as active. Max 2 objects alive at once.
//  All random values are deterministic (sin/cos seeded by index)
//  so no hydration issues and no per-render recalculation.
// ─────────────────────────────────────────────────────────────
"use client";

import { useRef, useMemo } from "react";
import { useFrame }        from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE          from "three";
import { portfolioData }   from "@/data/portfolio";

// ─────────────────────────────────────────────────────────────
//  1. HERO PLANET  (void zone, t ≈ 0.20 – 0.46)
// ─────────────────────────────────────────────────────────────
export function HeroPlanet() {
  const atmoRef  = useRef<THREE.Mesh>(null);
  const moonRef  = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (atmoRef.current) atmoRef.current.rotation.y  += delta * 0.025;
    if (moonRef.current) moonRef.current.rotation.y  += delta * 0.10;
  });

  return (
    <group position={[38, 14, -225]}>
      {/* Core */}
      <mesh>
        <sphereGeometry args={[22, 64, 64]} />
        <meshStandardMaterial
          color="#1a3580"
          roughness={0.7} metalness={0.1}
          emissive="#091a4a" emissiveIntensity={0.5}
        />
      </mesh>
      {/* Atmosphere shimmer */}
      <mesh ref={atmoRef} scale={1.045}>
        <sphereGeometry args={[22, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8" transparent opacity={0.1}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>
      {/* Rings */}
      {[
        { ri: 27, ro: 44, op: 0.32, col: "#94a3b8" },
        { ri: 24, ro: 27, op: 0.55, col: "#bfdbfe" },
      ].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2.4, 0, 0.28]}>
          <ringGeometry args={[r.ri, r.ro, 128]} />
          <meshStandardMaterial
            color={r.col} transparent opacity={r.op}
            side={THREE.DoubleSide} depthWrite={false}
          />
        </mesh>
      ))}
      {/* Moon */}
      <group ref={moonRef}>
        <mesh position={[36, 0, 0]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
      </group>
      <pointLight intensity={5} distance={250} color="#38bdf8" />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
//  2. NEBULA CLUSTER  (t ≈ 0.46 – 0.70)
// ─────────────────────────────────────────────────────────────
export function NebulaCluster() {
  // Deterministic cloud positions using sin seeding
  const clouds = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      px: Math.sin(i * 1.7) * 32,
      py: Math.sin(i * 2.3) * 24,
      pz: Math.cos(i * 1.1) * 28,
      scale: 6 + Math.abs(Math.sin(i * 3.1)) * 12,
      color: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#38bdf8" : "#ec4899",
      speed: 0.8 + Math.abs(Math.sin(i * 0.9)),
    })), []
  );

  return (
    <group position={[-35, 0, -520]}>
      {clouds.map((c, i) => (
        <Float key={i} speed={c.speed} rotationIntensity={0.35} floatIntensity={1.1}>
          <mesh position={[c.px, c.py, c.pz]}>
            <sphereGeometry args={[c.scale, 20, 20]} />
            <MeshDistortMaterial
              color={c.color} speed={1.6} distort={0.45}
              transparent opacity={0.14}
              blending={THREE.AdditiveBlending} depthWrite={false}
            />
          </mesh>
        </Float>
      ))}
      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshStandardMaterial
          color="#a78bfa" emissive="#7c3aed" emissiveIntensity={4}
          transparent opacity={0.8}
        />
      </mesh>
      <pointLight intensity={7} distance={320} color="#7c3aed" />
      <pointLight intensity={4} distance={180} color="#ec4899" position={[28, 18, 0]} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
//  3. PROJECT CRYSTALS  (t ≈ 0.60 – 0.76)
// ─────────────────────────────────────────────────────────────
export function ProjectCrystals() {
  return (
    <group position={[28, -12, -800]}>
      {portfolioData.projects.map((proj, i) => (
        <Float key={proj.id} speed={1.2} floatIntensity={0.8} rotationIntensity={0.3}>
          <group position={[(i - 1) * 22, 0, i * 5]}>
            {/* Glass shell */}
            <mesh>
              <octahedronGeometry args={[5.5, 0]} />
              <meshPhysicalMaterial
                color="#ffffff" transmission={0.92} thickness={3}
                roughness={0.02} ior={1.75} transparent opacity={0.55}
              />
            </mesh>
            {/* Glowing core */}
            <mesh scale={0.38}>
              <icosahedronGeometry args={[5.5, 1]} />
              <meshStandardMaterial
                color={proj.accentColor}
                emissive={proj.accentColor} emissiveIntensity={10}
              />
            </mesh>
            {/* Beam upward */}
            <mesh position={[0, 9, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 14, 6]} />
              <meshStandardMaterial
                color={proj.accentColor} emissive={proj.accentColor}
                emissiveIntensity={4} transparent opacity={0.35}
              />
            </mesh>
            <pointLight intensity={4} distance={50} color={proj.accentColor} />
          </group>
        </Float>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
//  4. BLACK HOLE + DEEP SPACE  (t ≈ 0.76 – 1.00)
// ─────────────────────────────────────────────────────────────
export function BlackHole() {
  const diskRef  = useRef<THREE.Mesh>(null);
  const haloRef  = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.85;
    if (haloRef.current) haloRef.current.rotation.z -= delta * 0.38;
  });

  // Distant galaxy particles (pre-computed)
  const galaxyGeo = useMemo(() => {
    const count = 2000;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 40 + Math.abs(Math.sin(i * 0.31)) * 75;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.sin(i * 0.73) * 0.5) * 25;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  return (
    <group>
      {/* ── Black Hole at -980 ── */}
      <group position={[0, 0, -980]}>
        {/* Event horizon */}
        <mesh>
          <sphereGeometry args={[18, 64, 64]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Photon ring */}
        <mesh>
          <ringGeometry args={[18.4, 19.4, 128]} />
          <meshStandardMaterial
            color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5}
            transparent opacity={0.18}
            side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false}
          />
        </mesh>
        {/* Hot accretion disk */}
        <mesh ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[30, 2.6, 4, 130]} />
          <meshStandardMaterial
            color="#ff6600" emissive="#ffaa00" emissiveIntensity={14} roughness={0}
          />
        </mesh>
        {/* Outer dust ring */}
        <mesh ref={haloRef} rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[32, 55, 128]} />
          <meshStandardMaterial
            color="#ff4400" transparent opacity={0.18}
            side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false}
          />
        </mesh>
        {/* Relativistic jets */}
        {[-1, 1].map((dir, i) => (
          <mesh key={i} position={[0, dir * 36, 0]}>
            <cylinderGeometry args={[0.1, 5, 28, 16, 1, true]} />
            <meshStandardMaterial
              color="#7c3aed" emissive="#7c3aed" emissiveIntensity={6}
              transparent opacity={0.28}
              side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false}
            />
          </mesh>
        ))}
        <pointLight intensity={22} distance={700} color="#ff6600" />
        <pointLight intensity={7}  distance={400} color="#7c3aed" position={[0, 40, 0]} />
      </group>

      {/* ── Distant galaxy at -1250 (contact zone) ── */}
      <group position={[0, 0, -1250]}>
        <points geometry={galaxyGeo}>
          <pointsMaterial
            size={0.55} color="#a78bfa"
            transparent opacity={0.6}
            blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation
          />
        </points>
        <pointLight intensity={3} distance={300} color="#a78bfa" />
      </group>
    </group>
  );
}