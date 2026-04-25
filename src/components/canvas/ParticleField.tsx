// ─────────────────────────────────────────────────────────────
//  ParticleField  –  instanced lightweight star field
//  No heavy JPG textures.  Uses a tiny canvas-generated sprite.
// ─────────────────────────────────────────────────────────────
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  count?: number;
  spread?: number;
  zOffset?: number;
  color?: string;
  size?: number;
  drift?: number;
}

export default function ParticleField({
  count = 3000,
  spread = 2000,
  zOffset = -600,
  color = "#c8d8ff",
  size = 1.4,
  drift = 0.003,
}: Props) {
  const pointsRef = useRef<THREE.Points>(null);

  // ── Geometry: pre-computed, stable positions ──────────────
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const alphas    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5;
      positions[i * 3 + 2] = zOffset + (Math.random() - 0.5) * spread * 1.5;
      alphas[i] = 0.3 + Math.random() * 0.7;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("alpha",    new THREE.BufferAttribute(alphas, 1));
    return geo;
  }, [count, spread, zOffset]);

  // ── Sprite texture: tiny radial gradient (8 × 8 px) ──────
  const texture = useMemo(() => {
    const sz  = 32;
    const canvas = document.createElement("canvas");
    canvas.width  = sz;
    canvas.height = sz;
    const ctx = canvas.getContext("2d")!;
    const g   = ctx.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2);
    g.addColorStop(0,   "rgba(255,255,255,1)");
    g.addColorStop(0.35,"rgba(200,220,255,0.7)");
    g.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, sz, sz);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // ── Slow drift ────────────────────────────────────────────
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * drift;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={size}
        map={texture}
        color={color}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
