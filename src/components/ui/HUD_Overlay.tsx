"use client";

import React from "react";

export default function HUD_Overlay() {
  const transparentStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    border: 'none',
    outline: 'none',
  };

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center" 
      style={transparentStyle}
    >
      {/* Cockpit Frame - The subtle dark border that frames the view */}
      <div 
        className="absolute inset-0 border-[40px] border-black/20 pointer-events-none" 
        style={transparentStyle} 
      />
      
      {/* Corner Brackets - Technical aesthetics */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-cyan-500/50" style={transparentStyle} />
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-cyan-500/50" style={transparentStyle} />
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-cyan-500/50" style={transparentStyle} />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-cyan-500/50" style={transparentStyle} />

      {/* Center Reticle - The focal point of the voyage */}
      <div 
        className="w-12 h-12 border border-cyan-500/30 rounded-full flex items-center justify-center" 
        style={transparentStyle}
      >
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
}