import crypto from 'crypto';
import { useMiningStatusStore } from '../store/miningStatus';
export const calculateHash = (...args: any[]) => {
    const dataString = args.reduce((acc, curr) => acc + (typeof curr === 'object' ? JSON.stringify(curr) : curr), '').toString();
    const hash = crypto
        .createHash('sha256')
        .update(dataString)
        .digest('hex');
    return hash;
}

export class Transaction {
    public from: string;
    public to: string;
    public amount: number;
    public timestamp: number;
    public hash: string;

    constructor(from: string, to: string, amount: number) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.timestamp = Date.now();
        this.hash = calculateHash(this.from, this.to, this.amount, this.timestamp);
    }
}

export class Block {
    public index: number;
    public timestamp: number;
    public transactions: Transaction[];
    public previousHash: string;
    public hash: string;
    public nonce: number;
    public difficulty: number;
    public valid: boolean;

    constructor(
        index: number,
        timestamp: number,
        transactions: Transaction[],
        previousHash: string = '',
        difficulty: number = 4
    ) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.difficulty = difficulty;
        this.nonce = 0;
        this.hash = calculateHash(this.index, this.previousHash, this.timestamp, this.transactions, this.nonce);
        if (this.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
            this.valid = false;
        } else {
            this.valid = true;
        }
    }
    setNonce(nonce: number): string {
        this.nonce = nonce;
        this.hash = calculateHash(this.index, this.previousHash, this.timestamp, this.transactions, this.nonce);
        if (this.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
            this.valid = false;
        } else {
            this.valid = true;
        }

        return this.hash;
    }

    mineBlock(): void {
        const target = '0'.repeat(this.difficulty);
        let currenetHash = '';
        for (let i = 0; currenetHash.substring(0, this.difficulty) !== target; i++) {
            currenetHash = this.setNonce(i);
        }
        this.hash = currenetHash;
    }

    hasValidTransactions(): boolean {
        for (const tx of this.transactions) {
            if (!tx.hash) {
                return false;
            }
        }
        return true;
    }
}

export class Blockchain {
    public chain: Block[];
    public difficulty: number;
    public pendingTransactions: Transaction[];
    public miningReward: number;

    constructor(chain?: Block[], pendingTransactions?: Transaction[]) {
        this.chain = chain || [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = pendingTransactions || [];
        this.miningReward = 100;
    }

    createGenesisBlock(): Block {
        return new Block(0, Date.now(), [], '0', this.difficulty);
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string): Block {
        const rewardTx = new Transaction(
            'System',
            miningRewardAddress,
            this.miningReward
        );
        this.pendingTransactions.push(rewardTx);

        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash,
            this.difficulty
        );

        block.mineBlock();

        this.chain.push(block);
        this.pendingTransactions = [];

        return block;
    }

    addTransaction(transaction: Transaction): void {
        if (!transaction.from || !transaction.to) {
            throw new Error('Transaction must include from and to address');
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount must be greater than 0');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.from === address) {
                    balance -= trans.amount;
                }

                if (trans.to === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.transactions, currentBlock.nonce)) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    replaceChain(newChain: Block[]): void {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain.');
            return;
        } else if (!this.isChainValid()) {
            console.log('The received chain is not valid.');
            return;
        }

        console.log('Replacing the current chain with the new chain.');
        this.chain = newChain;
    }
}

export class Node {
    public name: string;
    public address: string;
    public blockchain: Blockchain;
    public peers: Node[];
    public isOnline: boolean;

    constructor(name: string, address: string) {
        this.name = name;
        this.address = address;
        this.blockchain = new Blockchain();
        this.peers = [];
        this.isOnline = true;
    }

    addPeer(peer: Node): void {
        if (!this.peers.find(p => p.address === peer.address)) {
            this.peers.push(peer);
            peer.addPeer(this);
        }
    }

    broadcastTransaction(transaction: Transaction): void {
        this.peers.forEach(peer => {
            if (peer.isOnline) {
                peer.receiveTransaction(transaction);
            }
        });
    }

    receiveTransaction(transaction: Transaction): void {
        this.blockchain.addTransaction(transaction);
    }

    broadcastBlock(block: Block): void {
        this.peers.forEach(peer => {
            if (peer.isOnline) {
                peer.receiveBlock(block);
            }
        });
    }

    receiveBlock(block: Block): void {
        const latestBlock = this.blockchain.getLatestBlock();

        if (block.previousHash === latestBlock.hash) {
            this.blockchain.chain.push(block);
            this.blockchain.pendingTransactions = [];
        } else if (block.index > latestBlock.index) {
            // Handle chain replacement logic
            console.log('Received longer chain, requesting full chain...');
        }
    }

    mineBlock(): Block {
        const block = this.blockchain.minePendingTransactions(this.address);
        this.broadcastBlock(block);
        return block;
    }

    getBlockchainInfo() {
        return {
            name: this.name,
            address: this.address,
            chainLength: this.blockchain.chain.length,
            pendingTransactions: this.blockchain.pendingTransactions.length,
            isOnline: this.isOnline,
            peers: this.peers.length
        };
    }
} 