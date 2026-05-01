"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  
  const { camera } = useThree();
  const setBloom = useVoyageStore((state) => state.setBloom);
  const resetVoyage = useVoyageStore((state) => state.resetVoyage);

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

  // ─── Interaction: Time Loop ───
  const handleTimeLoop = () => {
    // Reset cursor
    document.body.style.cursor = "auto";

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset everything back to the Evening Launchpad
        resetVoyage(); 
      }
    });

    // 1. Violently pull the camera backward through the grid
    tl.to(camera.position, { 
      z: "+=150", 
      duration: 1.2, 
      ease: "power3.in" 
    }, 0);

    // 2. Flash the Bloom to pure white right before the timeline ends
    tl.to({ b: 1.5, t: 0.8 }, {
      b: 25.0, 
      t: 0.0, 
      duration: 0.8, 
      ease: "expo.in",
      onUpdate: function() { 
        setBloom(this.targets()[0].b, this.targets()[0].t); 
      }
    }, 0.4);
  };

  return (
    <group position={[0, 0, -1000]}> {/* Deep space coordinate */}
      
      {/* ── 3D TESSERACT BACKGROUND ── */}
      <mesh scale={500}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial 
          ref={tesseractMatRef}
          vertexShader={tesseractVertex}
          fragmentShader={tesseractFragment} 
          uniforms={{ uTime: { value: 0 } }}
          side={THREE.BackSide} // Render on the inside of the sphere
        />
      </mesh>

      {/* ── HEAVY GLASS UI PANE ── */}
      <RoundedBox args={[12, 16, 0.5]} radius={0.5} position={[-8, 0, -20]}>
        <meshPhysicalMaterial 
          transmission={0.9} 
          roughness={0.1} 
          ior={1.5} 
          thickness={2.0} 
          color="#000000"
        />
        
        {/* Project HTML onto the glass */}
        <Html transform position={[0, 0, 0.3]} className="pointer-events-none select-none">
          <div className="text-white w-96 p-8 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_0_40px_rgba(167,139,250,0.15)]">
            <h2 className="font-display text-4xl mb-4 text-violet-400 uppercase tracking-widest">
              End of Line
            </h2>
            <p className="font-sans text-sm text-white/60 mb-6 leading-relaxed">
              You have crossed the event horizon. My core systems and operational history are laid bare.
            </p>
            <div className="flex flex-col gap-3 font-mono text-xs text-white/80 uppercase tracking-wider">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>React / Next.js</span> <span>98%</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>WebGL / R3F</span> <span>92%</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Node.js</span> <span>88%</span>
              </div>
            </div>
            
            <a 
              href="mailto:kunal@example.com" 
              className="mt-8 block text-center border border-violet-500/50 text-violet-300 py-3 uppercase tracking-widest text-xs pointer-events-auto hover:bg-violet-500/10 transition-colors"
            >
              Establish Comms ↗
            </a>
          </div>
        </Html>
      </RoundedBox>

      {/* ── THE TIME LOOP ORB ── */}
      <mesh 
        ref={orbRef} 
        position={[4, -2, -25]} 
        onClick={handleTimeLoop}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <icosahedronGeometry args={[2, 2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        
        {/* Orb Floating Label */}
        <Html position={[0, 3.5, 0]} center className="pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 whitespace-nowrap">
            Initiate Time Loop
          </p>
        </Html>
      </mesh>

      {/* Scene Lighting for the Pane / Orb */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, -10]} intensity={2} color="#a78bfa" />

    </group>
  );
}