'use client'

import { useState, useEffect } from 'react'
import { useLightning } from '@/context/LightningContext'
import Image from 'next/image'
import axios from 'axios'
import BitcoinTigersStaking from '@/components/BitcoinTigersStaking'
import TigerMissions from '@/components/TigerMissions'
import TaprootAlphaMissions, { isTaprootAlpha } from '@/components/TaprootAlphaMissions'
import { tigerStakingFunctions } from '@/components/BitcoinTigersStaking'
import { RefreshCw } from 'lucide-react'
import OrdinalSigmaXMissions, { isSigmaX } from '@/components/OrdinalSigmaXMissions'

// Configuratie voor Tiger Artifacts collectie
const TIGER_ARTIFACTS_CONFIG = {
  CONTENT_TYPE: "image/", // Content type filter (bijv. image/png, image/jpeg, etc.)
  DEBUG: false, // Extra logging voor debug doeleinden
  // Lijst met bekende Tiger Artifact inscription IDs - dit is de ENIGE bron van waarheid
  KNOWN_INSCRIPTION_IDS: [
    // Tiger Artifacts collectie
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai0", // Tiger Artifact #1
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai1", // Tiger Artifact #2
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai2", // Tiger Artifact #3
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai3", // Tiger Artifact #4
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai4", // Tiger Artifact #5
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai5", // Tiger Artifact #6
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai6", // Tiger Artifact #7
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai7", // Tiger Artifact #8
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai8", // Tiger Artifact #9
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai9", // Tiger Artifact #10
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai10", // Tiger Artifact #11
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai11", // Tiger Artifact #12
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai12", // Tiger Artifact #13
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai13", // Tiger Artifact #14
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai15", // Tiger Artifact #16
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai16", // Tiger Artifact #17
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai17", // Tiger Artifact #18
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai18", // Tiger Artifact #19
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai19", // Tiger Artifact #20
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai20", // Tiger Artifact #21
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai21", // Tiger Artifact #22
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai22", // Tiger Artifact #23
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai23", // Tiger Artifact #24
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai24", // Tiger Artifact #25
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai25", // Tiger Artifact #26
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai26", // Tiger Artifact #27
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai27", // Tiger Artifact #28
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai28", // Tiger Artifact #29
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai29", // Tiger Artifact #30
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai30", // Tiger Artifact #31
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai31", // Tiger Artifact #32
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai32", // Tiger Artifact #33
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai33", // Tiger Artifact #34
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai34", // Tiger Artifact #35
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai35", // Tiger Artifact #36
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai36", // Tiger Artifact #37
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai37", // Tiger Artifact #38
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai38", // Tiger Artifact #39
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai39", // Tiger Artifact #40
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai40", // Tiger Artifact #41
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai41", // Tiger Artifact #42
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai42", // Tiger Artifact #43
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai43", // Tiger Artifact #44
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai44", // Tiger Artifact #45
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai45", // Tiger Artifact #46
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai46", // Tiger Artifact #47
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai47", // Tiger Artifact #48
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai48", // Tiger Artifact #49
    "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai49", // Tiger Artifact #50
  ] as string[],
  // Staking configuratie
  STAKING: {
    ELIGIBILITY_PERIOD_DAYS: 30, // Aantal dagen voordat een artifact eligible wordt voor rewards
    MIN_STAKING_PERIOD: 1, // Minimum aantal dagen dat een artifact gestaked moet blijven (in productie: 30)
    ELIGIBILITY_REWARD_START_DATE: "2023-01-01" // Start datum voor eligibiliteit voor rewards
  },
  // Rariteit en gewichten voor rewards distributie
  RARITY: {
    // Mapping van artifact ID naar rariteit
    ARTIFACT_RARITY: {
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
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai22": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai23": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai24": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai25": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai26": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai27": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai28": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai29": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai30": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai31": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai32": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai33": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai34": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai35": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai36": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai37": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai38": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai39": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai40": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai41": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai42": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai43": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai44": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai45": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai46": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai47": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai48": "BRONZE",
      "8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai49": "BRONZE",
    },
    // Gewichten per rariteit voor rewards berekening
    WEIGHTS: {
      "GOLD": 5.0,    // 5 keer basis waarde
      "SILVER": 2.5,  // 2.5 keer basis waarde
      "BRONZE": 1.26  // 1.26 keer basis waarde
    }
  }
};

// API status voor UI
const API_STATUS = {
  USING_FALLBACK: false // Of we fallback data gebruiken
};

// Type definities voor API service
type StakingStatus = {
  stakedAmount: number;
  rewards: number;
  stakedInfo: StakedInfo[];
};

type StakedInfo = {
  id: string;
  stakedAt: number;
  eligibleAt: number;
  isEligible: boolean;
  profitShare: number;
  rarity: ArtifactRarity;
  weight: number;
};

type ArtifactRarity = 'GOLD' | 'SILVER' | 'BRONZE';

// Type definities voor Tiger Artifact configuratie
type RarityMapping = Record<string, ArtifactRarity>;

type TigerArtifactsConfig = {
  COLLECTION_SYMBOL: string;
  NAME_PATTERN: string;
  CREATOR: string;
  INSCRIPTION_RANGE: [number, number];
  CONTENT_TYPE: string;
  DEBUG: boolean;
  STAKING: {
    ELIGIBILITY_PERIOD_DAYS: number;
    MIN_STAKING_PERIOD: number;
    ELIGIBILITY_REWARD_START_DATE: string;
  };
  RARITY: {
    ARTIFACT_RARITY: RarityMapping;
    WEIGHTS: {
      GOLD: number;
      SILVER: number;
      BRONZE: number;
    };
  };
};

// Helper functie om rariteit en weight van een artifact te bepalen
const getRarityInfo = (artifactId: string): { rarity: ArtifactRarity; weight: number } => {
  // Bepaal rariteit uit configuratie
  // Cast ARTIFACT_RARITY naar Record<string, ArtifactRarity> voor TypeScript
  const artifactRarity = TIGER_ARTIFACTS_CONFIG.RARITY.ARTIFACT_RARITY as Record<string, ArtifactRarity>;
  const rarityValue = artifactRarity[artifactId] || "BRONZE";
  const rarity = rarityValue as ArtifactRarity;
  
  // Bepaal weight op basis van rariteit
  const weight = TIGER_ARTIFACTS_CONFIG.RARITY.WEIGHTS[rarity];
  
  return { rarity, weight };
};

// Helper functie om profit distribution te berekenen volgens het gewogen systeem
const calculateProfitDistribution = (eligibleOrdinals: Array<any>, totalProfit: number) => {
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
    const { rarity, weight } = getRarityInfo(ordinal.id);
    ordinalWeights[ordinal.id] = weight;
    totalWeightedUnits += weight;
    
    // Tel aantal per rariteit
    if (rarityCounts[rarity] !== undefined) {
      rarityCounts[rarity] += 1;
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
    const { rarity } = getRarityInfo(ordinal.id);
    const weight = ordinalWeights[ordinal.id];
    const rawPayout = weight * valuePerUnit;
    const finalPayout = Math.floor(rawPayout); // Afronden naar beneden
    
    distributions[ordinal.id] = finalPayout;
    totalDistributed += finalPayout;
    
    // Bijhouden van uitbetaling per rariteit voor logging
    if (!rarityPayouts[rarity]) {
      rarityPayouts[rarity] = finalPayout;
      rarityTotals[rarity] = finalPayout;
    } else {
      rarityTotals[rarity] += finalPayout;
    }
  });
  
  // Stap 6: Bereken remainder voor rollover
  const remainder = totalProfit - totalDistributed;
  
  // Log de resultaten
  console.log('Payout per rarity:', rarityPayouts);
  console.log('Total per rarity:', rarityTotals);
  console.log('Total distributed:', totalDistributed);
  console.log('Remainder for rollover:', remainder);
  
  // Stap 7: Bereken percentages voor UI
  Object.keys(rarityPayouts).forEach(rarity => {
    const percentage = (rarityPayouts[rarity] / totalProfit) * 100;
    console.log(`${rarity} percentage of total:`, percentage.toFixed(2) + '%');
  });
  
  // Stap 8: Controleer verhoudingen
  if (rarityPayouts["GOLD"] && rarityPayouts["SILVER"]) {
    const goldSilverRatio = rarityPayouts["GOLD"] / rarityPayouts["SILVER"];
    console.log('Gold:Silver ratio:', goldSilverRatio.toFixed(2) + ':1');
  }
  
  if (rarityPayouts["SILVER"] && rarityPayouts["BRONZE"]) {
    const silverBronzeRatio = rarityPayouts["SILVER"] / rarityPayouts["BRONZE"];
    console.log('Silver:Bronze ratio:', silverBronzeRatio.toFixed(2) + ':1');
  }
  
  return {
    distributions,
    totalDistributed,
    remainder
  };
};

// Helper functie om te bepalen of een ordinal een Tiger Artifact is
const isTigerArtifact = (inscription: any): boolean => {
  // Directe check op bekende inscription IDs - dit is de ENIGE check die we gebruiken
  if (TIGER_ARTIFACTS_CONFIG.KNOWN_INSCRIPTION_IDS.includes(inscription.id)) {
    console.log(`Matched known Tiger Artifact ID: ${inscription.id}`);
    return true;
  }
  
  // In debug modus kunnen we ook andere checks gebruiken om potentiële Tiger Artifacts te vinden
  if (TIGER_ARTIFACTS_CONFIG.DEBUG) {
    // Check op collectie (als die info beschikbaar is)
    const collectionCheck = inscription.collection_symbol === 'tigerartifacts' || 
                          (inscription.collection && inscription.collection.toLowerCase().includes('tiger'));
  
    // Check op naam (als die beschikbaar is)
    const nameCheck = inscription.name && inscription.name.toLowerCase().includes('tiger');
  
    // Check op beschrijving (als die beschikbaar is)
    const descriptionCheck = inscription.description && inscription.description.toLowerCase().includes('tiger');
  
    // Check of het een afbeelding is
    const isImage = inscription.content_type && 
                   inscription.content_type.startsWith(TIGER_ARTIFACTS_CONFIG.CONTENT_TYPE);
  
    // Combineer de checks - het moet een afbeelding zijn EN voldoen aan minstens één van de andere criteria
    const isPotentialTiger = isImage && (collectionCheck || nameCheck || descriptionCheck);
  
    // Log debug info als het een potentiële Tiger Artifact is
    if (isPotentialTiger) {
      console.log(`POTENTIAL Tiger Artifact (not in known list): ${inscription.name || inscription.id}`, {
        identifiedBy: {
          collection: collectionCheck ? 'YES' : 'NO',
          name: nameCheck ? 'YES' : 'NO',
          description: descriptionCheck ? 'YES' : 'NO'
        },
        inscription: {
          content_type: inscription.content_type,
          name: inscription.name || 'No name',
          collection: inscription.collection_symbol || 'No collection',
          id: inscription.id
        }
      });
    }
    
    // In debug modus retourneren we "false" voor potentiële matches die niet in onze lijst staan
    // maar we loggen ze wel voor toekomstige toevoegingen aan de KNOWN_INSCRIPTION_IDS lijst
    return false;
  }
  
  // Niet in onze lijst met bekende IDs
  return false;
};

// Functie om inhoud van een inscriptie op te halen
const fetchInscriptionContent = async (inscriptionId: string) => {
  try {
    // Sla het resultaat lokaal op zodat we het kunnen hergebruiken
    const cacheKey = `inscriptionContent_${inscriptionId}`;
    const cachedContent = localStorage.getItem(cacheKey);
    
    if (cachedContent) {
      return cachedContent;
    }
    
    // Probeer directe content URL's
    const contentEndpoints = [
      `https://ordinals.com/content/${inscriptionId}`,
      `https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}/content`
    ];
    
    // Probeer elke URL
    for (const endpoint of contentEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          // Controleer het contenttype om er zeker van te zijn dat het een afbeelding is
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            // Sla de succesvolle URL op in localStorage
            localStorage.setItem(cacheKey, endpoint);
            return endpoint;
          }
        }
      } catch (error) {
        console.log(`Failed to fetch from ${endpoint}:`, error);
      }
    }
    
    // Als geen van de endpoints werkt, val terug op metadata
    try {
      const metaResponse = await axios.get(`https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}`);
      if (metaResponse.data && metaResponse.data.content_type && metaResponse.data.content_type.startsWith('image/')) {
        // Gebruik een van de URLs als fallback
        const fallbackUrl = `https://ordinals.com/content/${inscriptionId}`;
        localStorage.setItem(cacheKey, fallbackUrl);
        return fallbackUrl;
      }
    } catch (error) {
      console.log('Failed to fetch inscription metadata:', error);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching inscription content:', error);
    return null;
  }
};

// API service voor interactie met backend
const apiService = {
  // Fetch staking status voor een wallet
  async getStakingStatus(walletAddress: string) {
    try {
      const response = await axios.get(`/api/staking/status`, {
        params: { walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching staking status:', error);
      throw error;
    }
  },
  
  // Stake een artifact
  async stakeArtifact(walletAddress: string, artifactId: string, artifactData: any) {
    try {
      const response = await axios.post(`/api/staking/stake`, {
        walletAddress,
        artifactId,
        artifactData
      });
      return response.data;
    } catch (error) {
      console.error('Error staking artifact:', error);
      throw error;
    }
  },
  
  // Unstake een artifact
  async unstakeArtifact(walletAddress: string, artifactId: string) {
    try {
      const response = await axios.post(`/api/staking/unstake`, {
        walletAddress,
        artifactId
      });
      return response.data;
    } catch (error) {
      console.error('Error unstaking artifact:', error);
      throw error;
    }
  },
  
  // Claim rewards
  async claimRewards(walletAddress: string) {
    try {
      const response = await axios.post(`/api/staking/claim`, {
        walletAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      throw error;
    }
  },
  
  // Update eligibility status
  async updateEligibility(walletAddress: string) {
    try {
      const response = await axios.post(`/api/staking/update-eligibility`, {
        walletAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error updating eligibility:', error);
      throw error;
    }
  }
};

export default function StakingPage() {
  // State variabelen
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [balance, setLocalBalance] = useState<number>(0)
  const [rewards, setRewards] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info' | ''>('')
  const [isClaiming, setIsClaiming] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  // Tiger ordinals staking state
  const [userOrdinals, setUserOrdinals] = useState<Array<{
    id: string, 
    name: string, 
    image: string,
    rarity?: string,
    weight?: number
  }>>([])
  
  const [stakedOrdinals, setStakedOrdinals] = useState<Array<{
    id: string, 
    name: string, 
    image: string, 
    stakedAt: number, // Timestamp wanneer gestaked
    eligibleAt: number, // Timestamp wanneer eligible voor rewards
    isEligible: boolean, // Of nu eligible voor rewards
    profitShare: number, // Profit share percentage (1 = 100%, 0.5 = 50%)
    rarity?: string,
    weight?: number
  }>>([])
  
  const [selectedOrdinal, setSelectedOrdinal] = useState<string | null>(null)
  const [selectedStakedOrdinal, setSelectedStakedOrdinal] = useState<string | null>(null)
  const [isStakingOrdinal, setIsStakingOrdinal] = useState<boolean>(false)
  const [isUnstakingOrdinal, setIsUnstakingOrdinal] = useState<boolean>(false)
  const [stakingTab, setStakingTab] = useState<'sats' | 'ordinals'>('sats')
  // Bijhouden van afbeeldingen die niet kunnen worden geladen
  const [failedImages, setFailedImages] = useState<{[key: string]: boolean}>({})
  const { setBalance } = useLightning()

  // State voor wallet en staking
  const [stakedAmount, setStakedAmount] = useState(0)
  const [stakeInputAmount, setStakeInputAmount] = useState('')
  const [unstakeInputAmount, setUnstakeInputAmount] = useState('')
  const [apr, setApr] = useState(5.0)
  const [totalEligibleOrdinals, setTotalEligibleOrdinals] = useState(0)
  const [profitDistribution, setProfitDistribution] = useState<{[key: string]: number}>({})
  const [rarityStats, setRarityStats] = useState<{[key: string]: number}>({
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0
  })
  const [stakingType, setStakingType] = useState<'artifacts' | 'tigers' | 'guardians' | 'taproot' | 'sigmax'>('tigers')

  // State voor Bitcoin Tigers en Rune Guardians
  const [userGuardians, setUserGuardians] = useState<Array<{
    id: string,
    name: string,
    image: string,
    isRuneGuardian: boolean,
    key?: string
  }>>([])
  
  const [stakedGuardians, setStakedGuardians] = useState<Array<{
    id: string,
    name: string,
    image: string,
    isRuneGuardian: boolean,
    key?: string
  }>>([])

  // State voor Taproot Alpha
  const [userTaproots, setUserTaproots] = useState<Array<any>>([])
  const [stakedTaproots, setStakedTaproots] = useState<Array<any>>([])

  // Functie om fout bij laden van afbeelding af te handelen
  const handleImageError = (id: string) => {
    console.log(`Failed to load image for ordinal: ${id}`);
    setFailedImages(prev => ({...prev, [id]: true}));
  };

  // Functie om de juiste afbeelding URL te bepalen
  const getImageUrl = (ordinal: {id: string, image: string}) => {
    // Als de afbeelding niet kon worden geladen, probeer verschillende fallbacks
    if (failedImages[ordinal.id]) {
      // Probeer verschillende mogelijke formaten voor de ordinal
      if (ordinal.id.includes('i')) {
        // Als het een 'i0' inscriptie is, probeer verschillende formaten
        const inscriptionId = ordinal.id;
        const alternateUrls = [
          `https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}/content`,
          `https://ordinals.com/inscription/${inscriptionId}`,
          `https://ordinals.com/content/${inscriptionId}`
        ];
        
        // Gebruik een andere URL uit de lijst op basis van het ID
        // Dit zorgt ervoor dat we verschillende URLs proberen voor elke ordinal
        const urlIndex = parseInt(inscriptionId.slice(-2), 16) % alternateUrls.length;
        return alternateUrls[urlIndex];
      } else {
        // Gebruik een lokale fallback afbeelding
        return "/tiger-pixel1.png";
      }
    }
    
    // Als de URL al een volledige URL is, gebruik deze
    if (ordinal.image.startsWith('http')) {
      return ordinal.image;
    }
    
    // Als de URL relatief is, gebruik de standaard
    return ordinal.image;
  };

  // Laad wallet en staking gegevens
  useEffect(() => {
    // Wis alle caches bij het eerste laden
    const storedWalletAddress = localStorage.getItem('walletAddress') || '';
    if (storedWalletAddress) {
      console.log('Clearing all caches for wallet:', storedWalletAddress);
      localStorage.removeItem(`tigerArtifacts_${storedWalletAddress}`);
      localStorage.removeItem(`tigerArtifacts_${storedWalletAddress}_timestamp`);
      localStorage.removeItem(`taprootAlpha_${storedWalletAddress}`);
      localStorage.removeItem(`taprootStakingDB`);
      localStorage.removeItem(`runeGuardians_${storedWalletAddress}`);
      localStorage.removeItem(`bitcoinTigers_${storedWalletAddress}`);
    }
    
    loadWalletAndStakingData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Functie om Tiger Artifacts op te halen uit een wallet
  const fetchTigerArtifacts = async (address: string) => {
    try {
      API_STATUS.USING_FALLBACK = false; // Reset fallback status
      setIsLoading(true);
      console.log(`Fetching Tiger Artifacts for wallet: ${address}`);
      
      // Eerst controleren we of deze wallet bekend is in onze lokale opslag
      const cachedArtifacts = localStorage.getItem(`tigerArtifacts_${address}`);
      const cacheTimestamp = localStorage.getItem(`tigerArtifacts_${address}_timestamp`);
      
      // Als we gecachte data hebben die niet ouder is dan 1 uur, gebruik die dan
      if (cachedArtifacts && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp);
        if (cacheAge < 3600000) { // 1 uur in milliseconden
          console.log('Using cached Tiger Artifacts data');
          const artifacts = JSON.parse(cachedArtifacts);
          setIsLoading(false);
          return artifacts;
        }
      }

      // Controleer of het een geldig Bitcoin adres is (begint met bc1 of bc, of bevat @)
      if (!address.startsWith('bc') && !address.includes('@')) {
        console.log('Invalid Bitcoin address format, no artifacts will be displayed');
        setIsLoading(false);
        setMessage('Please connect a valid Bitcoin wallet to view your Tiger Artifacts.');
        setMessageType('warning');
        return [];
      }
      
      try {
        console.log('Making API call to Hiro Ordinals API');
        
        // Hiro API gebruiken voor Bitcoin Ordinals
        const response = await axios.get('https://api.hiro.so/ordinals/v1/inscriptions', {
          params: {
            address: address,
            limit: 50 // Redelijk aantal resultaten opvragen
          },
          timeout: 30000 // 30 seconden timeout
        });
        
        console.log('Hiro API response status:', response.status);
        
        if (response.data && response.data.results) {
          const inscriptions = response.data.results;
          console.log(`Retrieved ${inscriptions.length} inscriptions from wallet`);
          
          // Debugging informatie
          if (inscriptions.length > 0) {
            console.log('First inscription sample:', inscriptions[0]);
          }
            
          // Map de resultaten naar ons formaat met filtering op Tiger Artifacts
          const artifacts = inscriptions
            .filter((inscription: any) => {
              // Toon wat debug info voor de eerste paar resultaten
              if (TIGER_ARTIFACTS_CONFIG.DEBUG && inscriptions.indexOf(inscription) < 3) {
                console.log('Inscription details for filtering:', {
                  content_type: inscription.content_type,
                  name: inscription.meta?.name,
                  id: inscription.id
                });
              }
              
              // Gebruik de helper functie om te bepalen of het een Tiger Artifact is
              return isTigerArtifact(inscription);
            })
            .map((inscription: any) => ({
              id: inscription.id,
              name: inscription.meta?.name || `Tiger Artifact #${inscription.id.slice(0, 6)}`,
              image: `https://ordinals.com/content/${inscription.id}`,
              content_type: inscription.content_type
            }));
          
          console.log(`Mapped ${artifacts.length} Tiger Artifacts`);
          
          // Als we geen artifacts hebben gevonden, return een lege array (geen fallback data)
          if (artifacts.length === 0) {
            // Probeer eerst te kijken of er potentiële artifacts zijn die we kunnen toevoegen aan onze lijst
            if (TIGER_ARTIFACTS_CONFIG.DEBUG) {
              console.log('No known Tiger Artifacts found, checking for potential matches...');
              
              // Tijdelijk de DEBUG instelling gebruiken om potentiële matches te vinden
              const potentialMatches = inscriptions
                .filter((inscription: any) => {
                  // Check op collectie (als die info beschikbaar is)
                  const collectionCheck = (inscription.collection_symbol || '').toLowerCase() === 'tigerartifacts' || 
                                        ((inscription.collection || '').toLowerCase().includes('tiger'));
                
                  // Check op naam (als die beschikbaar is)
                  const nameCheck = (inscription.meta?.name || inscription.name || '').toLowerCase().includes('tiger');
                
                  // Check of het een afbeelding is
                  const isImage = (inscription.content_type || '').startsWith(TIGER_ARTIFACTS_CONFIG.CONTENT_TYPE);
                
                  // Combineer de checks
                  return isImage && (collectionCheck || nameCheck);
                });
              
              if (potentialMatches.length > 0) {
                console.log('Found potential Tiger Artifacts that could be added to KNOWN_INSCRIPTION_IDS:');
                potentialMatches.forEach((match: any) => {
                  console.log(`- "${match.id}", // ${match.meta?.name || match.name || 'Unnamed'}`);
                });
              }
            }
            
            console.log('No Tiger Artifacts found in wallet');
            setMessage('No Tiger Artifacts found in your wallet. Please acquire some Tiger Artifacts to use this feature.');
            setMessageType('info');
            setIsLoading(false);
            return [];
          }
          
          // Sla de IDs op van de gevonden Tiger Artifacts
          const foundInscriptionIds = artifacts.map((art: {id: string}) => art.id);
          if (foundInscriptionIds.length > 0) {
            console.log('Found Tiger Artifact IDs:', foundInscriptionIds);
            // Update bekende inscription IDs voor toekomstig gebruik
            // (in een echte app zou je deze misschien ergens centraal opslaan)
            // TIGER_ARTIFACTS_CONFIG.KNOWN_INSCRIPTION_IDS = 
            //   [...new Set([...TIGER_ARTIFACTS_CONFIG.KNOWN_INSCRIPTION_IDS, ...foundInscriptionIds])];
          }
          
          // Cache de resultaten
          localStorage.setItem(`tigerArtifacts_${address}`, JSON.stringify(artifacts));
          localStorage.setItem(`tigerArtifacts_${address}_timestamp`, Date.now().toString());
          
          setIsLoading(false);
          return artifacts;
        } else {
          console.log('Invalid response format from Hiro API');
          setMessage('Error fetching artifacts. Please try again later.');
          setMessageType('error');
          setIsLoading(false);
          return [];
        }
      } catch (apiError: any) {
        console.error('API Error fetching Tiger Artifacts:', apiError);
        if (apiError.response) {
          console.error('Response status:', apiError.response.status);
          console.error('Response data:', apiError.response.data);
        } else {
          console.error('Error details:', apiError.message);
        }
        
        setMessage('Error fetching artifacts from API. Please try again later.');
        setMessageType('error');
        setIsLoading(false);
        return [];
      }
    } catch (error: any) {
      console.error('Error in fetchTigerArtifacts:', error);
      setMessage(`Unexpected error: ${error.message}`);
      setMessageType('error');
      setIsLoading(false);
      return [];
    }
  };

  // Functie om handelsinformatie op te halen van Magic Eden
  const fetchMagicEdenTradingInfo = async (inscriptionId: string) => {
    try {
      console.log(`Fetching trading info for inscription: ${inscriptionId}`);
      
      // Magic Eden API aanroepen om handelsinformatie op te halen
      const response = await axios.get(`https://api-mainnet.magiceden.dev/v2/ord/btc/inscription/${inscriptionId}`, {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': '1d87d2ac-bf5c-45c2-a908-c9a4399a6ee3'
        }
      });
      
      if (response.data) {
        console.log('Trading info:', response.data);
        
        // Verwerk de handelsinformatie
        const tradingInfo = {
          forSale: response.data.market_data?.for_sale || false,
          price: response.data.market_data?.price || 0,
          floorPrice: response.data.collection?.floor_price || 0,
          lastSold: response.data.market_data?.last_sale?.price || 0,
          lastSoldTime: response.data.market_data?.last_sale?.time || null
        };
        
        return tradingInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching trading info:', error);
      return null;
    }
  };

  // Helper functie om te bepalen of een ordinal een Rune Guardian is
  const isRuneGuardian = (inscription: any): boolean => {
    // Controleer op Rune Guardian collectie of naam
    const collectionCheck = 
      (inscription.collection_symbol || '').toLowerCase() === 'runeguardians' || 
      (inscription.collection || '').toLowerCase().includes('rune guardian') ||
      (inscription.collection || '').toLowerCase().includes('runeguardian') ||
      (inscription.id || '').toLowerCase().includes('runeguardian');
                           
    // Controleer op Rune Guardian in naam
    const nameCheck = 
      (inscription.meta?.name || inscription.name || '').toLowerCase().includes('rune guardian') ||
      (inscription.meta?.name || inscription.name || '').toLowerCase().includes('runeguardian') ||
      (inscription.meta?.name || inscription.name || '').toLowerCase().includes('rune') ||
      (inscription.meta?.name || inscription.name || '').toLowerCase().includes('guardian');
    
    // Controleer of het een afbeelding is
    const isImage = (inscription.content_type || '').startsWith('image/') || 
                    (inscription.content_type || '').includes('html');
    
    // Lijst met bekende Rune Guardian IDs
    const knownGuardianIDs = [
      // Bekende Rune Guardian IDs
      "85a9d38c0d4bfec591108ba2bcc3ca61ef11fa3664d3cb40a3d2a3c0c3ea741bi0",
      "bdf63dbec22fde5eb78054679220e737a930fbad1ff04b18031c6c8f83a75d56i0",
      "9991b8ae6e7fcfe59118fa2a2dd50d47967e928e53d01d1e35d66b535123312ci0",
      "4f1d275a8e836728a83aa7e8d4ef4dc09a5c3e0fe5af9c3303fab39a87fc047di0",
      "73b5210fd83b5de9310e8798af579a850848abcddd6f0c2a82ed22185a974e9ai0",
      // Voeg alle Rune Guardian IDs toe die je kent
      // Bitcoin Rune Guardians beginnen vaak met specifieke ID patronen
      "83c28d510d628a90e6c18f05afe6fe065b47645df79ebe6790bbc8866a036661i0"
    ];
    
    // Check of het ID in de bekende lijst staat
    if (knownGuardianIDs.includes(inscription.id)) {
      console.log(`Matched known Rune Guardian ID: ${inscription.id}`);
      return true;
    }
    
    // Controleer of het ID een patroon volgt van bekende Rune Guardians
    // Dit is een heuristische methode die kan helpen bij identificatie
    const guardianPattern = /[a-f0-9]{64}i0/; // Typisch Bitcoin Ordinal patroon
    if (guardianPattern.test(inscription.id) && (collectionCheck || nameCheck)) {
      console.log(`Potential Rune Guardian based on ID pattern: ${inscription.id}`);
      return true;
    }
    
    // Log voor debugging
    if (collectionCheck || nameCheck) {
      console.log(`Potential Rune Guardian found: ${inscription.id}`, {
        collection: inscription.collection || inscription.collection_symbol || 'unknown',
        name: inscription.meta?.name || inscription.name || 'unknown',
        content_type: inscription.content_type || 'unknown'
      });
    }
    
    // Combineer de checks
    return isImage && (collectionCheck || nameCheck);
  };

  // Laden van wallet en staking data
  const loadWalletAndStakingData = async () => {
    try {
      // Reset states voor een schone laad
      setUserGuardians([]);
      setUserTaproots([]);
      setIsLoading(true);
      
      // Haal wallet gegevens op uit localStorage (dit is veilig voor client-side)
      const storedWalletAddress = localStorage.getItem('walletAddress') || '';
      const storedBalance = parseInt(localStorage.getItem('balance') || '10000');
      
      // Update state met opgeslagen waarden
      setWalletAddress(storedWalletAddress);
      setLocalBalance(storedBalance);
      
      // Als er geen wallet adres is, stop hier
      if (!storedWalletAddress) {
        console.log('No wallet address found in localStorage');
        setIsLoading(false);
        return;
      }

      // Zoek specifiek naar Rune Guardians
      console.log('Starting search for Rune Guardians...');
      const guardians = await searchForGuardians(storedWalletAddress);
      if (guardians.length > 0) {
        console.log(`Found ${guardians.length} Rune Guardians for wallet!`, guardians);
        setUserGuardians(guardians);
      } else {
        console.log('No Rune Guardians found in wallet');
      }

      // Zoek specifiek naar Taproot Alpha
      console.log('Starting search for Taproot Alpha...');
      const taproots = await searchForTaproots(storedWalletAddress);
      if (taproots.length > 0) {
        console.log(`Found ${taproots.length} Taproot Alpha for wallet!`, taproots);
        setUserTaproots(taproots);
      } else {
        console.log('No Taproot Alpha found in wallet');
      }

      // Haal ook Bitcoin Tigers op voor de missies
      try {
        const tigerResponse = await axios.get(`/api/tiger-staking/fetch-tigers`, {
          params: { walletAddress: storedWalletAddress }
        });
        
        if (tigerResponse.data && tigerResponse.data.tokens) {
          const bitcoinTigers = tigerResponse.data.tokens.filter((tiger: any) => 
            !tiger.isRuneGuardian && 
            !tiger.name?.toLowerCase().includes('artifact')
          ).map((tiger: any) => ({
            id: tiger.id,
            name: tiger.name || `Bitcoin Tiger #${tiger.id.slice(0, 6)}`,
            image: tiger.image || '/tiger-pixel1.png',
            isRuneGuardian: false,
            key: `tiger-${tiger.id}`
          }));
          
          console.log(`Found ${bitcoinTigers.length} Bitcoin Tigers for missions`);
          
          // Voeg bitcoinTigers toe aan localStorage voor missies
          localStorage.setItem(`bitcoinTigers_${storedWalletAddress}`, JSON.stringify(bitcoinTigers));
          
          // Nu ook SigmaX ordinals filteren en opslaan
          // Haal SigmaX ordinals op basis van hun naam, collectie of ID patronen
          const sigmaXOrdinals = tigerResponse.data.tokens.filter((ordinal: any) => {
            // Controleer op expliciet gemarkeerde SigmaX ordinals
            if (ordinal.isSigmaX === true) return true;
            
            // Controleer op naam en collectie
            const nameCheck = ordinal.name && ordinal.name.toLowerCase().includes('sigmax');
            const collectionCheck = ordinal.collection && ordinal.collection.toLowerCase().includes('sigmax');
            
            // Bekende SigmaX ID patronen - Controleer of het ordinal ID begint met een van deze patronen
            const SIGMAX_PATTERNS = [
              "bbcc29a118a2c5cc7cdd81c95fef1c6c8036d07db4437f1058532878249ac5eci",
              "821ac77016796c87ea27a1e1e481b5f5285a59c61136ef069dea3f2a9d010655i",
              "d34fdb58e4c3135405d246cdd3c533cf7b27b80c9608264d1107cf5a6620fe5fi",
              "22404dc9cca8a8b70a5f26af0c0ff616cb64a00ab330429e2b7e2a54e067850ci",
              "71015e503da1c7072fe365a9846554d77eba9d9a7afcc105d8ac535aa77bffbci",
              "aba050b80c5090ae96eddad10f827a17ac47093d1577c680bf34054f9e210f59i",
              "26ed1f845b6ffec8aa137f732acf97bd3c2f5320e85fbcd3c54da19f46d34ff2i",
              "eefe4543561b5fb6d5d4e333759e71e459e1511d24b3ed49ca1944363f375387i",
              "b87ad1a3247881cebb95317c5c16a3238a3e779e6e78c468d2c34c3f79706bdci",
              "14af407b187d3236962d82540d571d3a077dfddd2eacb71ba40d130ad9a5662bi",
              "bce132567ecd98e57b7fce8edcda8922c23d171f7a18789899655fec4144efaci",
              "1bfd611bd7a74c098e40f81ee975fefec715366995b81ee1d5a5402d564c23f3i",
              "bbe382a6fb1c118046edb4c416abb863b64fb0818ce6cc60d46c4f7e3dd64339i",
              "6be540ae9f5f3d1df9f646f1fcb6d1e366844ba4e081a4d677f2312f75550314i",
              "a4d66331fd73aa8b314a8476cffea5fbc487001a1e83565251336ff633e6b639i",
              "ba97d6ed09595ca621095f87e1dcebd05c3a279d0c70e2b5f20ca6a8b2d445c9i"
            ];
            
            // Controleer ID patronen - EXPLICIETE CHECK op bekende SigmaX patronen
            const idCheck = ordinal.id && SIGMAX_PATTERNS.some(pattern => 
              ordinal.id.startsWith(pattern)
            );
            
            // Log voor debugging
            if (nameCheck || collectionCheck || idCheck) {
              console.log(`SigmaX ordinal geïdentificeerd: ${ordinal.id}, naam: ${ordinal.name || 'onbekend'}`);
            }
            
            // Expliciet UITSLUITEN van Taproot Alpha en Bitcoin Tiger patterns
            if (ordinal.id) {
              // Taproot Alpha uitsluiten
              if (ordinal.id.startsWith("47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di")) {
                console.log(`Taproot Alpha uitgesloten van SigmaX: ${ordinal.id}`);
                return false;
              }
              
              // Bitcoin Tigers uitsluiten
              const BITCOIN_TIGER_PATTERNS = [
                "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei",
                "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i",
                "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi",
                "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i"
              ];
              
              if (BITCOIN_TIGER_PATTERNS.some(pattern => ordinal.id.startsWith(pattern))) {
                console.log(`Bitcoin Tiger uitgesloten van SigmaX: ${ordinal.id}`);
                return false;
              }
            }
            
            return nameCheck || collectionCheck || idCheck;
          }).map((sigmax: any) => ({
            id: sigmax.id,
            name: sigmax.name || `SigmaX #${sigmax.id.slice(0, 6)}`,
            image: sigmax.image || '/sigmastone-logo.gif',
            isSigmaX: true, // Expliciet markeren als SigmaX
            key: `sigmax-${sigmax.id}`
          }));
          
          console.log(`Found ${sigmaXOrdinals.length} SigmaX ordinals for missions`);
          
          // Sla SigmaX ordinals op in localStorage
          localStorage.setItem(`sigmaX_${storedWalletAddress}`, JSON.stringify(sigmaXOrdinals));
        }
      } catch (error) {
        console.error('Error fetching Bitcoin Tigers for missions:', error);
      }

      // Eerste stap: Haal staking gegevens op van de server
      try {
        // Gebruik de echte API call
        const stakingStatus = await apiService.getStakingStatus(storedWalletAddress);
            
        // Update state met server gegevens
        setStakedAmount(stakingStatus.stakedAmount);
        setRewards(stakingStatus.rewards);
        
        // Haal Tiger Artifacts en Rune Guardians op via de Hiro API
        if (storedWalletAddress.startsWith('bc') || storedWalletAddress.includes('@')) {
          try {
            // Eerst controleren of we al data hebben in cache
            const cachedData = localStorage.getItem(`tigerArtifacts_${storedWalletAddress}`);
            const cachedTimestamp = localStorage.getItem(`tigerArtifacts_${storedWalletAddress}_timestamp`);
            
            const cacheIsValid = cachedData && cachedTimestamp && 
                                (Date.now() - parseInt(cachedTimestamp)) < 3600000; // 1 uur cache
            
            if (cacheIsValid && cachedData) {
              console.log('Using cached Tiger Artifacts data');
              const cachedArtifacts = JSON.parse(cachedData);
              
              // Verwerk de cached artifacts
              const stakedIds = stakingStatus.stakedInfo.map((info: any) => info.id);
              
              // Filter artifacts in gestaked en niet-gestaked
              const enhancedArtifacts = cachedArtifacts.map((ordinal: any) => {
                const { rarity, weight } = getRarityInfo(ordinal.id);
                return { ...ordinal, rarity, weight };
              });
              
              const stakedOrdinals = enhancedArtifacts
                .filter((ordinal: any) => stakedIds.includes(ordinal.id))
                .map((ordinal: any) => {
                  // Zoek de staking info voor dit ordinal
                  const info = stakingStatus.stakedInfo.find((si: any) => si.id === ordinal.id);
                  return {
                    ...ordinal,
                    stakedAt: info?.stakedAt || 0,
                    eligibleAt: info?.eligibleAt || 0,
                    isEligible: info?.isEligible || false,
                    profitShare: info?.profitShare || 1.0,
                    rarity: info?.rarity || ordinal.rarity,
                    weight: info?.weight || ordinal.weight
                  };
                });
              
              const userOrdinals = enhancedArtifacts.filter((ordinal: any) => !stakedIds.includes(ordinal.id));
              
              // Update states met cache data
              setStakedOrdinals(stakedOrdinals);
              setUserOrdinals(userOrdinals);
            } else {
              // Alleen als Magic Eden faalt, probeer Hiro API
              // Hiro API gebruiken voor Bitcoin Ordinals
              console.log('Trying Hiro API as fallback');
              
              // De nieuwe Hiro API gebruikt een ander adres format:
              // Het moet addresses (plural) zijn en het adres moet in een array zitten
              const response = await axios.get('https://api.hiro.so/ordinals/v1/inscriptions', {
                params: {
                  addresses: [storedWalletAddress],  // Array formaat voor adres
                  limit: 60                         // Meer dan de default (20)
                },
                timeout: 15000 // 15 seconden timeout
              });
              
              if (response.data && response.data.results) {
                const inscriptions = response.data.results;
                console.log(`Retrieved ${inscriptions.length} inscriptions from Hiro API`);
                
                // Filter Tiger Artifacts
                const artifacts = inscriptions
                  .filter((inscription: any) => isTigerArtifact(inscription))
                  .map((inscription: any) => ({
                    id: inscription.id,
                    name: inscription.meta?.name || `Tiger Artifact #${inscription.id.slice(0, 6)}`,
                    image: `https://ordinals.com/content/${inscription.id}`,
                    content_type: inscription.content_type
                  }));
                
                // Cache de artifacts
                localStorage.setItem(`tigerArtifacts_${storedWalletAddress}`, JSON.stringify(artifacts));
                localStorage.setItem(`tigerArtifacts_${storedWalletAddress}_timestamp`, Date.now().toString());
                
                // Toevoegen van rariteit informatie aan artifacts
                const enhancedArtifacts = artifacts.map((ordinal: any) => {
                  const { rarity, weight } = getRarityInfo(ordinal.id);
                  return { ...ordinal, rarity, weight };
                });
                
                // Verwerk de gestakede artifacts info van de server
                const stakedInfo = stakingStatus.stakedInfo;
                const stakedIds = stakedInfo.map((info: any) => info.id);
                
                // Bereken rariteit statistieken voor staked artifact
                const eligibleOrdinals = stakedInfo.filter((info: any) => info.isEligible);
                const eligibleCount = eligibleOrdinals.length;
                setTotalEligibleOrdinals(eligibleCount);
                
                // Bereken profit distribution voor UI (zou de server moeten doen)
                if (eligibleCount > 0) {
                  const profit = 1000000; // 1,000,000 satoshis voor demo
                  const distribution = calculateProfitDistribution(eligibleOrdinals, profit);
                  setProfitDistribution(distribution.distributions);
                }
                
                // Bereken rariteit statistieken
                const stats: Record<ArtifactRarity, number> = { GOLD: 0, SILVER: 0, BRONZE: 0 };
                eligibleOrdinals.forEach((info: any) => {
                  const rarity = info.rarity || getRarityInfo(info.id).rarity;
                  if (stats[rarity as ArtifactRarity] !== undefined) {
                    stats[rarity as ArtifactRarity] += 1;
                  }
                });
                setRarityStats(stats);
                
                // Filter artifacts in gestaked en niet-gestaked
                const stakedOrdinals = enhancedArtifacts
                  .filter((ordinal: any) => stakedIds.includes(ordinal.id))
                  .map((ordinal: any) => {
                    // Zoek de staking info voor dit ordinal
                    const info = stakedInfo.find((si: any) => si.id === ordinal.id);
                    return {
                      ...ordinal,
                      stakedAt: info?.stakedAt || 0,
                      eligibleAt: info?.eligibleAt || 0,
                      isEligible: info?.isEligible || false,
                      profitShare: info?.profitShare || 1.0,
                      rarity: info?.rarity || ordinal.rarity,
                      weight: info?.weight || ordinal.weight
                    };
                  });
                  
                const userOrdinals = enhancedArtifacts.filter((ordinal: any) => !stakedIds.includes(ordinal.id));
                
                console.log(`Found ${stakedOrdinals.length} staked ordinals and ${userOrdinals.length} unstaked ordinals`);
                console.log(`${eligibleCount} ordinals are eligible for rewards`);
                
                // Set de states voor Tiger Artifacts
                setStakedOrdinals(stakedOrdinals);
                setUserOrdinals(userOrdinals);
                
                if (artifacts.length === 0) {
                  setMessage('No Tiger Artifacts found in your wallet.');
                  setMessageType('warning');
                }
              }
            }
          } catch (error) {
            console.error('Error fetching ordinals:', error);
            setMessage('Error fetching ordinals from blockchain. Please try again later.');
            setMessageType('error');
          }
        } else {
          console.log('Invalid Bitcoin address format');
          setMessage('Please connect a valid Bitcoin wallet to view your ordinals.');
          setMessageType('warning');
        }
      } catch (error) {
        console.error('Error loading Tiger Artifacts and staking data:', error);
        setMessage('Failed to load staking data. Please try again later.');
        setMessageType('error');
      }
      
      // Markeer dat we klaar zijn met laden NADAT alles is geladen
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading wallet and staking data:', error);
      setMessage('Error loading data. Please refresh and try again.');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  // Stake Ordinal functie
  const handleStakeOrdinal = async () => {
    if (!selectedOrdinal) {
      setMessage('Please select an artifact to stake')
      setMessageType('error')
      return
    }

    setIsStakingOrdinal(true)
    
    try {
      // Vind het geselecteerde ordinal
      const ordinalToStake = userOrdinals.find(ord => ord.id === selectedOrdinal)
      
      if (!ordinalToStake) {
        setMessage('Selected artifact not found')
        setMessageType('error')
        return
      }
      
      // Bepaal rariteit en weight
      const { rarity, weight } = getRarityInfo(ordinalToStake.id);
      
      // Staking via API call
      const response = await apiService.stakeArtifact(
        walletAddress, 
        ordinalToStake.id, 
        { ...ordinalToStake, rarity, weight }
      );
      
      if (response.stakedInfo) {
        // Vind het gestakete artifact in de response
        const stakedOrdinalWithInfo = response.stakedInfo.find((info: any) => info.id === ordinalToStake.id);
        
        if (stakedOrdinalWithInfo) {
          // Update lokale state
          const newStakedOrdinals = [...stakedOrdinals, {
            ...ordinalToStake,
            stakedAt: stakedOrdinalWithInfo.stakedAt,
            eligibleAt: stakedOrdinalWithInfo.eligibleAt,
            isEligible: stakedOrdinalWithInfo.isEligible,
            profitShare: stakedOrdinalWithInfo.profitShare,
            rarity: stakedOrdinalWithInfo.rarity,
            weight: stakedOrdinalWithInfo.weight
          }];
          
          const newUserOrdinals = userOrdinals.filter(ord => ord.id !== selectedOrdinal);
          
          setStakedOrdinals(newStakedOrdinals);
          setUserOrdinals(newUserOrdinals);
          setSelectedOrdinal(null);
          
          // Success message
          const eligibleDate = new Date(stakedOrdinalWithInfo.eligibleAt).toLocaleDateString();
          setMessage(`Successfully staked ${ordinalToStake.name}. It will be eligible for rewards on ${eligibleDate}.`);
          setMessageType('success');
        } else {
          throw new Error('Staked artifact not found in response');
        }
      } else {
        throw new Error('Failed to stake artifact: Invalid response');
      }
    } catch (error) {
      setMessage('Failed to stake artifact: ' + (error as Error).message);
      setMessageType('error');
    } finally {
      setIsStakingOrdinal(false);
    }
  };

  // Unstake Ordinal functie
  const handleUnstakeOrdinal = async () => {
    if (!selectedStakedOrdinal) {
      setMessage('Please select an artifact to unstake');
      setMessageType('error');
      return;
    }

    setIsUnstakingOrdinal(true);
    
    try {
      // Vind het geselecteerde staked ordinal
      const ordinalToUnstake = stakedOrdinals.find(ord => ord.id === selectedStakedOrdinal);
      
      if (!ordinalToUnstake) {
        setMessage('Selected artifact not found');
        setMessageType('error');
        return;
      }
      
      // Unstake via API call
      const response = await apiService.unstakeArtifact(walletAddress, ordinalToUnstake.id);
      
      // Controleer of de unstake gelukt is (geen error betekent success)
      // Update user ordinals
      const unstakedOrdinal = {
        id: ordinalToUnstake.id,
        name: ordinalToUnstake.name,
        image: ordinalToUnstake.image,
        rarity: ordinalToUnstake.rarity,
        weight: ordinalToUnstake.weight
      };
      
      const newUserOrdinals = [...userOrdinals, unstakedOrdinal];
      
      // Update staked ordinals (remove unstaked ordinal)
      const newStakedOrdinals = stakedOrdinals.filter(ord => ord.id !== selectedStakedOrdinal);
      
      // Update state
      setUserOrdinals(newUserOrdinals);
      setStakedOrdinals(newStakedOrdinals);
      setSelectedStakedOrdinal(null);
      
      // Success message
      setMessage(`Successfully unstaked ${ordinalToUnstake.name}`);
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to unstake artifact: ' + (error as Error).message);
      setMessageType('error');
    } finally {
      setIsUnstakingOrdinal(false);
    }
  };

  // Claim rewards functie
  const handleClaimRewards = async () => {
    if (rewards <= 0) {
      setMessage('No rewards to claim')
      setMessageType('error')
      return
    }

    setIsClaiming(true)
    
    try {
      // Claim rewards via API call
      const response = await apiService.claimRewards(walletAddress);
      
      if (response.success) {
        // Update balances
        const claimedAmount = response.amount;
        const newBalance = balance + claimedAmount;
        
        // Update state
        setLocalBalance(newBalance);
        setRewards(0);
        
        // Update lightning context balance
        setBalance(newBalance);
        
        // Reset profit distribution
        setProfitDistribution({});
        
        // Success message
        setMessage(`Successfully claimed ${claimedAmount.toLocaleString()} sats in rewards`);
        setMessageType('success');
      } else {
        throw new Error('Failed to claim rewards');
      }
    } catch (error) {
      setMessage('Failed to claim rewards: ' + (error as Error).message);
      setMessageType('error');
    } finally {
      setIsClaiming(false);
    }
  };

  // Functie om de cache te wissen en data opnieuw te laden
  const refreshArtifacts = async () => {
    setIsLoading(true);
    setMessage('Reloading all ordinals from the blockchain...');
    setMessageType('warning');
    
    // Reset API status
    API_STATUS.USING_FALLBACK = false;
    
    // Wis lokale cache
    const walletAddress = localStorage.getItem('walletAddress') || '';
    if (walletAddress) {
      localStorage.removeItem(`tigerArtifacts_${walletAddress}`);
      localStorage.removeItem(`tigerArtifacts_${walletAddress}_timestamp`);
      
      // Expliciet wis guardian cache
      localStorage.removeItem(`runeGuardians_${walletAddress}`);
      
      // Wis bitcoinTigers cache
      localStorage.removeItem(`bitcoinTigers_${walletAddress}`);
      
      // Wis SigmaX cache
      localStorage.removeItem(`sigmaX_${walletAddress}`);
    }
    
    // Reset failed images
    setFailedImages({});
    
    // Reset guardian states
    setUserGuardians([]);
    setStakedGuardians([]);
    
    // In production: invalidate server cache voor deze wallet
    if (process.env.NODE_ENV !== 'development') {
      try {
        await axios.post('/api/staking/refresh-cache', { walletAddress });
      } catch (error) {
        console.error('Error refreshing server cache:', error);
      }
    }
    
    // Laad data opnieuw
    loadWalletAndStakingData();
  };

  // Specifieke functie om guardians te zoeken
  const searchForGuardians = async (walletAddress: string) => {
    if (!walletAddress) return [];
    
    try {
      console.log('Searching specifically for Rune Guardians for wallet:', walletAddress);
      
      // Gebruik een cache als die bestaat
      const cachedGuardians = localStorage.getItem(`runeGuardians_${walletAddress}`);
      if (cachedGuardians) {
        console.log('Using cached Rune Guardians');
        return JSON.parse(cachedGuardians);
      }
      
      // Zoek naar alle ordinals in de wallet
      const response = await axios.get(`/api/tiger-staking/fetch-tigers`, {
        params: { walletAddress }
      });
      
      if (response.data && response.data.tokens) {
        // Check elk ordinal om te zien of het een Rune Guardian is
        const allOrdinals = response.data.tokens;
        console.log(`Checking ${allOrdinals.length} ordinals from tiger API for Rune Guardians`);
        
        // Filteren op Rune Guardians
        const guardians = allOrdinals.filter((ordinal: any) => {
          // Specifiek kijken naar de namen en ID patronen van Rune Guardians
          return ordinal.name?.toLowerCase().includes('rune guardian') ||
                 ordinal.name?.toLowerCase().includes('guardian') ||
                 ordinal.collection?.toLowerCase().includes('guardian') ||
                 ordinal.image?.includes('rune') ||
                 (ordinal.isRuneGuardian === true);
        }).map((guardian: any, index: number) => ({
          id: guardian.id,
          name: guardian.name || `Rune Guardian #${index + 1}`,
          image: guardian.image || `/guardian-default.png`,
          isRuneGuardian: true,
          key: `guardian-${guardian.id}`
        }));
        
        console.log(`Found ${guardians.length} potential Rune Guardians via tiger API`);
        
        // Cache het resultaat
        if (guardians.length > 0) {
          localStorage.setItem(`runeGuardians_${walletAddress}`, JSON.stringify(guardians));
        }
        
        return guardians;
      }
    } catch (error) {
      console.error('Error searching for Rune Guardians:', error);
    }
    
    return [];
  };

  // In de Ordinal rendering component, laad dynamisch content
  useEffect(() => {
    // Laad dynamisch de inhoud van inscripties
    const loadInscriptionContent = async () => {
      // Alleen voor non-fallback data
      if (!API_STATUS.USING_FALLBACK) {
        // Probeer voor elke ordinal die niet kon worden geladen de content op te halen
        for (const ordinal of [...userOrdinals, ...stakedOrdinals]) {
          if (failedImages[ordinal.id] && ordinal.id.includes('i')) {
            try {
              const contentUrl = await fetchInscriptionContent(ordinal.id);
              if (contentUrl) {
                console.log(`Found content URL for ${ordinal.id}:`, contentUrl);
                // Update de failed images zodat de nieuwe URL wordt gebruikt
                setFailedImages(prev => ({...prev, [ordinal.id]: false}));
                // Update de image URL in de ordinal
                ordinal.image = contentUrl;
              }
            } catch (error) {
              console.error(`Error loading content for ${ordinal.id}:`, error);
            }
          }
        }
      }
    };
    
    loadInscriptionContent();
  }, [userOrdinals, stakedOrdinals, failedImages]);

  // Helper functie om de resterende tijd tot eligibility te formatteren
  const formatTimeRemaining = (eligibleAt: number) => {
    const now = Date.now();
    const timeRemaining = eligibleAt - now;
    
    if (timeRemaining <= 0) return "Eligible now";
    
    const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
      return `${hours}h ${minutes}m`;
    }
  };

  // Functie om een guardian te staken voor een missie
  const handleStakeMission = async (guardianId: string, missionId: string) => {
    try {
      console.log(`[DEBUG] Staking guardian/tiger ${guardianId} for mission ${missionId}`);
      
      // Zoek de tiger/guardian data in userGuardians of in bitcoinTigers cache
      let tigerData = null;
      
      // Zoek eerst in userGuardians
      const guardian = userGuardians.find(g => g.id === guardianId);
      if (guardian) {
        console.log(`[DEBUG] Found tiger/guardian in userGuardians`, guardian);
        tigerData = guardian;
      }
      
      // Als niet gevonden, zoek in bitcoinTigers cache
      if (!tigerData) {
        const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
        if (cachedTigers) {
          const parsedTigers = JSON.parse(cachedTigers);
          const cachedTiger = parsedTigers.find((t: any) => t.id === guardianId);
          if (cachedTiger) {
            console.log(`[DEBUG] Found tiger in bitcoinTigers cache`, cachedTiger);
            tigerData = cachedTiger;
          }
        }
      }
      
      // Als nog steeds niet gevonden, maak minimale data
      if (!tigerData) {
        console.log(`[DEBUG] Creating minimal data for tiger ${guardianId}`);
        tigerData = {
          id: guardianId,
          name: `Tiger #${guardianId.substring(0, 8)}`,
          image: '/tiger-pixel1.png'
        };
      }
      
      // Dit is een directe functie aanroep van het staking component
      const result = await tigerStakingFunctions.stakeTiger(guardianId, missionId);
      console.log(`[DEBUG] Direct staking result:`, result);
      
      return { success: true, response: result };
    } catch (error) {
      console.error('[ERROR] Error staking guardian/tiger for mission:', error);
      throw error;
    }
  };

  // Functie om een guardian uit een missie te halen
  const handleUnstakeMission = async (guardianId: string) => {
    try {
      console.log(`Unstaking guardian ${guardianId} from mission`);
      
      // Gebruik de directe unstakeTiger functie
      const result = await tigerStakingFunctions.unstakeTiger(guardianId);
      console.log(`[DEBUG] Unstaking result:`, result);
      
      return { success: true, response: result };
    } catch (error) {
      console.error('Error unstaking guardian from mission:', error);
      throw error;
    }
  };

  // Handler functions voor Taproot Alpha
  const handleStakeTaproot = async (taprootId: string, missionId: string) => {
    console.log(`Taproot/Tiger ${taprootId} staken voor missie ${missionId}`);
    
    if (!walletAddress) {
      console.error('No wallet address, cannot stake Taproot Alpha/Bitcoin Tiger');
      return { success: false, error: 'No wallet address provided' };
    }
    
    try {
      // Zoek eerst in userTaproots (dit kunnen zowel Taproot Alphas als Bitcoin Tigers zijn)
      let taproot = userTaproots.find(t => t.id === taprootId);
      
      // Als niet gevonden in userTaproots, zoek in de localStorage cache voor Bitcoin Tigers
      if (!taproot) {
        const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
        if (cachedTigers) {
          const parsedTigers = JSON.parse(cachedTigers);
          taproot = parsedTigers.find((t: any) => t.id === taprootId);
          console.log('Taproot/Tiger gevonden in Bitcoin Tigers cache:', taproot);
        }
      }
      
      if (!taproot) {
        console.error(`Cannot find Taproot Alpha/Bitcoin Tiger with ID: ${taprootId}`);
        return { success: false, error: 'Taproot Alpha/Bitcoin Tiger not found in your wallet' };
      }
      
      console.log('Staking Taproot Alpha/Bitcoin Tiger:', taproot);
      
      // Initialize taprootStakingDB als het nog niet bestaat
      let taprootStakingDB = localStorage.getItem('taprootStakingDB');
      if (!taprootStakingDB) {
        taprootStakingDB = JSON.stringify({
          stakedTaproots: {},
          chests: {},
          rewardHistory: []
        });
        localStorage.setItem('taprootStakingDB', taprootStakingDB);
      }
      
      // Parse de huidige taprootStakingDB
      const parsedDB = JSON.parse(localStorage.getItem('taprootStakingDB') || '{}');
      
      // Zorg ervoor dat de nodige structuren bestaan
      if (!parsedDB.stakedTaproots) {
        parsedDB.stakedTaproots = {};
      }
      
      if (!parsedDB.stakedTaproots[walletAddress]) {
        parsedDB.stakedTaproots[walletAddress] = {};
      }
      
      // Controleer of de taproot al gestaked is
      if (parsedDB.stakedTaproots[walletAddress][taprootId]) {
        console.log(`Taproot/Tiger ${taprootId} is already staked, not staking again`);
        return { success: false, error: 'Taproot Alpha/Bitcoin Tiger is already staked' };
      }
      
      // Bepaal of dit een Taproot Alpha of Bitcoin Tiger is
      const isTaproot = isTaprootAlpha(taproot);
      
      // Voeg de taproot toe aan de gestakede taproots
      parsedDB.stakedTaproots[walletAddress][taprootId] = {
        id: taprootId,
        name: taproot.name || `${isTaproot ? 'Taproot Alpha' : 'Bitcoin Tiger'} #${taprootId.substring(0, 8)}`,
        image: taproot.image || (isTaproot ? '/taproot-pixel.png' : '/tiger-pixel1.png'),
        isTaprootAlpha: isTaproot,
        stakedAt: Date.now(),
        nextChestAt: Date.now() + 10000, // 10 seconden voor testing
        missionId: missionId
      };
      
      // Update localStorage
      localStorage.setItem('taprootStakingDB', JSON.stringify(parsedDB));
      console.log(`Added ${isTaproot ? 'Taproot Alpha' : 'Bitcoin Tiger'} ${taprootId} to staked taproots for wallet ${walletAddress}`, parsedDB.stakedTaproots[walletAddress][taprootId]);
      
      // Geen refresh meer aanroepen om pageload te voorkomen
      // await refreshTaproots();
      
      return { success: true };
    } catch (error) {
      console.error('Error staking Taproot Alpha/Bitcoin Tiger:', error);
      return { success: false, error: `Error staking Taproot Alpha/Bitcoin Tiger: ${error}` };
    }
  }

  const handleUnstakeTaproot = async (taprootId: string) => {
    console.log(`Taproot/Tiger ${taprootId} ontstaken`);
    
    if (!walletAddress) {
      console.error('No wallet address, cannot unstake Taproot Alpha/Bitcoin Tiger');
      return { success: false, error: 'No wallet address provided' };
    }
    
    try {
      // Parse de huidige taprootStakingDB
      const taprootStakingDB = localStorage.getItem('taprootStakingDB');
      if (!taprootStakingDB) {
        console.log('No staking database found, nothing to unstake');
        return { success: false, error: 'No staking database found' };
      }
      
      const parsedDB = JSON.parse(taprootStakingDB);
      
      // Controleer of er gestakede taproots zijn voor deze wallet
      if (!parsedDB.stakedTaproots || !parsedDB.stakedTaproots[walletAddress]) {
        console.log(`No staked Taproot Alphas/Bitcoin Tigers found for wallet ${walletAddress}`);
        return { success: false, error: 'No staked Taproot Alphas/Bitcoin Tigers found' };
      }
      
      // Controleer of deze taproot gestaked is
      if (!parsedDB.stakedTaproots[walletAddress][taprootId]) {
        console.log(`Taproot/Tiger ${taprootId} is not staked, cannot unstake`);
        return { success: false, error: 'Taproot Alpha/Bitcoin Tiger is not staked' };
      }
      
      // Log de taproot die we unstaken
      const unstakingTaproot = parsedDB.stakedTaproots[walletAddress][taprootId];
      console.log('Unstaking Taproot Alpha/Bitcoin Tiger:', unstakingTaproot);
      
      // Verwijder deze taproot uit de gestakede taproots
      delete parsedDB.stakedTaproots[walletAddress][taprootId];
      
      // Update localStorage
      localStorage.setItem('taprootStakingDB', JSON.stringify(parsedDB));
      console.log(`Removed Taproot/Tiger ${taprootId} from staked taproots for wallet ${walletAddress}`);
      
      // Geen refresh meer aanroepen om pageload te voorkomen
      // await refreshTaproots();
      
      return { success: true };
    } catch (error) {
      console.error('Error unstaking Taproot Alpha/Bitcoin Tiger:', error);
      return { success: false, error: `Error unstaking Taproot Alpha/Bitcoin Tiger: ${error}` };
    }
  }

  const refreshTaproots = async () => {
    console.log('===== REFRESHING TAPROOTS: FUNCTION CALLED =====');
    setIsLoading(true);
    
    try {
      // Wis cache
      const walletAddress = localStorage.getItem('walletAddress') || '';
      if (walletAddress) {
        console.log(`Refreshing taproots for wallet: ${walletAddress}`);
        
        // Wis ALLE relevante caches maar behoud de staking database
        localStorage.removeItem(`taprootAlpha_${walletAddress}`);
        // NIET verwijderen zodat staking behouden blijft: localStorage.removeItem(`taprootStakingDB`);
        
        // Wis cache van Bitcoin Tigers om die ook opnieuw te laden
        localStorage.removeItem(`bitcoinTigers_${walletAddress}`);
        
        console.log('Cleared Taproot-related caches while preserving staking data');
        
        // Haal Bitcoin Tigers op voor de missies
        try {
          const tigerResponse = await axios.get(`/api/tiger-staking/fetch-tigers`, {
            params: { 
              walletAddress: walletAddress,
              includeAll: true,
              debug: true
            },
            timeout: 15000
          });
          
          if (tigerResponse.data && tigerResponse.data.tokens) {
            const bitcoinTigers = tigerResponse.data.tokens.filter((tiger: any) => 
              !tiger.isRuneGuardian && 
              !tiger.name?.toLowerCase().includes('artifact')
            ).map((tiger: any) => ({
              id: tiger.id,
              name: tiger.name || `Bitcoin Tiger #${tiger.id.slice(0, 6)}`,
              image: tiger.image || '/tiger-pixel1.png',
              isRuneGuardian: false,
              key: `tiger-${tiger.id}`
            }));
            
            console.log(`Found ${bitcoinTigers.length} Bitcoin Tigers for missions`);
            
            // Voeg bitcoinTigers toe aan localStorage voor missies
            localStorage.setItem(`bitcoinTigers_${walletAddress}`, JSON.stringify(bitcoinTigers));
          }
        } catch (error) {
          console.error('Error fetching Bitcoin Tigers for missions:', error);
        }
        
        // Direct de taproots ophalen via de zoekfunctie
        console.log('Starting direct search for Taproot Alpha...');
        const taproots = await searchForTaproots(walletAddress);
        console.log(`Found ${taproots.length} Taproot Alpha for wallet!`, taproots);
        
        // Altijd de state bijwerken, zelfs als er geen taproots worden gevonden
        setUserTaproots(taproots);
      } else {
        console.log('No wallet address found, cannot refresh Taproots');
        setUserTaproots([]);
      }
    } catch (error) {
      console.error('Error refreshing Taproots:', error);
      setUserTaproots([]); // Bij een error toch de state resetten
    } finally {
      console.log('===== REFRESHING TAPROOTS: COMPLETED =====');
      setIsLoading(false);
    }
    
    // Verwijderd: geen pagina reload om staking data te behouden
    // setTimeout(() => {
    //   console.log('Reloading page to ensure all components are correctly rendered');
    //   window.location.reload();
    // }, 1000);
  };

  // Specifieke functie om Taproot Alpha's te zoeken
  const searchForTaproots = async (walletAddress: string) => {
    if (!walletAddress) return [];
    
    try {
      console.log('Searching specifically for Taproot Alpha for wallet:', walletAddress);
      
      // Gebruik een cache als die bestaat
      const cachedTaproots = localStorage.getItem(`taprootAlpha_${walletAddress}`);
      if (cachedTaproots) {
        console.log('Using cached Taproot Alpha');
        return JSON.parse(cachedTaproots);
      }
      
      // Zoek naar alle ordinals in de wallet - EXACT DEZELFDE API CALL ALS VOOR GUARDIANS
      const response = await axios.get(`/api/tiger-staking/fetch-tigers`, {
        params: { walletAddress }
      });
      
      if (response.data && response.data.tokens) {
        // Check elk ordinal om te zien of het een Taproot Alpha is
        const allOrdinals = response.data.tokens;
        console.log(`Checking ${allOrdinals.length} ordinals from tiger API for Taproot Alpha`);
        
        // Log alle IDs voor diagnose
        console.log('ALL ORDINAL IDS:', allOrdinals.map((o: any) => o.id).join(', '));
        
        // Filteren op Taproot Alpha - ZELFDE STRUCTUUR ALS GUARDIANS MAAR VOOR TAPROOT
        const taproots = allOrdinals.filter((ordinal: any) => {
          // Specifiek kijken naar de namen en ID patronen van Taproot Alpha
          return ordinal.name?.toLowerCase().includes('taproot') ||
                 ordinal.name?.toLowerCase().includes('alpha') ||
                 ordinal.collection?.toLowerCase().includes('taproot') ||
                 ordinal.collection?.toLowerCase().includes('alpha') ||
                 ordinal.id?.includes('47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di') ||
                 (ordinal.isTaprootAlpha === true);
        }).map((taproot: any, index: number) => ({
          id: taproot.id,
          name: taproot.name || `Taproot Alpha #${index + 1}`,
          image: taproot.image || `https://ordinals.com/content/${taproot.id}`,
          isTaprootAlpha: true,
          key: `taproot-${taproot.id}`
        }));
        
        console.log(`Found ${taproots.length} potential Taproot Alpha via tiger API`);
        
        // Cache de resultaten
        if (taproots.length > 0) {
          localStorage.setItem(`taprootAlpha_${walletAddress}`, JSON.stringify(taproots));
        }
        
        return taproots;
      }
    } catch (error) {
      console.error('Error searching for Taproot Alpha:', error);
    }
    
    return [];
  };

  // Auto-focus op de Bitcoin Tigers tab als de pagina laadt
  useEffect(() => {
    // Focus altijd op de Bitcoin Tigers tab, ongeacht vorige staat
    if (typeof window !== 'undefined') {
      setStakingType('tigers');
    }
  }, []);
  
  // Functie om stakingType te wijzigen met controle op vergrendelde tabs
  const handleStakingTypeChange = (type: 'artifacts' | 'tigers' | 'guardians' | 'taproot' | 'sigmax') => {
    // Alleen toestaan om naar tigers te wisselen
    if (type === 'tigers') {
      setStakingType(type);
    } else {
      // Als een vergrendelde tab wordt geselecteerd, toon een bericht en blijf bij de huidige tab
      setMessage('Deze functie is momenteel vergrendeld. Alleen Bitcoin Tigers zijn beschikbaar.');
      setMessageType('warning');
      // Timer om het bericht na een paar seconden te verwijderen
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  return (
    <>
      <style jsx>{`
        .staking-page {
          min-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          background: #0d1320;
          color: #fff;
        }
        
        .page-title {
          font-size: 1.5rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }
        
        .page-subtitle {
          font-size: 0.7rem;
          font-family: 'Press Start 2P', monospace;
          color: #ccc;
          margin-bottom: 1.5rem;
          text-align: center;
          max-width: 700px;
          line-height: 1.6;
        }
        
        /* Nieuw layout systeem met een meer horizontale focus */
        .staking-container {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-areas: 
            "unstaked unstaked rewards"
            "staked staked rewards";
          grid-template-columns: 1fr 1fr 300px;
          grid-template-rows: auto auto;
          gap: 1rem;
        }
        
        .staking-card {
          background: #0d1320;
          border: 2px solid #ffd700;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .your-artifacts-card {
          grid-area: unstaked;
        }
        
        .staked-artifacts-card {
          grid-area: staked;
        }
        
        .rewards-card {
          grid-area: rewards;
          background: #0d1320;
          border: 2px solid #ffd700;
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        
        .staking-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffd700, transparent);
          z-index: 1;
        }
        
        .staking-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffd700, transparent);
          z-index: 1;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.7rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.3);
          position: relative;
        }
        
        .card-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 30%;
          height: 2px;
          background: #ffd700;
        }
        
        .card-icon {
          color: #ffd700;
          font-size: 1.2rem;
        }
        
        .card-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #ffd700;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        /* Verbeterde grid voor artifacts dat beter past op het scherm */
        .ordinals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 0.8rem;
          margin: 0.5rem 0;
        }
        
        .ordinal-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid #ffd700;
          padding: 0.4rem;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .ordinal-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, #ffd700, transparent);
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        
        .ordinal-item:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
        }
        
        .ordinal-item:hover::after {
          transform: translateY(0);
        }
        
        .ordinal-item.selected {
          border-color: #4afc4a;
          background: rgba(74, 252, 74, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(74, 252, 74, 0.3);
        }
        
        .ordinal-item.selected::after {
          background: linear-gradient(to right, #4afc4a, transparent);
          transform: translateY(0);
        }
        
        .ordinal-image {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }
        
        .ordinal-name {
          margin-top: 0.4rem;
          font-size: 0.55rem;
          text-align: center;
          color: #fff;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        
        .staked-badge {
          position: absolute;
          top: 3px;
          right: 3px;
          background: rgba(74, 252, 74, 0.3);
          color: #4afc4a;
          font-size: 0.45rem;
          font-weight: bold;
          padding: 0.1rem 0.2rem;
          border-radius: 3px;
          text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }
        
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 150px;
          color: #aaa;
          background: rgba(0, 0, 0, 0.2);
          text-align: center;
          font-size: 0.7rem;
          font-family: 'Press Start 2P', monospace;
          line-height: 1.5;
          padding: 0.5rem;
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 4px;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 150px;
          color: #ffd700;
          background: rgba(0, 0, 0, 0.2);
          text-align: center;
          font-size: 0.7rem;
          font-family: 'Press Start 2P', monospace;
          line-height: 1.5;
          padding: 0.5rem;
          border-radius: 4px;
        }
        
        .loading-spinner {
          border: 3px solid rgba(255, 215, 0, 0.3);
          border-radius: 50%;
          border-top: 3px solid #ffd700;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .rewards-value {
          font-size: 2rem;
          font-weight: bold;
          color: #4afc4a;
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 5px rgba(74, 252, 74, 0.5);
          position: relative;
        }
        
        .rewards-value::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #4afc4a, transparent);
        }
        
        .sats-label {
          font-size: 1rem;
          color: #ffd700;
          margin-left: 0.3rem;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
        }
        
        .claim-button {
          background: linear-gradient(to bottom, #34a853, #2d9249);
          color: #000;
          width: 100%;
          padding: 0.8rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.8rem;
          border: none;
          text-transform: uppercase;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .claim-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        
        .claim-button:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .claim-button:hover:not(:disabled) {
          background: linear-gradient(to bottom, #4afc4a, #34a853);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(74, 252, 74, 0.3);
        }
        
        .claim-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .staking-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin: 0.8rem 0;
        }
        
        .stat-item {
          flex: 1;
          min-width: 120px;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.7rem;
          text-align: center;
          border-radius: 4px;
          border: 1px solid rgba(255, 215, 0, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 2px;
          background: linear-gradient(90deg, #ffd700, transparent);
        }
        
        .stat-label {
          font-size: 0.6rem;
          color: #aaa;
          margin-bottom: 0.3rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .stat-value {
          font-size: 0.8rem;
          color: #ffd700;
          font-weight: bold;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 3px rgba(255, 215, 0, 0.3);
        }
        
        .rewards-info {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 0.7rem;
          font-size: 0.6rem;
          line-height: 1.5;
          margin-top: 0.8rem;
          font-family: 'Press Start 2P', monospace;
          text-align: center;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .rewards-info::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 30%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffd700);
        }
        
        .action-button {
          width: 100%;
          padding: 0.8rem;
          background: linear-gradient(to bottom, #ffd700, #e6c300);
          color: #000;
          border: none;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.2s;
          margin-top: auto;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .action-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        
        .action-button:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .action-button:hover:not(:disabled) {
          background: linear-gradient(to bottom, #ffde4d, #ffd700);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
        }
        
        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .wallet-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.5rem 0.8rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          border: 1px solid rgba(255, 215, 0, 0.3);
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 1200px;
        }
        
        .wallet-info::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.05), transparent);
        }
        
        .refresh-button {
          background: linear-gradient(to bottom, #ffd700, #e6c300);
          color: #000;
          padding: 0.2rem 0.5rem;
          font-size: 0.5rem;
          font-family: 'Press Start 2P', monospace;
          border: none;
          margin-left: auto;
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .refresh-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        
        .refresh-button:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .refresh-button:hover:not(:disabled) {
          background: linear-gradient(to bottom, #ffde4d, #ffd700);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
        }
        
        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .wallet-address {
          color: #4afc4a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 180px;
          text-shadow: 0 0 2px rgba(74, 252, 74, 0.3);
        }
        
        .message {
          width: 100%;
          max-width: 1200px;
          text-align: center;
          padding: 0.8rem;
          margin-top: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .message::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          pointer-events: none;
        }
        
        .message.success {
          background: rgba(74, 252, 74, 0.1);
          color: #4afc4a;
          border: 1px solid rgba(74, 252, 74, 0.5);
          box-shadow: 0 0 10px rgba(74, 252, 74, 0.2);
        }
        
        .message.error {
          background: rgba(255, 99, 71, 0.1);
          color: #ff6347;
          border: 1px solid rgba(255, 99, 71, 0.5);
          box-shadow: 0 0 10px rgba(255, 99, 71, 0.2);
        }
        
        .message.warning {
          background: rgba(255, 215, 0, 0.1);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.5);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
        }
        
        .message.info {
          background: rgba(0, 123, 255, 0.1);
          color: #0d6efd;
          border: 1px solid rgba(0, 123, 255, 0.5);
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
        }
        
        @media (max-width: 950px) {
          .staking-container {
            grid-template-areas: 
              "unstaked rewards"
              "staked rewards";
            grid-template-columns: 1fr 300px;
          }
        }
        
        @media (max-width: 700px) {
          .staking-container {
            grid-template-areas: 
              "unstaked"
              "staked"
              "rewards";
            grid-template-columns: 1fr;
          }
          
          .page-title {
            font-size: 1.2rem;
          }
          
          .page-subtitle {
            font-size: 0.6rem;
          }
        }
        
        .warning-banner {
          background-color: rgba(255, 215, 0, 0.1);
          border: 1px solid #ffd700;
          padding: 0.8rem;
          margin-bottom: 1rem;
          width: 100%;
          max-width: 1200px;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
          color: #ffd700;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.1);
        }
        
        .warning-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.05), transparent);
          pointer-events: none;
        }
        
        .info-banner {
          background-color: rgba(0, 0, 255, 0.1);
          border: 1px solid #4a4afc;
          padding: 0.8rem;
          margin-bottom: 1rem;
          width: 100%;
          max-width: 1200px;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
          color: #4a4afc;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(74, 74, 252, 0.1);
        }
        
        .info-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(74, 74, 252, 0.05), transparent);
          pointer-events: none;
        }
        
        .ordinal-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 0.2rem;
          font-size: 0.45rem;
          color: #aaa;
          width: 100%;
          text-align: center;
        }
        
        .eligibility-badge {
          position: absolute;
          bottom: 3px;
          left: 3px;
          font-size: 0.4rem;
          padding: 0.1rem 0.2rem;
          border-radius: 3px;
          text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
        }
        
        .eligibility-badge.eligible {
          background: rgba(74, 252, 74, 0.3);
          color: #4afc4a;
        }
        
        .eligibility-badge.pending {
          background: rgba(255, 215, 0, 0.3);
          color: #ffd700;
        }
        
        .eligibility-info {
          margin-top: 0.8rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.6rem;
          border-radius: 4px;
          font-size: 0.55rem;
          color: #ccc;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .eligibility-count {
          font-weight: bold;
          color: #4afc4a;
        }
        
        .rarity-badge {
          position: absolute;
          top: 3px;
          left: 3px;
          font-size: 0.4rem;
          padding: 0.1rem 0.2rem;
          border-radius: 3px;
          text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }
        
        .rarity-badge.gold {
          background: rgba(255, 215, 0, 0.4);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.8);
        }
        
        .rarity-badge.silver {
          background: rgba(192, 192, 192, 0.4);
          color: #c0c0c0;
          border: 1px solid rgba(192, 192, 192, 0.8);
        }
        
        .rarity-badge.bronze {
          background: rgba(205, 127, 50, 0.4);
          color: #cd7f32;
          border: 1px solid rgba(205, 127, 50, 0.8);
        }
        
        .profit-value {
          font-size: 0.45rem;
          color: #4afc4a;
          margin-top: 0.1rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .rarity-stats {
          margin-top: 0.8rem;
          font-size: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .rarity-stats-row {
          display: flex;
          justify-content: space-between;
        }
        
        .rarity-name {
          display: flex;
          align-items: center;
        }
        
        .rarity-color {
          width: 8px;
          height: 8px;
          margin-right: 4px;
          border-radius: 50%;
        }
        
        .rarity-color.gold {
          background: #ffd700;
        }
        
        .rarity-color.silver {
          background: #c0c0c0;
        }
        
        .rarity-color.bronze {
          background: #cd7f32;
        }
        
        .staking-toggle {
          display: flex;
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 800px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #ffd700;
          flex-wrap: wrap; /* Laat tabs wrappen op kleine schermen */
        }
        
        @media (max-width: 768px) {
          .staking-toggle {
            flex-wrap: wrap;
            gap: 4px;
            padding: 6px;
            width: 100%;
            max-width: none;
            position: static;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 0;
            border: 3px solid #ffd700;
            border-left: none;
            border-right: none;
            margin: 0 0 1.5rem 0;
          }
          
          .toggle-button {
            min-width: 49%; /* Twee knoppen per rij op tablets */
            padding: 0.7rem;
            font-size: 0.6rem;
            line-height: 1.2;
            font-weight: bold;
          }
          
          .toggle-button.taproot {
            /* Extra zichtbare styling voor Taproot Alpha tab op mobiel */
            border: 1px solid rgba(255, 107, 0, 0.7);
            box-shadow: 0 0 5px rgba(255, 107, 0, 0.3);
          }
          
          /* Normale padding voor de pagina */
          .staking-page {
            padding-top: 2rem;
          }
          
          /* Normale margins */
          .page-title {
            margin-top: 0;
          }
          
          .page-subtitle {
            margin-bottom: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .toggle-button {
            min-width: 49%; /* Twee knoppen per rij op mobiel */
            padding: 0.5rem 0.3rem;
            font-size: 0.45rem;
            line-height: 1;
          }
          
          .unlock-soon {
            font-size: 0.4rem;
            padding: 0.1rem 0.15rem;
            margin-top: 1px;
          }
          
          .toggle-button.taproot {
            /* Nog duidelijkere styling voor Taproot Alpha op kleine mobiele schermen */
            border: 2px solid rgba(255, 107, 0, 0.7);
            box-shadow: 0 0 8px rgba(255, 107, 0, 0.4);
          }
          
          .staking-page {
            padding-top: 4.5rem;
          }
        }
        
        .toggle-button {
          flex: 1;
          padding: 0.8rem;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          transition: all 0.2s;
          position: relative;
          min-width: 150px; /* Minimale breedte voor tablets */
        }
        
        .toggle-button.active {
          background: rgba(255, 215, 0, 0.2);
          color: #ffd700;
        }
        
        .toggle-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #ffd700;
        }
        
        .toggle-button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
        }
        
        // Toevoegen van styles voor Taproot Alpha
        .toggle-button.taproot {
          border-color: rgba(255, 107, 0, 0.3);
        }
        
        .toggle-button.taproot:hover {
          background: rgba(255, 107, 0, 0.1);
        }
        
        .toggle-button.taproot.active {
          background: rgba(255, 107, 0, 0.2);
          color: #ff6b00;
        }
        
        .toggle-button.taproot.active::after {
          background: #ff6b00;
        }
        
        @media (max-width: 768px) {
          .staking-toggle {
            flex-wrap: wrap;
            gap: 4px;
            padding: 6px;
          }
          
          .toggle-button {
            min-width: 49%; /* Twee knoppen per rij op tablets */
            padding: 0.8rem 0.6rem;
            font-size: 0.6rem;
            line-height: 1;
            font-weight: bold;
          }
          
          .toggle-button.taproot {
            /* Extra zichtbare styling voor Taproot Alpha tab op mobiel */
            border: 1px solid rgba(255, 107, 0, 0.5); 
            box-shadow: 0 0 5px rgba(255, 107, 0, 0.3);
          }
        }
        
        @media (max-width: 480px) {
          .toggle-button {
            min-width: 49%; /* Twee knoppen per rij op mobiel */
            padding: 0.5rem 0.3rem;
            font-size: 0.45rem;
            line-height: 1;
          }
          
          .unlock-soon {
            font-size: 0.4rem;
            padding: 0.1rem 0.15rem;
            margin-top: 1px;
          }
          
          .toggle-button.taproot {
            /* Nog duidelijkere styling voor Taproot Alpha op kleine mobiele schermen */
            border: 2px solid rgba(255, 107, 0, 0.7);
            box-shadow: 0 0 8px rgba(255, 107, 0, 0.4);
          }
        }
        
        /* Mission styles voor Rune Guardians */
        .mission-container {
          margin-top: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid #7b68ee;
          padding: 1rem;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .mission-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #7b68ee, transparent);
          z-index: 1;
        }
        
        .mission-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #7b68ee;
          margin-bottom: 1rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        .mission-description {
          font-size: 0.7rem;
          font-family: 'Press Start 2P', monospace;
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .action-button {
          background: linear-gradient(to bottom, #7b68ee, #483d8b);
          color: white;
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 4px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1rem;
        }
        
        .action-button:hover {
          background: linear-gradient(to bottom, #9370db, #7b68ee);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(123, 104, 238, 0.3);
        }
        
        .stats-container {
          background: rgba(123, 104, 238, 0.1);
          border: 1px solid #7b68ee;
          padding: 0.8rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          text-align: center;
        }
        
        .guardian-stats {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #7b68ee;
          margin: 0;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 150px;
          padding: 1rem;
        }
        
        .loading-spinner {
          border: 3px solid rgba(123, 104, 238, 0.3);
          border-radius: 50%;
          border-top: 3px solid #7b68ee;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        // Stijl voor SigmaX tab toevoegen
        .toggle-button.sigmax {
          border-color: rgba(74, 134, 232, 0.3);
        }
        
        .toggle-button.sigmax:hover {
          background: rgba(74, 134, 232, 0.1);
        }
        
        .toggle-button.sigmax.active {
          background: rgba(74, 134, 232, 0.2);
          color: #4a86e8;
        }
        
        .toggle-button.sigmax.active::after {
          background: #4a86e8;
        }
        
        @media (max-width: 768px) {
          // Bestaande mobiele stijlen behouden...
          
          .toggle-button.sigmax {
            /* Extra zichtbare styling voor SigmaX tab op mobiel */
            border: 1px solid rgba(74, 134, 232, 0.5); 
            box-shadow: 0 0 5px rgba(74, 134, 232, 0.3);
          }
        }
        
        @media (max-width: 480px) {
          // Bestaande stijlen voor kleine schermen behouden...
          
          .toggle-button.sigmax {
            /* Nog duidelijkere styling voor SigmaX op kleine mobiele schermen */
            border: 2px solid rgba(74, 134, 232, 0.7);
            box-shadow: 0 0 8px rgba(74, 134, 232, 0.4);
          }
        }
        
        .toggle-button.locked {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.2);
          color: #777;
          border: 1px solid rgba(119, 119, 119, 0.3);
          position: relative;
        }
        
        .toggle-button.locked:hover {
          background: rgba(0, 0, 0, 0.2);
          transform: none;
          box-shadow: none;
        }
        
        .unlock-soon {
          font-size: 0.55rem;
          background-color: rgba(255, 215, 0, 0.2);
          color: #ffd700;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          margin-left: 5px;
          vertical-align: middle;
          display: inline-block;
        }
        
        @media (max-width: 768px) {
          .unlock-soon {
            font-size: 0.5rem;
            padding: 0.1rem 0.2rem;
          }
        }
        
        .tiger-progress-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto 1.5rem auto;
          padding: 0.7rem 1rem;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 215, 0, 0.5);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .tiger-progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffd700;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
        }
        
        .tiger-progress-label {
          color: #aaa;
          font-size: 0.6rem;
        }
        
        .tiger-progress-value {
          color: #fff;
          font-weight: bold;
        }
        
        .tiger-progress-percent {
          color: #ffd700;
          font-weight: bold;
        }
        
        .tiger-progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .tiger-progress-fill {
          height: 100%;
          background: linear-gradient(to right, #4caf50, #45a049);
          border-radius: 5px;
          transition: width 0.5s ease;
          position: relative;
          overflow: hidden;
        }
        
        .tiger-progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg, 
            rgba(255, 255, 255, 0) 25%, 
            rgba(255, 255, 255, 0.2) 25%, 
            rgba(255, 255, 255, 0.2) 50%, 
            rgba(255, 255, 255, 0) 50%, 
            rgba(255, 255, 255, 0) 75%, 
            rgba(255, 255, 255, 0.2) 75%, 
            rgba(255, 255, 255, 0.2) 100%
          );
          background-size: 30px 30px;
          animation: progress-animation 2s linear infinite;
        }
        
        @keyframes progress-animation {
          0% { background-position: 0 0; }
          100% { background-position: 60px 0; }
        }
        
        @media (max-width: 768px) {
          .tiger-progress-container {
            display: none; /* Verbergen op mobiel */
          }
        }
        
        .tiger-progress-subtitle {
          font-size: 0.55rem;
          color: #aaa;
          text-align: right;
          margin-top: 0.3rem;
          font-family: 'Press Start 2P', monospace;
        }
      `}</style>

      <div className="staking-page">
        {/* Staking Type Toggle - direct onder de navigatiebalk, voor de title */}
        <div className="staking-toggle">
          <button 
            className={`toggle-button locked ${stakingType === 'artifacts' ? 'active' : ''}`}
            onClick={() => handleStakingTypeChange('artifacts')}
            title="Deze functie is momenteel vergrendeld"
          >
            Tiger Artifacts 🔒 <span className="unlock-soon">30%</span>
          </button>
          <button 
            className={`toggle-button ${stakingType === 'tigers' ? 'active' : ''}`}
            onClick={() => handleStakingTypeChange('tigers')}
          >
            Bitcoin Tigers
          </button>
          <button 
            className={`toggle-button locked ${stakingType === 'guardians' ? 'active' : ''}`}
            onClick={() => handleStakingTypeChange('guardians')}
            title="Deze functie is momenteel vergrendeld"
          >
            Rune Guardians<br/>🔒 <span className="unlock-soon">30%</span>
          </button>
          <button 
            className={`toggle-button taproot locked ${stakingType === 'taproot' ? 'active' : ''}`}
            onClick={() => handleStakingTypeChange('taproot')}
            title="Deze functie is momenteel vergrendeld"
          >
            Taproot<br/>Alpha<br/>🔒 <span className="unlock-soon">50%</span>
          </button>
          <button 
            className={`toggle-button sigmax locked ${stakingType === 'sigmax' ? 'active' : ''}`}
            onClick={() => handleStakingTypeChange('sigmax')}
            title="Deze functie is momenteel vergrendeld"
          >
            Ordinal SigmaX<br/>🔒 <span className="unlock-soon">100%</span>
          </button>
        </div>
        
        {/* Progress bar - alleen desktop - toont hoeveel tigers al verkocht zijn */}
        <div className="tiger-progress-container">
          <div className="tiger-progress-info">
            <span className="tiger-progress-label">Tigers Sold:</span>
            <span className="tiger-progress-value">152 / 999</span>
            <span className="tiger-progress-percent">15.2%</span>
          </div>
          <div className="tiger-progress-bar">
            <div className="tiger-progress-fill" style={{ width: '15.2%' }}></div>
          </div>
          <div className="tiger-progress-subtitle">847 Tigers Remaining (84.8%)</div>
        </div>

        <h1 className="page-title">Bitcoin Tiger Soft Staking</h1>
        <p className="page-subtitle">Stake your Bitcoin Tigers or Tiger Artifacts to earn rewards</p>
        
        {/* API Status waarschuwing - alleen tonen bij Tiger Artifacts */}
        {stakingType === 'artifacts' && API_STATUS.USING_FALLBACK && (
          <div className="warning-banner">
            ⚠️ Unable to fetch Tiger Artifacts from Magic Eden API. Sample Tiger Artifacts are being displayed for demo purposes.
          </div>
        )}
        
        {stakingType === 'artifacts' && !API_STATUS.USING_FALLBACK && userOrdinals.length === 0 && !isLoading && walletAddress && (
          <div className="info-banner">
            ℹ️ No Tiger Artifacts found in your wallet. Make sure your wallet contains Tiger Artifacts or try a different wallet.
          </div>
        )}
        
        {walletAddress ? (
          <div className="wallet-info">
            <span>Connected:</span>
            <span className="wallet-address">{walletAddress}</span>
            <button 
              className="refresh-button" 
              onClick={stakingType === 'artifacts' ? refreshArtifacts : loadWalletAndStakingData}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : `Refresh ${stakingType === 'artifacts' ? 'Artifacts' : stakingType === 'taproot' ? 'Taproots' : 'Tigers'}`}
            </button>
          </div>
        ) : (
          <div className="wallet-info">
            <span>No wallet connected</span>
          </div>
        )}
        
        {/* Render the appropriate staking interface based on toggle */}
        {stakingType === 'artifacts' ? (
          <>
            {/* Artifact Staking UI - bestaande code */}
            <div className="staking-container">
              {/* User Artifacts */}
              <div className="staking-card your-artifacts-card">
                <div className="card-header">
                  <div className="card-icon">🎨</div>
                  <h2 className="card-title">Your Tiger Artifacts</h2>
                </div>
                
                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your artifacts...</p>
                  </div>
                ) : userOrdinals.length === 0 ? (
                  <div className="empty-state">
                    You don't have any unstaked Tiger Artifacts
                  </div>
                ) : (
                  <div className="ordinals-grid">
                    {userOrdinals.map(ordinal => (
                      <div 
                        key={ordinal.id}
                        className={`ordinal-item ${selectedOrdinal === ordinal.id ? 'selected' : ''}`}
                        onClick={() => setSelectedOrdinal(ordinal.id)}
                      >
                        <Image 
                          src={getImageUrl(ordinal)} 
                          alt={ordinal.name}
                          width={100}
                          height={100}
                          className="ordinal-image"
                          unoptimized={true}
                          onError={(e) => {
                            // Fallback naar default image bij fout
                            (e.target as HTMLImageElement).src = '/tiger-pixel1.png';
                          }}
                        />
                        <div className="ordinal-name">{ordinal.name}</div>
                        <div className={`rarity-badge ${ordinal.rarity?.toLowerCase() || 'bronze'}`}>
                          {ordinal.rarity || 'BRONZE'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="eligibility-info">
                  Staked artifacts require a {TIGER_ARTIFACTS_CONFIG.STAKING.ELIGIBILITY_PERIOD_DAYS}-day activation period before becoming eligible for rewards.
                </div>
                
                <button 
                  className="action-button"
                  onClick={handleStakeOrdinal}
                  disabled={isStakingOrdinal || !selectedOrdinal || isLoading}
                >
                  {isStakingOrdinal ? 'Processing...' : 'Stake Selected Artifact'}
                </button>
              </div>
              
              {/* Staked Artifacts */}
              <div className="staking-card staked-artifacts-card">
                <div className="card-header">
                  <div className="card-icon">🔒</div>
                  <h2 className="card-title">Your Staked Artifacts</h2>
                </div>
                
                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading staked artifacts...</p>
                  </div>
                ) : stakedOrdinals.length === 0 ? (
                  <div className="empty-state">
                    You don't have any staked Tiger Artifacts
                  </div>
                ) : (
                  <div className="ordinals-grid">
                    {stakedOrdinals.map(ordinal => (
                      <div 
                        key={ordinal.id}
                        className={`ordinal-item ${selectedStakedOrdinal === ordinal.id ? 'selected' : ''}`}
                        onClick={() => setSelectedStakedOrdinal(ordinal.id)}
                      >
                        <Image 
                          src={getImageUrl(ordinal)} 
                          alt={ordinal.name}
                          width={100}
                          height={100}
                          className="ordinal-image"
                          unoptimized={true}
                          onError={(e) => {
                            // Fallback naar default image bij fout
                            (e.target as HTMLImageElement).src = '/tiger-pixel1.png';
                          }}
                        />
                        <div className="ordinal-name">{ordinal.name}</div>
                        <div className="staked-badge">STAKED</div>
                        <div className={`rarity-badge ${ordinal.rarity?.toLowerCase() || 'bronze'}`}>
                          {ordinal.rarity || 'BRONZE'}
                        </div>
                        <div className={`eligibility-badge ${ordinal.isEligible ? 'eligible' : 'pending'}`}>
                          {ordinal.isEligible ? 'ELIGIBLE' : formatTimeRemaining(ordinal.eligibleAt)}
                        </div>
                        {ordinal.isEligible && profitDistribution[ordinal.id] && (
                          <div className="profit-value">
                            +{profitDistribution[ordinal.id].toLocaleString()} sats
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="eligibility-info">
                  <span className="eligibility-count">{totalEligibleOrdinals}</span> of {stakedOrdinals.length} staked artifacts are currently eligible for rewards.
                  
                  {/* Rariteit statistieken */}
                  <div className="rarity-stats">
                    <div className="rarity-stats-row">
                      <span className="rarity-name">
                        <span className="rarity-color gold"></span>Gold
                      </span>
                      <span>{rarityStats.GOLD}</span>
                    </div>
                    <div className="rarity-stats-row">
                      <span className="rarity-name">
                        <span className="rarity-color silver"></span>Silver
                      </span>
                      <span>{rarityStats.SILVER}</span>
                    </div>
                    <div className="rarity-stats-row">
                      <span className="rarity-name">
                        <span className="rarity-color bronze"></span>Bronze
                      </span>
                      <span>{rarityStats.BRONZE}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="action-button"
                  onClick={handleUnstakeOrdinal}
                  disabled={isUnstakingOrdinal || !selectedStakedOrdinal || isLoading}
                >
                  {isUnstakingOrdinal ? 'Processing...' : 'Unstake Selected Artifact'}
                </button>
              </div>
              
              {/* Rewards Card */}
              <div className="staking-card rewards-card">
                <div className="card-header">
                  <div className="card-icon">🏆</div>
                  <h2 className="card-title">Your Rewards</h2>
                </div>
                
                <div className="rewards-value">
                  {rewards.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="sats-label">sats</span>
                </div>
                
                <div className="staking-stats">
                  <div className="stat-item">
                    <div className="stat-label">Staked Artifacts</div>
                    <div className="stat-value">{stakedOrdinals.length}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Eligible Artifacts</div>
                    <div className="stat-value">{totalEligibleOrdinals}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Revenue Share</div>
                    <div className="stat-value">{totalEligibleOrdinals > 0 ? (totalEligibleOrdinals * 0.5).toFixed(1) : '0'} sats/min</div>
                  </div>
                </div>
                
                <div className="rewards-info">
                  Your staked artifacts earn a share of revenue from all games on the platform. Only eligible artifacts generate rewards. The more eligible artifacts you stake, the more rewards you earn.
                </div>
                
                <button 
                  className="claim-button"
                  onClick={handleClaimRewards}
                  disabled={isClaiming || rewards <= 0 || isLoading}
                >
                  {isClaiming ? 'Processing...' : 'Claim Rewards'}
                </button>
              </div>
            </div>
          </>
        ) : stakingType === 'tigers' ? (
          // Bitcoin Tigers Staking UI
          <BitcoinTigersStaking 
            walletAddress={walletAddress} 
          />
        ) : stakingType === 'taproot' ? (
          // Taproot Alpha Staking UI
          <TaprootAlphaMissions
            walletAddress={walletAddress}
            userTaproots={(() => {
              // Combineer userTaproots met bitcoinTigers uit localStorage
              const allTaproots = [...userTaproots];
              
              // Haal bitcoinTigers uit localStorage, net zoals bij de Rune Guardians tab
              const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
              if (cachedTigers) {
                const parsedTigers = JSON.parse(cachedTigers);
                console.log(`Adding ${parsedTigers.length} Bitcoin Tigers from cache to Taproot Alpha missions`);
                
                // Voorkom duplicaten door eerst de bestaande IDs te verzamelen
                const existingIds = new Set(allTaproots.map(t => t.id));
                
                // Filter alle tigers die al in userTaproots zitten
                const uniqueTigers = parsedTigers.filter((tiger: any) => !existingIds.has(tiger.id));
                console.log(`Adding ${uniqueTigers.length} unique Bitcoin Tigers after filtering out duplicates`);
                
                // Voeg alleen unieke tigers toe
                allTaproots.push(...uniqueTigers);
              }
              
              return allTaproots;
            })()}
            stakedTaproots={stakedTaproots}
            onStake={handleStakeTaproot}
            onUnstake={handleUnstakeTaproot}
            onRefresh={refreshTaproots}
            bannerImage="/tiger_X_taproot.png"
          />
        ) : stakingType === 'sigmax' ? (
          // SigmaX Staking UI
          <OrdinalSigmaXMissions 
            walletAddress={walletAddress} 
            userSigmaX={(() => {
              // Alleen echte SigmaX ordinals laden, geen Bitcoin Tigers of Taproot Alpha
              const allOrdinals: any[] = [];
              
              // Haal alleen SigmaX uit localStorage
              const cachedSigmaX = localStorage.getItem(`sigmaX_${walletAddress}`);
              if (cachedSigmaX) {
                const parsedSigmaX = JSON.parse(cachedSigmaX);
                console.log(`Laden van ${parsedSigmaX.length} SigmaX ordinals uit cache`);
                
                // Expliciete markering als SigmaX
                const markedSigmaX = parsedSigmaX.map((ordinal: any) => ({
                  ...ordinal,
                  isSigmaX: true
                }));
                
                allOrdinals.push(...markedSigmaX);
              }
              
              console.log(`Totaal aantal SigmaX ordinals doorgegeven aan component: ${allOrdinals.length}`);
              return allOrdinals;
            })()}
          />
        ) : (
          // Rune Guardians Staking UI
          <div className="staking-page-container">
            <div className="staking-container rune-guardians-container">
              <div className="staking-card rune-guardians-card">
                <div className="card-header">
                  <div className="card-icon">🔮</div>
                  <h2 className="card-title">Your Rune Guardians</h2>
                </div>
                
                {stakingType === 'guardians' && !API_STATUS.USING_FALLBACK && userGuardians.length === 0 && !isLoading && walletAddress && (
                  <div className="info-banner">
                    ℹ️ No Rune Guardians found in your wallet. Make sure your wallet contains Rune Guardians to access special missions.
                  </div>
                )}
                
                <div className="missions-container">
                  <h3 className="mission-title">Rune Guardian Missions</h3>
                  <p className="mission-description">
                    Stake your Rune Guardians together with Bitcoin Tigers to earn double rewards in special missions.
                  </p>
                  
                  {isLoading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Loading Rune Guardians...</p>
                    </div>
                  ) : walletAddress ? (
                    <>
                      {userGuardians.length > 0 ? (
                        <>
                          <div className="stats-container">
                            <p className="guardian-stats">Found {userGuardians.length} Rune Guardians in your wallet</p>
                          </div>
                          <TigerMissions 
                            walletAddress={walletAddress}
                            userTigers={(() => {
                              // Haal guardians en bitcoinTigers uit de state
                              const tigers = [...userGuardians];
                              
                              // Haal bitcoinTigers uit localStorage
                              const cachedTigers = localStorage.getItem(`bitcoinTigers_${walletAddress}`);
                              if (cachedTigers) {
                                const parsedTigers = JSON.parse(cachedTigers);
                                console.log(`Adding ${parsedTigers.length} Bitcoin Tigers from cache to missions`);
                                
                                // Voorkom duplicaten door eerst de bestaande IDs te verzamelen
                                const existingIds = new Set(tigers.map(t => t.id));
                                
                                // Filter alle tigers die al in userGuardians zitten
                                const uniqueTigers = parsedTigers.filter((tiger: any) => !existingIds.has(tiger.id));
                                console.log(`Adding ${uniqueTigers.length} unique Bitcoin Tigers after filtering out duplicates`);
                                
                                // Voeg alleen unieke tigers toe
                                tigers.push(...uniqueTigers);
                              }
                              
                              return tigers;
                            })()}
                            stakedTigers={stakedGuardians}
                            onStake={handleStakeMission}
                            onUnstake={handleUnstakeMission}
                            onRefresh={refreshArtifacts}
                          />
                        </>
                      ) : (
                        <div className="empty-state">
                          No Rune Guardians found in your wallet. Please ensure your wallet contains Rune Guardians.
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-state">
                      Connect your wallet to view available Rune Guardian missions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Message display */}
        {message && stakingType === 'artifacts' && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>

      {/* CSS voor de Rune Guardians sectie */}
      <style jsx>{`
        .staking-page-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .rune-guardians-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .rune-guardians-card {
          width: 100%;
          background: rgba(10, 10, 30, 0.4);
          border: 2px solid #7b68ee;
          box-shadow: 0 0 20px rgba(123, 104, 238, 0.2);
          padding: 1.5rem;
          border-radius: 8px;
        }
        
        .rune-guardians-card .card-title {
          color: #7b68ee;
          text-align: center;
          font-size: 1.2rem;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          gap: 0.5rem;
        }
        
        .card-icon {
          font-size: 1.5rem;
        }
        
        .missions-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1rem;
          border: 1px solid rgba(123, 104, 238, 0.3);
          width: 100%;
        }
        
        .mission-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #7b68ee;
          margin-bottom: 1rem;
          text-align: center;
          text-shadow: 0 0 5px rgba(123, 104, 238, 0.5);
        }
        
        .mission-description {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #ccc;
          line-height: 1.6;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .stats-container {
          background: rgba(123, 104, 238, 0.1);
          border: 1px solid #7b68ee;
          padding: 0.8rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          text-align: center;
        }
        
        .guardian-stats {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #7b68ee;
          margin: 0;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 150px;
          padding: 1rem;
        }
        
        .loading-spinner {
          border: 3px solid rgba(123, 104, 238, 0.3);
          border-radius: 50%;
          border-top: 3px solid #7b68ee;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 150px;
          color: #aaa;
          text-align: center;
          font-size: 0.7rem;
          font-family: 'Press Start 2P', monospace;
          line-height: 1.5;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(123, 104, 238, 0.2);
          padding: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .missions-container {
            padding: 1rem;
          }
          
          .mission-title {
            font-size: 0.8rem;
          }
          
          .mission-description {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </>
  )
} 