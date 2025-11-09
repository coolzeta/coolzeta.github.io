"use client"
import Loading from "@/app/components/Loading";
import Web3Provider from "@/app/contexts/Web3Provider";
import { useWeb3Store } from "@/app/store/web3Store";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

function Web3Layout({ children }: { children: React.ReactNode }) {
    const error = useWeb3Store(state => state.error);
    const web3 = useWeb3Store(state => state.web3);
    const router = useRouter();
    return (
        <Web3Provider>
            {
                !error && web3 ?
                    <div>
                        {children}
                    </div> :
                    (error ?
                        <div>
                            <Typography variant="h1" sx={{ color: 'primary.main' }}>Error</Typography>
                            <Typography variant="body1" sx={{ color: 'primary.main' }}>{error}</Typography>
                            <Button onClick={() => router.push("/")}>Go to home</Button>
                        </div>
                        :
                        <Loading />)
            }
        </Web3Provider>
    );
}

export default Web3Layout;
