import { create } from "zustand";
import Web3, { Contract } from "web3"

interface Web3Store {
    web3: Web3 | null;
    contractMap: Map<string, Contract<any>>;
    error: string;
    setWeb3: (web3: Web3 | null) => void;
    setContractMap: (contractMap: Map<string, Contract<any>>) => void;
    setError: (error: string) => void;
}

export const useWeb3Store = create<Web3Store>((set) => ({
    web3: null,
    contractMap: new Map(),
    error: '',
    setWeb3: (web3: Web3 | null) => set((prev) => ({ ...prev, web3 })),
    setContractMap: (contractMap: Map<string, Contract<any>>) => set((prev) => ({ ...prev, contractMap })),
    setError: (error: string) => set((prev) => ({ ...prev, error })),
}));

