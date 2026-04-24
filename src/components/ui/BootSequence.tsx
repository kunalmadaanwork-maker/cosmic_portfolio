"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const fullLogs = [
    "INITIALIZING SYSTEM...",
    "LOADING GALACTIC_MAP.bin...",
    "CALIBRATING THRUSTERS...",
    "ESTABLISHING SECURE UPLINK...",
    "OXYGEN LEVELS: OPTIMAL",
    "SYSTEMS READY FOR LAUNCH."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, fullLogs[i]]);
      i++;
      if (i === fullLogs.length) clearInterval(interval);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      // ADDED explicit style here to kill the white screen
      style={{ backgroundColor: 'black' }} 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center font-mono text-cyan-500 p-10"
    >
      <div className="max-w-md w-full space-y-2 mb-12">
        {logs.map((log, i) => (
          <motion.p 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            key={i} 
            className="text-xs md:text-sm"
          >
            <span className="text-cyan-800 mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
          </motion.p>
        ))}
      </div>

      <AnimatePresence>
        {logs.length === fullLogs.length && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #22d3ee" }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="px-10 py-4 border border-cyan-500 text-cyan-400 uppercase tracking-[0.5em] text-sm hover:bg-cyan-500 hover:text-black transition-all duration-300"
          >
            Initiate Voyage
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}