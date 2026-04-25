// ─────────────────────────────────────────────────────────────
//  DataPanel  –  cinematic overlay that fades in when camera
//  slows near a point of interest.
//
//  Design: minimal, doesn't fight the 3D scene.
//  Bottom-left for narrative text, top-right for project cards.
// ─────────────────────────────────────────────────────────────
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

// ── Generic fade-in panel wrapper ─────────────────────────────
function FadePanel({
  children,
  id,
  position = "bottom-left",
}: {
  children: React.ReactNode;
  id: string;
  position?: "bottom-left" | "top-right" | "center";
}) {
  const posClass =
    position === "bottom-left"
      ? "bottom-16 left-12"
      : position === "top-right"
      ? "top-24 right-12"
      : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${posClass} max-w-sm pointer-events-auto`}
    >
      {children}
    </motion.div>
  );
}

// ── Divider line ──────────────────────────────────────────────
function Divider({ color = "#38bdf8" }: { color?: string }) {
  return (
    <div
      className="w-10 h-px my-3"
      style={{ background: color }}
    />
  );
}

// ── Zone: void  ("who I am") ──────────────────────────────────
function VoidPanel() {
  return (
    <FadePanel id="void" position="bottom-left">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-sky-400 mb-2">
        Transmission received
      </p>
      <h1 className="font-display text-5xl uppercase leading-none text-white">
        {portfolioData.name}
      </h1>
      <Divider color="#38bdf8" />
      <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-3">
        {portfolioData.role}
      </p>
      <p className="font-sans text-sm text-white/55 leading-relaxed max-w-[280px]">
        {portfolioData.about}
      </p>
    </FadePanel>
  );
}

// ── Zone: project ─────────────────────────────────────────────
function ProjectPanel({ projIndex }: { projIndex: number }) {
  const proj = portfolioData.projects[projIndex];
  if (!proj) return null;

  return (
    <FadePanel id={`project-${proj.id}`} position="top-right">
      <div
        className="p-5 rounded-lg border border-white/8 backdrop-blur-sm"
        style={{
          background: "rgba(0,0,0,0.55)",
          boxShadow: `0 0 40px ${proj.accentColor}18`,
        }}
      >
        {/* Accent line */}
        <div className="w-8 h-px mb-3" style={{ background: proj.accentColor }} />

        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35 mb-1">
          {proj.category}
        </p>
        <h2
          className="font-display text-3xl uppercase leading-none mb-3"
          style={{ color: proj.accentColor }}
        >
          {proj.title}
        </h2>
        <p className="font-sans text-xs text-white/50 leading-relaxed mb-4">
          {proj.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {proj.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                border: `1px solid ${proj.accentColor}40`,
                color: proj.accentColor + "bb",
                background: proj.accentColor + "10",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={proj.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest transition-opacity duration-200 hover:opacity-70"
          style={{ color: proj.accentColor }}
        >
          View project ↗
        </a>
      </div>
    </FadePanel>
  );
}

// ── Zone: skills ──────────────────────────────────────────────
function SkillsPanel() {
  return (
    <FadePanel id="skills" position="bottom-left">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-violet-400 mb-3">
        Systems online
      </p>
      <div className="flex flex-wrap gap-2 max-w-[300px]">
        {portfolioData.skills.map((s) => (
          <span
            key={s}
            className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded"
            style={{
              border: "1px solid rgba(167,139,250,0.25)",
              color: "rgba(167,139,250,0.8)",
              background: "rgba(167,139,250,0.07)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </FadePanel>
  );
}

// ── Zone: experience ──────────────────────────────────────────
function ExperiencePanel() {
  return (
    <FadePanel id="experience" position="bottom-left">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-orange-400 mb-4">
        Mission log
      </p>
      <div className="space-y-4 max-w-[300px]">
        {portfolioData.experience.map((e, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                style={{ background: "#fb923c", boxShadow: "0 0 6px #fb923c" }}
              />
              {i < portfolioData.experience.length - 1 && (
                <div className="w-px flex-1 mt-1" style={{ background: "rgba(251,146,60,0.15)" }} />
              )}
            </div>
            <div className="pb-2">
              <p className="font-mono text-[8px] text-orange-400/60 uppercase tracking-widest">
                {e.year}
              </p>
              <p className="font-mono text-xs text-white/80 mt-0.5">{e.role}</p>
              <p className="font-mono text-[10px] text-orange-400/50">{e.company}</p>
              <p className="font-sans text-[11px] text-white/40 mt-1 leading-relaxed">
                {e.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </FadePanel>
  );
}

// ── Zone: contact ─────────────────────────────────────────────
function ContactPanel() {
  return (
    <FadePanel id="contact" position="center">
      <div className="text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-violet-400 mb-4">
          End of voyage
        </p>
        <h2 className="font-display text-5xl uppercase text-white leading-none mb-2">
          Let's build
        </h2>
        <h2 className="font-display text-5xl uppercase leading-none mb-5"
          style={{ color: "#a78bfa" }}>
          something cosmic
        </h2>
        <p className="font-sans text-sm text-white/40 mb-8 max-w-[240px] mx-auto leading-relaxed">
          Open to new missions. Send a transmission.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className="font-mono text-[10px] uppercase tracking-widest px-6 py-3 border border-violet-500/50 text-violet-300 hover:bg-violet-500/10 transition-colors duration-300"
          >
            Email ↗
          </a>
          <a
            href={portfolioData.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-widest px-6 py-3 border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70 transition-all duration-300"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </FadePanel>
  );
}

// ── Master switcher ───────────────────────────────────────────
export default function DataPanels({ activeZone }: { activeZone: string | null }) {
  return (
    // pointer-events-none on wrapper; individual panels opt back in
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <AnimatePresence mode="wait">
        {activeZone === "void"       && <VoidPanel />}
        {activeZone === "project-1"  && <ProjectPanel projIndex={0} />}
        {activeZone === "skills"     && <SkillsPanel />}
        {activeZone === "project-2"  && <ProjectPanel projIndex={1} />}
        {activeZone === "project-3"  && <ProjectPanel projIndex={2} />}
        {activeZone === "experience" && <ExperiencePanel />}
        {activeZone === "contact"    && <ContactPanel />}
      </AnimatePresence>
    </div>
  );
}
