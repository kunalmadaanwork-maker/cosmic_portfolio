// components/canvas/CinematicController.tsx
"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three"; // <-- ADDED THIS LINE
import { useVoyageStore, Phase } from "@/store/useVoyageStore";

export default function CinematicController() {
  const { camera } = useThree();
  const phase = useVoyageStore((state) => state.phase);
  const setPhase = useVoyageStore((state) => state.setPhase);
  const setBloom = useVoyageStore((state) => state.setBloom);
  
  // Ref to prevent overlapping scroll animations
  const isAnimating = useRef(false);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isAnimating.current) return;

      const scrollingDown = e.deltaY > 0;
      
      // TRIGGER THE NEXT PHASE BASED ON SCROLL DIRECTION
      if (scrollingDown) {
        if (phase === 'PAD') triggerLaunch();
        else if (phase === 'VOID') transitionTo('PLANET', { x: 30, y: 10, z: -200 });
        else if (phase === 'PLANET') transitionTo('NEBULA', { x: -35, y: 0, z: -500 });
        else if (phase === 'NEBULA') transitionTo('SINGULARITY', { x: 0, y: 0, z: -1000 });
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [phase]);

  // ─── 1. THE CAMERA PUNCH-IN ILLUSION (PAD -> VOID) ───
  const triggerLaunch = () => {
    isAnimating.current = true;
    setPhase('LIFTOFF');

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('VOID');
        
        // Reset the camera completely after the flash, moving it to Deep Space start
        camera.position.set(0, 0, -50); 
        camera.rotation.set(0, 0, 0);

        // Fade bloom back to normal
        gsap.to({ b: 15 }, { 
          b: 1.5, 
          duration: 1.5, 
          onUpdate: function() { setBloom(this.targets()[0].b, 0.8) } 
        });
        
        isAnimating.current = false;
      }
    });

    // Camera accelerates up and crashes into nosecone
    tl.to(camera.position, { y: 150, z: -5, duration: 3, ease: "power4.in" }, 0);
    
    // Violent camera shake during launch
    tl.to(camera.rotation, {
      x: () => `+=${Math.random() * 0.1 - 0.05}`,
      z: () => `+=${Math.random() * 0.1 - 0.05}`,
      yoyo: true, 
      repeat: 30, 
      duration: 0.1
    }, 0);

    // The Flash - Triggered right before the timeline ends
    tl.to({ b: 1.5, t: 0.8 }, {
      b: 25.0, 
      t: 0.0, 
      duration: 0.4, 
      ease: "power2.in",
      onUpdate: function() { setBloom(this.targets()[0].b, this.targets()[0].t); }
    }, 2.6);
  };

  // ─── 2. STANDARD ZONE TRANSITIONS ───
  const transitionTo = (nextPhase: Phase, targetPos: {x: number, y: number, z: number}) => {
    isAnimating.current = true;

    // Optional: Add a subtle wormhole warp effect by momentarily boosting FOV
    gsap.to(camera as THREE.PerspectiveCamera, {
      fov: 90, 
      duration: 1, 
      yoyo: true, 
      repeat: 1, 
      ease: "power2.inOut",
      onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix()
    });

    // Move camera to new coordinate
    gsap.to(camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 2.5,
      ease: "power2.inOut",
      onComplete: () => {
        setPhase(nextPhase);
        isAnimating.current = false;
      }
    });
  };

  return null;
}