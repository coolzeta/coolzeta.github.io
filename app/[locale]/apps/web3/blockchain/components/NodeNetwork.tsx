'use client';

import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
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
    LinearProgress,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    NetworkCheck,
    Computer,
    Storage,
    Send,
    Refresh,
    Settings,
    CheckCircle,
    Error,
    Warning,
    Link,
    LinkOff,
    Visibility,
    Sync
} from '@mui/icons-material';
import { Node, Blockchain } from '../logic/blockchain';

interface NodeNetworkProps {
    nodes: Node[];
    blockchain: Blockchain;
}

export default function NodeNetwork({ nodes, blockchain }: NodeNetworkProps) {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [syncDialogOpen, setSyncDialogOpen] = useState(false);
    const [autoSync, setAutoSync] = useState(true);

    const handleNodeClick = (node: Node) => {
        setSelectedNode(node);
    };

    const syncNodeWithMain = (node: Node) => {
        // Simulate syncing the node's blockchain with the main blockchain
        node.blockchain = new Blockchain(blockchain.chain, blockchain.pendingTransactions);
        setSyncDialogOpen(false);
    };

    const toggleNodeStatus = (node: Node) => {
        node.isOnline = !node.isOnline;
        // Note: In a real app, this would trigger a re-render in the parent component
    };

    const getNodeStatusColor = (node: Node) => {
        if (!node.isOnline) return 'error';
        if (node.blockchain.chain.length === blockchain.chain.length) return 'success';
        return 'warning';
    };

    const getNodeStatusIcon = (node: Node) => {
        if (!node.isOnline) return <Error />;
        if (node.blockchain.chain.length === blockchain.chain.length) return <CheckCircle />;
        return <Warning />;
    };

    const getSyncStatus = (node: Node) => {
        if (!node.isOnline) return 'Offline';
        if (node.blockchain.chain.length === blockchain.chain.length) return 'Synced';
        return `${node.blockchain.chain.length}/${blockchain.chain.length} blocks`;
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <NetworkCheck color="primary" />
                <Typography variant="h5" component="h2">
                    Peer-to-Peer Network
                </Typography>
                <Chip
                    label={`${nodes.filter(n => n.isOnline).length}/${nodes.length} Online`}
                    color="primary"
                    variant="outlined"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={autoSync}
                            onChange={(e) => setAutoSync(e.target.checked)}
                            size="small"
                        />
                    }
                    label="Auto Sync"
                />
            </Box>

            <Grid container spacing={3}>
                {/* Network Overview */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Network Topology
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            minHeight: 200
                        }}>
                            {nodes.map((node, index) => (
                                <Box key={node.address} sx={{ textAlign: 'center' }}>
                                    <Card
                                        sx={{
                                            width: 120,
                                            cursor: 'pointer',
                                            border: selectedNode?.address === node.address ? 2 : 1,
                                            borderColor: selectedNode?.address === node.address ? 'primary.main' : 'grey.300',
                                            '&:hover': { borderColor: 'primary.main' }
                                        }}
                                        onClick={() => handleNodeClick(node)}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    mx: 'auto',
                                                    mb: 1,
                                                    bgcolor: getNodeStatusColor(node) === 'success' ? 'success.main' :
                                                        getNodeStatusColor(node) === 'warning' ? 'warning.main' : 'error.main'
                                                }}
                                            >
                                                <Computer />
                                            </Avatar>
                                            <Typography variant="body2" noWrap>
                                                {node.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" noWrap>
                                                {node.address}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                {getNodeStatusIcon(node)}
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    {/* Connection lines */}
                                    {index < nodes.length - 1 && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mt: 1
                                        }}>
                                            <Link color="primary" />
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Network Stats */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Network Statistics
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Total Nodes"
                                    secondary={nodes.length}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Online Nodes"
                                    secondary={nodes.filter(n => n.isOnline).length}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Synced Nodes"
                                    secondary={nodes.filter(n => n.isOnline && n.blockchain.chain.length === blockchain.chain.length).length}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Average Block Height"
                                    secondary={Math.round(nodes.reduce((sum, n) => sum + n.blockchain.chain.length, 0) / nodes.length)}
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Node Details */}
                {selectedNode && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Node Details: {selectedNode.name}
                                </Typography>
                                <Box>
                                    <Tooltip title="Toggle node status">
                                        <IconButton onClick={() => toggleNodeStatus(selectedNode)}>
                                            {selectedNode.isOnline ? <CheckCircle color="success" /> : <Error color="error" />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Sync with main chain">
                                        <IconButton onClick={() => setSyncDialogOpen(true)}>
                                            <Sync />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Node Information
                                    </Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary="Name"
                                                secondary={selectedNode.name}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Address"
                                                secondary={selectedNode.address}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Status"
                                                secondary={
                                                    <Chip
                                                        label={selectedNode.isOnline ? 'Online' : 'Offline'}
                                                        size="small"
                                                        color={selectedNode.isOnline ? 'success' : 'error'}
                                                    />
                                                }
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Connected Peers"
                                                secondary={selectedNode.peers.length}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Blockchain Status
                                    </Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary="Block Height"
                                                secondary={selectedNode.blockchain.chain.length}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Pending Transactions"
                                                secondary={selectedNode.blockchain.pendingTransactions.length}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Sync Status"
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {getNodeStatusIcon(selectedNode)}
                                                        <Typography variant="body2">
                                                            {getSyncStatus(selectedNode)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Chain Validity"
                                                secondary={
                                                    <Chip
                                                        label={selectedNode.blockchain.isChainValid() ? 'Valid' : 'Invalid'}
                                                        size="small"
                                                        color={selectedNode.blockchain.isChainValid() ? 'success' : 'error'}
                                                    />
                                                }
                                            />
                                        </ListItem>
                                    </List>

                                    {selectedNode.blockchain.chain.length !== blockchain.chain.length && selectedNode.isOnline && (
                                        <Alert severity="warning" sx={{ mt: 2 }}>
                                            This node is out of sync with the main blockchain.
                                            <Button
                                                size="small"
                                                onClick={() => setSyncDialogOpen(true)}
                                                sx={{ ml: 1 }}
                                            >
                                                Sync Now
                                            </Button>
                                        </Alert>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {/* All Nodes List */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            All Network Nodes
                        </Typography>
                        <List>
                            {nodes.map((node, index) => (
                                <React.Fragment key={node.address}>
                                    <ListItem
                                        button
                                        onClick={() => handleNodeClick(node)}
                                        selected={selectedNode?.address === node.address}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{
                                                bgcolor: getNodeStatusColor(node) === 'success' ? 'success.main' :
                                                    getNodeStatusColor(node) === 'warning' ? 'warning.main' : 'error.main'
                                            }}>
                                                <Computer />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={node.name}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" component="span">
                                                        {node.address}
                                                    </Typography>
                                                    <br />
                                                    <Typography variant="caption" component="span">
                                                        {getSyncStatus(node)} • {node.peers.length} peers
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getNodeStatusIcon(node)}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleNodeStatus(node)}
                                                >
                                                    {node.isOnline ? <Link color="success" /> : <LinkOff color="error" />}
                                                </IconButton>
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < nodes.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Sync Dialog */}
            <Dialog open={syncDialogOpen} onClose={() => setSyncDialogOpen(false)}>
                <DialogTitle>Sync Node with Main Chain</DialogTitle>
                <DialogContent>
                    <Typography>
                        This will sync {selectedNode?.name} with the main blockchain.
                        The node will receive all missing blocks and transactions.
                    </Typography>
                    {selectedNode && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Current height: {selectedNode.blockchain.chain.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Target height: {blockchain.chain.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Blocks to sync: {blockchain.chain.length - selectedNode.blockchain.chain.length}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSyncDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => selectedNode && syncNodeWithMain(selectedNode)}
                        variant="contained"
                    >
                        Sync
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 