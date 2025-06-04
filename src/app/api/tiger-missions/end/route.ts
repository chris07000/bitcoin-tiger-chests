import { NextRequest, NextResponse } from 'next/server';
import { endMission } from '@/server/services/tigerMissionsService';

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
    
    // Beëindig de missie
    const result = endMission(walletAddress, missionId);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error ending mission:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 