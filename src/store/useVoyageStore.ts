// src/store/useVoyageStore.ts
import { create } from 'zustand';

export type Phase = 'LOADING' | 'PAD' | 'LIFTOFF' | 'VOID' | 'PLANET' | 'WORMHOLE' | 'NEBULA' | 'SINGULARITY' | 'LANDING';

// ARCHITECTURAL FIX: Global mutable object for 60fps animations. 
// This prevents React from re-rendering the entire canvas 60 times a second.
export const globalBloom = { intensity: 1.5, threshold: 0.8 };

interface VoyageState {
  phase: Phase;
  setPhase: (phase: Phase) => void;
  resetVoyage: () => void;
}

export const useVoyageStore = create<VoyageState>((set) => ({
  phase: 'LOADING', 
  setPhase: (phase) => set({ phase }),
  resetVoyage: () => set({ phase: 'PAD' }),
}));