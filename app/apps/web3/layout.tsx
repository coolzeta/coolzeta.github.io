"use client"
import Web3Provider from "@/app/contexts/Web3Provider";
import { useWeb3Store } from "@/app/store/web3Store";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function Web3Layout({ children }: { children: React.ReactNode }) {
    const error = useWeb3Store(state => state.error);
    const router = useRouter();
    if (error) {
        return <div>
            <h1>Error</h1>
            <p>{error}</p>
            <Button onClick={() => router.push("/")}>Go to home</Button>
        </div>;
    }
    return (
        <Web3Provider>
            <div>
                {children}
            </div>
        </Web3Provider>
    );
}

export default Web3Layout;
