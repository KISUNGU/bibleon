import create from 'zustand';
import { BibleReference } from '../types';

interface BibleStore {
  currentReference: BibleReference;
  setCurrentReference: (reference: BibleReference) => void;
}

export const useBibleStore = create<BibleStore>((set) => ({
  currentReference: {
    book: 'Genèse',
    chapter: 1,
    verse: 1,
  },
  setCurrentReference: (reference) => set({ currentReference: reference }),
}));