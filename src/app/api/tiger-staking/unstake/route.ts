import { NextRequest, NextResponse } from 'next/server';
import { tigerStakingService } from '@/server/services/tigerStakingService';

export async function POST(
  request: NextRequest
) {
  try {
    // Haal de request body op
    const body = await request.json();
    const { walletAddress, tigerId } = body;

    // Valideer de request body
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!tigerId) {
      return NextResponse.json(
        { error: 'Tiger ID is required' },
        { status: 400 }
      );
    }

    // Unstake de Bitcoin Tiger via de service
    const stakingStatus = await tigerStakingService.unstakeTiger(
      walletAddress,
      tigerId
    );

    // Return de bijgewerkte staking status
    return NextResponse.json(stakingStatus);
  } catch (error: any) {
    console.error('Error unstaking Bitcoin Tiger:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 