// src/components/canvas/zones/BlackHole.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { portfolioData } from "@/data/portfolio";

const BlackHoleShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorInner: { value: new THREE.Color("#ffffff") },
    uColorMid: { value: new THREE.Color("#ffaa00") },
    uColorOuter: { value: new THREE.Color("#ff4400") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorInner;
    uniform vec3 uColorMid;
    uniform vec3 uColorOuter;
    varying vec2 vUv;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      if (dist < 0.2) discard;
      float angle = atan(uv.y, uv.x);
      float swirl = angle + uTime * 0.5 + (1.0 / dist) * 0.2;
      float n = noise(vec2(swirl * 2.0, dist * 10.0));
      vec3 color = mix(uColorInner, uColorMid, smoothstep(0.2, 0.4, dist));
      color = mix(color, uColorOuter, smoothstep(0.4, 0.5, dist));
      float alpha = smoothstep(0.5, 0.3, dist) * smoothstep(0.1, 0.2, dist);
      gl_FragColor = vec4(color + (n * 0.1), alpha);
    }
  `
};

export default function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Group>(null);
  const project = portfolioData.projects[1];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (diskRef.current) {
      (diskRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }
    if (crystalRef.current) {
      const radius = 30;
      crystalRef.current.position.x = Math.cos(t * 0.3) * radius;
      crystalRef.current.position.z = Math.sin(t * 0.3) * radius;
    }
  });

  return (
    <group position={[0, 0, -1000]}>
      <mesh>
        <sphereGeometry args={[15, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={diskRef} rotation={[Math.PI / 2.1, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <shaderMaterial args={[BlackHoleShader]} transparent blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <group ref={crystalRef}>
          <mesh>
            <octahedronGeometry args={[4, 0]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} thickness={2} />
          </mesh>
          <mesh scale={0.4}>
            <octahedronGeometry args={[4, 0]} />
            <meshStandardMaterial color={project.accentColor} emissive={project.accentColor} emissiveIntensity={10} />
          </mesh>
        </group>
      </Float>
      <pointLight intensity={10} color="#ffaa00" distance={100} />
    </group>
  );
}