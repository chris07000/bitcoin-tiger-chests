import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLightning } from '@/context/LightningContext';
import axios from 'axios';

// Helper functie om te controleren of een ordinal een SigmaX is
export const isSigmaX = (ordinal: any): boolean => {
  if (!ordinal) return false;
  
  // Debug logging toevoegen
  console.log(`Controleren of ${ordinal.id} een SigmaX is...`);
  
  // Lijst met bekende SigmaX ID patronen (EXCLUSIEF voor SigmaX)
  const SIGMAX_PATTERNS = [
    { baseId: "bbcc29a118a2c5cc7cdd81c95fef1c6c8036d07db4437f1058532878249ac5eci", maxIndex: 419 },
    { baseId: "821ac77016796c87ea27a1e1e481b5f5285a59c61136ef069dea3f2a9d010655i", maxIndex: 454 },
    { baseId: "d34fdb58e4c3135405d246cdd3c533cf7b27b80c9608264d1107cf5a6620fe5fi", maxIndex: 212 },
    { baseId: "22404dc9cca8a8b70a5f26af0c0ff616cb64a00ab330429e2b7e2a54e067850ci", maxIndex: 496 },
    { baseId: "71015e503da1c7072fe365a9846554d77eba9d9a7afcc105d8ac535aa77bffbci", maxIndex: 489 },
    { baseId: "aba050b80c5090ae96eddad10f827a17ac47093d1577c680bf34054f9e210f59i", maxIndex: 494 },
    { baseId: "26ed1f845b6ffec8aa137f732acf97bd3c2f5320e85fbcd3c54da19f46d34ff2i", maxIndex: 494 },
    { baseId: "eefe4543561b5fb6d5d4e333759e71e459e1511d24b3ed49ca1944363f375387i", maxIndex: 484 },
    { baseId: "b87ad1a3247881cebb95317c5c16a3238a3e779e6e78c468d2c34c3f79706bdci", maxIndex: 309 },
    { baseId: "14af407b187d3236962d82540d571d3a077dfddd2eacb71ba40d130ad9a5662bi", maxIndex: 351 },
    { baseId: "bce132567ecd98e57b7fce8edcda8922c23d171f7a18789899655fec4144efaci", maxIndex: 351 },
    { baseId: "1bfd611bd7a74c098e40f81ee975fefec715366995b81ee1d5a5402d564c23f3i", maxIndex: 300 },
    { baseId: "bbe382a6fb1c118046edb4c416abb863b64fb0818ce6cc60d46c4f7e3dd64339i", maxIndex: 191 },
    { baseId: "6be540ae9f5f3d1df9f646f1fcb6d1e366844ba4e081a4d677f2312f75550314i", maxIndex: 171 },
    { baseId: "a4d66331fd73aa8b314a8476cffea5fbc487001a1e83565251336ff633e6b639i", maxIndex: 214 },
    { baseId: "ba97d6ed09595ca621095f87e1dcebd05c3a279d0c70e2b5f20ca6a8b2d445c9i", maxIndex: 110 }
  ];
  
  // EXPLICIETE FLAG HEEFT HOOGSTE PRIORITEIT
  if (ordinal.isSigmaX === true) {
    console.log(`${ordinal.id} is gemarkeerd als SigmaX via expliciete flag`);
    return true;
  }
  
  // EXPLICIETE EXCLUSIE VOOR BITCOIN TIGERS EN TAPROOT ALPHA
  if (ordinal.id) {
    // Taproot Alpha patterns
    if (ordinal.id.startsWith("47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di")) {
      console.log(`${ordinal.id} is een Taproot Alpha, GEEN SigmaX`);
      return false;
    }
    
    // Bitcoin Tiger patterns
    const BITCOIN_TIGER_PATTERNS = [
      "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei",
      "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i",
      "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi",
      "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i"
    ];
    
    if (BITCOIN_TIGER_PATTERNS.some(pattern => ordinal.id.startsWith(pattern))) {
      console.log(`${ordinal.id} is een Bitcoin Tiger, GEEN SigmaX`);
      return false;
    }
  }
  
  // NAAM EN COLLECTIE CHECK
  if (ordinal.name && ordinal.name.toLowerCase().includes('sigmax')) {
    console.log(`${ordinal.id} is een SigmaX op basis van naam: ${ordinal.name}`);
    return true;
  }
  
  if (ordinal.collection && ordinal.collection.toLowerCase().includes('sigmax')) {
    console.log(`${ordinal.id} is een SigmaX op basis van collectie: ${ordinal.collection}`);
    return true;
  }
  
  // ID EXACTE MATCH HEEFT LAAGSTE PRIORITEIT
  if (ordinal.id) {
    // Check op exacte match met een SigmaX patroon
    for (const pattern of SIGMAX_PATTERNS) {
      if (ordinal.id.startsWith(pattern.baseId)) {
        // Exacte match met base ID
        if (ordinal.id === pattern.baseId) {
          console.log(`${ordinal.id} is een SigmaX op basis van exacte ID match`);
          return true;
        }
        
        // Of match met index binnen bereik
        const restOfId = ordinal.id.substring(pattern.baseId.length);
        const number = parseInt(restOfId);
        if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
          console.log(`${ordinal.id} is een SigmaX op basis van ID pattern match met index ${number}`);
          return true;
        }
      }
    }
  }
  
  console.log(`${ordinal.id} is GEEN SigmaX`);
  return false;
};

interface OrdinalSigmaXMissionsProps {
  walletAddress: string;
  userSigmaX?: any[];
  stakedSigmaX?: any[];
  onStake?: (sigmaXId: string, missionId: string) => Promise<any>;
  onUnstake?: (sigmaXId: string) => Promise<any>;
  onRefresh?: () => Promise<void>;
  bannerImage?: string;
}

const OrdinalSigmaXMissions: React.FC<OrdinalSigmaXMissionsProps> = ({ 
  walletAddress,
  userSigmaX: propUserSigmaX = [],
  stakedSigmaX: propStakedSigmaX = [],
  onStake,
  onUnstake,
  onRefresh,
  bannerImage = "/tigermission.png"
}) => {
  const [userSigmaX, setUserSigmaX] = useState<any[]>(propUserSigmaX);
  const [stakedSigmaX, setStakedSigmaX] = useState<any[]>(propStakedSigmaX);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');
  
  // Padding voor mobiel
  const [mobilePadding, setMobilePadding] = useState('0');
  const { setBalance, balance } = useLightning();
  
  // State voor countdown timer
  const [countdownDays, setCountdownDays] = useState(5);
  const [countdownHours, setCountdownHours] = useState(23);
  const [countdownMins, setCountdownMins] = useState(59);
  const [countdownSecs, setCountdownSecs] = useState(59);
  
  // Missie data
  const [activeMissionData, setActiveMissionData] = useState({
    activeTigers: 0,
    activeSigmaX: 0,
    totalPower: 0,
    estimatedRewards: 0
  });

  // State for staking functionality
  const [selectedOrdinals, setSelectedOrdinals] = useState<string[]>([]);
  const [localStakedSigmaX, setLocalStakedSigmaX] = useState<any[]>([]);
  const [sigmaXTimers, setSigmaXTimers] = useState<{[sigmaXId: string]: number}>({});
  const [showClaim, setShowClaim] = useState(false);
  const [claimedReward, setClaimedReward] = useState(0);
  const [claimingInProgress, setClaimingInProgress] = useState(false);
  const [claimingSigmaXId, setClaimingSigmaXId] = useState<string | null>(null);
  
  // Reward configuration
  const REWARD_CONFIG = {
    // Chances (in percentage, must add up to 100)
    CHANCES: {
      LOW_ROLL: 98,  // 98% chance for low roll
      HIGH_ROLL: 1.9, // 1.9% chance for high roll
      JACKPOT: 0.1   // 0.1% chance for jackpot
    },
    // Reward ranges (in satoshis)
    AMOUNTS: {
      LOW_ROLL: { MIN: 1000, MAX: 5000 },    // 1,000 - 5,000 sats
      HIGH_ROLL: { MIN: 10000, MAX: 20000 }, // 10,000 - 20,000 sats
      JACKPOT: { MIN: 25000, MAX: 500000 }   // 25,000 - 500,000 sats
    }
  };

  // Effect om mobiele padding aan te passen
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setMobilePadding(window.innerWidth <= 768 ? '60px' : '0');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Effect voor countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      if (countdownSecs > 0) {
        setCountdownSecs(prev => prev - 1);
      } else if (countdownMins > 0) {
        setCountdownMins(prev => prev - 1);
        setCountdownSecs(59);
      } else if (countdownHours > 0) {
        setCountdownHours(prev => prev - 1);
        setCountdownMins(59);
        setCountdownSecs(59);
      } else if (countdownDays > 0) {
        setCountdownDays(prev => prev - 1);
        setCountdownHours(23);
        setCountdownMins(59);
        setCountdownSecs(59);
      }
    }, 1000);
    
    return () => clearInterval(countdown);
  }, [countdownDays, countdownHours, countdownMins, countdownSecs]);

  // Laad SigmaX data bij initialisatie
  useEffect(() => {
    if (walletAddress) {
      // Als we userSigmaX als prop krijgen, gebruik die direct
      if (propUserSigmaX && propUserSigmaX.length > 0) {
        console.log(`Using provided ${propUserSigmaX.length} ordinals from props`);
        loadSigmaXData();
      } else {
        // Alleen uit localStorage laden als geen props gegeven
        console.log('No ordinals provided as props, trying to load from localStorage');
        loadSigmaXData();
      }
      loadLocalStakedSigmaX();
    } else {
      setIsLoading(false);
    }
  }, [walletAddress, propUserSigmaX]);

  // Refresh bij eerste render - zorgt ervoor dat caches worden herbruikt
  useEffect(() => {
    if (walletAddress) {
      console.log("Initial refresh to ensure caches are loaded");
      setTimeout(() => {
        refreshSigmaXData();
      }, 1000);
    }
  }, []); // Leeg dependency array zodat het alleen bij eerste render gebeurt

  // Functie om SigmaX data te laden
  const loadSigmaXData = async () => {
    try {
      setIsLoading(true);
      
      // Als er props zijn doorgegeven voor SigmaX, gebruik die als startpunt
      if (propUserSigmaX && propUserSigmaX.length > 0) {
        console.log(`Loading from props: ${propUserSigmaX.length} potential SigmaX ordinals`);
        
        // Filter direct op SigmaX ordinals
        const filteredSigmaX = propUserSigmaX.filter(ordinal => {
          // Controleer eerst isSigmaX flag
          if (ordinal.isSigmaX === true) {
            console.log(`Accepting ordinal from props with isSigmaX flag: ${ordinal.id}`);
            return true;
          }
          
          // Controleer op SigmaX naam/collectie
          if ((ordinal.name && ordinal.name.toLowerCase().includes('sigmax')) || 
              (ordinal.collection && ordinal.collection.toLowerCase().includes('sigmax'))) {
            console.log(`Accepting ordinal from props with SigmaX name/collection: ${ordinal.id}, ${ordinal.name || 'unnamed'}`);
            return true;
          }
          
          // Controleer op SigmaX ID patronen
          const isSigmaXByPattern = (ord: any): boolean => {
            if (!ord || !ord.id) return false;
            
            // SigmaX ID patronen
            const SIGMAX_PATTERNS = [
              { baseId: "bbcc29a118a2c5cc7cdd81c95fef1c6c8036d07db4437f1058532878249ac5eci", maxIndex: 419 },
              { baseId: "821ac77016796c87ea27a1e1e481b5f5285a59c61136ef069dea3f2a9d010655i", maxIndex: 454 },
              { baseId: "d34fdb58e4c3135405d246cdd3c533cf7b27b80c9608264d1107cf5a6620fe5fi", maxIndex: 212 },
              { baseId: "22404dc9cca8a8b70a5f26af0c0ff616cb64a00ab330429e2b7e2a54e067850ci", maxIndex: 496 },
              { baseId: "71015e503da1c7072fe365a9846554d77eba9d9a7afcc105d8ac535aa77bffbci", maxIndex: 489 },
              { baseId: "aba050b80c5090ae96eddad10f827a17ac47093d1577c680bf34054f9e210f59i", maxIndex: 494 },
              { baseId: "26ed1f845b6ffec8aa137f732acf97bd3c2f5320e85fbcd3c54da19f46d34ff2i", maxIndex: 494 },
              { baseId: "eefe4543561b5fb6d5d4e333759e71e459e1511d24b3ed49ca1944363f375387i", maxIndex: 484 },
              { baseId: "b87ad1a3247881cebb95317c5c16a3238a3e779e6e78c468d2c34c3f79706bdci", maxIndex: 309 },
              { baseId: "14af407b187d3236962d82540d571d3a077dfddd2eacb71ba40d130ad9a5662bi", maxIndex: 351 },
              { baseId: "bce132567ecd98e57b7fce8edcda8922c23d171f7a18789899655fec4144efaci", maxIndex: 351 },
              { baseId: "1bfd611bd7a74c098e40f81ee975fefec715366995b81ee1d5a5402d564c23f3i", maxIndex: 300 },
              { baseId: "bbe382a6fb1c118046edb4c416abb863b64fb0818ce6cc60d46c4f7e3dd64339i", maxIndex: 191 },
              { baseId: "6be540ae9f5f3d1df9f646f1fcb6d1e366844ba4e081a4d677f2312f75550314i", maxIndex: 171 },
              { baseId: "a4d66331fd73aa8b314a8476cffea5fbc487001a1e83565251336ff633e6b639i", maxIndex: 214 },
              { baseId: "ba97d6ed09595ca621095f87e1dcebd05c3a279d0c70e2b5f20ca6a8b2d445c9i", maxIndex: 110 }
            ];
            
            // Check SigmaX ID patterns
            for (const pattern of SIGMAX_PATTERNS) {
              if (ord.id.startsWith(pattern.baseId)) {
                const restOfId = ord.id.substring(pattern.baseId.length);
                // Exacte match met base ID
                if (restOfId === '') {
                  console.log(`Accepting ordinal from props with SigmaX ID pattern match: ${ord.id}`);
                  return true;
                }
                // Of match met index binnen bereik
                const number = parseInt(restOfId);
                if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
                  console.log(`Accepting ordinal from props with SigmaX ID pattern match: ${ord.id} (index ${number})`);
                  return true;
                }
              }
            }
            
            return false;
          };
          
          // Controleer of het een SigmaX is op basis van ID patronen
          if (isSigmaXByPattern(ordinal)) {
            return true;
          }
          
          // Expliciet filteren: Bitcoin Tigers en Taproot Alpha ordinals NIET accepteren
          if (ordinal.isBitcoinTiger === true || 
              ordinal.isTaprootAlpha === true || 
              (ordinal.name && (ordinal.name.toLowerCase().includes('taproot') || 
                              ordinal.name.toLowerCase().includes('bitcoin tiger')))) {
            console.log(`Rejecting Bitcoin Tiger or Taproot Alpha from props: ${ordinal.id}, ${ordinal.name || 'unnamed'}`);
            return false;
          }
          
          // Als we hier zijn, is het geen bevestigde SigmaX
          console.log(`Rejecting non-SigmaX ordinal from props: ${ordinal.id}, ${ordinal.name || 'unnamed'}`);
          return false;
        });
        
        console.log(`Filtered to ${filteredSigmaX.length} confirmed SigmaX ordinals from props`);
        
        // Kloon en verwerk de gefilterde ordinals
        const markedOrdinals = filteredSigmaX.map(ordinal => {
          // Kloon het ordinal object om het niet direct te muteren
          const markedOrdinal = { ...ordinal };
          
          // Controleer eerst expliciet of het een SigmaX ordinal is met de SigmaX patterns
          const isSigmaXByPattern = (ordinal: any): boolean => {
            if (!ordinal || !ordinal.id) return false;
            
            // SigmaX ID patronen
            const SIGMAX_PATTERNS = [
              { baseId: "bbcc29a118a2c5cc7cdd81c95fef1c6c8036d07db4437f1058532878249ac5eci", maxIndex: 419 },
              { baseId: "821ac77016796c87ea27a1e1e481b5f5285a59c61136ef069dea3f2a9d010655i", maxIndex: 454 },
              { baseId: "d34fdb58e4c3135405d246cdd3c533cf7b27b80c9608264d1107cf5a6620fe5fi", maxIndex: 212 },
              { baseId: "22404dc9cca8a8b70a5f26af0c0ff616cb64a00ab330429e2b7e2a54e067850ci", maxIndex: 496 },
              { baseId: "71015e503da1c7072fe365a9846554d77eba9d9a7afcc105d8ac535aa77bffbci", maxIndex: 489 },
              { baseId: "aba050b80c5090ae96eddad10f827a17ac47093d1577c680bf34054f9e210f59i", maxIndex: 494 },
              { baseId: "26ed1f845b6ffec8aa137f732acf97bd3c2f5320e85fbcd3c54da19f46d34ff2i", maxIndex: 494 },
              { baseId: "eefe4543561b5fb6d5d4e333759e71e459e1511d24b3ed49ca1944363f375387i", maxIndex: 484 },
              { baseId: "b87ad1a3247881cebb95317c5c16a3238a3e779e6e78c468d2c34c3f79706bdci", maxIndex: 309 },
              { baseId: "14af407b187d3236962d82540d571d3a077dfddd2eacb71ba40d130ad9a5662bi", maxIndex: 351 },
              { baseId: "bce132567ecd98e57b7fce8edcda8922c23d171f7a18789899655fec4144efaci", maxIndex: 351 },
              { baseId: "1bfd611bd7a74c098e40f81ee975fefec715366995b81ee1d5a5402d564c23f3i", maxIndex: 300 },
              { baseId: "bbe382a6fb1c118046edb4c416abb863b64fb0818ce6cc60d46c4f7e3dd64339i", maxIndex: 191 },
              { baseId: "6be540ae9f5f3d1df9f646f1fcb6d1e366844ba4e081a4d677f2312f75550314i", maxIndex: 171 },
              { baseId: "a4d66331fd73aa8b314a8476cffea5fbc487001a1e83565251336ff633e6b639i", maxIndex: 214 },
              { baseId: "ba97d6ed09595ca621095f87e1dcebd05c3a279d0c70e2b5f20ca6a8b2d445c9i", maxIndex: 110 }
            ];
            
            // Check SigmaX ID patterns
            for (const pattern of SIGMAX_PATTERNS) {
              if (ordinal.id.startsWith(pattern.baseId)) {
                const restOfId = ordinal.id.substring(pattern.baseId.length);
                // Exacte match met base ID
                if (restOfId === '') {
                  return true;
                }
                // Of match met index binnen bereik
                const number = parseInt(restOfId);
                if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
                  return true;
                }
              }
            }
            
            return false;
          };
          
          // Controleer op SigmaX naam/collectie
          const isSigmaXByNameOrCollection = (ordinal: any): boolean => {
            return (ordinal.name && ordinal.name.toLowerCase().includes('sigmax')) || 
                   (ordinal.collection && ordinal.collection.toLowerCase().includes('sigmax'));
          };
          
          // Bepaal het type met getOrdinalType
          const ordinalType = getOrdinalType(markedOrdinal);
          
          // Zet de juiste flags op basis van het type
          markedOrdinal.isSigmaX = ordinalType === 'sigmax' || 
                                   isSigmaXByPattern(markedOrdinal) || 
                                   isSigmaXByNameOrCollection(markedOrdinal) || 
                                   markedOrdinal.isSigmaX === true;
          
          markedOrdinal.isBitcoinTiger = ordinalType === 'bitcoin-tiger';
          markedOrdinal.isRuneGuardian = ordinalType === 'rune-guardian';
          markedOrdinal.isTaprootAlpha = ordinalType === 'taproot-alpha';
          
          // Log indien het een SigmaX is
          if (markedOrdinal.isSigmaX) {
            console.log(`Marked ordinal as SigmaX: ${markedOrdinal.id}, name: ${markedOrdinal.name || 'unnamed'}`);
          }
          
          return markedOrdinal;
        });
        
        console.log('Marked ordinals with type flags based on getOrdinalType:', markedOrdinals);
        
        // Log de aantallen per type
        const sigmaXCount = markedOrdinals.filter(o => o.isSigmaX).length;
        const tigerCount = markedOrdinals.filter(o => o.isBitcoinTiger).length;
        const guardianCount = markedOrdinals.filter(o => o.isRuneGuardian).length;
        const taprootCount = markedOrdinals.filter(o => o.isTaprootAlpha).length;
        console.log(`Ordinal types after marking: SigmaX: ${sigmaXCount}, Tigers: ${tigerCount}, Guardians: ${guardianCount}, Taproot: ${taprootCount}`);
        
        setUserSigmaX(markedOrdinals);
        setIsLoading(false);
        return;
      }
      
      // Anders kijken we in de localStorage cache
      let cachedOrdinals: any[] = [];
      
      // First try to load SigmaX ordinals
      const cachedSigmaX = localStorage.getItem(`sigmaX_${walletAddress}`);
      if (cachedSigmaX) {
        try {
          const parsedSigmaX = JSON.parse(cachedSigmaX);
          console.log(`Loaded ${parsedSigmaX.length} SigmaX ordinals from cache`);
          
          // Expliciet markeren als SigmaX
          const markedSigmaX = parsedSigmaX.map((ordinal: any) => {
            // Maak een kopie van het ordinal object
            const markedOrdinal = { ...ordinal };
            
            // Controleer het type met getOrdinalType
            const ordinalType = getOrdinalType(markedOrdinal);
            
            // Zet expliciete flags gebaseerd op het type
            markedOrdinal.isSigmaX = true; // Forceer SigmaX flag voor alle ordinals uit de SigmaX cache
            markedOrdinal.isBitcoinTiger = ordinalType === 'bitcoin-tiger';
            markedOrdinal.isRuneGuardian = ordinalType === 'rune-guardian';
            markedOrdinal.isTaprootAlpha = ordinalType === 'taproot-alpha';
            
            return markedOrdinal;
          });
          
          cachedOrdinals = [...markedSigmaX];
          console.log(`Successfully marked ${markedSigmaX.length} SigmaX ordinals from cache`);
          
          // Log het aantal van elk type
          const sigmaXCount = markedSigmaX.filter((o: any) => o.isSigmaX).length;
          console.log(`Found ${sigmaXCount} SigmaX ordinals in SigmaX cache`);
        } catch (e) {
          console.error("Error parsing sigmaX cache:", e);
        }
      } else {
        console.log("No SigmaX cache found, will look for Bitcoin Tigers");
      }
      
      // Then load Bitcoin Tiger ordinals and combine them
      const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
      if (cachedTigers) {
        try {
          const parsedTigers = JSON.parse(cachedTigers);
          console.log(`Loaded ${parsedTigers.length} Bitcoin Tigers from cache`);
          
          // Markeer Bitcoin Tiger ordinals met getOrdinalType
          const markedTigers = parsedTigers.map((ordinal: any) => {
            // Maak een kopie van het ordinal object
            const markedOrdinal = { ...ordinal };
            
            // Controleer het type met getOrdinalType
            const ordinalType = getOrdinalType(markedOrdinal);
            
            // Zet expliciete flags gebaseerd op het type
            markedOrdinal.isSigmaX = ordinalType === 'sigmax';
            markedOrdinal.isBitcoinTiger = true; // Forceer Bitcoin Tiger flag voor alle ordinals uit de Tiger cache
            markedOrdinal.isRuneGuardian = ordinalType === 'rune-guardian';
            markedOrdinal.isTaprootAlpha = ordinalType === 'taproot-alpha';
            
            return markedOrdinal;
          });
          
          // Log het aantal van elk type
          const sigmaXCount = markedTigers.filter((o: any) => o.isSigmaX).length;
          const tigerCount = markedTigers.filter((o: any) => o.isBitcoinTiger).length;
          console.log(`Found ${sigmaXCount} SigmaX ordinals and ${tigerCount} Bitcoin Tigers in Tiger cache`);
          
          // Check if any SigmaX were found in the Bitcoin Tigers cache
          if (sigmaXCount > 0) {
            console.log("Found SigmaX ordinals in Bitcoin Tigers cache:", markedTigers.filter((o: any) => o.isSigmaX));
          }
          
          // Voeg alle unieke ordinals toe
          const existingIds = new Set(cachedOrdinals.map((o: any) => o.id));
          const uniqueTigers = markedTigers.filter((o: any) => !existingIds.has(o.id));
          
          console.log(`Adding ${uniqueTigers.length} unique ordinals from Bitcoin Tigers cache`);
          cachedOrdinals = [...cachedOrdinals, ...uniqueTigers];
        } catch (e) {
          console.error("Error parsing bitcoinTigers cache:", e);
        }
      } else {
        console.log("No Bitcoin Tigers cache found");
      }
      
      console.log(`Total ordinals loaded from cache: ${cachedOrdinals.length}`);
      
      // Toon een samenvatting van de geladen ordinals
      const sigmaXCount = cachedOrdinals.filter(o => o.isSigmaX).length;
      const tigerCount = cachedOrdinals.filter(o => o.isBitcoinTiger).length;
      const guardianCount = cachedOrdinals.filter(o => o.isRuneGuardian).length;
      const taprootCount = cachedOrdinals.filter(o => o.isTaprootAlpha).length;
      console.log(`Ordinal types: SigmaX: ${sigmaXCount}, Tigers: ${tigerCount}, Guardians: ${guardianCount}, Taproot: ${taprootCount}`);
      
      setUserSigmaX(cachedOrdinals);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading SigmaX data:', error);
      setMessage('Failed to load SigmaX data');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  // Helper functie om localStakedSigmaX te laden vanuit localStorage
  const loadLocalStakedSigmaX = () => {
    if (!walletAddress) return;
    
    try {
      const sigmaXStakingData = localStorage.getItem('sigmaXStakingDB');
      if (sigmaXStakingData) {
        const parsedData = JSON.parse(sigmaXStakingData);
        console.log('Parsed SigmaX staking data:', parsedData);
        
        if (parsedData.stakedSigmaX && parsedData.stakedSigmaX[walletAddress]) {
          const walletStakedSigmaX = parsedData.stakedSigmaX[walletAddress];
          
          // EXTRA DEBUG: Log de ruwe SigmaX uit localStorage
          console.log('[DEBUG] Raw SigmaX from localStorage:', walletStakedSigmaX);
          console.log('[DEBUG] Object keys:', Object.keys(walletStakedSigmaX));
          
          // Controleer of er duplicaten zijn in de IDs
          const sigmaXIds = Object.keys(walletStakedSigmaX);
          const uniqueIds = [...new Set(sigmaXIds)];
          if (sigmaXIds.length !== uniqueIds.length) {
            console.warn('[WARNING] Duplicate SigmaX IDs found in localStorage!', {
              totalIds: sigmaXIds.length,
              uniqueIds: uniqueIds.length
            });
          }
          
          // Converteer naar array van gestakede SigmaX
          const displayStakedSigmaX = Object.entries(walletStakedSigmaX).map(([sigmaXId, info]: [string, any]) => ({
            id: sigmaXId,
            name: info.name || `SigmaX #${sigmaXId.substring(0, 8)}`,
            image: info.image || '/sigmastone-logo.gif',
            isSigmaX: true,
            stakedAt: info.stakedAt || Date.now(),
            nextChestAt: info.nextChestAt || (Date.now() + 10000),
            key: `staked-${sigmaXId}`
          }));
          
          console.log(`Found ${displayStakedSigmaX.length} staked SigmaX in localStorage:`, displayStakedSigmaX);
          
          // Update de lokale state
          setLocalStakedSigmaX(displayStakedSigmaX);
          
          // Update activeMissionData
          setActiveMissionData(prev => ({
            ...prev,
            activeSigmaX: displayStakedSigmaX.length,
            totalPower: displayStakedSigmaX.length * 420,
            estimatedRewards: displayStakedSigmaX.length * 100
          }));
        } else {
          // Clear the local staked SigmaX if there are none in localStorage
          setLocalStakedSigmaX([]);
        }
      } else {
        // Initialize sigmaXStakingDB if it doesn't exist
        const initialDB = JSON.stringify({
          stakedSigmaX: {},
          chests: {},
          rewardHistory: []
        });
        localStorage.setItem('sigmaXStakingDB', initialDB);
        setLocalStakedSigmaX([]);
      }
    } catch (error) {
      console.error('Error loading SigmaX staking data:', error);
      // On error, reset the local state
      setLocalStakedSigmaX([]);
    }
  };
  
  // Update timers for staked SigmaX
  useEffect(() => {
    // Laad gestakede SigmaX bij initialisatie
    loadLocalStakedSigmaX();
    
    // Start een timer voor het bijwerken van de countdown voor elke SigmaX
    const timerInterval = setInterval(() => {
      const now = Date.now();
      
      // Bijwerken van de SigmaX in de localStorage
      try {
        const sigmaXStakingData = localStorage.getItem('sigmaXStakingDB');
        if (sigmaXStakingData) {
          const parsedData = JSON.parse(sigmaXStakingData);
          
          if (parsedData.stakedSigmaX && parsedData.stakedSigmaX[walletAddress]) {
            const walletStakedSigmaX = parsedData.stakedSigmaX[walletAddress];
            let needsUpdate = false;
            
            // Bereken voor elke SigmaX de resterende tijd
            const newTimers: {[sigmaXId: string]: number} = {};
            
            // Loop door alle gestakede SigmaX
            Object.entries(walletStakedSigmaX).forEach(([sigmaXId, info]: [string, any]) => {
              const nextChestTime = info.nextChestAt;
              const remainingTime = Math.max(0, nextChestTime - now);
              
              newTimers[sigmaXId] = remainingTime;
              
              // Check of SigmaX klaar is voor claimen
              if (remainingTime <= 0 && info.nextChestAt > 0) {
                console.log(`SigmaX ${sigmaXId} is klaar voor claimen!`);
                // We markeren alleen dat er een update nodig is, maar unstaken niet automatisch
                needsUpdate = true;
              }
            });
            
            // Update de timer state
            setSigmaXTimers(newTimers);
            
            // Als één van de SigmaX klaar is, refresh de UI
            if (needsUpdate) {
              loadLocalStakedSigmaX();
            }
          }
        }
      } catch (error) {
        console.error('Error bij het bijwerken van SigmaX timers:', error);
      }
    }, 500); // Update elke halve seconde voor vloeiendere countdown
    
    // Extra interval om SigmaX te laden vanuit localStorage
    const refreshInterval = setInterval(() => {
      loadLocalStakedSigmaX();
    }, 5000); // Elke 5 seconden verversen
    
    // Cleanup beide intervals
    return () => {
      clearInterval(timerInterval);
      clearInterval(refreshInterval);
    };
  }, [walletAddress]);

  // Helper function to check if an ordinal is a Bitcoin Tiger
  const isBitcoinTiger = (ordinal: any): boolean => {
    if (!ordinal) return false;

    // Explicitly exclude problematic IDs
    if (ordinal.id && ordinal.id.includes('8535700')) {
      return false;
    }

    // BITCOIN TIGER PATRONEN - EXCLUSIEF voor Tigers
    const BITCOIN_TIGER_PATTERNS = [
      { baseId: "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei", maxIndex: 292 }, // Series 1
      { baseId: "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i", maxIndex: 293 }, // Series 2
      { baseId: "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi", maxIndex: 293 }, // Series 3
      { baseId: "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i", maxIndex: 117 }  // Series 4
    ];
    
    // EXPLICIETE FLAG HEEFT HOOGSTE PRIORITEIT
    if (ordinal.isBitcoinTiger === true) {
      return true;
    }
    
    // ID EXACTE MATCH HEEFT TWEEDE PRIORITEIT
    if (ordinal.id) {
      // Check op exacte match met een Bitcoin Tiger patroon
      for (const pattern of BITCOIN_TIGER_PATTERNS) {
        if (ordinal.id.startsWith(pattern.baseId)) {
          // Exacte match met base ID
          if (ordinal.id === pattern.baseId) {
            return true;
          }
          
          // Of match met index binnen bereik
          const restOfId = ordinal.id.substring(pattern.baseId.length);
          const number = parseInt(restOfId);
          if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Helper function to check if an ordinal is a Rune Guardian
  const isRuneGuardian = (ordinal: any): boolean => {
    if (!ordinal) return false;
    
    // RUNE GUARDIAN PATRONEN - EXCLUSIEF voor Guardians
    const RUNE_GUARDIAN_PATTERNS = [
      { baseId: "05be581d96d4d4585e2add709ef755cbf89265c71bee73aba50d59698b7c34eci", maxIndex: 762 },
      { baseId: "1fa5efccb9fceba13bbad8938694c232b3f5e0879f5a5727e955630708af3837i", maxIndex: 816 },
      { baseId: "29b6279c5463995870916c67b469faaa965c144dc0c62d800772ac035e4b8d23i", maxIndex: 797 },
      { baseId: "3b8a1ec149ee27107e61e10e4f80773adee20c75f90fd1a59bd8b085f82c16a4i", maxIndex: 199 },
      { baseId: "5aecf723e6c56b5a735a0c58ddb9e3ca8c1d6495014d922a94f5d5a1b108023bi", maxIndex: 618 },
      { baseId: "5dd2a6d2b695f98a945c58bde8a45bfa5875b9be0aad8677a861ee4232641f3bi", maxIndex: 793 },
      { baseId: "632790ddb63bedcc7d54ae31701b5eb2a6dcfbdf0b417f83b401f11613f55eb1i", maxIndex: 725 },
      { baseId: "66441b434c7d55e83893af69b701e336dfe9f24174aeccc94e4a1cf82dd3cbcei", maxIndex: 849 },
      { baseId: "8671dafa22c8929887d43fc729cb8a6f739dbfe04830911bcdfa85711a8d7665i", maxIndex: 157 },
      { baseId: "8a4580ba4c6e4119380740b16f64411d45d6d863276a212bf1771fd42b0910b1i", maxIndex: 758 }
    ];
    
    // EXPLICIETE FLAG HEEFT HOOGSTE PRIORITEIT
    if (ordinal.isRuneGuardian === true) {
      return true;
    }
    
    // ID EXACTE MATCH HEEFT TWEEDE PRIORITEIT
    if (ordinal.id) {
      // Check op exacte match met een Rune Guardian patroon
      for (const pattern of RUNE_GUARDIAN_PATTERNS) {
        if (ordinal.id.startsWith(pattern.baseId)) {
          // Exacte match met base ID
          if (ordinal.id === pattern.baseId) {
            return true;
          }
          
          // Of match met index binnen bereik
          const restOfId = ordinal.id.substring(pattern.baseId.length);
          const number = parseInt(restOfId);
          if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Helper function to check if an ordinal is a Taproot Alpha
  const isTaprootAlpha = (ordinal: any): boolean => {
    if (!ordinal) return false;
    
    // TAPROOT ALPHA PATRONEN - EXCLUSIEF voor Taproot Alpha
    const TAPROOT_ALPHA_PATTERNS = [
      { baseId: "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di", maxIndex: 554 },
      { baseId: "5aecf723e6c56b5a735a0c58ddb9e3ca8c1d6495014d922a94f5d5a1b108023bi", maxIndex: 0 }
    ];
    
    // EXPLICIETE FLAG HEEFT HOOGSTE PRIORITEIT
    if (ordinal.isTaprootAlpha === true) {
      return true;
    }
    
    // ID EXACTE MATCH HEEFT TWEEDE PRIORITEIT
    if (ordinal.id) {
      // Check op exacte match met een Taproot Alpha patroon
      for (const pattern of TAPROOT_ALPHA_PATTERNS) {
        if (ordinal.id.startsWith(pattern.baseId)) {
          // Exacte match met base ID
          if (ordinal.id === pattern.baseId) {
            return true;
          }
          
          // Of match met index binnen bereik
          const restOfId = ordinal.id.substring(pattern.baseId.length);
          const number = parseInt(restOfId);
          if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Refresh data functie
  const refreshSigmaXData = () => {
    console.log("==== REFRESHING SIGMAX DATA ====");
    
    // Als er een externe refresh functie is meegegeven, roep die aan
    if (onRefresh) {
      console.log("Calling provided onRefresh function");
      onRefresh().then(() => {
        // Na het refreshen van de externe data, laad ook de lokale data opnieuw
        loadLocalStakedSigmaX();
      }).catch(error => {
        console.error("Error in onRefresh:", error);
      });
    } else {
      // Geen externe refresh functie, doe een lokale refresh
      loadSigmaXData();
      loadLocalStakedSigmaX();
    }
    
    // Additional logging to check what's available
    const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
    if (cachedTigers) {
      try {
        const parsedTigers = JSON.parse(cachedTigers);
        console.log(`Found ${parsedTigers.length} Bitcoin Tigers in cache during refresh`);
        
        // Analyze types with getOrdinalType
        const typeCounts = {
          'bitcoin-tiger': 0,
          'sigmax': 0,
          'rune-guardian': 0,
          'taproot-alpha': 0,
          'other': 0
        };
        
        parsedTigers.forEach((ordinal: any) => {
          const type = getOrdinalType(ordinal);
          typeCounts[type as keyof typeof typeCounts]++;
        });
        
        console.log("Tiger cache classification by getOrdinalType:", typeCounts);
      } catch (e) {
        console.error("Error checking Bitcoin Tigers cache:", e);
      }
    } else {
      console.log("No Bitcoin Tigers cache found during refresh");
    }
    
    // Check SigmaX cache as well
    const cachedSigmaX = localStorage.getItem(`sigmaX_${walletAddress}`);
    if (cachedSigmaX) {
      try {
        const parsedSigmaX = JSON.parse(cachedSigmaX);
        console.log(`Found ${parsedSigmaX.length} SigmaX ordinals in cache during refresh`);
        
        // Analyze types with getOrdinalType
        const typeCounts = {
          'bitcoin-tiger': 0,
          'sigmax': 0,
          'rune-guardian': 0,
          'taproot-alpha': 0,
          'other': 0
        };
        
        parsedSigmaX.forEach((ordinal: any) => {
          const type = getOrdinalType(ordinal);
          typeCounts[type as keyof typeof typeCounts]++;
        });
        
        console.log("SigmaX cache classification by getOrdinalType:", typeCounts);
      } catch (e) {
        console.error("Error checking SigmaX cache:", e);
      }
    } else {
      console.log("No SigmaX cache found during refresh");
    }
  };
  
  // Toggle selection of an ordinal
  const toggleSelectOrdinal = (sigmaXId: string) => {
    setSelectedOrdinals(prev => {
      if (prev.includes(sigmaXId)) {
        return prev.filter(id => id !== sigmaXId);
      } else {
        return [...prev, sigmaXId];
      }
    });
  };

  // Functie om een SigmaX te staken voor een missie
  const handleStakeSigmaX = async (sigmaXId: string, missionId: string) => {
    console.log(`SigmaX ${sigmaXId} staken voor missie ${missionId}`);
    
    if (!walletAddress) {
      console.error('No wallet address, cannot stake SigmaX');
      return { success: false, error: 'No wallet address provided' };
    }
    
    try {
      // Zoek eerst in userSigmaX
      let sigmaX = userSigmaX.find(s => s.id === sigmaXId);
      
      // Als niet gevonden in userSigmaX, zoek in de localStorage cache
      if (!sigmaX) {
        const cachedSigmaX = localStorage.getItem(`sigmaX_${walletAddress}`);
        if (cachedSigmaX) {
          const parsedSigmaX = JSON.parse(cachedSigmaX);
          sigmaX = parsedSigmaX.find((s: any) => s.id === sigmaXId);
          console.log('SigmaX gevonden in cache:', sigmaX);
        }
      }
      
      // Als nog steeds niet gevonden, kijk in bitcoinTigers cache (voor Tiger staking)
      if (!sigmaX) {
        const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
        if (cachedTigers) {
          const parsedTigers = JSON.parse(cachedTigers);
          sigmaX = parsedTigers.find((t: any) => t.id === sigmaXId);
          console.log('Bitcoin Tiger gevonden in cache:', sigmaX);
        }
      }
      
      if (!sigmaX) {
        console.error(`Cannot find SigmaX or Bitcoin Tiger with ID: ${sigmaXId}`);
        return { success: false, error: 'Ordinal not found in your wallet' };
      }
      
      console.log('Staking Ordinal:', sigmaX);
      
      // Initialize sigmaXStakingDB als het nog niet bestaat
      let sigmaXStakingDB = localStorage.getItem('sigmaXStakingDB');
      if (!sigmaXStakingDB) {
        sigmaXStakingDB = JSON.stringify({
          stakedSigmaX: {},
          chests: {},
          rewardHistory: []
        });
        localStorage.setItem('sigmaXStakingDB', sigmaXStakingDB);
      }
      
      // Parse de huidige sigmaXStakingDB
      const parsedDB = JSON.parse(localStorage.getItem('sigmaXStakingDB') || '{}');
      
      // Zorg ervoor dat de nodige structuren bestaan
      if (!parsedDB.stakedSigmaX) {
        parsedDB.stakedSigmaX = {};
      }
      
      if (!parsedDB.stakedSigmaX[walletAddress]) {
        parsedDB.stakedSigmaX[walletAddress] = {};
      }
      
      // Controleer of de SigmaX al gestaked is
      if (parsedDB.stakedSigmaX[walletAddress][sigmaXId]) {
        console.log(`Ordinal ${sigmaXId} is already staked, not staking again`);
        return { success: false, error: 'Ordinal is already staked' };
      }
      
      // Bepalen van het type ordinal
      const ordinalType = getOrdinalType(sigmaX);
      const isSigmaXOrdinal = ordinalType === 'sigmax';
      const isTigerOrdinal = ordinalType === 'bitcoin-tiger';
      
      // Voeg de ordinal toe aan de gestakede ordinals
      parsedDB.stakedSigmaX[walletAddress][sigmaXId] = {
        id: sigmaXId,
        name: sigmaX.name || (isSigmaXOrdinal ? `SigmaX #${sigmaXId.substring(0, 8)}` : 
                             isTigerOrdinal ? `Bitcoin Tiger #${sigmaXId.substring(0, 8)}` : 
                             `Ordinal #${sigmaXId.substring(0, 8)}`),
        image: sigmaX.image || (isSigmaXOrdinal ? '/sigmastone-logo.gif' : 
                              isTigerOrdinal ? '/tiger-pixel1.png' : 
                              '/ordinal-default.png'),
        isSigmaX: isSigmaXOrdinal,
        isTiger: isTigerOrdinal,
        stakedAt: Date.now(),
        nextChestAt: Date.now() + 10000, // 10 seconden voor testing
        missionId: missionId
      };
      
      // Update localStorage
      localStorage.setItem('sigmaXStakingDB', JSON.stringify(parsedDB));
      console.log(`Added ${isSigmaXOrdinal ? 'SigmaX' : isTigerOrdinal ? 'Bitcoin Tiger' : 'Ordinal'} ${sigmaXId} to staked ordinals for wallet ${walletAddress}`, parsedDB.stakedSigmaX[walletAddress][sigmaXId]);
      
      // Refresh local state
      loadLocalStakedSigmaX();
      
      return { success: true };
    } catch (error) {
      console.error('Error staking Ordinal:', error);
      return { success: false, error: `Error staking Ordinal: ${error}` };
    }
  };
  
  const handleUnstakeSigmaX = async (sigmaXId: string) => {
    console.log(`SigmaX ${sigmaXId} ontstaken`);
    
    if (!walletAddress) {
      console.error('No wallet address, cannot unstake SigmaX');
      return { success: false, error: 'No wallet address provided' };
    }
    
    try {
      // Parse de huidige sigmaXStakingDB
      const sigmaXStakingDB = localStorage.getItem('sigmaXStakingDB');
      if (!sigmaXStakingDB) {
        console.log('No staking database found, nothing to unstake');
        return { success: false, error: 'No staking database found' };
      }
      
      const parsedDB = JSON.parse(sigmaXStakingDB);
      
      // Controleer of er gestakede SigmaX zijn voor deze wallet
      if (!parsedDB.stakedSigmaX || !parsedDB.stakedSigmaX[walletAddress]) {
        console.log(`No staked SigmaX found for wallet ${walletAddress}`);
        return { success: false, error: 'No staked SigmaX found' };
      }
      
      // Controleer of deze SigmaX gestaked is
      if (!parsedDB.stakedSigmaX[walletAddress][sigmaXId]) {
        console.log(`SigmaX ${sigmaXId} is not staked, cannot unstake`);
        return { success: false, error: 'SigmaX is not staked' };
      }
      
      // Log de SigmaX die we unstaken
      const unstakingSigmaX = parsedDB.stakedSigmaX[walletAddress][sigmaXId];
      console.log('Unstaking SigmaX:', unstakingSigmaX);
      
      // Verwijder deze SigmaX uit de gestakede SigmaX
      delete parsedDB.stakedSigmaX[walletAddress][sigmaXId];
      
      // Update localStorage
      localStorage.setItem('sigmaXStakingDB', JSON.stringify(parsedDB));
      console.log(`Removed SigmaX ${sigmaXId} from staked SigmaX for wallet ${walletAddress}`);
      
      // Refresh local state
      loadLocalStakedSigmaX();
      
      return { success: true };
    } catch (error) {
      console.error('Error unstaking SigmaX:', error);
      return { success: false, error: `Error unstaking SigmaX: ${error}` };
    }
  };
  
  const handleClaimSigmaX = async (sigmaX: any, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (claimingInProgress) {
      console.log('Claiming already in progress, ignoring request');
      return;
    }
    
    const sigmaXId = sigmaX.id;
    console.log(`Attempting to claim reward from SigmaX ${sigmaXId}`);
    setClaimingInProgress(true);
    setClaimingSigmaXId(sigmaXId);
    
    try {
      const now = Date.now();
      const remainingTime = sigmaXTimers[sigmaXId] || 0;
      
      // Check if chest is ready to claim
      if (remainingTime > 0) {
        console.log(`SigmaX ${sigmaXId} is not ready for claiming. Remaining time: ${remainingTime}ms`);
        setMessage(`This SigmaX is not ready to claim yet. Please wait ${Math.ceil(remainingTime / 1000)} seconds.`);
        setMessageType('warning');
        setClaimingInProgress(false);
        setClaimingSigmaXId(null);
        return;
      }
      
      // Generate random reward amount
      const roll = Math.random() * 100;
      let rewardType;
      let rewardAmount;
      
      if (roll < REWARD_CONFIG.CHANCES.JACKPOT) {
        rewardType = "JACKPOT";
        rewardAmount = Math.floor(
          Math.random() * 
          (REWARD_CONFIG.AMOUNTS.JACKPOT.MAX - REWARD_CONFIG.AMOUNTS.JACKPOT.MIN + 1) + 
          REWARD_CONFIG.AMOUNTS.JACKPOT.MIN
        );
      } else if (roll < REWARD_CONFIG.CHANCES.JACKPOT + REWARD_CONFIG.CHANCES.HIGH_ROLL) {
        rewardType = "HIGH_ROLL";
        rewardAmount = Math.floor(
          Math.random() * 
          (REWARD_CONFIG.AMOUNTS.HIGH_ROLL.MAX - REWARD_CONFIG.AMOUNTS.HIGH_ROLL.MIN + 1) + 
          REWARD_CONFIG.AMOUNTS.HIGH_ROLL.MIN
        );
      } else {
        rewardType = "LOW_ROLL";
        rewardAmount = Math.floor(
          Math.random() * 
          (REWARD_CONFIG.AMOUNTS.LOW_ROLL.MAX - REWARD_CONFIG.AMOUNTS.LOW_ROLL.MIN + 1) + 
          REWARD_CONFIG.AMOUNTS.LOW_ROLL.MIN
        );
      }
      
      console.log(`Calculated reward: ${rewardAmount} sats (${rewardType})`);
      
      // Update localStorage first to prevent race conditions
      try {
        const sigmaXStakingData = localStorage.getItem('sigmaXStakingDB');
        if (sigmaXStakingData) {
          const parsedData = JSON.parse(sigmaXStakingData);
          
          if (parsedData.stakedSigmaX && parsedData.stakedSigmaX[walletAddress]) {
            const walletStakedSigmaX = parsedData.stakedSigmaX[walletAddress];
            
            // Remove the claimed SigmaX
            delete walletStakedSigmaX[sigmaXId];
            
            // Add to reward history
            if (!parsedData.rewardHistory) {
              parsedData.rewardHistory = [];
            }
            
            parsedData.rewardHistory.push({
              id: `claim-${Date.now()}-${sigmaXId}`,
              sigmaXId,
              walletAddress,
              amount: rewardAmount,
              type: rewardType,
              timestamp: Date.now()
            });
            
            // Update localStorage immediately
            localStorage.setItem('sigmaXStakingDB', JSON.stringify(parsedData));
            console.log(`Removed SigmaX ${sigmaXId} from staking DB and added to reward history`);
          }
        }
      } catch (error) {
        console.error('Error updating SigmaX staking data:', error);
      }
      
      // Update local state immediately to remove the SigmaX from UI
      setLocalStakedSigmaX(prev => prev.filter(s => s.id !== sigmaXId));
      
      // Update Lightning balance if available
      if (setBalance) {
        const currentBalance = balance || 0;
        const newBalance = currentBalance + rewardAmount;
        setBalance(newBalance);
      }
      
      // Show the claim animation
      setClaimedReward(rewardAmount);
      setShowClaim(true);
      
      // Reset claim state after animation
      setTimeout(() => {
        setShowClaim(false);
        setClaimingInProgress(false);
        setClaimingSigmaXId(null);
        setMessage(`Claimed ${rewardAmount} sats from your SigmaX!`);
        setMessageType('success');
      }, 3000);
      
      return { success: true, reward: rewardAmount };
    } catch (error) {
      console.error('Error claiming from SigmaX:', error);
      setClaimingInProgress(false);
      setClaimingSigmaXId(null);
      setMessage(`Error claiming from SigmaX: ${error}`);
      setMessageType('error');
      return { success: false, error: `Error claiming from SigmaX: ${error}` };
    }
  };
  
  const startSigmaXMission = async () => {
    // Reset message
    setMessage("");
    
    // Log selected ordinals for debugging
    console.log("[MISSION DEBUG] Starting mission with selected ordinals:", selectedOrdinals);
    
    if (selectedOrdinals.length < 2) {
      setMessage("Select at least one Bitcoin Tiger and one SigmaX to start a mission");
      setMessageType('warning');
      return;
    }
    
    // Check if we have at least one Tiger and one SigmaX
    const selectedOrdinalObjects = userSigmaX.filter(ordinal => selectedOrdinals.includes(ordinal.id));
    console.log("[MISSION DEBUG] Selected ordinal objects:", selectedOrdinalObjects);
    
    // Add more detailed logging for proper classification
    const ordinalClassification = selectedOrdinalObjects.map(ordinal => ({
      id: ordinal.id, 
      name: ordinal.name, 
      type: getOrdinalType(ordinal)
    }));
    console.log("[MISSION DEBUG] Ordinal classification:", ordinalClassification);
    
    const hasTiger = selectedOrdinalObjects.some(ordinal => getOrdinalType(ordinal) === 'bitcoin-tiger');
    const hasSigmaX = selectedOrdinalObjects.some(ordinal => getOrdinalType(ordinal) === 'sigmax');
    
    console.log("[MISSION DEBUG] Has tiger:", hasTiger);
    console.log("[MISSION DEBUG] Has SigmaX:", hasSigmaX);
    
    if (!hasTiger || !hasSigmaX) {
      const message = `Je hebt minimaal 1 Bitcoin Tiger EN 1 SigmaX nodig voor een missie. 
        Geselecteerd: ${hasTiger ? '✓' : '✗'} Bitcoin Tiger, ${hasSigmaX ? '✓' : '✗'} SigmaX`;
      setMessage(message);
      setMessageType('warning');
      return;
    }
    
    // Show immediate feedback to user
    setMessage("📝 Missie wordt gestart, even geduld...");
    setMessageType('');
    setIsLoading(true);
    
    try {
      // Call the actual staking function for each selected ordinal individually
      let stakingSuccessCount = 0;
      let tigerCount = 0;
      let sigmaXCount = 0;
      
      for (const ordinalId of selectedOrdinals) {
        try {
          console.log(`[MISSION DEBUG] Calling handleStakeSigmaX for Ordinal ID: ${ordinalId}`);
          
          // Direct call to the staking functionality
          const result = await handleStakeSigmaX(ordinalId, 'sigmax-tiger-mission');
          console.log(`[MISSION DEBUG] Staking result for ${ordinalId}:`, result);
          
          if (result.success) {
            stakingSuccessCount++;
            const ordinal = selectedOrdinalObjects.find(o => o.id === ordinalId);
            if (ordinal) {
              const ordinalType = getOrdinalType(ordinal);
              if (ordinalType === 'sigmax') {
                sigmaXCount++;
              } else if (ordinalType === 'bitcoin-tiger') {
                tigerCount++;
              }
            }
          }
        } catch (err) {
          console.error(`[MISSION ERROR] Failed to stake Ordinal ${ordinalId}:`, err);
        }
      }
      
      // Update UI with success message based on staking results
      if (stakingSuccessCount === selectedOrdinals.length) {
        setMessage(`✅ Mission started successfully! ${tigerCount} Tigers and ${sigmaXCount} SigmaX have been staked.`);
        setMessageType('success');
      } else if (stakingSuccessCount > 0) {
        setMessage(`⚠️ Mission partially started. ${stakingSuccessCount} of ${selectedOrdinals.length} ordinals have been staked.`);
        setMessageType('warning');
      } else {
        throw new Error("None of the ordinals could be staked");
      }
      
      // Clear selection
      setSelectedOrdinals([]);
      
      // Update active mission data with new values
      setActiveMissionData(prev => ({
        ...prev,
        activeTigers: prev.activeTigers + tigerCount,
        activeSigmaX: prev.activeSigmaX + sigmaXCount,
        totalPower: prev.totalPower + (stakingSuccessCount * 420),
        estimatedRewards: prev.estimatedRewards + (stakingSuccessCount * 100)
      }));
      
      // BELANGRIJK: Laad lokale opgeslagen ordinals na de staking operatie
      loadLocalStakedSigmaX();
    } catch (error) {
      console.error('[MISSION ERROR] Error starting SigmaX mission:', error);
      setMessage(`Error starting mission: ${error}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functie die één type aan een ordinal toekent op basis van prioriteit
  // Zorgt ervoor dat een ordinal slechts in één categorie valt
  const getOrdinalType = (ordinal: any): 'bitcoin-tiger' | 'sigmax' | 'rune-guardian' | 'taproot-alpha' | 'other' => {
    if (!ordinal) return 'other';
    
    // Debug logging om alle ordinaltypes te traceren
    console.log(`Determining type for ordinal: ${ordinal.id}, name: ${ordinal.name || 'unnamed'}, flags:`, {
      isSigmaX: ordinal.isSigmaX,
      isBitcoinTiger: ordinal.isBitcoinTiger,
      isRuneGuardian: ordinal.isRuneGuardian,
      isTaprootAlpha: ordinal.isTaprootAlpha
    });
    
    // EXPLICIETE EXCLUSIE VOOR BITCOIN TIGERS EN TAPROOT ALPHA DIE ALS SIGMAX ZIJN GEMARKEERD
    if (ordinal.id) {
      // Taproot Alpha patterns
      if (ordinal.id.startsWith("47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di")) {
        console.log(`${ordinal.id} is een Taproot Alpha, GEEN SigmaX ongeacht andere flags`);
        return 'taproot-alpha';
      }
      
      // Bitcoin Tiger patterns
      const BITCOIN_TIGER_PATTERNS = [
        "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei",
        "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i",
        "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi",
        "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i"
      ];
      
      if (BITCOIN_TIGER_PATTERNS.some(pattern => ordinal.id.startsWith(pattern))) {
        console.log(`${ordinal.id} is een Bitcoin Tiger, GEEN SigmaX ongeacht andere flags`);
        return 'bitcoin-tiger';
      }
    }
    
    // Expliciete flags hebben hoogste prioriteit
    if (ordinal.isSigmaX === true) {
      console.log(`Ordinal ${ordinal.id} identified as SigmaX via explicit flag`);
      return 'sigmax';
    }
    if (ordinal.isBitcoinTiger === true) return 'bitcoin-tiger';
    if (ordinal.isRuneGuardian === true) return 'rune-guardian';
    if (ordinal.isTaprootAlpha === true) return 'taproot-alpha';
    
    // Naam en collectie checks hebben tweede prioriteit
    // We checken eerst naam/collectie omdat die vaak betrouwbaarder zijn dan ID checks
    const nameIncludes = (term: string) => 
      ordinal.name && ordinal.name.toLowerCase().includes(term);
    
    const collectionIncludes = (term: string) => 
      ordinal.collection && ordinal.collection.toLowerCase().includes(term);
    
    // SigmaX naam/collectie check
    if ((nameIncludes('sigmax') || collectionIncludes('sigmax'))) {
      console.log(`Ordinal ${ordinal.id} identified as SigmaX via name/collection match`);
      return 'sigmax';
    }
    
    // Bitcoin Tiger naam/collectie check
    if ((nameIncludes('bitcoin tiger') || (nameIncludes('tiger') && !nameIncludes('sigmax'))) && 
        (collectionIncludes('bitcoin tiger') || (collectionIncludes('tiger') && !collectionIncludes('sigmax')))) {
      return 'bitcoin-tiger';
    }
    
    // Rune Guardian naam/collectie check
    if ((nameIncludes('guardian') || nameIncludes('rune')) && 
        (collectionIncludes('guardian') || collectionIncludes('rune'))) {
      return 'rune-guardian';
    }
    
    // Taproot Alpha naam/collectie check
    if (nameIncludes('taproot') && collectionIncludes('taproot')) {
      return 'taproot-alpha';
    }
    
    // ID pattern checks hebben derde prioriteit
    if (ordinal.id) {
      // SigmaX ID check
      const SIGMAX_PATTERNS = [
        { baseId: "bbcc29a118a2c5cc7cdd81c95fef1c6c8036d07db4437f1058532878249ac5eci", maxIndex: 419 },
        { baseId: "821ac77016796c87ea27a1e1e481b5f5285a59c61136ef069dea3f2a9d010655i", maxIndex: 454 },
        { baseId: "d34fdb58e4c3135405d246cdd3c533cf7b27b80c9608264d1107cf5a6620fe5fi", maxIndex: 212 },
        { baseId: "22404dc9cca8a8b70a5f26af0c0ff616cb64a00ab330429e2b7e2a54e067850ci", maxIndex: 496 },
        { baseId: "71015e503da1c7072fe365a9846554d77eba9d9a7afcc105d8ac535aa77bffbci", maxIndex: 489 },
        { baseId: "aba050b80c5090ae96eddad10f827a17ac47093d1577c680bf34054f9e210f59i", maxIndex: 494 },
        { baseId: "26ed1f845b6ffec8aa137f732acf97bd3c2f5320e85fbcd3c54da19f46d34ff2i", maxIndex: 494 },
        { baseId: "eefe4543561b5fb6d5d4e333759e71e459e1511d24b3ed49ca1944363f375387i", maxIndex: 484 },
        { baseId: "b87ad1a3247881cebb95317c5c16a3238a3e779e6e78c468d2c34c3f79706bdci", maxIndex: 309 },
        { baseId: "14af407b187d3236962d82540d571d3a077dfddd2eacb71ba40d130ad9a5662bi", maxIndex: 351 },
        { baseId: "bce132567ecd98e57b7fce8edcda8922c23d171f7a18789899655fec4144efaci", maxIndex: 351 },
        { baseId: "1bfd611bd7a74c098e40f81ee975fefec715366995b81ee1d5a5402d564c23f3i", maxIndex: 300 },
        { baseId: "bbe382a6fb1c118046edb4c416abb863b64fb0818ce6cc60d46c4f7e3dd64339i", maxIndex: 191 },
        { baseId: "6be540ae9f5f3d1df9f646f1fcb6d1e366844ba4e081a4d677f2312f75550314i", maxIndex: 171 },
        { baseId: "a4d66331fd73aa8b314a8476cffea5fbc487001a1e83565251336ff633e6b639i", maxIndex: 214 },
        { baseId: "ba97d6ed09595ca621095f87e1dcebd05c3a279d0c70e2b5f20ca6a8b2d445c9i", maxIndex: 110 }
      ];
      
      // Check SigmaX ID patterns
      for (const pattern of SIGMAX_PATTERNS) {
        if (ordinal.id.startsWith(pattern.baseId)) {
          const restOfId = ordinal.id.substring(pattern.baseId.length);
          // Exacte match met base ID
          if (restOfId === '') {
            console.log(`Ordinal ${ordinal.id} identified as SigmaX via exact ID match with pattern ${pattern.baseId}`);
            return 'sigmax';
          }
          // Of match met index binnen bereik
          const number = parseInt(restOfId);
          if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
            console.log(`Ordinal ${ordinal.id} identified as SigmaX via ID pattern match with ${pattern.baseId} and index ${number}`);
            return 'sigmax';
          }
        }
      }
      
      // Bitcoin Tigers ID check
      const BITCOIN_TIGER_PATTERNS = [
        { baseId: "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei", maxIndex: 292 },
        { baseId: "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i", maxIndex: 293 },
        { baseId: "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi", maxIndex: 293 },
        { baseId: "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i", maxIndex: 117 }
      ];
      
      for (const pattern of BITCOIN_TIGER_PATTERNS) {
        if (ordinal.id.startsWith(pattern.baseId)) {
          const restOfId = ordinal.id.substring(pattern.baseId.length);
          // Exacte match met base ID
          if (restOfId === '') {
            return 'bitcoin-tiger';
          }
          // Of match met index binnen bereik
          const number = parseInt(restOfId);
          if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
            return 'bitcoin-tiger';
          }
        }
      }
      
      // Rune Guardians ID check
      const RUNE_GUARDIAN_PATTERNS = [
        { baseId: "05be581d96d4d4585e2add709ef755cbf89265c71bee73aba50d59698b7c34eci", maxIndex: 762 },
        { baseId: "1fa5efccb9fceba13bbad8938694c232b3f5e0879f5a5727e955630708af3837i", maxIndex: 816 },
        { baseId: "29b6279c5463995870916c67b469faaa965c144dc0c62d800772ac035e4b8d23i", maxIndex: 797 },
        { baseId: "3b8a1ec149ee27107e61e10e4f80773adee20c75f90fd1a59bd8b085f82c16a4i", maxIndex: 199 },
        { baseId: "5aecf723e6c56b5a735a0c58ddb9e3ca8c1d6495014d922a94f5d5a1b108023bi", maxIndex: 618 },
        { baseId: "5dd2a6d2b695f98a945c58bde8a45bfa5875b9be0aad8677a861ee4232641f3bi", maxIndex: 793 },
        { baseId: "632790ddb63bedcc7d54ae31701b5eb2a6dcfbdf0b417f83b401f11613f55eb1i", maxIndex: 725 },
        { baseId: "66441b434c7d55e83893af69b701e336dfe9f24174aeccc94e4a1cf82dd3cbcei", maxIndex: 849 },
        { baseId: "8671dafa22c8929887d43fc729cb8a6f739dbfe04830911bcdfa85711a8d7665i", maxIndex: 157 },
        { baseId: "8a4580ba4c6e4119380740b16f64411d45d6d863276a212bf1771fd42b0910b1i", maxIndex: 758 }
      ];
      
      for (const pattern of RUNE_GUARDIAN_PATTERNS) {
        if (ordinal.id.startsWith(pattern.baseId)) {
          const restOfId = ordinal.id.substring(pattern.baseId.length);
          // Exacte match met base ID
          if (restOfId === '') {
            return 'rune-guardian';
          }
          // Of match met index binnen bereik
          const number = parseInt(restOfId);
          if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
            return 'rune-guardian';
          }
        }
      }
      
      // Taproot Alpha ID check
      const TAPROOT_ALPHA_PATTERNS = [
        { baseId: "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di", maxIndex: 554 },
        { baseId: "5aecf723e6c56b5a735a0c58ddb9e3ca8c1d6495014d922a94f5d5a1b108023bi", maxIndex: 0 }
      ];
      
      for (const pattern of TAPROOT_ALPHA_PATTERNS) {
        if (ordinal.id.startsWith(pattern.baseId)) {
          const restOfId = ordinal.id.substring(pattern.baseId.length);
          // Exacte match met base ID
          if (restOfId === '') {
            return 'taproot-alpha';
          }
          // Of match met index binnen bereik
          const number = parseInt(restOfId);
          if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
            return 'taproot-alpha';
          }
        }
      }
    }
    
    // Als geen specifieke match is gevonden
    return 'other';
  };

  return (
    <div className="ordinal-sigmax-missions" style={{ paddingTop: mobilePadding }}>
      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading Ordinal SigmaX...</p>
        </div>
      ) : (
        <>
          {/* Mission Description Container */}
          <div className="missions-description-container">
            <h2 className="missions-title">Ordinal SigmaX Missions</h2>
            <p className="missions-description">
              Stake your Ordinal SigmaX to earn rewards in special missions. Each staked SigmaX earns you satoshi chests!
            </p>
            
            <div className="status-message">
              SigmaX Missions are now available! Stake your SigmaX to earn satoshis.
            </div>
          </div>
          
          {/* Banner Section */}
          <div className="mission-banner">
            <Image 
              src={bannerImage}
              alt="Ordinal SigmaX Missions"
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
                {/* Geen titel in de banner */}
              </div>
              
              <div className="mission-stats">
                <div className="countdown-container">
                  <div className="countdown-item">
                    <span className="countdown-value">{countdownDays}</span>
                    <span className="countdown-label">DAYS</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-value">{countdownHours}</span>
                    <span className="countdown-label">HOURS</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-value">{countdownMins}</span>
                    <span className="countdown-label">MIN</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-value">{countdownSecs}</span>
                    <span className="countdown-label">SEC</span>
                  </div>
                </div>
                
                <div className="active-stats">
                  <div className="stat-item">
                    <span className="stat-label">Active Tigers</span>
                    <span className="stat-value">{activeMissionData.activeTigers}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Active SigmaX</span>
                    <span className="stat-value">{activeMissionData.activeSigmaX}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rewards Section */}
          <div className="rewards-section">
            <div className="rewards-container">
              <h3>Mission Rewards</h3>
              
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
                    <h4>TIGER REWARDS</h4>
                    <p>Successful Staking</p>
                    <span className="reward-amount">1 Chest with Satoshis</span>
                  </div>
                </div>
                
                <div className="reward-card">
                  <div className="reward-icon">
                    <Image 
                      src="/sigmastone-logo.gif"
                      alt="SigmaX"
                      width={90}
                      height={90}
                      unoptimized={true}
                      style={{
                        border: '2px solid rgba(74, 134, 232, 0.7)',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(74, 134, 232, 0.1)',
                        boxShadow: '0 0 10px rgba(74, 134, 232, 0.5)'
                      }}
                    />
                  </div>
                  <div className="reward-info">
                    <h4>SIGMAX BONUS</h4>
                    <p>Successful Staking</p>
                    <span className="reward-amount">1 Chest with Satoshis</span>
                  </div>
                </div>
              </div>
              
              <div className="mission-note">
                <p>Both a Bitcoin Tiger and a SigmaX must be staked together to qualify for rewards</p>
                <p>Total per mission: 2 Chests with BTC (satoshis)</p>
              </div>
            </div>
          </div>
          
          {/* SigmaX Staking Interface */}
          <div className="staking-interface">
            <div className="staking-columns">
              {/* Column 1: Available Ordinals */}
              <div className="staking-column">
                <h3>Your Ordinals</h3>
                <div className="ordinals-section">
                  <h4>Bitcoin Tigers ({userSigmaX.filter(ordinal => getOrdinalType(ordinal) === 'bitcoin-tiger' && !(ordinal.id && ordinal.id.includes('8535700'))).length})</h4>
                  <div className="ordinals-grid">
                    {userSigmaX.filter(ordinal => getOrdinalType(ordinal) === 'bitcoin-tiger' && !(ordinal.id && ordinal.id.includes('8535700'))).length > 0 ? (
                      userSigmaX.filter(ordinal => getOrdinalType(ordinal) === 'bitcoin-tiger' && !(ordinal.id && ordinal.id.includes('8535700'))).map((tiger) => (
                        <div 
                          key={tiger.id} 
                          className={`ordinal-card ${selectedOrdinals.includes(tiger.id) ? 'selected' : ''}`}
                          onClick={() => toggleSelectOrdinal(tiger.id)}
                        >
                          <div className="ordinal-image-container">
                            <Image
                              src={tiger.image || '/tiger-pixel1.png'}
                              alt={tiger.name || 'Bitcoin Tiger'}
                              width={120}
                              height={120}
                              unoptimized={true}
                              className="ordinal-image"
                            />
                            {selectedOrdinals.includes(tiger.id) && (
                              <div className="selected-overlay">
                                <span>✓</span>
                              </div>
                            )}
                          </div>
                          <div className="ordinal-info">
                            <h4 className="smaller-text">{tiger.name || `Bitcoin Tiger #${tiger.id.substring(0, 8)}`}</h4>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-ordinals-message">
                        <p>No Bitcoin Tigers found in your wallet</p>
                      </div>
                    )}
                  </div>
                  
                  <h4>SigmaX Ordinals ({userSigmaX.filter(ordinal => getOrdinalType(ordinal) === 'sigmax').length})</h4>
                  <div className="ordinals-grid">
                    {userSigmaX.filter(ordinal => {
                      // Alleen SigmaX ordinals tonen, expliciet filteren op type
                      const type = getOrdinalType(ordinal);
                      const isTrueSigmaX = type === 'sigmax';
                      
                      // Debug logging om te zien welke ordinals worden gefilterd
                      if (!isTrueSigmaX) {
                        console.log(`Filtering out non-SigmaX ordinal: ${ordinal.id}, type: ${type}`);
                      }
                      
                      // Verwijder expliciet alle Bitcoin Tigers en Taproot Alpha ordinals
                      if (ordinal.isBitcoinTiger === true || ordinal.isTaprootAlpha === true) {
                        console.log(`Explicitly filtering out Bitcoin Tiger or Taproot Alpha: ${ordinal.id}`);
                        return false;
                      }
                      
                      return isTrueSigmaX;
                    }).length > 0 ? (
                      userSigmaX.filter(ordinal => getOrdinalType(ordinal) === 'sigmax' && 
                                      ordinal.isBitcoinTiger !== true && 
                                      ordinal.isTaprootAlpha !== true)
                      .map((sigmaX) => (
                        <div 
                          key={sigmaX.id} 
                          className={`ordinal-card ${selectedOrdinals.includes(sigmaX.id) ? 'selected' : ''}`}
                          onClick={() => toggleSelectOrdinal(sigmaX.id)}
                        >
                          <div className="ordinal-image-container">
                            <Image
                              src={sigmaX.image || '/sigmastone-logo.gif'}
                              alt={sigmaX.name || 'SigmaX'}
                              width={120}
                              height={120}
                              unoptimized={true}
                              className="ordinal-image"
                            />
                            {selectedOrdinals.includes(sigmaX.id) && (
                              <div className="selected-overlay">
                                <span>✓</span>
                              </div>
                            )}
                          </div>
                          <div className="ordinal-info">
                            <h4>{sigmaX.name || `SigmaX #${sigmaX.id.substring(0, 8)}`}</h4>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-ordinals-message">
                        <p>No SigmaX ordinals found in your wallet</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mission-controls">
                  <div className="selection-summary">
                    <h4>Selected for Mission: {selectedOrdinals.length} ordinals</h4>
                    <div className="selected-info">
                      <p>Bitcoin Tigers: {userSigmaX.filter(t => selectedOrdinals.includes(t.id) && getOrdinalType(t) === 'bitcoin-tiger').length}</p>
                      <p>SigmaX Ordinals: {userSigmaX.filter(t => selectedOrdinals.includes(t.id) && getOrdinalType(t) === 'sigmax').length}</p>
                    </div>
                  </div>
                  
                  {/* Debug knop voor ontwikkelaars */}
                  <button 
                    className="debug-button" 
                    onClick={() => {
                      // Toon classificatie info voor alle ordinals
                      console.log("==== ORDINAL CLASSIFICATIE DEBUG ====");
                      
                      // Toon eerst de counts
                      const bitcoinTigerCount = userSigmaX.filter(o => getOrdinalType(o) === 'bitcoin-tiger').length;
                      const sigmaXCount = userSigmaX.filter(o => getOrdinalType(o) === 'sigmax').length;
                      const runeGuardianCount = userSigmaX.filter(o => getOrdinalType(o) === 'rune-guardian').length;
                      const taprootAlphaCount = userSigmaX.filter(o => getOrdinalType(o) === 'taproot-alpha').length;
                      const otherCount = userSigmaX.filter(o => getOrdinalType(o) === 'other').length;
                      
                      console.log(`Ordinal counts by type:`);
                      console.log(`- Bitcoin Tigers: ${bitcoinTigerCount}`);
                      console.log(`- SigmaX: ${sigmaXCount}`);
                      console.log(`- Rune Guardians: ${runeGuardianCount}`);
                      console.log(`- Taproot Alpha: ${taprootAlphaCount}`);
                      console.log(`- Other: ${otherCount}`);
                      console.log(`- Total: ${userSigmaX.length}`);
                      console.log(`----------------------------------------`);
                      
                      // Dan toon de details per ordinal
                      userSigmaX.forEach(ordinal => {
                        const ordinalType = getOrdinalType(ordinal);
                        console.log(`Ordinal ID: ${ordinal.id}, Name: ${ordinal.name || 'Unnamed'}`);
                        console.log(`  Eindresultaat: ${ordinalType}`);
                        
                        // Log het patroon dat een match was
                        if (ordinal.id) {
                          // Check SigmaX patterns
                          const sigmaXPatterns = [
                            { baseId: "bbcc29a118a2c5cc7cdd81c95fef1c6c8036d07db4437f1058532878249ac5eci", maxIndex: 419, series: "sigmax-1" },
                            { baseId: "821ac77016796c87ea27a1e1e481b5f5285a59c61136ef069dea3f2a9d010655i", maxIndex: 454, series: "sigmax-2" },
                            { baseId: "d34fdb58e4c3135405d246cdd3c533cf7b27b80c9608264d1107cf5a6620fe5fi", maxIndex: 212, series: "sigmax-3" },
                            { baseId: "22404dc9cca8a8b70a5f26af0c0ff616cb64a00ab330429e2b7e2a54e067850ci", maxIndex: 496, series: "sigmax-4" },
                            { baseId: "71015e503da1c7072fe365a9846554d77eba9d9a7afcc105d8ac535aa77bffbci", maxIndex: 489, series: "sigmax-5" },
                            { baseId: "aba050b80c5090ae96eddad10f827a17ac47093d1577c680bf34054f9e210f59i", maxIndex: 494, series: "sigmax-6" },
                            { baseId: "26ed1f845b6ffec8aa137f732acf97bd3c2f5320e85fbcd3c54da19f46d34ff2i", maxIndex: 494, series: "sigmax-7" },
                            { baseId: "eefe4543561b5fb6d5d4e333759e71e459e1511d24b3ed49ca1944363f375387i", maxIndex: 484, series: "sigmax-8" }
                          ];
                          
                          for (const pattern of sigmaXPatterns) {
                            if (ordinal.id.startsWith(pattern.baseId)) {
                              console.log(`    > Matches SigmaX pattern: ${pattern.baseId} (${pattern.series})`);
                            }
                          }
                          
                          // Check Bitcoin Tiger patterns
                          const bitcoinTigerPatterns = [
                            { baseId: "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei", maxIndex: 292, series: 1 },
                            { baseId: "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i", maxIndex: 293, series: 2 },
                            { baseId: "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi", maxIndex: 293, series: 3 },
                            { baseId: "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i", maxIndex: 117, series: 4 }
                          ];
                          
                          for (const pattern of bitcoinTigerPatterns) {
                            if (ordinal.id.startsWith(pattern.baseId)) {
                              console.log(`    > Matches Bitcoin Tiger pattern: ${pattern.baseId} (Series ${pattern.series})`);
                            }
                          }
                          
                          // Check Taproot Alpha patterns
                          const taprootAlphaPatterns = [
                            { baseId: "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di", maxIndex: 554, series: "taproot-alpha" }
                          ];
                          
                          for (const pattern of taprootAlphaPatterns) {
                            if (ordinal.id.startsWith(pattern.baseId)) {
                              console.log(`    > Matches Taproot Alpha pattern: ${pattern.baseId} (Series ${pattern.series})`);
                            }
                          }
                        }
                        
                        console.log("----------------------------------------");
                      });
                    }}
                  >
                    Debug Ordinals
                  </button>
                  
                  <button 
                    className="debug-button" 
                    onClick={() => {
                      // Debug LocalStorage cache
                      console.log("==== LOCALSTORAGE DEBUG ====");
                      
                      // SigmaX cache
                      const cachedSigmaX = localStorage.getItem(`sigmaX_${walletAddress}`);
                      if (cachedSigmaX) {
                        try {
                          const parsedSigmaX = JSON.parse(cachedSigmaX);
                          console.log(`SigmaX cache (${parsedSigmaX.length} items):`, parsedSigmaX);
                        } catch (e) {
                          console.error("Error parsing SigmaX cache:", e);
                        }
                      } else {
                        console.log("No SigmaX cache found");
                      }
                      
                      // Bitcoin Tigers cache
                      const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
                      if (cachedTigers) {
                        try {
                          const parsedTigers = JSON.parse(cachedTigers);
                          console.log(`Bitcoin Tigers cache (${parsedTigers.length} items):`, parsedTigers);
                        } catch (e) {
                          console.error("Error parsing Bitcoin Tigers cache:", e);
                        }
                      } else {
                        console.log("No Bitcoin Tigers cache found");
                      }
                    }}
                  >
                    Debug Cache
                  </button>
                  
                  <button 
                    className="debug-button" 
                    onClick={() => {
                      // Wis de cache en ververs
                      localStorage.removeItem(`sigmaX_${walletAddress}`);
                      localStorage.removeItem(`bitcoinTigers_${walletAddress}`);
                      console.log("Cache gewist!");
                      
                      // Refresh data
                      setTimeout(() => {
                        refreshSigmaXData();
                        setMessage("Cache gewist en data vernieuwd");
                        setMessageType('info');
                      }, 100);
                    }}
                  >
                    Wis Cache
                  </button>
                  
                  <button 
                    className="stake-button" 
                    onClick={startSigmaXMission}
                    disabled={selectedOrdinals.length < 2 || 
                             !userSigmaX.some(t => selectedOrdinals.includes(t.id) && getOrdinalType(t) === 'bitcoin-tiger') || 
                             !userSigmaX.some(t => selectedOrdinals.includes(t.id) && getOrdinalType(t) === 'sigmax')}
                  >
                    Start SigmaX Mission
                  </button>
                </div>
              </div>
              
              {/* Column 2: Staked Ordinals */}
              <div className="staking-column">
                <h3>Currently On Mission</h3>
                <div className="ordinals-grid staked-grid">
                  {localStakedSigmaX.length > 0 ? (
                    localStakedSigmaX.map((ordinal) => {
                      const remainingTime = sigmaXTimers[ordinal.id] || 0;
                      const isReady = remainingTime <= 0;
                      const seconds = Math.floor(remainingTime / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      
                      const displayTime = hours > 0 
                        ? `${hours}h ${minutes % 60}m` 
                        : minutes > 0 
                          ? `${minutes}m ${seconds % 60}s` 
                          : `${seconds}s`;
                      
                      return (
                        <div key={ordinal.id} className="staked-card">
                          <div className="staked-image-container">
                            <Image
                              src={ordinal.image || (ordinal.isSigmaX ? '/sigmastone-logo.gif' : '/tiger-pixel1.png')}
                              alt={ordinal.name || (ordinal.isSigmaX ? 'SigmaX' : 'Bitcoin Tiger')}
                              width={120}
                              height={120}
                              unoptimized={true}
                              className={`staked-image ${isReady ? 'ready-to-claim' : ''}`}
                            />
                            {isReady ? (
                              <div className="claim-overlay">
                                <button 
                                  className="claim-button"
                                  onClick={(e) => handleClaimSigmaX(ordinal, e)}
                                  disabled={claimingInProgress && claimingSigmaXId === ordinal.id}
                                >
                                  {claimingInProgress && claimingSigmaXId === ordinal.id ? 'Claiming...' : 'Claim Reward'}
                                </button>
                              </div>
                            ) : (
                              <div className="time-overlay">
                                <span>{displayTime}</span>
                              </div>
                            )}
                          </div>
                          <div className="staked-info">
                            <h4>{ordinal.name || (ordinal.isSigmaX ? `SigmaX #${ordinal.id.substring(0, 8)}` : `Bitcoin Tiger #${ordinal.id.substring(0, 8)}`)}</h4>
                            <div className="mission-badge">{ordinal.isSigmaX ? 'SigmaX' : 'Tiger'}</div>
                            <div className="unstake-button-container">
                              <button 
                                className="unstake-button"
                                onClick={() => handleUnstakeSigmaX(ordinal.id)}
                                disabled={claimingInProgress}
                              >
                                Unstake
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-ordinals-message">
                      <p>No staked ordinals found</p>
                      <p>Select Bitcoin Tigers and SigmaX from the left and start a mission</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Claim Animation */}
          {showClaim && (
            <div className="claim-animation">
              <div className="claim-container">
                <div className="chest-animation">
                  <Image 
                    src="/chest-open.gif" 
                    alt="Treasure Chest" 
                    width={200} 
                    height={200}
                    unoptimized={true}
                  />
                </div>
                <div className="reward-animation">
                  <h3>REWARD CLAIMED!</h3>
                  <p className="reward-amount">{claimedReward} sats</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Instruction Banner */}
          <div className="instruction-banner">
            <h3>How Staking Works</h3>
            <ol className="instruction-steps">
              <li>Select at least 1 Bitcoin Tiger and 1 SigmaX ordinal</li>
              <li>Click "Start SigmaX Mission" to stake them together</li>
              <li>Your staked ordinals will automatically earn rewards</li>
              <li>When the timer reaches zero, claim your satoshi rewards</li>
              <li>Unstake at any time, but you'll forfeit pending rewards</li>
            </ol>
          </div>
        </>
      )}
      
      {/* Message display */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <style jsx>{`
        .ordinal-sigmax-missions {
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
          overflow: hidden;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          border: 1px solid #4a86e8;
          margin: 2rem;
          padding: 2rem;
          width: 80%;
          max-width: 500px;
        }
        
        .loading-spinner {
          border: 5px solid #171a2d;
          border-radius: 50%;
          border-top: 5px solid #4a86e8;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Styling voor de missie beschrijving container */
        .missions-description-container {
          background: rgba(13, 7, 25, 0.5);
          border: 1px solid rgba(74, 134, 232, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem auto;
          width: 100%;
          max-width: 1200px;
        }
        
        .missions-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #4a86e8;
          text-align: center;
          margin: 0 0 1.2rem 0;
        }
        
        .missions-description {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #ccc;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .status-message {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(74, 134, 232, 0.3);
          padding: 0.8rem;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #4a86e8;
          border-radius: 4px;
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
          border: 1px solid rgba(74, 134, 232, 0.3);
        }
        
        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
          text-shadow: 0 0 10px #000, 0 0 20px #000;
        }
        
        .mission-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem;
          width: 100%;
          justify-content: center;
          align-items: center;
        }
        
        .countdown-container {
          display: flex;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid rgba(74, 134, 232, 0.5);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        
        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem;
          border-radius: 6px;
          min-width: 60px;
        }
        
        .countdown-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 2rem;
          color: #4a86e8;
          text-shadow: 0 0 5px rgba(74, 134, 232, 0.7);
        }
        
        .countdown-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
          margin-top: 0.2rem;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
        }
        
        .active-stats {
          display: flex;
          gap: 1.5rem;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid rgba(74, 134, 232, 0.5);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          min-width: 120px;
        }
        
        .stat-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: white;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
          margin-bottom: 0.3rem;
        }
        
        .stat-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.8rem;
          color: #4afc4a;
          text-shadow: 0 0 5px rgba(74, 252, 74, 0.5);
        }
        
        .rewards-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background-color: #0a0c1d;
          border-radius: 8px;
          border: 1px solid #4a86e8;
        }
        
        .rewards-container {
          width: 100%;
          background: transparent;
          border-radius: 0;
          padding: 0;
          border: none;
        }
        
        .rewards-container h3 {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          color: #4a86e8;
          margin-bottom: 1.5rem;
          text-align: center;
          border-bottom: 1px solid #4a86e8;
          padding-bottom: 0.5rem;
          font-family: 'Press Start 2P', monospace;
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
          border: 1px solid #4a86e8;
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
          width: 90px;
          height: 90px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .reward-info {
          flex: 1;
        }
        
        .reward-info h4 {
          color: #4a86e8;
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .reward-info p {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: #ffffff;
          font-family: 'Press Start 2P', monospace;
        }
        
        .reward-amount {
          font-weight: bold;
          color: #00ff00;
          font-family: 'Press Start 2P', monospace;
        }
        
        .mission-note {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px dashed rgba(74, 134, 232, 0.5);
          border-radius: 8px;
          text-align: center;
          color: #ddd;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
        }
        
        .mission-note p {
          margin: 0.5rem 0;
          color: #ff9800;
        }
        
        .mission-note p:last-child {
          color: #4afc4a;
          margin-top: 1rem;
        }
        
        .staking-interface {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background-color: rgba(10, 12, 29, 0.8);
          border-radius: 8px;
          border: 1px solid #4a86e8;
        }
        
        .staking-columns {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .staking-column {
          flex: 1;
          min-width: 300px;
          background-color: rgba(23, 26, 45, 0.8);
          border-radius: 8px;
          border: 1px solid rgba(74, 134, 232, 0.5);
          padding: 1rem;
        }
        
        .staking-column h3 {
          color: #4a86e8;
          text-align: center;
          margin-bottom: 1.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
        }
        
        .ordinals-section {
          margin-bottom: 1.5rem;
        }
        
        .ordinals-section h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: white;
          margin: 0.5rem 0 1rem 0;
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 4px;
          display: inline-block;
        }
        
        .mission-controls {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(74, 134, 232, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1rem;
        }
        
        .selection-summary {
          margin-bottom: 1.5rem;
        }
        
        .selection-summary h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #4a86e8;
          margin: 0 0 1rem 0;
          text-align: center;
        }
        
        .selected-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .selected-info p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.65rem;
          color: white;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.7rem 1rem;
          border-radius: 4px;
          border: 1px solid rgba(74, 134, 232, 0.2);
        }
        
        .ordinals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
          max-height: 300px;
          overflow-y: auto;
          padding: 0.5rem;
        }
        
        .ordinal-card {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        
        .ordinal-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .ordinal-card.selected {
          border: 2px solid #4afc4a;
          box-shadow: 0 0 10px rgba(74, 252, 74, 0.5);
        }
        
        .ordinal-image-container {
          position: relative;
          width: 100%;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000;
        }
        
        .ordinal-image {
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
        }
        
        .selected-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(74, 252, 74, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          color: #fff;
        }
        
        .ordinal-info {
          padding: 0.5rem;
        }
        
        .ordinal-info h4 {
          font-size: 0.8rem;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          color: #fff;
          font-family: 'Press Start 2P', monospace;
        }
        
        /* Smaller text for long Bitcoin Tiger names */
        .smaller-text {
          font-size: 0.65rem !important;
          white-space: normal !important;
          line-height: 1.2;
          height: auto;
          word-break: break-word;
        }
        
        .stake-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4a86e8;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
        }
        
        .stake-button:hover:not(:disabled) {
          background-color: #3a76d8;
          transform: translateY(-2px);
        }
        
        .stake-button:disabled {
          background-color: #2a4673;
          cursor: not-allowed;
        }
        
        .no-ordinals-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          color: #aaa;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
        }
        
        .staked-card {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #4a86e8;
        }
        
        .staked-image-container {
          position: relative;
          width: 100%;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000;
        }
        
        .staked-image {
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
        }
        
        .ready-to-claim {
          animation: pulse 1.5s infinite alternate;
        }
        
        @keyframes pulse {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
        
        .time-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 0.3rem;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #4a86e8;
        }
        
        .claim-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(74, 252, 74, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .claim-button {
          background-color: #4afc4a;
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
        }
        
        .claim-button:hover:not(:disabled) {
          background-color: #3aec3a;
          transform: scale(1.05);
        }
        
        .claim-button:disabled {
          background-color: #2a8c2a;
          cursor: wait;
        }
        
        .staked-info {
          padding: 0.5rem;
        }
        
        .staked-info h4 {
          font-size: 0.8rem;
          margin: 0 0 0.5rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          color: #fff;
          font-family: 'Press Start 2P', monospace;
        }
        
        .mission-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(74, 134, 232, 0.3);
          color: #4a86e8;
          font-size: 0.5rem;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          font-family: 'Press Start 2P', monospace;
          border: 1px solid rgba(74, 134, 232, 0.5);
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.9);
        }
        
        .unstake-button-container {
          display: flex;
          justify-content: center;
        }
        
        .unstake-button {
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.3rem 0.6rem;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Press Start 2P', monospace;
        }
        
        .unstake-button:hover:not(:disabled) {
          background-color: #c0392b;
        }
        
        .unstake-button:disabled {
          background-color: #7c2419;
          cursor: not-allowed;
        }
        
        .claim-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
        }
        
        .claim-container {
          background-color: rgba(23, 26, 45, 0.9);
          border-radius: 12px;
          border: 2px solid #4afc4a;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 0 30px rgba(74, 252, 74, 0.5);
        }
        
        .chest-animation {
          margin-bottom: 1rem;
        }
        
        .reward-animation {
          text-align: center;
        }
        
        .reward-animation h3 {
          color: #4afc4a;
          font-family: 'Press Start 2P', monospace;
          margin-bottom: 1rem;
        }
        
        .reward-animation .reward-amount {
          font-size: 2rem;
          color: #ffD700;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .instruction-banner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(74, 134, 232, 0.3);
        }
        
        .instruction-banner h3 {
          color: #4a86e8;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
        }
        
        .instruction-steps {
          padding-left: 2rem;
          color: #ccc;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.8;
        }
        
        .instruction-steps li {
          margin-bottom: 0.8rem;
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
          font-family: 'Press Start 2P', monospace;
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
        
        @media (max-width: 768px) {
          .ordinal-sigmax-missions {
            padding: 0;
            padding-top: 60px;
            overflow: auto;
            height: 100%;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          
          .mission-banner {
            height: auto;
            max-height: 200px;
            margin-top: 20px;
          }
          
          .missions-title {
            font-size: 1rem;
          }
          
          .missions-description {
            font-size: 0.6rem;
          }
          
          .countdown-container {
            gap: 0.5rem;
            padding: 0.5rem;
          }
          
          .countdown-item {
            min-width: 50px;
            padding: 0.3rem;
          }
          
          .countdown-value {
            font-size: 1.2rem;
          }
          
          .countdown-label {
            font-size: 0.5rem;
          }
          
          .rewards-cards {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .reward-card {
            width: 95%;
            max-width: none;
          }
          
          .coming-soon-container h3 {
            font-size: 1.4rem;
          }
          
          .coming-soon-container p {
            font-size: 0.9rem;
          }
          
          .instruction-banner h3 {
            font-size: 1.1rem;
          }
          
          .instruction-steps {
            font-size: 0.6rem;
            padding-left: 1.5rem;
          }
        }
        
        .stake-button:disabled {
          background-color: #2a4673;
          cursor: not-allowed;
        }
        
        .debug-button {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          background-color: #333;
          color: #fff;
          border: 1px dashed #888;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
        }
        
        .debug-button:hover {
          background-color: #555;
        }
        
        .no-ordinals-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          color: #aaa;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default OrdinalSigmaXMissions; 