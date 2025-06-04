import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get wallet address from query params
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client is not available');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Find the wallet first to get its ID
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: { UserRanking: true }
    });
    
    if (!wallet) {
      return NextResponse.json(
        { rank: 'No Rank' }, 
        { status: 200 }
      );
    }
    
    // If we have a user ranking, return the current rank
    if (wallet.UserRanking) {
      return NextResponse.json(
        { 
          rank: wallet.UserRanking.currentRank,
          progress: wallet.UserRanking.rankProgress,
          totalWagered: wallet.UserRanking.totalWagered,
          dailyWager: wallet.UserRanking.dailyWager,
          weeklyWager: wallet.UserRanking.weeklyWager,
          monthlyWager: wallet.UserRanking.monthlyWager
        },
        { status: 200 }
      );
    }
    
    // Default response if no rank is found
    return NextResponse.json(
      { rank: 'No Rank' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user rank' },
      { status: 500 }
    );
  }
} 