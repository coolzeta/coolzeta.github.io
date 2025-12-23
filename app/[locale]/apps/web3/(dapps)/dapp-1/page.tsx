"use client";
import { useEffect, useState } from "react";
import web3, { Contract } from "web3";
import ZetaCoinArtifact from "./ZetaCoin/build/contracts/ZetaCoin.json";
import VaultArtifact from "./ZetaCoin/build/contracts/Vault.json";
import PriceOracleArtifact from "./ZetaCoin/build/contracts/PriceOracle.json";
import { useWeb3Store } from "@/app/store/web3Store";
import { Box, Typography, TextField, InputLabel, Button, InputAdornment, Tabs, Tab, CircularProgress } from "@mui/material";

const ZetaCoinABI = ZetaCoinArtifact.abi;
const VaultABI = VaultArtifact.abi;
const PriceOracleABI = PriceOracleArtifact.abi;

const ZetaCoinContractAddress = "0x4e705542B002A178c2e198786D3aA83459ec003e";
const VaultContractAddress = "0x24836b77E0db470bae70816Ed673D0896D83d48B";
const PriceOracleContractAddress = "0x000A39c22620BccA82Fb0FeFb19cD4e039666642";
const PriceFeed = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
const pricePrecision = 1e8;
const collateralPrecision = 1e18;
export default function Dapp1() {
    const [loading, setLoading] = useState(false);
    const [zetaCoinContract, setZetaCoinContract] = useState<Contract<typeof ZetaCoinABI> | null>(null);
    const [vaultContract, setVaultContract] = useState<Contract<typeof VaultABI> | null>(null);
    const [priceOracleContract, setPriceOracleContract] = useState<Contract<typeof PriceOracleABI> | null>(null);
    const [error, setError] = useState('');
    const web3 = useWeb3Store(state => state.web3);
    const contractMap = useWeb3Store(state => state.contractMap);
    const network = useWeb3Store(state => state.network);
    const [valutAddress, setValutAddress] = useState('');
    const [zetaCoinContractAddress, setZetaCoinContractAddress] = useState('');
    const [oracleContractAddress, setOracleContractAddress] = useState('');
    const [priceFeed, setPriceFeed] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [borrowAmount, setBorrowAmount] = useState('');
    const [repayAmount, setRepayAmount] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [ethUsdValue, setEthUsdValue] = useState(0);
    const account = useWeb3Store(state => state.account);
    const [toAddressForZetaCoin, setToAddressForZetaCoin] = useState('');
    const [isTransationRequesting, setIsTransationRequesting] = useState(false);
    type VaultInfo = {
        collateralAmountOfVault: number;
        debtAmountOfVault: number;
        isLiquidatableOrNot: boolean;
        availableToBorrow: number;
    }
    const [vaultInfo, setVaultInfo] = useState<VaultInfo>();
    type ZetaCoinInfo = {
        totalSupply: number;
        balanceOf: number;
    }
    const [zetaCoinInfo, setZetaCoinInfo] = useState<ZetaCoinInfo>();
    useEffect(() => {
        if (web3 && contractMap) {
            setZetaCoinContract(new web3.eth.Contract(ZetaCoinABI, ZetaCoinContractAddress));
            setVaultContract(new web3.eth.Contract(VaultABI, VaultContractAddress));
            setPriceOracleContract(new web3.eth.Contract(PriceOracleABI, PriceOracleContractAddress));
            if (network !== 11155111) {
                setError('Please switch to Sepolia network');
            } else {
                setError('');
            }
            setLoading(false);
        }
    }, [web3, contractMap, network]);
    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Typography variant="h1" sx={{ color: 'primary.main' }}>Error</Typography>
                <Typography variant="body1" sx={{ color: 'primary.main' }}>{error}</Typography>
            </Box>
        )
    }
    const setValutAddressForZetaCoin = async () => {
        if (zetaCoinContract && web3) {
            setIsTransationRequesting(true);
            await zetaCoinContract.methods.setVault(web3.utils.toChecksumAddress(valutAddress)).send({ from: account });
            setIsTransationRequesting(false);
        }
    }

    const setZetaCoinAddressForVault = async () => {
        if (vaultContract && web3) {
            setIsTransationRequesting(true);
            await vaultContract.methods.setZetaCoin(web3.utils.toChecksumAddress(zetaCoinContractAddress)).send({ from: account });
            setIsTransationRequesting(false);
        }
    }

    const setOracleAddressForVault = async () => {
        if (vaultContract && web3) {
            setIsTransationRequesting(true);
            await vaultContract.methods.setOracle(web3.utils.toChecksumAddress(oracleContractAddress)).send({ from: account });
            setIsTransationRequesting(false);
        }
    }

    const setPriceFeedForOracle = async () => {
        console.log(priceFeed);
        if (priceOracleContract && web3) {
            setIsTransationRequesting(true);
            await priceOracleContract.methods.updatePriceFeed(web3.utils.toChecksumAddress(priceFeed)).send({ from: account });
            setIsTransationRequesting(false);
        }
    }
    const transferZetaCoin = async () => {
        if (zetaCoinContract && web3) {
            setIsTransationRequesting(true);
            await zetaCoinContract.methods.transfer(web3.utils.toChecksumAddress(toAddressForZetaCoin), depositAmount).send({ from: account });
            setIsTransationRequesting(false);
        }
    }
    const deposit = async () => {
        if (vaultContract && web3) {
            setIsTransationRequesting(true);
            await vaultContract.methods.deposit().send({ from: account, value: web3.utils.toWei(depositAmount, 'ether') });
            setIsTransationRequesting(false);
        }
    }
    const withdraw = async () => {
        if (vaultContract && web3) {
            setIsTransationRequesting(true);
            await vaultContract.methods.withdraw().send({ from: account, value: web3.utils.toWei(withdrawAmount, 'ether') });
            setIsTransationRequesting(false);
        }
    }
    const borrow = async () => {
        if (vaultContract && web3) {
            setIsTransationRequesting(true);
            await vaultContract.methods.borrowZeta(web3.utils.toWei(borrowAmount, 'ether')).send({ from: account });
            setIsTransationRequesting(false);
        }
    }
    const repay = async () => {
        if (vaultContract && web3) {
            setIsTransationRequesting(true);
            await vaultContract.methods.repayZeta(web3.utils.toWei(repayAmount, 'ether')).send({ from: account });
            setIsTransationRequesting(false);
        }
    }
    const getTotalBalance = async () => {
        if (vaultContract && web3) {
            try {
                console.log(account);
                const vaultInfo = await vaultContract.methods.getVaultInfo(account).call();
                console.log(vaultInfo);
                if (vaultInfo) {
                    setVaultInfo({
                        collateralAmountOfVault: Number(vaultInfo[0]) / collateralPrecision,
                        debtAmountOfVault: Number(vaultInfo[1]) / collateralPrecision,
                        isLiquidatableOrNot: vaultInfo[2],
                        availableToBorrow: Number(vaultInfo[3]) / collateralPrecision
                    });
                }
            } catch (error) {
                console.error("vault error", error);
            }
        }
    }

    const getZetaCoinInfo = async () => {
        if (zetaCoinContract && web3) {
            try {
                const zetaCoinInfo = await zetaCoinContract.methods.balanceOf(account).call() as string;
                const totalSupply = await zetaCoinContract.methods.totalSupply().call() as string;
                console.log(zetaCoinInfo, totalSupply);
                if (zetaCoinInfo && totalSupply) {
                    setZetaCoinInfo({
                        totalSupply: Number(web3.utils.fromWei(totalSupply, 'ether')),
                        balanceOf: Number(web3.utils.fromWei(zetaCoinInfo, 'ether'))
                    });
                }
            } catch (error) {
                console.error("zetaCoin error", error);
            }
        }
    }

    const getEthUsdValue = async () => {
        if (priceOracleContract && web3) {
            try {
                const ethUsdValue = await priceOracleContract.methods.getEthUsdPrice().call();
                if (ethUsdValue) {
                    setEthUsdValue(Number(ethUsdValue) / pricePrecision);
                }
            } catch (error) {
                console.error("oracle error", error);
            }
        }
    }



    useEffect(() => {
        if (web3 && account && priceOracleContract && vaultContract && zetaCoinContract) {
            getZetaCoinInfo();
            getEthUsdValue();
            getTotalBalance();
        }
    }, [vaultContract, web3, zetaCoinContract, priceOracleContract, account]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {
                process?.env?.NODE_ENV === 'development' && false && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h1" sx={{ color: 'primary.main' }}>Admin Only</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <InputLabel>Current Valut Address For ZetaCoin: {VaultContractAddress}</InputLabel>
                            <TextField
                                value={valutAddress}
                                onChange={(e) => setValutAddress(e.target.value)}
                            />
                            <Button onClick={setValutAddressForZetaCoin}>Reset</Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <InputLabel>Current ZetaCoin Address For Vault: {ZetaCoinContractAddress}</InputLabel>
                            <TextField
                                value={zetaCoinContractAddress}
                                onChange={(e) => setZetaCoinContractAddress(e.target.value)}
                            />
                            <Button onClick={setZetaCoinAddressForVault}>Reset</Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <InputLabel>Current Oracle Address For Vault: {PriceOracleContractAddress}</InputLabel>
                            <TextField
                                value={oracleContractAddress}
                                onChange={(e) => setOracleContractAddress(e.target.value)}
                            />
                            <Button onClick={setOracleAddressForVault}>Reset</Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <InputLabel>Current Price Feed For Oracle: {PriceFeed}</InputLabel>
                            <TextField
                                value={priceFeed}
                                onChange={(e) => setPriceFeed(e.target.value)}
                            />
                            <Button onClick={setPriceFeedForOracle}>Reset</Button>
                        </Box>
                    </Box>
                )
            }
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: { xs: '100%', md: 480 },
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                height: '500px'
            }}>
                <Typography sx={{ color: 'primary.main', fontSize: 24, alignSelf: 'center', mt: 2 }}>ZetaCoin Wallet</Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, width: '100%' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => {
                            setActiveTab(newValue)
                        }}
                        allowScrollButtonsMobile
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-scrollButtons': {
                                '&.Mui-disabled': { opacity: 0.3 },
                                '&.Mui-selected': {
                                    color: 'primary.main'
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'primary.main',
                                height: 3
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'primary.main',
                                fontSize: 24
                            },
                            '&::-webkit-scrollbar': {
                                height: '8px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                                borderRadius: '4px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                '&:hover': {
                                    backgroundColor: '#555'
                                }
                            }

                        }}
                    >
                        <Tab label="ETH Balance" onClick={getTotalBalance} />
                        <Tab label="ZETA Balance" onClick={getZetaCoinInfo} />
                        <Tab label="Deposit" />
                        <Tab label="Withdraw" />
                        <Tab label="Borrow" />
                        <Tab label="Repay" />
                    </Tabs>
                </Box>
                <Box sx={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minWidth: '100%', width: '100%', p: 4 }}>
                    {activeTab === 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Total ETH Collateral
                            </Typography>
                            <Typography variant="h3" color="primary" gutterBottom>
                                {vaultInfo?.collateralAmountOfVault ?? 0} ETH
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                ≈ ${vaultInfo?.collateralAmountOfVault ? vaultInfo?.collateralAmountOfVault * ethUsdValue : "0"}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Total ZETA Debt
                            </Typography>
                            <Typography variant="h3" color="primary" gutterBottom>
                                {vaultInfo?.debtAmountOfVault ?? 0} ZETA
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                current price: ${ethUsdValue ?? '-'}
                            </Typography>
                        </Box>
                    )}

                    {activeTab === 1 && (
                        <Box sx={{ display: 'flex', my: 'auto', flexDirection: 'column', gap: 2, width: '100%' }}>
                            <Typography variant="subtitle1" color="text.secondary">Total ZETA Balance</Typography>
                            <Typography variant="h3" color="primary" gutterBottom>{zetaCoinInfo?.balanceOf ?? 0} ZETA</Typography>
                            <TextField
                                label="Amount"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">ZETA</InputAdornment>,
                                }}
                                fullWidth
                            />
                            <TextField
                                label="To"
                                value={toAddressForZetaCoin}
                                onChange={(e) => setToAddressForZetaCoin(e.target.value)}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                onClick={transferZetaCoin}
                                disabled={isTransationRequesting}
                                fullWidth
                            >
                                Transfer
                            </Button>
                        </Box>
                    )}

                    {activeTab === 2 && (
                        <Box sx={{ display: 'flex', my: 'auto', flexDirection: 'column', gap: 2, width: '100%' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Deposit ETH</Typography>
                            <TextField
                                label="Amount"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                                }}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                onClick={deposit}
                                fullWidth
                                size="large"
                                disabled={isTransationRequesting}
                            >
                                Deposit
                            </Button>
                        </Box>
                    )}
                    {activeTab === 3 && (
                        <Box sx={{ display: 'flex', my: 'auto', flexDirection: 'column', gap: 2, width: '100%' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Withdraw ETH</Typography>
                            <TextField
                                label="Amount"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                                }}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                onClick={withdraw}
                                fullWidth
                                size="large"
                                disabled={isTransationRequesting}
                            >
                                Withdraw
                            </Button>
                        </Box>
                    )}
                    {activeTab === 4 && (
                        <Box sx={{ display: 'flex', my: 'auto', flexDirection: 'column', gap: 2, width: '100%' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Borrow ZETA</Typography>
                            <TextField
                                label="Amount"
                                value={borrowAmount}
                                onChange={(e) => setBorrowAmount(e.target.value)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">ZETA</InputAdornment>,
                                }}
                                fullWidth
                            />
                            <Typography variant="subtitle1" color="text.secondary">Total Borrowable: {vaultInfo?.availableToBorrow ?? 0} ZETA</Typography>
                            <Button
                                variant="contained"
                                onClick={borrow}
                                fullWidth
                                size="large"
                                disabled={isTransationRequesting}
                            >
                                Borrow
                            </Button>
                        </Box>
                    )}
                    {activeTab === 5 && (
                        <Box sx={{ display: 'flex', my: 'auto', flexDirection: 'column', gap: 2, width: '100%' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Repay ZETA</Typography>
                            <TextField
                                label="Amount"
                                value={repayAmount}
                                onChange={(e) => setRepayAmount(e.target.value)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">ZETA</InputAdornment>,
                                }}
                                fullWidth
                            />
                            <Typography variant="subtitle1" color="text.secondary">Total ZETA Balance: {zetaCoinInfo?.balanceOf ?? 0} ZETA</Typography>
                            <Button
                                variant="contained"
                                onClick={repay}
                                fullWidth
                                size="large"
                                disabled={isTransationRequesting}
                            >
                                Repay
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
