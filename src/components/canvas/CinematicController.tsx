// src/components/canvas/CinematicController.tsx
"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useVoyageStore, Phase, globalBloom } from "@/store/useVoyageStore";

export default function CinematicController() {
  const { camera } = useThree();
  const phase = useVoyageStore((state) => state.phase);
  const setPhase = useVoyageStore((state) => state.setPhase);
  
  const isAnimating = useRef(false);
  // Set initial lookTarget to look at the Rocket/Wall on frame 0
  const lookTarget = useRef(new THREE.Vector3(0, 8, -30));

  // ARCHITECTURAL FIX: Force Camera lock to target every single frame
  useFrame(() => {
    camera.lookAt(lookTarget.current);
  });

  // ARCHITECTURAL FIX: Forced Initialization
  // This overrides the Canvas default the millisecond the app mounts.
  useEffect(() => {
    camera.position.set(0, 1.5, 40);
    lookTarget.current.set(0, 8, -30);
    camera.lookAt(lookTarget.current);
  }, [camera]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isAnimating.current) return;
      
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0; 
      
      if (scrollingDown) {
        if (phase === 'PAD') triggerLaunch();
        else if (phase === 'VOID') transitionTo('PLANET', { x: 0, y: 0, z: -200 });
        else if (phase === 'PLANET') transitionTo('NEBULA', { x: 0, y: 0, z: -350 });
        else if (phase === 'NEBULA') transitionTo('SINGULARITY', { x: 0, y: 0, z: -500 });
      } 
      else if (scrollingUp) {
        if (phase === 'VOID') triggerLand();
        else if (phase === 'PLANET') transitionTo('VOID', { x: 0, y: 0, z: -50 });
        else if (phase === 'NEBULA') transitionTo('PLANET', { x: 0, y: 0, z: -200 });
        else if (phase === 'SINGULARITY') transitionTo('NEBULA', { x: 0, y: 0, z: -350 });
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [phase]);

  // ─── 1. LAUNCH SEQUENCE (The "Warp" to Space) ───
  const triggerLaunch = () => {
    isAnimating.current = true;
    setPhase('LIFTOFF'); 

    const tl = gsap.timeline();

    // A. Violent Camera Shake
    tl.to(camera.position, {
      x: () => `+=${Math.random() * 1.5 - 0.75}`,
      y: () => `+=${Math.random() * 1.5 - 0.75}`,
      yoyo: true, repeat: 40, duration: 0.05 
    }, 0);

    // B. Camera tilts up to follow the rocket's ascent
    tl.to(lookTarget.current, { y: 100, duration: 2.5, ease: "power2.in" }, 0.5);
    tl.to(camera.position, { z: -25, y: 10, duration: 2.5, ease: "power3.in" }, 1.0);

    // C. The Bloom Whiteout Mask (Prevents hard cuts)
    tl.to(globalBloom, {
      intensity: 50.0, threshold: 0.0, duration: 0.8, ease: "power4.in",
      onComplete: () => {
        // Swap scenes ONLY when screen is pure white
        setPhase('VOID'); 
        camera.position.set(0, 0, -50); 
        lookTarget.current.set(0, 0, -100); 
        
        // Fade bloom back down to reveal space
        gsap.to(globalBloom, { 
          intensity: 1.5, threshold: 0.8, duration: 2.0, ease: "power2.out",
          onComplete: () => { isAnimating.current = false; }
        });
      }
    }, 2.5);
  };

  // ─── 2. LANDING SEQUENCE (The "Return" to Earth) ───
  const triggerLand = () => {
    isAnimating.current = true;
    const tl = gsap.timeline();

    tl.to(globalBloom, {
      intensity: 50.0, threshold: 0.0, duration: 0.4, ease: "power4.in",
      onComplete: () => {
        setPhase('LANDING'); 
        camera.position.set(0, 1.5, 40); 
        lookTarget.current.set(0, 80, -30); 

        gsap.to(globalBloom, { 
          intensity: 1.5, threshold: 0.8, duration: 1.0, ease: "power2.out"
        });

        gsap.to(lookTarget.current, { y: 12, duration: 2.5, ease: "power2.out" });

        gsap.to(camera.position, {
          y: () => `+=${Math.random() * 0.4 - 0.2}`,
          yoyo: true, repeat: 10, duration: 0.05, delay: 2.0,
          onComplete: () => {
            setPhase('PAD'); 
            isAnimating.current = false;
          }
        });
      }
    }, 0);
  };

  // ─── 3. DEEP SPACE WARP TRANSITIONS ───
  const transitionTo = (nextPhase: Phase, targetPos: {x: number, y: number, z: number}) => {
    isAnimating.current = true;
    
    // FOV Stretch (The "Warp" effect)
    gsap.to(camera as THREE.PerspectiveCamera, {
      fov: 100, duration: 1, yoyo: true, repeat: 1, ease: "power2.inOut",
      onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix()
    });

    // Smooth Camera Glide
    gsap.to(camera.position, {
      x: targetPos.x, y: targetPos.y, z: targetPos.z,
      duration: 2.5, ease: "power2.inOut",
      onComplete: () => {
        setPhase(nextPhase);
        isAnimating.current = false;
      }
    });

    // Keep lookTarget ahead of camera
    gsap.to(lookTarget.current, {
      x: targetPos.x, y: targetPos.y, z: targetPos.z - 100,
      duration: 2.5, ease: "power2.inOut"
    });
  };

  return null;
}