'use client';

import { WalletProvider } from '@/context/WalletContext';
import { LightningProvider } from '@/context/LightningContext';
import { BalanceProvider } from '@/context/BalanceContext';
// next-auth/react is removed to fix deployment issues
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // SessionProvider is removed to fix deployment issues
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
  );
} 