"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate a high-end loading sequence to build anticipation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Small delay after 100% to let the user see the completion
          setTimeout(() => setIsReady(true), 500);
          return 100;
        }
        // Non-linear loading: starts fast, slows down at the end
        const increment = Math.random() * (100 - prev) * 0.1 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }} 
      transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* BACKGROUND ELEMENT: Subtle drifting dust */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + "px",
              height: Math.random() * 3 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{ 
              y: [0, -100], 
              opacity: [0, 1, 0],
              x: [0, Math.random() * 50 - 25] 
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>

      {/* THE ASTRONAUT: Bouncing in low gravity */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative z-10 mb-12"
      >
        {/* Simplified Professional Astronaut Silhouette */}
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="35" r="20" fill="#f8fafc" /> {/* Helmet */}
          <rect x="40" y="50" width="20" height="30" rx="10" fill="#f8fafc" /> {/* Body */}
          <path d="M40 55H30V70H40" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" /> {/* Left Arm */}
          <path d="M60 55H70V70H60" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" /> {/* Right Arm */}
          <rect x="42" y="80" width="8" height="15" rx="4" fill="#cbd5e1" /> {/* Leg L */}
          <rect x="50" y="80" width="8" height="15" rx="4" fill="#cbd5e1" /> {/* Leg R */}
          <circle cx="50" cy="35" r="12" fill="#000" /> {/* Visor */}
        </svg>
      </motion.div>

      {/* PROGRESS SECTION */}
      <div className="relative z-10 w-64 text-center">
        <div className="flex justify-between mb-2 font-mono text-[10px] tracking-widest text-cyan-500 uppercase">
          <span>System_Boot</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-[2px] w-full bg-gray-800 overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
            style={{ width: `${progress}%` }} 
            transition={{ ease: "linear" }}
          />
        </div>
      </div>

      {/* DEVICE ADVISORY */}
      <div className="absolute bottom-12 text-center px-6">
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest opacity-60">
          Optimal experience on Desktop <br /> 
          <span className="text-gray-700">SENSORS CALIBRATING...</span>
        </p>
      </div>

      {/* INITIATE BUTTON */}
      <AnimatePresence>
        {isReady && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #22d3ee" }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="absolute z-[110] px-12 py-4 bg-transparent border border-cyan-500 text-cyan-400 uppercase tracking-[0.5em] text-xs hover:bg-cyan-500 hover:text-black transition-all duration-500 font-mono"
          >
            Initiate Voyage
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}