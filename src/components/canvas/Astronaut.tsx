"use client";

import { useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Astronaut = forwardRef<THREE.Group>((_, ref) => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const lArmRef = useRef<THREE.Mesh>(null);
  const rArmRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!innerRef.current || !headRef.current || !bodyRef.current) return;

    const t = state.clock.getElapsedTime();

    // Idle bob and roll
    innerRef.current.position.y = Math.sin(t * 0.9) * 0.12;
    innerRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;

    // Mouse look
    const targetRotY = state.mouse.x * 0.55;
    const targetRotX = -state.mouse.y * 0.28;
    bodyRef.current.rotation.y = THREE.MathUtils.lerp(
      bodyRef.current.rotation.y,
      targetRotY,
      0.08
    );
    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      targetRotY * 1.4,
      0.08
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      targetRotX,
      0.08
    );

    // Arm sway
    if (lArmRef.current)
      lArmRef.current.rotation.z = -0.25 + Math.sin(t * 0.9) * 0.07;
    if (rArmRef.current)
      rArmRef.current.rotation.z = 0.25 - Math.sin(t * 0.9) * 0.07;
  });

  const suitMat = (
    <meshStandardMaterial
      color="#e2e8f0"
      metalness={0.5}
      roughness={0.35}
    />
  );
  const darkMat = (
    <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
  );

  return (
    <group ref={ref}>
      <group ref={innerRef}>
        <group ref={bodyRef}>
          {/* Torso */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.64, 0.82, 0.52]} />
            {suitMat}
          </mesh>

          {/* Chest detail stripe */}
          <mesh position={[0, 0.1, 0.27]}>
            <boxGeometry args={[0.3, 0.08, 0.01]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={3}
            />
          </mesh>

          {/* Life support pack */}
          <mesh position={[0, 0.05, -0.32]} castShadow>
            <boxGeometry args={[0.42, 0.62, 0.22]} />
            {darkMat}
          </mesh>
          {/* Pack vents */}
          {[-0.08, 0.08].map((x, i) => (
            <mesh key={i} position={[x, -0.1, -0.44]}>
              <boxGeometry args={[0.06, 0.28, 0.04]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={2}
              />
            </mesh>
          ))}

          {/* Helmet */}
          <group ref={headRef} position={[0, 0.64, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.28, 48, 48]} />
              {suitMat}
            </mesh>
            {/* Gold visor */}
            <mesh position={[0, 0.02, 0.14]}>
              <sphereGeometry args={[0.195, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={1}
                roughness={0}
                envMapIntensity={2}
              />
            </mesh>
            {/* Helmet light */}
            <pointLight
              position={[0, 0, 0.3]}
              intensity={1.5}
              distance={8}
              color="#fbbf24"
            />
          </group>

          {/* Arms */}
          <mesh
            ref={lArmRef}
            position={[-0.42, 0.15, 0]}
            rotation={[0, 0, -0.25]}
            castShadow
          >
            <capsuleGeometry args={[0.1, 0.44, 4, 8]} />
            {suitMat}
          </mesh>
          <mesh
            ref={rArmRef}
            position={[0.42, 0.15, 0]}
            rotation={[0, 0, 0.25]}
            castShadow
          >
            <capsuleGeometry args={[0.1, 0.44, 4, 8]} />
            {suitMat}
          </mesh>

          {/* Gloves */}
          <mesh position={[-0.44, -0.15, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} />
          </mesh>
          <mesh position={[0.44, -0.15, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} />
          </mesh>

          {/* Legs */}
          <mesh position={[-0.18, -0.62, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.46, 4, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh position={[0.18, -0.62, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.46, 4, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.3} roughness={0.4} />
          </mesh>

          {/* Boots */}
          <mesh position={[-0.18, -0.95, 0.05]}>
            <boxGeometry args={[0.22, 0.14, 0.32]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
          <mesh position={[0.18, -0.95, 0.05]}>
            <boxGeometry args={[0.22, 0.14, 0.32]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
});

Astronaut.displayName = "Astronaut";
export default Astronaut;