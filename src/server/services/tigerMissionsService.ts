import { getRandomInt } from '@/utils/mathUtils';

// In-memory database voor missies en gestakete tigers/guardians
const MISSIONS_DB = new Map<string, { 
  id: string;
  name: string;
  requiredCollections: { name: string, count: number }[];
  rewardMultiplier: number;
}>();

// Actieve missies per wallet
const ACTIVE_MISSIONS = new Map<string, { [missionId: string]: string[] }>();

// Missie rewards (chests) per wallet
const MISSION_REWARDS = new Map<string, { [missionId: string]: number }>();

// Tijden van laatste mission check per wallet
const MISSION_LAST_CHECKED = new Map<string, { [missionId: string]: number }>();

// Definieer de basis missies
MISSIONS_DB.set('tiger-guardian-team', {
  id: 'tiger-guardian-team',
  name: 'Tiger Guardian Team',
  requiredCollections: [
    { name: 'Bitcoin Tiger', count: 1 },
    { name: 'Rune Guardian', count: 1 }
  ],
  rewardMultiplier: 2
});

// Taproot Alpha missie toevoegen
MISSIONS_DB.set('taproot-alpha-team', {
  id: 'taproot-alpha-team',
  name: 'Taproot Alpha Team',
  requiredCollections: [
    { name: 'Taproot Alpha', count: 1 }
  ],
  rewardMultiplier: 3  // Hogere beloning voor Taproot Alpha's
});

// Helper om missie rewards te updaten
export const updateMissionRewards = (walletAddress: string): void => {
  const now = Date.now();
  const activeMissions = ACTIVE_MISSIONS.get(walletAddress) || {};
  const lastChecked = MISSION_LAST_CHECKED.get(walletAddress) || {};
  const rewards = MISSION_REWARDS.get(walletAddress) || {};
  
  // Controleer elke actieve missie
  Object.keys(activeMissions).forEach(missionId => {
    const mission = MISSIONS_DB.get(missionId);
    if (!mission) return;
    
    const lastCheckTime = lastChecked[missionId] || now;
    const elapsedTimeMs = now - lastCheckTime;
    
    // ALLEEN VOOR ONTWIKKELING: Korte test interval van 10 seconden
    // In productie moet dit 1 dag zijn (86400000 ms)
    const MISSION_REWARD_INTERVAL_MS = 10000; // 10 seconden voor test
    
    // Bereken nieuwe reward chests gebaseerd op de tijd en multiplier
    const newChests = Math.floor(elapsedTimeMs / MISSION_REWARD_INTERVAL_MS) * mission.rewardMultiplier;
    
    if (newChests > 0) {
      // Voeg nieuwe chests toe
      rewards[missionId] = (rewards[missionId] || 0) + newChests;
      
      // Update last checked time
      lastChecked[missionId] = now - (elapsedTimeMs % MISSION_REWARD_INTERVAL_MS);
    }
  });
  
  // Sla de updates op
  MISSION_REWARDS.set(walletAddress, rewards);
  MISSION_LAST_CHECKED.set(walletAddress, lastChecked);
};

// Verkrijg mission status voor een wallet
export const getMissionStatus = (walletAddress: string) => {
  // Zorg ervoor dat rewards up-to-date zijn
  updateMissionRewards(walletAddress);
  
  return {
    activeMissions: ACTIVE_MISSIONS.get(walletAddress) || {},
    rewards: MISSION_REWARDS.get(walletAddress) || {}
  };
};

// Start een nieuwe missie
export const startMission = (walletAddress: string, missionId: string, tigerIds: string[]) => {
  // Check of missie bestaat
  const mission = MISSIONS_DB.get(missionId);
  if (!mission) {
    throw new Error('Mission not found');
  }
  
  // Check of er al een actieve missie is voor deze wallet
  const activeMissions = ACTIVE_MISSIONS.get(walletAddress) || {};
  
  // Sla de missie op
  activeMissions[missionId] = tigerIds;
  ACTIVE_MISSIONS.set(walletAddress, activeMissions);
  
  // Initialiseer last checked time
  const lastChecked = MISSION_LAST_CHECKED.get(walletAddress) || {};
  lastChecked[missionId] = Date.now();
  MISSION_LAST_CHECKED.set(walletAddress, lastChecked);
  
  return getMissionStatus(walletAddress);
};

// Beëindig een missie
export const endMission = (walletAddress: string, missionId: string) => {
  // Zorg ervoor dat rewards up-to-date zijn voordat de missie eindigt
  updateMissionRewards(walletAddress);
  
  // Verwijder de missie uit actieve missies
  const activeMissions = ACTIVE_MISSIONS.get(walletAddress) || {};
  delete activeMissions[missionId];
  ACTIVE_MISSIONS.set(walletAddress, activeMissions);
  
  return getMissionStatus(walletAddress);
};

// Claim missie rewards
export const claimMissionReward = (walletAddress: string, missionId: string) => {
  // Zorg ervoor dat rewards up-to-date zijn
  updateMissionRewards(walletAddress);
  
  // Haal huidige rewards op
  const rewards = MISSION_REWARDS.get(walletAddress) || {};
  const chests = rewards[missionId] || 0;
  
  if (chests <= 0) {
    throw new Error('No rewards available for this mission');
  }
  
  // Bereken satoshi reward
  const baseReward = getRandomInt(100, 500);
  const mission = MISSIONS_DB.get(missionId);
  const multiplier = mission ? mission.rewardMultiplier : 1;
  const satoshisAmount = baseReward * multiplier * chests;
  
  // Reset rewards voor deze missie
  rewards[missionId] = 0;
  MISSION_REWARDS.set(walletAddress, rewards);
  
  return {
    success: true,
    satoshisAmount,
    chestsClaimed: chests,
    missionId
  };
};

// Exporteer de missies data
export const getMissions = () => {
  return Array.from(MISSIONS_DB.values());
}; 