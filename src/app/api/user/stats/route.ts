import { NextRequest, NextResponse } from 'next/server'
import { getUserStats, calculateRank, ranks } from '@/lib/ranking'

// In a real application this would be a database query
// Mock data for demonstration purposes
interface UserStats {
  address: string
  totalWagered: number
  rank: string
  rankProgress: number
  nextRank: string
  dailyWager: number
  weeklyWager: number
  monthlyWager: number
  gameStats: {
    chests: { played: number, won: number, wagered: number }
    coinflip: { played: number, won: number, wagered: number }
    raffles: { entered: number, won: number, wagered: number }
  }
}

// Mock database for demonstration purposes
const mockUserStats: { [key: string]: UserStats } = {
  // Some predefined users for demonstration
  'bc1ptyou94q9vdvrj9yhcqwezmhvn': {
    address: 'bc1ptyou94q9vdvrj9yhcqwezmhvn',
    totalWagered: 350000,
    rank: 'Gold',
    rankProgress: 35,
    nextRank: 'Platinum',
    dailyWager: 15000,
    weeklyWager: 78000,
    monthlyWager: 210000,
    gameStats: {
      chests: { played: 120, won: 45, wagered: 180000 },
      coinflip: { played: 87, won: 42, wagered: 130000 },
      raffles: { entered: 12, won: 1, wagered: 40000 }
    }
  },
  'bc1ptiger44a9vdwrj9yhcqwezmhvn': {
    address: 'bc1ptiger44a9vdwrj9yhcqwezmhvn',
    totalWagered: 12000,
    rank: 'Bronze',
    rankProgress: 8,
    nextRank: 'Silver',
    dailyWager: 2000,
    weeklyWager: 8000,
    monthlyWager: 12000,
    gameStats: {
      chests: { played: 25, won: 8, wagered: 5000 },
      coinflip: { played: 30, won: 12, wagered: 6000 },
      raffles: { entered: 2, won: 0, wagered: 1000 }
    }
  }
}

// Mock data generator functie
function generateMockStats(address: string) {
  // Genereer een semi-willekeurige wager hoeveelheid op basis van wallet adres
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseWager = hash % 10000000; // Max 10 miljoen wager
  
  // Bereken rank en progress
  const { currentRank, nextRank, progress } = calculateRank(baseWager);
  
  // Generate random stats voor spellen
  const chestsPlayed = Math.floor(baseWager / 10000);
  const chestsWon = Math.floor(chestsPlayed * 0.4); // 40% win rate
  const chestsWagered = Math.floor(baseWager * 0.5); // 50% van totaal
  
  const coinflipPlayed = Math.floor(baseWager / 15000);
  const coinflipWon = Math.floor(coinflipPlayed * 0.48); // 48% win rate
  const coinflipWagered = Math.floor(baseWager * 0.3); // 30% van totaal
  
  const rafflesEntered = Math.floor(baseWager / 100000);
  const rafflesWon = Math.floor(rafflesEntered * 0.1); // 10% win rate
  const rafflesWagered = Math.floor(baseWager * 0.2); // 20% van totaal
  
  // Tijdsgebaseerde wagers
  const dailyWager = Math.floor(baseWager * 0.05);
  const weeklyWager = Math.floor(baseWager * 0.2);
  const monthlyWager = Math.floor(baseWager * 0.6);
  
  return {
    address,
    totalWagered: baseWager,
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
    },
    isMockData: true
  };
}

export async function GET(request: NextRequest) {
  try {
    // Haal het wallet adres uit de query parameters
    const address = request.nextUrl.searchParams.get('address')
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }
    
    try {
      // Probeer eerst de echte stats op te halen
      const userStats = await getUserStats(address)
      return NextResponse.json(userStats)
    } catch (dbError) {
      console.warn('Failed to get user stats from database, using mock data:', dbError)
      
      // Genereer mock data als fallback
      const mockStats = generateMockStats(address)
      return NextResponse.json(mockStats)
    }
  } catch (error) {
    console.error('Error in user stats API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user statistics', details: String(error) },
      { status: 500 }
    )
  }
} 