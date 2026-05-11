"use client";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useVoyageStore, Phase, globalBloom } from "@/store/useVoyageStore";

export default function CinematicController() {
  const { camera } = useThree();
  const { phase, setPhase, setProgress } = useVoyageStore();
  const isAnimating = useRef(false);
  const lastPhase = useRef(phase);

  // THE GRAVITATIONAL SLINGSHOT PATH
  const curve = useRef(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 40),      // Start
    new THREE.Vector3(80, 20, -150),  // Orbit Planet (Right)
    new THREE.Vector3(-100, -20, -400),// Dive into Nebula (Left)
    new THREE.Vector3(50, 10, -700),  // Slingshot to Black Hole (Right)
    new THREE.Vector3(0, 0, -1250),   // Final Plunge
  ]));

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (phase === 'PAD' && !isAnimating.current) {
        triggerLaunch();
        return;
      }
      if (phase !== 'LOADING' && phase !== 'PAD' && phase !== 'LIFTOFF') {
        const progress = Math.max(0, Math.min(1, window.scrollY / (document.body.scrollHeight - window.innerHeight)));
        targetProgress.current = progress;
        setProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase, setPhase, setProgress]);

  useFrame((state, delta) => {
    if (phase === 'VOID' || phase === 'NEBULA' || phase === 'BLACKHOLE' || phase === 'SINGULARITY') {
      // MOMENTUM LERP
      currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, targetProgress.current, delta * 2);
      const p = currentProgress.current;
      
      // ASTRONAUT LEADER POSITION
      const astroPos = curve.current.getPointAt(p);
      
      // CAMERA TETHER: Follows astronaut with a smooth offset
      const cameraOffset = new THREE.Vector3(0, 2, 15); 
      const targetCameraPos = astroPos.clone().add(cameraOffset);
      camera.position.lerp(targetCameraPos, delta * 3);
      
      // DYNAMIC LOOK-AHEAD & BANKING
      const lookAtPos = curve.current.getPointAt(Math.min(p + 0.02, 1));
      camera.lookAt(lookAtPos);
      const tangent = curve.current.getTangentAt(p);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -tangent.x * 0.3, delta * 2);

      // PHASE TRIGGERS
      let newPhase: Phase = 'VOID';
      if (p < 0.2) newPhase = 'VOID';
      else if (p < 0.5) newPhase = 'NEBULA';
      else if (p < 0.8) newPhase = 'BLACKHOLE';
      else newPhase = 'SINGULARITY';

      if (newPhase !== lastPhase.current) {
        setPhase(newPhase);
        lastPhase.current = newPhase;
      }
    }
  });

  const triggerLaunch = () => {
    isAnimating.current = true;
    setPhase('LIFTOFF'); 
    const tl = gsap.timeline();
    tl.to(camera.position, { x: () => `+=${Math.random()}`, y: () => `+=${Math.random()}`, yoyo: true, repeat: 20, duration: 0.05 }, 0);
    tl.to(camera.position, { z: -25, y: 10, duration: 2, ease: "power3.in" }, 0.5);
    tl.to(globalBloom, { intensity: 50, threshold: 0, duration: 0.8, onComplete: () => {
        setPhase('VOID'); 
        camera.position.set(0, 0, -50); 
        gsap.to(globalBloom, { intensity: 1.5, threshold: 0.8, duration: 2, onComplete: () => { isAnimating.current = false; }});
    }}, 2);
  };

  return null;
}