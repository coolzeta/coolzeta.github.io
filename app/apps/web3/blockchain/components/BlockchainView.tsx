'use client';

import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Storage,
    Link,
    ExpandMore,
    CheckCircle,
    Error,
    ContentCopy,
    Visibility
} from '@mui/icons-material';
import { Blockchain, Block, Transaction } from '../logic/blockchain';

interface BlockchainViewProps {
    blockchain: Blockchain;
}

export default function BlockchainView({ blockchain }: BlockchainViewProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatHash = (hash: string) => {
        return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Storage color="primary" />
                <Typography variant="h5" component="h2">
                    Blockchain Explorer
                </Typography>
                <Chip
                    label={`${blockchain.chain.length} Blocks`}
                    color="primary"
                    variant="outlined"
                />
                <Chip
                    label={blockchain.isChainValid() ? 'Valid Chain' : 'Invalid Chain'}
                    color={blockchain.isChainValid() ? 'success' : 'error'}
                    icon={blockchain.isChainValid() ? <CheckCircle /> : <Error />}
                />
            </Box>

            {blockchain.chain.length === 0 && (
                <Alert severity="info">
                    No blocks in the blockchain yet. Start mining to create the first block!
                </Alert>
            )}

            <Grid container spacing={2}>
                {blockchain.chain.map((block, index) => (
                    <Grid item xs={12} key={block.hash}>
                        <Card
                            variant="outlined"
                            sx={{
                                position: 'relative',
                                borderColor: index === 0 ? 'primary.main' : 'grey.300',
                                '&:hover': { borderColor: 'primary.main' }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" component="h3" gutterBottom>
                                            Block #{block.index}
                                            {index === 0 && (
                                                <Chip
                                                    label="Genesis"
                                                    size="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Mined at: {formatTimestamp(block.timestamp)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Chip
                                            label={`Nonce: ${block.nonce}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Difficulty: ${block.difficulty}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Block Hash
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    backgroundColor: 'background.paper',
                                                    p: 1,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 1,
                                                    flex: 1
                                                }}
                                            >
                                                {formatHash(block.hash)}
                                            </Typography>
                                            <Tooltip title="Copy hash">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => copyToClipboard(block.hash)}
                                                >
                                                    <ContentCopy fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View full hash">
                                                <IconButton size="small">
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Previous Hash
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    backgroundColor: 'background.paper',
                                                    p: 1,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 1,
                                                    flex: 1
                                                }}
                                            >
                                                {index === 0 ? 'Genesis Block' : formatHash(block.previousHash)}
                                            </Typography>
                                            {index > 0 && (
                                                <Tooltip title="Copy previous hash">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => copyToClipboard(block.previousHash)}
                                                    >
                                                        <ContentCopy fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Transactions ({block.transactions.length})
                                    </Typography>

                                    {block.transactions.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">
                                            No transactions in this block
                                        </Typography>
                                    ) : (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant="body2">
                                                    View {block.transactions.length} transaction(s)
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <List dense>
                                                    {block.transactions.map((tx, txIndex) => (
                                                        <ListItem key={tx.hash + txIndex} divider>
                                                            <ListItemText
                                                                primary={
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Typography variant="body2">
                                                                            {tx.from} → {tx.to}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={`${tx.amount} BTC`}
                                                                            size="small"
                                                                            color="primary"
                                                                        />
                                                                    </Box>
                                                                }
                                                                secondary={
                                                                    <Box>
                                                                        <Typography variant="caption" display="block">
                                                                            Hash: {formatHash(tx.hash)}
                                                                        </Typography>
                                                                        <Typography variant="caption" display="block">
                                                                            Time: {formatTimestamp(tx.timestamp)}
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
                                </Box>

                                {/* Link to next block */}
                                {index < blockchain.chain.length - 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Link color="primary" sx={{ transform: 'rotate(90deg)' }} />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {blockchain.chain.length > 0 && (
                <Paper sx={{ p: 2, mt: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" gutterBottom>
                        Blockchain Statistics
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Total Blocks
                            </Typography>
                            <Typography variant="h6">
                                {blockchain.chain.length}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Pending Transactions
                            </Typography>
                            <Typography variant="h6">
                                {blockchain.pendingTransactions.length}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Current Difficulty
                            </Typography>
                            <Typography variant="h6">
                                {blockchain.difficulty}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Mining Reward
                            </Typography>
                            <Typography variant="h6">
                                {blockchain.miningReward} BTC
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Box>
    );
} 