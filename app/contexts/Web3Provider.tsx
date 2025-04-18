"use client"
import { useEffect } from "react";
import { useWeb3Store } from "../store/web3Store";
import Web3 from "web3";

export default function ContractProvider({ children }: { children: React.ReactNode }) {
    const setWeb3 = useWeb3Store(state => state.setWeb3);
    const setError = useWeb3Store(state => state.setError);
    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            setWeb3(web3);
        } else {
            setError("No Ethereum wallet found");
        }
    }, []);
    return (
        <>
            {children}
        </>
    );
}
