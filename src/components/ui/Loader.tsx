// src/components/ui/Loader.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, ContactShadows, useProgress } from "@react-three/drei";
import * as THREE from "three";

// ─── 1. THE REVOLVING STARFIELD ───────────────────────────────
function LoaderStars() {
  const orbTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.1, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true; 
    return tex;
  },[]);

  const generateStars = (count: number, spread: number, zOffset: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread; 
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread; 
      positions[i * 3 + 2] = -Math.random() * spread + zOffset; 
    }
    return positions;
  };

  const starsFar = useMemo(() => generateStars(400, 200, -50),[]);
  const starsMid = useMemo(() => generateStars(150, 150, -30),[]);
  const starsClose = useMemo(() => generateStars(50, 100, -15),[]);

  const refFar = useRef<THREE.Points>(null);
  const refMid = useRef<THREE.Points>(null);
  const refClose = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (refFar.current) refFar.current.rotation.y += delta * 0.02;   
    if (refMid.current) refMid.current.rotation.y += delta * 0.05;   
    if (refClose.current) refClose.current.rotation.y += delta * 0.1; 
  });

  return (
    <group>
      <points ref={refFar}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starsFar, 3]} />
        </bufferGeometry>
        <pointsMaterial map={orbTexture} size={1.0} color="#ffffff" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={refMid}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starsMid, 3]} />
        </bufferGeometry>
        <pointsMaterial map={orbTexture} size={1.8} color="#38bdf8" transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={refClose}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starsClose, 3]} />
        </bufferGeometry>
        <pointsMaterial map={orbTexture} size={2.5} color="#a78bfa" transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// ─── 2. THE FLYING ROCKET ─────────────────────────────────────
function FlyingRocket() {
  const { scene } = useGLTF('/ship/Rocket.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(performance.now() / 500) * 0.05;
      groupRef.current.position.y = 2.5 + Math.sin(performance.now() / 800) * 0.2;
    }
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.random() * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        <group rotation={[0.4, 0, -Math.PI / 2.2]} position={[0, -1, 0]}>
          <primitive object={clonedScene} scale={0.6} />
          <mesh ref={flameRef} position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.1, 2, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight position={[0, -3, 0]} intensity={30} color="#38bdf8" distance={20} />
        </group>
      </Float>
      <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={12} blur={2} far={4} color="#000000" resolution={256} frames={1} />
    </group>
  );
}

// ─── 3. MAIN LOADER COMPONENT ─────────────────────────────────
interface Props {
  onComplete: () => void;
}

export default function Loader({ onComplete }: Props) {
  // Refs for Direct DOM Manipulation (Bypasses React State Lag)
  const progressTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const { progress: actualProgress } = useProgress();
  const actualProgressRef = useRef(actualProgress);
  
  useEffect(() => {
    actualProgressRef.current = actualProgress;
  }, [actualProgress]);

  useEffect(() => {
    const start = performance.now();
    const minDuration = 5000; // Increased to 5 seconds for a smoother, cinematic feel
    let currentVisualProgress = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      
      // Target progress smoothly moves to 99% over 5 seconds.
      // It only hits 100% if the 3D assets are fully loaded AND 5 seconds have passed.
      let targetProgress = Math.min((elapsed / minDuration) * 100, 99);
      if (actualProgressRef.current === 100 && elapsed >= minDuration) {
        targetProgress = 100;
      }

      // LERP: Smoothly interpolate the visual progress towards the target
      currentVisualProgress += (targetProgress - currentVisualProgress) * 0.05;

      // Snap to 100 when close enough
      if (targetProgress === 100 && currentVisualProgress > 99.8) {
        currentVisualProgress = 100;
      }

      // DIRECT DOM UPDATE: Zero React render lag
      if (progressTextRef.current) {
        progressTextRef.current.innerText = Math.floor(currentVisualProgress).toString().padStart(3, '0') + '%';
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${currentVisualProgress}%`;
      }

      if (currentVisualProgress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 500); // Wait half a second at 100% before fading out
      }
    };
    
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position:[0, 0, 25], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={1.2} color="#ffffff" />
          <directionalLight position={[0, 0, 20]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[10, 10, 10]} intensity={2} color="#ffaa00" />
          <directionalLight position={[-10, 10, -10]} intensity={2} color="#38bdf8" />
          <LoaderStars />
          <FlyingRocket />
        </Canvas>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-[50vh] flex flex-col justify-end pb-16 px-12 md:px-20 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent pointer-events-none">
        <div className="w-full flex flex-col items-center gap-2">
          
          {/* Ref attached here for direct DOM updates */}
          <div 
            ref={progressTextRef}
            className="text-white font-black text-3xl tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          >
            000%
          </div>

          <div className="w-full h-[2px] bg-white/20 mb-6 rounded-full overflow-hidden">
            {/* Ref attached here. Removed CSS transition because JS is updating it at 60fps */}
            <div 
              ref={progressBarRef}
              className="h-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" 
              style={{ width: '0%' }} 
            />
          </div>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-white font-black tracking-widest uppercase text-sm">Kunal Madaan</span>
              <span className="text-[#7dd3fc] font-mono text-[10px] tracking-[0.2em] uppercase mt-1">Techno Functional BSA</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-[#38bdf8] rounded-full animate-pulse shadow-[0_0_10px_#38bdf8]" />
              <span className="text-white font-mono text-[11px] tracking-[0.3em] uppercase">Calibrating Systems</span>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <span className="text-white font-mono text-[11px] tracking-widest uppercase">Bengaluru, IN</span>
              <span className="text-white/50 font-mono text-[10px] tracking-[0.2em] uppercase mt-1">Voyage OS v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}