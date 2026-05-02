// src/components/canvas/zones/Singularity.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useVoyageStore } from "@/store/useVoyageStore";

// ─── 1. TESSERACT SHADERS ──────────────────────────────────────────
const tesseractVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const tesseractFragment = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    // Simulated camera moving infinitely forward through the grid
    vec3 ro = vec3(0.0, 0.0, uTime * 2.0); 
    vec2 p = vUv * 2.0 - 1.0;
    vec3 rd = normalize(vec3(p, 1.0)); // ray direction

    vec3 col = vec3(0.0);
    float t = 0.0;
    
    // Raymarching loop
    for(int i = 0; i < 40; i++) {
        vec3 pos = ro + rd * t;
        
        // Modulo operator creates the infinite repeating grid lines
        vec3 q = mod(pos, 10.0) - 5.0; 
        float d = length(q) - 0.1; // 0.1 is the thickness of the lines
        
        if(d < 0.01) {
            // Violet/Gold glowing grid fading into the distance
            col = vec3(0.6, 0.2, 0.9) * (1.0 - t/40.0); 
            break;
        }
        t += d;
    }
    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─── 2. MAIN COMPONENT ─────────────────────────────────────────────
export default function Singularity() {
  const orbRef = useRef<THREE.Mesh>(null);
  const tesseractMatRef = useRef<THREE.ShaderMaterial>(null);
  
  const setBloom = useVoyageStore((state) => state.setBloom);

  // ─── Animation Loop ───
  useFrame((state) => {
    // Pulse the emissive intensity of the orb
    if (orbRef.current) {
      const mat = orbRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 3) * 1.5;
    }

    // Animate the raymarching grid
    if (tesseractMatRef.current) {
      tesseractMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // ─── Interaction: Time Loop (Scroll Sync Safe) ───
  const handleTimeLoop = () => {
    document.body.style.cursor = "auto";

    // 1. Flash the Bloom to pure white
    gsap.to({ b: 1.5, t: 0.8 }, {
      b: 25.0, 
      t: 0.0, 
      duration: 0.8, 
      ease: "expo.in",
      onUpdate: function() { 
        setBloom(this.targets()[0].b, this.targets()[0].t); 
      },
      onComplete: () => {
        // 2. Under the whiteout, scroll back to the top instantly
        window.scrollTo({ top: 0, behavior: "instant" });
        
        // 3. Fade the bloom back to normal
        gsap.to({ b: 25.0, t: 0.0 }, {
          b: 1.5,
          t: 0.8,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: function() {
            setBloom(this.targets()[0].b, this.targets()[0].t);
          }
        });
      }
    });
  };

  return (
    // Positioned at the exact end of the FlightController curve
    <group position={[0, 0, -1250]}> 
      
      {/* ── 3D TESSERACT BACKGROUND ── */}
      <mesh scale={200}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial 
          ref={tesseractMatRef}
          vertexShader={tesseractVertex}
          fragmentShader={tesseractFragment} 
          uniforms={{ uTime: { value: 0 } }}
          side={THREE.BackSide} // Render on the inside of the sphere
        />
      </mesh>

      {/* ── HEAVY GLASS MONOLITH ── */}
      {/* Acts as a refractive backdrop for your HTML ContactPanel */}
      <RoundedBox args={[14, 18, 0.5]} radius={0.5} position={[0, 0, -15]}>
        <meshPhysicalMaterial 
          transmission={0.95} 
          roughness={0.15} 
          ior={1.5} 
          thickness={2.0} 
          color="#000000"
        />
      </RoundedBox>

      {/* ── THE TIME LOOP ORB ── */}
      <mesh 
        ref={orbRef} 
        position={[0, -6, -10]} 
        onClick={handleTimeLoop}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        
        {/* Orb Floating Label */}
        <Html position={[0, 2.5, 0]} center className="pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 whitespace-nowrap">
            Initiate Time Loop
          </p>
        </Html>
      </mesh>

      {/* Scene Lighting for the Pane / Orb */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, -5]} intensity={2} color="#a78bfa" />

    </group>
  );
}