import { create } from 'zustand';

export type Phase = 'LOADING' | 'PAD' | 'LIFTOFF' | 'VOID' | 'PLANET' | 'NEBULA' | 'BLACKHOLE' | 'SINGULARITY' | 'LANDING';

export const globalBloom = { intensity: 1.5, threshold: 0.8 };

interface VoyageState {
  phase: Phase;
  progress: number; 
  setProgress: (progress: number) => void;
  setPhase: (phase: Phase) => void;
  resetVoyage: () => void;
}

export const useVoyageStore = create<VoyageState>((set) => ({
  phase: 'LOADING', 
  progress: 0,
  setProgress: (progress) => set({ progress }),
  setPhase: (phase) => set({ phase }),
  resetVoyage: () => set({ phase: 'PAD', progress: 0 }),
}));