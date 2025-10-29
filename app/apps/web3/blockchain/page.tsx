'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    AppBar,
    Toolbar,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Alert,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Tooltip,
    Fab,
    Snackbar
} from '@mui/material';
import {
    AccountBalance,
    Storage,
    NetworkCheck,
    Build,
    Send,
    Add,
    Refresh,
    PlayArrow,
    Pause,
    Stop,
    Info,
    CheckCircle,
    Error,
    Warning
} from '@mui/icons-material';

// Import components (we'll create these next)
import BlockchainView from './components/BlockchainView';
import NodeNetwork from './components/NodeNetwork';
import TransactionPool from './components/TransactionPool';
import MiningSimulator from './components/MiningSimulator';
import { Blockchain, Block, Transaction, Node } from './logic/blockchain';
import { useMiningStatusStore } from './store/miningStatus';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`blockchain-tabpanel-${index}`}
            aria-labelledby={`blockchain-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function BlockchainExplorer() {
    const [tabValue, setTabValue] = useState(0);
    const [blockchain, setBlockchain] = useState<Blockchain>(new Blockchain());
    const [nodes, setNodes] = useState<Node[]>([
        new Node('Node 1', '192.168.1.1'),
        new Node('Node 2', '192.168.1.2'),
        new Node('Node 3', '192.168.1.3'),
    ]);
    const { isMining, setIsMining, currentNonce, setCurrentNonce, currentHash, setCurrentHash, targetHash, setTargetHash, miningProgress, setMiningProgress } = useMiningStatusStore();
    const [newTransaction, setNewTransaction] = useState({ from: '', to: '', amount: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const addTransaction = () => {
        if (newTransaction.from && newTransaction.to && newTransaction.amount) {
            const transaction = new Transaction(
                newTransaction.from,
                newTransaction.to,
                parseFloat(newTransaction.amount)
            );
            blockchain.addTransaction(transaction);
            setBlockchain(new Blockchain(blockchain.chain, blockchain.pendingTransactions));
            setNewTransaction({ from: '', to: '', amount: '' });
            setSnackbar({ open: true, message: 'Transaction added to pool!', severity: 'success' });
        }
    };

    const startMining = () => {
        setIsMining(true);
        setMiningProgress(0);

        const mineBlock = async () => {
            const rewardTx = new Transaction(
                'System',
                'miner-address',
                blockchain.miningReward
            );
            blockchain.pendingTransactions.push(rewardTx);
            const block = new Block(
                blockchain.chain.length,
                Date.now(),
                blockchain.pendingTransactions,
                blockchain.getLatestBlock().hash,
                blockchain.difficulty
            );
            setTargetHash('0'.repeat(blockchain.difficulty) + 'f'.repeat(64 - blockchain.difficulty));

            // Slow down the mining process to make it visible
            for (let i = 0; true; i++) {
                const currentHash = block.setNonce(i);
                setCurrentNonce(i);
                setCurrentHash(currentHash);

                // Update progress based on nonce attempts
                const progressPercent = Math.min((i / 1000) * 90, 90); // Cap at 90% until found
                setMiningProgress(progressPercent);

                // Add delay to make the process visible
                await new Promise(resolve => setTimeout(resolve, 1)); // 1ms delay between attempts

                if (currentHash.substring(0, blockchain.difficulty) === '0'.repeat(blockchain.difficulty)) {
                    block.hash = currentHash;
                    break;
                }
            }

            blockchain.chain.push(block);
            blockchain.pendingTransactions = [];

            setBlockchain(new Blockchain(blockchain.chain, blockchain.pendingTransactions));
            setIsMining(false);
            setMiningProgress(100);
            setSnackbar({ open: true, message: 'Block mined successfully!', severity: 'success' });
        };

        // Start the mining process
        mineBlock();
    };

    const stopMining = () => {
        setIsMining(false);
        setMiningProgress(0);
    };

    const resetBlockchain = () => {
        setBlockchain(new Blockchain());
        setSnackbar({ open: true, message: 'Blockchain reset!', severity: 'info' });
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <AccountBalance sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Blockchain Explorer
                    </Typography>
                    <Chip
                        label={`${blockchain.chain.length} Blocks`}
                        color="secondary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                    />
                    <Chip
                        label={`${blockchain.pendingTransactions.length} Pending`}
                        color="warning"
                        variant="outlined"
                    />
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    {/* Control Panel */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, height: 'fit-content' }}>
                            <Typography variant="h6" gutterBottom>
                                <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Control Panel
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="From"
                                    value={newTransaction.from}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, from: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    fullWidth
                                    label="To"
                                    value={newTransaction.to}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, to: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    type="number"
                                    value={newTransaction.amount}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<Send />}
                                    onClick={addTransaction}
                                    disabled={!newTransaction.from || !newTransaction.to || !newTransaction.amount}
                                >
                                    Add Transaction
                                </Button>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Mining Controls
                                </Typography>
                                {isMining && (
                                    <Box sx={{ mb: 2 }}>
                                        <LinearProgress variant="determinate" value={miningProgress} />
                                        <Typography variant="caption" color="text.secondary">
                                            Mining... {Math.round(miningProgress)}%
                                        </Typography>
                                    </Box>
                                )}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    startIcon={isMining ? <Pause /> : <PlayArrow />}
                                    onClick={isMining ? stopMining : startMining}
                                    sx={{ mb: 1 }}
                                >
                                    {isMining ? 'Stop Mining' : 'Start Mining'}
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={resetBlockchain}
                                >
                                    Reset Blockchain
                                </Button>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Network Status
                                </Typography>
                                <List dense>
                                    {nodes.map((node, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <NetworkCheck color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={node.name}
                                                secondary={node.address}
                                            />
                                            <Chip
                                                label="Online"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        <Paper sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="blockchain tabs">
                                    <Tab label="Blockchain" icon={<Storage />} iconPosition="start" />
                                    <Tab label="Network" icon={<NetworkCheck />} iconPosition="start" />
                                    <Tab label="Transactions" icon={<Send />} iconPosition="start" />
                                    <Tab label="Mining" icon={<Build />} iconPosition="start" />
                                </Tabs>
                            </Box>

                            <TabPanel value={tabValue} index={0}>
                                <BlockchainView blockchain={blockchain} />
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <NodeNetwork nodes={nodes} blockchain={blockchain} />
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <TransactionPool transactions={blockchain.pendingTransactions} />
                            </TabPanel>

                            <TabPanel value={tabValue} index={3}>
                                <MiningSimulator
                                    isMining={isMining}
                                    miningProgress={miningProgress}
                                    onStartMining={startMining}
                                    onStopMining={stopMining}
                                />
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
