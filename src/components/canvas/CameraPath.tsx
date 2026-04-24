"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "framer-motion"; 
import { useMemo, useRef } from "react";

export default function CameraPath({ astronautRef }: { astronautRef: any }) {
  const { scrollYProgress } = useScroll();
  
  // We use a ref to track the "current" position to avoid React re-renders
  const currentT = useRef(0);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),          
      new THREE.Vector3(30, 10, -200),       
      new THREE.Vector3(-30, 0, -500),     
      new THREE.Vector3(30, -10, -800),    
      new THREE.Vector3(0, 0, -1200),       
    ]);
  }, []);

  useFrame((state, delta) => {
    // 1. SMOOTHING: Instead of a Spring, we use a linear interpolation (lerp)
    // This removes the "jitter" and makes the movement feel like it's on rails.
    const targetT = scrollYProgress.get();
    currentT.current = THREE.MathUtils.lerp(currentT.current, targetT, 0.1);

    const t = currentT.current;
    const position = curve.getPointAt(t);

    // 2. MOVE ASTRONAUT
    if (astronautRef.current) {
      astronautRef.current.position.copy(position);
    }

    // 3. CAMERA CHASE
    // We use a fixed offset but lerp the camera position for that "heavy" cinematic feel
    const offset = new THREE.Vector3(0, 3, 10); 
    const desiredPosition = new THREE.Vector3().copy(position).add(offset);
    
    state.camera.position.lerp(desiredPosition, 0.1);
    state.camera.lookAt(position);
  });

  return null;
}