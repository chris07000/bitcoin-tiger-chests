import { NextRequest, NextResponse } from 'next/server';
import { tigerStakingService } from '@/server/services/tigerStakingService';

export async function GET(
  request: NextRequest
) {
  try {
    // Haal de wallet address uit de query parameters
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');

    // Valideer de wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Haal de tiger staking status op via de service
    const stakingStatus = await tigerStakingService.getTigerStakingStatus(walletAddress);

    // Return de staking status
    return NextResponse.json(stakingStatus);
  } catch (error: any) {
    console.error('Error getting Bitcoin Tiger staking status:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 