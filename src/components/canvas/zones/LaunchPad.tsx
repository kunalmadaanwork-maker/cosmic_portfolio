// components/canvas/zones/LaunchPad.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const oceanVertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
  float noise(vec2 st) { return random(st); }
  float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += fbm(pos.xy * 0.05 + uTime * 0.2) * 2.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const oceanFragmentShader = `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(0.02, 0.05, 0.1, 0.9);
  }
`;

export default function LaunchPad() {
  // If you don't have this GLB yet, comment this line out temporarily!
  // const { scene: rocket } = useGLTF("/assets/models/rocket-draco.glb");
  const oceanMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (oceanMaterialRef.current) {
      oceanMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      <Environment preset="sunset" background={true} environmentIntensity={0.8} />
      {/* <primitive object={rocket} position={[0, 0, -20]} /> */}
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[1000, 1000, 128, 128]} />
        <shaderMaterial 
          ref={oceanMaterialRef}
          vertexShader={oceanVertexShader}
          fragmentShader={oceanFragmentShader}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>
    </group>
  );
}