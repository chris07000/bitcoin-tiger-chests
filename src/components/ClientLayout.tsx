'use client';

import { WalletProvider } from '@/context/WalletContext';
import { LightningProvider } from '@/context/LightningContext';
import { BalanceProvider } from '@/context/BalanceContext';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <WalletProvider>
        <LightningProvider>
          <BalanceProvider>
            <Navbar />
            <div className="content-container">
              {children}
            </div>
          </BalanceProvider>
        </LightningProvider>
        <Toaster />
      </WalletProvider>
    </SessionProvider>
  );
} 