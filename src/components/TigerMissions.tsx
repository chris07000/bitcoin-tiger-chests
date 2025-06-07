import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useLightning } from '@/context/LightningContext';
import { isTaprootAlpha } from '@/components/TaprootAlphaMissions';

interface MissionProps {
  walletAddress: string;
  userTigers: any[];
  stakedTigers: any[];
  onStake: (tigerId: string, missionId: string) => Promise<any>;
  onUnstake: (tigerId: string) => Promise<any>;
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

const TigerMissions: React.FC<MissionProps> = ({ 
  walletAddress, 
  userTigers, 
  stakedTigers,
  onStake, 
  onUnstake,
  onRefresh,
  // Default waarden voor de banner configuratie
  bannerCountdown = { days: 6, hours: 23, mins: 59, secs: 55 },
  bannerTitle = "Tiger Guardian Team",
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
  
  // State om de timer voor elke gestakede tiger bij te houden
  const [tigerTimers, setTigerTimers] = useState<{[tigerId: string]: number}>({});
  
  // Lokale state voor gestakede tigers
  const [localStakedTigers, setLocalStakedTigers] = useState<any[]>([]);

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
  
  // Helper functie om localStakedTigers te laden vanuit localStorage
  const loadLocalStakedTigers = () => {
    if (!walletAddress) return;
    
    try {
      // Eerst controleren of er tigers zijn in de stakedTigers prop (komt uit Prisma)
      if (stakedTigers && stakedTigers.length > 0) {
        console.log('Using staked tigers from props (Prisma database):', stakedTigers);
        
        // Converteer de tigers naar het juiste format
        const propTigers = stakedTigers.map(tiger => ({
          id: tiger.id,
          name: tiger.name || `Tiger #${tiger.id.substring(0, 8)}`,
          image: tiger.image || '',
          isRuneGuardian: tiger.isRuneGuardian || false,
          stakedAt: typeof tiger.stakedAt === 'number' ? tiger.stakedAt : Date.now(),
          nextChestAt: typeof tiger.nextChestAt === 'number' ? tiger.nextChestAt : (Date.now() + 10000),
          key: `staked-${tiger.id}`
        }));
        
        setLocalStakedTigers(propTigers);
        return;
      }
      
      // Als alternatief, probeer ze uit localStorage te halen
      const tigerStakingData = localStorage.getItem('tigerStakingDB');
      if (tigerStakingData) {
        const parsedData = JSON.parse(tigerStakingData);
        console.log('Parsed tiger staking data from localStorage:', parsedData);
        
        if (parsedData.stakedTigers && parsedData.stakedTigers[walletAddress]) {
          const walletStakedTigers = parsedData.stakedTigers[walletAddress];
          
          // Converteer naar array van gestakede tigers
          const displayStakedTigers = Object.entries(walletStakedTigers).map(([tigerId, info]: [string, any]) => ({
            id: tigerId,
            name: info.name || `Tiger #${tigerId.substring(0, 8)}`,
            image: info.image || '',
            isRuneGuardian: info.isRuneGuardian || false,
            stakedAt: info.stakedAt || Date.now(),
            nextChestAt: info.nextChestAt || (Date.now() + 10000),
            key: `staked-${tigerId}`
          }));
          
          console.log(`Found ${displayStakedTigers.length} staked tigers in localStorage:`, displayStakedTigers);
          
          // Update de lokale state
          setLocalStakedTigers(displayStakedTigers);
        } else {
          // Clear the local staked tigers if there are none in localStorage
          setLocalStakedTigers([]);
        }
      } else {
        // Clear the local staked tigers if tigerStakingDB doesn't exist
        setLocalStakedTigers([]);
      }
    } catch (error) {
      console.error('Error loading tiger staking data:', error);
      // On error, reset the local state
      setLocalStakedTigers([]);
    }
  };
  
  useEffect(() => {
    // Laad gestakede tigers bij initialisatie
    loadLocalStakedTigers();
    
    // Start een timer voor het bijwerken van de countdown voor elke tiger
    const timerInterval = setInterval(() => {
      const now = Date.now();
      
      // Bijwerken van de tigers in de localStorage
      try {
        const tigerStakingData = localStorage.getItem('tigerStakingDB');
        if (tigerStakingData) {
          const parsedData = JSON.parse(tigerStakingData);
          
          if (parsedData.stakedTigers && parsedData.stakedTigers[walletAddress]) {
            const walletStakedTigers = parsedData.stakedTigers[walletAddress];
            let needsUpdate = false;
            
            // Bereken voor elke tiger de resterende tijd
            const newTimers: {[tigerId: string]: number} = {};
            
            // Loop door alle gestakede tigers
            Object.entries(walletStakedTigers).forEach(([tigerId, info]: [string, any]) => {
              const nextChestTime = info.nextChestAt;
              const remainingTime = Math.max(0, nextChestTime - now);
              
              newTimers[tigerId] = remainingTime;
              
              // Check of tiger klaar is voor claimen
              if (remainingTime <= 0 && info.nextChestAt > 0) {
                console.log(`Tiger ${tigerId} is klaar voor claimen!`);
                // We markeren alleen dat er een update nodig is, maar unstaken niet automatisch
                needsUpdate = true;
              }
            });
            
            // Update de timer state
            setTigerTimers(newTimers);
            
            // Als één van de tigers klaar is, refresh de UI
            if (needsUpdate) {
              loadLocalStakedTigers();
            }
          }
        }
      } catch (error) {
        console.error('Error bij het bijwerken van tiger timers:', error);
      }
    }, 500); // Update elke halve seconde voor vloeiendere countdown
    
    // Extra interval om tigers te laden vanuit localStorage
    const refreshInterval = setInterval(() => {
      loadLocalStakedTigers();
    }, 5000); // Elke 5 seconden verversen
    
    // Cleanup beide intervals
    return () => {
      clearInterval(timerInterval);
      clearInterval(refreshInterval);
    };
  }, [walletAddress]);
  
  // Extra useEffect om tigers in te laden wanneer de pagina wordt geladen of na staking/unstaking
  useEffect(() => {
    loadLocalStakedTigers();
  }, [walletAddress, userTigers, stakedTigers]);
  
  // Effect voor automatische refresh na een staking/claim operatie
  useEffect(() => {
    if (message.includes("succesvol") || message.includes("voltooid")) {
      // Na een succesvolle operatie, wacht even en ververs dan
      const refreshTimer = setTimeout(() => {
        loadLocalStakedTigers();
      }, 1000);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [message]);
  
  useEffect(() => {
    console.log('TigerMissions component loaded with data:', {
      walletAddress,
      userTigersCount: userTigers.length,
      stakedTigersCount: stakedTigers.length
    });
    
    // Log available ordinals for debugging
    const guardians = userTigers.filter(tiger => isRuneGuardian(tiger));
    const tigers = userTigers.filter(tiger => !isRuneGuardian(tiger));
    
    console.log(`Available ordinals: ${guardians.length} Rune Guardians and ${tigers.length} Bitcoin Tigers`);
    console.log('All user tigers:', userTigers);
    console.log('All staked tigers:', stakedTigers);
    
    // Calculate active mission data op basis van localStakedTigers
    setActiveMissionData({
      activeTigers: localStakedTigers.filter(t => !isRuneGuardian(t)).length,
      activeGuardians: localStakedTigers.filter(isRuneGuardian).length,
      totalPower: localStakedTigers.length * 420,
      estimatedRewards: localStakedTigers.length * 100
    });
    
  }, [walletAddress, userTigers, stakedTigers, localStakedTigers]);
  
  // Helper function to check if an ordinal is a Rune Guardian
  const isRuneGuardian = (tiger: any): boolean => {
    // Skip invalid tigers
    if (!tiger) return false;
    
    // Debug log to understand how isRuneGuardian is classifying tigers
    console.log(`Checking if tiger is a Rune Guardian:`, {
      name: tiger.name,
      id: tiger.id,
      isRuneGuardian: tiger.isRuneGuardian,
      collection: tiger.collection,
      pattern: tiger.pattern
    });
    
    // Perform multiple checks to maximize chance of correctly identifying a Rune Guardian
    const explicitFlag = tiger.isRuneGuardian === true;
    
    const nameCheck = tiger.name && 
      (tiger.name.toLowerCase().includes('guardian') || 
       tiger.name.toLowerCase().includes('rune'));
       
    const collectionCheck = tiger.collection && 
      (tiger.collection.toLowerCase().includes('guardian') || 
       tiger.collection.toLowerCase().includes('rune'));
       
    const patternCheck = tiger.pattern && 
      (tiger.pattern.toLowerCase().includes('guardian') || 
       tiger.pattern.toLowerCase().includes('rune'));
    
    // ID check for known IDs
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
    
    // Combine all checks - if any check passes, it's a guardian
    const isGuardian = explicitFlag || nameCheck || collectionCheck || patternCheck || idCheck;
    
    console.log(`Guardian classification result for ${tiger.id}: ${isGuardian ? 'IS a guardian' : 'NOT a guardian'}`);
    
    return isGuardian;
  };
  
  // Helper function to render either a Bitcoin Tiger or Rune Guardian
  const renderTigerOrGuardian = (tiger: any) => {
    if (isRuneGuardian(tiger)) {
      return (
        <div className="guardian-container">
          <iframe
            src={`https://ordinals.com/content/${tiger.id}`}
            title={tiger.name}
            width={180}
            height={180}
            style={{
              border: '1px solid #4a4afc',
              borderRadius: '8px',
              backgroundColor: 'rgba(74, 74, 252, 0.1)',
              pointerEvents: 'none'
            }}
            sandbox="allow-scripts"
            loading="lazy"
            onError={() => {
              console.log(`Failed to load Rune Guardian iframe: ${tiger.id}`);
            }}
          />
        </div>
      );
    } else {
      return (
        <Image 
          src={tiger.image || ''} 
          alt={tiger.name}
          width={180}
          height={180}
          className="tiger-image"
          style={{
            border: '1px solid #ffd700',
            borderRadius: '8px',
            backgroundColor: '#000',
            opacity: tiger.image ? 1 : 0.7
          }}
          unoptimized={true}
          onError={(e) => {
            console.log(`Failed to load Tiger image: ${tiger.image}`);
            // Don't use fallback, just mark as failed and let it retry
            (e.target as HTMLImageElement).style.opacity = '0.5';
            (e.target as HTMLImageElement).style.filter = 'grayscale(0.5)';
          }}
        />
      );
    }
  };
  
  // Toggle selection of an ordinal
  const toggleSelectOrdinal = (tigerId: string) => {
    setSelectedOrdinals(prev => {
      if (prev.includes(tigerId)) {
        return prev.filter(id => id !== tigerId);
      } else {
        return [...prev, tigerId];
      }
    });
  };
  
  // Functie om een tiger te staken voor een missie
  const startGuardianMission = async () => {
    // Reset message
    setMessage("");
    
    // Log selected ordinals for debugging
    console.log("[MISSION DEBUG] Starting mission with selected ordinals:", selectedOrdinals);
    
    if (selectedOrdinals.length < 2) {
      setMessage("Select at least one Bitcoin Tiger and one Rune Guardian to start a mission");
      return;
    }
    
    // Check if we have at least one Tiger and one Guardian
    const selectedTigers = userTigers.filter(tiger => selectedOrdinals.includes(tiger.id));
    console.log("[MISSION DEBUG] Selected tigers objects:", selectedTigers);
    
    // Add more detailed logging for proper classification
    const tigerClassification = selectedTigers.map(tiger => ({
      id: tiger.id, 
      name: tiger.name, 
      isRuneGuardian: isRuneGuardian(tiger)
    }));
    console.log("[MISSION DEBUG] Tiger classification:", tigerClassification);
    
    const hasTiger = selectedTigers.some(tiger => !isRuneGuardian(tiger));
    const hasGuardian = selectedTigers.some(isRuneGuardian);
    
    console.log("[MISSION DEBUG] Has tiger:", hasTiger);
    console.log("[MISSION DEBUG] Has guardian:", hasGuardian);
    
    if (!hasTiger || !hasGuardian) {
      const message = `Je hebt minimaal 1 Bitcoin Tiger EN 1 Rune Guardian nodig voor een missie. 
        Geselecteerd: ${hasTiger ? '✓' : '✗'} Bitcoin Tiger, ${hasGuardian ? '✓' : '✗'} Rune Guardian`;
      setMessage(message);
      return;
    }
    
    // Show immediate feedback to user
    setMessage("📝 Mission is starting, please wait...");
    setLoading(true);
    
    try {
      // Debug payload
      const payload = {
        walletAddress,
        missionId: 'tiger-guardian-team',
        tigerIds: selectedOrdinals
      };
      
      console.log("[MISSION DEBUG] Sending API request to /api/tiger-missions/start with payload:", payload);
      
      // Call the actual staking function for each selected ordinal individually
      // This is a more direct approach rather than using the mission API
      let stakingSuccessCount = 0;
      
      // Controleer tigerStakingDB voor eerder gestakede tigers
      const checkCurrentStaked = () => {
        try {
          const tigerStakingData = localStorage.getItem('tigerStakingDB');
          if (tigerStakingData) {
            const parsedData = JSON.parse(tigerStakingData);
            console.log('[MISSION DEBUG] Current tigerStakingDB before staking:', parsedData);
          }
        } catch (err) {
          console.error('[MISSION ERROR] Error checking staking DB:', err);
        }
      };
      
      // Check staking DB before staking
      checkCurrentStaked();
      
      for (const tigerId of selectedOrdinals) {
        try {
          console.log(`[MISSION DEBUG] Calling onStake for tiger ID: ${tigerId}`);
          
          // Direct call to the staking functionality
          const result = await onStake(tigerId, 'tiger-guardian-team');
          console.log(`[MISSION DEBUG] Staking result for ${tigerId}:`, result);
          stakingSuccessCount++;
          
          // Check staking DB after each successful stake to confirm it was added
          checkCurrentStaked();
        } catch (err) {
          console.error(`[MISSION ERROR] Failed to stake tiger ${tigerId}:`, err);
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
          console.error("[MISSION ERROR] Mission API failed but tigers were staked:", missionErr);
        }
      }
      
      // Update UI with success message based on staking results
      if (stakingSuccessCount === selectedOrdinals.length) {
        setMessage(`✅ Mission started successfully! ${stakingSuccessCount} tigers/guardians have been staked.`);
      } else if (stakingSuccessCount > 0) {
        setMessage(`⚠️ Mission partially started. ${stakingSuccessCount} of ${selectedOrdinals.length} tigers/guardians have been staked.`);
      } else {
        throw new Error("None of the tigers or guardians could be staked");
      }
      
      // Clear selection
      setSelectedOrdinals([]);
      
      // Update active mission data with new values
      setActiveMissionData(prev => ({
        ...prev,
        activeTigers: prev.activeTigers + selectedTigers.filter(t => !isRuneGuardian(t)).length,
        activeGuardians: prev.activeGuardians + selectedTigers.filter(isRuneGuardian).length,
        totalPower: prev.totalPower + (selectedTigers.length * 420),
        estimatedRewards: prev.estimatedRewards + (selectedTigers.length * 100)
      }));
      
      // BELANGRIJK: Laad lokale opgeslagen tigers na de staking operatie
      loadLocalStakedTigers();
      
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
  const getStakedTigersFromLocalStorage = () => {
    if (!walletAddress) return [];
    
    try {
      const tigerStakingData = localStorage.getItem('tigerStakingDB');
      if (!tigerStakingData) return [];
      
      const parsedData = JSON.parse(tigerStakingData);
      if (!parsedData.stakedTigers || !parsedData.stakedTigers[walletAddress]) return [];
      
      const stakedTigerEntries = Object.entries(parsedData.stakedTigers[walletAddress]);
      if (stakedTigerEntries.length === 0) return [];
      
      // Converteer de localStorage data naar het juiste format
      const localStakedTigers = stakedTigerEntries.map(([tigerId, info]: [string, any]) => ({
        id: tigerId,
        name: info.name || `Tiger #${tigerId.substring(0, 8)}`,
        image: info.image || '',
        isRuneGuardian: info.isRuneGuardian || false,
        stakedAt: info.stakedAt || Date.now(),
        nextChestAt: info.nextChestAt || (Date.now() + 10000),
        key: `staked-${tigerId}`
      }));
      
      console.log(`[DEBUG] Found ${localStakedTigers.length} staked tigers in localStorage:`, localStakedTigers);
      return localStakedTigers;
    } catch (error) {
      console.error('Error loading staked tigers from localStorage:', error);
      return [];
    }
  };
  
  // Render staked tigers - combineer de props met localStorage data als nodig
  const getDisplayedStakedTigers = () => {
    if (stakedTigers.length > 0) {
      return stakedTigers;
    }
    
    // Als de prop leeg is, pak data uit localStorage
    return getStakedTigersFromLocalStorage();
  };

  // Functie om de weergegeven countdown voor een specifieke tiger te berekenen
  const getTigerCountdown = (tigerId: string) => {
    // Zorg ervoor dat we een timer voor deze tiger hebben
    if (!(tigerId in tigerTimers)) {
      // Als er geen timer is, zoek in de lokale tiger data
      const tiger = localStakedTigers.find(t => t.id === tigerId);
      if (tiger && tiger.nextChestAt) {
        const remainingTime = Math.max(0, tiger.nextChestAt - Date.now());
        return { value: remainingTime <= 0 ? "Ready!" : `${Math.ceil(remainingTime / 1000)}s`, isReady: remainingTime <= 0 };
      }
      return { value: "Loading...", isReady: false };
    }
    
    const remainingMs = tigerTimers[tigerId] || 0;
    
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
  
  // Update the refreshStakedTigers function to only update local state
  const refreshStakedTigers = () => {
    try {
      console.log("Updating local tiger state only, no page refresh");
      // Only load tigers from localStorage to update local state
      loadLocalStakedTigers();
      
      // Do NOT call onRefresh as it may be causing the page refresh
    } catch (error) {
      console.error("Error in refreshStakedTigers:", error);
    }
  };
  
  const handleClaimTiger = async (tiger: any, event?: React.MouseEvent) => {
    // Check if claiming is already in progress
    if (claimingInProgress) return;
    
    try {
      // Prevent default browser behaviors that might cause page refresh
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      // Store tiger ID for later use
      const tigerId = tiger.id;
      console.log("Starting claim process for tiger:", tigerId);
      
      // Mark as claiming to prevent double-clicks
      setClaimingInProgress(true);
      setClaimingTigerId(tigerId);
      
      // Show the claiming animation
      setClaimReward({
        amount: 0,
        isHighRoll: false,
        isJackpot: false,
        isClaiming: true,
        claimedTigerId: tigerId
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
        const tigerStakingData = localStorage.getItem('tigerStakingDB');
        if (tigerStakingData) {
          const parsedData = JSON.parse(tigerStakingData);
          
          if (parsedData.stakedTigers && parsedData.stakedTigers[walletAddress]) {
            const walletStakedTigers = parsedData.stakedTigers[walletAddress];
            
            // Remove the claimed tiger
            delete walletStakedTigers[tigerId];
            
            // Update localStorage immediately
            localStorage.setItem('tigerStakingDB', JSON.stringify(parsedData));
            console.log(`Removed tiger ${tigerId} from staking DB`);
          }
        }
      } catch (error) {
        console.error('Error updating tiger staking data:', error);
      }
      
      // Update local state immediately to remove the tiger from UI
      setLocalStakedTigers(prev => prev.filter(t => t.id !== tigerId));
      
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
            chestType: "tiger", 
            reward: rewardAmount,
            claimId: `tiger-${tigerId}-${Date.now()}`
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
        claimedTigerId: tigerId
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
      console.error("Error claiming tiger:", error);
      setShowClaimReveal(false);
      setClaimingInProgress(false);
      setClaimingTigerId(null);
      setMessage("Failed to claim tiger. Please try again.");
    }
  };

  return (
    <div className="tiger-missions">
      {/* Banner Section with Mission Stats */}
      <div className="mission-banner">
        <Image 
          src={bannerImage}
          alt={bannerTitle}
          width={1200}
          height={320}
          className="banner-image"
          priority
          unoptimized={true}
        />
        <div className="banner-overlay">
          <div className="mission-title">
            <h2>{bannerTitle}</h2>
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
                <span className="stat-label">Active Guardians</span>
                <span className="stat-value">{activeMissionData.activeGuardians}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission Rewards Section */}
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
                  src="/runeguardians.png" 
                  alt="Rune Guardian"
                  width={70}
                  height={70}
                  unoptimized={true}
                />
              </div>
              <div className="reward-info">
                <h4>GUARDIAN BONUS</h4>
                <p>Successful Staking</p>
                <span className="reward-amount">1 Chest with Satoshis</span>
              </div>
            </div>
          </div>
          
          <div className="mission-note">
            <p>Both a Bitcoin Tiger and a Rune Guardian must be staked together to qualify for rewards</p>
            <p>Total per mission: 2 Chests with BTC (satoshis)</p>
          </div>
        </div>
      </div>
      
      {/* Ordinals Display */}
      <div className="ordinals-section">
        <h3>Your Collection</h3>
        
        {/* Bitcoin Tigers */}
        <div className="ordinal-category">
          <h4>Bitcoin Tigers ({userTigers.filter(t => !isRuneGuardian(t) && !isTaprootAlpha(t) && !localStakedTigers.some(st => st.id === t.id)).length})</h4>
          <div className="ordinals-grid">
            {userTigers
              .filter(tiger => !isRuneGuardian(tiger) && !isTaprootAlpha(tiger) && !localStakedTigers.some(st => st.id === tiger.id))
              .map(tiger => {
                const isSelected = selectedOrdinals.includes(tiger.id);
                
                return (
                  <div 
                    key={tiger.key || tiger.id}
                    className={`ordinal-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelectOrdinal(tiger.id)}
                  >
                    {renderTigerOrGuardian(tiger)}
                    <div className="ordinal-name">{tiger.name}</div>
                  </div>
                );
              })}
            
            {userTigers.filter(t => !isRuneGuardian(t) && !isTaprootAlpha(t) && !localStakedTigers.some(st => st.id === t.id)).length === 0 && (
              <div className="no-items">No Bitcoin Tigers available</div>
            )}
          </div>
        </div>
        
        {/* Rune Guardians */}
        <div className="ordinal-category">
          <h4>Rune Guardians ({userTigers.filter(t => isRuneGuardian(t) && !isTaprootAlpha(t) && !localStakedTigers.some(st => st.id === t.id)).length})</h4>
          <div className="ordinals-grid">
            {userTigers
              .filter(tiger => isRuneGuardian(tiger) && !isTaprootAlpha(tiger) && !localStakedTigers.some(st => st.id === tiger.id))
              .map(guardian => {
                const isSelected = selectedOrdinals.includes(guardian.id);
                
                return (
                  <div 
                    key={guardian.key || guardian.id}
                    className={`ordinal-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelectOrdinal(guardian.id)}
                  >
                    {renderTigerOrGuardian(guardian)}
                    <div className="ordinal-name">{guardian.name}</div>
                  </div>
                );
              })}
            
            {userTigers.filter(t => isRuneGuardian(t) && !isTaprootAlpha(t) && !localStakedTigers.some(st => st.id === t.id)).length === 0 && (
              <div className="no-items">No Rune Guardians available</div>
            )}
          </div>
        </div>
        
        {/* Currently On Mission */}
        <div className="ordinal-category">
          <h4>Currently On Mission</h4>
          <div className="ordinals-grid">
            {localStakedTigers.map(tiger => {
              const countdown = getTigerCountdown(tiger.id);
              
              return (
                <div 
                  key={tiger.key || tiger.id}
                  className="ordinal-item on-mission"
                >
                  {renderTigerOrGuardian(tiger)}
                  <div className="ordinal-name">{tiger.name}</div>
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
                        onClick={(e) => handleClaimTiger(tiger, e)}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {localStakedTigers.length === 0 && (
              <div className="no-items">None of your ordinals were sent on this mission</div>
            )}
          </div>
        </div>
        
        {/* Mission Controls */}
        <div className="mission-controls">
          <div className="selection-summary">
            <h4>Selected for Mission: {selectedOrdinals.length} ordinals</h4>
            <div className="selected-info">
              <p>Bitcoin Tigers: {userTigers.filter(t => selectedOrdinals.includes(t.id) && !isRuneGuardian(t) && !isTaprootAlpha(t)).length}</p>
              <p>Rune Guardians: {userTigers.filter(t => selectedOrdinals.includes(t.id) && isRuneGuardian(t) && !isTaprootAlpha(t)).length}</p>
            </div>
          </div>
          
          <button 
            onClick={startGuardianMission}
            className="start-mission-button"
            disabled={loading || selectedOrdinals.length < 2}
          >
            {loading ? 'Starting Mission...' : 'Start Guardian Mission'}
          </button>
        </div>
      </div>
      
      {/* Instructie Banner */}
      <div className="instruction-banner">
        <h3>How Staking Works</h3>
        <ol className="instruction-steps">
          <li>Select at least 1 Bitcoin Tiger and 1 Rune Guardian</li>
          <li>Click "Start Guardian Mission" to stake them</li>
          <li>Your staked ordinals will automatically earn rewards</li>
          <li>Use the refresh button to update the status</li>
        </ol>
      </div>
      
      {/* Message Display */}
      {message && (
        <div className="mission-message">
          {message}
        </div>
      )}
      
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
      
      {/* Styling */}
      <style jsx>{`
        .tiger-missions {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background-color: #1a0a30;
          color: white;
        }
        
        .mission-banner {
          position: relative;
          width: 100%;
          height: auto;
          overflow: hidden;
          margin: 0;
          margin-bottom: 1.5rem;
        }
        
        .banner-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          filter: brightness(0.7);
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
          padding: 2rem;
        }
        
        .mission-title h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 2.5rem;
          color: white;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
          margin: 0;
        }
        
        .mission-stats {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
        }
        
        .countdown-container {
          display: flex;
          gap: 1rem;
        }
        
        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .countdown-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 2rem;
          color: #ffd700;
        }
        
        .countdown-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
          margin-top: 0.2rem;
        }
        
        .active-stats {
          display: flex;
          gap: 1.5rem;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .stat-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: white;
        }
        
        .stat-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.8rem;
          color: #4afc4a;
        }
        
        .rewards-section {
          padding: 0 1rem;
          margin-bottom: 2rem;
        }
        
        .rewards-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .rewards-container h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ffd700;
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
          border: 1px solid #ffd700;
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
        
        .reward-info {
          flex: 1;
        }
        
        .reward-info h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ffd700;
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
          padding: 0 1rem;
          margin-bottom: 2rem;
        }
        
        .ordinals-section h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ffd700;
          margin: 0 0 1.5rem 0;
          text-align: center;
          border-bottom: 1px solid rgba(255, 215, 0, 0.3);
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
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .ordinal-item:hover:not(.on-mission) {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.6);
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
          color: #ffd700;
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
        
        .mission-controls {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
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
          color: #ffd700;
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
          border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .start-mission-button {
          background: linear-gradient(to bottom, #ffd700, #e6c300);
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
          box-shadow: 0 4px 0 #b39700;
        }
        
        .start-mission-button:hover:not(:disabled) {
          background: linear-gradient(to bottom, #ffe34d, #ffd700);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #b39700;
        }
        
        .start-mission-button:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #b39700;
        }
        
        .start-mission-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .mission-message {
          padding: 1rem;
          margin: 1.5rem 1rem;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          background: rgba(255, 215, 0, 0.1);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.3);
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
          border: 1px dashed rgba(255, 215, 0, 0.2);
        }
        
        .mission-note {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border: 1px dashed rgba(255, 215, 0, 0.4);
          text-align: center;
        }
        
        .mission-note p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #ffd700;
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        
        /* Instruction banner styling */
        .instruction-banner {
          margin: 1rem;
          padding: 1.2rem;
          background-color: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(74, 252, 74, 0.4);
          border-radius: 8px;
          color: white;
        }
        
        .instruction-banner h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #4afc4a;
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
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .mission-title h2 {
            font-size: 1.5rem;
          }
          
          .banner-overlay {
            padding: 1rem;
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
          }
          
          .active-stats {
            gap: 0.8rem;
          }
          
          .mission-banner {
            height: auto;
            margin-bottom: 1rem;
          }
          
          .mission-banner .banner-image {
            height: auto;
            max-height: 200px;
            object-fit: cover;
            object-position: center;
          }
          
          .ordinals-section {
            padding: 0 0.5rem;
          }
          
          .rewards-section {
            padding: 0 0.5rem;
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
          
          .mission-note p {
            font-size: 0.5rem;
          }
          
          .instruction-banner h3 {
            font-size: 0.8rem;
          }
          
          .instruction-steps li {
            font-size: 0.55rem;
          }
        }
        
        .guardian-container {
          width: 180px;
          height: 180px;
          position: relative;
        }
        
        .claim-button {
          background: linear-gradient(to bottom, #ffd700, #e6c300);
          color: #000;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.3rem;
          text-transform: uppercase;
          box-shadow: 0 2px 0 #b39700;
        }
        
        .claim-button:hover {
          background: linear-gradient(to bottom, #ffe34d, #ffd700);
          transform: translateY(-1px);
          box-shadow: 0 3px 0 #b39700;
        }
        
        .claim-button:active {
          transform: translateY(1px);
          box-shadow: 0 1px 0 #b39700;
        }

        /* Status display styling */
        .status-display {
          display: none; /* Hide completely */
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
          border: 4px solid #ffd700;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 350px;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
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
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
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
          color: #ffd700;
          margin: 0 0 1rem 0;
          text-align: center;
        }
        
        .claim-reveal-box.low-roll {
          border-color: #ffd700;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
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
          color: #ffd700;
          margin: 1rem 0 0 0;
          text-align: center;
        }
        
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
      `}</style>
    </div>
  );
};

export default TigerMissions; 