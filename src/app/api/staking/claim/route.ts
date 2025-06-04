import { NextRequest, NextResponse } from 'next/server';
import { stakingService } from '@/server/services/stakingService';

export async function POST(
  request: NextRequest
) {
  try {
    // Haal de request body op
    const body = await request.json();
    const { walletAddress } = body;

    // Valideer de request body
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Claim rewards via de service
    const result = await stakingService.claimRewards(walletAddress);

    // Return het resultaat
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error claiming rewards:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 