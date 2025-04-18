"use client"
import { useEffect } from "react";
import { useWeb3Store } from "../store/web3Store";
import Web3 from "web3";
import { Button } from "@mui/material";

export default function Web3Provider({ children }: { children: React.ReactNode }) {
    const setWeb3 = useWeb3Store(state => state.setWeb3);
    const setError = useWeb3Store(state => state.setError);
    const error = useWeb3Store(state => state.error)
    async function requestAccounts() {
        if (window.ethereum) {
            setError("Please allow the request to explore all contents");
            console.log("requesting accounts")
            const web3 = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                if (!accounts || !accounts.length) {
                    setError("No accounts found. Please connect your wallet.");
                    return;
                }
                window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
                    if (!newAccounts.length) {
                        setError("Wallet disconnected. Please reconnect to continue.");
                        setWeb3(null);
                    }
                });
                setError("");
                setWeb3(web3);
            } catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("User rejected")) {
                        setError("You rejected the connection request. Please try again.");
                    } else {
                        setError("Failed to connect wallet: " + err.message);
                    }
                }
                setWeb3(null);
            }
        } else {
            setError("No Ethereum wallet found, please use a browser with Ethereum wallect like MetaMask to explores all contents.");
        }
    }
    useEffect(() => {
        requestAccounts();
    }, []);
    return (
        <>
            {error && <Button sx={{ fontSize: 30, backgroundColor: "primary.main", color: "white", m: 5 }} onClick={() => {
                requestAccounts()
            }}>No Wallet Found, Click to Retry</Button>}
            {children}
        </>
    );
}
