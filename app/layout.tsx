import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zeta / Notes from Hong Kong',
  description: 'Personal notes on code, AI, Web3, design, and everything in between.',
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
