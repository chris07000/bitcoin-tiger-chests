import { randomBytes } from 'crypto';

// Types voor staking
export type StakingStatus = {
  stakedAmount: number;
  rewards: number;
  stakedInfo: StakedInfo[];
};

export type StakedInfo = {
  id: string;
  stakedAt: number; 
  eligibleAt: number;
  isEligible: boolean;
  profitShare: number;
  rarity: ArtifactRarity;
  weight: number;
};

export type ArtifactRarity = 'GOLD' | 'SILVER' | 'BRONZE';

// Constantes voor staking
const ELIGIBILITY_PERIOD_DAYS = 7; // 7 dagen wachten voordat artifacts eligible zijn
const MIN_STAKING_PERIOD = 1; // Minimaal 1 dag staken
const ELIGIBILITY_REWARD_START_DATE = '2023-01-01'; // Startdatum voor eligibility
const DAILY_REWARD_RATE = 0.0005; // 0.05% per dag (apr ~18.25%)

// Artifact rariteit weights
const RARITY_WEIGHTS = {
  "GOLD": 5.0,    // 5 keer basis waarde
  "SILVER": 2.5,  // 2.5 keer basis waarde
  "BRONZE": 1.26  // 1.26 keer basis waarde
};

// Rariteit mapping voor bekende artifacts
// Dit zou normaal gesproken uit een database komen
const ARTIFACT_RARITY: Record<string, ArtifactRarity> = {
  // Gold artifacts (IDs 0-4)
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai0": "GOLD",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai1": "GOLD",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai2": "GOLD",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai3": "GOLD",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai4": "GOLD",
  // Silver artifacts (IDs 5-19)
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai5": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai6": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai7": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai8": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai9": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai10": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai11": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai12": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai13": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai14": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai15": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai16": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai17": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai18": "SILVER",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai19": "SILVER",
  // Bronze artifacts (IDs 20-49)
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai20": "BRONZE",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai21": "BRONZE",
  "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai22": "BRONZE"
};

// Helper functie om rariteit en weight van een artifact te bepalen
const getRarityInfo = (artifactId: string): { rarity: ArtifactRarity; weight: number } => {
  // Bepaal rariteit uit configuratie
  const rarityValue = ARTIFACT_RARITY[artifactId] || "BRONZE";
  const rarity = rarityValue as ArtifactRarity;
  
  // Bepaal weight op basis van rariteit
  const weight = RARITY_WEIGHTS[rarity];
  
  return { rarity, weight };
};

// Helper functie om profit distribution te berekenen volgens het gewogen systeem
const calculateProfitDistribution = (eligibleOrdinals: StakedInfo[], totalProfit: number) => {
  // Als er geen eligible ordinals zijn, return een lege distributie
  if (eligibleOrdinals.length === 0) {
    return {
      distributions: {},
      totalDistributed: 0,
      remainder: totalProfit
    };
  }
  
  // Stap 1: Bereken total weighted units
  let totalWeightedUnits = 0;
  const ordinalWeights: {[key: string]: number} = {};
  
  // Tel artifacts per rariteit
  const rarityCounts: {[key: string]: number} = {
    "GOLD": 0,
    "SILVER": 0,
    "BRONZE": 0
  };
  
  // Bereken gewicht voor elk ordinal
  eligibleOrdinals.forEach(ordinal => {
    ordinalWeights[ordinal.id] = ordinal.weight;
    totalWeightedUnits += ordinal.weight;
    
    // Tel aantal per rariteit
    if (rarityCounts[ordinal.rarity] !== undefined) {
      rarityCounts[ordinal.rarity] += 1;
    }
  });
  
  console.log('Total weighted units:', totalWeightedUnits);
  console.log('Rarity distribution:', rarityCounts);
  
  // Stap 2: Bereken waarde per weighted unit
  const valuePerUnit = totalProfit / totalWeightedUnits;
  console.log('Value per weighted unit:', valuePerUnit);
  
  // Stap 3 & 4: Bereken raw payout per artifact en rond af naar beneden
  const distributions: {[key: string]: number} = {};
  let totalDistributed = 0;
  
  // Bereken uitbetaling per rariteit voor logging
  const rarityPayouts: {[key: string]: number} = {};
  const rarityTotals: {[key: string]: number} = {};
  
  // Bereken uitbetaling voor elk ordinal
  eligibleOrdinals.forEach(ordinal => {
    const weight = ordinalWeights[ordinal.id];
    const rawPayout = weight * valuePerUnit;
    const finalPayout = Math.floor(rawPayout); // Afronden naar beneden
    
    distributions[ordinal.id] = finalPayout;
    totalDistributed += finalPayout;
    
    // Bijhouden van uitbetaling per rariteit voor logging
    if (!rarityPayouts[ordinal.rarity]) {
      rarityPayouts[ordinal.rarity] = finalPayout;
      rarityTotals[ordinal.rarity] = finalPayout;
    } else {
      rarityTotals[ordinal.rarity] += finalPayout;
    }
  });
  
  // Stap 6: Bereken remainder voor rollover
  const remainder = totalProfit - totalDistributed;
  
  // Log de resultaten
  console.log('Payout per rarity:', rarityPayouts);
  console.log('Total per rarity:', rarityTotals);
  console.log('Total distributed:', totalDistributed);
  console.log('Remainder for rollover:', remainder);
  
  return {
    distributions,
    totalDistributed,
    remainder
  };
};

// In-memory database simulatie voor ontwikkeling
// In productie zou dit vervangen worden door een echte database
type StakingDB = {
  stakedArtifacts: Map<string, Map<string, StakedInfo>>;  // wallet -> artifactId -> info
  walletBalances: Map<string, number>;                    // wallet -> balance
  walletRewards: Map<string, number>;                     // wallet -> unclaimed rewards
  claimedRewards: Map<string, number>;                    // wallet -> claimed rewards in total
  stakingHistory: Array<{                                 // Historische stakings
    walletAddress: string;
    artifactId: string;
    action: 'stake' | 'unstake' | 'claim';
    timestamp: number;
    amount?: number;
  }>;
};

// In-memory database initializeren
const stakingDB: StakingDB = {
  stakedArtifacts: new Map(),
  walletBalances: new Map(),
  walletRewards: new Map(),
  claimedRewards: new Map(),
  stakingHistory: []
};

// StakingService klasse voor het afhandelen van staking operaties
export class StakingService {
  // Get staking status voor een wallet
  async getStakingStatus(walletAddress: string): Promise<StakingStatus> {
    console.log(`Getting staking status for wallet: ${walletAddress}`);
    
    // Haal staked artifacts op uit database ZONDER updateEligibility aan te roepen
    let stakedInfo: StakedInfo[] = [];
    const stakedArtifactsMap = stakingDB.stakedArtifacts.get(walletAddress);
    
    if (stakedArtifactsMap) {
      stakedInfo = Array.from(stakedArtifactsMap.values());
    }
    
    // Haal rewards op (of initialiseer met 0)
    const rewards = stakingDB.walletRewards.get(walletAddress) || 0;
    
    // Totaal aantal gestakete artifacts (hier zou je eventueel ook sats kunnen tellen)
    const stakedAmount = stakedInfo.length;
    
    return {
      stakedAmount,
      rewards,
      stakedInfo
    };
  }
  
  // Stake een artifact
  async stakeArtifact(walletAddress: string, artifactId: string, artifactData: any): Promise<StakingStatus> {
    console.log(`Staking artifact ${artifactId} for wallet ${walletAddress}`);
    
    // Zorg ervoor dat de wallet in de database staat
    if (!stakingDB.stakedArtifacts.has(walletAddress)) {
      stakingDB.stakedArtifacts.set(walletAddress, new Map());
    }
    
    // Controleer of dit artifact niet al gestaked is
    const userStakedArtifacts = stakingDB.stakedArtifacts.get(walletAddress)!;
    if (userStakedArtifacts.has(artifactId)) {
      throw new Error('This artifact is already staked');
    }
    
    // Bereken de eligibility timestamp
    const now = Date.now();
    const eligibilityPeriod = ELIGIBILITY_PERIOD_DAYS * 24 * 60 * 60 * 1000; // dagen naar ms
    const eligibleAt = now + eligibilityPeriod;
    
    // Bepaal de rariteit en weight
    const { rarity, weight } = getRarityInfo(artifactId);
    
    // Voeg artifact toe aan staked artifacts
    userStakedArtifacts.set(artifactId, {
      id: artifactId,
      stakedAt: now,
      eligibleAt,
      isEligible: false, // Niet meteen eligible
      profitShare: 0, // Wordt bijgewerkt wanneer eligible
      rarity,
      weight
    });
    
    // Voeg toe aan staking geschiedenis
    stakingDB.stakingHistory.push({
      walletAddress,
      artifactId,
      action: 'stake',
      timestamp: now
    });
    
    // Return staking status direct zonder getStakingStatus aan te roepen
    const stakedInfo = Array.from(userStakedArtifacts.values());
    return {
      stakedAmount: stakedInfo.length,
      rewards: stakingDB.walletRewards.get(walletAddress) || 0,
      stakedInfo
    };
  }
  
  // Unstake een artifact
  async unstakeArtifact(walletAddress: string, artifactId: string): Promise<StakingStatus> {
    console.log(`Unstaking artifact ${artifactId} for wallet ${walletAddress}`);
    
    // Controleer of de wallet bestaat in database
    if (!stakingDB.stakedArtifacts.has(walletAddress)) {
      throw new Error('No staked artifacts found for this wallet');
    }
    
    // Controleer of dit artifact daadwerkelijk gestaked is door deze wallet
    const userStakedArtifacts = stakingDB.stakedArtifacts.get(walletAddress)!;
    if (!userStakedArtifacts.has(artifactId)) {
      throw new Error('This artifact is not staked by this wallet');
    }
    
    // Controleer of het artifact lang genoeg gestaked is
    const stakedInfo = userStakedArtifacts.get(artifactId)!;
    const now = Date.now();
    const stakingDuration = now - stakedInfo.stakedAt;
    const minStakingPeriod = MIN_STAKING_PERIOD * 24 * 60 * 60 * 1000; // dagen naar ms
    
    if (stakingDuration < minStakingPeriod) {
      throw new Error(`Artifact must be staked for at least ${MIN_STAKING_PERIOD} day(s)`);
    }
    
    // Verwijder artifact uit staked artifacts
    userStakedArtifacts.delete(artifactId);
    
    // Voeg toe aan staking geschiedenis
    stakingDB.stakingHistory.push({
      walletAddress,
      artifactId,
      action: 'unstake',
      timestamp: now
    });
    
    // Return staking status direct zonder getStakingStatus aan te roepen
    const updatedStakedInfo = Array.from(userStakedArtifacts.values());
    return {
      stakedAmount: updatedStakedInfo.length,
      rewards: stakingDB.walletRewards.get(walletAddress) || 0,
      stakedInfo: updatedStakedInfo
    };
  }
  
  // Claim rewards
  async claimRewards(walletAddress: string): Promise<{ success: boolean; amount: number; }> {
    console.log(`Claiming rewards for wallet ${walletAddress}`);
    
    // Update eligibility zelf, zonder getStakingStatus aan te roepen
    // Controleer of er rewards zijn om te claimen
    const rewards = stakingDB.walletRewards.get(walletAddress) || 0;
    
    if (rewards <= 0) {
      throw new Error('No rewards available to claim');
    }
    
    // Hier zou normaliter de logica komen om de rewards naar de wallet te sturen
    // Voor nu simuleren we dit door de rewards op te slaan in de 'claimed' geschiedenis
    
    const claimedTotal = stakingDB.claimedRewards.get(walletAddress) || 0;
    stakingDB.claimedRewards.set(walletAddress, claimedTotal + rewards);
    
    // Reset rewards naar 0 na claimen
    stakingDB.walletRewards.set(walletAddress, 0);
    
    // Voeg toe aan staking geschiedenis
    stakingDB.stakingHistory.push({
      walletAddress,
      artifactId: 'rewards',
      action: 'claim',
      timestamp: Date.now(),
      amount: rewards
    });
    
    return {
      success: true,
      amount: rewards
    };
  }
  
  // Update eligibility status voor alle gestakete artifacts
  async updateEligibility(walletAddress: string): Promise<StakingStatus> {
    console.log(`Updating eligibility for wallet ${walletAddress}`);
    
    const userStakedArtifacts = stakingDB.stakedArtifacts.get(walletAddress);
    
    if (!userStakedArtifacts || userStakedArtifacts.size === 0) {
      // Geen artifacts om bij te werken
      return {
        stakedAmount: 0,
        rewards: stakingDB.walletRewards.get(walletAddress) || 0,
        stakedInfo: []
      };
    }
    
    // Verzamel artifacts die nu eligible zijn maar voorheen niet
    const now = Date.now();
    const newlyEligibleArtifacts: StakedInfo[] = [];
    
    // Update eligibility voor elk artifact
    for (const [artifactId, info] of userStakedArtifacts.entries()) {
      // Controleer of het artifact nu eligible is
      const isEligible = now >= info.eligibleAt;
      
      // Als de status veranderd is, werk bij
      if (isEligible && !info.isEligible) {
        // Dit artifact is zojuist eligible geworden
        newlyEligibleArtifacts.push({...info, isEligible: true});
        
        // Werk het artifact bij in de database
        userStakedArtifacts.set(artifactId, {
          ...info,
          isEligible: true,
          // Profit share berekenen - voorlopig zetten we dit op 1 (100%)
          profitShare: 1
        });
      }
    }
    
    // Als er nieuwe eligible artifacts zijn, bereken rewards
    if (newlyEligibleArtifacts.length > 0) {
      // Bereken rewards op basis van rariteit en aantal dagen
      const baseReward = 100; // 100 sats per dag als basis
      
      let totalReward = 0;
      const eligibleOrdinals = Array.from(userStakedArtifacts.values()).filter(info => info.isEligible);
      
      // Bereken de totale reward op basis van gewichten
      for (const artifact of eligibleOrdinals) {
        // Per dag verdient het artifact zijn weight x base reward
        const daysStaked = Math.floor((now - artifact.stakedAt) / (24 * 60 * 60 * 1000));
        const artifactDailyReward = artifact.weight * baseReward * DAILY_REWARD_RATE;
        const artifactTotalReward = artifactDailyReward * daysStaked;
        
        totalReward += artifactTotalReward;
      }
      
      // Reward naar beneden afronden op hele getallen
      totalReward = Math.floor(totalReward);
      
      // Voeg rewards toe aan de wallet
      const currentRewards = stakingDB.walletRewards.get(walletAddress) || 0;
      stakingDB.walletRewards.set(walletAddress, currentRewards + totalReward);
      
      console.log(`Added ${totalReward} rewards to wallet ${walletAddress}`);
    }
    
    // Return de status ZONDER getStakingStatus aan te roepen
    let stakedInfo: StakedInfo[] = [];
    if (userStakedArtifacts) {
      stakedInfo = Array.from(userStakedArtifacts.values());
    }
    
    return {
      stakedAmount: userStakedArtifacts.size,
      rewards: stakingDB.walletRewards.get(walletAddress) || 0,
      stakedInfo
    };
  }
}

// Exporteer een instance van de service
export const stakingService = new StakingService(); 