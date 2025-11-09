import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ZetaCoin Wallet - Decentralized Lending Platform',
    description: 'A decentralized lending platform where you can deposit ETH, borrow ZETA tokens, and manage your crypto assets securely. Built on Ethereum Sepolia network.',
    keywords: 'ZetaCoin, DeFi, lending, borrowing, cryptocurrency, ETH, ZETA, decentralized finance, wallet, crypto lending, collateral',
    openGraph: {
        title: 'ZetaCoin Wallet - Decentralized Lending Platform',
        description: 'A decentralized lending platform where you can deposit ETH, borrow ZETA tokens, and manage your crypto assets securely.',
        type: 'website',
        locale: 'en_US',
        siteName: 'ZetaCoin Wallet',
        images: [
            {
                url: '/covers/cover1.png', // 需要添加这个图片到 public 文件夹
                width: 1200,
                height: 630,
                alt: 'ZetaCoin Wallet Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ZetaCoin Wallet - Decentralized Lending Platform',
        description: 'A decentralized lending platform where you can deposit ETH, borrow ZETA tokens, and manage your crypto assets securely.',
        images: ['/covers/cover1.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function Dapp1Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}