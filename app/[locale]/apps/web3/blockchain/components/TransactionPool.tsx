'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Divider,
    Alert,
    Tooltip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import {
    Send,
    AccountBalance,
    Person,
    Receipt,
    Visibility,
    ContentCopy,
    FilterList,
    Sort,
    Refresh,
    Delete,
    CheckCircle,
    Error
} from '@mui/icons-material';
import { Transaction } from '../logic/blockchain';

interface TransactionPoolProps {
    transactions: Transaction[];
}

export default function TransactionPool({ transactions }: TransactionPoolProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('timestamp');
    const [searchTerm, setSearchTerm] = useState('');

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setDetailDialogOpen(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatHash = (hash: string) => {
        return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    const formatAmount = (amount: number) => {
        return `${amount.toFixed(8)} BTC`;
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.hash.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'all' ||
            (filterType === 'system' && tx.from === 'System') ||
            (filterType === 'user' && tx.from !== 'System');

        return matchesSearch && matchesFilter;
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        switch (sortBy) {
            case 'timestamp':
                return b.timestamp - a.timestamp;
            case 'amount':
                return b.amount - a.amount;
            case 'from':
                return a.from.localeCompare(b.from);
            case 'to':
                return a.to.localeCompare(b.to);
            default:
                return 0;
        }
    });

    const getTransactionType = (transaction: Transaction) => {
        if (transaction.from === 'System') return 'Mining Reward';
        return 'Transfer';
    };

    const getTransactionIcon = (transaction: Transaction) => {
        if (transaction.from === 'System') return <AccountBalance />;
        return <Send />;
    };

    const getTransactionColor = (transaction: Transaction) => {
        if (transaction.from === 'System') return 'success';
        return 'primary';
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Send color="primary" />
                <Typography variant="h5" component="h2">
                    Transaction Pool
                </Typography>
                <Chip
                    label={`${transactions.length} Pending`}
                    color="warning"
                    variant="outlined"
                />
            </Box>

            {/* Filters and Search */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search transactions"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filter by type</InputLabel>
                            <Select
                                value={filterType}
                                label="Filter by type"
                                onChange={(e: SelectChangeEvent) => setFilterType(e.target.value)}
                            >
                                <MenuItem value="all">All Transactions</MenuItem>
                                <MenuItem value="user">User Transfers</MenuItem>
                                <MenuItem value="system">Mining Rewards</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Sort by</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort by"
                                onChange={(e: SelectChangeEvent) => setSortBy(e.target.value)}
                            >
                                <MenuItem value="timestamp">Time (Newest)</MenuItem>
                                <MenuItem value="amount">Amount (High to Low)</MenuItem>
                                <MenuItem value="from">From Address</MenuItem>
                                <MenuItem value="to">To Address</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={() => {
                                setSearchTerm('');
                                setFilterType('all');
                                setSortBy('timestamp');
                            }}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Transaction Statistics */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                    Pool Statistics
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                            Total Transactions
                        </Typography>
                        <Typography variant="h6">
                            {transactions.length}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                            User Transfers
                        </Typography>
                        <Typography variant="h6">
                            {transactions.filter(tx => tx.from !== 'System').length}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                            Mining Rewards
                        </Typography>
                        <Typography variant="h6">
                            {transactions.filter(tx => tx.from === 'System').length}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                            Total Value
                        </Typography>
                        <Typography variant="h6">
                            {formatAmount(transactions.reduce((sum, tx) => sum + tx.amount, 0))}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Transactions List */}
            {transactions.length === 0 ? (
                <Alert severity="info">
                    No pending transactions in the pool. Add some transactions to get started!
                </Alert>
            ) : filteredTransactions.length === 0 ? (
                <Alert severity="warning">
                    No transactions match your current filters. Try adjusting your search criteria.
                </Alert>
            ) : (
                <Paper>
                    <List>
                        {sortedTransactions.map((transaction, index) => (
                            <React.Fragment key={transaction.hash}>
                                <ListItem
                                    button
                                    onClick={() => handleTransactionClick(transaction)}
                                    sx={{
                                        '&:hover': { backgroundColor: 'action.hover' },
                                        cursor: 'pointer'
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: `${getTransactionColor(transaction)}.main` }}>
                                            {getTransactionIcon(transaction)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1">
                                                    {transaction.from} → {transaction.to}
                                                </Typography>
                                                <Chip
                                                    label={formatAmount(transaction.amount)}
                                                    color={getTransactionColor(transaction)}
                                                    size="small"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {getTransactionType(transaction)} • {formatTimestamp(transaction.timestamp)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Hash: {formatHash(transaction.hash)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={getTransactionType(transaction)}
                                            size="small"
                                            variant="outlined"
                                            color={getTransactionColor(transaction)}
                                        />
                                        <Tooltip title="View details">
                                            <IconButton size="small">
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </ListItem>
                                {index < sortedTransactions.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}

            {/* Transaction Detail Dialog */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Transaction Details
                </DialogTitle>
                <DialogContent>
                    {selectedTransaction && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: `${getTransactionColor(selectedTransaction)}.main` }}>
                                        {getTransactionIcon(selectedTransaction)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">
                                            {getTransactionType(selectedTransaction)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatTimestamp(selectedTransaction.timestamp)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    From Address
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'monospace',
                                            backgroundColor: 'grey.100',
                                            p: 1,
                                            borderRadius: 1,
                                            flex: 1
                                        }}
                                    >
                                        {selectedTransaction.from}
                                    </Typography>
                                    <Tooltip title="Copy address">
                                        <IconButton
                                            size="small"
                                            onClick={() => copyToClipboard(selectedTransaction.from)}
                                        >
                                            <ContentCopy fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    To Address
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'monospace',
                                            backgroundColor: 'grey.100',
                                            p: 1,
                                            borderRadius: 1,
                                            flex: 1
                                        }}
                                    >
                                        {selectedTransaction.to}
                                    </Typography>
                                    <Tooltip title="Copy address">
                                        <IconButton
                                            size="small"
                                            onClick={() => copyToClipboard(selectedTransaction.to)}
                                        >
                                            <ContentCopy fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Amount
                                </Typography>
                                <Chip
                                    label={formatAmount(selectedTransaction.amount)}
                                    color={getTransactionColor(selectedTransaction)}
                                    size="medium"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Transaction Hash
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'monospace',
                                            backgroundColor: 'grey.100',
                                            p: 1,
                                            borderRadius: 1,
                                            flex: 1
                                        }}
                                    >
                                        {selectedTransaction.hash}
                                    </Typography>
                                    <Tooltip title="Copy hash">
                                        <IconButton
                                            size="small"
                                            onClick={() => copyToClipboard(selectedTransaction.hash)}
                                        >
                                            <ContentCopy fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle color="success" />
                                    <Typography variant="body2" color="text.secondary">
                                        Transaction is valid and ready to be included in the next block
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 