import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useLightning } from '@/context/LightningContext';

interface MissionProps {
  walletAddress: string;
  userTaproots: any[];
  stakedTaproots: any[];
  onStake: (taprootId: string, missionId: string) => Promise<any>;
  onUnstake: (taprootId: string) => Promise<any>;
  onRefresh: () => Promise<void>;
  // Banner timer configuratie
  bannerCountdown?: {
    days: number;
    hours: number;
    mins: number;
    secs: number;
  };
  bannerTitle?: string; // Optionele banner titel
  bannerImage?: string; // Optionele banner afbeelding
}

// Taproot Alpha inscription IDs
const TAPROOT_ALPHA_IDS = [
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di0",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di1",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di2",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di3",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di4",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di5",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di6",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di7",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di8",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di9",
  "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di10",
];

// Taproot Alpha base ID en range
const TAPROOT_ALPHA_BASE_ID = "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di";
const TAPROOT_ALPHA_MAX_INDEX = 554;

// Helper functie om te bepalen of een inscription ID een Taproot Alpha is
export const isTaprootAlpha = (taproot: any): boolean => {
  // Skip invalid taproots
  if (!taproot) return false;
  
  // Debug log to understand how isTaprootAlpha is classifying taproots - uitgeschakeld om console vervuiling te verminderen
  /* 
  console.log(`Checking if inscription is a Taproot Alpha:`, {
    name: taproot.name,
    id: taproot.id,
    isTaprootAlpha: taproot.isTaprootAlpha,
    collection: taproot.collection,
    pattern: taproot.pattern
  });
  */
  
  // Perform multiple checks to maximize chance of correctly identifying a Taproot Alpha
  const explicitFlag = taproot.isTaprootAlpha === true;
  
  const nameCheck = taproot.name && 
    (taproot.name.toLowerCase().includes('taproot') || 
     taproot.name.toLowerCase().includes('alpha'));
     
  const collectionCheck = taproot.collection && 
    (taproot.collection.toLowerCase().includes('taproot') || 
     taproot.collection.toLowerCase().includes('alpha'));
     
  const patternCheck = taproot.pattern && 
    (taproot.pattern.toLowerCase().includes('taproot') || 
     taproot.pattern.toLowerCase().includes('alpha'));
  
  // ID check - Exact match in the list
  const listCheck = taproot.id && TAPROOT_ALPHA_IDS.includes(taproot.id);
  
  // Check of het het base ID patroon volgt
  let rangeCheck = false;
  if (taproot.id && taproot.id.startsWith(TAPROOT_ALPHA_BASE_ID)) {
    // Haal het nummer na de 'i' op
    const numberStr = taproot.id.substring(TAPROOT_ALPHA_BASE_ID.length);
    const number = parseInt(numberStr);
    
    // Controleer of het een getal is en binnen het bereik valt
    if (!isNaN(number) && number >= 0 && number <= TAPROOT_ALPHA_MAX_INDEX) {
      rangeCheck = true;
    }
  }
  
  // Combine all checks - if any check passes, it's a Taproot Alpha
  const isTaproot = explicitFlag || nameCheck || collectionCheck || patternCheck || listCheck || rangeCheck;
  
  // Debug log for classification result - uitgeschakeld om console vervuiling te verminderen
  // console.log(`Taproot Alpha classification result for ${taproot.id}: ${isTaproot ? 'IS a Taproot Alpha' : 'NOT a Taproot Alpha'}`);
  
  return isTaproot;
};

const TaprootAlphaMissions: React.FC<MissionProps> = ({ 
  walletAddress, 
  userTaproots, 
  stakedTaproots,
  onStake, 
  onUnstake,
  onRefresh,
  // Default waarden voor de banner configuratie
  bannerCountdown = { days: 6, hours: 23, mins: 59, secs: 55 },
  bannerTitle = "Taproot Alpha Team",
  bannerImage = "/mission-collab.png"
}) => {
  // Reward kansen en bedragen configuratie
  const REWARD_CONFIG = {
    // Kansen (in percentage, moet optellen tot 100)
    CHANCES: {
      LOW_ROLL: 98,  // 98% kans op low roll (verhoogd van 85%)
      HIGH_ROLL: 1.9, // 1.9% kans op high roll (verlaagd van 14%)
      JACKPOT: 0.1   // 0.1% kans op jackpot (verlaagd van 1%)
    },
    // Beloningsbereiken (in satoshis)
    AMOUNTS: {
      LOW_ROLL: { MIN: 1000, MAX: 5000 },   // 1,000 - 10,000 sats
      HIGH_ROLL: { MIN: 10000, MAX: 20000 }, // 10,000 - 25,000 sats
      JACKPOT: { MIN: 25000, MAX: 500000 }   // 25,000 - 500,000 sats
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [selectedOrdinals, setSelectedOrdinals] = useState<string[]>([]);
  
  // Hard-code een lagere beginwaarde om te testen of het aftellen werkt
  const [countdownDays, setCountdownDays] = useState(bannerCountdown.days);
  const [countdownHours, setCountdownHours] = useState(bannerCountdown.hours);
  const [countdownMins, setCountdownMins] = useState(bannerCountdown.mins);
  const [countdownSecs, setCountdownSecs] = useState(bannerCountdown.secs);
  
  // Claim reveal state
  const [showClaimReveal, setShowClaimReveal] = useState(false);
  const [claimReward, setClaimReward] = useState<{
    amount: number;
    isHighRoll: boolean;
    isJackpot: boolean;
    isClaiming: boolean;
    claimedTigerId: string;
  }>({
    amount: 0,
    isHighRoll: false,
    isJackpot: false,
    isClaiming: false,
    claimedTigerId: ''
  });
  
  const [activeMissionData, setActiveMissionData] = useState({
    activeTigers: 0,
    activeGuardians: 0,
    totalPower: 0,
    estimatedRewards: 0
  });
  
  // State om de timer voor elke gestakede taproot bij te houden
  const [taprootTimers, setTaprootTimers] = useState<{[taprootId: string]: number}>({});
  
  // Lokale state voor gestakede taproots
  const [localStakedTaproots, setLocalStakedTaproots] = useState<any[]>([]);

  // Add these state variables for handling claim animation
  const [showClaim, setShowClaim] = useState(false);
  const [claimedReward, setClaimedReward] = useState(0);
  const [claimingInProgress, setClaimingInProgress] = useState(false);
  const [claimingTigerId, setClaimingTigerId] = useState<string | null>(null);
  
  // Get the balance update function from Lightning context
  const { setBalance, balance } = useLightning();
  
  // Eenvoudige countdown implementatie
  useEffect(() => {
    const countdown = setInterval(() => {
      // Log voor debug
      console.log("Banner countdown tick:", { countdownDays, countdownHours, countdownMins, countdownSecs });
      
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
  
  // Helper functie om localStakedTaproots te laden vanuit localStorage
  const loadLocalStakedTaproots = () => {
    if (!walletAddress) return;
    
    try {
      const taprootStakingData = localStorage.getItem('taprootStakingDB');
      if (taprootStakingData) {
        const parsedData = JSON.parse(taprootStakingData);
        console.log('Parsed taproot staking data:', parsedData);
        
        if (parsedData.stakedTaproots && parsedData.stakedTaproots[walletAddress]) {
          const walletStakedTaproots = parsedData.stakedTaproots[walletAddress];
          
          // EXTRA DEBUG: Log de ruwe taproots uit localStorage
          console.log('[DEBUG] Raw taproots from localStorage:', walletStakedTaproots);
          console.log('[DEBUG] Object keys:', Object.keys(walletStakedTaproots));
          
          // Controleer of er duplicaten zijn in de IDs
          const taprootIds = Object.keys(walletStakedTaproots);
          const uniqueIds = [...new Set(taprootIds)];
          if (taprootIds.length !== uniqueIds.length) {
            console.warn('[WARNING] Duplicate Taproot IDs found in localStorage!', {
              totalIds: taprootIds.length,
              uniqueIds: uniqueIds.length
            });
          }
          
          // Converteer naar array van gestakede taproots
          const displayStakedTaproots = Object.entries(walletStakedTaproots).map(([taprootId, info]: [string, any]) => ({
            id: taprootId,
            name: info.name || `Taproot Alpha #${taprootId.substring(0, 8)}`,
            image: info.image || '/taproot-pixel.png',
            isTaprootAlpha: info.isTaprootAlpha || false,
            stakedAt: info.stakedAt || Date.now(),
            nextChestAt: info.nextChestAt || (Date.now() + 10000),
            key: `staked-${taprootId}`
          }));
          
          console.log(`Found ${displayStakedTaproots.length} staked taproots in localStorage:`, displayStakedTaproots);
          
          // Update de lokale state
          setLocalStakedTaproots(displayStakedTaproots);
        } else {
          // Clear the local staked taproots if there are none in localStorage
          setLocalStakedTaproots([]);
        }
      } else {
        // Clear the local staked taproots if taprootStakingDB doesn't exist
        setLocalStakedTaproots([]);
      }
    } catch (error) {
      console.error('Error loading taproot staking data:', error);
      // On error, reset the local state
      setLocalStakedTaproots([]);
    }
  };
  
  useEffect(() => {
    // Laad gestakede taproots bij initialisatie
    loadLocalStakedTaproots();
    
    // Start een timer voor het bijwerken van de countdown voor elke taproot
    const timerInterval = setInterval(() => {
      const now = Date.now();
      
      // Bijwerken van de taproots in de localStorage
      try {
        const taprootStakingData = localStorage.getItem('taprootStakingDB');
        if (taprootStakingData) {
          const parsedData = JSON.parse(taprootStakingData);
          
          if (parsedData.stakedTaproots && parsedData.stakedTaproots[walletAddress]) {
            const walletStakedTaproots = parsedData.stakedTaproots[walletAddress];
            let needsUpdate = false;
            
            // Bereken voor elke taproot de resterende tijd
            const newTimers: {[taprootId: string]: number} = {};
            
            // Loop door alle gestakede taproots
            Object.entries(walletStakedTaproots).forEach(([taprootId, info]: [string, any]) => {
              const nextChestTime = info.nextChestAt;
              const remainingTime = Math.max(0, nextChestTime - now);
              
              newTimers[taprootId] = remainingTime;
              
              // Check of taproot klaar is voor claimen
              if (remainingTime <= 0 && info.nextChestAt > 0) {
                console.log(`Taproot ${taprootId} is klaar voor claimen!`);
                // We markeren alleen dat er een update nodig is, maar unstaken niet automatisch
                needsUpdate = true;
              }
            });
            
            // Update de timer state
            setTaprootTimers(newTimers);
            
            // Als één van de taproots klaar is, refresh de UI
            if (needsUpdate) {
              loadLocalStakedTaproots();
            }
          }
        }
      } catch (error) {
        console.error('Error bij het bijwerken van taproot timers:', error);
      }
    }, 500); // Update elke halve seconde voor vloeiendere countdown
    
    // Extra interval om taproots te laden vanuit localStorage
    const refreshInterval = setInterval(() => {
      loadLocalStakedTaproots();
    }, 5000); // Elke 5 seconden verversen
    
    // Cleanup beide intervals
    return () => {
      clearInterval(timerInterval);
      clearInterval(refreshInterval);
    };
  }, [walletAddress]);
  
  // Extra useEffect om taproots in te laden wanneer de pagina wordt geladen of na staking/unstaking
  useEffect(() => {
    loadLocalStakedTaproots();
  }, [walletAddress, userTaproots, stakedTaproots]);
  
  // Effect voor automatische refresh na een staking/claim operatie
  useEffect(() => {
    if (message.includes("succesvol") || message.includes("voltooid")) {
      // Na een succesvolle operatie, wacht even en ververs dan
      const refreshTimer = setTimeout(() => {
        loadLocalStakedTaproots();
      }, 1000);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [message]);
  
  useEffect(() => {
    console.log('TaprootAlphaMissions component loaded with data:', {
      walletAddress,
      userTaprootsCount: userTaproots.length,
      stakedTaprootsCount: stakedTaproots.length
    });
    
    // Log available ordinals for debugging
    const bitcoinTigers = userTaproots.filter(taproot => !isTaprootAlpha(taproot));
    const taprootAlphas = userTaproots.filter(taproot => isTaprootAlpha(taproot));
    
    // Uitgeschakeld om console vervuiling te verminderen
    // console.log(`Available ordinals: ${taprootAlphas.length} Taproot Alphas and ${bitcoinTigers.length} Bitcoin Tigers`);
    // console.log('All user taproots:', userTaproots);
    // console.log('All staked taproots:', stakedTaproots);
    
    // Calculate active mission data op basis van localStakedTaproots
    setActiveMissionData({
      activeTigers: localStakedTaproots.filter(t => !isTaprootAlpha(t)).length,
      activeGuardians: localStakedTaproots.filter(isTaprootAlpha).length,
      totalPower: localStakedTaproots.length * 420,
      estimatedRewards: localStakedTaproots.length * 100
    });
    
  }, [walletAddress, userTaproots, stakedTaproots, localStakedTaproots]);
  
  // Helper function to render either a Bitcoin Tiger or Taproot Alpha
  const renderTigerOrTaproot = (ordinal: any) => {
    if (isTaprootAlpha(ordinal)) {
      return (
        <div className="taproot-container">
          <iframe
            src={`https://ordinals.com/content/${ordinal.id}`}
            title={ordinal.name}
            width={180}
            height={180}
            style={{
              border: '1px solid #ff6b00',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 107, 0, 0.1)',
              pointerEvents: 'none'
            }}
            sandbox="allow-scripts"
            loading="lazy"
            onError={() => {
              // console.log(`Failed to load Taproot Alpha iframe: ${ordinal.id}`);
            }}
          />
        </div>
      );
    } else {
      return (
        <Image 
          src={ordinal.image || '/tiger-pixel1.png'} 
          alt={ordinal.name}
          width={180}
          height={180}
          className="tiger-image"
          style={{
            border: '1px solid #ffd700',
            borderRadius: '8px',
            backgroundColor: '#000'
          }}
          unoptimized={true}
          onError={(e) => {
            // console.log(`Failed to load Tiger image: ${ordinal.image}`);
            (e.target as HTMLImageElement).src = '/tiger-pixel1.png';
          }}
        />
      );
    }
  };
  
  // Helper function to get the correct display name for an ordinal
  const getDisplayName = (ordinal: any) => {
    if (isTaprootAlpha(ordinal)) {
      // If it's a Taproot Alpha, use "Taproot Alpha" in the name
      return ordinal.name?.includes("Taproot") 
        ? ordinal.name 
        : `Taproot Alpha #${ordinal.id.slice(-8)}`;
    } else {
      // For Bitcoin Tigers, keep the original name
      return ordinal.name || `Bitcoin Tiger #${ordinal.id.slice(-8)}`;
    }
  };
  
  // Toggle selection of an ordinal
  const toggleSelectOrdinal = (taprootId: string) => {
    setSelectedOrdinals(prev => {
      if (prev.includes(taprootId)) {
        return prev.filter(id => id !== taprootId);
      } else {
        return [...prev, taprootId];
      }
    });
  };
  
  // Functie om een taproot te staken voor een missie
  const startTaprootMission = async () => {
    // Reset message
    setMessage("");
    
    // Log selected ordinals for debugging
    console.log("[MISSION DEBUG] Starting mission with selected ordinals:", selectedOrdinals);
    
    if (selectedOrdinals.length < 2) {
      setMessage("Select at least one Bitcoin Tiger and one Taproot Alpha to start a mission");
      return;
    }
    
    // Check if we have at least one Tiger and one Taproot Alpha
    const selectedTaproots = userTaproots.filter(taproot => selectedOrdinals.includes(taproot.id));
    console.log("[MISSION DEBUG] Selected taproots objects:", selectedTaproots);
    
    // Add more detailed logging for proper classification
    const taprootClassification = selectedTaproots.map(taproot => ({
      id: taproot.id, 
      name: taproot.name, 
      isTaprootAlpha: isTaprootAlpha(taproot)
    }));
    console.log("[MISSION DEBUG] Taproot classification:", taprootClassification);
    
    const hasTiger = selectedTaproots.some(taproot => !isTaprootAlpha(taproot));
    const hasTaproot = selectedTaproots.some(isTaprootAlpha);
    
    console.log("[MISSION DEBUG] Has tiger:", hasTiger);
    console.log("[MISSION DEBUG] Has taproot:", hasTaproot);
    
    if (!hasTiger || !hasTaproot) {
      const message = `Je hebt minimaal 1 Bitcoin Tiger EN 1 Taproot Alpha nodig voor een missie. 
        Geselecteerd: ${hasTiger ? '✓' : '✗'} Bitcoin Tiger, ${hasTaproot ? '✓' : '✗'} Taproot Alpha`;
      setMessage(message);
      return;
    }
    
    // Show immediate feedback to user
    setMessage("📝 Missie wordt gestart, even geduld...");
    setLoading(true);
    
    try {
      // Debug payload
      const payload = {
        walletAddress,
        missionId: 'taproot-tiger-team',
        taprootIds: selectedOrdinals
      };
      
      console.log("[MISSION DEBUG] Sending API request to /api/taproot-missions/start with payload:", payload);
      
      // Call the actual staking function for each selected ordinal individually
      // This is a more direct approach rather than using the mission API
      let stakingSuccessCount = 0;
      
      // Controleer taprootStakingDB voor eerder gestakede taproots
      const checkCurrentStaked = () => {
        try {
          const taprootStakingData = localStorage.getItem('taprootStakingDB');
          if (taprootStakingData) {
            const parsedData = JSON.parse(taprootStakingData);
            console.log('[MISSION DEBUG] Current taprootStakingDB before staking:', parsedData);
          }
        } catch (err) {
          console.error('[MISSION ERROR] Error checking staking DB:', err);
        }
      };
      
      // Check staking DB before staking
      checkCurrentStaked();
      
      for (const taprootId of selectedOrdinals) {
        try {
          console.log(`[MISSION DEBUG] Calling onStake for taproot ID: ${taprootId}`);
          
          // Direct call to the staking functionality
          const result = await onStake(taprootId, 'taproot-tiger-team');
          console.log(`[MISSION DEBUG] Staking result for ${taprootId}:`, result);
          stakingSuccessCount++;
          
          // Check staking DB after each successful stake to confirm it was added
          checkCurrentStaked();
        } catch (err) {
          console.error(`[MISSION ERROR] Failed to stake taproot ${taprootId}:`, err);
        }
      }
      
      // Only try the API call if individual staking worked
      if (stakingSuccessCount > 0) {
        try {
          // Call API to start mission
          const response = await axios.post(`/api/tiger-missions/start`, payload, {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
          });
          
          console.log("[MISSION DEBUG] API response:", response.data);
        } catch (missionErr) {
          // Log but don't fail if mission API fails but individual staking worked
          console.error("[MISSION ERROR] Mission API failed but taproots were staked:", missionErr);
        }
      }
      
      // Update UI with success message based on staking results
      if (stakingSuccessCount === selectedOrdinals.length) {
        setMessage(`✅ Mission started successfully! ${stakingSuccessCount} tigers/taproots have been staked.`);
      } else if (stakingSuccessCount > 0) {
        setMessage(`⚠️ Mission partially started. ${stakingSuccessCount} of ${selectedOrdinals.length} tigers/taproots have been staked.`);
      } else {
        throw new Error("None of the tigers or taproots could be staked");
      }
      
      // Clear selection
      setSelectedOrdinals([]);
      
      // Update active mission data with new values
      setActiveMissionData(prev => ({
        ...prev,
        activeTigers: prev.activeTigers + selectedTaproots.filter(t => !isTaprootAlpha(t)).length,
        activeGuardians: prev.activeGuardians + selectedTaproots.filter(isTaprootAlpha).length,
        totalPower: prev.totalPower + (selectedTaproots.length * 420),
        estimatedRewards: prev.estimatedRewards + (selectedTaproots.length * 100)
      }));
      
      // BELANGRIJK: Laad lokale opgeslagen taproots na de staking operatie
      loadLocalStakedTaproots();
      
      // Final check to see staking results
      console.log('[MISSION DEBUG] Final staking result:');
      checkCurrentStaked();
      
    } catch (error: any) {
      console.error("[MISSION ERROR] Error starting mission:", error);
      
      // Enhanced error handling
      let errorMessage = "Error starting mission";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error
          errorMessage = `Server error: ${error.response.data?.error || error.response.statusText || 'Unknown error'} (${error.response.status})`;
          console.error("[MISSION ERROR] Error response data:", error.response.data);
        } else if (error.request) {
          // Request made but no response received
          errorMessage = "Geen antwoord van server. Controleer je verbinding en probeer opnieuw.";
        } else {
          // Error in request setup
          errorMessage = `Request error: ${error.message}`;
        }
      } else {
        errorMessage = `${error.message || "Unknown error"}`;
      }
      
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Manual refresh function when missions fail
  const handleManualRefresh = async () => {
    try {
      await onRefresh();
    } catch (error) {
      console.error("[ERROR] Failed to refresh data:", error);
    }
  };

  // Functie om staking data rechtstreeks uit localStorage te halen
  const getStakedTaprootsFromLocalStorage = () => {
    if (!walletAddress) return [];
    
    try {
      const taprootStakingData = localStorage.getItem('taprootStakingDB');
      if (!taprootStakingData) return [];
      
      const parsedData = JSON.parse(taprootStakingData);
      if (!parsedData.stakedTaproots || !parsedData.stakedTaproots[walletAddress]) return [];
      
      const stakedTaprootEntries = Object.entries(parsedData.stakedTaproots[walletAddress]);
      if (stakedTaprootEntries.length === 0) return [];
      
      // Converteer de localStorage data naar het juiste format
      const localStakedTaproots = stakedTaprootEntries.map(([taprootId, info]: [string, any]) => ({
        id: taprootId,
        name: info.name || `Taproot Alpha #${taprootId.substring(0, 8)}`,
        image: info.image || '/taproot-pixel.png',
        isTaprootAlpha: info.isTaprootAlpha || false,
        stakedAt: info.stakedAt || Date.now(),
        nextChestAt: info.nextChestAt || (Date.now() + 10000),
        key: `staked-${taprootId}`
      }));
      
      console.log(`[DEBUG] Found ${localStakedTaproots.length} staked taproots in localStorage:`, localStakedTaproots);
      return localStakedTaproots;
    } catch (error) {
      console.error('Error loading staked taproots from localStorage:', error);
      return [];
    }
  };
  
  // Render staked taproots - combineer de props met localStorage data als nodig
  const getDisplayedStakedTaproots = () => {
    if (stakedTaproots.length > 0) {
      return stakedTaproots;
    }
    
    // Als de prop leeg is, pak data uit localStorage
    return getStakedTaprootsFromLocalStorage();
  };

  // Functie om de weergegeven countdown voor een specifieke taproot te berekenen
  const getTaprootCountdown = (taprootId: string) => {
    // Zorg ervoor dat we een timer voor deze taproot hebben
    if (!(taprootId in taprootTimers)) {
      // Als er geen timer is, zoek in de lokale taproot data
      const taproot = localStakedTaproots.find(t => t.id === taprootId);
      if (taproot && taproot.nextChestAt) {
        const remainingTime = Math.max(0, taproot.nextChestAt - Date.now());
        return { value: remainingTime <= 0 ? "Ready!" : `${Math.ceil(remainingTime / 1000)}s`, isReady: remainingTime <= 0 };
      }
      return { value: "Loading...", isReady: false };
    }
    
    const remainingMs = taprootTimers[taprootId] || 0;
    
    if (remainingMs <= 0) {
      return { value: "Ready!", isReady: true };
    }
    
    const seconds = Math.ceil(remainingMs / 1000);
    return { value: `${seconds}s`, isReady: false };
  };
  
  // Helper function to trigger chest animation effect
  const triggerChestEffect = () => {
    setShowClaim(true);
    // Hide claim UI after animation
    setTimeout(() => {
      setShowClaim(false);
    }, 5000);
  };
  
  // Update the refreshStakedTaproots function to only update local state
  const refreshStakedTaproots = () => {
    try {
      console.log("Updating local taproot state only, no page refresh");
      // Only load taproots from localStorage to update local state
      loadLocalStakedTaproots();
      
      // Do NOT call onRefresh as it may be causing the page refresh
    } catch (error) {
      console.error("Error in refreshStakedTaproots:", error);
    }
  };
  
  // Handle claiming taproots
  const handleClaimTaproot = async (taproot: any, event?: React.MouseEvent) => {
    // Check if claiming is already in progress
    if (claimingInProgress) return;
    
    try {
      // Prevent default browser behaviors that might cause page refresh
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      // Store taproot ID for later use
      const taprootId = taproot.id;
      console.log("Starting claim process for taproot:", taprootId);
      
      // Mark as claiming to prevent double-clicks
      setClaimingInProgress(true);
      setClaimingTigerId(taprootId);
      
      // Show the claiming animation
      setClaimReward({
        amount: 0,
        isHighRoll: false,
        isJackpot: false,
        isClaiming: true,
        claimedTigerId: taprootId
      });
      
      // Show claim reveal with the loading animation
      setShowClaimReveal(true);
      
      // Calculate reward based on chances
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
        const taprootStakingData = localStorage.getItem('taprootStakingDB');
        if (taprootStakingData) {
          const parsedData = JSON.parse(taprootStakingData);
          
          if (parsedData.stakedTaproots && parsedData.stakedTaproots[walletAddress]) {
            const walletStakedTaproots = parsedData.stakedTaproots[walletAddress];
            
            // Remove the claimed taproot
            delete walletStakedTaproots[taprootId];
            
            // Update localStorage immediately
            localStorage.setItem('taprootStakingDB', JSON.stringify(parsedData));
            console.log(`Removed taproot ${taprootId} from staking DB`);
          }
        }
      } catch (error) {
        console.error('Error updating taproot staking data:', error);
      }
      
      // Update local state immediately to remove the taproot from UI
      setLocalStakedTaproots(prev => prev.filter(t => t.id !== taprootId));
      
      // Call the API in parallel to update balance
      let apiSuccess = false;
      try {
        const response = await fetch('/api/chests/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: walletAddress,
            chestType: "taproot", 
            reward: rewardAmount,
            claimId: `taproot-${taprootId}-${Date.now()}`
          }),
        });
        
        const data = await response.json();
        console.log("Claim API response:", data);
        
        if (data.success) {
          apiSuccess = true;
          // Update Lightning context balance
          if (data.balance && setBalance) {
            console.log(`Updating balance from ${balance} to ${data.balance}`);
            setBalance(Number(data.balance));
          }
        }
      } catch (apiError) {
        console.error("API error during claim:", apiError);
        // Continue with animation even if API fails
      }
      
      // Longer delay to show the opening animation (2.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Update claimReward state for the revealed animation
      console.log("Revealing reward animation with amount:", rewardAmount);
      setClaimReward({
        amount: rewardAmount,
        isHighRoll: rewardType === "HIGH_ROLL",
        isJackpot: rewardType === "JACKPOT",
        isClaiming: false,
        claimedTigerId: taprootId
      });
      
      // Set a timeout to hide the claim UI after animation
      setTimeout(() => {
        setShowClaimReveal(false);
        setClaimingTigerId(null);
        setClaimingInProgress(false);
        
        // Show a small message if API failed but animation succeeded
        if (!apiSuccess) {
          setMessage("Note: There might have been an issue crediting your balance. The reward will be applied when you refresh.");
        }
      }, 8000);
      
    } catch (error) {
      console.error("Error claiming taproot:", error);
      setShowClaimReveal(false);
      setClaimingInProgress(false);
      setClaimingTigerId(null);
      setMessage("Failed to claim taproot. Please try again.");
    }
  };

  // Functie om localStorage te resetten voor debugging
  const resetTaprootStakingDB = () => {
    try {
      localStorage.removeItem('taprootStakingDB');
      console.log('Taproot staking database reset!');
      setLocalStakedTaproots([]);
      setMessage('Taproot staking database reset. Refresh the page to start fresh.');
    } catch (error) {
      console.error('Error resetting taproot staking database:', error);
      setMessage('Error resetting database.');
    }
  };

  return (
    <div className="staking-page-container">
      <div className="taproot-alpha-wrapper">
        <div className="taproot-alpha-container">
          <div className="main-title">
          </div>
          
          <div className="missions-description-container">
            <h2 className="missions-title">Taproot Alpha Missions</h2>
            <p className="missions-description">
              Stake your Taproot Alpha together with Bitcoin Tigers to earn double rewards in special missions.
            </p>
            
            {userTaproots.filter(taproot => isTaprootAlpha(taproot)).length > 0 ? (
              <div className="status-message success">
                Found {userTaproots.filter(taproot => isTaprootAlpha(taproot)).length} Taproot Alpha in your wallet
              </div>
            ) : (
              <div className="status-message">
                No Taproot Alpha found in your wallet
              </div>
            )}
          </div>

          <div className="mission-banner">
            <Image 
              src={bannerImage}
              alt={bannerTitle || "Taproot Alpha Mission"}
              width={1200}
              height={280}
              className="banner-image"
              priority
              unoptimized={true}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 'auto',
                maxHeight: '280px'
              }}
            />
            <div className="banner-overlay">
              <div className="mission-title">
                {/* Banner title verwijderd */}
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
                    <span className="stat-label">Active Taproots</span>
                    <span className="stat-value">{activeMissionData.activeGuardians}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
                    <iframe
                      src={`https://ordinals.com/content/${TAPROOT_ALPHA_IDS[0]}`}
                      title="Taproot Alpha Preview"
                      width={70}
                      height={70}
                      style={{
                        border: '2px solid rgba(255, 107, 0, 0.7)',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        boxShadow: '0 0 10px rgba(255, 107, 0, 0.5)'
                      }}
                      sandbox="allow-scripts"
                      loading="lazy"
                    />
                  </div>
                  <div className="reward-info">
                    <h4>TAPROOT BONUS</h4>
                    <p>Successful Staking</p>
                    <span className="reward-amount">1 Chest with Satoshis</span>
                  </div>
                </div>
              </div>
              
              <div className="mission-note">
                <p>Both a Bitcoin Tiger and a Taproot Alpha must be staked together to qualify for rewards</p>
                <p>Total per mission: 2 Chests with BTC (satoshis)</p>
              </div>
            </div>
          </div>
          
          <div className="ordinals-section">
            <h3>Your Collection</h3>
            
            <div className="ordinal-category">
              <h4>Bitcoin Tigers ({userTaproots.filter(t => !isTaprootAlpha(t) && !localStakedTaproots.some(st => st.id === t.id)).length})</h4>
              <div className="ordinals-grid">
                {userTaproots
                  .filter(taproot => !isTaprootAlpha(taproot) && !localStakedTaproots.some(st => st.id === taproot.id))
                  .map(tiger => {
                    const isSelected = selectedOrdinals.includes(tiger.id);
                    
                    return (
                      <div 
                        key={tiger.key || tiger.id}
                        className={`ordinal-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSelectOrdinal(tiger.id)}
                      >
                        {renderTigerOrTaproot(tiger)}
                        <div className="ordinal-name">{getDisplayName(tiger)}</div>
                      </div>
                    );
                  })}
                
                {userTaproots.filter(t => !isTaprootAlpha(t) && !localStakedTaproots.some(st => st.id === t.id)).length === 0 && (
                  <div className="no-items">No Bitcoin Tigers available</div>
                )}
              </div>
            </div>
            
            <div className="ordinal-category">
              <h4>Taproot Alphas ({userTaproots.filter(t => isTaprootAlpha(t) && !localStakedTaproots.some(st => st.id === t.id)).length})</h4>
              <div className="ordinals-grid">
                {userTaproots
                  .filter(taproot => isTaprootAlpha(taproot) && !localStakedTaproots.some(st => st.id === taproot.id))
                  .map(taproot => {
                    const isSelected = selectedOrdinals.includes(taproot.id);
                    
                    console.log("Rendering Taproot Alpha:", taproot); // Debug logging
                    
                    return (
                      <div 
                        key={taproot.key || taproot.id}
                        className={`ordinal-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSelectOrdinal(taproot.id)}
                      >
                        {/* Render Taproot Alpha met fallback naar statische afbeelding */}
                        <div className="taproot-container">
                          {taproot.id && taproot.id.includes("47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di") ? (
                            <iframe
                              src={`https://ordinals.com/content/${taproot.id}`}
                              title={taproot.name}
                              width={180}
                              height={180}
                              style={{
                                border: '1px solid #ff6b00',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 107, 0, 0.1)',
                                pointerEvents: 'none'
                              }}
                              sandbox="allow-scripts"
                              loading="lazy"
                              onError={() => {
                                // console.log(`Failed to load Taproot Alpha iframe: ${taproot.id}`);
                              }}
                            />
                          ) : (
                            <Image 
                              src={taproot.image || '/taproot-pixel.png'} 
                              alt={taproot.name}
                              width={180}
                              height={180}
                              className="taproot-image"
                              style={{
                                border: '1px solid #ff6b00',
                                borderRadius: '8px',
                                backgroundColor: '#000'
                              }}
                              unoptimized={true}
                              onError={(e) => {
                                // console.log(`Failed to load Taproot Alpha image: ${taproot.image}`);
                                (e.target as HTMLImageElement).src = '/taproot-pixel.png';
                              }}
                            />
                          )}
                        </div>
                        <div className="ordinal-name">{getDisplayName(taproot)}</div>
                      </div>
                    );
                  })}
                
                {userTaproots.filter(t => isTaprootAlpha(t) && !localStakedTaproots.some(st => st.id === t.id)).length === 0 && (
                  <div className="no-items">No Taproot Alphas available</div>
                )}
              </div>
            </div>
            
            <div className="ordinal-category">
              <h4>Currently On Mission</h4>
              <div className="ordinals-grid">
                {localStakedTaproots.map(taproot => {
                  const countdown = getTaprootCountdown(taproot.id);
                  
                  return (
                    <div 
                      key={taproot.key || taproot.id}
                      className="ordinal-item on-mission"
                    >
                      {renderTigerOrTaproot(taproot)}
                      <div className="ordinal-name">{getDisplayName(taproot)}</div>
                      <div className="mission-badge">On Mission</div>
                      <div className="ordinal-timer">
                        <div className="timer-label">Available in:</div>
                        <div className={`timer-value ${countdown.isReady ? 'ready' : ''}`}>
                          {countdown.value}
                        </div>
                        <div className="timer-rewards">+1 Chest</div>
                        {countdown.isReady && (
                          <button 
                            className="claim-button"
                            onClick={(e) => handleClaimTaproot(taproot, e)}
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {localStakedTaproots.length === 0 && (
                  <div className="no-items">None of your ordinals were sent on this mission</div>
                )}
              </div>
            </div>
            
            <div className="mission-controls">
              <div className="selection-summary">
                <h4>Selected for Mission: {selectedOrdinals.length} ordinals</h4>
                <div className="selected-info">
                  <p>Bitcoin Tigers: {userTaproots.filter(t => selectedOrdinals.includes(t.id) && !isTaprootAlpha(t)).length}</p>
                  <p>Taproot Alphas: {userTaproots.filter(t => selectedOrdinals.includes(t.id) && isTaprootAlpha(t)).length}</p>
                </div>
              </div>
              
              <button 
                onClick={startTaprootMission}
                className="start-mission-button"
                disabled={loading || selectedOrdinals.length < 2}
              >
                {loading ? 'Starting Mission...' : 'Start Taproot Mission'}
              </button>
            </div>
          </div>
          
          <div className="instruction-banner">
            <h3>How Staking Works</h3>
            <ol className="instruction-steps">
              <li>Select at least 1 Bitcoin Tiger and 1 Taproot Alpha</li>
              <li>Click "Start Taproot Mission" to stake them</li>
              <li>Your staked ordinals will automatically earn rewards</li>
              <li>Use the refresh button to update the status</li>
            </ol>
          </div>
          
          {message && (
            <div className="mission-message">
              {message}
            </div>
          )}
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
      
      <style jsx>{`
        .staking-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          background-color: #1a0a30;
          color: white;
          padding: 0;
        }
        
        .taproot-alpha-wrapper {
          width: 100%;
          background-color: rgba(13, 7, 25, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          margin: 2rem 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 1280px;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .taproot-alpha-wrapper::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 700px;
          height: 700px;
          background-image: url('/tiger-logo.png');
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.08;
          transform: rotate(15deg);
          z-index: -1;
          pointer-events: none;
        }
        
        .background-image-container {
          display: none;
        }
        
        .taproot-alpha-container {
          width: 100%;
          background-color: rgba(26, 10, 48, 0.7);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 107, 0, 0.2);
          position: relative;
          z-index: 1;
        }
        
        /* Styling voor de hoofdtitel */
        .main-title {
          display: none; /* Helemaal verbergen in plaats van leeg tonen */
        }
        
        .icon {
          font-size: 1.8rem;
        }
        
        /* Styling voor de missie beschrijving container */
        .missions-description-container {
          background: rgba(13, 7, 25, 0.5);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 0 0 1.5rem 0;
        }
        
        .missions-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ff6b00;
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
          border: 1px solid rgba(255, 107, 0, 0.3);
          padding: 0.8rem;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #ccc;
          border-radius: 4px;
        }
        
        .status-message.success {
          color: #ff6b00;
        }
        
        .mission-banner {
          position: relative;
          width: 100%;
          height: auto;
          overflow: hidden;
          margin: 0;
          margin-bottom: 1.5rem;
          max-height: 280px; /* Maximum hoogte voor desktop */
        }
        
        .banner-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          filter: brightness(0.7);
          max-height: 280px; /* Zelfde max-height als container */
        }
        
        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
        }
        
        .mission-title h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 2.5rem;
          color: white;
          text-shadow: 0 0 10px rgba(255, 107, 0, 0.7);
          margin: 0;
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
          border: 1px solid rgba(255, 107, 0, 0.5);
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
          color: #ff6b00;
          text-shadow: 0 0 5px rgba(255, 107, 0, 0.7);
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
          border: 1px solid rgba(255, 107, 0, 0.5);
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
          padding: 0;
          margin-bottom: 2rem;
        }
        
        .rewards-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 107, 0, 0.3);
        }
        
        .rewards-container h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ff6b00;
          margin: 0 0 1.5rem 0;
          text-align: center;
        }
        
        .rewards-cards {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .reward-card {
          background: rgba(26, 10, 48, 0.7);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          align-items: center;
          flex: 1;
          border: 1px solid #ff6b00;
        }
        
        .reward-icon {
          width: 70px;
          height: 70px;
          margin-right: 1rem;
        }
        
        .tiger-icon {
          width: 90px;
          height: 90px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .bones-logo {
          border-radius: 50%;
          border: 2px solid rgba(255, 107, 0, 0.7);
          box-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
        }
        
        .reward-info {
          flex: 1;
        }
        
        .reward-info h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ff6b00;
          margin: 0 0 0.5rem 0;
        }
        
        .reward-info p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #aaa;
          margin: 0 0 0.8rem 0;
        }
        
        .reward-amount {
          display: block;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #4afc4a;
        }
        
        .ordinals-section {
          padding: 0;
          margin-bottom: 2rem;
        }
        
        .ordinals-section h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ff6b00;
          margin: 0 0 1.5rem 0;
          text-align: center;
          border-bottom: 1px solid rgba(255, 107, 0, 0.3);
          padding-bottom: 0.8rem;
        }
        
        .ordinal-category {
          margin-bottom: 2.5rem;
        }
        
        .ordinal-category h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: white;
          margin: 0 0 1rem 0;
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 4px;
          display: inline-block;
        }
        
        .ordinals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.2rem;
          margin: 1rem 0;
        }
        
        .ordinal-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .ordinal-item:hover:not(.on-mission) {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(255, 107, 0, 0.2);
          border-color: rgba(255, 107, 0, 0.6);
        }
        
        .ordinal-item.selected {
          border-color: #4afc4a;
          box-shadow: 0 0 15px rgba(74, 252, 74, 0.3);
          background: rgba(74, 252, 74, 0.1);
        }
        
        .ordinal-item.on-mission {
          border-color: #ff6b6b;
          box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
          background: rgba(255, 107, 107, 0.1);
          cursor: not-allowed;
        }
        
        .ordinal-name {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: white;
          text-align: center;
          margin-top: 0.8rem;
          line-height: 1.4;
        }
        
        .mission-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          font-size: 0.5rem;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          font-family: 'Press Start 2P', monospace;
          border: 1px solid rgba(255, 107, 107, 0.5);
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.9);
        }
        
        .ordinal-timer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          text-align: center;
          color: white;
        }
        
        .timer-label {
          font-size: 0.5rem;
          color: #aaa;
          margin-bottom: 0.2rem;
        }
        
        .timer-value {
          font-size: 0.6rem;
          color: #ff6b00;
          margin-bottom: 0.2rem;
        }
        
        .timer-value.ready {
          color: #4afc4a;
          font-weight: bold;
        }
        
        .timer-rewards {
          font-size: 0.55rem;
          color: #4afc4a;
        }
        
        /* Debug section styling */
        .debug-section {
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid #ff0000;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.8rem;
          color: #ffffff;
        }
        
        .debug-section h4 {
          color: #ff0000;
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-family: monospace;
          font-size: 1rem;
        }
        
        .debug-section p {
          margin: 0.3rem 0;
          font-family: monospace;
        }
        
        .debug-button {
          background: #ff0000;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          margin-top: 0.5rem;
          border-radius: 4px;
          font-family: monospace;
          cursor: pointer;
        }
        
        .debug-button:hover {
          background: #cc0000;
        }
        
        .mission-controls {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        
        .selection-summary {
          margin-bottom: 1.5rem;
        }
        
        .selection-summary h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #ff6b00;
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
          border: 1px solid rgba(255, 107, 0, 0.2);
        }
        
        .start-mission-button {
          background: linear-gradient(to bottom, #ff6b00, #e65c00);
          color: #000;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          padding: 1.2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          text-transform: uppercase;
          transition: all 0.3s;
          box-shadow: 0 4px 0 #b35000;
        }
        
        .start-mission-button:hover:not(:disabled) {
          background: linear-gradient(to bottom, #ff8a3d, #ff6b00);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #b35000;
        }
        
        .start-mission-button:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #b35000;
        }
        
        .start-mission-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .mission-message {
          padding: 1rem;
          margin: 1.5rem 0;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          background: rgba(255, 107, 0, 0.1);
          color: #ff6b00;
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        }
        
        .no-items {
          grid-column: 1 / -1;
          padding: 2rem;
          text-align: center;
          color: #aaa;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px dashed rgba(255, 107, 0, 0.2);
        }
        
        .mission-note {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border: 1px dashed rgba(255, 107, 0, 0.4);
          text-align: center;
        }
        
        .mission-note p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #ff6b00;
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        
        .instruction-banner {
          margin: 0 0 1.5rem 0;
          padding: 1.2rem;
          background-color: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 107, 0, 0.4);
          border-radius: 8px;
          color: white;
        }
        
        .instruction-banner h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #ff6b00;
          margin: 0 0 1rem 0;
          text-align: center;
        }
        
        .instruction-steps {
          padding-left: 2rem;
          margin-bottom: 1rem;
        }
        
        .instruction-steps li {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.8rem;
          line-height: 1.4;
        }
        
        .instruction-note {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          text-align: center;
          color: #ff6b00;
          margin: 0.8rem 0 0 0;
          padding: 0.5rem;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        
        .taproot-container {
          width: 180px;
          height: 180px;
          position: relative;
        }
        
        .claim-button {
          background: linear-gradient(to bottom, #ff6b00, #e65c00);
          color: #000;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.3rem;
          text-transform: uppercase;
          box-shadow: 0 2px 0 #b35000;
        }
        
        .claim-button:hover {
          background: linear-gradient(to bottom, #ff8a3d, #ff6b00);
          transform: translateY(-1px);
          box-shadow: 0 3px 0 #b35000;
        }
        
        .claim-button:active {
          transform: translateY(1px);
          box-shadow: 0 1px 0 #b35000;
        }
        
        /* Claim Reveal Styles */
        .claim-reveal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        .claim-reveal-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 90%;
        }
        
        .claim-reveal-box {
          background: rgba(26, 10, 48, 0.95);
          border-radius: 12px;
          padding: 2.5rem;
          border: 4px solid #ff6b00;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 350px;
          box-shadow: 0 0 30px rgba(255, 107, 0, 0.5);
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .chest-image-container {
          margin: 1.5rem 0;
          position: relative;
          height: 250px;
          width: 250px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .spinning-chest {
          animation: spin 2s linear infinite;
        }
        
        .reward-chest {
          animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .chest-low {
          filter: drop-shadow(0 0 10px rgba(255, 107, 0, 0.7));
        }
        
        .chest-high {
          filter: drop-shadow(0 0 15px rgba(74, 252, 74, 0.7));
        }
        
        .chest-jackpot {
          filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.7));
          animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), pulse 1s infinite alternate;
        }
        
        .claim-reveal-box h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ff6b00;
          margin: 0 0 1rem 0;
          text-align: center;
        }
        
        .claim-reveal-box.low-roll {
          border-color: #ff6b00;
          box-shadow: 0 0 30px rgba(255, 107, 0, 0.5);
        }
        
        .claim-reveal-box.high-roll {
          border-color: #4afc4a;
          box-shadow: 0 0 30px rgba(74, 252, 74, 0.5);
        }
        
        .claim-reveal-box.jackpot {
          border-color: #ff00ff;
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
          animation: pulse 1s infinite alternate, scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .claim-amount {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1rem 0;
        }
        
        .sats-amount {
          font-family: 'Press Start 2P', monospace;
          font-size: 2.5rem;
          color: white;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .sats-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #aaa;
          margin-top: 0.5rem;
        }
        
        .claim-message {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ff6b00;
          margin: 1rem 0 0 0;
          text-align: center;
        }
        
        /* Responsive Styling */
        @media (max-width: 768px) {
          .mission-title h2 {
            font-size: 1.5rem;
          }
          
          .main-title {
            padding: 1rem 0;
          }
          
          .main-title iframe {
            width: 120px;
            height: 120px;
          }
          
          .banner-overlay {
            padding: 1rem;
          }
          
          .mission-banner {
            height: auto;
            margin-bottom: 1rem;
            min-height: 250px; /* Kleinere minimale hoogte voor tablets */
            max-height: 250px; /* Maximum hoogte voor tablets */
          }
          
          .mission-banner .banner-image {
            height: 100%;
            width: 100%;
            min-height: 250px;
            max-height: 250px;
            object-fit: cover;
            object-position: center;
          }
          
          .countdown-value {
            font-size: 1.2rem;
          }
          
          .countdown-label {
            font-size: 0.5rem;
          }
          
          .stat-label {
            font-size: 0.6rem;
          }
          
          .stat-value {
            font-size: 1.2rem;
          }
          
          .countdown-container {
            gap: 0.5rem;
            width: 90%;
            margin: 0 auto;
          }
          
          .active-stats {
            gap: 0.8rem;
            width: 90%;
            margin: 0 auto;
          }
          
          .rewards-cards {
            flex-direction: column;
          }
          
          .selected-info {
            flex-direction: column;
            gap: 0.8rem;
            align-items: center;
          }
          
          .start-mission-button {
            font-size: 0.7rem;
            padding: 0.8rem;
          }
          
          .ordinals-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }
        
        @media (max-width: 480px) {
          .taproot-alpha-container {
            padding: 0.5rem;
          }
          
          .main-title iframe {
            width: 100px;
            height: 100px;
          }
          
          .mission-banner {
            min-height: 200px;
            max-height: 200px;
          }
          
          .mission-banner .banner-image {
            min-height: 200px;
            max-height: 200px;
          }
          
          .mission-stats {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 0.8rem;
          }
          
          .countdown-container, .active-stats {
            width: 100%;
            padding: 0.5rem;
          }
          
          .countdown-item {
            min-width: 50px;
          }
          
          .stat-item {
            min-width: 100px;
          }
          
          .active-stats {
            margin-top: 0.5rem;
          }
          
          .ordinals-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 0.8rem;
          }
          
          .reward-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .reward-icon {
            margin-right: 0;
            margin-bottom: 1rem;
          }
        }
        
        /* Animaties */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 0, 255, 0.7)); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.9)); }
        }
        
        /* Styling voor de debug-tiger-list */
        .debug-tiger-list {
          margin-top: 0.8rem;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid #ff0000;
          border-radius: 4px;
        }
        
        .debug-tiger-list h5 {
          color: #ff0000;
          margin: 0 0 0.5rem 0;
          font-family: monospace;
          font-size: 0.9rem;
        }
        
        .debug-tiger-list ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
          max-height: 100px;
          overflow-y: auto;
        }
        
        .debug-tiger-list li {
          font-family: monospace;
          font-size: 0.8rem;
          padding: 0.2rem 0;
          border-bottom: 1px dotted rgba(255, 0, 0, 0.3);
        }
        
        /* Debug controls styling */
        .debug-controls {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        
        .reset-button {
          padding: 0.5rem 1rem;
          background-color: #ff0000;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .reset-button:hover {
          background-color: #cc0000;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default TaprootAlphaMissions; 