"use client";
import { useEffect, useState, useCallback } from "react";
import web3, { Contract } from "web3";
import ZetaCoinArtifact from "./ZetaCoin/build/contracts/ZetaCoin.json";
import VaultArtifact from "./ZetaCoin/build/contracts/Vault.json";
import PriceOracleArtifact from "./ZetaCoin/build/contracts/PriceOracle.json";
import { useWeb3Store } from "@/app/store/web3Store";
import { Box, Typography, TextField, Button, InputAdornment, Tabs, Tab, Card, CardContent, Divider, alpha } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SendIcon from '@mui/icons-material/Send';

const ZetaCoinABI = ZetaCoinArtifact.abi;
const VaultABI = VaultArtifact.abi;
const PriceOracleABI = PriceOracleArtifact.abi;

const ZetaCoinContractAddress = "0x4e705542B002A178c2e198786D3aA83459ec003e";
const VaultContractAddress = "0x24836b77E0db470bae70816Ed673D0896D83d48B";
const PriceOracleContractAddress = "0x000A39c22620BccA82Fb0FeFb19cD4e039666642";
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
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [borrowAmount, setBorrowAmount] = useState('');
    const [repayAmount, setRepayAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
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

    const getTotalBalance = useCallback(async () => {
        if (vaultContract && web3) {
            try {
                const vaultInfo = await vaultContract.methods.getVaultInfo(account).call();
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
    }, [vaultContract, web3, account]);

    const getZetaCoinInfo = useCallback(async () => {
        if (zetaCoinContract && web3) {
            try {
                const zetaCoinInfo = await zetaCoinContract.methods.balanceOf(account).call() as string;
                const totalSupply = await zetaCoinContract.methods.totalSupply().call() as string;
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
    }, [zetaCoinContract, web3, account]);

    const getEthUsdValue = useCallback(async () => {
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
    }, [priceOracleContract, web3]);

    useEffect(() => {
        if (web3 && account && priceOracleContract && vaultContract && zetaCoinContract) {
            getZetaCoinInfo();
            getEthUsdValue();
            getTotalBalance();
        }
    }, [web3, account, priceOracleContract, vaultContract, zetaCoinContract, getZetaCoinInfo, getEthUsdValue, getTotalBalance]);

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Card sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'error.main', mb: 2 }}>错误</Typography>
                    <Typography variant="body1" color="text.secondary">{error}</Typography>
                </Card>
            </Box>
        )
    }

    const transferZetaCoin = async () => {
        if (zetaCoinContract && web3 && transferAmount) {
            setIsTransationRequesting(true);
            try {
                await zetaCoinContract.methods.transfer(
                    web3.utils.toChecksumAddress(toAddressForZetaCoin),
                    web3.utils.toWei(transferAmount, 'ether')
                ).send({ from: account });
            } catch (error) {
                console.error("Transfer error:", error);
            }
            setIsTransationRequesting(false);
        }
    };

    const deposit = async () => {
        if (vaultContract && web3 && depositAmount) {
            setIsTransationRequesting(true);
            try {
                await vaultContract.methods.deposit().send({
                    from: account,
                    value: web3.utils.toWei(depositAmount, 'ether')
                });
            } catch (error) {
                console.error("Deposit error:", error);
            }
            setIsTransationRequesting(false);
        }
    };

    const withdraw = async () => {
        if (vaultContract && web3 && withdrawAmount) {
            setIsTransationRequesting(true);
            try {
                await vaultContract.methods.withdraw(
                    web3.utils.toWei(withdrawAmount, 'ether')
                ).send({ from: account });
            } catch (error) {
                console.error("Withdraw error:", error);
            }
            setIsTransationRequesting(false);
        }
    };

    const borrow = async () => {
        if (vaultContract && web3 && borrowAmount) {
            setIsTransationRequesting(true);
            try {
                await vaultContract.methods.borrowZeta(
                    web3.utils.toWei(borrowAmount, 'ether')
                ).send({ from: account });
            } catch (error) {
                console.error("Borrow error:", error);
            }
            setIsTransationRequesting(false);
        }
    };

    const repay = async () => {
        if (vaultContract && web3 && repayAmount) {
            setIsTransationRequesting(true);
            try {
                await vaultContract.methods.repayZeta(
                    web3.utils.toWei(repayAmount, 'ether')
                ).send({ from: account });
            } catch (error) {
                console.error("Repay error:", error);
            }
            setIsTransationRequesting(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 6,
            px: 2
        }}>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
                    <Typography variant="h3" sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        ZetaCoin 钱包
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                        去中心化抵押借贷平台
                    </Typography>
                </Box>

                {/* Main Card */}
                <Card sx={{
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    background: (theme) => alpha(theme.palette.background.paper, 0.95),
                    backdropFilter: 'blur(20px)'
                }}>
                    {/* Tabs */}
                    <Box sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        background: (theme) => alpha(theme.palette.primary.main, 0.05)
                    }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    minHeight: 64,
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: (theme) => alpha(theme.palette.primary.main, 0.08)
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab icon={<AccountBalanceWalletIcon />} iconPosition="start" label="ETH 余额" />
                            <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="ZETA 余额" />
                            <Tab icon={<TrendingUpIcon />} iconPosition="start" label="存入" />
                            <Tab icon={<SwapVertIcon />} iconPosition="start" label="取出" />
                            <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="借出" />
                            <Tab icon={<SendIcon />} iconPosition="start" label="偿还" />
                        </Tabs>
                    </Box>

                    <CardContent sx={{ p: 4, minHeight: 400 }}>
                        {/* ETH Balance Tab */}
                        {activeTab === 0 && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    ETH 抵押总额
                                </Typography>
                                <Typography variant="h2" sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    my: 2
                                }}>
                                    {vaultInfo?.collateralAmountOfVault?.toFixed(4) ?? '0'} ETH
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                    ≈ ${(vaultInfo?.collateralAmountOfVault ? vaultInfo.collateralAmountOfVault * ethUsdValue : 0).toFixed(2)}
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    ZETA 债务总额
                                </Typography>
                                <Typography variant="h2" sx={{
                                    color: 'secondary.main',
                                    fontWeight: 'bold',
                                    my: 2
                                }}>
                                    {vaultInfo?.debtAmountOfVault?.toFixed(4) ?? '0'} ZETA
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    当前 ETH 价格: ${ethUsdValue?.toFixed(2) ?? '-'}
                                </Typography>
                            </Box>
                        )}

                        {/* ZETA Balance Tab */}
                        {activeTab === 1 && (
                            <Box>
                                <Box sx={{ textAlign: 'center', mb: 4 }}>
                                    <Typography variant="h6" color="text.secondary">ZETA 余额</Typography>
                                    <Typography variant="h2" color="primary.main" sx={{ fontWeight: 'bold', my: 2 }}>
                                        {zetaCoinInfo?.balanceOf?.toFixed(4) ?? '0'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">ZETA</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="数量"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">ZETA</InputAdornment>,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        label="接收地址"
                                        value={toAddressForZetaCoin}
                                        onChange={(e) => setToAddressForZetaCoin(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="0x..."
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={transferZetaCoin}
                                        disabled={isTransationRequesting || !transferAmount || !toAddressForZetaCoin}
                                        size="large"
                                        startIcon={<SendIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {isTransationRequesting ? '处理中...' : '转账'}
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Deposit Tab */}
                        {activeTab === 2 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    存入 ETH
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="数量"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={deposit}
                                        disabled={isTransationRequesting || !depositAmount}
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {isTransationRequesting ? '处理中...' : '存入'}
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Withdraw Tab */}
                        {activeTab === 3 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    取出 ETH
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="数量"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={withdraw}
                                        disabled={isTransationRequesting || !withdrawAmount}
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {isTransationRequesting ? '处理中...' : '取出'}
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Borrow Tab */}
                        {activeTab === 4 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    借出 ZETA
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="数量"
                                        value={borrowAmount}
                                        onChange={(e) => setBorrowAmount(e.target.value)}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">ZETA</InputAdornment>,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <Card sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.info.main, 0.1) }}>
                                        <Typography variant="body2" color="text.secondary">
                                            可借出总额
                                        </Typography>
                                        <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                                            {vaultInfo?.availableToBorrow?.toFixed(4) ?? '0'} ZETA
                                        </Typography>
                                    </Card>
                                    <Button
                                        variant="contained"
                                        onClick={borrow}
                                        disabled={isTransationRequesting || !borrowAmount}
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {isTransationRequesting ? '处理中...' : '借出'}
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Repay Tab */}
                        {activeTab === 5 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    偿还 ZETA
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="数量"
                                        value={repayAmount}
                                        onChange={(e) => setRepayAmount(e.target.value)}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">ZETA</InputAdornment>,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <Card sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.success.main, 0.1) }}>
                                        <Typography variant="body2" color="text.secondary">
                                            ZETA 余额
                                        </Typography>
                                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                                            {zetaCoinInfo?.balanceOf?.toFixed(4) ?? '0'} ZETA
                                        </Typography>
                                    </Card>
                                    <Button
                                        variant="contained"
                                        onClick={repay}
                                        disabled={isTransationRequesting || !repayAmount}
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {isTransationRequesting ? '处理中...' : '偿还'}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
