'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';

interface InvoiceResponse {
  paymentRequest: string;
  paymentHash: string;
}

interface PaymentStatus {
  paid: boolean;
  amount?: number;
  state: string;
}

interface Transaction {
  type: 'deposit' | 'withdraw';
  amount: number;
  paymentHash: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

interface LightningContextType {
  balance: number;
  setBalance: (balance: number) => void;
  transactions: Transaction[];
  generateInvoice: (amount: number, memo?: string) => Promise<InvoiceResponse>;
  checkPayment: (hash: string) => Promise<PaymentStatus>;
  deposit: (amount: number) => Promise<InvoiceResponse>;
  withdraw: (amount: number, invoice: string) => Promise<string>;
  isInitialized: boolean;
  pendingWithdrawal: boolean;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  fetchBalance: () => Promise<number>;
  updateBalanceWithTimestamp: (newBalance: number) => void;
}

const LightningContext = createContext<LightningContextType | undefined>(undefined);

export const LightningProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalanceState] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [pendingWithdrawal, setPendingWithdrawal] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [lastBalanceFetch, setLastBalanceFetch] = useState<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Initialize wallet address from session or API
    // This is now handled by parent context or direct authentication
  }, [isClient]);

  // Utility functie om balans en timestamp in één keer bij te werken
  const updateBalanceWithTimestamp = (newBalance: number) => {
    if (!isClient) return;
    
    // Update state
    setBalanceState(newBalance);
    setLastBalanceFetch(Date.now());
    
    // Forceer een globale update door een custom event te dispatchen
    if (typeof window !== 'undefined') {
      // Creëer en dispatch een custom event voor balans updates
      const event = new CustomEvent('balanceUpdated', { 
        detail: { balance: newBalance, wallet: walletAddress } 
      });
      window.dispatchEvent(event);
    }
    
    console.log(`Balance updated to ${newBalance} for wallet ${walletAddress}`);
  };

  const setBalance = (newBalance: number) => {
    if (!isClient) return;
    console.log('Balance update requested:', {
      previous: balance,
      new: newBalance,
      change: newBalance - balance
    });
    
    // Gebruik de nieuwe utility functie
    updateBalanceWithTimestamp(newBalance);
  };
  
  // Nieuwe functie om de balans direct van de server op te halen
  const fetchBalance = async () => {
    if (!isClient || !walletAddress) return balance;
    
    try {
      console.log('Fetching current balance from server for:', walletAddress);
      
      // Controleer eerst of we niet te snel opnieuw ophalen
      const now = Date.now();
      const minTimeBetweenFetches = 500; // minimaal 500ms tussen API calls
      
      if (lastBalanceFetch && (now - lastBalanceFetch < minTimeBetweenFetches)) {
        console.log(`Skipping balance fetch - last fetch was ${now - lastBalanceFetch}ms ago (min: ${minTimeBetweenFetches}ms)`);
        return balance; // Return huidige balans als we te snel opnieuw proberen op te halen
      }
      
      // Forceer volledige balans refresh via API, negeer caching
      const forceRefreshOptions = {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      };
      
      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
      
      const response = await fetch(`${baseUrl}/api/wallet/${walletAddress}`, forceRefreshOptions);
      if (!response.ok) {
        console.error('Failed to fetch wallet data:', response.statusText);
        return balance;
      }

      const data = await response.json();
      console.log('Fetched wallet data, setting balance:', data.balance);
      
      // Update state en verspreid de update via het custom event
      updateBalanceWithTimestamp(data.balance);
      
      return data.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return balance;
    }
  };

  // Laad wallet data van de backend
  useEffect(() => {
    if (!isClient || !walletAddress) return;

    const initializeWallet = async () => {
      try {
        console.log('Initializing wallet for:', walletAddress);
        setIsInitialized(false);
        
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'))) {
          console.log('On local IP: Using local wallet initialization');
          setBalance(0);
          setTransactions([]);
          setIsInitialized(true);
          console.log('Local wallet initialization complete with balance: 0');
          return;
        }
        
        const baseUrl = typeof window !== 'undefined' ? 
          (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
        
        // Eerst initialiseren
        const initResponse = await fetch(`${baseUrl}/api/wallet/${walletAddress}`, {
          method: 'PUT'
        });
        
        if (!initResponse.ok) {
          throw new Error('Failed to initialize wallet');
        }

        // Dan data ophalen
        const response = await fetch(`${baseUrl}/api/wallet/${walletAddress}`);
        if (!response.ok) throw new Error('Failed to fetch wallet data');

        const data = await response.json();
        console.log('Loaded wallet data:', data);
        console.log('Current balance state before update:', balance);
        
        // Always use the server's balance value for consistency
        setBalance(data.balance);
        setTransactions(data.transactions);
        setIsInitialized(true);
        console.log('Wallet initialization complete with balance:', data.balance);
      } catch (error) {
        console.error('Error initializing wallet:', error);
        setIsInitialized(true);
      }
    };

    initializeWallet();
  }, [walletAddress, isClient, balance]);

  const generateInvoice = async (amount: number, memo?: string): Promise<InvoiceResponse> => {
    try {
      console.log('generateInvoice called with:', { amount, memo });
      
      if (!walletAddress || !isInitialized) {
        console.error('Wallet not ready:', { walletAddress, isInitialized });
        throw new Error('Please wait while we connect to your wallet');
      }

      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
      
      const response = await fetch(`${baseUrl}/api/lightning/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount, 
          memo: memo || `Deposit for ${walletAddress}`,
          walletAddress 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate invoice');
      }

      const data = await response.json();
      console.log('Invoice generated:', {
        paymentRequest: data.paymentRequest?.substring(0, 20) + '...',
        paymentHash: data.paymentHash
      });

      return data;
    } catch (error) {
      console.error('Error in generateInvoice:', error);
      throw error;
    }
  };

  const checkPayment = async (hash: string): Promise<PaymentStatus> => {
    try {
      console.log('Checking payment status for hash:', hash);
      
      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
      
      // Check payment status via backend
      const response = await fetch(`${baseUrl}/api/lightning/checkPayment/${hash}`);
      if (!response.ok) throw new Error('Failed to check payment');

      const data = await response.json();
      console.log('Payment status:', data);

      // Als betaling succesvol is, update wallet data
      if (data.paid) {
        const walletResponse = await fetch(`${baseUrl}/api/wallet/${walletAddress}`);
        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          setBalance(walletData.balance);
          setTransactions(walletData.transactions);
        }
      }

      return data;
    } catch (error) {
      console.error('Error checking payment:', error);
      throw error;
    }
  };

  const deposit = async (amount: number): Promise<InvoiceResponse> => {
    try {
      console.log('Initiating deposit:', amount);
      if (!walletAddress) throw new Error('Please connect your wallet first');
      
      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
      
      // Direct generate the invoice without using the generateInvoice function
      const response = await fetch(`${baseUrl}/api/lightning/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount, 
          memo: `Deposit for ${walletAddress}`,
          walletAddress 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate invoice');
      }

      const invoice = await response.json();
      console.log('Deposit invoice generated');
      
      return invoice;
    } catch (error) {
      console.error('Error in deposit:', error);
      throw error;
    }
  };

  const withdraw = async (amount: number, invoice: string): Promise<string> => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      setPendingWithdrawal(true);
      console.log('Initiating withdrawal:', { amount, invoice: invoice.substring(0, 20) + '...', walletAddress });

      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';

      // First call the wallet endpoint to update the balance
      const walletResponse = await fetch(`${baseUrl}/api/wallet/${walletAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'WITHDRAW',
          amount,
          paymentHash: `withdraw-${Date.now()}`
        }),
      });

      if (!walletResponse.ok) {
        const errorData = await walletResponse.json();
        console.error('Wallet update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update wallet');
      }

      // Then call the lightning pay endpoint
      const payResponse = await fetch(`${baseUrl}/api/lightning/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice,
          withdrawAmount: amount,
          walletAddress
        }),
      });

      if (!payResponse.ok) {
        const errorData = await payResponse.json();
        console.error('Payment failed:', errorData);
        throw new Error(errorData.error || 'Failed to process payment');
      }

      const data = await payResponse.json();
      console.log('Withdrawal successful:', data);

      // Update balance after successful withdrawal
      setBalance(balance - amount);
      setTransactions(prev => [...prev, {
        type: 'withdraw',
        amount,
        paymentHash: data.paymentHash,
        status: 'completed',
        createdAt: new Date()
      }]);
      
      setPendingWithdrawal(false);
      return data.paymentHash;
    } catch (error) {
      setPendingWithdrawal(false);
      throw error;
    }
  };

  return (
    <LightningContext.Provider
      value={{
        balance,
        setBalance,
        transactions,
        generateInvoice,
        checkPayment,
        deposit,
        withdraw,
        isInitialized,
        pendingWithdrawal,
        walletAddress,
        setWalletAddress,
        fetchBalance,
        updateBalanceWithTimestamp
      }}
    >
      {children}
    </LightningContext.Provider>
  );
};

export function useLightning() {
  const context = useContext(LightningContext);
  if (context === undefined) {
    throw new Error('useLightning must be used within a LightningProvider');
  }
  return context;
} 