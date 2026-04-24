"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DataPanelProps {
  isOpen: boolean;
  title: string;
  category?: string;
  description: string;
  link?: string;
}

export default function DataPanel({ isOpen, title, category, description, link }: DataPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed right-10 top-1/2 -translate-y-1/2 z-[60] w-80 md:w-96 p-6 border border-cyan-500/30 bg-black/40 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.1)] font-mono"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold">Data_Entry_Found</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl text-white font-bold uppercase tracking-tighter mb-1">
            {title}
          </h2>
          
          {category && (
            <p className="text-xs text-cyan-500 uppercase tracking-widest mb-4">{category}</p>
          )}
          
          <p className="text-cyan-100/60 text-sm leading-relaxed mb-6">
            {description}
          </p>

          {link && (
            <a 
              href={link} 
              target="_blank" 
              className="inline-block px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 uppercase text-[10px] tracking-widest"
            >
              View_Archive
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}