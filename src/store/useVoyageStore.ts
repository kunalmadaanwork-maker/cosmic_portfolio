// store/useVoyageStore.ts
import { create } from 'zustand';

export type Phase = 'LOADING' | 'PAD' | 'LIFTOFF' | 'VOID' | 'PLANET' | 'WORMHOLE' | 'NEBULA' | 'SINGULARITY';

interface VoyageState {
  phase: Phase;
  scrollProgress: number;
  bloomIntensity: number;
  bloomThreshold: number;
  setPhase: (phase: Phase) => void;
  setScrollProgress: (progress: number) => void;
  setBloom: (intensity: number, threshold: number) => void;
  resetVoyage: () => void;
}

export const useVoyageStore = create<VoyageState>((set) => ({
  phase: 'PAD',
  scrollProgress: 0,
  bloomIntensity: 1.5,
  bloomThreshold: 0.8,
  setPhase: (phase) => set({ phase }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setBloom: (bloomIntensity, bloomThreshold) => set({ bloomIntensity, bloomThreshold }),
  resetVoyage: () => set({ 
    phase: 'PAD', 
    scrollProgress: 0, 
    bloomIntensity: 1.5, 
    bloomThreshold: 0.8 
  }),
}));