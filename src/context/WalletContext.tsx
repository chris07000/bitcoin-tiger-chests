'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { 
  request,
  AddressPurpose,
  BitcoinNetworkType,
  getProviders,
  getProviderById,
  getAddress,
  GetAddressOptions,
  signMessage
} from 'sats-connect'
import { getMagicEdenProvider, signMagicEdenMessage, getMagicEdenAddresses } from '../utils/magicEdenWallet'
import Cookies from 'js-cookie'

// Add type declaration for window.unisat
declare global {
  interface Window {
    unisat?: {
      getNetwork: () => Promise<string>;
      switchNetwork: (network: string) => Promise<void>;
      requestAccounts: () => Promise<string[]>;
    };
  }
}

interface Address {
  purpose: AddressPurpose;
  address: string;
  publicKey: string;
  addressType: string;
}

interface WalletContextType {
  connectedWallet: string | null
  walletAddress: string | null
  publicKey: string | null
  addressType: string | null
  connectXverse: () => Promise<void>
  connectUnisat: () => Promise<void>
  connectMagicEden: () => Promise<void>
  disconnectWallet: () => void
  balance: number
  address: string | null
  refreshBalance: () => Promise<void>
  updateBalanceAfterChest: (newBalance: number) => void
  handleChestOpen: (chestType: string, joinJackpot: boolean, isFree: boolean) => Promise<void>
  isLoading: boolean
  isInitialized: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  // Replaced next-auth session with a simple mock
  const session = { user: { email: null, name: null } };
  
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [addressType, setAddressType] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wallet state from session on first mount
  useEffect(() => {
    const loadInitialWalletState = async () => {
      console.log('WalletContext: Starting initialization...');
      setIsLoading(true);
      
      try {
        // Laad wallet gegevens uit cookie
        const walletCookie = Cookies.get('wallet_session');
        if (walletCookie) {
          try {
            const walletData = JSON.parse(walletCookie);
            console.log('WalletContext: Wallet data geladen uit cookie:', walletData);
            
            // Controleer of de gegevens geldig zijn
            if (walletData.connectedWallet && walletData.walletAddress) {
              setConnectedWallet(walletData.connectedWallet);
              setWalletAddress(walletData.walletAddress);
              setPublicKey(walletData.publicKey || null);
              setAddressType(walletData.addressType || null);
              
              console.log('WalletContext: Wallet sessie hersteld van cookie');
              
              // Wacht even en haal dan balans op - reduced timeout for faster response
              setTimeout(() => {
                refreshBalance().then(() => {
                  console.log('WalletContext: Balance loaded after cookie restore');
                });
              }, 100); // Reduced from 500ms to 100ms for faster loading
              
              setIsInitialized(true);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('WalletContext: Fout bij het laden van wallet cookie:', error);
            Cookies.remove('wallet_session');
          }
        }
        
        // Fallback: try localStorage if cookies failed
        const walletLocalStorage = localStorage.getItem('wallet_session_backup');
        if (walletLocalStorage) {
          try {
            const walletData = JSON.parse(walletLocalStorage);
            console.log('WalletContext: Wallet data geladen uit localStorage:', walletData);
            
            // Controleer of de gegevens geldig zijn en niet te oud (max 7 dagen)
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
            if (walletData.connectedWallet && walletData.walletAddress && 
                walletData.timestamp && (Date.now() - walletData.timestamp < maxAge)) {
              setConnectedWallet(walletData.connectedWallet);
              setWalletAddress(walletData.walletAddress);
              setPublicKey(walletData.publicKey || null);
              setAddressType(walletData.addressType || null);
              
              console.log('WalletContext: Wallet sessie hersteld van localStorage');
              
              // Also restore to cookie for next time
              Cookies.set('wallet_session', JSON.stringify(walletData), { 
                expires: 7,
                sameSite: 'lax',
                secure: false,
                path: '/'
              });
              
              // Also save to localStorage as backup
              localStorage.setItem('wallet_session_backup', JSON.stringify(walletData));
              
              // Wacht even en haal dan balans op
              setTimeout(() => {
                refreshBalance().then(() => {
                  console.log('WalletContext: Balance loaded after localStorage restore');
                });
              }, 100);
              
              setIsInitialized(true);
              setIsLoading(false);
              return;
            } else {
              console.log('WalletContext: localStorage wallet data too old or invalid, removing');
              localStorage.removeItem('wallet_session_backup');
            }
          } catch (error) {
            console.error('WalletContext: Fout bij het laden van wallet localStorage:', error);
            localStorage.removeItem('wallet_session_backup');
          }
        }
        
        // Check if we're on local development IP
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'))) {
          console.log('WalletContext: On local IP - skipping initial wallet load from session');
        }
        
        // No valid wallet data found
        console.log('WalletContext: No valid wallet data found, initialization complete');
        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('WalletContext: Error loading initial wallet state:', error);
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    loadInitialWalletState();
  }, []);

  const initializeWalletInDB = async (address: string) => {
    try {
      console.log('Initializing wallet in DB for:', address);
      
      // IP Check - als we op lokaal IP zitten, dan alleen naar localStorage schrijven
      // en niet naar de server proberen te communiceren
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'))) {
        console.log('On local IP: Using local wallet initialization');
        // Simuleer een succesvol response
        return {
          address,
          balance: 0,
          id: `local-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
      const response = await fetch(`${baseUrl}/api/wallet/${address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to initialize wallet in database: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Wallet initialized in DB:', data);
      return data;
    } catch (error) {
      console.error('Error initializing wallet in DB:', error);
      throw error;
    }
  };

  const connectXverse = async () => {
    try {
      setIsLoading(true);
      console.log('WalletContext: Connecting to Xverse wallet...');
      const response = await request('wallet_connect', {
        addresses: [AddressPurpose.Ordinals, AddressPurpose.Payment],
        message: 'Bitcoin Tiger Collective needs access to your wallet'
      });

      console.log('WalletContext: Xverse connection response:', response);

      if (response.status === 'success') {
        const ordinalsAddress = response.result.addresses.find(
          (address) => address.purpose === AddressPurpose.Ordinals
        );

        if (ordinalsAddress) {
          await initializeWalletInDB(ordinalsAddress.address);
          
          // Set local state
          setConnectedWallet('Xverse');
          setWalletAddress(ordinalsAddress.address);
          setPublicKey(ordinalsAddress.publicKey);
          setAddressType(ordinalsAddress.addressType);
          
          // Sla wallet gegevens op in cookie (7 dagen geldig)
          const walletData = {
            connectedWallet: 'Xverse',
            walletAddress: ordinalsAddress.address,
            publicKey: ordinalsAddress.publicKey,
            addressType: ordinalsAddress.addressType,
            timestamp: Date.now()
          };
          
          Cookies.set('wallet_session', JSON.stringify(walletData), { 
            expires: 7, // 7 dagen
            sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
            secure: false, // Allow cookies on localhost/http for development
            path: '/' // Ensure cookie is available site-wide
          });
          
          // Also save to localStorage as backup
          localStorage.setItem('wallet_session_backup', JSON.stringify(walletData));
          
          setIsInitialized(true);
          setIsLoading(false);
          
          console.log('WalletContext: Connected to Xverse:', {
            address: ordinalsAddress.address,
            publicKey: ordinalsAddress.publicKey,
            addressType: ordinalsAddress.addressType
          });
          
          // Refresh balance after connection
          setTimeout(() => refreshBalance(), 100); // Reduced from 500ms to 100ms
        } else {
          throw new Error('No ordinals address found');
        }
      } else {
        if (response.error.code === 4001) {
          throw new Error('User cancelled the connection');
        } else {
          throw new Error(response.error.message);
        }
      }
    } catch (error: any) {
      console.error('WalletContext: Failed to connect Xverse wallet:', error);
      setIsLoading(false);
      alert(error?.message || 'Failed to connect to Xverse wallet');
    }
  };

  const connectUnisat = async () => {
    try {
      setIsLoading(true);
      console.log('WalletContext: Connecting to Unisat wallet...');
      
      const unisat = window.unisat
      if (!unisat) {
        throw new Error('Unisat wallet not found! Please install Unisat wallet.')
      }

      const network = await unisat.getNetwork()
      if (network !== 'livenet') {
        await unisat.switchNetwork('livenet')
      }

      const accounts = await unisat.requestAccounts()
      
      await initializeWalletInDB(accounts[0]);
      
      // Set local state
      setConnectedWallet('Unisat')
      setWalletAddress(accounts[0])
      
      // Sla wallet gegevens op in cookie (7 dagen geldig)
      const walletData = {
        connectedWallet: 'Unisat',
        walletAddress: accounts[0],
        publicKey: null,
        addressType: null,
        timestamp: Date.now()
      };
      
      Cookies.set('wallet_session', JSON.stringify(walletData), { 
        expires: 7, // 7 dagen
        sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
        secure: false, // Allow cookies on localhost/http for development
        path: '/' // Ensure cookie is available site-wide
      });
      
      // Also save to localStorage as backup
      localStorage.setItem('wallet_session_backup', JSON.stringify(walletData));
      
      setIsInitialized(true);
      setIsLoading(false);
      
      console.log('WalletContext: Connected to Unisat:', accounts)
      
      // Refresh balance after connection
      setTimeout(() => refreshBalance(), 100); // Reduced from 500ms to 100ms
    } catch (error) {
      console.error('WalletContext: Failed to connect Unisat wallet:', error)
      setIsLoading(false);
    }
  }

  const connectMagicEden = async () => {
    try {
      setIsLoading(true);
      console.log('WalletContext: Starting Magic Eden connection process');
      
      // Controleer of we op een IP-adres draaien
      const isIPAddress = typeof window !== 'undefined' && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname);
      if (isIPAddress) {
        console.log('WalletContext: Connecting on IP address:', window.location.hostname);
      }
      
      const addressResponse = await new Promise<any>((resolve, reject) => {
        console.log('WalletContext: Requesting Magic Eden addresses...');
        getMagicEdenAddresses()
          .then(response => {
            console.log('WalletContext: Magic Eden addresses received:', response);
            resolve(response);
          })
          .catch(error => {
            console.error('WalletContext: Error getting Magic Eden addresses:', error);
            reject(error);
          });
      });

      console.log('WalletContext: Magic Eden response:', addressResponse);

      const paymentAddress = addressResponse.addresses.find(
        (addr: Address) => addr.purpose === AddressPurpose.Payment
      );

      if (!paymentAddress) {
        console.error('WalletContext: No payment address found in response');
        throw new Error('No payment address found');
      }

      try {
        console.log('WalletContext: Requesting signature for wallet verification...');
        const signature = await signMagicEdenMessage(paymentAddress.address);
        console.log('WalletContext: Wallet verified with signature:', signature);
      } catch (error) {
        console.error('WalletContext: Signature error:', error);
        throw new Error('Failed to verify wallet ownership');
      }

      const ordinalsAddress = addressResponse.addresses.find(
        (addr: Address) => addr.purpose === AddressPurpose.Ordinals
      );

      if (ordinalsAddress) {
        console.log('WalletContext: Initializing ordinals address in DB:', ordinalsAddress.address);
        await initializeWalletInDB(ordinalsAddress.address);
        
        // Set local state
        setConnectedWallet('MagicEden');
        setWalletAddress(ordinalsAddress.address);
        setPublicKey(ordinalsAddress.publicKey);
        setAddressType('p2tr');
        
        // Sla wallet gegevens op in cookie (7 dagen geldig)
        const walletData = {
          connectedWallet: 'MagicEden',
          walletAddress: ordinalsAddress.address,
          publicKey: ordinalsAddress.publicKey,
          addressType: 'p2tr',
          timestamp: Date.now()
        };
        
        Cookies.set('wallet_session', JSON.stringify(walletData), { 
          expires: 7, // 7 dagen
          sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
          secure: false, // Allow cookies on localhost/http for development
          path: '/' // Ensure cookie is available site-wide
        });
        
        // Also save to localStorage as backup
        localStorage.setItem('wallet_session_backup', JSON.stringify(walletData));
        
        setIsInitialized(true);
        setIsLoading(false);
        
        console.log('WalletContext: Connected to Magic Eden:', ordinalsAddress.address);
        
        // Refresh balance after connection
        setTimeout(() => refreshBalance(), 100); // Reduced from 500ms to 100ms
      } else {
        console.error('WalletContext: No ordinals address found in response');
        throw new Error('No ordinals address found');
      }

    } catch (error: any) {
      console.error('WalletContext: Failed to connect Magic Eden wallet:', error);
      setIsLoading(false);
      
      // Controleer of we op een IP-adres draaien en geef een specifieker bericht
      const isIPAddress = typeof window !== 'undefined' && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname);
      if (isIPAddress) {
        const message = `Error connecting to Magic Eden on IP address ${window.location.hostname}. ` +
          'Try using localhost:3000 instead, or install the Magic Eden wallet extension.';
        alert(message);
      } else {
        alert(error?.message || 'Failed to connect to Magic Eden wallet');
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      console.log('WalletContext: Disconnecting wallet:', connectedWallet);
      setIsLoading(true);
      
      if (connectedWallet === 'Xverse') {
        await request('wallet_disconnect', null);
      }
      
      // Verwijder wallet cookie
      Cookies.remove('wallet_session');
      console.log('WalletContext: Wallet cookie verwijderd');
      
      // Also remove localStorage backup
      localStorage.removeItem('wallet_session_backup');
      console.log('WalletContext: Wallet localStorage backup verwijderd');
      
      // Clear local state
      setConnectedWallet(null);
      setWalletAddress(null);
      setPublicKey(null);
      setAddressType(null);
      setBalance(0);
      setIsInitialized(false);
      setIsLoading(false);
      
      console.log('WalletContext: Wallet disconnected');
    } catch (error) {
      console.error('WalletContext: Failed to disconnect:', error);
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!walletAddress) return;

    try {
      // IP Check - als we op lokaal IP zitten, dan alleen lokale localStorage data gebruiken
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'))) {
        console.log('On local IP: Using local balance refresh');
        // Haal balance uit localStorage of gebruik 0
        const storedBalance = localStorage.getItem('walletBalance');
        const balance = storedBalance ? parseInt(storedBalance) : 0;
        setBalance(balance);
        return;
      }
      
      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
      const response = await fetch(`${baseUrl}/api/wallet/${walletAddress}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Refreshing balance:', data.balance);
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  // Add a function to update balance after chest opening
  const updateBalanceAfterChest = async (newBalance: number) => {
    console.log('Updating balance after chest:', newBalance);
    setBalance(newBalance);
    
    // Update de database direct, alleen voor niet-lokale ontwikkeling
    if (walletAddress && typeof window !== 'undefined' && !(window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'))) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
        // Optioneel: stuur een notificatie naar de server dat de balans is bijgewerkt
        // Dit is niet strikt noodzakelijk omdat de chest API dit normaal al doet
        console.log('Balance updated in DB via chest API:', newBalance);
      } catch (error) {
        console.error('Error confirming balance update:', error);
      }
    }
  };

  // Add a function to handle chest opening
  const handleChestOpen = async (chestType: string, joinJackpot: boolean, isFree: boolean) => {
    if (!walletAddress) return;

    try {
      // IP Check - als we op lokaal IP zitten, dan simuleren we de chest open
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'))) {
        console.log('On local IP: Simulating chest open');
        // Simuleer een reward
        const reward = Math.floor(Math.random() * 5000) + 1000;
        const currentBalance = balance + reward;
        // Alleen state updaten, geen localStorage
        setBalance(currentBalance);
        return;
      }
      
      const baseUrl = typeof window !== 'undefined' ? 
        (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
      const response = await fetch(`${baseUrl}/api/chests/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          chestType,
          joinJackpot,
          isFree
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Chest opened:', data);
        // Update de balance direct via state
        setBalance(data.balance || balance);
      } else {
        console.error('Failed to open chest:', await response.text());
      }
    } catch (error) {
      console.error('Error opening chest:', error);
    }
  };

  return (
    <WalletContext.Provider value={{
      connectedWallet,
      walletAddress,
      publicKey,
      addressType,
      connectXverse,
      connectUnisat,
      connectMagicEden,
      disconnectWallet,
      balance,
      address: walletAddress,
      refreshBalance,
      updateBalanceAfterChest,
      handleChestOpen,
      isLoading,
      isInitialized
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 