import { NextRequest, NextResponse } from 'next/server';
import { claimMissionReward } from '@/server/services/tigerMissionsService';

export async function POST(
  request: NextRequest
) {
  try {
    // Haal missie info uit de request body
    const data = await request.json();
    const { walletAddress, missionId } = data;

    // Valideer input
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    if (!missionId) {
      return NextResponse.json(
        { error: 'Mission ID is required' },
        { status: 400 }
      );
    }
    
    // Claim de beloning
    const result = claimMissionReward(walletAddress, missionId);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error claiming mission reward:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 