export interface DApp {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    url: string;
    tags: string[];
    status: 'live' | 'beta' | 'development';
}

// 预设配置数组，您可以根据需要修改
export const dapps: DApp[] = [
    {
        id: 'dapp-1',
        name: 'Collateralized Stablecoin Protocol',
        description: 'A decentralized stablecoin platform where users can mint stablecoins by depositing collateral assets. Experience core DeFi mechanisms including collateralization, redemption, and liquidation triggered by oracle price feeds. Explore the fundamentals of over-collateralized debt positions.',
        imageUrl: '/covers/cover1.png',
        url: '',
        tags: ['Stablecoin', 'DeFi', 'CDP', 'Liquidation', 'Oracle'],
        status: 'development'
    },
    {
        id: 'dapp-2',
        name: 'Crypto Plants vs. Zombies',
        description: 'A blockchain-based tower defense game inspired by Plants vs. Zombies where players collect and upgrade NFT plants to defend against zombie invasions. Earn tokens through gameplay and trade your NFT plants in the marketplace. Features strategic gameplay, unique NFT characters, and play-to-earn mechanics.',
        imageUrl: '/covers/cover2.png',
        url: '',
        tags: ['GameFi', 'NFT', 'Battle', 'P2E'],
        status: 'development'
    }
    // 您可以继续添加更多 DApp 配置
]; 