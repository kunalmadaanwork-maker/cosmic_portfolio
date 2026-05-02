// src/components/canvas/CityLaunch.tsx
"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Sparkles, Environment, useGLTF, useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import { useVoyageStore } from "@/store/useVoyageStore";

// ─── 1. YOUR ROCKET ───────────────────────────────────────────
function AnimeRocket() {
  const phase = useVoyageStore((state) => state.phase);
  const shipRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/ship/Rocket.glb'); 
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const velocity = useRef(0);

  // ARCHITECTURAL FIX: Ensure the rocket on the pad matches the premium loader rocket
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#cbd5e1", 
          metalness: 0.9,   
          roughness: 0.15,  
          envMapIntensity: 2.0 
        });
      }
    });
  },[clonedScene]);

  useFrame((_, delta) => {
    if (!shipRef.current) return;
    if (phase === 'LIFTOFF') {
      velocity.current += delta * 25; 
      shipRef.current.position.y += velocity.current * delta;
    } else if (phase === 'PAD') {
      velocity.current = 0;
      shipRef.current.position.y = THREE.MathUtils.lerp(shipRef.current.position.y, 4.5, delta * 5);
    }
  });

  return (
    <group ref={shipRef} position={[0, 4.5, -40]}>
      <primitive object={clonedScene} scale={1.2} position={[0, 4, 0]} /> 
      
      {/* Dynamic Engine Light */}
      <pointLight position={[0, -2, 0]} intensity={phase === 'LIFTOFF' ? 100 : 0} color="#ffaa00" distance={100} />
      
      {/* ARCHITECTURAL FIX: Volumetric Exhaust Particles during Liftoff */}
      {phase === 'LIFTOFF' && (
        <Sparkles 
          count={300} 
          scale={[3, 15, 3]} 
          position={[0, -6, 0]} 
          speed={15} 
          size={20} 
          color="#ffaa00" 
          opacity={0.9} 
        />
      )}
    </group>
  );
}

// ─── 2. DETAILED, STEPPED MEGA STRUCTURES ─────────────────────
function MegaStructures() {
  const buildingMat = new THREE.MeshStandardMaterial({ color: "#64748b", metalness: 0.5, roughness: 0.6 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: "#334155", metalness: 0.8, roughness: 0.4 });

  return (
    <group position={[0, 0, 0]}>
      
      {/* ── BUILDING NAME / BILLBOARD ── */}
      <group position={[22, 10, 20.1]} rotation={[0, 0, 0]}>
        <mesh position={[0, -0.2, -0.05]}>
          <planeGeometry args={[9, 2.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <Text position={[0, 0.3, 0]} fontSize={1.1} anchorX="center">
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
          KUNAL MADAAN
        </Text>
        <Text position={[0, -0.6, 0]} fontSize={0.4} anchorX="center" letterSpacing={0.1}>
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          TECHNO FUNCTIONAL BSA
        </Text>
      </group>

      {/* ── LEFT SIDE: Stepped Hangar Buildings ── */}
      {[0, 1, 2, 3].map((i) => {
        const z = 15 - i * 18;  
        const h = 22 - i * 4;   
        const x = -22 - i * 1.5; 
        
        return (
          <group key={`left-${i}`} position={[x, h / 2, z]}>
            <mesh castShadow receiveShadow material={buildingMat}>
              <boxGeometry args={[12, h, 14]} />
            </mesh>
            <mesh position={[6.1, 0, 0]}>
              <boxGeometry args={[0.2, h * 0.8, 2]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
            </mesh>
          </group>
        );
      })}

      {/* ── RIGHT SIDE: Stepped Assembly Towers ── */}
      {[0, 1, 2, 3].map((i) => {
        const z = 15 - i * 18;
        const h = 24 - i * 5;
        const x = 22 + i * 1.5;
        
        return (
          <group key={`right-${i}`} position={[x, h / 2, z]}>
            <mesh castShadow receiveShadow material={buildingMat}>
              <boxGeometry args={[10, h, 10]} />
            </mesh>
            
            <mesh position={[-5.1, h * 0.2, 0]}>
              <boxGeometry args={[0.2, 0.4, 6]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-5.1, -h * 0.1, 0]}>
              <boxGeometry args={[0.2, 0.4, 6]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
            </mesh>

            <mesh position={[-7, (h * 0.4) - (h / 2), 0]} castShadow material={darkMetalMat}>
              <boxGeometry args={[6, 1, 3]} />
            </mesh>
            <mesh position={[-9, - (h / 2) + ((h * 0.4) / 2), 0]} castShadow material={darkMetalMat}>
              <cylinderGeometry args={[0.3, 0.3, h * 0.4]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── 3. LAUNCH TRENCH & RUNWAY LIGHTS ─────────────────────────
function LaunchPadSetup() {
  const runwayLights = Array.from({ length: 20 }).map((_, i) => i * 6 - 40);

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[-22, 0.5, 0]} receiveShadow>
        <boxGeometry args={[30, 1, 150]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <mesh position={[22, 0.5, 0]} receiveShadow>
        <boxGeometry args={[30, 1, 150]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {runwayLights.map((z, i) => (
        <group key={i}>
          <mesh position={[-6.5, 0.05, z]}>
            <boxGeometry args={[0.8, 0.05, 2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={4} />
          </mesh>
          <mesh position={[6.5, 0.05, z]}>
            <boxGeometry args={[0.8, 0.05, 2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── 4. MAIN EXPORT ───────────────────────────────────────────
export default function CityLaunch() {
  const [normalMap, roughnessMap] = useTexture([
    '/textures/concrete/textures/ground_tiles_21_baseColor_2k.png', 
    '/textures/concrete/textures/ground_tiles_21_roughness_2k.png'   
  ]);

  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(50, 50);
  roughnessMap.repeat.set(50, 50);

  return (
    <group>
      <Environment 
        background 
        path="/ship/sky/" 
        files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']} 
      /> 
      
      <fog attach="fog" args={['#2e1b4b', 40, 150]} />
      <ambientLight intensity={0.5} color="#ffffff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <MeshReflectorMaterial
          normalMap={normalMap}       
          roughnessMap={roughnessMap} 
          blur={[400, 100]} 
          resolution={1024} 
          mixBlur={0.5} 
          mixStrength={15} 
          roughness={0.8} 
          depthScale={1.2} 
          minDepthThreshold={0.4} 
          maxDepthThreshold={1.4}
          color="#050505" 
          metalness={0.5} 
          mirror={0.8} 
        />
      </mesh>

      <LaunchPadSetup />
      <MegaStructures />
      <AnimeRocket />

      {/* Ambient floating dust */}
      <Sparkles count={500} scale={[60, 20, 60]} size={3} speed={0.4} opacity={0.15} color="#ffffff" position={[0, 5, -20]} />
    </group>
  );
}

useGLTF.preload('/ship/Rocket.glb');