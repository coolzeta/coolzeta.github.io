"use client"
import { useEffect, useRef } from "react";
import { useWeb3Store } from "../store/web3Store";
import Web3 from "web3";
import { Button } from "@mui/material";

export default function Web3Provider({ children }: { children: React.ReactNode }) {
    const setWeb3 = useWeb3Store(state => state.setWeb3);
    const setError = useWeb3Store(state => state.setError);
    const error = useWeb3Store(state => state.error);
    const setNetwork = useWeb3Store(state => state.setNetwork);
    const setAccount = useWeb3Store(state => state.setAccount);
    const listenersAddedRef = useRef(false);

    async function requestAccounts() {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setAccount(web3.utils.toChecksumAddress(accounts[0]));
                if (!accounts || !accounts.length) {
                    setError("No accounts found. Please connect your wallet.");
                    return;
                }
                const currentNetwork = await web3.eth.getChainId();
                setNetwork(Number(currentNetwork));

                if (!listenersAddedRef.current) {
                    window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
                        setAccount(web3.utils.toChecksumAddress(newAccounts[0]));
                        if (!newAccounts.length) {
                            setError("Wallet disconnected. Please reconnect to continue.");
                            setWeb3(null);
                        }
                    });

                    window.ethereum.on('chainChanged', (chainId: BigInt) => {
                        setNetwork(Number(chainId));
                    });

                    listenersAddedRef.current = true;
                }

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
