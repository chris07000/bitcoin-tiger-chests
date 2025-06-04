import { NextRequest, NextResponse } from 'next/server';
import { startMission } from '@/server/services/tigerMissionsService';

export async function POST(
  request: NextRequest
) {
  try {
    // Haal missie info uit de request body
    const data = await request.json();
    const { walletAddress, missionId, tigerIds } = data;

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
    
    if (!tigerIds || !Array.isArray(tigerIds) || tigerIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one tiger ID is required' },
        { status: 400 }
      );
    }
    
    // Start de missie
    const result = startMission(walletAddress, missionId, tigerIds);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error starting mission:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 