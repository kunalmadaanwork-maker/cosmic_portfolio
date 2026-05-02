// src/components/ui/CustomCursor.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [isVisible]);

  // Don't render until the mouse actually moves
  if (!isVisible) return null;

  return (
    <>
      {/* Solid inner dot - Glowing Cyan */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#38bdf8] rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_#38bdf8]"
        animate={{ x: mousePosition.x - 5, y: mousePosition.y - 5 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      {/* Trailing outer ring - Bright White */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-white/90 rounded-full pointer-events-none z-[99998] shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        animate={{ x: mousePosition.x - 20, y: mousePosition.y - 20 }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
      />
    </>
  );
}