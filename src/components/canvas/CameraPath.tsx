"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress, getPanelForProgress } from "@/hooks/useCameraPath";

interface CameraPathProps {
  astronautRef: React.RefObject<THREE.Group | null>;
  onPanelChange: (id: string | null) => void;
}

export default function CameraPath({ astronautRef, onPanelChange }: CameraPathProps) {
  const scrollRef = useScrollProgress();

  // Smooth internal progress — avoids the framer-motion spring being called inside useFrame
  const smoothT = useRef(0);
  const lastPanel = useRef<string | null>(null);

  /**
   * The flight path. Positions are tuned so each world object sits in a zone.
   * Z goes deeply negative as we "travel inward" through the scene.
   *
   * Zone mapping (by scroll progress):
   *  0.00 → START (0, 2, 5)
   *  0.15 → HERO PLANET (30, 10, -200)
   *  0.38 → NEBULA CLUSTER (-30, 0, -500)
   *  0.60 → PROJECT CRYSTALS (30, -10, -800)
   *  0.90 → BLACK HOLE (0, 0, -1200)
   */
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 2, 5),
          new THREE.Vector3(12, 6, -80),
          new THREE.Vector3(28, 10, -200),   // near HeroPlanet
          new THREE.Vector3(0, 5, -340),
          new THREE.Vector3(-28, 0, -500),   // near NebulaCluster
          new THREE.Vector3(-10, -5, -640),
          new THREE.Vector3(28, -10, -800),  // near ProjectCrystals
          new THREE.Vector3(14, -5, -1000),
          new THREE.Vector3(0, 0, -1200),    // at BlackHole
        ],
        false,
        "catmullrom",
        0.5
      ),
    []
  );

  useFrame((state, delta) => {
    const raw = scrollRef.current;

    // Smooth the scroll — damping factor keeps motion cinematic
    smoothT.current += (raw - smoothT.current) * Math.min(delta * 3.5, 1);
    const t = THREE.MathUtils.clamp(smoothT.current, 0, 0.999);

    // ── Position along path ──
    const position = curve.getPointAt(t);
    const lookTarget = curve.getPointAt(Math.min(t + 0.008, 0.999));

    // Offset camera slightly above & behind the astronaut
    const offset = new THREE.Vector3(0, 3.5, 12);
    const desiredCamPos = position.clone().add(offset);

    state.camera.position.lerp(desiredCamPos, delta * 4);
    state.camera.lookAt(lookTarget);

    // ── Move astronaut along path ──
    if (astronautRef.current) {
      astronautRef.current.position.lerp(position, delta * 5);

      // Face the astronaut in the direction of travel
      const fwd = lookTarget.clone().sub(position).normalize();
      if (fwd.length() > 0.001) {
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          fwd
        );
        astronautRef.current.quaternion.slerp(targetQuat, delta * 3);
      }
    }

    // ── Panel zone detection ──
    const panel = getPanelForProgress(t);
    if (panel !== lastPanel.current) {
      lastPanel.current = panel;
      onPanelChange(panel);
    }
  });

  return null;
}