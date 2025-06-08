import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLightning } from '@/context/LightningContext';
import { useWallet } from '@/context/WalletContext';
import Image from 'next/image';
import axios from 'axios';
import { isTaprootAlpha } from '@/components/TaprootAlphaMissions';
// import { BitcoinTigerCard } from './BitcoinTigerCard';
// import { BitcoinTigersAPI } from '@/utils/bitcoinTigersAPI';
// import { useWallet } from '@/contexts/WalletContext';
// import { Button, Card, Spinner, Modal, ButtonGroup } from 'react-bootstrap';

// Constanten voor stakingstijd
const MIN_STAKE_TIME_SECONDS = 7 * 24 * 60 * 60; // 7 dagen minimum stake tijd

type TigerStakingStatus = {
  stakedTigers: number | TigerStakedInfo[]; // Kan nu zowel aantal als array zijn
  stakedInfo: TigerStakedInfo[];
  totalStaked?: number; // Optioneel nieuw veld in het nieuwe formaat
  availableChests: number;
  nextChestDate: number | null;
};

type TigerStakedInfo = {
  id: string;
  name: string;
  stakedAt: number;
  nextChestAt: number;
  image?: string;
  key?: string;
  isRuneGuardian?: boolean;
  hasClaimedChest?: boolean;
};

interface BitcoinTiger {
  id: string;
  key: string;
  name: string;
  image: string;
  inscriptionNumber: number;
  inscriptionId: string;
  isKnownTiger: boolean;
  isRuneGuardian?: boolean;
  contentType?: string;
  collection?: string;
  originalImageUrls?: string; // To store original multiple URLs
}

// Static mapping of inscription IDs to local images to avoid rate limits
const TIGER_IMAGE_MAPPING: Record<string, string> = {
  // Bitcoin Tigers - gebruik lokale afbeeldingen
  'e0fa3603a3eb14944bb38d16dbf21a7eb79af8ebd21828e8dad72f7ce4daa7cei0': '/tigers/tiger1.png',
  'c9970479c393de09e886afd5fd3e0ff5c4fea97e00d1c4251469d99469357a46i0': '/tigers/tiger2.png',
  '51bce55d0e69f65c9d43b0eec14e7f0b5392edf4c4ca4ad891fda0a706f23e1di0': '/tigers/tiger3.png',
  '4c85f0ee6dd8f99a50716cacc460cd03d96ae4aaddbda1a84f1e1b01f4ce7cb0i0': '/tigers/tiger4.png',
  'bd5c8b5d95ec5a61b0ec3eb7e06ed1f0a160fbbb4f66b46ae2e7adcf7bc90d60i0': '/tigers/tiger5.png',
  '7ec90d31d1ea5b801157b9d5c89cfc59c87ecbf95d2d06b175df44a0190c8f90i0': '/tigers/tiger6.png',
  '7dac5fc07f6a02c2ed1d5c60bb91b9fcbcf4b499c5c72b5f9ea5edd3e65ebfffi0': '/tigers/tiger7.png',
  '8a24aea5a8d6f02b1e0de79abb99acac72da1b6a29cbdcdbcef3a2fef1f4ffcai0': '/tigers/tiger8.png',
  '4458e1b1d33d49d38f05efc6c3b6a02d91a6f8d4c600a93671be0d0ecc4e43fei0': '/tigers/tiger9.png',
  '22c66a48e32d27d0a4c1e4ff5df44c07361e59d3b2784161de25239c85334a5ci0': '/tigers/tiger10.png',
  '32cfe6c1bfa49e22bd8c57e1a10a15c09ef5ecdbe9a4fe8a7c9e4d98359ecf8fi0': '/tigers/tiger11.png',
  'cda3f5ac84c35a16d9b13e92c8bae0e91da06219f43e76ca1f8093a9a1e5cb13i0': '/tigers/tiger12.png',
  'bdcf3dde04fdcc3fba8d05b3c1bd8e2e91072d8e8ec6cc12b3c441e0e87cfd22i0': '/tigers/tiger13.png',
  'c4b28e3c43a5f6bb99b49c53edecf2e0fbf0bd91b20dca5d099152d7ea2bff6di0': '/tigers/tiger14.png',
  'c0a2b7a253d97346c730eff3a1a1eabe4ec3a3fb60d89fd3fd96a10bc79b7fe5i0': '/tigers/tiger15.png',
  // Voeg meer mappings toe voor andere bekende tigers...
};

// Fallback afbeeldingen voor verschillende tiger types
const FALLBACK_IMAGES = [
  '/tiger-pixel1.png',
  '/tiger-pixel2.png', 
  '/tiger-pixel3.png',
  '/tiger-pixel4.png',
  '/tiger-pixel5.png'
];

// Functie om de juiste afbeelding te krijgen voor een tiger
const getTigerImage = (tiger: any): string => {
  // Eerst kijken of we een mapping hebben voor dit inscription ID
  if (tiger.id && TIGER_IMAGE_MAPPING[tiger.id]) {
    console.log(`✅ Found mapped image for ${tiger.id}: ${TIGER_IMAGE_MAPPING[tiger.id]}`);
    return TIGER_IMAGE_MAPPING[tiger.id];
  }
  
  // Log missing mappings voor debugging
  if (tiger.id && !TIGER_IMAGE_MAPPING[tiger.id]) {
    console.log(`⚠️ No mapping found for inscription ID: ${tiger.id}`);
    console.log(`Add this to TIGER_IMAGE_MAPPING: '${tiger.id}': '/tigers/tigerX.png',`);
  }
  
  // Als tiger.image al een lokale path is, gebruik die
  if (tiger.image && (tiger.image.startsWith('/') || tiger.image.startsWith('./public/'))) {
    return tiger.image;
  }
  
  // Als er een image URL is maar geen lokale mapping, probeer die eerst
  if (tiger.image && !tiger.image.includes('ordinals.com')) {
    return tiger.image;
  }
  
  // Gebruik een deterministische fallback gebaseerd op het tiger ID
  const hash = tiger.id ? tiger.id.split('').reduce((a: number, b: string) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0) : 0;
  
  const fallbackIndex = Math.abs(hash) % FALLBACK_IMAGES.length;
  const fallbackImage = FALLBACK_IMAGES[fallbackIndex];
  
  console.log(`🎭 Using fallback image for ${tiger.id || 'unknown'}: ${fallbackImage}`);
  return fallbackImage;
};

// Debug functie om alle gemiste mappings te tonen
const logMissingMappings = (tigers: any[]) => {
  const missingMappings = tigers
    .filter(tiger => tiger.id && !TIGER_IMAGE_MAPPING[tiger.id])
    .map(tiger => `'${tiger.id}': '/tigers/tiger${tigers.indexOf(tiger) + 1}.png',`);
  
  if (missingMappings.length > 0) {
    console.group('🔧 Missing Tiger Image Mappings');
    console.log('Add these to TIGER_IMAGE_MAPPING:');
    missingMappings.forEach(mapping => console.log(mapping));
    console.groupEnd();
  }
};

// Service voor Bitcoin Tiger staking API calls
const tigerApiService = {
  // Fetch staking status voor een wallet
  async getStakingStatus(walletAddress: string) {
    try {
      const response = await axios.get(`/api/tiger-staking/status`, {
        params: { walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Bitcoin Tiger staking status:', error);
      throw error;
    }
  },
  
  // Fetch Bitcoin Tigers voor een wallet
  async fetchTigers(walletAddress: string) {
    try {
      console.log('Fetching tigers for wallet:', walletAddress);
      const response = await axios.get(`/api/tiger-staking/fetch-tigers`, {
        params: { walletAddress },
        timeout: 15000 // 15 second timeout
      });
      console.log('Fetch tigers response:', response.data);
      
      if (!response.data) {
        console.warn('No data received from fetch-tigers API');
        return [];
      }
      
      const tokens = response.data.tokens || [];
      console.log(`Successfully fetched ${tokens.length} tigers for wallet ${walletAddress}`);
      
      return tokens;
    } catch (error) {
      console.error('Error fetching Bitcoin Tigers:', error);
      
      // More detailed error logging
      if (axios.isAxiosError(error)) {
        console.error('API Error Status:', error.response?.status);
        console.error('API Error Data:', error.response?.data);
        console.error('API Error Message:', error.message);
      }
      
      // Return empty array instead of throwing
      return [];
    }
  },
  
  // Stake een tiger
  async stakeTiger(walletAddress: string, tigerId: string, tigerData: any) {
    try {
      const response = await axios.post(`/api/tiger-staking/stake`, {
        walletAddress,
        tigerId,
        tigerData
      });
      return response.data;
    } catch (error) {
      console.error('Error staking Bitcoin Tiger:', error);
      throw error;
    }
  },
  
  // Unstake een tiger
  async unstakeTiger(walletAddress: string, tigerId: string) {
    try {
      const response = await axios.post(`/api/tiger-staking/unstake`, {
        walletAddress,
        tigerId
      });
      return response.data;
    } catch (error) {
      console.error('Error unstaking Bitcoin Tiger:', error);
      throw error;
    }
  },
  
  // Claim een chest
  async claimChest(walletAddress: string) {
    try {
      console.log('claimChest API call with wallet:', walletAddress);
      
      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }
      
      // Voeg een claim lock toe in localStorage om te voorkomen dat meerdere claims gelijktijdig worden verwerkt
      const lockKey = `claiming_chest_${walletAddress}`;
      if (localStorage.getItem(lockKey) === 'true') {
        console.log('Er is al een claim in behandeling, wacht tot deze is voltooid');
        throw new Error('Er is al een claim in behandeling, wacht tot deze is voltooid');
      }
      
      // Zet de lock
      localStorage.setItem(lockKey, 'true');
      
      try {
      const response = await axios.post(`/api/tiger-staking/claim-chest`, {
        walletAddress
      });
        
        // Log de ontvangen satoshi beloning
        if (response.data && response.data.satoshisAmount) {
          console.log(`User received ${response.data.satoshisAmount} sats from chest claim!`);
        }
        
        // Zodra de claim succesvol is, markeer we dit in localStorage
        try {
          const tigerStakingData = localStorage.getItem('tigerStakingDB');
          if (tigerStakingData) {
            const parsedData = JSON.parse(tigerStakingData);
            
            // Zorg ervoor dat we een sectie hebben voor geclaimde chests
            if (!parsedData.claimedChests) {
              parsedData.claimedChests = {};
            }
            
            if (!parsedData.claimedChests[walletAddress]) {
              parsedData.claimedChests[walletAddress] = {};
            }
            
            // Als de server een lijst van geclaimde tigers teruggeeft, markeer ze allemaal
            if (response.data.claimedTigers && Array.isArray(response.data.claimedTigers)) {
              response.data.claimedTigers.forEach((tigerId: string) => {
                parsedData.claimedChests[walletAddress][tigerId] = {
                  claimId: `api-claim-${Date.now()}`,
                  claimedAt: Date.now()
                };
                
                // Update ook de staked tigers als ze nog bestaan
                if (parsedData.stakedTigers && 
                    parsedData.stakedTigers[walletAddress] && 
                    parsedData.stakedTigers[walletAddress][tigerId]) {
                  parsedData.stakedTigers[walletAddress][tigerId].hasClaimedChest = true;
                }
              });
            }
            
            // Update localStorage
            localStorage.setItem('tigerStakingDB', JSON.stringify(parsedData));
          }
        } catch (storageError) {
          console.error('Error updating localStorage after API claim:', storageError);
        }
        
      return response.data;
      } finally {
        // Verwijder de lock, ongeacht het resultaat
        localStorage.removeItem(lockKey);
      }
    } catch (error) {
      console.error('Error claiming chest:', error);
      
      // Verbeterde error handling
      if (axios.isAxiosError(error) && error.response) {
        // Server stuurde een error response
        const errorMsg = error.response.data?.error || 'Unknown API error';
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  }
};

const BitcoinTigersStaking: React.FC<{ walletAddress: string, userTigers?: BitcoinTiger[] }> = ({ walletAddress, userTigers: initialUserTigers }) => {
  // State variabelen
  const [userTigers, setUserTigers] = useState<BitcoinTiger[]>([]);
  const [stakedTigers, setStakedTigers] = useState<TigerStakedInfo[]>([]);
  const [nextChestDate, setNextChestDate] = useState<Date | null>(null);
  const [availableChests, setAvailableChests] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTiger, setSelectedTiger] = useState<string | null>(null);
  const [selectedStakedTiger, setSelectedStakedTiger] = useState<string | null>(null);
  const [isStakingTiger, setIsStakingTiger] = useState<boolean>(false);
  const [isUnstakingTiger, setIsUnstakingTiger] = useState<boolean>(false);
  const [isClaimingChest, setIsClaimingChest] = useState<boolean>(false);
  const [claimedAmount, setClaimedAmount] = useState<number>(0);
  // Bijhouden van gefaalde afbeeldingen om herhaald laden te voorkomen
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [tigerStakingDB, setTigerStakingDB] = useState<any>(null);
  const [showClaimReveal, setShowClaimReveal] = useState(false);
  const [claimReward, setClaimReward] = useState<{
    amount: number;
    isHighRoll: boolean;
    isJackpot: boolean;
    isClaiming: boolean;
    claimedTigerId?: string;
    rewards?: number[];
  }>({
    amount: 0,
    isHighRoll: false,
    isJackpot: false,
    isClaiming: false
  });
  
  // Tiger Leveling System states
  const [tigerLevel, setTigerLevel] = useState<number>(1); // Algemeen wallet level (legacy)
  const [tigerLevels, setTigerLevels] = useState<Record<string, number>>({}); // Nieuwe per-tiger levels
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [selectedTigerForUpgrade, setSelectedTigerForUpgrade] = useState<string | null>(null);
  const [showLevelUpReveal, setShowLevelUpReveal] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    show: boolean;
    level: number;
    cost: number;
    address: string;
    tigerId?: string; // Toegevoegd om een specifieke tiger ID te koppelen aan betaling
  }>({
    show: false,
    level: 0,
    cost: 0,
    address: ""
  });
  
  // Import updateBalanceWithTimestamp van LightningContext
  const { setBalance, balance, updateBalanceWithTimestamp, fetchBalance, isInitialized: lightningInitialized } = useLightning();

  // Import WalletContext loading state
  const { isLoading: walletIsLoading, isInitialized: walletIsInitialized } = useWallet();

  // Voeg een nieuwe state toe voor mobiele padding
  const [mobilePadding, setMobilePadding] = useState('0');

  // State voor claim beheer
  const [claimError, setClaimError] = useState('');
  const [chestIds, setChestIds] = useState<string[]>([]);
  const [showClaimRevealOverlay, setShowClaimRevealOverlay] = useState(false);

  // Add client-side only state to prevent hydration issues
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Add caching variables - verhoog cache duration
  const [lastDataLoad, setLastDataLoad] = useState<number>(0);
  const [loadingLock, setLoadingLock] = useState<boolean>(false);
  const DATA_CACHE_DURATION = 60000; // Verhoog van 30 naar 60 seconden cache

  // Effect to mark when we're on the client side
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(Date.now());
  }, []);

  // NEW: Main initialization effect that waits for all contexts
  useEffect(() => {
    if (!isClient) return;
    
    console.log('BitcoinTigersStaking: Checking initialization state', {
      walletIsLoading,
      walletIsInitialized,
      lightningInitialized,
      walletAddress
    });
    
    // Wait for WalletContext to finish loading
    if (walletIsLoading) {
      console.log('BitcoinTigersStaking: Waiting for WalletContext to finish loading...');
      setIsLoading(true);
      return;
    }
    
    // Wait for WalletContext to be initialized
    if (!walletIsInitialized) {
      console.log('BitcoinTigersStaking: Waiting for WalletContext to be initialized...');
      setIsLoading(true);
      return;
    }
    
    // Wait for LightningContext to be initialized
    if (!lightningInitialized) {
      console.log('BitcoinTigersStaking: Waiting for LightningContext to be initialized...');
      setIsLoading(true);
      return;
    }
    
    console.log('BitcoinTigersStaking: All contexts ready, proceeding with data loading...');
    
    // Voeg extra cache check toe om te voorkomen dat we te vaak data laden
    const now = Date.now();
    if (lastDataLoad && (now - lastDataLoad < DATA_CACHE_DURATION)) {
      console.log('BitcoinTigersStaking: Using cached data, skipping data load');
      setIsLoading(false);
      return;
    }
    
    // Now we can safely load data
    if (walletAddress && walletAddress.trim() !== '') {
      console.log('BitcoinTigersStaking: Valid wallet address found, loading data:', walletAddress);
      loadWalletAndStakingData();
    } else {
      console.log('BitcoinTigersStaking: No wallet address, initialization complete');
      setIsLoading(false);
    }
  }, [isClient, walletIsLoading, walletIsInitialized, lightningInitialized, walletAddress]);

  // Effect om mobiele padding aan te passen
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setMobilePadding(window.innerWidth <= 768 ? '60px' : '0');
      }
    };
    
    // Voer bij initialisatie uit
    handleResize();
    
    // Voeg resize event listener toe
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Laad tiger level uit localStorage bij initialisatie
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    try {
      // Legacy level laden (wallet-breed)
      const savedTigerLevel = localStorage.getItem(`tigerLevel_${walletAddress}`);
      if (savedTigerLevel) {
        const parsedLevel = parseInt(savedTigerLevel);
        if (!isNaN(parsedLevel) && parsedLevel > 0 && parsedLevel <= 5) {
          setTigerLevel(parsedLevel);
          console.log(`Loaded wallet tiger level ${parsedLevel} for wallet ${walletAddress}`);
        }
      }
      
      // Individuele tiger levels laden
      const savedTigerLevels = localStorage.getItem(`tigerLevels_${walletAddress}`);
      if (savedTigerLevels) {
        try {
          const parsedLevels = JSON.parse(savedTigerLevels);
          setTigerLevels(parsedLevels);
          console.log(`Loaded individual tiger levels for wallet ${walletAddress}`, parsedLevels);
        } catch (e) {
          console.error('Error parsing tiger levels JSON:', e);
        }
      }
    } catch (error) {
      console.error('Error loading tiger level:', error);
    }
  }, [walletAddress, isClient]);
  
  // Initialize tiger staking DB with data from localStorage
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    // Retrieve tiger staking data from localStorage if it exists
    try {
      const savedData = localStorage.getItem('tigerStakingDB');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Retrieved tiger staking data from localStorage:', parsedData);
        setTigerStakingDB(parsedData);
      } else {
        // Initialize an empty tiger staking database
        const initialDB = {
          stakedTigers: {},
          chests: {},
          rewardHistory: []
        };
        localStorage.setItem('tigerStakingDB', JSON.stringify(initialDB));
        setTigerStakingDB(initialDB);
      }
    } catch (error) {
      console.error('Error initializing tiger staking data:', error);
      // Reset to initial state in case of error
      const initialDB = {
        stakedTigers: {},
        chests: {},
        rewardHistory: []
      };
      localStorage.setItem('tigerStakingDB', JSON.stringify(initialDB));
      setTigerStakingDB(initialDB);
    }
  }, [isClient]);
  
  // Sync tigerStakingDB state with localStorage whenever it changes
  useEffect(() => {
    if (!isClient || !tigerStakingDB || Object.keys(tigerStakingDB).length === 0) return;
    
    try {
      localStorage.setItem('tigerStakingDB', JSON.stringify(tigerStakingDB));
      console.log('Synced tigerStakingDB to localStorage:', tigerStakingDB);
    } catch (error) {
      console.error('Error syncing tigerStakingDB to localStorage:', error);
    }
  }, [tigerStakingDB, isClient]);

  // Sla tiger level op in localStorage wanneer het verandert
  useEffect(() => {
    if (!isClient || !walletAddress || tigerLevel <= 0) return;
    
    try {
      localStorage.setItem(`tigerLevel_${walletAddress}`, tigerLevel.toString());
      console.log(`Saved tiger level ${tigerLevel} for wallet ${walletAddress}`);
    } catch (error) {
      console.error('Error saving tiger level:', error);
    }
  }, [tigerLevel, walletAddress, isClient]);

  // Removed complex image loading system to prevent flickering
  // Now using basic Next.js Image components directly - NO custom components

  // Helper om te bepalen of een tiger een Rune Guardian is
  const isRuneGuardian = (tiger: any): boolean => {
    // Early return als tiger niet geldig is
    if (!tiger) return false;
    
    // Verschillende checks uitvoeren om een Guardian te herkennen
    const explicitFlag = tiger.isRuneGuardian === true;
    
    const nameCheck = tiger.name && 
      (tiger.name.toLowerCase().includes('guardian') || 
       tiger.name.toLowerCase().includes('rune'));
       
    const collectionCheck = tiger.collection && 
      (tiger.collection.toLowerCase().includes('guardian') || 
       tiger.collection.toLowerCase().includes('rune'));
    
    // ID check voor bekende Guardian IDs
    const knownGuardianIDs = [
      'e0fa3603a3eb14944bb38d16dbf21a7eb79af8ebd21828e8dad72f7ce4daa7cei0',
      'c9970479c393de09e886afd5fd3e0ff5c4fea97e00d1c4251469d99469357a46i0',
      '51bce55d0e69f65c9d43b0eec14e7f0b5392edf4c4ca4ad891fda0a706f23e1di0',
      '4c85f0ee6dd8f99a50716cacc460cd03d96ae4aaddbda1a84f1e1b01f4ce7cb0i0',
      'bd5c8b5d95ec5a61b0ec3eb7e06ed1f0a160fbbb4f66b46ae2e7adcf7bc90d60i0',
      '7ec90d31d1ea5b801157b9d5c89cfc59c87ecbf95d2d06b175df44a0190c8f90i0',
      '7dac5fc07f6a02c2ed1d5c60bb91b9fcbcf4b499c5c72b5f9ea5edd3e65ebfffi0',
      '8a24aea5a8d6f02b1e0de79abb99acac72da1b6a29cbdcdbcef3a2fef1f4ffcai0',
      '4458e1b1d33d49d38f05efc6c3b6a02d91a6f8d4c600a93671be0d0ecc4e43fei0',
      '22c66a48e32d27d0a4c1e4ff5df44c07361e59d3b2784161de25239c85334a5ci0',
      '32cfe6c1bfa49e22bd8c57e1a10a15c09ef5ecdbe9a4fe8a7c9e4d98359ecf8fi0',
      'cda3f5ac84c35a16d9b13e92c8bae0e91da06219f43e76ca1f8093a9a1e5cb13i0',
      'bdcf3dde04fdcc3fba8d05b3c1bd8e2e91072d8e8ec6cc12b3c441e0e87cfd22i0',
      'c4b28e3c43a5f6bb99b49c53edecf2e0fbf0bd91b20dca5d099152d7ea2bff6di0',
      'c0a2b7a253d97346c730eff3a1a1eabe4ec3a3fb60d89fd3fd96a10bc79b7fe5i0'
    ];
    const idCheck = tiger.id && knownGuardianIDs.includes(tiger.id);
    
    return explicitFlag || nameCheck || collectionCheck || idCheck;
  };

  // Direct stake function voor externe componenten (zoals TigerMissions)
  const stakeTiger = async (tigerId: string, missionId: string = "default"): Promise<any> => {
    console.log('Staking tiger:', tigerId);
    if (!walletAddress) {
      console.error('No wallet address, cannot stake');
      return { success: false, error: 'No wallet address provided' };
    }
    
    // Check if we have the tiger object in userTigers
    const tiger = userTigers.find(t => t.id === tigerId);
    if (!tiger) {
      console.error(`Cannot find tiger with ID: ${tigerId}`);
      return { success: false, error: 'Tiger not found in your wallet' };
    }
    
    // Log the tiger we're staking for debugging
    console.log('Staking tiger object:', tiger);
    
    // Bepaal het level van deze tiger
    const tigerLevelValue = getTigerLevel(tigerId);
    console.log(`Tiger ${tigerId} has level ${tigerLevelValue}`);
    
    try {
      // We starten een API call om de tiger te staken
      // De server bepaalt nu de tijdstippen voor staking en beschikbaarheid van chests
      console.log(`Calling API to stake tiger ${tigerId} (server will determine timestamps)`);
      
      // Maak API call naar de server
      const response = await tigerApiService.stakeTiger(walletAddress, tigerId, tiger);
      console.log('Stake API response:', response);
      
      if (!response || !response.success) {
        throw new Error(response?.error || 'Unknown error staking tiger');
      }
      
      // Nu de server-side data is opgeslagen, synchroniseren we ook met localStorage
      // We gebruiken de timestamps die door de server zijn bepaald
      const serverStakedTiger = response.stakedInfo?.find((t: any) => t.id === tigerId);
      
      if (!serverStakedTiger) {
        console.error('Server response missing staked tiger info');
        throw new Error('Server response missing staked tiger info');
      }
      
      const stakeTime = serverStakedTiger.stakedAt;
      const chestReadyTime = serverStakedTiger.nextChestAt;
      
      console.log(`Server determined stake time: ${new Date(stakeTime).toLocaleTimeString()}`);
      console.log(`Server determined nextChestAt: ${new Date(chestReadyTime).toLocaleTimeString()}`);
      console.log(`Chest will be available in ${Math.ceil((chestReadyTime - stakeTime) / 1000)} seconds`);
      
      // Use functional update to safely modify tigerStakingDB state
      setTigerStakingDB((prevDB: any) => {
        const newDB = JSON.parse(JSON.stringify(prevDB)); // Deep clone the previous state
        
        // Ensure the stakedTigers object exists and has an entry for this wallet
        if (!newDB.stakedTigers) {
          newDB.stakedTigers = {};
        }
        
        if (!newDB.stakedTigers[walletAddress]) {
          newDB.stakedTigers[walletAddress] = {};
        }
        
        // Check if tiger is already staked
        if (newDB.stakedTigers[walletAddress][tigerId]) {
          console.log(`Tiger ${tigerId} is already staked, not staking again`);
          return prevDB; // Return previous state without changes
        }
        
        // Add the tiger to staked tigers with server-determined timestamps
        newDB.stakedTigers[walletAddress][tigerId] = {
          id: tigerId,
          name: tiger.name || `Tiger #${tigerId.substring(0, 8)}`,
          image: tiger.image,
          isRuneGuardian: isRuneGuardian(tiger),
          stakedAt: stakeTime,       // Server-bepaald tijdstip
          nextChestAt: chestReadyTime, // Server-bepaald tijdstip
          missionId: missionId,
          level: tigerLevelValue,
          hasClaimedChest: false,
          claimedChests: 0
        };
        
        console.log(`Added tiger ${tigerId} to localStorage with server timestamps`);
        
        // Sla de huidige tigerStakingDB direct op in localStorage
        try {
          localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
          console.log('Saved updated tigerStakingDB to localStorage');
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
        }
        
        return newDB;
      });
      
      // Update ook de stakedTigers array voor de UI met dezelfde server timestamps
      const newStakedTiger = {
        id: tigerId,
        name: tiger.name || `Tiger #${tigerId.substring(0, 8)}`,
        image: tiger.image,
        isRuneGuardian: isRuneGuardian(tiger),
        stakedAt: stakeTime,       // Server-bepaald tijdstip
        nextChestAt: chestReadyTime, // Server-bepaald tijdstip
        key: tigerId,
        hasClaimedChest: false
      };
      
      setStakedTigers(prev => [...prev, newStakedTiger]);
      
      // Verwijder de tiger uit de userTigers lijst
      setUserTigers(prev => prev.filter(t => t.id !== tigerId));
      
      // Toon een succes bericht met de exacte wachttijd
      const waitTimeSeconds = Math.ceil((chestReadyTime - Date.now()) / 1000);
      setMessage(`Tiger ${tiger.name || tigerId.substring(0, 8)} is now staked! Chest will be available in ${waitTimeSeconds} seconds.`);
      setMessageType('success');
      
      // Reset de geselecteerde tiger
      setSelectedTiger(null);
      
      // Immediately load updated staking data
      loadWalletAndStakingData();
      
      return { success: true };
    } catch (error) {
      console.error('Error staking tiger:', error);
      return { success: false, error: `Error staking tiger: ${error}` };
    }
  };
  
  // Direct unstake function voor externe componenten (zoals TigerMissions)
  const unstakeTiger = async (tigerId: string): Promise<any> => {
    console.log('Unstaking tiger:', tigerId);
    if (!walletAddress) {
      console.error('No wallet address, cannot unstake');
      return { success: false, error: 'No wallet address provided' };
    }
    
    try {
      // Vind de tiger die we willen unstaken
      const tigerToUnstake = stakedTigers.find(tiger => tiger.id === tigerId);
      
      if (!tigerToUnstake) {
        console.error(`Tiger ${tigerId} not found in staked tigers array`);
        return { success: false, error: 'Tiger not found in staked tigers' };
      }
      
      // Use functional update to safely modify tigerStakingDB state
      setTigerStakingDB((prevDB: any) => {
        const newDB = JSON.parse(JSON.stringify(prevDB)); // Deep clone the previous state
        
        // Check if this wallet has any staked tigers
        if (!newDB.stakedTigers || !newDB.stakedTigers[walletAddress]) {
          console.log(`No staked tigers found for wallet ${walletAddress}`);
          return prevDB; // Return previous state without changes
        }
        
        // Check if this tiger is staked
        if (!newDB.stakedTigers[walletAddress][tigerId]) {
          console.log(`Tiger ${tigerId} is not staked, cannot unstake`);
          return prevDB; // Return previous state without changes
        }
        
        // Log the tiger we're unstaking
        const unstakingTiger = newDB.stakedTigers[walletAddress][tigerId];
        console.log('Unstaking tiger:', unstakingTiger);
        
        // Remove this tiger from staked tigers
        delete newDB.stakedTigers[walletAddress][tigerId];
        
        console.log(`Removed tiger ${tigerId} from staked tigers for wallet ${walletAddress}`);
        
        // Sla direct op in localStorage
        try {
          localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
          console.log('Saved updated tigerStakingDB to localStorage after unstaking');
        } catch (storageError) {
          console.error('Error saving to localStorage after unstaking:', storageError);
        }
        
        return newDB;
      });
      
      // Update de stakedTigers array door de unstaked tiger te verwijderen
      setStakedTigers(prev => prev.filter(tiger => tiger.id !== tigerId));
      
      // Voeg de tiger toe aan userTigers
      const unstakedTiger = {
        id: tigerToUnstake.id,
        name: tigerToUnstake.name,
        image: tigerToUnstake.image,
        key: tigerToUnstake.id, 
        inscriptionNumber: 0,
        inscriptionId: tigerToUnstake.id,
        isKnownTiger: false,
        isRuneGuardian: isRuneGuardian(tigerToUnstake)
      } as BitcoinTiger;
      
      setUserTigers(prev => [...prev, unstakedTiger]);
      
      // Reset selected staked tiger if it was the one we just unstaked
      if (selectedStakedTiger === tigerId) {
        setSelectedStakedTiger(null);
      }
      
      // Toon succes bericht
      setMessage(`Tiger ${tigerToUnstake.name || tigerId.substring(0, 8)} has been returned to your collection!`);
      setMessageType('success');
      
      // Immediately load updated staking data
      loadWalletAndStakingData();
      
      return { success: true };
    } catch (error) {
      console.error('Error unstaking tiger:', error);
      return { success: false, error: `Error unstaking tiger: ${error}` };
    }
  };

  // Helper functie om tijd tot volgende chest te formatteren
  const formatTimeRemaining = (nextChestAt?: number) => {
    if (!isClient || !nextChestAt) return '00:00:00'; // Prevent hydration issues
    
    const now = currentTime || Date.now();
    let timeLeft = Math.max(0, nextChestAt - now);
    
    // Als er minder dan 0 seconden over zijn, toon "READY!"
    if (timeLeft <= 0) {
      return 'READY!';
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    timeLeft = timeLeft % (1000 * 60 * 60 * 24);
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    timeLeft = timeLeft % (1000 * 60 * 60);
    const minutes = Math.floor(timeLeft / (1000 * 60));
    timeLeft = timeLeft % (1000 * 60);
    const seconds = Math.floor(timeLeft / 1000);
    
    // Als er dagen zijn, toon dagen en uren
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    
    // Als er alleen uren zijn, toon uren en minuten
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    // Als er alleen minuten en seconden zijn, toon traditioneel formaat
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Zet huidige tijd voor chest eligibility checks - only on client
  const now = isClient ? (currentTime || Date.now()) : 0;

  // Effect om elke seconde formatTimeRemaining opnieuw uit te voeren
  useEffect(() => {
    if (!isClient || !nextChestDate) return;
    
    // Update alleen de countdown elke seconde
    const timer = setInterval(() => {
      setCurrentTime(Date.now()); // Update current time to trigger re-renders
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextChestDate, isClient]);

  // Voeg een timer toe om de status van gestakede tigers te controleren
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    // Check elke seconde of een tiger klaar is voor een chest
    const tigerCheckTimer = setInterval(() => {
      // Update de huidige tijd
      const currentTime = Date.now();
      setCurrentTime(currentTime); // Update state to trigger re-renders
      
      // Bijhouden van echte aantal beschikbare chests
      let actualAvailableChests = 0;
      let tigerStateChanged = false;
      
      // Check alle tigers en tel alleen chests die klaar zijn maar nog niet geclaimd
      const updatedTigers = stakedTigers.map(tiger => {
        const isReadyForChest = currentTime >= tiger.nextChestAt;
        let hasClaimedChest = tiger.hasClaimedChest;
        
        // Reset hasClaimedChest als de timer opnieuw is verstreken
        if (isReadyForChest && hasClaimedChest) {
          // Check of de nextChestAt tijd meer dan 24 uur geleden is
          // Dit betekent dat er een nieuwe periode is verstreken sinds de laatste claim
          const hoursSinceNextChest = (currentTime - tiger.nextChestAt) / (60 * 60 * 1000);
          if (hoursSinceNextChest >= 24) {
            // Reset de claimed status en update de nextChestAt tijd
            hasClaimedChest = false;
            tigerStateChanged = true;
            
            // Update ook in tigerStakingDB als die bestaat
            if (tigerStakingDB && tigerStakingDB.stakedTigers && 
                tigerStakingDB.stakedTigers[walletAddress] && 
                tigerStakingDB.stakedTigers[walletAddress][tiger.id]) {
              
              tigerStakingDB.stakedTigers[walletAddress][tiger.id].hasClaimedChest = false;
              tigerStakingDB.stakedTigers[walletAddress][tiger.id].nextChestAt = currentTime;
              
              // Sla de wijziging op in localStorage
              try {
                localStorage.setItem('tigerStakingDB', JSON.stringify(tigerStakingDB));
              } catch (error) {
                console.error('Error saving tigerStakingDB to localStorage:', error);
              }
            }
            
            return {
              ...tiger,
              hasClaimedChest: false,
              nextChestAt: currentTime // Reset de timer naar nu
            };
          }
        }
        
        // Als de tiger klaar is voor een chest en deze nog niet is geclaimd
        if (isReadyForChest && !hasClaimedChest) {
          actualAvailableChests++;
        }
        
        return tiger;
      });
      
      // Update de tigers alleen als er een wijziging is
      if (tigerStateChanged) {
        setStakedTigers(updatedTigers);
      }
      
      // Update het aantal beschikbare chests maar alleen als het verschilt van de huidige waarde
      if (actualAvailableChests !== availableChests) {
        setAvailableChests(actualAvailableChests);
      }
    }, 1000);
    
    return () => clearInterval(tigerCheckTimer);
  }, [stakedTigers, availableChests, walletAddress, tigerStakingDB, isClient]);

  // NIEUWE EFFECT: Extra effect om de timers op de kaarten elke seconde bij te werken
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    // Dit effect wordt specifiek gebruikt om de timers op de kaarten elke seconde bij te werken
    // zonder de hele stakedTigers array te veranderen
    const timerUpdateInterval = setInterval(() => {
      setCurrentTime(Date.now()); // Update current time to force re-render of timer displays
    }, 1000);
    
    return () => clearInterval(timerUpdateInterval);
  }, [isClient]);

  // Voeg een functie toe om te controleren of er nieuwe chests beschikbaar zijn
  const checkForNewChests = useCallback(() => {
    const currentTime = Date.now();
    let newChestsAvailable = false;
    
    // Controleer elke gestakede tiger
    stakedTigers.forEach(tiger => {
      if (currentTime >= tiger.nextChestAt && tiger.nextChestAt > 0) {
        newChestsAvailable = true;
      }
    });
    
    // Als er nieuwe chests zijn, refresh de data
    if (newChestsAvailable) {
      // Refresh tigers data zonder loading state te tonen
      refreshTigersData(false);
    }
  }, [stakedTigers]);
  
  // Regelmatig controleren op nieuwe chests (elke 10 seconden)
  useEffect(() => {
    const chestsCheckInterval = setInterval(() => {
      checkForNewChests();
    }, 10000);
    
    return () => clearInterval(chestsCheckInterval);
  }, [checkForNewChests]);

  // Functie om tigers data te refreshen zonder noodzakelijkerwijs loading state te tonen
  const refreshTigersData = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    
    try {
      await loadWalletAndStakingData();
      if (showLoading) {
        setMessage('Tiger data refreshed successfully');
        setMessageType('success');
      }
    } catch (error) {
      if (showLoading) {
        setMessage('Error refreshing data. Please try again.');
        setMessageType('error');
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // Refresh tigers
  const refreshTigers = () => {
    refreshTigersData(true); // Met loading state
  };

  // Effect om data te laden bij initialisatie
  useEffect(() => {
    console.log('BitcoinTigersStaking useEffect triggered, walletAddress:', walletAddress);
    
    // Probeer wallet address uit verschillende bronnen te halen
    let effectiveWalletAddress = walletAddress;
    
    if (!effectiveWalletAddress || effectiveWalletAddress.trim() === '') {
      // Probeer localStorage
      effectiveWalletAddress = localStorage.getItem('walletAddress') || '';
      console.log('No walletAddress prop, trying localStorage:', effectiveWalletAddress);
      
      // Als localStorage ook leeg is, probeer dan cookies
      if (!effectiveWalletAddress || effectiveWalletAddress.trim() === '') {
        try {
          // Probeer wallet gegevens uit cookies te halen
          const walletCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('wallet_session='));
          
          if (walletCookie) {
            const cookieValue = walletCookie.split('=')[1];
            const walletData = JSON.parse(decodeURIComponent(cookieValue));
            effectiveWalletAddress = walletData.walletAddress || '';
            console.log('Trying wallet address from cookie:', effectiveWalletAddress);
            
            // Ook opslaan in localStorage voor toekomstig gebruik
            if (effectiveWalletAddress) {
              localStorage.setItem('walletAddress', effectiveWalletAddress);
            }
          }
        } catch (error) {
          console.error('Error parsing wallet cookie:', error);
        }
      }
    }
    
    if (effectiveWalletAddress && effectiveWalletAddress.trim() !== '') {
      console.log('Valid wallet address found, calling loadWalletAndStakingData...');
      loadWalletAndStakingData();
    } else {
      console.log('No valid wallet address found anywhere, setting loading to false');
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  // Effect om te detecteren wanneer component mount
  useEffect(() => {
    console.log('BitcoinTigersStaking component mounted');
    console.log('Initial walletAddress:', walletAddress);
    
    // Extra check - probeer wallet address uit localStorage te halen als het niet is doorgegeven
    if (!walletAddress || walletAddress.trim() === '') {
      const storedWalletAddress = localStorage.getItem('walletAddress') || '';
      console.log('No walletAddress prop, trying localStorage:', storedWalletAddress);
      if (storedWalletAddress && storedWalletAddress.trim() !== '') {
        console.log('Found wallet address in localStorage, triggering data load...');
        loadWalletAndStakingData();
      }
    }
  }, []);

  // Laad wallet en staking data
  const loadWalletAndStakingData = async (forceReload: boolean = false) => {
    // Check if we're already loading
    if (loadingLock && !forceReload) {
      console.log('Already loading data, skipping...');
      return;
    }

    // Check cache validity (skip for force reload)
    const now = Date.now();
    if (!forceReload && (now - lastDataLoad) < DATA_CACHE_DURATION) {
      console.log('Using cached data, skipping API calls');
      return;
    }

    // Try to get wallet address from multiple sources
    let effectiveWalletAddress = walletAddress;
    
    if (!effectiveWalletAddress || effectiveWalletAddress.trim() === '') {
      // Try localStorage
      effectiveWalletAddress = localStorage.getItem('walletAddress') || '';
      
      // Try cookies as last resort
      if (!effectiveWalletAddress || effectiveWalletAddress.trim() === '') {
        try {
          const walletCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('wallet_session='));
          
          if (walletCookie) {
            const cookieValue = walletCookie.split('=')[1];
            const walletData = JSON.parse(decodeURIComponent(cookieValue));
            effectiveWalletAddress = walletData.walletAddress || '';
            
            // Save to localStorage for future use
            if (effectiveWalletAddress) {
              localStorage.setItem('walletAddress', effectiveWalletAddress);
            }
          }
        } catch (error) {
          console.error('Error parsing wallet cookie in loadWalletAndStakingData:', error);
        }
      }
    }
    
    if (!effectiveWalletAddress || effectiveWalletAddress.trim() === '') {
      console.warn('No wallet address available from any source in loadWalletAndStakingData');
      setIsLoading(false);
      return;
    }

    console.log('Loading wallet and staking data for:', effectiveWalletAddress);
    setLoadingLock(true);
    setIsLoading(true);
    setMessage('');
    setMessageType('');
    
    try {
      // First, try to fetch tigers from the API with retry logic voor rate limiting
      console.log('Step 1: Fetching tigers from API...');
      let fetchedTigers: BitcoinTiger[] = [];
      
      try {
        setMessage('Loading Bitcoin Tigers...');
        setMessageType('warning');
        
        fetchedTigers = await tigerApiService.fetchTigers(effectiveWalletAddress);
        
        if (fetchedTigers && fetchedTigers.length > 0) {
          console.log(`Found ${fetchedTigers.length} tigers in wallet:`, fetchedTigers);
          setUserTigers(fetchedTigers);
          
          // Log missing image mappings voor debugging
          logMissingMappings(fetchedTigers);
          
          // Cache de tigers voor volgende keer
          localStorage.setItem(`bitcoinTigers_${effectiveWalletAddress}`, JSON.stringify(fetchedTigers));
          
          // Update loading message
          setMessage(`Successfully loaded ${fetchedTigers.length} Bitcoin Tigers from your collection!`);
          setMessageType('success');
        } else {
          console.log('No tigers found in wallet, this is normal if user has no Bitcoin Tigers NFTs');
          setUserTigers([]);
          setMessage('No Bitcoin Tigers found in this wallet.');
          setMessageType('warning');
        }
      } catch (tigerFetchError: any) {
        console.error('Error fetching tigers:', tigerFetchError);
        
        // If we get rate limited, use cached data and try again later
        if (tigerFetchError.response?.status === 429) {
          console.log('Rate limited, trying cached data and will retry...');
          const cachedTigers = localStorage.getItem(`bitcoinTigers_${effectiveWalletAddress}`);
          if (cachedTigers) {
            try {
              const parsedTigers = JSON.parse(cachedTigers);
              setUserTigers(parsedTigers);
              console.log(`Using ${parsedTigers.length} cached tigers`);
              
              // Retry after a delay
              setTimeout(() => {
                console.log('Retrying tiger fetch after rate limit...');
                loadWalletAndStakingData(true);
              }, 60000); // Retry after 1 minute
            } catch (parseError) {
              console.error('Error parsing cached tigers:', parseError);
              setUserTigers([]);
            }
          } else {
            setUserTigers([]);
          }
        } else {
          setUserTigers([]);
        }
      }

      // Always try to load staking status
      console.log('Step 2: Loading staking status...');
      try {
        const stakingStatus = await tigerApiService.getStakingStatus(effectiveWalletAddress);
        console.log('Staking status response:', stakingStatus);
        
        // Fix: Remove the incorrect success check - the API returns the staking data directly
        if (stakingStatus) {
          // Handle different response formats
          let stakedTigersList: TigerStakedInfo[] = [];
          
          if (Array.isArray(stakingStatus.stakedTigers)) {
            stakedTigersList = stakingStatus.stakedTigers;
          } else if (stakingStatus.stakedInfo && Array.isArray(stakingStatus.stakedInfo)) {
            stakedTigersList = stakingStatus.stakedInfo;
          }
          
          console.log(`Found ${stakedTigersList.length} staked tigers:`, stakedTigersList);
          setStakedTigers(stakedTigersList);
          setAvailableChests(stakingStatus.availableChests || 0);
          
          if (stakingStatus.nextChestDate && stakingStatus.nextChestDate > 0) {
            setNextChestDate(new Date(stakingStatus.nextChestDate));
          } else {
            setNextChestDate(null);
          }
          
          // Update message if we found staked tigers
          if (stakedTigersList.length > 0) {
            setMessage(`Found ${stakedTigersList.length} staked Bitcoin Tigers! Available chests: ${stakingStatus.availableChests || 0}`);
            setMessageType('success');
          }
        } else {
          console.log('No staking status found or failed to get status');
          // Initialize empty staking state
          setStakedTigers([]);
          setAvailableChests(0);
          setNextChestDate(null);
        }
      } catch (stakingError) {
        console.error('Error loading staking status:', stakingError);
        // Don't fail completely, just log and continue with empty staking state
        setStakedTigers([]);
        setAvailableChests(0);
        setNextChestDate(null);
      }
      
      // Load from localStorage as backup/supplement
      console.log('Step 3: Loading from localStorage...');
      if (tigerStakingDB && tigerStakingDB.stakedTigers && tigerStakingDB.stakedTigers[effectiveWalletAddress]) {
        const localStakedTigers = Object.values(tigerStakingDB.stakedTigers[effectiveWalletAddress]) as TigerStakedInfo[];
        console.log(`Found ${localStakedTigers.length} staked tigers in localStorage:`, localStakedTigers);
        
        // Merge with API data if needed (API data takes precedence)
        setStakedTigers(prevStaked => {
          if (prevStaked.length === 0) {
            return localStakedTigers;
          }
          return prevStaked; // Keep API data if available
        });
      }
      
      // Update cache timestamp
      setLastDataLoad(now);
      
      setMessage('Tiger data loaded successfully');
      setMessageType('success');
      
    } catch (error) {
      console.error('Error loading wallet and staking data:', error);
      setMessage('Error loading tiger data. Please try refreshing the page.');
      setMessageType('error');
      
      // Set empty state on error
      setUserTigers([]);
      setStakedTigers([]);
      setAvailableChests(0);
      setNextChestDate(null);
    } finally {
      setIsLoading(false);
      setLoadingLock(false);
    }
  };

  // Functie om een Tiger te staken
  const handleStakeTiger = async () => {
    if (!selectedTiger) {
      setMessage('Please select a Bitcoin Tiger to stake');
      setMessageType('error');
      return;
    }

    setIsStakingTiger(true);
    
    try {
      // Vind geselecteerde tiger
      const tigerToStake = userTigers.find(tiger => tiger.id === selectedTiger);
      
      if (!tigerToStake) {
        setMessage('Selected Bitcoin Tiger not found');
        setMessageType('error');
        return;
      }
      
      // Stake tiger via API
      const response = await tigerApiService.stakeTiger(
        walletAddress, 
        tigerToStake.id, 
        tigerToStake
      );
      
      // Bepaal de server timestamps of gebruik lokale tijd als fallback
      const currentTime = Date.now();
      const stakeTime = response.stakedAt || currentTime;
      const nextChestTime = response.nextChestAt || (currentTime + (MIN_STAKE_TIME_SECONDS * 1000));
      
      console.log(`Staking tiger ${tigerToStake.id} at ${new Date(stakeTime).toLocaleTimeString()}`);
      console.log(`Next chest will be available at ${new Date(nextChestTime).toLocaleTimeString()}`);
      
      // Maak een nieuwe gestakede tiger met correcte tijden
      const newStakedTiger: TigerStakedInfo = {
        id: tigerToStake.id,
        key: tigerToStake.id,
        name: tigerToStake.name || `Tiger #${tigerToStake.id.substring(0, 8)}`,
        image: tigerToStake.image,
        stakedAt: stakeTime,
        nextChestAt: nextChestTime,
        isRuneGuardian: isRuneGuardian(tigerToStake),
        hasClaimedChest: false
      };
      
      // Update UI state
      setStakedTigers(prev => [...prev, newStakedTiger]);
      setUserTigers(prevTigers => prevTigers.filter(tiger => tiger.id !== tigerToStake.id));
      setSelectedTiger(null);
      
      // Update localStorage
      if (tigerStakingDB) {
        const newDB = JSON.parse(JSON.stringify(tigerStakingDB));
        
        // Zorg ervoor dat de structuur bestaat
        if (!newDB.stakedTigers) {
          newDB.stakedTigers = {};
        }
        
        if (!newDB.stakedTigers[walletAddress]) {
          newDB.stakedTigers[walletAddress] = {};
      }
      
        // Voeg nieuwe tiger toe aan de DB
        newDB.stakedTigers[walletAddress][tigerToStake.id] = {
          id: tigerToStake.id,
          name: tigerToStake.name || `Tiger #${tigerToStake.id.substring(0, 8)}`,
          image: tigerToStake.image,
          stakedAt: stakeTime,
          nextChestAt: nextChestTime,
          isRuneGuardian: isRuneGuardian(tigerToStake),
          hasClaimedChest: false,
          level: getTigerLevel(tigerToStake.id)
        };
        
        // Sla op in localStorage
        localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
        setTigerStakingDB(newDB);
        
        console.log('Updated tigerStakingDB with new staked tiger:', newDB.stakedTigers[walletAddress][tigerToStake.id]);
      }
      
      // Bereken wachttijd voor bericht
      const waitTimeSeconds = Math.ceil((nextChestTime - currentTime) / 1000);
      
      // Success message
      setMessage(`${tigerToStake.name} successfully staked! You will receive a chest in ${waitTimeSeconds} seconds.`);
      setMessageType('success');
      
      // Force een data refresh na korte vertraging
      setTimeout(() => {
        loadWalletAndStakingData();
      }, 500);
    } catch (error: any) {
      setMessage(`Error staking: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsStakingTiger(false);
    }
  };

  // Functie om een Tiger unstaken
  const handleUnstakeTiger = async () => {
    if (!selectedStakedTiger) {
      setMessage('Please select a staked Bitcoin Tiger');
      setMessageType('error');
      return;
    }

    setIsUnstakingTiger(true);
    
    try {
      // Vind geselecteerde gestakede tiger
      const tigerToUnstake = stakedTigers.find(tiger => tiger.id === selectedStakedTiger);
      
      if (!tigerToUnstake) {
        setMessage('Selected staked Bitcoin Tiger not found');
        setMessageType('error');
        return;
      }
      
      // Unstake tiger via API
      const response = await tigerApiService.unstakeTiger(walletAddress, tigerToUnstake.id);
      
      // Update UI state
      const newStakedTigers = response.stakedInfo || [];
      
      // Voeg unstaked tiger toe aan user tigers
      const unstakedTiger = {
        id: tigerToUnstake.id,
        name: tigerToUnstake.name,
        image: tigerToUnstake.image || '',
        key: tigerToUnstake.id, 
        inscriptionNumber: 0,
        inscriptionId: tigerToUnstake.id,
        isKnownTiger: false,
        isRuneGuardian: isRuneGuardian(tigerToUnstake)
      } as BitcoinTiger;
      
      setUserTigers(prev => [...prev, unstakedTiger]);
      setStakedTigers(newStakedTigers);
      setSelectedStakedTiger(null);
      
      if (response.nextChestDate) {
        setNextChestDate(new Date(response.nextChestDate));
      } else {
        setNextChestDate(null);
      }
      
      setAvailableChests(response.availableChests || 0);
      
      // Success message
      setMessage(`${tigerToUnstake.name} successfully unstaked!`);
      setMessageType('success');
    } catch (error: any) {
      setMessage(`Error unstaking: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsUnstakingTiger(false);
    }
  };

  // Functie om een chest claimen
  const handleClaimChest = async () => {
    if (availableChests <= 0) {
      setMessage('Je hebt geen chests beschikbaar om te claimen');
      setMessageType('error');
      return;
    }

    // Controleer of er al een claim bezig is
    const lockKey = `claiming_chest_${walletAddress}`;
    if (localStorage.getItem(lockKey) === 'true') {
      setMessage('Er is al een claim in behandeling, wacht tot deze is voltooid');
      setMessageType('warning');
      return;
    }

    setIsClaimingChest(true);
    
    try {
      // Toon de opening animatie
      setClaimReward({
        amount: 0,
        isHighRoll: false,
        isJackpot: false,
        isClaiming: true
      });
      setShowClaimReveal(true);
      
      // Laat even zien dat de chest opent (korte vertraging)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Controleer hoeveel chests er beschikbaar zijn en NIET al geclaimd zijn
      const readyTigers = stakedTigers.filter(
        tiger => now >= tiger.nextChestAt && !tiger.hasClaimedChest
      );
      
      console.log(`Found ${readyTigers.length} tigers with available chests`);
      
      // Als er geen tigers klaar zijn, toon een foutmelding
      if (readyTigers.length === 0) {
        throw new Error('Geen tigers met beschikbare chests gevonden');
      }
      
      // Bereken het totale aantal chests op basis van tiger levels
      let totalChestsToAward = 0;
      
      for (const tiger of readyTigers) {
        const tigerLevel = getTigerLevel(tiger.id);
        const chestsForThisTiger = getChestsForLevel(tigerLevel);
        totalChestsToAward += chestsForThisTiger;
        
        console.log(`Tiger ${tiger.id} (Level ${tigerLevel}) gets ${chestsForThisTiger} chests`);
      }
      
      console.log(`Total chests to award: ${totalChestsToAward} for ${readyTigers.length} tigers`);
      
      // Markeer tijdelijk eerst alle tigers als geclaimd in de UI om herhaald claimen te voorkomen
      const updatedTigers = stakedTigers.map(tiger => {
        if (now >= tiger.nextChestAt && !tiger.hasClaimedChest) {
          return { ...tiger, hasClaimedChest: true };
        }
        return tiger;
      });
      setStakedTigers(updatedTigers);
      
      // Debug: Log de wallet address
      console.log('Attempting to claim chest for wallet:', walletAddress);
      
      // Controleer of walletAddress leeg is
      if (!walletAddress) {
        throw new Error('Wallet address is missing. Please connect your wallet first.');
      }
      
      let totalReward = 0;
      let claimSuccessful = false;
      let rewardType = "LOW_ROLL";
      
      try {
        // Claim chest via API - één keer voor alle chests
        console.log('Calling tigerApiService.claimChest for wallet:', walletAddress);
        
        // Gebruik de nieuwe functie met lock preventie
      const response = await tigerApiService.claimChest(walletAddress);
      
      // Debug: Log het resultaat
      console.log('Claim chest response:', response);
      
      if (response.success) {
          claimSuccessful = true;
          
          // Bereken de basis beloning per chest
          const baseReward = response.satoshisAmount || 0;
          
          // Bereken totale beloning (API beloning * aantal chests)
          totalReward = baseReward * totalChestsToAward;
          
          // Bepaal reward type op basis van de basis beloning
          rewardType = response.rewardType || (
            baseReward >= 25000 ? "JACKPOT" : 
            baseReward >= 10000 ? "HIGH_ROLL" : 
            "LOW_ROLL"
          );
          
          console.log(`Received total reward of ${totalReward} sats (${rewardType}) for ${totalChestsToAward} chests`);
        } else {
          throw new Error(response.error || 'API call failed');
        }
      } catch (apiError: any) {
        console.error('API error claiming chest:', apiError);
        
        // Als er een error is dat er al een claim bezig is, toon een duidelijke melding
        if (apiError.message && apiError.message.includes('al een claim in behandeling')) {
          throw new Error('Er is al een claim in behandeling. Wacht even en probeer het opnieuw.');
        }
        
        // Fallback naar lokale beloningsgeneratie
        console.log('Using local reward generation as fallback');
        
        // Genereer één hoogste beloning voor alle chests
        const roll = Math.random() * 100;
        let baseReward;
        
        if (roll < 0.1) {
          // 0.1% kans op jackpot (25.000-500.000 sats)
          baseReward = Math.floor(Math.random() * (500000 - 25000 + 1)) + 25000;
          rewardType = "JACKPOT";
        } else if (roll < 2) {
          // 1.9% kans op high roll (10.000-25.000 sats)
          baseReward = Math.floor(Math.random() * (25000 - 10000 + 1)) + 10000;
          rewardType = "HIGH_ROLL";
        } else {
          // 98% kans op low roll (1.000-10.000 sats)
          baseReward = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
          rewardType = "LOW_ROLL";
        }
        
        // Vermenigvuldig met aantal chests
        totalReward = baseReward * totalChestsToAward;
        claimSuccessful = true;
        
        console.log(`Generated local fallback reward: ${baseReward} sats × ${totalChestsToAward} chests = ${totalReward} sats total (${rewardType})`);
      }
      
      // Update de UI om de beloning te laten zien
      setClaimReward({
        amount: totalReward,
        isHighRoll: rewardType === "HIGH_ROLL",
        isJackpot: rewardType === "JACKPOT",
        isClaiming: false
      });
      
        // Update wallet balance
      // Vervang het met:
      // Update wallet balance via Lightning Context
      try {
        // Direct de balans ophalen van de server zonder caching
        localStorage.removeItem('lastBalanceFetch');
        
        // Forceer volledige balans refresh via API, negeer caching
        const forceRefreshOptions = {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        };
        
        // Voer een directe API call uit voor de meest actuele balans
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/wallet/${walletAddress}`, forceRefreshOptions);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fresh balance data from API:', data);
          
          // Update de Lightning Context balance direct
          updateBalanceWithTimestamp(data.balance);
          
          console.log(`Updated balance via direct API call: new balance = ${data.balance} sats`);
          
          // Force een extra refresh na korte vertraging
          setTimeout(() => {
            fetchBalance().then(updatedBalance => {
              console.log('Follow-up balance refresh:', updatedBalance);
            });
          }, 300);
        } else {
          console.error('Failed to get fresh balance:', response.statusText);
          
          // Fallback: gebruik de huidige balans + totale beloning
          const currentBalance = await fetchBalance();
        const newBalance = currentBalance + totalReward;
        updateBalanceWithTimestamp(newBalance);
        
          console.log(`Fallback balance update: ${currentBalance} + ${totalReward} = ${newBalance} sats`);
        }
      } catch (balanceError) {
        console.error('Error updating balance:', balanceError);
      }
      
      // Update de tigerStakingDB voor alle geclaimde tigers
      if (tigerStakingDB && tigerStakingDB.stakedTigers && tigerStakingDB.stakedTigers[walletAddress]) {
        setTigerStakingDB((prevDB: any) => {
          const newDB = JSON.parse(JSON.stringify(prevDB));
          
          // Bijhouden welke tigers zijn geclaimd
          const claimedTigerIds: string[] = [];
          
          // Update alle tigers die klaar waren voor een chest
          for (const tiger of readyTigers) {
            if (newDB.stakedTigers[walletAddress][tiger.id]) {
              newDB.stakedTigers[walletAddress][tiger.id].hasClaimedChest = true;
              newDB.stakedTigers[walletAddress][tiger.id].nextChestAt = Date.now() + 24 * 60 * 60 * 1000;
              claimedTigerIds.push(tiger.id);
              
              // Bereken het correcte aantal chests voor deze tiger
              const tigerLevel = getTigerLevel(tiger.id);
              const chestsForThisTiger = getChestsForLevel(tigerLevel);
              
              // Increment claimed chests counter if it exists
              if (typeof newDB.stakedTigers[walletAddress][tiger.id].claimedChests === 'number') {
                newDB.stakedTigers[walletAddress][tiger.id].claimedChests += chestsForThisTiger;
              } else {
                newDB.stakedTigers[walletAddress][tiger.id].claimedChests = chestsForThisTiger;
              }
            }
          }
          
          // Toevoegen van de claim aan de claimedChests
          if (!newDB.claimedChests) {
            newDB.claimedChests = {};
          }
          
          if (!newDB.claimedChests[walletAddress]) {
            newDB.claimedChests[walletAddress] = [];
          }
          
          // Eén geconsolideerde chest entry voor alle claims
          newDB.claimedChests[walletAddress].push({
            id: `multi-claim-${Date.now()}`,
            claimedAt: Date.now(),
            tigerIds: claimedTigerIds,
            totalChests: totalChestsToAward,
            reward: totalReward,
            rewardType: rewardType
          });
          
          // Opslaan in localStorage
          try {
            localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
          } catch (storageError) {
            console.error('Error updating localStorage after API claim:', storageError);
          }
          
          return newDB;
        });
      }
      
      // Verminder het aantal beschikbare chests
      setAvailableChests(0);
      
      // Wacht op animatie en toon het bericht
        setTimeout(() => {
          setShowClaimReveal(false);
          
          // Force een extra balans refresh om de UI te updaten
          localStorage.removeItem('lastBalanceFetch');
          fetchBalance().then(newBalance => {
            console.log('Final force refresh of balance after claim:', newBalance);
          });
          
        // Toon bericht op basis van rewardType
        if (rewardType === "JACKPOT") {
          setMessage(`🎉🎉🎉 JACKPOT!!! ${totalChestsToAward} CHESTS GAVEN JE ${totalReward.toLocaleString()} SATS! 🎉🎉🎉`);
        } else if (rewardType === "HIGH_ROLL") {
          setMessage(`🎉🎉 GROTE WINST! ${totalChestsToAward} CHESTS GAVEN JE ${totalReward.toLocaleString()} SATS! 🎉🎉`);
      } else {
          setMessage(`🎉 JE HEBT ${totalReward.toLocaleString()} SATS ONTVANGEN UIT ${totalChestsToAward} CHESTS! 🎉`);
        }
        setMessageType('success');
        
        // Force een data refresh
        setTimeout(() => {
          loadWalletAndStakingData();
        }, 1000);
      }, rewardType === "JACKPOT" ? 8000 : 5000);
    } catch (error: any) {
      console.error('Error claiming chest:', error);
      setMessage(`Error claiming chest: ${error.message}`);
      setMessageType('error');
      setShowClaimReveal(false);
      
      // Reset de claiming state van tigers die onterecht als geclaimd zijn gemarkeerd
      const resetTigers = stakedTigers.map(tiger => {
        if (now >= tiger.nextChestAt) {
          return { ...tiger, hasClaimedChest: false };
        }
        return tiger;
      });
      setStakedTigers(resetTigers);
    } finally {
      // Zorg ervoor dat de lock wordt verwijderd, zelfs bij fouten
      localStorage.removeItem(lockKey);
      
      setTimeout(() => {
        setIsClaimingChest(false);
      }, 1000);
    }
  };

  // Functie om chest te openen via de API
  const openChestLocally = async (chestId: string, index: number) => {
    console.log(`Opening chest ${chestId} locally at index ${index}`);
    
    // Check if wallet is connected
    if (!walletAddress) {
      setClaimError('Please connect your wallet to claim a chest');
      return;
    }
    
    // Check if claiming is already in progress
    if (localStorage.getItem('claiming_chest')) {
      const claimTime = parseInt(localStorage.getItem('claiming_chest') || '0');
      // If the lock is older than 3 minutes, we can force it
      if (Date.now() - claimTime < 3 * 60 * 1000) {
        console.log('Claim already in progress, please wait...');
        setClaimError('A claim is already in progress. Please wait or refresh the page.');
        return;
      } else {
        console.log('Forcing claim after expired lock');
        localStorage.removeItem('claiming_chest');
      }
    }
    
    // Check if we have a tiger selected
    if (!selectedStakedTiger) {
      console.error('No tiger selected for claiming');
      setClaimError('No tiger selected for claiming');
      return;
    }
    
    // Check if tiger is ready for chest claiming
    const stakedTigerInfo = tigerStakingDB.stakedTigers[selectedStakedTiger];
    if (!stakedTigerInfo) {
      console.error('Selected tiger not found in staking database');
      setClaimError('Selected tiger not found in staking database');
      return;
    }
    
    // Set a claiming lock to prevent duplicate claims
    localStorage.setItem('claiming_chest', Date.now().toString());
    
    try {
      console.log(`Opening chest for tiger ${selectedStakedTiger} (level ${getTigerLevel(selectedStakedTiger)})`);
      console.log(`Tiger info:`, stakedTigerInfo);
      
      // Determine number of chests based on tiger level
      const tigerLevel = getTigerLevel(selectedStakedTiger);
      const chestsCount = getChestsForLevel(tigerLevel);
      console.log(`Tiger level: ${tigerLevel}, chests: ${chestsCount}`);
      
      // Show loading animation
      setClaimReward({
        amount: 0,
        isHighRoll: false,
        isJackpot: false,
        isClaiming: true,
        claimedTigerId: selectedStakedTiger
      });
      
      // Actually call the API to open the chest
      console.log(`Calling API to claim chest for wallet ${walletAddress} (${chestsCount} chests)...`);
      
      try {
        // Call the API with a POST request
        const response = await fetch('/api/tiger-staking/claim-chest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
            tigerLevel,
            chestsCount
          }),
        }).then(res => res.json());
        
        console.log('API response:', response);
        
        if (response.success) {
          // Calculate the total reward
          const totalReward = response.totalReward || response.satoshisAmount || 0;
          
          // Get the individual rewards if available
          const rewards = response.rewards || [response.satoshisAmount];
          
          console.log(`Success! Received ${totalReward} sats from ${chestsCount} chest(s). Individual rewards:`, rewards);
          
          // Determine if any of the rewards is a jackpot or high roll
          const hasJackpot = rewards.some((r: number) => r >= 25000);
          const hasHighRoll = !hasJackpot && rewards.some((r: number) => r >= 5000 && r < 25000);
          
          // Update the claim reward state
          setClaimReward({
            amount: totalReward,
            isHighRoll: hasHighRoll,
            isJackpot: hasJackpot,
            isClaiming: false,
            claimedTigerId: selectedStakedTiger,
            rewards: rewards
          });
          
          // Update our local balance
          // Vervang het met:
          // Update wallet balance via Lightning Context
          try {
            // Direct de balans ophalen van de server zonder caching
            localStorage.removeItem('lastBalanceFetch');
            
            // Forceer volledige balans refresh via API, negeer caching
            const forceRefreshOptions = {
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            };
            
            // Voer een directe API call uit voor de meest actuele balans
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/api/wallet/${walletAddress}`, forceRefreshOptions);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Fresh balance data from API:', data);
              
              // Update de Lightning Context balance direct
              updateBalanceWithTimestamp(data.balance);
              
              console.log(`Updated balance via direct API call: new balance = ${data.balance} sats`);
              
              // Force een extra refresh na korte vertraging
              setTimeout(() => {
                fetchBalance().then(updatedBalance => {
                  console.log('Follow-up balance refresh:', updatedBalance);
                });
              }, 300);
            } else {
              console.error('Failed to get fresh balance:', response.statusText);
              
              // Fallback: gebruik de huidige balans + totale beloning
              const currentBalance = await fetchBalance();
            const newBalance = currentBalance + totalReward;
            updateBalanceWithTimestamp(newBalance);
            
              console.log(`Fallback balance update: ${currentBalance} + ${totalReward} = ${newBalance} sats`);
            }
          } catch (balanceError) {
            console.error('Error updating balance:', balanceError);
          }
          
          // Mark the tiger as having claimed a chest
          const updatedTigerInfo = {
            ...stakedTigerInfo,
            hasClaimedChest: true
          };
          
          // Update tiger in DB
          const updatedTigers = {...tigerStakingDB.stakedTigers};
          updatedTigers[selectedStakedTiger] = updatedTigerInfo;
          setTigerStakingDB({
            ...tigerStakingDB,
            stakedTigers: updatedTigers
          });
          
          // Save to local storage
          localStorage.setItem('tigerStakingDB', JSON.stringify({
            ...tigerStakingDB,
            stakedTigers: updatedTigers
          }));
          
          console.log('Updated tiger info with hasClaimedChest=true:', updatedTigerInfo);
          
          // Move tiger back to available tigers after 5 seconds
          setTimeout(() => {
            unstakeTiger(selectedStakedTiger);
          }, 5000);
        } else {
          console.error('Error in API response:', response);
          setClaimError('Error claiming chest: ' + (response.error || 'Unknown error'));
          
          // Generate a fallback reward
          const baseReward = 2500 + Math.floor(Math.random() * 2500);
          const totalReward = baseReward * chestsCount;
          
          // Generate individual rewards
          const rewards = Array.from<unknown, number>({length: chestsCount}, (_, i) => {
            return Math.max(1000, Math.floor(baseReward * (0.8 + Math.random() * 0.4)));
          });
          
          console.log(`Generating fallback rewards:`, rewards);
          console.log(`Total fallback reward: ${rewards.reduce((a, b) => a + b, 0)} sats`);
          
          setClaimReward({
            amount: rewards.reduce((a, b) => a + b, 0),
            isHighRoll: false,
            isJackpot: false,
            isClaiming: false,
            claimedTigerId: selectedStakedTiger,
            rewards: rewards
          });
        }
      } catch (error) {
        console.error('Error calling claim API:', error);
        setClaimError('Error claiming chest: ' + (error instanceof Error ? error.message : 'Unknown error'));
        
        // Generate a fallback reward even in case of error
        const baseReward = 2500 + Math.floor(Math.random() * 2500);
        const rewards = Array.from<unknown, number>({length: chestsCount}, (_, i) => {
          return Math.max(1000, Math.floor(baseReward * (0.8 + Math.random() * 0.4)));
        });
        
        setClaimReward({
          amount: rewards.reduce((a, b) => a + b, 0),
          isHighRoll: false,
          isJackpot: false,
          isClaiming: false,
          claimedTigerId: selectedStakedTiger,
          rewards: rewards
        });
      }
    } catch (error) {
      console.error('Error in openChestLocally:', error);
      setClaimError('Error opening chest: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      // Always remove the claiming lock
      localStorage.removeItem('claiming_chest');
    }
  };
  
  // Functie om de claimed status van een tiger te resetten
  const resetTigerClaimStatus = (tigerId: string) => {
    if (!walletAddress || !tigerId) return;

    console.log(`Resetting claim status for tiger ${tigerId}`);
    
    try {
      // Eerst de stakedTigers array updaten
      setStakedTigers(prev => 
        prev.map(t => {
          if (t.id === tigerId) {
            console.log(`Found tiger ${tigerId} in stakedTigers, resetting claim status`);
            return { 
              ...t, 
              hasClaimedChest: false, 
              nextChestAt: Date.now() 
            };
          }
          return t;
        })
      );
      
      // Dan ook de localStorage updaten
      if (tigerStakingDB && tigerStakingDB.stakedTigers && tigerStakingDB.stakedTigers[walletAddress] && 
          tigerStakingDB.stakedTigers[walletAddress][tigerId]) {
        
        const newDB = {...tigerStakingDB};
        
        if (newDB.stakedTigers?.[walletAddress]?.[tigerId]) {
          console.log(`Found tiger ${tigerId} in tigerStakingDB, resetting claim status`);
          newDB.stakedTigers[walletAddress][tigerId].hasClaimedChest = false;
          newDB.stakedTigers[walletAddress][tigerId].nextChestAt = Date.now();
          
          // Sla direct op in localStorage
          try {
            localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
            console.log('Reset claim status and saved to localStorage');
            
            // Update de state met de nieuwe DB
            setTigerStakingDB(newDB);
          } catch (error) {
            console.error('Error saving reset claim status to localStorage:', error);
          }
        }
      }
      
      // Update beschikbare chests
      setAvailableChests(prev => prev + 1);
      
      // Toon bevestiging
      setMessage(`Reset claim status for tiger ${tigerId.substring(0, 8)}... You can now claim a chest again.`);
      setMessageType('success');
      
      // Force een refresh van de data
      setTimeout(() => {
        loadWalletAndStakingData();
      }, 1000);
    } catch (error: any) {
      console.error('Error resetting claim status:', error);
      setMessage(`Error resetting claim status: ${error}`);
      setMessageType('error');
    }
  };
  // Duplicate function removed
  // Helper functie om tijd tot volgende chest te formatteren
  const formatTimeRemainingDupe = (nextChestAt?: number) => {
    if (!isClient || !nextChestAt) return '00:00:00'; // Prevent hydration issues
    
    const now = currentTime || Date.now();
    let timeLeft = Math.max(0, nextChestAt - now);
    
    // Als er minder dan 0 seconden over zijn, toon "READY!"
    if (timeLeft <= 0) {
      return 'READY!';
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    timeLeft = timeLeft % (1000 * 60 * 60 * 24);
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    timeLeft = timeLeft % (1000 * 60 * 60);
    const minutes = Math.floor(timeLeft / (1000 * 60));
    timeLeft = timeLeft % (1000 * 60);
    const seconds = Math.floor(timeLeft / 1000);
    
    // Als er dagen zijn, toon dagen en uren
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    
    // Als er alleen uren zijn, toon uren en minuten
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    // Als er alleen minuten en seconden zijn, toon traditioneel formaat
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper functie om te controleren of een afbeelding al is mislukt
  const isFailedImage = useCallback((id: string) => {
    return failedImages.has(id);
  }, [failedImages]);

  // Helper functie om een afbeelding te markeren als mislukt
  const markImageAsFailed = useCallback((id: string) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  // Functie die bepaalt hoeveel chests een tiger krijgt op basis van level
  const getChestsForLevel = (level: number): number => {
    // Level 1: 1 chest, Level 2: 2 chests, etc.
    return level;
  };
  
  // Helper functie om het level van een tiger op te halen
  const getTigerLevel = (tigerId: string): number => {
    try {
      // Eerst kijken of de tiger in de stakingDB zit met een level
      if (tigerStakingDB?.stakedTigers?.[walletAddress]?.[tigerId]?.level) {
        return tigerStakingDB.stakedTigers[walletAddress][tigerId].level;
      }
      
      // Daarna controleren of we een specifiek level hebben voor deze tiger
      if (tigerLevels[tigerId]) {
        return tigerLevels[tigerId];
      }
      
      // Als laatste, check in localStorage voor backwards compatibiliteit
      const levelsStr = localStorage.getItem(`tigerLevels_${walletAddress}`);
      if (levelsStr) {
        try {
          const levels = JSON.parse(levelsStr);
          if (levels[tigerId]) {
            return levels[tigerId];
          }
        } catch (error) {
          console.error(`Error parsing tiger levels for ${tigerId}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error getting level for tiger ${tigerId}:`, error);
    }
    
    // Default naar het algemene tiger level of 1 als dat niet bestaat
    return tigerLevel || 1;
  };

  // Tiger Leveling System - Upgrade functie
  const handleTigerUpgrade = async (targetLevel: number) => {
    // Bepaal upgrade kosten op basis van het doel level (bedragen in dollars omgezet naar sats)
    let upgradeCost = 0;
    // Bitcoin prijs: $105,000 per BTC = $0.00105 per sat
    const satPriceInDollars = 0.00105; // Prijs van 1 sat in dollars
    
    switch (targetLevel) {
      case 2:
        upgradeCost = Math.round(300 / satPriceInDollars); // $300 in sats (ongeveer 285,714 sats)
        break;
      case 3:
        upgradeCost = Math.round(1300 / satPriceInDollars); // $1300 in sats (ongeveer 1,238,095 sats)
        break;
      case 4:
        upgradeCost = Math.round(3100 / satPriceInDollars); // $3100 in sats (ongeveer 2,952,381 sats)
        break;
      case 5:
        upgradeCost = Math.round(5600 / satPriceInDollars); // $5600 in sats (ongeveer 5,333,333 sats)
        break;
      default:
        setMessage('Invalid upgrade level');
      setMessageType('error');
      return;
    }

    // Controleer of we een tiger hebben geselecteerd
    if (!selectedTiger && !selectedStakedTiger) {
      setMessage('Select a tiger to upgrade first');
      setMessageType('warning');
      return;
    }

    // Bepaal welke tiger ID we gaan upgraden
    const tigerIdToUpgrade = selectedTiger || selectedStakedTiger;
       
    // Bitcoin-adres waar de betaling naartoe moet
    const bitcoinAddress = "bc1qwfdxl0pq8d4tefd80enw3yae2k2dsszemrv6j0"; // Vervang met het echte adres
    
    // Toon betaalinformatie
    setPaymentDetails({
      show: true,
      level: targetLevel,
      cost: upgradeCost,
      address: bitcoinAddress,
      tigerId: tigerIdToUpgrade || undefined
    });
    
    // Optie om adres te kopiëren naar klembord wordt in de overlay afgehandeld
    
    console.log(`Showing payment details for Level ${targetLevel} (${upgradeCost} sats) for tiger: ${tigerIdToUpgrade}`);
  };

  // Zoek en update de claimTigerChestFromCard functie
  // ... existing code ...
  // Functie om een tiger chest te claimen vanaf de tiger card
  const claimTigerChestFromCard = async (tigerId: string) => {
    console.log("Attempting to claim chest for tiger:", tigerId);
    
    // Vind de tiger info
    const stakedTiger = stakedTigers.find(t => t.id === tigerId);
    
    if (!stakedTiger) {
      console.error("Tiger not found in staked tigers");
      setMessage("Error: Tiger not found in staked tigers");
      setMessageType('error');
      return;
    }
    
    // Voer tijd validatie uit
    const currentTime = Date.now();
    const secondsSinceStaked = (currentTime - stakedTiger.stakedAt) / 1000;
    const isReadyForChest = currentTime >= stakedTiger.nextChestAt;
    
    console.log(`Validating tiger claim:`, {
      tigerId,
      stakedAt: new Date(stakedTiger.stakedAt).toLocaleString(),
      nextChestAt: new Date(stakedTiger.nextChestAt).toLocaleString(),
      currentTime: new Date(currentTime).toLocaleString(),
      secondsSinceStaked,
      minimumTime: MIN_STAKE_TIME_SECONDS,
      isReadyForChest
    });
    
    if (secondsSinceStaked < MIN_STAKE_TIME_SECONDS) {
      const timeLeft = Math.ceil(MIN_STAKE_TIME_SECONDS - secondsSinceStaked);
      console.error(`Tiger not staked long enough. Needs ${timeLeft} more seconds.`);
      
      // Formateer de tijd in dagen, uren, minuten en seconden
      const days = Math.floor(timeLeft / (24 * 60 * 60));
      let remainingSeconds = timeLeft % (24 * 60 * 60);
      const hours = Math.floor(remainingSeconds / (60 * 60));
      remainingSeconds = remainingSeconds % (60 * 60);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      
      let formattedTimeLeft;
      if (days > 0) {
        formattedTimeLeft = `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        formattedTimeLeft = `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        formattedTimeLeft = `${minutes}m ${seconds}s`;
      } else {
        formattedTimeLeft = `${seconds}s`;
      }
      
      setMessage(`Error: Tiger must be staked for at least 7 days (${formattedTimeLeft} remaining)`);
      setMessageType('error');
      return;
    }
    
    if (!isReadyForChest) {
      console.error("Chest is not ready yet");
      setMessage("Error: Chest is not ready yet");
      setMessageType('error');
      return;
    }
    
    if (stakedTiger.hasClaimedChest) {
      console.error("Chest already claimed for this tiger");
      setMessage("Error: Chest already claimed for this tiger");
      setMessageType('error');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // NIEUW: Markeer deze tiger meteen als geclaimd om herhaald claimen te voorkomen
      const updatedTigers = stakedTigers.map(t => {
        if (t.id === tigerId) {
          return { ...t, hasClaimedChest: true };
        }
        return t;
      });
      setStakedTigers(updatedTigers);
      
      // BELANGRIJK: Update ook in tigerStakingDB om client-side persistentie te garanderen
      if (tigerStakingDB && tigerStakingDB.stakedTigers && tigerStakingDB.stakedTigers[walletAddress]) {
        try {
          const newDB = JSON.parse(JSON.stringify(tigerStakingDB));
          if (newDB.stakedTigers[walletAddress][tigerId]) {
            newDB.stakedTigers[walletAddress][tigerId].hasClaimedChest = true;
            localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
            setTigerStakingDB(newDB);
          }
        } catch (err) {
          console.error("Error updating local tigerStakingDB:", err);
        }
      }
      
      // Toon een bericht
      setMessage("Claiming chest...");
      setMessageType('warning');
      
      // Krijg de tiger level om het aantal chests te bepalen
      const tigerLevel = getTigerLevel(tigerId);
      
      // Toon de claim animatie/UI voordat we de API call doen
      // Reset eerst de claim reward status
      setClaimReward({
        amount: 0,
        isHighRoll: false,
        isJackpot: false,
        isClaiming: true,
        claimedTigerId: tigerId
      });
      
      // Maak de tiger ID bekend voor de claim overlay
      setSelectedStakedTiger(tigerId);
      
      // Set chest IDs voor overlay (hier alleen 1 ID nodig)
      setChestIds([`chest-${tigerId}-${Date.now()}`]);
      
      // Toon de claim overlay
      setShowClaimRevealOverlay(true);
      
      // Genereer lokale rewards (als fallback)
      const generateLocalReward = () => {
        const randomValue = Math.random() * 100;
        let reward = 0;
        let rewardType = "LOW_ROLL";
        
        if (randomValue < 0.01) {
          // 0.01% kans op jackpot (25.000-50.000 sats)
          reward = Math.floor(Math.random() * 25000) + 25000;
          rewardType = "JACKPOT";
          console.log(`LOCAL JACKPOT generated: ${reward} sats`);
        } else if (randomValue < 0.05) {
          // 0.04% kans op high roll (10.000-25.000 sats)
          reward = Math.floor(Math.random() * 15000) + 10000;
          rewardType = "HIGH_ROLL";
          console.log(`LOCAL HIGH ROLL generated: ${reward} sats`);
        } else {
          // 99.95% kans op low roll (1.000-10.000 sats)
          reward = Math.floor(Math.random() * 9000) + 1000;
          rewardType = "LOW_ROLL";
          console.log(`LOCAL LOW ROLL generated: ${reward} sats`);
        }
        
        // Maak rewards array voor meerdere chests (gebaseerd op level)
        const rewards = [reward];
        let totalReward = reward;
        
        // Voor hogere levels, genereer extra rewards
        if (tigerLevel > 1) {
          for (let i = 1; i < tigerLevel; i++) {
            const additionalReward = Math.floor(Math.random() * 9000) + 1000; // Always low roll for additional
            rewards.push(additionalReward);
            totalReward += additionalReward;
          }
        }
        
        return {
          success: true,
          satoshisAmount: reward,
          totalReward: totalReward,
          rewardType: rewardType,
          rewards: rewards
        };
      };
      
      // Variabelen voor resultaat
      let success = false;
      let result;
      
      try {
        // Maak API call met het tigerId om de server te informeren welke tiger we gebruiken
        const response = await axios.post('/api/tiger-staking/claim-chest', {
          walletAddress: walletAddress,
          tigerLevel,
          chestsCount: tigerLevel,
          tigerId // Stuur het tiger ID mee
        });
        
        console.log("Claim response:", response.data);
        
        if (response.data.success) {
          success = true;
          result = response.data;
        } else {
          console.error("API claim failed:", response.data.error);
          // Genereer lokale beloning als fallback
          result = generateLocalReward();
          success = true; // We beschouwen dit nog steeds als succesvol
        }
      } catch (error) {
        console.error("Error in API claim:", error);
        // Genereer lokale beloning als fallback
        result = generateLocalReward();
        success = true; // We beschouwen dit nog steeds als succesvol
      }
      
      if (success && result) {
        // Bereken de beloning
        const satoshisAmount = result.totalReward || result.satoshisAmount;
        const rewardType = result.rewardType || 'LOW_ROLL';
        const rewards = result.rewards || [satoshisAmount];
        
        // Update de claim reward voor de overlay
        setClaimReward({
          amount: satoshisAmount,
          isHighRoll: rewardType === 'HIGH_ROLL',
          isJackpot: rewardType === 'JACKPOT',
          isClaiming: false,
          claimedTigerId: tigerId,
          rewards: rewards
        });
        
        // Update lokale balans direct om direct feedback te geven
        if (balance !== undefined) {
          setBalance(balance + satoshisAmount);
        }
        
        // Bewaar de nieuwe balans in localStorage zodat het tussen sessies behouden blijft
        try {
          // Get current balance
          const currentBalance = localStorage.getItem('balance')
            ? parseInt(localStorage.getItem('balance')!)
            : 0;
          
          // Add reward to current balance
          const newBalance = currentBalance + satoshisAmount;
          
          // Save to localStorage
          localStorage.setItem('balance', newBalance.toString());
          console.log(`Updated balance in localStorage: ${currentBalance} + ${satoshisAmount} = ${newBalance}`);
        } catch (err) {
          console.error("Error updating balance in localStorage:", err);
        }
        
        // Set timer om automatisch de tiger te unstaken na een delay
        // Gebruik langere vertraging (15 seconden) om ervoor te zorgen dat mensen de beloning kunnen zien
        const unstakeDelay = rewardType === 'JACKPOT' ? 15000 : 12000;
        setTimeout(() => {
          console.log(`Auto-unstaking tiger ${tigerId} after ${unstakeDelay}ms`);
          
          // Sluit de overlay indien nog open
          if (showClaimRevealOverlay) {
            setShowClaimRevealOverlay(false);
          }
          
          // Tiger unstaken en bericht tonen
          forceClearTigerStakeStatus(tigerId).then(result => {
            if (result) {
              // Voor elk reward type een andere kleur en bericht
              let rewardMessage = '';
              
              if (rewardType === 'JACKPOT') {
                rewardMessage = `💰 JACKPOT! ${satoshisAmount.toLocaleString()} sats added to your wallet!`;
              } else if (rewardType === 'HIGH_ROLL') {
                rewardMessage = `🔥 Great roll! ${satoshisAmount.toLocaleString()} sats added to your wallet!`;
              } else {
                rewardMessage = `⚡ ${satoshisAmount.toLocaleString()} sats added to your wallet!`;
              }
              
              setMessage(`${rewardMessage} Tiger returned to your collection.`);
              setMessageType('success');
            } else {
              setMessage("Error returning tiger to collection after claim");
              setMessageType('error');
            }
            
            // Refresh data
            loadWalletAndStakingData();
          });
        }, unstakeDelay);
        
      } else {
        // Toon foutmelding en sluit overlay
        setShowClaimRevealOverlay(false);
        setMessage("Failed to claim chest. Please try again.");
        setMessageType('error');
        
        // Reset de claim status zodat de speler het opnieuw kan proberen
        const resetTigers = stakedTigers.map(t => {
          if (t.id === tigerId) {
            return { ...t, hasClaimedChest: false };
          }
          return t;
        });
        setStakedTigers(resetTigers);
        
        // Reset ook in localStorage
        if (tigerStakingDB && tigerStakingDB.stakedTigers && tigerStakingDB.stakedTigers[walletAddress]) {
          try {
            const newDB = JSON.parse(JSON.stringify(tigerStakingDB));
            if (newDB.stakedTigers[walletAddress][tigerId]) {
              newDB.stakedTigers[walletAddress][tigerId].hasClaimedChest = false;
              localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
              setTigerStakingDB(newDB);
            }
          } catch (err) {
            console.error("Error resetting local tigerStakingDB:", err);
          }
        }
      }
    } catch (error: any) {
      console.error("Error claiming chest:", error);
      setMessage(error.response?.data?.error || error.message || "Error claiming chest");
      setMessageType('error');
      setShowClaimRevealOverlay(false);
      
      // Reset de claim status zodat de speler het opnieuw kan proberen
      const resetTigers = stakedTigers.map(t => {
        if (t.id === tigerId) {
          return { ...t, hasClaimedChest: false };
        }
        return t;
      });
      setStakedTigers(resetTigers);
    } finally {
      setIsLoading(false);
    }
  };
  // ... existing code ...

  // FIRST - Add this new function near the top of the component 
  // This function will handle forcefully unstaking a tiger, no matter what
  const forceUnstakeTiger = async (tigerId: string) => {
    console.log('===== FORCE UNSTAKING TIGER START =====');
    console.log('Force unstaking tiger:', tigerId);
    console.log('Current wallet address:', walletAddress);
    
    if (!tigerId || !walletAddress) {
      console.error('Missing tigerId or walletAddress, cannot force unstake');
      return false;
    }
    
    try {
      // First find the tiger in staked tigers array
      const tigerToUnstake = stakedTigers.find(t => t.id === tigerId);
      console.log('Found tiger in stakedTigers:', tigerToUnstake);
      
      // IMPORTANT: Try to unstake via API first to ensure server state is updated
      try {
        console.log('Calling API to unstake tiger:', tigerId);
        const apiResponse = await tigerApiService.unstakeTiger(walletAddress, tigerId);
        console.log('API unstake response:', apiResponse);
      } catch (apiError) {
        console.error('API unstake failed, continuing with local unstake:', apiError);
      }
      
      if (tigerToUnstake) {
        // Create an unstakedTiger object for the user's collection
        const unstakedTiger: BitcoinTiger = {
          id: tigerToUnstake.id,
          key: tigerToUnstake.id,
          name: tigerToUnstake.name,
          image: tigerToUnstake.image || '',
          inscriptionNumber: 0,
          inscriptionId: tigerToUnstake.id,
          isKnownTiger: false,
          isRuneGuardian: isRuneGuardian(tigerToUnstake)
        };
        
        // Add to userTigers - CRITICAL for showing in available section
        console.log('Adding tiger to userTigers collection:', unstakedTiger);
        setUserTigers(prev => [...prev, unstakedTiger]);
        
        // Remove from stakedTigers - CRITICAL for removing from staked section
        console.log('Removing tiger from stakedTigers collection');
        setStakedTigers(prev => prev.filter(t => t.id !== tigerId));
        
        // Update the tigerStakingDB
        if (tigerStakingDB && tigerStakingDB.stakedTigers && tigerStakingDB.stakedTigers[walletAddress]) {
          console.log('Updating tigerStakingDB');
          const newDB = JSON.parse(JSON.stringify(tigerStakingDB));
          
          // Remove this tiger from staked tigers in DB
          if (newDB.stakedTigers[walletAddress][tigerId]) {
            delete newDB.stakedTigers[walletAddress][tigerId];
            
            // Update localStorage
            localStorage.setItem('tigerStakingDB', JSON.stringify(newDB));
            // Update state
            setTigerStakingDB(newDB);
            console.log('Updated tigerStakingDB in localStorage after unstaking');
          }
        }
        
        // Reset selected staked tiger if it's the one we just unstaked
        if (selectedStakedTiger === tigerId) {
          setSelectedStakedTiger(null);
        }
        
        console.log('===== FORCE UNSTAKING TIGER COMPLETE =====');
        return true;
      } else {
        console.error('Tiger not found in staked tigers array, cannot force unstake:', tigerId);
        
        // Check if tiger already exists in userTigers
        const existingTiger = userTigers.find(t => t.id === tigerId);
        if (existingTiger) {
          console.log('Tiger already exists in userTigers collection, no need to unstake:', existingTiger);
          return true;
        }
        
        return false;
      }
    } catch (error) {
      console.error('Error during force unstaking:', error);
      return false;
    }
  };

  // In ClaimRevealOverlay component, add an effect to unstake tiger after reward display
  useEffect(() => {
    if (showClaimRevealOverlay && selectedStakedTiger) {
      // For jackpot rewards, we need a longer delay before unstaking
      const isJackpot = claimReward.isJackpot;
      const unstakeDelay = isJackpot ? 10000 : 6000; // 10 seconds for jackpot, 6 for others
      
      console.log(`Setting up backup unstaking timer for ${selectedStakedTiger} after ${unstakeDelay}ms`);
      
      // Set a timer to unstake the tiger
      const timer = setTimeout(() => {
        console.log('BACKUP UNSTAKING: Timer triggered for tiger:', selectedStakedTiger);
        forceUnstakeTiger(selectedStakedTiger);
        
        // Force close the overlay if it's still open
        if (showClaimRevealOverlay) {
          setShowClaimRevealOverlay(false);
          console.log('Backup process: Closing claim overlay');
        }
        
        // Force refresh data
        loadWalletAndStakingData();
      }, unstakeDelay);
      
      // Clean up the timer if the component unmounts or selectedStakedTiger changes
      return () => {
        clearTimeout(timer);
        console.log('Backup unstaking timer cleared');
      };
    }
  }, [showClaimRevealOverlay, selectedStakedTiger, claimReward.isJackpot]);

  // Force a complete unstake and refresh from both client and server
  const forceClearTigerStakeStatus = async (tigerId: string) => {
    console.log('===== FORCE CLEARING TIGER STAKE STATUS =====');
    console.log(`Force clearing stake status for tiger: ${tigerId}`);
    
    try {
      // First try API unstake
      if (walletAddress) {
        try {
          console.log('Making direct API call to unstake tiger:', tigerId);
          const response = await fetch('/api/tiger-staking/unstake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              walletAddress,
              tigerId
          }),
        });
        
          console.log('API unstake response status:', response.status);
          const result = await response.json();
          console.log('API unstake result:', result);
      } catch (apiError) {
          console.error('API unstake error:', apiError);
        }
      }
      
      // Clear from client state
      const result = await forceUnstakeTiger(tigerId);
      
      // Force data refresh
      await loadWalletAndStakingData();
      
      // Force an additional cleanup of tigerStakingDB 
      try {
        // Get current DB state
        const currentDBString = localStorage.getItem('tigerStakingDB');
        if (currentDBString) {
          const currentDB = JSON.parse(currentDBString);
          
          // Extra-thorough cleanup: Check all possible locations where the tiger might be stuck
          if (currentDB.stakedTigers) {
            // Clean from all wallet addresses (in case it's stuck in a different address)
            Object.keys(currentDB.stakedTigers).forEach(address => {
              if (currentDB.stakedTigers[address] && currentDB.stakedTigers[address][tigerId]) {
                console.log(`Found tiger ${tigerId} in staked tigers for wallet ${address}, removing`);
                delete currentDB.stakedTigers[address][tigerId];
              }
            });
          }
          
          // Also check if it's in claimedChests
          if (currentDB.claimedChests && walletAddress && currentDB.claimedChests[walletAddress]) {
            // If it's an array, filter out entries with this tigerId
            if (Array.isArray(currentDB.claimedChests[walletAddress])) {
              currentDB.claimedChests[walletAddress] = currentDB.claimedChests[walletAddress].filter(
                (chest: any) => chest.tigerId !== tigerId
              );
            } 
            // If it's an object, delete the entry with this tigerId as a key
            else if (typeof currentDB.claimedChests[walletAddress] === 'object') {
              delete currentDB.claimedChests[walletAddress][tigerId];
            }
          }
          
          // Save the cleaned DB
          localStorage.setItem('tigerStakingDB', JSON.stringify(currentDB));
          setTigerStakingDB(currentDB);
          console.log('Thoroughly cleaned tigerStakingDB saved to localStorage');
        }
      } catch (cleanupError) {
        console.error('Error during deep cleanup:', cleanupError);
      }
      
      console.log('===== FORCE CLEARING COMPLETE =====');
      return result;
    } catch (error) {
      console.error('Error during force clearing:', error);
      return false;
    }
  };

  return (
    <div className="bitcoin-tigers-staking" style={{ paddingTop: mobilePadding }}>
      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading Bitcoin Tigers...</p>
        </div>
      ) : (
        <>
          {/* Banner Section met Mission Stats */}
          <div className="mission-banner">
            <Image 
              src="/tigermission.png"
              alt="Bitcoin Tiger Solo Mission"
              width={1200}
              height={320}
              className="banner-image"
              priority
              unoptimized={true}
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                filter: 'brightness(0.7)' 
              }}
            />
            <div className="banner-overlay">
              <div className="mission-title">
                <h2>Bitcoin Tiger Solo Mission</h2>
              </div>
              
              <div className="mission-stats">
                <div className="stat-item">
                  <span className="stat-label">Active Tigers</span>
                  <span className="stat-value">{stakedTigers.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Available Chests</span>
                  <span className="stat-value">{availableChests}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mission Rewards Section */}
          <div className="rewards-section">
            <div className="rewards-container">
              <h3 className="section-title">
                <Image 
                  src="/chestpixel.png" 
                  alt="Chest"
                  width={30}
                  height={30}
                  className="section-icon"
                />
                Solo Mission Rewards
              </h3>
              
              <div className="rewards-cards">
                <div className="reward-card">
                  <div className="reward-icon tiger-icon">
                    <Image 
                      src="/tiger-logo.png" 
                      alt="Bitcoin Tiger"
                      width={90}
                      height={90}
                      unoptimized={true}
                    />
                  </div>
                  <div className="reward-info">
                    <h4>SOLO REWARDS</h4>
                    <p>Each Staked Bitcoin Tiger</p>
                    <span className="reward-amount">1 Chest with Satoshis</span>
                  </div>
                </div>
                
                <div className="reward-card">
                  <div className="reward-icon">
                    <Image 
                      src="/chestpixel.png" 
                      alt="Chest"
                      width={70}
                      height={70}
                      unoptimized={true}
                    />
                  </div>
                  <div className="reward-info">
                    <h4>JACKPOT CHANCE</h4>
                    <p>For Every Chest Claimed</p>
                    <span className="reward-amount">Up to 500,000 sats</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ordinals Display */}
          <div className="ordinals-section">
            <h3 className="section-title">
              <Image 
                src="/tiger-logo.png" 
                alt="Bitcoin Tiger"
                width={30}
                height={30}
                className="section-icon"
              />
              Your Bitcoin Tigers Collection
            </h3>
            
            {/* Unstaked Bitcoin Tigers */}
            <div className="ordinal-category">
              <h4>Available Bitcoin Tigers ({userTigers.filter(t => !isRuneGuardian(t) && !isTaprootAlpha(t) && !stakedTigers.some(st => st.id === t.id)).length})</h4>
              <div className="ordinals-grid">
                {userTigers
                  .filter(tiger => !isRuneGuardian(tiger) && !isTaprootAlpha(tiger) && !stakedTigers.some(st => st.id === tiger.id))
                  .map((tiger: BitcoinTiger) => {
                    const isSelected = selectedTiger === tiger.id;
                    
                    return (
                      <div 
                        key={tiger.key || tiger.id}
                        className={`ordinal-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTiger(tiger.id)}
                      >
                        <Image 
                          src={getTigerImage(tiger)}
                          alt={tiger.name || 'Bitcoin Tiger'}
                          width={180}
                          height={180}
                          className="tiger-image"
                          unoptimized={true}
                          style={{
                            backgroundColor: '#171a2d',
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                        />
                        <div className="tiger-name">{tiger.name}</div>
                        
                        {/* Toon tiger level badge als deze een level heeft > 1 */}
                        {getTigerLevel(tiger.id) > 1 && (
                          <div className="tiger-level-badge">
                            Level {getTigerLevel(tiger.id)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                
                {userTigers.filter(t => !isRuneGuardian(t) && !isTaprootAlpha(t) && !stakedTigers.some(st => st.id === t.id)).length === 0 && (
                  <div className="no-items">No Bitcoin Tigers available</div>
                )}
              </div>
            </div>
            
            {/* Currently On Mission */}
            <div className="ordinal-category">
              <h4>Tigers On Solo Mission ({stakedTigers.filter(t => !t.isRuneGuardian && !isTaprootAlpha(t)).length})</h4>
              <div className="ordinals-grid">
                {stakedTigers
                  .filter(tiger => !tiger.isRuneGuardian && !isTaprootAlpha(tiger))
                  .map((tiger: TigerStakedInfo) => {
                    const isSelected = selectedStakedTiger === tiger.id;
                    const currentTime = Date.now();
                    const isReadyForChest = currentTime >= tiger.nextChestAt;
                    const hasClaimedChest = tiger.hasClaimedChest;
                    const secondsSinceStaked = (currentTime - tiger.stakedAt) / 1000;
                    const minimumStakeTime = MIN_STAKE_TIME_SECONDS;
                    const isEligibleForClaim = isReadyForChest && !hasClaimedChest && secondsSinceStaked >= minimumStakeTime;
                    
                    // Log voor debug - uitgeschakeld om console vervuiling te verminderen
                    /* console.log(`Tiger ${tiger.id} status:`, {
                      stakedAt: new Date(tiger.stakedAt).toLocaleTimeString(),
                      nextChestAt: new Date(tiger.nextChestAt).toLocaleTimeString(),
                      secondsSinceStaked,
                      minimumStakeTime,
                      isReadyForChest,
                      hasClaimedChest,
                      isEligibleForClaim
                    }); */
                    
                    // Bereken timerText elke render zodat deze altijd actueel is
                    let timerText = '';
                    if (hasClaimedChest) {
                      timerText = 'CLAIMED';
                    } else if (secondsSinceStaked < minimumStakeTime) {
                      const timeLeftSeconds = Math.ceil(minimumStakeTime - secondsSinceStaked);
                      
                      // Formateer de tijd in dagen, uren, minuten en seconden
                      const days = Math.floor(timeLeftSeconds / (24 * 60 * 60));
                      let remainingSeconds = timeLeftSeconds % (24 * 60 * 60);
                      const hours = Math.floor(remainingSeconds / (60 * 60));
                      remainingSeconds = remainingSeconds % (60 * 60);
                      const minutes = Math.floor(remainingSeconds / 60);
                      const seconds = remainingSeconds % 60;
                      
                      // Weergave op basis van de hoeveelheid resterende tijd
                      if (days > 0) {
                        timerText = `${days}d ${hours}h ${minutes}m until eligible`;
                      } else if (hours > 0) {
                        timerText = `${hours}h ${minutes}m ${seconds}s until eligible`;
                      } else if (minutes > 0) {
                        timerText = `${minutes}m ${seconds}s until eligible`;
                      } else {
                        timerText = `${seconds}s until eligible`;
                      }
                    } else if (isReadyForChest) {
                      timerText = 'READY!';
                    } else {
                      timerText = formatTimeRemaining(tiger.nextChestAt);
                    }
                    
                    return (
                      <div 
                        key={tiger.key || tiger.id}
                        className={`ordinal-item ${isSelected ? 'selected' : ''} on-mission ${isEligibleForClaim ? 'ready-for-chest' : ''}`}
                        onClick={() => setSelectedStakedTiger(tiger.id)}
                      >
                        <Image 
                          src={getTigerImage(tiger)}
                          alt={tiger.name || 'Bitcoin Tiger'}
                          width={180}
                          height={180}
                          className="tiger-image"
                          unoptimized={true}
                          style={{
                            backgroundColor: '#171a2d',
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                        />
                        <div className="tiger-name">{tiger.name}</div>
                        <div className="mission-badge">ON MISSION</div>
                        
                        {/* Toon tiger level badge als deze een level heeft > 1 */}
                        {getTigerLevel(tiger.id) > 1 && (
                          <div className="tiger-level-badge">
                            Level {getTigerLevel(tiger.id)}
                          </div>
                        )}
                        
                        <div className="ordinal-timer">
                          <div className="timer-label">Next Chest In:</div>
                          <div className={`timer-value ${isEligibleForClaim ? 'ready' : ''}`}>
                            {timerText}
                          </div>
                          <div className="timer-rewards">+{getTigerLevel(tiger.id)} Chest{getTigerLevel(tiger.id) > 1 ? 's' : ''}</div>
                          
                          {/* Claim button - alleen tonen als daadwerkelijk klaar EN lang genoeg gestaked */}
                          {isEligibleForClaim && (
                            <button 
                              className="claim-button"
                              onClick={(e) => {
                                e.stopPropagation(); // Voorkom dat het event bubbelt naar de parent
                                console.log("Claim button clicked for tiger:", tiger.id);
                                console.log(`Staked time: ${secondsSinceStaked.toFixed(1)}s, minimum: ${minimumStakeTime}s`);
                                claimTigerChestFromCard(tiger.id);
                              }}
                            >
                              Claim
                            </button>
                          )}
                          
                          {/* Force unstake button as emergency option */}
                          {hasClaimedChest && (
                            <button 
                              className="force-unstake-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Force unstake button clicked for tiger:", tiger.id);
                                forceClearTigerStakeStatus(tiger.id).then(result => {
                                  if (result) {
                                    setMessage("Tiger successfully returned to your collection");
                                    setMessageType('success');
                                  } else {
                                    setMessage("Error returning tiger to collection");
                                    setMessageType('error');
                                  }
                                });
                              }}
                            >
                              Return to Collection
                            </button>
                          )}
                        </div>
                          {isEligibleForClaim && (
                            <div className="chest-available">
                              <Image
                                src="/chestpixel.png"
                                alt="Available Chest"
                                width={40}
                                height={40}
                                className="chest-icon"
                              />
                            </div>
                          )}
                      </div>
                    );
                  })}
                
                {stakedTigers.filter(t => !t.isRuneGuardian && !isTaprootAlpha(t)).length === 0 && (
                  <div className="no-items">No Tigers on solo mission yet</div>
                )}
              </div>
            </div>
            
            {/* Start Mission Button */}
            <div className="central-mission-button">
              <button 
                onClick={handleStakeTiger}
                className="big-start-mission-button"
                disabled={isStakingTiger || !selectedTiger || isLoading}
              >
                {isStakingTiger ? 'Starting Mission...' : 'Start Solo Mission'}
              </button>
            </div>
          </div>
          
          {/* Instruction Banner */}
          <div className="instruction-banner">
            <h3>How Solo Missions Work</h3>
            <ol className="instruction-steps">
              <li><span className="step-highlight">Select</span> a Bitcoin Tiger and click "Start Solo Mission" to stake it</li>
              <li>Your staked tiger will <span className="step-highlight">automatically earn</span> chests with satoshis</li>
              <li>When the timer reaches zero, click <span className="step-highlight">"Claim"</span> to receive your chest</li>
              <li>Your tiger will <span className="step-highlight">automatically return</span> to your collection after claiming</li>
            </ol>
          </div>
          
          {/* Tiger Leveling System */}
          <div className="tiger-leveling-section">
            <h3 className="section-title">
              <Image 
                src="/tiger-logo.png" 
                alt="Bitcoin Tiger"
                width={30}
                height={30}
                className="section-icon"
              />
              Tiger Leveling System
            </h3>
            <p className="leveling-intro">Upgrade your tigers by sending Bitcoin to our address and earn more chests per mission! The higher your tiger level, the more chests you'll receive per mission - while rewards per chest remain the same.</p>
            
            <div className="tiger-levels-grid">
              <div className="tiger-level-card">
                <div className="level-header">
                  <span className="level-number">Level 1</span>
                  <span className="level-name">Rookie Tiger</span>
                </div>
                <div className="level-benefits">
                  <h4>Benefits</h4>
                  <ul>
                    <li>1 Chest per mission</li>
                  </ul>
                </div>
                <div className={`level-status ${tigerLevel === 1 ? 'current' : ''}`}>
                  {tigerLevel === 1 ? 'Current Level' : 'Completed'}
                </div>
              </div>
              
              <div className="tiger-level-card">
                <div className="level-header">
                  <span className="level-number">Level 2</span>
                  <span className="level-name">Hunter Tiger</span>
                </div>
                <div className="level-benefits">
                  <h4>Benefits</h4>
                  <ul>
                    <li>2 Chests per mission</li>
                  </ul>
                </div>
                {tigerLevel >= 2 ? (
                  <div className={`level-status ${tigerLevel === 2 ? 'current' : ''}`}>
                    {tigerLevel === 2 ? 'Current Level' : 'Completed'}
                  </div>
                ) : (
                  <div className="level-upgrade">
                    <button 
                      className="upgrade-button"
                      onClick={() => handleTigerUpgrade(2)}
                      disabled={isUpgrading || tigerLevel >= 2}
                    >
                      Pay 285,714 sats via BTC
                    </button>
                  </div>
                )}
              </div>
              
              <div className="tiger-level-card">
                <div className="level-header">
                  <span className="level-number">Level 3</span>
                  <span className="level-name">Elite Tiger</span>
                </div>
                <div className="level-benefits">
                  <h4>Benefits</h4>
                  <ul>
                    <li>3 Chests per mission</li>
                  </ul>
                </div>
                {tigerLevel >= 3 ? (
                  <div className={`level-status ${tigerLevel === 3 ? 'current' : ''}`}>
                    {tigerLevel === 3 ? 'Current Level' : 'Completed'}
                  </div>
                ) : (
                  <div className="level-upgrade">
                    <button 
                      className="upgrade-button"
                      onClick={() => handleTigerUpgrade(3)}
                      disabled={isUpgrading || tigerLevel >= 3 || tigerLevel < 2}
                    >
                      Pay 1,238,095 sats via BTC
                    </button>
                  </div>
                )}
              </div>
              
              <div className="tiger-level-card">
                <div className="level-header">
                  <span className="level-number">Level 4</span>
                  <span className="level-name">Apex Tiger</span>
                </div>
                <div className="level-benefits">
                  <h4>Benefits</h4>
                  <ul>
                    <li>4 Chests per mission</li>
                  </ul>
                </div>
                {tigerLevel >= 4 ? (
                  <div className={`level-status ${tigerLevel === 4 ? 'current' : ''}`}>
                    {tigerLevel === 4 ? 'Current Level' : 'Completed'}
                  </div>
                ) : (
                  <div className="level-upgrade">
                    <button 
                      className="upgrade-button"
                      onClick={() => handleTigerUpgrade(4)}
                      disabled={isUpgrading || tigerLevel >= 4 || tigerLevel < 3}
                    >
                      Pay 2,952,381 sats via BTC
                    </button>
                  </div>
                )}
              </div>
              
              <div className="tiger-level-card">
                <div className="level-header">
                  <span className="level-number">Level 5</span>
                  <span className="level-name">Apex Tiger</span>
                </div>
                <div className="level-benefits">
                  <h4>Benefits</h4>
                  <ul>
                    <li>5 Chests per mission</li>
                  </ul>
                </div>
                {tigerLevel >= 5 ? (
                  <div className="level-status current">
                    Maximum Level Reached
                  </div>
                ) : (
                  <div className="level-upgrade">
                    <button 
                      className="upgrade-button"
                      onClick={() => handleTigerUpgrade(5)}
                      disabled={isUpgrading || tigerLevel >= 5 || tigerLevel < 4}
                    >
                      Pay 5,333,333 sats via BTC
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="leveling-info">
              <p>Higher level tigers earn more chests per mission. Upgrade your tigers to maximize your earnings!</p>
            </div>
          </div>
          
          {/* Claim Reveal Overlay */}
          {showClaimReveal && (
            <div className="claim-reveal-overlay">
              <div className="claim-reveal-container">
                <div className={`claim-reveal-box ${claimReward.isJackpot ? 'jackpot' : claimReward.isHighRoll ? 'high-roll' : 'low-roll'}`}>
                  {claimReward.isClaiming ? (
                    <>
                      <h3>Opening Chest...</h3>
                      <div className="chest-image-container">
                        <Image 
                          src="/chestpixel.png" 
                          alt="Treasure Chest"
                          width={250}
                          height={250}
                          className="spinning-chest"
                          unoptimized={true}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{claimReward.isJackpot ? 'JACKPOT!!!' : claimReward.isHighRoll ? 'HIGH ROLL!' : 'Reward Claimed'}</h3>
                      <div className="chest-image-container">
                        <Image 
                          src="/chestpixel.png" 
                          alt="Treasure Chest"
                          width={250}
                          height={250}
                          className={`reward-chest ${claimReward.isJackpot ? 'chest-jackpot' : claimReward.isHighRoll ? 'chest-high' : 'chest-low'}`}
                          unoptimized={true}
                        />
                      </div>
                      <div className="claim-amount">
                        <span className="sats-amount">{claimReward.amount.toLocaleString()}</span>
                        <span className="sats-label">SATS</span>
                      </div>
                      <p className="claim-message">
                        {claimReward.isJackpot ? 'Incredible luck!' : 
                          claimReward.isHighRoll ? 'Great roll!' : 
                          'Nice reward!'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Payment Overlay voor Tiger Upgrades */}
      {paymentDetails.show && (
        <div className="payment-overlay">
          <div className="payment-container">
            <div className="payment-box">
              <h3>Upgrade to Level {paymentDetails.level}</h3>
              
              <div className="payment-info">
                <p className="payment-instruction">
                  To upgrade your tiger to Level {paymentDetails.level}, please send exactly:
                </p>
                
                <div className="payment-amount">
                  <span>{paymentDetails.cost.toLocaleString()} sats</span>
                </div>
                
                <p className="payment-instruction">
                  To this Bitcoin address:
                </p>
                
                <div className="payment-address">
                  <code>{paymentDetails.address}</code>
                  <button 
                    className="copy-button"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentDetails.address)
                        .then(() => {
                          setMessage('Address copied to clipboard');
                          setMessageType('success');
                        })
                        .catch(err => {
                          console.error('Failed to copy address: ', err);
                        });
                    }}
                  >
                    Copy
                  </button>
                </div>
                
                <div className="payment-note">
                  <p>After sending the payment, contact an admin with the following information:</p>
                  <ul>
                    <li>Your wallet address: <code>{walletAddress}</code></li>
                    <li>Target upgrade level: <code>Level {paymentDetails.level}</code></li>
                    <li>Amount sent: <code>{paymentDetails.cost.toLocaleString()} sats</code></li>
                    <li>Transaction ID/hash from your wallet</li>
                  </ul>
                  <p>An admin will verify your payment and upgrade your tiger as soon as possible.</p>
                  <p>You can reach an admin via <a href="/admin" target="_blank" rel="noopener noreferrer" className="admin-link">our admin portal</a> or through Discord.</p>
                </div>
              </div>
              
              <div className="payment-actions">
                <button 
                  className="cancel-payment-button"
                  onClick={() => setPaymentDetails({...paymentDetails, show: false})}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Message display */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      {/* Claim Chest Overlay */}
      {showClaimRevealOverlay && (
        <div className="claim-reveal-overlay">
          <div className="claim-reveal-container">
            <h3>Congratulations!</h3>
            {selectedStakedTiger && (
              <p>
                Your Tiger (Level {getTigerLevel(selectedStakedTiger)}) has earned{" "}
                {getChestsForLevel(getTigerLevel(selectedStakedTiger))} chest(s)!
              </p>
            )}
            
            {claimReward.rewards && claimReward.rewards.length > 1 ? (
              // Multiple chests display
              <div className="multiple-chests-container">
                <h4 className="chests-header">Your Rewards</h4>
                <div className="chests-grid">
                  {claimReward.rewards.map((reward, index) => (
                    <div key={index} className="individual-chest">
                      <div className="chest-with-reward">
                        <Image 
                          src="/chestpixel.png"
                          alt={`Chest ${index + 1}`}
                          width={90}
                          height={90}
                          className="chest-image-medium"
                        />
                        <div className="chest-number">#{index + 1}</div>
                        <div className={`individual-reward ${reward >= 25000 ? 'jackpot' : reward >= 5000 ? 'high-roll' : ''}`}>
                          {reward.toLocaleString()} sats
                          {reward >= 25000 && <div className="mini-jackpot-label">JACKPOT!</div>}
                          {reward >= 5000 && reward < 25000 && <div className="mini-high-roll-label">HIGH ROLL!</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="total-reward-summary">
                  <span className="total-label">Total Reward:</span>
                  <span className="total-amount">{claimReward.amount.toLocaleString()} sats</span>
                </div>
              </div>
            ) : (
              // Single chest display
              <div className="chest-container">
                <Image 
                  src="/chestpixel.png"
                  alt="Claimed Chest"
                  width={150}
                  height={150}
                  className="chest-image-large"
                />
                <div className="chest-reward-preview">
                  {claimReward.amount > 0 ? (
                    <>
                      <span className={`reward-amount ${claimReward.isJackpot ? 'jackpot' : claimReward.isHighRoll ? 'high-roll' : ''}`}>
                        {claimReward.amount.toLocaleString()} sats
                      </span>
                      {claimReward.isJackpot && <div className="jackpot-label">JACKPOT!</div>}
                      {claimReward.isHighRoll && <div className="high-roll-label">HIGH ROLL!</div>}
                      {!claimReward.isJackpot && !claimReward.isHighRoll && <div className="regular-roll-label">NICE REWARD!</div>}
                    </>
                  ) : (
                    <>Approximately 1,000 - 5,000 sats per chest</>
                  )}
                </div>
              </div>
            )}
            
            {claimReward.amount === 0 && (
              <button 
                className="open-chest-button-large"
                onClick={async () => {
                  // Open alle chests in één keer
                  await openChestLocally(chestIds[0], 0);
                }}
              >
                {selectedStakedTiger ? 
                  `Open ${getChestsForLevel(getTigerLevel(selectedStakedTiger))} Chest(s)` : 
                  'Open Chest'}
              </button>
            )}
            
            <button 
              className="close-reveal-button"
              onClick={() => setShowClaimRevealOverlay(false)}
            >
              {claimReward.amount > 0 ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
      
      {/* Error message display */}
      {claimError && (
        <div className="claim-error-message">
          {claimError}
          <button 
            className="close-error-button"
            onClick={() => setClaimError('')}
          >
            ×
          </button>
        </div>
      )}
      
      <style jsx>{`
        .bitcoin-tigers-staking {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background-color: #0a0c1d;
          color: white;
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden; /* Voorkom horizontale scroll */
        }
        
        @media (max-width: 768px) {
          .bitcoin-tigers-staking {
            padding: 0;
            padding-top: 60px; /* Ruimte voor navigatiebalk */
            overflow: auto; /* Auto overflow voor juiste scroll */
            height: 100%; /* Volledige hoogte */
            max-height: 100%; /* Beperk tot 100% hoogte */
            position: absolute; /* Absoluut positioneren */
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }

          body, html {
            overflow: hidden; /* Voorkom scrolling op body/html */
          }
        }
        
        /* Multiple chests display styles */
        .multiple-chests-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-bottom: 1.5rem;
        }
        
        .chests-header {
          font-size: 1.5rem;
          color: #ffd700;
          margin-bottom: 1rem;
          text-align: center;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .chests-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .individual-chest {
          position: relative;
          background-color: #171a2d;
          border-radius: 10px;
          padding: 1rem;
          border: 2px solid #333;
          transition: all 0.3s;
        }
        
        .individual-chest:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
        }
        
        .chest-with-reward {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .chest-image-medium {
          width: 90px;
          height: 90px;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.2));
        }
        
        .chest-number {
          position: absolute;
          top: -10px;
          left: -10px;
          background-color: #ffd700;
          color: #000000;
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-radius: 50%;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        
        .individual-reward {
          font-size: 1rem;
          font-weight: bold;
          color: #00ff00;
          padding: 0.5rem;
          border-radius: 5px;
          margin-top: 0.5rem;
          min-width: 100px;
          background-color: rgba(0, 0, 0, 0.2);
          position: relative;
        }
        
        .individual-reward.jackpot {
          color: #ff0000;
          font-size: 1.1rem;
          background-color: rgba(255, 0, 0, 0.1);
          animation: pulse 1.5s infinite;
        }
        
        .individual-reward.high-roll {
          color: #ffd700;
          background-color: rgba(255, 215, 0, 0.1);
        }
        
        .mini-jackpot-label, .mini-high-roll-label {
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          margin-top: 0.2rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .mini-jackpot-label {
          background-color: #ff0000;
          color: white;
        }
        
        .mini-high-roll-label {
          background-color: #ffd700;
          color: black;
        }
        
        .total-reward-summary {
          display: flex;
          align-items: center;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #171a2d;
          border-radius: 10px;
          border: 2px solid #ffd700;
        }
        
        .total-label {
          font-size: 1.2rem;
          color: white;
          margin-right: 0.5rem;
        }
        
        .total-amount {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00ff00;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          border: 1px solid #ffd700;
          margin: 2rem;
          padding: 2rem;
          width: 80%;
          max-width: 500px;
        }
        
        .loading-spinner {
          border: 5px solid #171a2d;
          border-radius: 50%;
          border-top: 5px solid #ffd700;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .mission-banner {
          position: relative;
          width: 100%;
          max-width: 1200px;
          height: 320px;
          overflow: hidden;
          margin: 1rem auto;
          border-radius: 8px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        @media (max-width: 768px) {
          .mission-banner {
            height: auto;
            max-height: 200px;
            margin: 0;
            margin-top: 20px; /* Verhoogde ruimte boven de banner */
            padding: 0;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }
        }
        
        .banner-image {
          display: block; /* Toon de afbeelding op mobiel */
          width: 100%;
          height: 200px; /* Hogere hoogte om meer van de afbeelding te tonen */
          object-fit: cover; /* Zodat de afbeelding netjes schaalt */
          object-position: center; /* Gecentreerd weergeven */
          filter: brightness(0.6); /* Iets donkerder om tekst beter leesbaar te maken */
        }
        
        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.6) 100%
          );
        }
        
        .mission-title {
          display: flex;
          justify-content: center;
          align-items: center;
          text-shadow: 0 0 10px #000, 0 0 20px #000; /* Sterkere tekst schaduw */
        }
        
        .mission-title h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 2.5rem;
          color: white;
          text-shadow: 0 0 10px #000000, 0 0 20px #ffd700;
          margin: 0;
          text-align: center;
          padding: 0 1rem;
        }
        
        .mission-stats {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(0, 0, 0, 0.6); /* Transparante donkere achtergrond */
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(3px); /* Blur effect voor een modernere look */
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 1.5rem;
          padding: 0.5rem 1rem;
          background-color: rgba(23, 26, 45, 0.7); /* Donkere semi-transparante achtergrond */
          border-radius: 8px;
          border: 1px solid rgba(255, 215, 0, 0.3); /* Subtiele gouden rand */
        }
        
        .stat-label {
          font-size: 1rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
          text-transform: uppercase; /* Hoofdletters voor meer nadruk */
          letter-spacing: 1px;
          font-weight: 600;
        }
        
        .stat-value {
          font-size: 2.2rem;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); /* Gloed effect */
        }
        
        .rewards-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background-color: #0a0c1d;
          border-radius: 8px;
          border: 1px solid #ffd700;
        }
        
        .rewards-container {
          width: 100%;
          background: transparent;
          border-radius: 0;
          padding: 0;
          border: none;
        }
        
        .section-title {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-align: center;
          border-bottom: 1px solid #ffd700;
          padding-bottom: 0.5rem;
        }
        
        .section-icon {
          width: 30px;
          height: 30px;
          margin-right: 0.5rem;
        }
        
        .rewards-cards {
          display: flex;
          justify-content: center;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .reward-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: #171a2d;
          border: 1px solid #ffd700;
          border-radius: 8px;
          padding: 1rem;
          width: 100%;
          max-width: 400px;
        }
        
        .reward-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
        }
        
        .tiger-icon {
          width: 60px;
          height: 60px;
        }
        
        .reward-info {
          flex: 1;
        }
        
        .reward-info h4 {
          color: #ffd700;
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }
        
        .reward-info p {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: #ffffff;
        }
        
        .reward-amount {
          font-weight: bold;
          color: #00ff00;
        }
        
        .ordinals-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background-color: #0a0c1d;
          border-radius: 8px;
          border: 1px solid #ffd700;
        }
        
        .ordinals-section h3 {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-align: center;
          border-bottom: 1px solid #ffd700;
          padding-bottom: 0.5rem;
        }
        
        .ordinal-category {
          margin-bottom: 2rem;
        }
        
        .ordinal-category h4 {
          font-size: 1.2rem;
          color: #ffffff;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .ordinals-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        
        .ordinal-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 220px; /* Vergroot van 180px naar 220px voor nog grotere kaarten */
          background-color: #171a2d;
          border: 2px solid #333;
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          margin: 0.75rem;
        }
        
        .ordinal-item:hover {
          transform: translateY(-8px); /* Iets meer lift bij hover */
          border-color: #ffd700;
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3); /* Gloed effect bij hover */
        }
        
        .ordinal-item.selected {
          border-color: #ffd700;
          box-shadow: 0 0 15px #ffd700;
        }
        
        .ordinal-item.on-mission {
          background-color: #1e1e3f; /* Iets rijkere achtergrond */
          border: 2px solid #444866; /* Subtielere border */
        }
        
        .tiger-image {
          width: 180px; /* Maak de afbeelding 180px breed */
          height: 180px; /* Maak de afbeelding 180px hoog */
          object-fit: cover; /* Zorg dat de afbeelding goed geschaald wordt */
          margin-bottom: 1.25rem;
          border-radius: 8px;
          transition: all 0.3s;
          border: 1px solid #333; /* Voeg een subtiele rand toe */
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); /* Voeg een schaduw toe */
        }
        
        /* Enhanced image loading states */
        .tiger-image.loading {
          opacity: 0.7;
          filter: blur(1px);
          background-color: #171a2d;
        }

        .tiger-image.error {
          opacity: 0.5;
          filter: grayscale(0.5);
          border: 2px solid #ff9900;
        }

        .image-placeholder {
          animation: pulse-loading 1.5s ease-in-out infinite alternate;
          border: 2px solid #333;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .image-placeholder::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            rgba(255, 107, 0, 0.1) 25%, 
            transparent 25%, 
            transparent 50%, 
            rgba(255, 107, 0, 0.1) 50%, 
            rgba(255, 107, 0, 0.1) 75%, 
            transparent 75%
          );
          background-size: 20px 20px;
          animation: loading-stripes 2s linear infinite;
          border-radius: 6px;
        }

        @keyframes pulse-loading {
          from {
            opacity: 0.6;
            transform: scale(0.98);
            border-color: #555;
          }
          to {
            opacity: 1;
            transform: scale(1);
            border-color: #ff6b00;
          }
        }

        @keyframes loading-stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }

        /* Rate limit aware loading states */
        .tiger-image[data-retry-count="1"] {
          border: 2px solid #ff9900;
        }

        .tiger-image[data-retry-count="2"] {
          border: 2px solid #ff6600;
        }

        .tiger-image[data-retry-count="3"] {
          border: 2px solid #ff3300;
        }

        .tiger-image[data-retry-count="4"],
        .tiger-image[data-retry-count="5"] {
          border: 2px solid #ff0000;
          animation: retry-warning 1s ease-in-out infinite alternate;
        }

        @keyframes retry-warning {
          from {
            border-color: #ff0000;
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
          }
          to {
            border-color: #ff6600;
            box-shadow: 0 0 15px rgba(255, 102, 0, 0.5);
          }
        }
        
        .tiger-name {
          font-size: 0.85rem; /* Kleinere tekst */
          font-weight: 600;
          text-align: center;
          color: #ffffff;
          width: 100%;
          overflow: hidden;
          white-space: normal; /* Laat tekst gewoon doorlopen op volgende regel */
          word-wrap: break-word; /* Breek lange woorden af indien nodig */
          margin-top: 0.3rem; /* Kleine ruimte boven de naam */
          margin-bottom: 0.5rem;
          line-height: 1.2;
          min-height: 2.2rem; /* Ruimte voor ongeveer 2 regels tekst */
        }
        
        .mission-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background-color: #ff4500;
          color: #ffffff;
          font-size: 0.75rem;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Schaduw toevoegen */
        }
        
        .tiger-level-badge {
          position: absolute;
          top: -10px;
          left: -10px;
          background-color: #ffd700;
          color: #000000;
          font-size: 0.75rem;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }
        
        .ordinal-timer {
          margin-top: 0.75rem;
          width: 100%;
          text-align: center;
          font-size: 0.9rem; /* Iets groter */
          background-color: rgba(0, 0, 0, 0.3); /* Donkerdere achtergrond voor meer contrast */
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 215, 0, 0.3); /* Subtiele gouden rand */
        }
        
        .timer-label {
          color: #ffd700;
          margin-bottom: 0.3rem;
          font-weight: 600;
          text-transform: uppercase; /* Hoofdletters voor meer nadruk */
          letter-spacing: 1px; /* Spatiëring tussen letters */
        }
        
        .timer-value {
          font-family: monospace;
          color: #ffffff;
          font-size: 1.2rem; /* Groter voor betere zichtbaarheid */
          font-weight: 600;
          padding: 0.3rem;
          background-color: rgba(0, 0, 0, 0.2); /* Donkere achtergrond voor meer contrast */
          border-radius: 4px;
          display: inline-block;
          min-width: 120px; /* Zorgt voor consistente breedte */
        }
        
        .timer-value.ready {
          color: #4afc4a;
          font-weight: bold;
          font-size: 1.2rem; /* Nog groter voor nadruk */
          text-shadow: 0 0 5px rgba(74, 252, 74, 0.5); /* Glow effect */
          animation: pulseGlow 1.5s infinite alternate; /* Pulserende animatie */
          background-color: rgba(74, 252, 74, 0.1); /* Licht groene achtergrond */
          border: 1px solid rgba(74, 252, 74, 0.3);
        }
        
        @keyframes pulseGlow {
          from { text-shadow: 0 0 5px rgba(74, 252, 74, 0.5); }
          to { text-shadow: 0 0 15px rgba(74, 252, 74, 0.8); }
        }
        
        .timer-rewards {
          color: #4afc4a;
          margin-top: 0.5rem;
          font-weight: 600;
        }
        
        .no-items {
          text-align: center;
          padding: 1rem;
          background-color: #171a2d;
          border-radius: 8px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .mission-controls {
          max-width: 800px;
          margin: 0 auto 2rem;
          padding: 1.5rem;
          background-color: #171a2d;
          border-radius: 8px;
          border: 1px solid #ffd700;
        }
        
        .selection-summary {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .selection-summary h4 {
          margin: 0.5rem 0;
          color: #ffffff;
          font-size: 1rem;
          font-weight: normal;
        }
        
        .mission-buttons {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        
        .start-mission-button, .unstake-button {
          min-width: 180px;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .start-mission-button {
          background-color: #ffd700;
          color: #000000;
        }
        
        .unstake-button {
          background-color: #ff4500;
          color: #ffffff;
        }
        
        .start-mission-button:hover, .unstake-button:hover {
          transform: scale(1.05);
        }
        
        .start-mission-button:disabled, .unstake-button:disabled {
          background-color: #5a5a5a;
          color: #999999;
          cursor: not-allowed;
          transform: none;
        }
        
        .chests-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background-color: #0a0c1d;
          border-radius: 8px;
          border: 1px solid #ffd700;
        }
        
        .chest-info {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .refresh-button {
          background-color: #ffd700;
          color: #000000;
          border: none;
          border-radius: 4px;
          padding: 0.75rem 1.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .refresh-button:hover {
          background-color: #ffea00;
          transform: scale(1.05);
        }
        
        .refresh-button:disabled {
          background-color: #5a5a5a;
          color: #999999;
          cursor: not-allowed;
        }
        
        .available-chests {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .available-chests p {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .chest-count {
          color: #ffd700;
          font-weight: bold;
          font-size: 1.5rem;
        }
        
        .chests-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .chest-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 120px;
          background-color: #171a2d;
          border: 2px solid #ffd700;
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .chest-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 10px #ffd700;
        }
        
        .chest-image {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 0.5rem;
        }
        
        .chest-name {
          font-size: 0.9rem;
          text-align: center;
          color: #ffd700;
        }
        
        .more-chests-item {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2a2a4a;
        }
        
        .more-chests {
          color: #ffd700;
          font-weight: bold;
        }
        
        .chest-instructions {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #cccccc;
        }
        
        .claim-button {
          background-color: #4afc4a;
          color: #000000;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.25rem; /* Grotere button */
          font-weight: bold;
          font-size: 1rem; /* Grotere tekst */
          cursor: pointer;
          margin-top: 0.75rem;
          transition: all 0.3s;
          width: 100%; /* Volle breedte */
          text-transform: uppercase; /* Hoofdletters voor nadruk */
          letter-spacing: 1px; /* Spatiëring tussen letters */
          box-shadow: 0 3px 10px rgba(74, 252, 74, 0.3); /* Groene gloed */
        }
        
        .claim-button:hover {
          background-color: #5fff5f;
          transform: translateY(-3px) scale(1.03); /* Meer effect bij hover */
          box-shadow: 0 5px 15px rgba(74, 252, 74, 0.5); /* Sterkere groene gloed */
        }
        
        .no-chests {
          text-align: center;
          padding: 2rem;
          background-color: #171a2d;
          border-radius: 8px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        /* Instructie banner - algemene stijlen */
        .instruction-banner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background-color: #0a0c1d;
          border-radius: 8px;
          border: 1px solid #4afc4a;
          text-align: center;
        }
        
        .instruction-banner h3 {
          color: #4afc4a;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        /* Instructie stappen moeten geen width of height hebben */
        .instruction-steps {
          padding-left: 1.5rem;
          font-size: 0.85rem;
          line-height: 1.4;
          text-align: left;
        }
        
        @media (max-width: 768px) {
          .instruction-steps {
            padding-left: 1.5rem;
            font-size: 0.85rem;
            line-height: 1.4;
            /* Geen width of height hier */
          }
        }
        
        .message {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          z-index: 1000;
          animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .success {
          background-color: #00aa00;
          color: #ffffff;
        }
        
        .error {
          background-color: #aa0000;
          color: #ffffff;
        }
        
        .warning {
          background-color: #aa5500;
          color: #ffffff;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .claim-reveal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .claim-reveal-container {
          background-color: #1a1a1a;
          border: 2px solid #f7931a;
          border-radius: 12px;
          padding: 20px;
          width: 90%;
          max-width: 550px;
          perspective: 1000px;
        }
        
        .claim-reveal-box {
          background-color: #171a2d;
          border-radius: 20px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transform-style: preserve-3d;
          animation: dropIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        }
        
        @keyframes dropIn {
          0% { transform: translateY(-100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .claim-reveal-box h3 {
          font-size: 2.2rem;
          margin: 0 0 1.5rem 0;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          font-family: 'Press Start 2P', monospace;
        }
        
        .chest-image-container {
          margin-bottom: 2rem;
          transform-style: preserve-3d;
        }
        
        .spinning-chest {
          animation: spin 2s infinite linear;
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4));
        }
        
        .reward-chest {
          animation: popIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4));
        }
        
        @keyframes popIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .chest-jackpot {
          animation: jackpotGlow 0.7s infinite alternate, popIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), shake 0.5s 0.7s ease-in-out;
        }
        
        @keyframes jackpotGlow {
          from { filter: drop-shadow(0 0 10px #ffd700); }
          to { filter: drop-shadow(0 0 30px #ffd700); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px) rotate(-5deg); }
          40% { transform: translateX(10px) rotate(5deg); }
          60% { transform: translateX(-10px) rotate(-3deg); }
          80% { transform: translateX(10px) rotate(3deg); }
        }
        
        .chest-high {
          animation: highGlow 0.7s infinite alternate, popIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), pulse 1s 0.7s infinite;
        }
        
        @keyframes highGlow {
          from { filter: drop-shadow(0 0 10px #00ff00); }
          to { filter: drop-shadow(0 0 25px #00ff00); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .claim-amount {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.5s 0.5s both;
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .sats-amount {
          font-size: 3rem;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
          font-family: 'Press Start 2P', monospace;
        }
        
        .sats-label {
          font-size: 1.2rem;
          color: #ffffff;
          margin-top: 0.5rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .claim-message {
          font-size: 1.4rem;
          color: #ffffff;
          margin: 0;
          animation: fadeUp 0.5s 0.7s both;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
        }
        
        .jackpot {
          border: 4px solid #ffd700;
          box-shadow: 0 0 30px #ffd700;
          background: linear-gradient(135deg, #171a2d, #2a203a);
        }
        
        .high-roll {
          border: 4px solid #00ff00;
          box-shadow: 0 0 25px #00ff00;
          background: linear-gradient(135deg, #171a2d, #1a2a20);
        }
        
        .low-roll {
          border: 3px solid #3a86ff;
          box-shadow: 0 0 15px #3a86ff;
          background: linear-gradient(135deg, #171a2d, #1a2035);
        }
        
        @media (max-width: 768px) {
          .bitcoin-tigers-staking {
            padding: 0;
            overflow-x: hidden; /* Voorkom horizontale scroll */
          }

          .mission-banner {
            height: auto;
            max-height: 200px;
            margin: 0;
            padding: 0;
            border-radius: 0;
            border: none;
            box-shadow: none;
            overflow: hidden;
          }
          
          .banner-image {
            display: block;
            width: 100%;
            height: 180px;
            object-fit: cover;
            object-position: center;
            filter: brightness(0.6);
          }
          
          .banner-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0.5rem 0;
          }
          
          .mission-title h2 {
            font-size: 1.2rem;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 4px;
            border: 1px solid rgba(255, 215, 0, 0.3);
            padding: 0.4rem 0.6rem;
            margin: 0 auto 0.6rem auto;
            max-width: 85%;
            text-align: center;
            line-height: 1.3;
          }
          
          /* Rewards section - zorg dat deze goed onder de banner komt */
          .rewards-section {
            margin-top: 0;
            padding-top: 1rem;
            border: none;
            border-top: 1px solid rgba(255, 215, 0, 0.3);
          }

          .section-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }
          
          .mission-stats {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 1rem;
            width: 100%;
            padding: 0;
            margin: 0;
            background-color: transparent;
          }
          
          .stat-item {
            margin: 0;
            padding: 0.5rem 0.8rem;
            background-color: rgba(0, 0, 0, 0.7);
            border: 1px solid #ffd700;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 40%;
            max-width: 150px;
          }
          
          .stat-label {
            font-size: 0.7rem;
            margin-bottom: 0.2rem;
            color: #ffd700;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: bold;
          }
          
          .stat-value {
            font-size: 1.6rem;
            color: #ffd700;
            font-weight: bold;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
          }
          
          /* Rewards section */
          .rewards-section {
            margin-top: 0;
            border-top: none;
          }
          
          /* Rewards section for mobile */
          .rewards-cards {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .reward-card {
            width: 95%;
            max-width: none;
          }
          
          /* Ordinals section voor mobiel */
          .ordinals-section {
            margin: 0;
            border: none;
            border-radius: 0;
            width: 100%;
            padding: 0.5rem;
          }
          
          .ordinals-grid {
            gap: 0.5rem;
            justify-content: center;
          }
          
          .ordinal-item {
            width: 140px; /* Slightly smaller to fit better */
            padding: 0.5rem;
            margin: 0.3rem;
            box-sizing: border-box; /* Include padding and border in width */
            overflow: hidden; /* Prevent content from overflowing */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
          }
          
          .tiger-image {
            width: 100px !important; /* Force smaller size on mobile */
            height: 100px !important;
            max-width: 100px; /* Ensure image doesn't exceed container */
            max-height: 100px;
            margin-bottom: 0.5rem;
            border-radius: 6px;
            object-fit: cover; /* Maintain aspect ratio */
            flex-shrink: 0; /* Don't shrink the image */
          }
          
          .tiger-name {
            font-size: 0.65rem;
            margin-bottom: 0.3rem;
            min-height: 1.5rem;
            width: 100%;
            text-align: center;
            word-wrap: break-word;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .mission-badge {
            font-size: 0.6rem;
            padding: 0.15rem 0.3rem;
            top: -8px;
            right: -8px;
          }
          
          .tiger-level-badge {
            font-size: 0.6rem;
            padding: 0.15rem 0.3rem;
            top: -8px;
            left: -8px;
          }
          
          .ordinal-timer {
            padding: 0.4rem;
            margin-top: 0.4rem;
            font-size: 0.65rem;
            width: 100%;
            box-sizing: border-box;
          }
          
          .timer-label {
            font-size: 0.6rem;
            margin-bottom: 0.2rem;
          }
          
          .timer-value {
            font-size: 0.8rem;
            min-width: 80px;
            padding: 0.2rem;
          }
          
          .timer-value.ready {
            font-size: 0.9rem;
          }
          
          .timer-rewards {
            font-size: 0.6rem;
            margin-top: 0.3rem;
          }
          
          .claim-button {
            padding: 0.4rem 0.6rem;
            font-size: 0.7rem;
            margin-top: 0.4rem;
            letter-spacing: 0.5px;
          }
          
          /* Verbeterde buttons voor mobiel */
          .big-start-mission-button {
            width: 100%;
            margin: 1rem 0;
            font-size: 1rem;
            padding: 0.75rem;
          }
          
          .central-mission-button {
            width: 100%;
            padding: 0 1rem;
            margin: 1rem 0;
          }
          
          /* Instruction banner voor mobiel */
          .instruction-banner {
            margin: 0;
            border: none;
            border-top: 1px solid #4afc4a;
            border-radius: 0;
            width: 100%;
            padding: 1rem 0.5rem;
          }
          
          .instruction-steps {
            padding-left: 1.5rem;
            width: 100px;
            height: 100px;
          }
        }
        
        @media (max-width: 768px) {
          /* Bestaande stijlen behouden */
          
          /* Verbeterde scrolling voor ordinals */
          .ordinals-section {
            overflow-y: visible;
            -webkit-overflow-scrolling: touch; /* Betere scroll op iOS */
          }
          
          .ordinals-grid {
            overflow-x: visible;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Verwijder eventuele onnodige scrollbars */
          .mission-banner, .rewards-section, .instruction-banner {
            overflow: visible;
          }
          
          /* Ordinals section voor mobiel - geen overlap met rewards */
          .ordinals-section {
            margin: 0;
            padding: 0.75rem;
            border: none;
            border-top: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 0;
            width: 100%;
            background-color: rgba(15, 20, 40, 0.4);
          }
          
          .ordinal-category {
            margin-bottom: 1.5rem;
          }
          
          .ordinal-category h4 {
            font-size: 1rem;
            margin: 0.5rem 0;
            text-align: center;
            color: #ffd700;
          }

          .ordinals-grid {
            gap: 0.6rem;
            justify-content: center;
          }

          .central-mission-button {
            width: 100%;
            padding: 0 1rem;
            margin: 1.5rem 0 1rem 0;
          }
          
          .big-start-mission-button {
            width: 100%;
            padding: 0.75rem;
            font-size: 1rem;
            background-color: #ffd700;
            color: #000;
            border: none;
            border-radius: 4px;
            box-shadow: 0 4px 10px rgba(255, 215, 0, 0.4);
          }
          
          /* Instructie banner voor mobiel */
          .instruction-banner {
            margin: 0;
            padding: 1rem 0.75rem;
            border: none;
            border-top: 1px solid rgba(74, 252, 74, 0.4);
            border-radius: 0;
          }
          
          .instruction-banner h3 {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
          }
        }
        
        @media (max-width: 768px) {
          /* Bestaande stijlen behouden */
          
          /* Central mission button styling voor mobiel */
          .central-mission-button {
            margin: 1.5rem 0;
            padding: 0 1rem;
          }
          
          .big-start-mission-button {
            min-width: 200px;
            width: 90%;
            max-width: 350px;
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }
        }

        .big-start-mission-button {
          background-color: #ffd700;
          color: #000000;
          border: none;
          border-radius: 4px;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
          min-width: 250px;
        }

        .big-start-mission-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 20px rgba(255, 215, 0, 0.5);
        }

        .big-start-mission-button:disabled {
          background-color: #5a5a5a;
          color: #999999;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .central-mission-button {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        @media (max-width: 768px) {
          .bitcoin-tigers-staking {
            padding-top: 50px; /* Ruimte boven de banner voor navigatiebalk */
          }

          .mission-banner {
            margin-top: 10px; /* Extra ruimte boven de banner */
          }
        }

        @media (max-width: 768px) {
          /* Bestaande stijlen behouden */

          /* Specifieke styling voor instructie banner op mobiel */
          .instruction-banner {
            margin: 0;
            padding: 1.5rem 1rem;
            border: none;
            border-top: 1px solid rgba(74, 252, 74, 0.4);
            border-radius: 0;
            background-color: rgba(15, 20, 40, 0.8);
            width: 100%;
          }
          
          .instruction-banner h3 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }
          
          .instruction-steps {
            padding-left: 1.5rem;
            font-size: 0.85rem;
            line-height: 1.4;
            width: auto;
            height: auto;
            text-align: left;
          }
          
          .instruction-steps li {
            margin-bottom: 0.75rem;
            padding: 0.3rem 0;
          }
        }

        .step-highlight {
          color: #4afc4a;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          /* Bestaande stijlen behouden */
          
          /* Verbeterde step highlights voor mobiel */
          .step-highlight {
            color: #4afc4a;
            font-weight: bold;
            display: inline-block;
            padding: 0 2px;
          }
        }
        
        /* Tiger Leveling System Styling */
        .tiger-leveling-section {
          width: 100%;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1.5rem;
          background-color: #0a0c1d;
          border-radius: 8px;
          border: 1px solid #ffd700;
        }
        
        .leveling-intro {
          text-align: center;
          margin-bottom: 2rem;
          color: #ffffff;
          font-size: 1.1rem;
        }
        
        .tiger-levels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .tiger-level-card {
          background-color: #171a2d;
          border-radius: 10px;
          border: 2px solid #333;
          overflow: hidden;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        
        .tiger-level-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
        }
        
        .level-header {
          background-color: #222;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid #444;
        }
        
        .level-number {
          font-size: 1.4rem;
          font-weight: bold;
          color: #ffd700;
        }
        
        .level-name {
          font-size: 1rem;
          color: #ffffff;
          margin-top: 0.5rem;
        }
        
        .level-benefits {
          padding: 1.5rem;
          flex-grow: 1;
        }
        
        .level-image-container {
          padding: 1rem;
          display: flex;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .level-image {
          width: 120px;
          height: 120px;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
          transition: all 0.3s;
        }
        
        .tiger-level-card:hover .level-image {
          transform: scale(1.05);
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
        }
        
        .level-benefits h4 {
          color: #ffd700;
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 215, 0, 0.3);
          padding-bottom: 0.5rem;
        }
        
        .level-benefits ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        .level-benefits li {
          padding: 0.4rem 0;
          font-size: 0.85rem;
          color: #ffffff;
          position: relative;
          padding-left: 1.2rem;
          line-height: 1.3;
        }
        
        .level-benefits li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #ffd700;
          font-weight: bold;
        }
        
        .level-upgrade {
          padding: 1rem;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .upgrade-button {
          background-color: #ffd700;
          color: #000000;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
        }
        
        .upgrade-button:hover {
          background-color: #ffea00;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }
        
        .upgrade-button:disabled {
          background-color: #666;
          color: #999;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .level-status {
          padding: 1rem;
          text-align: center;
          font-weight: bold;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .level-status.current {
          background-color: rgba(74, 252, 74, 0.2);
          color: #4afc4a;
        }
        
        .leveling-info {
          text-align: center;
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          font-size: 0.9rem;
          color: #cccccc;
        }
        
        @media (max-width: 768px) {
          .tiger-leveling-section {
            border: none;
            border-top: 1px solid #ffd700;
            border-radius: 0;
            margin: 0;
            padding: 1rem 0.5rem;
          }
          
          .leveling-intro {
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          
          .tiger-levels-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 0.8rem;
          }
          
          .level-image {
            width: 80px;
            height: 80px;
          }
          
          .level-number {
            font-size: 1rem;
          }
          
          .level-name {
            font-size: 0.8rem;
          }
          
          .level-benefits h4 {
            font-size: 0.9rem;
          }
          
          .level-benefits li {
            font-size: 0.75rem;
            padding: 0.3rem 0;
            padding-left: 1rem;
          }
          
          .upgrade-button {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
          
          .level-status {
            padding: 0.75rem;
            font-size: 0.8rem;
          }
          
          .leveling-info {
            font-size: 0.8rem;
            padding: 0.75rem;
          }
        }
        
        /* Payment Overlay Styling */
        .payment-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .payment-container {
          width: 90%;
          max-width: 550px;
          perspective: 1000px;
        }
        
        .payment-box {
          background-color: #171a2d;
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transform-style: preserve-3d;
          animation: dropIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
          border: 3px solid #ffd700;
        }
        
        .payment-box h3 {
          font-size: 1.8rem;
          margin: 0 0 1.5rem 0;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        
        .payment-info {
          width: 100%;
          margin-bottom: 1.5rem;
        }
        
        .payment-instruction {
          font-size: 1rem;
          color: #ffffff;
          margin: 0.5rem 0;
        }
        
        .payment-amount {
          font-size: 2rem;
          font-weight: bold;
          color: #ffd700;
          margin: 1rem 0;
          padding: 0.5rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          display: inline-block;
          min-width: 200px;
        }
        
        .payment-address {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 1rem auto;
          padding: 0.75rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          max-width: 100%;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .payment-address code {
          font-family: monospace;
          font-size: 1rem;
          color: #ffffff;
          background-color: rgba(0, 0, 0, 0.4);
          padding: 0.5rem;
          border-radius: 5px;
          word-break: break-all;
          max-width: 100%;
        }
        
        .copy-button {
          background-color: #ffd700;
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .copy-button:hover {
          background-color: #ffea00;
          transform: scale(1.05);
        }
        
        .payment-note {
          font-size: 0.9rem;
          color: #cccccc;
          margin: 1rem 0;
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          text-align: left;
        }
        
        .payment-note p {
          margin: 0.5rem 0;
          line-height: 1.4;
        }
        
        .payment-note ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .payment-note li {
          margin: 0.5rem 0;
          line-height: 1.4;
        }
        
        .payment-note code {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: monospace;
          word-break: break-all;
        }
        
        .admin-link {
          color: #ffd700;
          text-decoration: underline;
          transition: all 0.2s;
        }
        
        .admin-link:hover {
          color: #ffea00;
          text-decoration: none;
        }
        
        .payment-actions {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        
        .cancel-payment-button {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 150px;
        }
        
        .cancel-payment-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .payment-box {
            padding: 1.5rem;
          }
          
          .payment-box h3 {
            font-size: 1.4rem;
          }
          
          .payment-instruction {
            font-size: 0.9rem;
          }
          
          .payment-amount {
            font-size: 1.6rem;
            min-width: auto;
            width: 80%;
          }
          
          .payment-address code {
            font-size: 0.9rem;
          }
          
          .payment-note {
            font-size: 0.8rem;
          }
        }

        .reset-claim-button {
          background-color: #ff9900;
          color: #000000;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.25rem;
          font-weight: bold;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 0.75rem;
          transition: all 0.3s;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 3px 10px rgba(255, 153, 0, 0.3);
        }
        
        .reset-claim-button:hover {
          background-color: #ffaa33;
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 5px 15px rgba(255, 153, 0, 0.5);
        }

        .chest-id {
          font-size: 14px;
          color: #f7931a;
        }
        
        .open-chest-button {
          background-color: #4afc4a;
          color: #000000;
          border: none;
          border-radius: 6px;
          padding: 8px 15px;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s;
          width: 100%;
        }
        
        .open-chest-button:hover {
          background-color: #5fff5f;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(74, 252, 74, 0.4);
        }
        
        .open-chest-button:disabled {
          background-color: #888;
          color: #333;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .chest-item.opened .chest-image {
          filter: brightness(0.7);
        }
        
        .close-reveal-button {
          background-color: #f7931a;
          color: black;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
        }
        
        /* Nieuwe stijlen voor de grote chest */
        .chest-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px 0;
        }
        
        .chest-image-large {
          width: 150px;
          height: 150px;
          margin-bottom: 15px;
          animation: pulse 2s infinite ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .open-chest-button-large {
          background-color: #4afc4a;
          color: #000000;
          border: none;
          border-radius: 6px;
          padding: 12px 25px;
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          max-width: 250px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .open-chest-button-large:hover {
          background-color: #5fff5f;
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(74, 252, 74, 0.4);
        }
        
        .close-reveal-button {
          margin-top: 15px;
          background-color: #f7931a;
          color: #000;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .close-reveal-button:hover {
          background-color: #ff9f30;
          transform: translateY(-2px);
        }

        .chest-reward-preview {
          background-color: rgba(0, 0, 0, 0.7);
          color: #ffd700;
          padding: 0.75rem;
          border-radius: 6px;
          margin: 1rem 0;
          font-weight: bold;
          text-align: center;
          border: 1px solid #ffd700;
          animation: pulse 2s infinite;
          max-width: 300px;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }

        .reward-amount {
          font-size: 1.8rem;
          font-weight: bold;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .reward-amount.jackpot {
          color: #ffff00;
          text-shadow: 0 0 10px #ffff00;
          font-size: 2.2rem;
          animation: glowingText 1.5s infinite alternate;
        }
        
        .reward-amount.high-roll {
          color: #00ff00;
          text-shadow: 0 0 8px #00ff00;
          font-size: 2rem;
        }
        
        .jackpot-label {
          background-color: #ffff00;
          color: #000;
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-weight: bold;
          display: inline-block;
          margin-top: 0.5rem;
          animation: pulse 0.8s infinite alternate;
          box-shadow: 0 0 15px #ffff00;
        }
        
        .high-roll-label {
          background-color: #00ff00;
          color: #000;
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-weight: bold;
          display: inline-block;
          margin-top: 0.5rem;
          animation: pulse 1.2s infinite alternate;
          box-shadow: 0 0 10px #00ff00;
        }
        
        .regular-roll-label {
          background-color: #3a86ff;
          color: #fff;
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-weight: bold;
          display: inline-block;
          margin-top: 0.5rem;
          animation: pulse 1.5s infinite alternate;
          box-shadow: 0 0 8px #3a86ff;
        }
        
        @keyframes glowingText {
          from { text-shadow: 0 0 10px #ffff00; }
          to { text-shadow: 0 0 20px #ffff00, 0 0 30px #ffff00; }
        }

        .force-unstake-button {
          background-color: #ff9900;
          color: #000000;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.25rem;
          font-weight: bold;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 0.75rem;
          transition: all 0.3s;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 3px 10px rgba(255, 153, 0, 0.3);
        }
        
        .force-unstake-button:hover {
          background-color: #ffaa33;
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 5px 15px rgba(255, 153, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default BitcoinTigersStaking;

// Explicitly export the tigerStakingFunctions for external use
export const tigerStakingFunctions = {
  stakeTiger: async (tigerId: string, missionId: string = "default"): Promise<any> => {
    // Get wallet address from localStorage for direct access
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      console.error('No wallet address available in localStorage, cannot stake');
      return { success: false, error: 'No wallet address provided' };
    }
    
    try {
      // Check if tigerStakingDB exists in localStorage
      const tigerStakingData = localStorage.getItem('tigerStakingDB');
      if (!tigerStakingData) {
        // Initialize the tiger staking DB with empty structure
        const initialDB = {
          stakedTigers: {},
          chests: {},
          rewardHistory: []
        };
        localStorage.setItem('tigerStakingDB', JSON.stringify(initialDB));
      }
      
      // Get current staking DB
      const currentDB = JSON.parse(localStorage.getItem('tigerStakingDB') || '{}');
      
      // Ensure proper structure exists
      if (!currentDB.stakedTigers) {
        currentDB.stakedTigers = {};
      }
      
      if (!currentDB.stakedTigers[walletAddress]) {
        currentDB.stakedTigers[walletAddress] = {};
      }
      
      // Check if tiger is already staked
      if (currentDB.stakedTigers[walletAddress][tigerId]) {
        console.log(`Tiger ${tigerId} is already staked, not staking again`);
        return { success: false, error: 'Tiger is already staked' };
      }
      
      // Try to find tiger data in localStorage
      let tigerData: any = null;
      
      // Check in bitcoinTigers cache first
      const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
      if (cachedTigers) {
        const parsedTigers = JSON.parse(cachedTigers);
        tigerData = parsedTigers.find((t: any) => t.id === tigerId);
      }
      
      // If not found, check in runeGuardians cache
      if (!tigerData) {
        const cachedGuardians = localStorage.getItem(`runeGuardians_${walletAddress}`);
        if (cachedGuardians) {
          const parsedGuardians = JSON.parse(cachedGuardians);
          tigerData = parsedGuardians.find((g: any) => g.id === tigerId);
        }
      }
      
      // If still not found, create minimal data
      if (!tigerData) {
        tigerData = {
          id: tigerId,
          name: `Tiger #${tigerId.substring(0, 8)}`,
          image: '/tiger-pixel1.png',
          isRuneGuardian: tigerId.includes('guardian') || 
                          tigerId.includes('rune') || 
                          missionId.includes('guardian')
        };
      }
      
      // Add the tiger to staked tigers
      currentDB.stakedTigers[walletAddress][tigerId] = {
        id: tigerId,
        name: tigerData.name || `Tiger #${tigerId.substring(0, 8)}`,
        image: tigerData.image || `/tiger-pixel${(parseInt(tigerId.substring(0, 8), 16) % 5) + 1}.png`, // Gebruik unieke afbeelding
        isRuneGuardian: tigerData.isRuneGuardian || false,
        stakedAt: Date.now(),
        nextChestAt: Date.now() + 10000, // 10 seconds for testing
        missionId: missionId
      };
      
      console.log(`Added tiger ${tigerId} to staked tigers for wallet ${walletAddress}`, currentDB.stakedTigers[walletAddress][tigerId]);
      
      // Save updated DB to localStorage
      localStorage.setItem('tigerStakingDB', JSON.stringify(currentDB));
      
      return { success: true };
    } catch (error) {
      console.error('Error staking tiger:', error);
      return { success: false, error: `Error staking tiger: ${error}` };
    }
  },
  
  unstakeTiger: async (tigerId: string): Promise<any> => {
    // Get wallet address from localStorage for direct access
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      console.error('No wallet address available in localStorage, cannot unstake');
      return { success: false, error: 'No wallet address provided' };
    }
    
    try {
      // Get current staking DB
      const tigerStakingData = localStorage.getItem('tigerStakingDB');
      if (!tigerStakingData) {
        return { success: false, error: 'No staking data found' };
      }
      
      const currentDB = JSON.parse(tigerStakingData);
      
      // Check if this wallet has any staked tigers
      if (!currentDB.stakedTigers || !currentDB.stakedTigers[walletAddress]) {
        console.log(`No staked tigers found for wallet ${walletAddress}`);
        return { success: false, error: 'No staked tigers found for this wallet' };
      }
      
      // Check if this tiger is staked
      if (!currentDB.stakedTigers[walletAddress][tigerId]) {
        console.log(`Tiger ${tigerId} is not staked, cannot unstake`);
        return { success: false, error: 'Tiger is not staked' };
      }
      
      // Log the tiger we're unstaking
      const unstakingTiger = currentDB.stakedTigers[walletAddress][tigerId];
      console.log('Unstaking tiger:', unstakingTiger);
      
      // Remove this tiger from staked tigers
      delete currentDB.stakedTigers[walletAddress][tigerId];
      
      console.log(`Removed tiger ${tigerId} from staked tigers for wallet ${walletAddress}`);
      
      // Save updated DB to localStorage
      localStorage.setItem('tigerStakingDB', JSON.stringify(currentDB));
      
      return { success: true };
    } catch (error) {
      console.error('Error unstaking tiger:', error);
      return { success: false, error: `Error unstaking tiger: ${error}` };
    }
  }
}; 
