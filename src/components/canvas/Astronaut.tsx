// ─────────────────────────────────────────────────────────────
//  Astronaut  –  procedural low-poly astronaut
//  Exported with forwardRef so FlightController can move it.
// ─────────────────────────────────────────────────────────────
"use client";

import { useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const WHITE  = new THREE.Color("#e8eef4");
const DARK   = new THREE.Color("#2d3748");
const VISOR  = new THREE.Color("#fbbf24");
const STRIPE = new THREE.Color("#38bdf8");
const ACCENT = new THREE.Color("#1e293b");

function SharedMat({ color }: { color: THREE.Color }) {
  return <meshStandardMaterial color={color} metalness={0.4} roughness={0.35} />;
}

const Astronaut = forwardRef<THREE.Group>((_, ref) => {
  const bodyRef  = useRef<THREE.Group>(null);
  const headRef  = useRef<THREE.Group>(null);
  const lArmRef  = useRef<THREE.Mesh>(null);
  const rArmRef  = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Idle float & gentle roll
    if (innerRef.current) {
      innerRef.current.position.y = Math.sin(t * 0.8) * 0.12;
      innerRef.current.rotation.z = Math.sin(t * 0.4) * 0.04;
    }

    // Mouse-look
    const mx = state.mouse.x;
    const my = state.mouse.y;

    if (bodyRef.current) {
      bodyRef.current.rotation.y = THREE.MathUtils.lerp(
        bodyRef.current.rotation.y, mx * 0.5, 0.07
      );
    }
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y, mx * 1.3, 0.07
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x, -my * 0.3, 0.07
      );
    }

    // Arm sway
    if (lArmRef.current) lArmRef.current.rotation.z = -0.3 + Math.sin(t * 0.8) * 0.06;
    if (rArmRef.current) rArmRef.current.rotation.z =  0.3 - Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={ref}>
      <group ref={innerRef}>
        <group ref={bodyRef}>
          {/* ── Torso ── */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.65, 0.84, 0.54]} />
            <SharedMat color={WHITE} />
          </mesh>

          {/* Chest insignia stripe */}
          <mesh position={[0, 0.12, 0.28]}>
            <boxGeometry args={[0.28, 0.06, 0.02]} />
            <meshStandardMaterial color={STRIPE} emissive={STRIPE} emissiveIntensity={2} />
          </mesh>

          {/* Life-support pack */}
          <mesh position={[0, 0.05, -0.34]} castShadow>
            <boxGeometry args={[0.44, 0.64, 0.20]} />
            <meshStandardMaterial color={ACCENT} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Pack indicator lights */}
          {[-0.1, 0.1].map((x, i) => (
            <mesh key={i} position={[x, -0.05, -0.45]}>
              <boxGeometry args={[0.05, 0.22, 0.04]} />
              <meshStandardMaterial color={STRIPE} emissive={STRIPE} emissiveIntensity={3} />
            </mesh>
          ))}

          {/* ── Helmet ── */}
          <group ref={headRef} position={[0, 0.66, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.29, 48, 48]} />
              <SharedMat color={WHITE} />
            </mesh>
            {/* Gold visor */}
            <mesh position={[0, 0.02, 0.14]}>
              <sphereGeometry args={[0.20, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={VISOR} metalness={1} roughness={0} />
            </mesh>
            {/* Helmet lamp */}
            <pointLight position={[0, 0, 0.32]} intensity={1.2} distance={7} color="#fbbf24" />
          </group>

          {/* ── Arms ── */}
          <mesh ref={lArmRef} position={[-0.44, 0.14, 0]} rotation={[0, 0, -0.3]} castShadow>
            <capsuleGeometry args={[0.1, 0.42, 4, 8]} />
            <SharedMat color={WHITE} />
          </mesh>
          <mesh ref={rArmRef} position={[ 0.44, 0.14, 0]} rotation={[0, 0,  0.3]} castShadow>
            <capsuleGeometry args={[0.1, 0.42, 4, 8]} />
            <SharedMat color={WHITE} />
          </mesh>

          {/* Gloves */}
          {[-0.46, 0.46].map((x, i) => (
            <mesh key={i} position={[x, -0.14, 0]}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
            </mesh>
          ))}

          {/* ── Legs ── */}
          {[-0.18, 0.18].map((x, i) => (
            <mesh key={i} position={[x, -0.63, 0]} castShadow>
              <capsuleGeometry args={[0.13, 0.44, 4, 8]} />
              <meshStandardMaterial color={new THREE.Color("#c8d5e0")} metalness={0.2} roughness={0.5} />
            </mesh>
          ))}

          {/* Boots */}
          {[-0.18, 0.18].map((x, i) => (
            <mesh key={i} position={[x, -0.97, 0.05]}>
              <boxGeometry args={[0.22, 0.13, 0.30]} />
              <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
});

Astronaut.displayName = "Astronaut";
export default Astronaut;
