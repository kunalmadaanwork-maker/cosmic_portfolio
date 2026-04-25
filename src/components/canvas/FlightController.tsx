"use client";
import { useFrame } from "@react-//three/fiber"; // Standard import
import * as THREE from "three";
import { useMemo } from "react";
import { useScrollEngine } from "@/hooks/useScrollEngine";

export default function FlightController({ astronautRef, onPanelChange }: { astronautRef: any, onPanelChange: (id: string | null) => void }) {
  const { smoothProgress } = useScrollEngine();

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),           // Launchpad
    new THREE.Vector3(30, 10, -200),      // Planet
    new THREE.Vector3(-30, 0, -500),      // Nebula
    new THREE.Vector3(30, -10, -800),     // Crystals
    new THREE.Vector3(0, 0, -1200),       // Singularity
  ]), []);

  useFrame((state) => {
    const t = smoothProgress;
    const pos = curve.getPointAt(t);

    if (astronautRef.current) {
      astronautRef.current.position.copy(pos);
    }

    // CINEMATIC CHASE CAMERA
    const offset = new THREE.Vector3(0, 4, 12); 
    const desiredPosition = new THREE.Vector3().copy(pos).add(offset);
    
    // 0.05 = Heavy, Cinematic momentum. 0.1 = Snappier.
    state.camera.position.lerp(desiredPosition, 0.05); 
    state.camera.lookAt(pos);

    // Trigger Panels based on progress 't'
    if (t > 0.1 && t < 0.25) onPanelChange("hero");
    else if (t > 0.3 && t < 0.45) onPanelChange("project-1");
    else if (t > 0.5 && t < 0.65) onPanelChange("project-2");
    else if (t > 0.7 && t < 0.85) onPanelChange("project-3");
    else if (t > 0.9) onPanelChange("contact");
    else onPanelChange(null);
  });

  return null;
}