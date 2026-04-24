"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GalaxyWorld() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const arms = 3;
    const armSpread = 0.28;
    const rotationFactor = 2.2;

    const color1 = new THREE.Color("#22d3ee");
    const color2 = new THREE.Color("#7c3aed");
    const color3 = new THREE.Color("#f59e0b");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Galaxy arm distribution
      const arm = i % arms;
      const angle = (arm / arms) * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.4) * 600;
      const spinAngle = r * rotationFactor * 0.003;
      const branchAngle = angle + spinAngle;
      const randomSpread = (Math.random() - 0.5) * armSpread * r;

      positions[i3] = Math.cos(branchAngle) * r + randomSpread;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = Math.sin(branchAngle) * r + randomSpread - 600; // center around nebula z

      // Color gradient by distance from center
      const mixFactor = r / 600;
      const c = color1.clone().lerp(arm === 0 ? color2 : color3, mixFactor);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Star sprite texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 1.2,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.006;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}