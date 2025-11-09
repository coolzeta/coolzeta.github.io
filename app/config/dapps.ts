export interface DApp {
    id: string;
    nameKey: string;
    descriptionKey: string;
    imageUrl: string;
    url: string;
    tags: string[];
    status: 'live' | 'beta' | 'development';
}

// 预设配置数组，您可以根据需要修改
export const dapps: DApp[] = [
    {
        id: 'dapp-1',
        nameKey: 'dapp.collateralizedStablecoin.name',
        descriptionKey: 'dapp.collateralizedStablecoin.description',
        imageUrl: '/covers/cover1.png',
        url: '/apps/web3/dapp-1',
        tags: ['Stablecoin', 'DeFi', 'CDP', 'Liquidation', 'Oracle'],
        status: 'live'
    },
    {
        id: 'dapp-2',
        nameKey: 'dapp.cryptoPlantsVsZombies.name',
        descriptionKey: 'dapp.cryptoPlantsVsZombies.description',
        imageUrl: '/covers/cover2.png',
        url: '/apps/web3/dapp-2',
        tags: ['GameFi', 'NFT', 'Battle', 'P2E'],
        status: 'development'
    }
    // 您可以继续添加更多 DApp 配置
];