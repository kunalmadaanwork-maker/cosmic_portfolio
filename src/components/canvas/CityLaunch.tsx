// ─────────────────────────────────────────────────────────────
//  CityLaunch  –  procedural city skyline + atmosphere
//  Fix: removed useMemo-on-ref anti-pattern.
//       Uses pre-computed merged BufferGeometry – stable, no
//       InstancedMesh ref timing issues.
// ─────────────────────────────────────────────────────────────
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── City skyline – merged geometry (deterministic, no random) ─
function CitySkyline() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors:   number[]  = [];
    const normals:  number[]  = [];

    const buildingCount = 100;

    // Unit cube face data (6 faces × 2 tris × 3 verts)
    const boxGeoTemplate = new THREE.BoxGeometry(1, 1, 1);
    const templatePos = (boxGeoTemplate.attributes.position as THREE.BufferAttribute);
    const templateNrm = (boxGeoTemplate.attributes.normal   as THREE.BufferAttribute);
    const templateIdx = boxGeoTemplate.index!;

    for (let i = 0; i < buildingCount; i++) {
      const x = (i / buildingCount - 0.5) * 300;
      const h = 4 + Math.abs(Math.sin(i * 2.5 + 1.2)) * 26 + Math.abs(Math.sin(i * 5.1)) * 8;
      const w = 3 + Math.abs(Math.sin(i * 3.7)) * 5;
      const z = Math.sin(i * 7.3) * 25;
      const brightness = 0.04 + Math.abs(Math.sin(i * 1.9)) * 0.06;

      // Build a matrix for this building
      const mat = new THREE.Matrix4().compose(
        new THREE.Vector3(x, h / 2, z),
        new THREE.Quaternion(),
        new THREE.Vector3(w, h, w * 0.8)
      );
      const normalMat = new THREE.Matrix3().getNormalMatrix(mat);

      // Expand indexed geometry into flat triangles
      for (let t = 0; t < templateIdx.count; t++) {
        const vi = templateIdx.getX(t);
        const vx = templatePos.getX(vi);
        const vy = templatePos.getY(vi);
        const vz = templatePos.getZ(vi);
        const nx = templateNrm.getX(vi);
        const ny = templateNrm.getY(vi);
        const nz = templateNrm.getZ(vi);

        const tv = new THREE.Vector3(vx, vy, vz).applyMatrix4(mat);
        const tn = new THREE.Vector3(nx, ny, nz).applyMatrix3(normalMat).normalize();

        positions.push(tv.x, tv.y, tv.z);
        normals.push(tn.x, tn.y, tn.z);
        colors.push(brightness, brightness, brightness * 1.4);
      }
    }

    boxGeoTemplate.dispose();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal",   new THREE.Float32BufferAttribute(normals,   3));
    geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors,    3));
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={1} metalness={0} />
    </mesh>
  );
}

// ── Window lights ─────────────────────────────────────────────
function WindowLights() {
  const geometry = useMemo(() => {
    const count = 700;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.sin(i * 127.1) * 0.5) * 300;
      pos[i * 3 + 1] = Math.abs(Math.sin(i * 311.7)) * 30;
      pos[i * 3 + 2] = Math.sin(i * 74.3) * 50;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.55}
        color="#ffe8a0"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ── Atmosphere discs ──────────────────────────────────────────
function AtmosphereLayers() {
  const layers = [
    { y: 10,  color: "#ff7a30", opacity: 0.18, radius: 800  },
    { y: 60,  color: "#1e4a8a", opacity: 0.22, radius: 1000 },
    { y: 130, color: "#0a0e1a", opacity: 0.35, radius: 1200 },
  ];
  return (
    <>
      {layers.map((l, i) => (
        <mesh key={i} position={[0, l.y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[l.radius, 64]} />
          <meshBasicMaterial
            color={l.color}
            transparent
            opacity={l.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

// ── Ground ────────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[800, 800]} />
      <meshStandardMaterial color="#080a0d" roughness={1} />
    </mesh>
  );
}

// ── Exhaust trail ─────────────────────────────────────────────
function ExhaustTrail({ progress }: { progress: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!matRef.current) return;
    const alpha = Math.max(0, 1 - progress.current / 0.12);
    matRef.current.opacity = alpha * 0.55;
  });

  return (
    <mesh position={[0, -8, 0]}>
      <coneGeometry args={[5, 36, 16, 1, true]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ff9040"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Export ────────────────────────────────────────────────────
export default function CityLaunch({
  progress,
}: {
  progress: React.MutableRefObject<number>;
}) {
  return (
    <group position={[0, -80, 20]}>
      <Ground />
      <CitySkyline />
      <WindowLights />
      <AtmosphereLayers />
      <ExhaustTrail progress={progress} />
      <pointLight position={[  0, 30, 0]} intensity={3}   distance={300} color="#ff9040" />
      <pointLight position={[-80, 20, 0]} intensity={1.5} distance={200} color="#4080ff" />
      <pointLight position={[ 80, 20, 0]} intensity={1.5} distance={200} color="#4060ff" />
    </group>
  );
}