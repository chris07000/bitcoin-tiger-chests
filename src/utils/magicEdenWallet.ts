import { 
  BitcoinProvider, 
  BitcoinNetworkType, 
  getAddress, 
  signMessage, 
  AddressPurpose,
  GetAddressResponse
} from 'sats-connect'

interface MagicEdenBitcoinProvider {
  isMagicEden: boolean;
}

interface MagicEdenProvider {
  bitcoin: MagicEdenBitcoinProvider;
}

declare global {
  interface Window {
    magicEden?: MagicEdenProvider;
  }
}

const WALLET_DOWNLOAD_URL = 'https://wallet.magiceden.io/download';

// Helper functie om te controleren of we op een IP-adres draaien i.p.v. localhost
const isRunningOnIPAddress = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  // Check of hostname een IP-adres is (eenvoudig patroon)
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
};

export const isMagicEdenInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Voor testen op IP-adres, retourneer true om het proces te laten doorgaan
  if (isRunningOnIPAddress()) {
    console.log('Running on IP address, simulating Magic Eden installation');
    return true;
  }
  
  const provider = window.magicEden?.bitcoin;
  if (provider) {
    console.log('Magic Eden wallet details:', {
      provider,
      isMagicEden: provider.isMagicEden,
    });
  } else {
    console.log('Magic Eden wallet not detected in window object');
  }
  return !!provider?.isMagicEden;
};

export const getMagicEdenProvider = async (): Promise<BitcoinProvider | undefined> => {
  // Voor testen op IP-adres, gebruik een mock provider
  if (isRunningOnIPAddress()) {
    console.log('Running on IP address, using mock Magic Eden provider');
    
    // Mock provider implementatie voor testen
    const mockProvider: BitcoinProvider = {
      // Minimale implementatie van BitcoinProvider interface
      request: async (method: string, params: any) => {
        console.log('Mock Magic Eden provider request:', method, params);
        // Mock responses
        if (method === 'getInfo') {
          return { name: 'Magic Eden Mock', isInstalled: true };
        }
        return null;
      }
    } as unknown as BitcoinProvider;
    
    return mockProvider;
  }
  
  // Normale flow voor localhost en production
  if ('magicEden' in window && window.magicEden?.bitcoin?.isMagicEden) {
    return window.magicEden.bitcoin as unknown as BitcoinProvider;
  }
  
  // Probeer provider te vinden met delay (extra robustheid)
  let retries = 0;
  while (retries < 3) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if ('magicEden' in window && window.magicEden?.bitcoin?.isMagicEden) {
      return window.magicEden.bitcoin as unknown as BitcoinProvider;
    }
    retries++;
  }
  
  throw new Error('Magic Eden wallet not found! Please install Magic Eden wallet.');
};

export const getMagicEdenAddresses = async (): Promise<GetAddressResponse> => {
  const provider = await getMagicEdenProvider();
  
  // Voor testen op IP-adres, retourneer mock data
  if (isRunningOnIPAddress()) {
    console.log('Using mock addresses for IP address testing');
    return {
      addresses: [
        {
          address: 'bc1pmtest123456789testtesttesttesttesttesttesttesttest',
          publicKey: '0223456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01',
          purpose: AddressPurpose.Ordinals,
          addressType: 'p2tr',
          walletType: 'software'
        },
        {
          address: 'bc1qmtest123456789testtesttesttesttesttesttesttesttest',
          publicKey: '0323456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef02',
          purpose: AddressPurpose.Payment,
          addressType: 'p2wpkh',
          walletType: 'software'
        }
      ],
      status: 'success'
    } as unknown as GetAddressResponse;
  }
  
  return new Promise((resolve, reject) => {
    getAddress({
      payload: {
        purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
        message: 'Bitcoin Tiger Collective needs access to your wallet',
        network: {
          type: BitcoinNetworkType.Mainnet
        }
      },
      getProvider: async () => provider,
      onFinish: (response) => {
        console.log('Address response:', response);
        resolve(response);
      },
      onCancel: () => {
        reject(new Error('User cancelled the request'));
      }
    });
  });
};

export const signMagicEdenMessage = async (address: string): Promise<string> => {
  const provider = await getMagicEdenProvider();
  
  // Voor testen op IP-adres, retourneer mock handtekening
  if (isRunningOnIPAddress()) {
    console.log('Using mock signature for IP address testing');
    return 'mock_signature_for_testing_purposes_only_123456789abcdef';
  }
  
  return new Promise((resolve, reject) => {
    signMessage({
      payload: {
        network: {
          type: BitcoinNetworkType.Mainnet
        },
        address,
        message: 'Bitcoin Tiger Collective: Verify wallet ownership'
      },
      getProvider: async () => provider,
      onFinish: (response) => {
        console.log('Signature:', response);
        resolve(response);
      },
      onCancel: () => {
        reject(new Error('User cancelled signing'));
      }
    });
  });
}; 