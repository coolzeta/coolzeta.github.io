# Blockchain Explorer Webapp

A comprehensive educational webapp for exploring blockchain mechanics including mining, peer-to-peer networks, and transaction management.

## Features

### 🏗️ **Blockchain Visualization**

- View the complete blockchain as a chain of connected blocks
- See block details including hash, previous hash, nonce, and difficulty
- Explore transactions within each block
- Copy hashes and addresses to clipboard
- Real-time blockchain statistics

### ⛏️ **Mining Simulator**

- Interactive mining with adjustable difficulty levels (1-8)
- Real-time hash generation simulation
- Adjustable mining speed (0.1x - 10x)
- Mining progress tracking and statistics
- Mining history with detailed records
- Auto-mining capability

### 🌐 **Peer-to-Peer Network**

- Visual network topology with connected nodes
- Node status monitoring (online/offline/synced)
- Manual node synchronization
- Network statistics and health monitoring
- Individual node details and blockchain state

### 💰 **Transaction Pool**

- Add new transactions with from/to addresses and amounts
- View pending transactions with filtering and sorting
- Transaction type identification (user transfers vs mining rewards)
- Detailed transaction information and validation
- Pool statistics and total value tracking

## How to Use

### Getting Started

1. Navigate to the blockchain explorer page
2. Use the control panel on the left to add transactions
3. Start mining to create new blocks
4. Explore different tabs to understand blockchain mechanics

### Adding Transactions

1. Enter the sender address in the "From" field
2. Enter the recipient address in the "To" field
3. Enter the amount to transfer
4. Click "Add Transaction" to add it to the pool

### Mining Blocks

1. Go to the "Mining" tab
2. Adjust difficulty level using the slider
3. Set mining speed as desired
4. Click "Start Mining" to begin the mining process
5. Watch real-time hash generation and progress

### Exploring the Network

1. Go to the "Network" tab
2. View the network topology with connected nodes
3. Click on nodes to see detailed information
4. Toggle node status or sync nodes manually
5. Monitor network health and statistics

### Viewing Transactions

1. Go to the "Transactions" tab
2. Use filters to find specific transactions
3. Sort by time, amount, or addresses
4. Click on transactions to view detailed information
5. Copy addresses and hashes as needed

## Technical Details

### Blockchain Implementation

- **Proof of Work**: SHA-256 hashing with adjustable difficulty
- **Block Structure**: Index, timestamp, transactions, previous hash, nonce
- **Transaction Validation**: Address and amount validation
- **Chain Integrity**: Hash linking and validation

### Network Simulation

- **Node Management**: Multiple nodes with individual blockchain copies
- **Peer Communication**: Simulated transaction and block broadcasting
- **Consensus**: Basic chain replacement logic
- **Sync Status**: Real-time synchronization monitoring

### Mining Mechanics

- **Difficulty Adjustment**: Configurable leading zeros requirement
- **Nonce Incrementation**: Sequential hash attempts
- **Hash Rate Calculation**: Real-time performance metrics
- **Block Rewards**: Automatic mining reward transactions

## Educational Value

This webapp demonstrates:

- **Blockchain Fundamentals**: How blocks are created and linked
- **Mining Process**: Proof-of-work consensus mechanism
- **Network Dynamics**: How nodes communicate and stay synchronized
- **Transaction Flow**: From creation to block inclusion
- **Cryptographic Security**: Hash functions and digital signatures

Perfect for learning blockchain technology concepts in an interactive, visual environment!
