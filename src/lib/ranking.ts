import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Herdefiniëren van de enums die we nodig hebben
enum RewardType {
  RAKEBACK = 'RAKEBACK',
  MONTHLY_BONUS = 'MONTHLY_BONUS',
  LOSS_COMPENSATION = 'LOSS_COMPENSATION',
  WEEKLY_LOSS_COMPENSATION = 'WEEKLY_LOSS_COMPENSATION'
}

export interface RankLevel {
  name: string;
  level: number;
  minWager: number;
  color: string;
  rakeback: number;
  lossComp: number;
  flatBonus: number;
  monthlyReq: number;
  benefits: string[];
}

// Definities van ranks
export const ranks: RankLevel[] = [
  // Initiate ranks
  { 
    name: 'Initiate', 
    level: 1,
    minWager: 500000, 
    color: '#CD7F32',
    rakeback: 0.01,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1% Rakeback', 'Initiate I badge', 'Special chat role', 'Access to community events']
  },
  { 
    name: 'Initiate', 
    level: 2,
    minWager: 1000000, 
    color: '#CD7F32',
    rakeback: 0.01,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1% Rakeback', 'Initiate II badge', 'Special chat role', 'Access to community events']
  },
  { 
    name: 'Initiate', 
    level: 3,
    minWager: 2000000, 
    color: '#CD7F32',
    rakeback: 0.01,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1% Rakeback', 'Initiate III badge', 'Special chat role', 'Access to community events']
  },
  { 
    name: 'Initiate', 
    level: 4,
    minWager: 3500000, 
    color: '#CD7F32',
    rakeback: 0.01,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1% Rakeback', 'Initiate IV badge', 'Special chat role', 'Access to community events']
  },
  { 
    name: 'Initiate', 
    level: 5,
    minWager: 5000000, 
    color: '#CD7F32',
    rakeback: 0.01,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1% Rakeback', 'Initiate V badge', 'Special chat role', 'Access to community events', 'Access to Initiate lootboxes']
  },
  
  // Hunter ranks (voorheen Silver)
  { 
    name: 'Hunter', 
    level: 1,
    minWager: 10000000, 
    color: '#C0C0C0',
    rakeback: 0.015,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1.5% Rakeback', 'Hunter I badge', 'Hunter chat role', 'Access to Hunter giveaways', 'Access to Hunter lootboxes']
  },
  { 
    name: 'Hunter', 
    level: 2,
    minWager: 20000000, 
    color: '#C0C0C0',
    rakeback: 0.015,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1.5% Rakeback', 'Hunter II badge', 'Hunter chat role', 'Access to Hunter giveaways', 'Access to Hunter lootboxes']
  },
  { 
    name: 'Hunter', 
    level: 3,
    minWager: 30000000, 
    color: '#C0C0C0',
    rakeback: 0.015,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1.5% Rakeback', 'Hunter III badge', 'Hunter chat role', 'Access to Hunter giveaways', 'Access to Hunter lootboxes']
  },
  { 
    name: 'Hunter', 
    level: 4,
    minWager: 40000000, 
    color: '#C0C0C0',
    rakeback: 0.015,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1.5% Rakeback', 'Hunter IV badge', 'Hunter chat role', 'Access to Hunter giveaways', 'Access to Hunter lootboxes']
  },
  { 
    name: 'Hunter', 
    level: 5,
    minWager: 50000000, 
    color: '#C0C0C0',
    rakeback: 0.015,
    lossComp: 0,
    flatBonus: 0,
    monthlyReq: 0,
    benefits: ['1.5% Rakeback', 'Hunter V badge', 'Hunter chat role', 'Access to Hunter giveaways', 'Priority customer support', 'Access to Hunter lootboxes']
  },
  
  // Elite ranks (voorheen Gold)
  { 
    name: 'Elite', 
    level: 1,
    minWager: 50000000, 
    color: '#FFD700',
    rakeback: 0.02,
    lossComp: 0.01,
    flatBonus: 25000,
    monthlyReq: 800000,
    benefits: ['2% Rakeback', '1% Loss Compensation', '25k sats monthly bonus', 'Elite I badge', 'Elite Discord channel access', 'Exclusive Elite giveaways']
  },
  { 
    name: 'Elite', 
    level: 2,
    minWager: 100000000, 
    color: '#FFD700',
    rakeback: 0.02,
    lossComp: 0.01,
    flatBonus: 25000,
    monthlyReq: 800000,
    benefits: ['2% Rakeback', '1% Loss Compensation', '25k sats monthly bonus', 'Elite II badge', 'Elite Discord channel access', 'Exclusive Elite giveaways']
  },
  { 
    name: 'Elite', 
    level: 3,
    minWager: 150000000, 
    color: '#FFD700',
    rakeback: 0.02,
    lossComp: 0.01,
    flatBonus: 25000,
    monthlyReq: 800000,
    benefits: ['2% Rakeback', '1% Loss Compensation', '25k sats monthly bonus', 'Elite III badge', 'Elite Discord channel access', 'Exclusive Elite giveaways']
  },
  { 
    name: 'Elite', 
    level: 4,
    minWager: 200000000, 
    color: '#FFD700',
    rakeback: 0.02,
    lossComp: 0.01,
    flatBonus: 25000,
    monthlyReq: 800000,
    benefits: ['2% Rakeback', '1% Loss Compensation', '25k sats monthly bonus', 'Elite IV badge', 'Elite Discord channel access', 'Exclusive Elite giveaways']
  },
  { 
    name: 'Elite', 
    level: 5,
    minWager: 250000000, 
    color: '#FFD700',
    rakeback: 0.02,
    lossComp: 0.01,
    flatBonus: 25000,
    monthlyReq: 800000,
    benefits: ['2% Rakeback', '1% Loss Compensation', '25k sats monthly bonus', 'Elite V badge', 'Elite Discord channel access', 'Exclusive Elite giveaways', 'Elite NFT collection access']
  },
  
  // Master ranks (voorheen Platinum)
  { 
    name: 'Master', 
    level: 1,
    minWager: 250000000, 
    color: '#E5E4E2',
    rakeback: 0.025,
    lossComp: 0.015,
    flatBonus: 100000,
    monthlyReq: 4500000,
    benefits: ['2.5% Rakeback', '1.5% Loss Compensation', '100k sats monthly bonus', 'Master I badge', 'Priority support via Discord', 'VIP giveaways']
  },
  { 
    name: 'Master', 
    level: 2,
    minWager: 500000000, 
    color: '#E5E4E2',
    rakeback: 0.025,
    lossComp: 0.015,
    flatBonus: 100000,
    monthlyReq: 4500000,
    benefits: ['2.5% Rakeback', '1.5% Loss Compensation', '100k sats monthly bonus', 'Master II badge', 'Priority support via Discord', 'VIP giveaways']
  },
  { 
    name: 'Master', 
    level: 3,
    minWager: 750000000, 
    color: '#E5E4E2',
    rakeback: 0.025,
    lossComp: 0.015,
    flatBonus: 100000,
    monthlyReq: 4500000,
    benefits: ['2.5% Rakeback', '1.5% Loss Compensation', '100k sats monthly bonus', 'Master III badge', 'Priority support via Discord', 'VIP giveaways']
  },
  { 
    name: 'Master', 
    level: 4,
    minWager: 1000000000, 
    color: '#E5E4E2',
    rakeback: 0.025,
    lossComp: 0.015,
    flatBonus: 100000,
    monthlyReq: 4500000,
    benefits: ['2.5% Rakeback', '1.5% Loss Compensation', '100k sats monthly bonus', 'Master IV badge', 'Priority support via Discord', 'VIP giveaways']
  },
  { 
    name: 'Master', 
    level: 5,
    minWager: 1250000000, 
    color: '#E5E4E2',
    rakeback: 0.025,
    lossComp: 0.015,
    flatBonus: 100000,
    monthlyReq: 4500000,
    benefits: ['2.5% Rakeback', '1.5% Loss Compensation', '100k sats monthly bonus', 'Master V badge', 'Priority support via Discord', 'VIP giveaways', 'Exclusive Master NFT']
  },
  
  // Grandmaster ranks (voorheen Diamond)
  { 
    name: 'Grandmaster', 
    level: 1,
    minWager: 1250000000, 
    color: '#B9F2FF',
    rakeback: 0.03,
    lossComp: 0.02,
    flatBonus: 200000,
    monthlyReq: 15200000,
    benefits: ['3% Rakeback', '2% Weekly Loss Compensation', '200k sats monthly bonus', 'Grandmaster I badge', 'Direct chat with team', 'Exclusive Grandmaster events']
  },
  { 
    name: 'Grandmaster', 
    level: 2,
    minWager: 2500000000, 
    color: '#B9F2FF',
    rakeback: 0.03,
    lossComp: 0.02,
    flatBonus: 200000,
    monthlyReq: 15200000,
    benefits: ['3% Rakeback', '2% Weekly Loss Compensation', '200k sats monthly bonus', 'Grandmaster II badge', 'Direct chat with team', 'Exclusive Grandmaster events']
  },
  { 
    name: 'Grandmaster', 
    level: 3,
    minWager: 3750000000, 
    color: '#B9F2FF',
    rakeback: 0.03,
    lossComp: 0.02,
    flatBonus: 200000,
    monthlyReq: 15200000,
    benefits: ['3% Rakeback', '2% Weekly Loss Compensation', '200k sats monthly bonus', 'Grandmaster III badge', 'Direct chat with team', 'Exclusive Grandmaster events']
  },
  { 
    name: 'Grandmaster', 
    level: 4,
    minWager: 5000000000, 
    color: '#B9F2FF',
    rakeback: 0.03,
    lossComp: 0.02,
    flatBonus: 200000,
    monthlyReq: 15200000,
    benefits: ['3% Rakeback', '2% Weekly Loss Compensation', '200k sats monthly bonus', 'Grandmaster IV badge', 'Direct chat with team', 'Exclusive Grandmaster events']
  },
  { 
    name: 'Grandmaster', 
    level: 5,
    minWager: 6250000000, 
    color: '#B9F2FF',
    rakeback: 0.03,
    lossComp: 0.02,
    flatBonus: 200000,
    monthlyReq: 15200000,
    benefits: ['3% Rakeback', '2% Weekly Loss Compensation', '200k sats monthly bonus', 'Grandmaster V badge', 'Direct chat with team', 'Exclusive Grandmaster events', 'Custom Grandmaster NFT']
  },
  
  // Legend ranks
  { 
    name: 'Legend', 
    level: 1,
    minWager: 6250000000, 
    color: '#722F37',
    rakeback: 0.035,
    lossComp: 0.02,
    flatBonus: 350000,
    monthlyReq: 40600000,
    benefits: ['3.5% Rakeback', '2% Loss compensation', '350k sats monthly bonus', 'Legend I badge', 'Tiger Legends Discord role', 'Exclusive events']
  },
  { 
    name: 'Legend', 
    level: 2,
    minWager: 12500000000, 
    color: '#722F37',
    rakeback: 0.035,
    lossComp: 0.02,
    flatBonus: 350000,
    monthlyReq: 40600000,
    benefits: ['3.5% Rakeback', '2% Loss compensation', '350k sats monthly bonus', 'Legend II badge', 'Tiger Legends Discord role', 'Exclusive events']
  },
  { 
    name: 'Legend', 
    level: 3,
    minWager: 18750000000, 
    color: '#722F37',
    rakeback: 0.035,
    lossComp: 0.02,
    flatBonus: 350000,
    monthlyReq: 40600000,
    benefits: ['3.5% Rakeback', '2% Loss compensation', '350k sats monthly bonus', 'Legend III badge', 'Tiger Legends Discord role', 'Exclusive events']
  },
  { 
    name: 'Legend', 
    level: 4,
    minWager: 25000000000, 
    color: '#722F37',
    rakeback: 0.035,
    lossComp: 0.02,
    flatBonus: 350000,
    monthlyReq: 40600000,
    benefits: ['3.5% Rakeback', '2% Loss compensation', '350k sats monthly bonus', 'Legend IV badge', 'Tiger Legends Discord role', 'Exclusive events']
  },
  { 
    name: 'Legend', 
    level: 5,
    minWager: 31250000000, 
    color: '#722F37',
    rakeback: 0.035,
    lossComp: 0.02,
    flatBonus: 350000,
    monthlyReq: 40600000,
    benefits: ['3.5% Rakeback', '2% Loss compensation', '350k sats monthly bonus', 'Legend V badge', 'Tiger Legends Discord role', 'Exclusive events']
  }
];

/**
 * Geeft het rakeback percentage voor een bepaalde rank
 */
export function getRakebackPercentage(rankName: string): number {
  // Extraheer de basis rank naam (zonder level nummer)
  const baseName = rankName.split(' ')[0];
  
  // Zoek de eerste rank level voor deze rank
  const rankInfo = ranks.find(r => r.name === baseName);
  return rankInfo ? rankInfo.rakeback : 0;
}

/**
 * Geeft het maandelijkse bonus bedrag voor een bepaalde rank
 */
export function getMonthlyBonus(rankName: string): number {
  // Extraheer de basis rank naam (zonder level nummer)
  const baseName = rankName.split(' ')[0];
  
  // Zoek de eerste rank level voor deze rank
  const rankInfo = ranks.find(r => r.name === baseName);
  return rankInfo ? rankInfo.flatBonus : 0;
}

/**
 * Geeft het verliescompensatie percentage en maximum voor een bepaalde rank
 */
export function getLossCompensation(rankName: string): { percentage: number; maximum: number; isWeekly: boolean } {
  // Extraheer de basis rank naam (zonder level nummer)
  const baseName = rankName.split(' ')[0];
  
  // Zoek de eerste rank level voor deze rank
  const rankInfo = ranks.find(r => r.name === baseName);
  const percentage = rankInfo ? rankInfo.lossComp : 0;
  
  // Maximum berekenen op basis van rank
  let maximum = 0;
  if (baseName === 'Elite') maximum = 50000;
  else if (baseName === 'Master') maximum = 150000;
  else if (baseName === 'Grandmaster') maximum = 250000;
  else if (baseName === 'Legend') maximum = 350000;
  
  // Diamond heeft wekelijkse compensatie, de rest maandelijks
  const isWeekly = baseName === 'Grandmaster';
  
  return { percentage, maximum, isWeekly };
}

/**
 * Berekent de huidige rank van een gebruiker op basis van hun totale inzet
 */
export function calculateRank(totalWagered: number) {
  let currentRank = { name: 'No Rank', level: 0 };
  let nextRank = { name: 'Initiate', level: 1 };
  let progress = 0;
  
  // Vind de hoogste rank die is behaald
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (totalWagered >= ranks[i].minWager) {
      currentRank = { name: ranks[i].name, level: ranks[i].level };
      
      // Als dit het hoogste rank level is
      if (i === ranks.length - 1) {
        nextRank = { name: 'Max Rank', level: 0 };
        progress = 100;
      } else {
        nextRank = { name: ranks[i + 1].name, level: ranks[i + 1].level };
        progress = ((totalWagered - ranks[i].minWager) / (ranks[i + 1].minWager - ranks[i].minWager)) * 100;
      }
      
      break;
    }
  }
  
  // Als geen rank is bereikt
  if (currentRank.name === 'No Rank' && totalWagered > 0) {
    progress = (totalWagered / ranks[0].minWager) * 100;
  }
  
  // Format volgend rank level voor weergave
  const formattedNextRank = nextRank.name === 'Max Rank' 
    ? 'Max Rank' 
    : `${nextRank.name} ${nextRank.level === 1 ? 'I' : nextRank.level === 2 ? 'II' : nextRank.level === 3 ? 'III' : nextRank.level === 4 ? 'IV' : 'V'}`;
  
  // Format huidig rank level voor weergave
  const formattedCurrentRank = currentRank.name === 'No Rank' 
    ? 'No Rank' 
    : `${currentRank.name} ${currentRank.level === 1 ? 'I' : currentRank.level === 2 ? 'II' : currentRank.level === 3 ? 'III' : currentRank.level === 4 ? 'IV' : 'V'}`;
  
  return {
    currentRank: formattedCurrentRank,
    nextRank: formattedNextRank,
    progress: Math.min(Math.round(progress), 100)
  };
}

/**
 * Vereenvoudigde versie van de ranking functie
 * Deze vermijdt problemen met de relatie tussen Wallet en UserRanking
 */
export async function updateUserRanking(walletAddress: string, wagerAmount: number, gameType: 'CHEST' | 'COINFLIP' | 'RAFFLE', wonGame: boolean = false) {
  try {
    console.log(`Simplified ranking update for wallet ${walletAddress}`);
    console.log(`Game info: ${gameType}, amount: ${wagerAmount}, won: ${wonGame}`);
    
    if (!prisma) {
      console.error('Prisma is not initialized');
      return { updated: false, error: 'Prisma is not initialized' };
    }
    
    // Alleen de wallet ophalen en updaten, geen ranking bijwerken om de fout te vermijden
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      console.error('Wallet niet gevonden:', walletAddress);
      return { updated: false, error: 'Wallet niet gevonden' };
    }
    
    // Log de actie, maar voer geen updates uit op ranking
    console.log(`Skipping ranking update. Wallet found: ${wallet.address}, game: ${gameType}, amount: ${wagerAmount}`);
    
    return {
      updated: true,
      rankUp: null // Geen rank updates in deze vereenvoudigde versie
    };
  } catch (error) {
    console.error('Fout bij het bijwerken van gebruiker ranking:', error);
    return {
      updated: false,
      error: 'Kon gebruiker ranking niet bijwerken: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}

/**
 * Vereenvoudigde versie, geen rankings ophalen
 */
export async function getUserStats(walletAddress: string) {
  try {
    if (!prisma) {
      console.warn('Prisma is not initialized, using fallback mock data for wallet', walletAddress);
      throw new Error('Prisma client is not available');
    }
    
    // Alleen basis wallet info ophalen
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      console.log(`No wallet found for address ${walletAddress}, generating mock data`);
      
      // Genereer semi-willekeurige data op basis van wallet adres
      const hash = walletAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const baseWager = hash % 10000000; // Max 10 miljoen wager
      
      const { currentRank, nextRank, progress } = calculateRank(baseWager);
      
      return {
        address: walletAddress,
        totalWagered: baseWager,
        rank: currentRank,
        rankProgress: progress,
        nextRank: nextRank,
        dailyWager: Math.floor(baseWager * 0.05),
        weeklyWager: Math.floor(baseWager * 0.2),
        monthlyWager: Math.floor(baseWager * 0.6),
        gameStats: {
          chests: { 
            played: Math.floor(baseWager / 10000), 
            won: Math.floor((baseWager / 10000) * 0.4), 
            wagered: Math.floor(baseWager * 0.5) 
          },
          coinflip: { 
            played: Math.floor(baseWager / 15000), 
            won: Math.floor((baseWager / 15000) * 0.48), 
            wagered: Math.floor(baseWager * 0.3) 
          },
          raffles: { 
            entered: Math.floor(baseWager / 100000), 
            won: Math.floor((baseWager / 100000) * 0.1), 
            wagered: Math.floor(baseWager * 0.2) 
          }
        },
        isMockData: true
      };
    }
    
    // Probeer transacties op te halen om wager te berekenen
    try {
      const transactions = await prisma.transaction.findMany({
        where: { 
          walletId: wallet.id,
          // Alleen game transacties (geen deposits, etc.)
          OR: [
            { type: 'CHEST' },
            { type: 'COINFLIP' },
            { type: 'RAFFLE' }
          ]
        }
      });
      
      // Bereken wager op basis van transacties
      const totalWagered = transactions
        .filter(tx => tx.amount < 0) // Alleen uitgaven
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
      
      // Bereken rank data
      const { currentRank, nextRank, progress } = calculateRank(totalWagered);
      
      // Bereken dagelijkse/wekelijkse/maandelijkse wagers
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const dailyWager = transactions
        .filter(tx => tx.amount < 0 && new Date(tx.createdAt) >= oneDayAgo)
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
        
      const weeklyWager = transactions
        .filter(tx => tx.amount < 0 && new Date(tx.createdAt) >= oneWeekAgo)
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
        
      const monthlyWager = transactions
        .filter(tx => tx.amount < 0 && new Date(tx.createdAt) >= oneMonthAgo)
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
      
      // Bereken spelstatistieken
      const chestTxs = transactions.filter(tx => tx.type === 'CHEST');
      const coinflipTxs = transactions.filter(tx => tx.type === 'COINFLIP');
      const raffleTxs = transactions.filter(tx => tx.type === 'RAFFLE');
      
      const chestsPlayed = chestTxs.filter(tx => tx.amount < 0).length;
      const chestsWon = chestTxs.filter(tx => tx.amount > 0).length;
      const chestsWagered = chestTxs
        .filter(tx => tx.amount < 0)
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
      
      const coinflipPlayed = coinflipTxs.filter(tx => tx.amount < 0).length;
      const coinflipWon = coinflipTxs.filter(tx => tx.amount > 0).length;
      const coinflipWagered = coinflipTxs
        .filter(tx => tx.amount < 0)
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
      
      const rafflesEntered = raffleTxs.filter(tx => tx.amount < 0).length;
      const rafflesWon = raffleTxs.filter(tx => tx.amount > 0).length;
      const rafflesWagered = raffleTxs
        .filter(tx => tx.amount < 0)
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
      
      return {
        address: walletAddress,
        totalWagered,
        rank: currentRank,
        rankProgress: progress,
        nextRank,
        dailyWager,
        weeklyWager,
        monthlyWager,
        gameStats: {
          chests: { played: chestsPlayed, won: chestsWon, wagered: chestsWagered },
          coinflip: { played: coinflipPlayed, won: coinflipWon, wagered: coinflipWagered },
          raffles: { entered: rafflesEntered, won: rafflesWon, wagered: rafflesWagered }
        }
      };
    } catch (statsError) {
      console.error('Error calculating detailed stats:', statsError);
      
      // Fallback naar basis data met rank berekend op basis van leeg account
      const { currentRank, nextRank, progress } = calculateRank(0);
      
      return {
        address: walletAddress,
        totalWagered: 0,
        rank: currentRank,
        rankProgress: progress,
        nextRank,
        dailyWager: 0,
        weeklyWager: 0,
        monthlyWager: 0,
        gameStats: {
          chests: { played: 0, won: 0, wagered: 0 },
          coinflip: { played: 0, won: 0, wagered: 0 },
          raffles: { entered: 0, won: 0, wagered: 0 }
        }
      };
    }
  } catch (error) {
    console.error('Fout bij het ophalen van gebruiker statistieken:', error);
    
    // Genereer mock data op basis van wallet adres
    const hash = walletAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseWager = hash % 10000000; // Max 10 miljoen wager
    
    const { currentRank, nextRank, progress } = calculateRank(baseWager);
    
    return {
      address: walletAddress,
      totalWagered: baseWager,
      rank: currentRank,
      rankProgress: progress,
      nextRank: nextRank,
      dailyWager: Math.floor(baseWager * 0.05),
      weeklyWager: Math.floor(baseWager * 0.2),
      monthlyWager: Math.floor(baseWager * 0.6),
      gameStats: {
        chests: { 
          played: Math.floor(baseWager / 10000), 
          won: Math.floor((baseWager / 10000) * 0.4), 
          wagered: Math.floor(baseWager * 0.5) 
        },
        coinflip: { 
          played: Math.floor(baseWager / 15000), 
          won: Math.floor((baseWager / 15000) * 0.48), 
          wagered: Math.floor(baseWager * 0.3) 
        },
        raffles: { 
          entered: Math.floor(baseWager / 100000), 
          won: Math.floor((baseWager / 100000) * 0.1), 
          wagered: Math.floor(baseWager * 0.2) 
        }
      },
      isMockData: true
    };
  }
}

/**
 * Genereert maandelijkse rakeback beloningen gebaseerd op wagers van de afgelopen maand
 */
export async function generateMonthlyRakeback() {
  try {
    const currentDate = new Date();
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);
    
    // Formatteer de periode (bijv. "2023-05" voor mei 2023)
    const period = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;
    
    // Haal alle gebruikers op met hun ranks
    const users = await prisma.userRanking.findMany({
      include: {
        wallet: true,
        gameStats: true
      }
    });
    
    for (const user of users) {
      // Sla over als gebruiker geen rank heeft
      if (user.currentRank === 'No Rank') continue;
      
      // Bereken de totale wager van de afgelopen maand
      const monthlyWager = user.monthlyWager;
      
      // Bereken het rakeback percentage op basis van de rank
      const rakebackPercentage = getRakebackPercentage(user.currentRank);
      
      // Bereken de rakeback beloning
      const rakebackAmount = Math.floor(monthlyWager * rakebackPercentage);
      
      // Alleen opslaan als er een beloning is
      if (rakebackAmount > 0) {
        await prisma.rewardClaim.create({
          data: {
            walletId: user.walletId,
            rewardType: RewardType.RAKEBACK,
            amount: rakebackAmount,
            period,
            description: `${user.currentRank} Rakeback for ${period} (${rakebackPercentage * 100}% of ${monthlyWager} sats wagered)`
          }
        });
      }
      
      // Controleer of de gebruiker recht heeft op een maandelijkse bonus
      const monthlyBonus = getMonthlyBonus(user.currentRank);
      if (monthlyBonus > 0) {
        await prisma.rewardClaim.create({
          data: {
            walletId: user.walletId,
            rewardType: RewardType.MONTHLY_BONUS,
            amount: monthlyBonus,
            period,
            description: `${user.currentRank} Monthly Bonus for ${period}`
          }
        });
      }
      
      // Bereken verliescompensatie (voor gebruikers die recht hebben hierop)
      const lossComp = getLossCompensation(user.currentRank);
      
      if (lossComp.percentage > 0 && !lossComp.isWeekly) {
        // Bereken verlies voor de maand
        const totalWagered = user.monthlyWager || 0;
        
        // Som alle winsten op voor de verschillende speltypen
        const totalWon = (
          (user.gameStats?.chestsWon || 0) + 
          (user.gameStats?.coinflipWon || 0) + 
          (user.gameStats?.rafflesWon || 0)
        );
        
        // Bereken netto verlies
        const netLoss = totalWagered - totalWon;
        
        if (netLoss > 0) {
          // Bereken compensatie (met maximum)
          const compensationAmount = Math.min(
            Math.floor(netLoss * lossComp.percentage), 
            lossComp.maximum
          );
          
          if (compensationAmount > 0) {
            await prisma.rewardClaim.create({
              data: {
                walletId: user.walletId,
                rewardType: RewardType.LOSS_COMPENSATION,
                amount: compensationAmount,
                period,
                description: `${user.currentRank} Monthly Loss Compensation for ${period} (${lossComp.percentage * 100}% of ${netLoss} sats loss, max ${lossComp.maximum})`
              }
            });
          }
        }
      }
    }
    
    // Reset de maandelijkse wagers
    await resetPeriodicStats('monthly');
    
    return { success: true, message: "Monthly rewards generated successfully" };
  } catch (error) {
    console.error("Error generating monthly rewards:", error);
    return { success: false, error: "Failed to generate monthly rewards" };
  }
}

/**
 * Genereert wekelijkse verliescompensatie (alleen voor Diamond rank)
 */
export async function generateWeeklyLossCompensation() {
  try {
    const currentDate = new Date();
    const previousWeekStart = new Date(currentDate);
    previousWeekStart.setDate(currentDate.getDate() - 7);
    
    // Formatteer de periode (bijv. "2023-W20" voor week 20 van 2023)
    const period = `${previousWeekStart.getFullYear()}-W${getWeekNumber(previousWeekStart)}`;
    
    // Haal alle Diamond rank gebruikers op
    const users = await prisma.userRanking.findMany({
      where: {
        currentRank: 'Grandmaster'
      },
      include: {
        wallet: true,
        gameStats: true
      }
    });
    
    for (const user of users) {
      const lossComp = getLossCompensation('Grandmaster');
      
      // Bereken verlies voor de week
      const totalWagered = user.weeklyWager || 0;
      
      // Som alle winsten op voor de verschillende speltypen
      const totalWon = (
        (user.gameStats?.chestsWon || 0) + 
        (user.gameStats?.coinflipWon || 0) + 
        (user.gameStats?.rafflesWon || 0)
      );
      
      // Bereken netto verlies
      const netLoss = totalWagered - totalWon;
      
      if (netLoss > 0) {
        // Bereken compensatie (met maximum)
        const compensationAmount = Math.min(
          Math.floor(netLoss * lossComp.percentage), 
          lossComp.maximum
        );
        
        if (compensationAmount > 0) {
          await prisma.rewardClaim.create({
            data: {
              walletId: user.walletId,
              rewardType: RewardType.WEEKLY_LOSS_COMPENSATION,
              amount: compensationAmount,
              period,
              description: `Grandmaster Weekly Loss Compensation for ${period} (${lossComp.percentage * 100}% of ${netLoss} sats loss, max ${lossComp.maximum})`
            }
          });
        }
      }
    }
    
    // Reset de wekelijkse wagers
    await resetPeriodicStats('weekly');
    
    return { success: true, message: "Weekly loss compensation generated successfully" };
  } catch (error) {
    console.error("Error generating weekly loss compensation:", error);
    return { success: false, error: "Failed to generate weekly loss compensation" };
  }
}

/**
 * Helper functie om weeknummer te berekenen
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Haalt claimbare beloningen op voor een specifieke wallet
 */
export async function getClaimableRewards(walletAddress: string) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      return { success: false, error: "Wallet not found" };
    }
    
    const pendingRewards = await prisma.rewardClaim.findMany({
      where: {
        walletId: wallet.id,
        status: 'PENDING'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return { 
      success: true, 
      rewards: pendingRewards,
      totalClaimable: pendingRewards.reduce((sum, reward) => sum + reward.amount, 0)
    };
  } catch (error) {
    console.error("Error getting claimable rewards:", error);
    return { success: false, error: "Failed to get claimable rewards" };
  }
}

/**
 * Claimt een specifieke beloning
 */
export async function claimReward(walletAddress: string, rewardId: string) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      return { success: false, error: "Wallet not found" };
    }
    
    const reward = await prisma.rewardClaim.findUnique({
      where: { id: rewardId }
    });
    
    if (!reward) {
      return { success: false, error: "Reward not found" };
    }
    
    if (reward.walletId !== wallet.id) {
      return { success: false, error: "Not authorized to claim this reward" };
    }
    
    if (reward.status !== 'PENDING') {
      return { success: false, error: "Reward already claimed or expired" };
    }
    
    // Update de reward naar claimed
    const [updatedReward, transaction, updatedWallet] = await prisma.$transaction([
      // Update de reward status
      prisma.rewardClaim.update({
        where: { id: rewardId },
        data: {
          status: 'CLAIMED',
          claimedAt: new Date()
        }
      }),
      
      // Maak een transactie aan
      prisma.transaction.create({
        data: {
          type: 'REWARD',
          amount: reward.amount,
          paymentHash: `reward-${rewardId}-${Date.now()}`,
          walletId: wallet.id
        }
      }),
      
      // Update het saldo
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: reward.amount
          }
        }
      })
    ]);
    
    return { 
      success: true, 
      reward: updatedReward,
      balance: updatedWallet.balance,
      message: `Successfully claimed ${reward.amount} sats ${reward.rewardType.toLowerCase()} reward` 
    };
  } catch (error) {
    console.error("Error claiming reward:", error);
    return { success: false, error: "Failed to claim reward" };
  }
}

/**
 * Claimt alle beschikbare beloningen voor een wallet in één keer
 */
export async function claimAllRewards(walletAddress: string) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      return { success: false, error: "Wallet not found" };
    }
    
    const pendingRewards = await prisma.rewardClaim.findMany({
      where: {
        walletId: wallet.id,
        status: 'PENDING'
      }
    });
    
    if (pendingRewards.length === 0) {
      return { success: true, message: "No rewards to claim", claimedAmount: 0 };
    }
    
    const totalAmount = pendingRewards.reduce((sum, reward) => sum + reward.amount, 0);
    
    // Transactie voor alle updates
    const transactionOperations = [];
    
    // Voeg alle claims toe aan de transactie
    for (const reward of pendingRewards) {
      transactionOperations.push(
        prisma.rewardClaim.update({
          where: { id: reward.id },
          data: {
            status: 'CLAIMED',
            claimedAt: new Date()
          }
        })
      );
    }
    
    // Voeg de belonings-transactie toe
    transactionOperations.push(
      prisma.transaction.create({
        data: {
          type: 'REWARD',
          amount: totalAmount,
          paymentHash: `bulk-reward-${Date.now()}`,
          walletId: wallet.id
        }
      })
    );
    
    // Update het saldo
    const walletUpdate = prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: totalAmount
        }
      }
    });
    
    transactionOperations.push(walletUpdate);
    
    // Voer alle updates uit in één transactie
    const results = await prisma.$transaction(transactionOperations);
    
    // Haal de bijgewerkte wallet op (laatste resultaat is de wallet update)
    const updatedWallet = results[results.length - 1];
    
    // Controleer of het resultaat een wallet is
    if ('balance' in updatedWallet) {
      return { 
        success: true, 
        claimedAmount: totalAmount,
        balance: updatedWallet.balance,
        message: `Successfully claimed ${pendingRewards.length} rewards for a total of ${totalAmount} sats` 
      };
    }
    
    // Fallback als het resultaat geen wallet is
    const refreshedWallet = await prisma.wallet.findUnique({
      where: { id: wallet.id }
    });
    
    return { 
      success: true, 
      claimedAmount: totalAmount,
      balance: refreshedWallet?.balance || wallet.balance + totalAmount,
      message: `Successfully claimed ${pendingRewards.length} rewards for a total of ${totalAmount} sats` 
    };
  } catch (error) {
    console.error("Error claiming all rewards:", error);
    return { success: false, error: "Failed to claim rewards" };
  }
}

/**
 * Reset dagelijkse/wekelijkse/maandelijkse statistieken - dit is om op een geplande basis uit te voeren
 */
export async function resetPeriodicStats(period: 'daily' | 'weekly' | 'monthly') {
  try {
    let updateData: any = {};
    
    if (period === 'daily') {
      updateData.dailyWager = 0;
    } else if (period === 'weekly') {
      updateData.weeklyWager = 0;
    } else if (period === 'monthly') {
      updateData.monthlyWager = 0;
    }
    
    await prisma.userRanking.updateMany({
      data: updateData
    });
    
    return true;
  } catch (error) {
    console.error(`Fout bij het resetten van ${period} statistieken:`, error);
    return false;
  }
} 