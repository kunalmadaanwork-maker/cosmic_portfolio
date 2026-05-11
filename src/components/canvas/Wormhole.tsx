// src/components/canvas/Wormhole.tsx
"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WormholeProps {
  position?: [number, number, number];
}

// Define shader outside the component to prevent re-compilation on every render
const TunnelShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#0033ff") },
    uColor2: { value: new THREE.Color("#00ffff") },
    uColor3: { value: new THREE.Color("#ff00ff") },
    uColor4: { value: new THREE.Color("#ffffff") },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    varying vec2 vUv;
    varying vec3 vPosition;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * smoothNoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      float dist = uv.y;
      float swirl = uTime * 0.2 + dist * 2.0;
      vec2 warpedUv = vec2(
        uv.x + sin(dist * 5.0 + uTime) * 0.1,
        uv.y + cos(uv.x * 10.0 + uTime) * 0.1
      );
      float n = fbm(warpedUv * 3.0 + vec2(uTime * 0.1, 0.0));
      float ring = sin(dist * 20.0 - uTime * 2.0 + n * 5.0);
      ring = smoothstep(0.0, 0.5, ring);
      vec3 color = mix(uColor1, uColor2, n);
      color = mix(color, uColor3, ring * 0.5);
      color = mix(color, uColor4, pow(n, 3.0));
      float fade = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
      gl_FragColor = vec4(color, fade);
    }
  `
};

export default function Wormhole({ position = [0, 0, 0] }: WormholeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[20, 20, 100, 64, 1, true]} />
        <shaderMaterial 
          args={[TunnelShader]} 
          transparent 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
          depthWrite={false}
        />
      </mesh>
      <pointLight intensity={2} color="#00ffff" distance={50} />
    </group>
  );
}