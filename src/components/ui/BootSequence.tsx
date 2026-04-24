"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LogEntry = {
  text: string;
  type: "ok" | "warn" | "sys" | "ready";
  delay: number;
};

const LOG_ENTRIES: LogEntry[] = [
  { text: "KERNEL BOOT v3.1.4 — COSMIC_OS", type: "sys", delay: 0 },
  { text: "Initializing neural rendering engine...", type: "ok", delay: 550 },
  { text: "Loading GALACTIC_MAP.bin [████████████] 100%", type: "ok", delay: 1050 },
  { text: "Calibrating ion thrusters...", type: "ok", delay: 1500 },
  { text: "WARNING: Uncharted territory beyond sector 7", type: "warn", delay: 1900 },
  { text: "Establishing quantum uplink... [OK]", type: "ok", delay: 2350 },
  { text: "O2 levels: OPTIMAL | Fuel: FULL | Nav: LOCKED", type: "ok", delay: 2750 },
  { text: "Astronaut vitals: NOMINAL", type: "ok", delay: 3100 },
  { text: "Loading portfolio manifest...", type: "ok", delay: 3450 },
  { text: "ALL SYSTEMS GO. READY FOR LAUNCH.", type: "ready", delay: 3900 },
];

const colorMap: Record<LogEntry["type"], string> = {
  ok: "text-cyan-400",
  warn: "text-amber-400",
  sys: "text-purple-400",
  ready: "text-emerald-400",
};

const prefixMap: Record<LogEntry["type"], string> = {
  ok: "[ OK ]",
  warn: "[WARN]",
  sys: "[ SYS]",
  ready: "[ GO ]",
};

export default function BootSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [timeStr, setTimeStr] = useState("00:00:00");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock that only runs client-side — no hydration mismatch
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTimeStr(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Staggered log reveal
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    LOG_ENTRIES.forEach((entry, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
        if (i === LOG_ENTRIES.length - 1) {
          setTimeout(() => setShowButton(true), 500);
        }
      }, entry.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* Top status bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-3 border-b border-cyan-500/20">
        <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest uppercase">
          COSMIC_OS — BOOT SEQUENCE
        </span>
        <span className="font-mono text-[10px] text-cyan-500/40 tracking-widest tabular-nums">
          {timeStr}
        </span>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-12 left-8 w-16 h-16 border-t border-l border-cyan-500/30" />
      <div className="absolute top-12 right-8 w-16 h-16 border-t border-r border-cyan-500/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-cyan-500/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-cyan-500/30" />

      {/* Main terminal window */}
      <div className="w-full max-w-xl px-6">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[10px] text-white/20 tracking-widest">
            /sys/boot — zsh
          </span>
        </div>

        {/* Log lines */}
        <div className="space-y-1.5 min-h-[260px]">
          {LOG_ENTRIES.slice(0, visibleCount).map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`font-mono text-xs flex gap-3 ${colorMap[entry.type]}`}
            >
              <span className="opacity-50 flex-shrink-0">{prefixMap[entry.type]}</span>
              <span className="opacity-90">{entry.text}</span>
            </motion.div>
          ))}

          {/* Blinking cursor on last line */}
          {visibleCount < LOG_ENTRIES.length && (
            <div className="font-mono text-xs text-cyan-400/60 flex gap-3">
              <span className="opacity-40">[ — ]</span>
              <span className="blink">█</span>
            </div>
          )}
        </div>

        {/* Launch button */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 30px rgba(34,211,238,0.35)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={onComplete}
                className="relative px-12 py-4 border border-cyan-500 text-cyan-400 font-mono uppercase tracking-[0.5em] text-sm hover:bg-cyan-500 hover:text-black transition-colors duration-300 overflow-hidden group"
              >
                {/* Animated border beam */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Initiate Voyage
              </motion.button>
              <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">
                Scroll to navigate · Mouse to look
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}