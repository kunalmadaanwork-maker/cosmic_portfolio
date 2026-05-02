// src/components/canvas/zones/HeroPlanet.tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import Wormhole from "../Wormhole";

// ─── PREMIUM FRESNEL/RIM-LIGHT SHADER ───
const planetVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const planetFragmentShader = `
  uniform vec3 baseColor;
  uniform vec3 rimColor;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    // Calculate Fresnel effect
    float fresnel = dot(normal, viewDir);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0); // Sharpness of the rim
    
    vec3 core = baseColor * (0.5 + 0.5 * dot(normal, vec3(0.0, 1.0, 0.0)));
    vec3 finalColor = core + (rimColor * fresnel * 3.0); // Boost rim intensity
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function HeroPlanet() {
  const planetRef = useRef<THREE.Mesh>(null);
  
  const planetMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Color("#091a4a") },
      rimColor: { value: new THREE.Color("#38bdf8") }
    },
    vertexShader: planetVertexShader,
    fragmentShader: planetFragmentShader,
  }),[]);

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={[0, 0, -150]}>
      <group position={[15, 0, 0]}>
        <mesh ref={planetRef} material={planetMaterial}>
          <sphereGeometry args={[18, 64, 64]} />
        </mesh>
        
        {/* ARCHITECTURAL FIX: 3D Anchored UI (No more floating 2D HTML) */}
        <Html transform position={[-35, 5, 10]} rotation={[0, 0.2, 0]} center>
          <div className="w-[500px] pointer-events-none select-none">
            <p className="font-mono text-[12px] uppercase tracking-[0.4em] text-sky-400 mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
              Transmission received
            </p>
            <h1 className="font-display text-7xl uppercase leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              Kunal Madaan
            </h1>
            <div className="w-16 h-[2px] bg-sky-400 my-6 shadow-[0_0_10px_#38bdf8]" />
            <p className="font-mono text-sm text-white/80 uppercase tracking-widest leading-relaxed">
              Senior Techno-Functional BSA <br/> & AI Architect
            </p>
          </div>
        </Html>

        <pointLight intensity={5} distance={200} color="#38bdf8" />
      </group>

      <Wormhole position={[-15, 5, -30]} />
      <ambientLight intensity={0.5} />
    </group>
  );
}