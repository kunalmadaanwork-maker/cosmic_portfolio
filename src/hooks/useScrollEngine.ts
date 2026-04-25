"use client";
import { useState, useEffect } from "react";

export function useScrollEngine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate raw progress (0 to 1)
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = window.pageYOffset / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The "S-Tier" Lerp: This makes the movement buttery
  useEffect(() => {
    let requestRef: number;
    const animate = () => {
      setSmoothProgress((prev) => {
        // lerp formula: current + (target - current) * factor
        const diff = scrollProgress - prev;
        return prev + diff * 0.05; // 0.05 = very smooth, heavy feel
      });
      requestRef = requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef);
  }, [scrollProgress]);

  return { scrollProgress, smoothProgress };
}