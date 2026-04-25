// ─────────────────────────────────────────────────────────────
//  Loader  –  CSS-animated astronaut bouncing in low gravity
//  Fixed: all layout uses inline styles (Tailwind v4 safe)
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const STYLES = `
  @keyframes moonBounce {
    0%, 100% { transform: translateY(0px) rotate(-3deg); }
    45%, 55%  { transform: translateY(-56px) rotate(3deg); }
  }
  @keyframes shadowPulse {
    0%, 100% { transform: scaleX(1);   opacity: 0.45; }
    50%       { transform: scaleX(0.35); opacity: 0.15; }
  }
  @keyframes dustL {
    0%   { transform: translate(0, 0)        scale(1); opacity: 0.55; }
    100% { transform: translate(-24px, -10px) scale(0); opacity: 0; }
  }
  @keyframes dustR {
    0%   { transform: translate(0, 0)       scale(1); opacity: 0.55; }
    100% { transform: translate(24px, -10px) scale(0); opacity: 0; }
  }
  @keyframes armSwing {
    0%, 100% { transform: rotate(-22deg); }
    50%       { transform: rotate(22deg); }
  }
  @keyframes visorGlow {
    0%, 100% { opacity: 0.82; }
    50%       { opacity: 1; }
  }
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.15; }
    50%       { opacity: 0.9; }
  }
  .asn-bounce  { animation: moonBounce 1.7s cubic-bezier(0.33,0,0.66,0) infinite; filter: drop-shadow(0 0 14px rgba(56,189,248,0.35)); }
  .shadow-pls  { animation: shadowPulse 1.7s ease-in-out infinite; }
  .dust-l      { animation: dustL 1.7s ease-out infinite; }
  .dust-r      { animation: dustR 1.7s ease-out infinite; }
  .arm-swing-l { animation: armSwing 1.7s ease-in-out infinite reverse; transform-origin: 50% 0; }
  .arm-swing-r { animation: armSwing 1.7s ease-in-out infinite; transform-origin: 50% 0; }
  .visor-glo   { animation: visorGlow 2.2s ease-in-out infinite; }
`;

function AstronautSVG() {
  return (
    <svg width="96" height="136" viewBox="0 0 96 136" fill="none" xmlns="http://www.w3.org/2000/svg" className="asn-bounce">
      {/* Body */}
      <rect x="27" y="54" width="42" height="46" rx="9" fill="#e2e8f0" />
      {/* Back pack */}
      <rect x="27" y="58" width="15" height="24" rx="4" fill="#475569" />
      {/* Chest stripe */}
      <rect x="44" y="66" width="20" height="5" rx="2" fill="#38bdf8" opacity="0.95" className="visor-glo" />
      {/* Helmet */}
      <circle cx="48" cy="36" r="22" fill="#e2e8f0" />
      {/* Visor */}
      <ellipse cx="48" cy="37" rx="14" ry="12" fill="#fbbf24" className="visor-glo" opacity="0.92" />
      {/* Sheen */}
      <ellipse cx="42" cy="31" rx="4.5" ry="3.5" fill="white" opacity="0.22" />
      {/* Arms */}
      <g className="arm-swing-l">
        <rect x="11" y="57" width="15" height="32" rx="7.5" fill="#e2e8f0" />
        <circle cx="18.5" cy="91" r="6.5" fill="#475569" />
      </g>
      <g className="arm-swing-r">
        <rect x="70" y="57" width="15" height="32" rx="7.5" fill="#e2e8f0" />
        <circle cx="77.5" cy="91" r="6.5" fill="#475569" />
      </g>
      {/* Legs */}
      <rect x="29" y="98" width="17" height="28" rx="8" fill="#cbd5e1" />
      <rect x="50" y="98" width="17" height="28" rx="8" fill="#cbd5e1" />
      {/* Boots */}
      <rect x="26" y="120" width="23" height="12" rx="5" fill="#334155" />
      <rect x="47" y="120" width="23" height="12" rx="5" fill="#334155" />
    </svg>
  );
}

function Stars() {
  const stars = [
    { l: "8%",  t: "10%", s: 1.5, d: 0    },
    { l: "87%", t: "7%",  s: 1,   d: 0.4  },
    { l: "14%", t: "68%", s: 2,   d: 0.8  },
    { l: "71%", t: "24%", s: 1.5, d: 1.2  },
    { l: "44%", t: "4%",  s: 1,   d: 0.2  },
    { l: "91%", t: "58%", s: 2,   d: 1.5  },
    { l: "29%", t: "84%", s: 1.5, d: 0.6  },
    { l: "59%", t: "76%", s: 1,   d: 1.0  },
    { l: "4%",  t: "43%", s: 2,   d: 1.8  },
    { l: "79%", t: "89%", s: 1.5, d: 0.3  },
    { l: "52%", t: "55%", s: 1,   d: 2.1  },
    { l: "35%", t: "30%", s: 1.5, d: 0.9  },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.l,
            top: s.t,
            width: s.s,
            height: s.s,
            borderRadius: "50%",
            background: "white",
            animation: `starTwinkle ${1.4 + i * 0.28}s ease-in-out ${s.d}s infinite`,
          }}
        />
      ))}
    </>
  );
}

export default function Loader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  const tips = [
    "Best experienced on a laptop or desktop.",
    "Scroll slowly to navigate through space.",
    "Move your mouse — the astronaut follows your gaze.",
    "The full journey takes about 30 seconds.",
  ];

  useEffect(() => {
    const start    = performance.now();
    const duration = 2900;

    const tick = () => {
      const p = Math.min((performance.now() - start) / duration, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const tipTimer  = setInterval(() => setTipIdx((t) => (t + 1) % tips.length), 3000);
    const doneTimer = setTimeout(onComplete, 3300);

    return () => {
      clearInterval(tipTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Stars />

      {/* Moon surface line */}
      <div style={{ position: "absolute", bottom: "24%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.04)" }} />

      {/* Astronaut group */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
        <AstronautSVG />

        {/* Shadow */}
        <div
          className="shadow-pls"
          style={{ width: 56, height: 9, borderRadius: 99, background: "rgba(255,255,255,0.18)", filter: "blur(5px)", marginTop: 4 }}
        />

        {/* Dust puffs */}
        <div style={{ position: "absolute", bottom: 8, left: "50%", marginLeft: -26, display: "flex", gap: 44 }}>
          <div className="dust-l" style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
          <div className="dust-r" style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, marginTop: 8 }}>
        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #38bdf8, #7c3aed)",
              transition: "width 0.12s linear",
              borderRadius: 99,
            }}
          />
        </div>
        <p style={{
          marginTop: 12,
          textAlign: "center",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.28)",
        }}>
          {progress < 100 ? `Preparing launch — ${progress}%` : "Ready for launch"}
        </p>
      </div>

      {/* Tips */}
      <AnimatePresence mode="wait">
        <motion.p
          key={tipIdx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.45 }}
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
            padding: "0 24px",
          }}
        >
          {tips[tipIdx]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}