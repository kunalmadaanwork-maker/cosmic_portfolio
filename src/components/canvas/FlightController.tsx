// ─────────────────────────────────────────────────────────────
//  FlightController  –  camera + astronaut path driver
//
//  NEW in this version:
//  ─  Auto-scroll at singularity (t > 0.82) with acceleration
//  ─  Auto-scroll cancels immediately if user scrolls back
//  ─  onMountChange fires when active world set changes,
//     so Scene can lazy-mount/unmount world objects
// ─────────────────────────────────────────────────────────────
"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame }   from "@react-three/fiber";
import * as THREE     from "three";
import { getActiveZone, getActiveMounts } from "@/hooks/useScrollEngine";

interface Props {
  astronautRef:   React.RefObject<THREE.Group | null>;
  progressRef:    React.MutableRefObject<number>;
  onZoneChange:   (zone: string | null) => void;
  onMountChange:  (mounts: Set<string>) => void;
}

// ── Auto-scroll state (module-level so it survives re-renders) ──
let autoScrollActive  = false;
let autoScrollVelocity = 0;
const AUTO_TRIGGER    = 0.82;   // progress at which gravity kicks in
const AUTO_END        = 0.995;  // progress at which we stop
const MAX_VELOCITY    = 0.004;  // max scroll units per frame

export default function FlightController({
  astronautRef,
  progressRef,
  onZoneChange,
  onMountChange,
}: Props) {

  // ── Flight curve ───────────────────────────────────────────
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(  0, -60,   10),  // 0.00 city
        new THREE.Vector3(  0,  20,  -20),  // 0.08 atmosphere
        new THREE.Vector3(  5,  50,  -80),  // 0.15 void entry
        new THREE.Vector3( 20,  30, -160),  // 0.22 approaching planet
        new THREE.Vector3( 32,  14, -230),  // 0.30 alongside planet
        new THREE.Vector3( 12,   0, -370),  // 0.38 leaving planet
        new THREE.Vector3( -6,  -4, -490),  // 0.45 entering nebula
        new THREE.Vector3(-28,  -2, -570),  // 0.55 deep nebula
        new THREE.Vector3( -6, -10, -690),  // 0.62 asteroid/crystal zone
        new THREE.Vector3( 20, -12, -800),  // 0.68 crystals
        new THREE.Vector3(  5,  -8, -900),  // 0.75 approaching BH
        new THREE.Vector3(  0,   0, -985),  // 0.82 BH proximity ← auto-scroll fires
        new THREE.Vector3( -8,   6,-1100),  // 0.90 ejected from BH
        new THREE.Vector3(  0,   2,-1250),  // 1.00 deep space / contact
      ], false, "catmullrom", 0.5),
    []
  );

  const smoothT     = useRef(0);
  const lastZone    = useRef<string | null>(null);
  const lastMounts  = useRef<string>("");   // serialised set for cheap compare
  const OFFSET      = useMemo(() => new THREE.Vector3(0, 2.5, 9), []);
  const LOOK_AHEAD  = 0.012;

  // ── Cancel auto-scroll if user manually scrolls ────────────
  useEffect(() => {
    const onScroll = () => {
      if (autoScrollActive) {
        // If raw scroll is behind smoothT (user scrolled back), cancel
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const raw = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        if (raw < AUTO_TRIGGER - 0.01) {
          autoScrollActive   = false;
          autoScrollVelocity = 0;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, delta) => {
    // ── 1. Auto-scroll: gravitational pull toward black hole ──
    const raw = progressRef.current;

    if (raw >= AUTO_TRIGGER && raw < AUTO_END) {
      autoScrollActive = true;
    }

    if (autoScrollActive && raw < AUTO_END) {
      // Accelerating velocity (falls like gravity)
      autoScrollVelocity = Math.min(
        autoScrollVelocity + delta * 0.0015,
        MAX_VELOCITY
      );
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, window.scrollY + autoScrollVelocity * maxScroll);
    } else if (raw >= AUTO_END) {
      // Reached deep space — stop auto-scroll, reset velocity
      autoScrollActive   = false;
      autoScrollVelocity = 0;
    }

    // ── 2. Smooth camera progress ─────────────────────────────
    const factor = 1 - Math.pow(1 - 0.055, delta * 60);
    smoothT.current += (progressRef.current - smoothT.current) * factor;
    const t = THREE.MathUtils.clamp(smoothT.current, 0, 0.9999);

    // ── 3. Move astronaut ─────────────────────────────────────
    const pos = curve.getPointAt(t);
    if (astronautRef.current) {
      astronautRef.current.position.lerp(pos, delta * 5);
      const tFwd = Math.min(t + 0.005, 0.9999);
      const fwd  = curve.getPointAt(tFwd).sub(pos).normalize();
      if (fwd.lengthSq() > 0.001) {
        const tgt = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1), fwd
        );
        astronautRef.current.quaternion.slerp(tgt, delta * 2.5);
      }
    }

    // ── 4. Camera ─────────────────────────────────────────────
    const camPos    = pos.clone().add(OFFSET);
    const lookAt    = curve.getPointAt(Math.min(t + LOOK_AHEAD, 0.9999));
    state.camera.position.lerp(camPos, delta * 3.5);
    const prevQ = state.camera.quaternion.clone();
    state.camera.lookAt(lookAt);
    const nextQ = state.camera.quaternion.clone();
    state.camera.quaternion.copy(prevQ).slerp(nextQ, delta * 3.5);

    // ── 5. Content zone ───────────────────────────────────────
    const zone = getActiveZone(t);
    if (zone !== lastZone.current) {
      lastZone.current = zone;
      onZoneChange(zone);
    }

    // ── 6. World mount set ────────────────────────────────────
    const mounts    = getActiveMounts(t);
    const serialised = [...mounts].sort().join(",");
    if (serialised !== lastMounts.current) {
      lastMounts.current = serialised;
      onMountChange(mounts);
    }
  });

  return null;
}