'use client';

import Web3Provider from '@/app/contexts/Web3Provider';

export default function Web3Layout({ children }: { children: React.ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}
