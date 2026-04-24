"use client";

import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

interface DataPanelProps {
  isOpen: boolean;
  title: string;
  category?: string;
  description: string;
  link?: string;
  tech?: string[];
  color?: string;
  panelId?: string;
}

export default function DataPanel({
  isOpen,
  title,
  category,
  description,
  link,
  tech,
  color = "#22d3ee",
  panelId,
}: DataPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={panelId || title}
          initial={{ x: "110%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "110%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-[120] w-80 md:w-[360px] pointer-events-auto"
        >
          {/* Outer glow border */}
          <div
            className="absolute -inset-px rounded-xl opacity-40"
            style={{
              background: `linear-gradient(135deg, ${color}44, transparent 60%)`,
            }}
          />

          {/* Main panel */}
          <div
            className="relative rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl overflow-hidden panel-scan-line"
            style={{ boxShadow: `0 0 60px ${color}22, 0 24px 48px rgba(0,0,0,0.6)` }}
          >
            {/* Accent top line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            />

            <div className="p-6">
              {/* Header row */}
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-60">
                  Data_Entry_Found
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-display text-4xl uppercase tracking-tight mb-0.5 leading-none"
                style={{ color }}
              >
                {title}
              </h2>

              {/* Category */}
              {category && (
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">
                  {category}
                </p>
              )}

              {/* Description */}
              <p className="font-mono text-xs text-white/55 leading-relaxed mb-5">
                {description}
              </p>

              {/* Tech tags */}
              {tech && tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border"
                      style={{
                        borderColor: `${color}50`,
                        color: `${color}cc`,
                        background: `${color}0d`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Action link */}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border font-mono text-[10px] uppercase tracking-widest transition-all duration-300 hover:bg-white/5"
                  style={{ borderColor: `${color}60`, color }}
                >
                  View_Archive
                  <span className="text-base leading-none">↗</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Convenience wrapper that wires up portfolio data automatically ───────────
export function PortfolioDataPanels({
  activePanelId,
}: {
  activePanelId: string | null;
}) {
  return (
    <>
      {/* Hero / About */}
      <DataPanel
        isOpen={activePanelId === "hero"}
        panelId="hero"
        title={portfolioData.name}
        category={portfolioData.role}
        description={portfolioData.about}
        color="#22d3ee"
      />

      {/* Projects */}
      {portfolioData.projects.map((proj) => (
        <DataPanel
          key={proj.id}
          isOpen={activePanelId === `project-${proj.id}`}
          panelId={`project-${proj.id}`}
          title={proj.title}
          category={proj.category}
          description={proj.description}
          tech={proj.tech}
          link={proj.link}
          color={proj.color}
        />
      ))}

      {/* Contact */}
      <DataPanel
        isOpen={activePanelId === "contact"}
        panelId="contact"
        title="Uplink"
        category="Communication · Open to work"
        description="Ready to discuss the next mission? Send a transmission and let's build something extraordinary together."
        link={`mailto:${portfolioData.contact.email}`}
        color="#f59e0b"
      />
    </>
  );
}