import { create } from 'zustand';

interface MiningStatusStore {
    isMining: boolean;
    setIsMining: (isMining: boolean) => void;
    currentNonce: number;
    setCurrentNonce: (currentNonce: number) => void;
    currentHash: string;
    setCurrentHash: (currentHash: string) => void;
    targetHash: string;
    setTargetHash: (targetHash: string) => void;
    miningProgress: number;
    setMiningProgress: (miningProgress: number) => void;
}

export const useMiningStatusStore = create<MiningStatusStore>((set) => ({
    isMining: false,
    setIsMining: (isMining: boolean) => set({ isMining }),
    currentNonce: 0,
    setCurrentNonce: (currentNonce: number) => set({ currentNonce }),
    currentHash: '',
    setCurrentHash: (currentHash: string) => set({ currentHash }),
    targetHash: '',
    setTargetHash: (targetHash: string) => set({ targetHash }),
    miningProgress: 0,
    setMiningProgress: (miningProgress: number) => set({ miningProgress }),
}));