"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll, useSpring } from "framer-motion"; 
import { useMemo, useRef } from "react";

export default function CameraPath({ astronautRef }: { astronautRef: any }) {
  const { scrollYProgress } = useScroll();
  
  //- Buttery smooth interpolation
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 40, 
    damping: 20 
  });

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),          
      new THREE.Vector3(30, 10, -200),       
      new THREE.Vector3(-30, 0, -500),     
      new THREE.Vector3(30, -10, -800),    
      new THREE.Vector3(0, 0, -1200),       
    ]);
  }, []);

  useFrame((state) => {
    const t = smoothProgress.get();
    const position = curve.getPointAt(t);

    // SAFETY CHECK: Only move if the astronaut is actually rendered
    if (astronautRef.current) {
      astronautRef.current.position.copy(position);
    }

    // Camera Follow Logic (Chase Cam)
    const offset = new THREE.Vector3(0, 3, 10); 
    const desiredPosition = new THREE.Vector3().copy(position).add(offset);
    
    state.camera.position.lerp(desiredPosition, 0.1);
    state.camera.lookAt(position);
  });

  return null;
}