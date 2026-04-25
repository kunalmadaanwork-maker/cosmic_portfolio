// Wormhole.tsx — fixed: removed unused useMemo, proper TS types on geometry args
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  progressRef: React.MutableRefObject<number>;
  enterAt:  number;
  exitAt:   number;
  color?:   string;
}

const RING_COUNT    = 16;
const TUNNEL_LENGTH = 110;

export default function Wormhole({
  position,
  progressRef,
  enterAt,
  exitAt,
  color = "#38bdf8",
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Pre-compute base Z offsets for each ring (stable, no memo needed)
  const baseZ = Array.from({ length: RING_COUNT }, (_, i) =>
    -(i / (RING_COUNT - 1)) * TUNNEL_LENGTH
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const t      = progressRef.current;
    const span   = exitAt - enterAt;
    const localT = Math.max(0, Math.min((t - enterAt) / span, 1));

    // Fade in early, hold, fade out late
    const fadeIn  = Math.min(localT / 0.25, 1);
    const fadeOut = Math.min((1 - localT) / 0.25, 1);
    const alpha   = Math.min(fadeIn, fadeOut);

    ringRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      const cycleOffset = (localT * TUNNEL_LENGTH) % (TUNNEL_LENGTH / RING_COUNT);
      const z           = baseZ[i] + cycleOffset;
      mesh.position.z   = z;

      const proximity  = 1 - Math.abs(z) / TUNNEL_LENGTH;
      mesh.scale.setScalar(0.5 + proximity * 1.2);

      const ringAlpha  = alpha * Math.max(0, Math.min(proximity * 2, 1));
      const mat        = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity      = ringAlpha * 0.72;

      mesh.rotation.z += delta * (0.14 + i * 0.018);
    });
  });

  // One shared geometry + colour; each mesh clones its own material below
  const geo   = new THREE.TorusGeometry(22, 0.16, 8, 72);
  const color3 = new THREE.Color(color);

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { ringRefs.current[i] = el; }}
          geometry={geo}
          position={[0, 0, baseZ[i]]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color={color3}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}