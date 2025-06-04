import { NextRequest, NextResponse } from 'next/server';
import { stakingService } from '@/server/services/stakingService';

export async function POST(
  request: NextRequest
) {
  try {
    // Haal de request body op
    const body = await request.json();
    const { walletAddress, artifactId, artifactData } = body;

    // Valideer de request body
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!artifactId) {
      return NextResponse.json(
        { error: 'Artifact ID is required' },
        { status: 400 }
      );
    }

    // Stake het artifact via de service
    const stakingStatus = await stakingService.stakeArtifact(
      walletAddress,
      artifactId,
      artifactData || {}
    );

    // Return de bijgewerkte staking status
    return NextResponse.json(stakingStatus);
  } catch (error: any) {
    console.error('Error staking artifact:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 