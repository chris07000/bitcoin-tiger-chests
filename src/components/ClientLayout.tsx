'use client';

import { WalletProvider } from '@/context/WalletContext';
import { LightningProvider } from '@/context/LightningContext';
import { BalanceProvider } from '@/context/BalanceContext';
// next-auth/react is removed to fix deployment issues
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Global Balance Sync Component
function GlobalBalanceSync() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Dispatch a custom event when pathname changes to trigger balance refresh
    console.log('GlobalBalanceSync: Path changed to:', pathname);
    
    // Small delay to ensure page has loaded
    setTimeout(() => {
      const event = new CustomEvent('pageNavigated', { 
        detail: { pathname } 
      });
      window.dispatchEvent(event);
    }, 250);
  }, [pathname]);

  return null;
}

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
          <GlobalBalanceSync />
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