'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Divider,
    Alert,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Tooltip,
    TextField,
    Switch,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Build,
    PlayArrow,
    Pause,
    Stop,
    Refresh,
    Speed,
    Memory,
    TrendingUp,
    TrendingDown,
    Settings,
    ExpandMore,
    CheckCircle,
    Error,
    Warning,
    Info,
    Timer,
    Code
} from '@mui/icons-material';
import { useMiningStatusStore } from '../store/miningStatus';

interface MiningSimulatorProps {
    isMining: boolean;
    miningProgress: number;
    onStartMining: () => void;
    onStopMining: () => void;
}

export default function MiningSimulator({
    isMining,
    onStartMining,
    onStopMining
}: MiningSimulatorProps) {
    const [difficulty, setDifficulty] = useState(4);
    const [miningSpeed, setMiningSpeed] = useState(1);
    const [autoMining, setAutoMining] = useState(false);
    const [miningHistory, setMiningHistory] = useState<Array<{
        blockNumber: number;
        hash: string;
        nonce: number;
        difficulty: number;
        timeTaken: number;
        timestamp: number;
    }>>([]);
    const { currentHash, setCurrentHash, currentNonce, setCurrentNonce, targetHash, setTargetHash, miningProgress } = useMiningStatusStore();
    const [hashRate, setHashRate] = useState(0);

    // Generate target hash based on difficulty
    useEffect(() => {
        setTargetHash('0'.repeat(difficulty) + 'f'.repeat(64 - difficulty));
    }, [difficulty]);

    // Simulate mining process


    const calculateHashRate = () => {
        if (miningHistory.length === 0) return 0;
        const totalNonce = miningHistory.reduce((sum, record) => sum + record.nonce, 0);
        const totalTime = miningHistory.reduce((sum, record) => sum + record.timeTaken, 0);
        return totalNonce / (totalTime / 1000);
    };

    const getDifficultyColor = (diff: number) => {
        if (diff <= 2) return 'success';
        if (diff <= 4) return 'warning';
        return 'error';
    };

    const formatHash = (hash: string) => {
        return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    };

    const formatTime = (ms: number) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Build color="primary" />
                <Typography variant="h5" component="h2">
                    Mining Simulator
                </Typography>
                <Chip
                    label={isMining ? 'Mining Active' : 'Idle'}
                    color={isMining ? 'success' : 'default'}
                    variant="outlined"
                />
            </Box>

            <Grid container spacing={3}>
                {/* Mining Controls */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Mining Controls
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    startIcon={isMining ? <Pause /> : <PlayArrow />}
                                    onClick={isMining ? onStopMining : onStartMining}
                                    disabled={autoMining}
                                >
                                    {isMining ? 'Stop Mining' : 'Start Mining'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={() => {
                                        setMiningHistory([]);
                                        setCurrentNonce(0);
                                        setCurrentHash('');
                                    }}
                                >
                                    Reset
                                </Button>
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={autoMining}
                                        onChange={(e) => setAutoMining(e.target.checked)}
                                    />
                                }
                                label="Auto Mining"
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Difficulty Level: {difficulty}
                            </Typography>
                            <Slider
                                value={difficulty}
                                onChange={(e, value) => setDifficulty(value as number)}
                                min={1}
                                max={8}
                                marks
                                valueLabelDisplay="auto"
                                sx={{ mb: 1 }}
                            />
                            <Chip
                                label={`Target: ${targetHash}...`}
                                color={getDifficultyColor(difficulty) as any}
                                size="small"
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Mining Speed: {miningSpeed}x
                            </Typography>
                            <Slider
                                value={miningSpeed}
                                onChange={(e, value) => setMiningSpeed(value as number)}
                                min={0.1}
                                max={10}
                                step={0.1}
                                valueLabelDisplay="auto"
                            />
                        </Box>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                Mining is trying to find a nonce that makes the hash lower than the target hash. So higher difficulty requires more leading zeros in the hash, making mining more challenging.
                            </Typography>
                        </Alert>
                    </Paper>
                </Grid>

                {/* Mining Status */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Mining Status
                        </Typography>

                        {isMining && (
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Mining Progress</Typography>
                                    <Typography variant="body2">{Math.round(miningProgress)}%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={miningProgress} />
                            </Box>
                        )}

                        <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Code color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="h6">{currentNonce.toLocaleString()}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Current Nonce
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="h6">{hashRate.toFixed(0)}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Hash Rate (H/s)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Memory color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="h6">{miningHistory.length}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Blocks Mined
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Timer color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="h6">
                                            {miningHistory.length > 0
                                                ? formatTime(miningHistory[miningHistory.length - 1].timeTaken)
                                                : '0ms'
                                            }
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Last Block Time
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Current Hash Display */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Current Hash Attempt
                            </Typography>
                            <Box sx={{
                                backgroundColor: 'grey.100',
                                p: 2,
                                borderRadius: 1,
                                color: 'primary.main',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                wordBreak: 'break-all'
                            }}>
                                {currentHash || 'No hash generated yet'}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Target: {targetHash}... (Difficulty: {difficulty})
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Mining History */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Mining History
                        </Typography>

                        {miningHistory.length === 0 ? (
                            <Alert severity="info">
                                No blocks mined yet. Start mining to see your progress!
                            </Alert>
                        ) : (
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>
                                        View {miningHistory.length} mined block(s)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {miningHistory.slice().reverse().map((record, index) => (
                                            <ListItem key={record.timestamp} divider>
                                                <ListItemIcon>
                                                    <CheckCircle color="success" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body1">
                                                                Block #{record.blockNumber}
                                                            </Typography>
                                                            <Chip
                                                                label={`Difficulty: ${record.difficulty}`}
                                                                size="small"
                                                                color={getDifficultyColor(record.difficulty) as any}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Hash: {formatHash(record.hash)}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Nonce: {record.nonce.toLocaleString()} • Time: {formatTime(record.timeTaken)} • {new Date(record.timestamp).toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </Paper>
                </Grid>

                {/* Mining Statistics */}
                {miningHistory.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                            <Typography variant="h6" gutterBottom>
                                Mining Statistics
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Blocks Mined
                                    </Typography>
                                    <Typography variant="h6">
                                        {miningHistory.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Average Hash Rate
                                    </Typography>
                                    <Typography variant="h6">
                                        {calculateHashRate().toFixed(0)} H/s
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Average Block Time
                                    </Typography>
                                    <Typography variant="h6">
                                        {formatTime(miningHistory.reduce((sum, r) => sum + r.timeTaken, 0) / miningHistory.length)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Nonce Attempts
                                    </Typography>
                                    <Typography variant="h6">
                                        {miningHistory.reduce((sum, r) => sum + r.nonce, 0).toLocaleString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
} 