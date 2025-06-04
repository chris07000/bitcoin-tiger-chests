import { NextRequest, NextResponse } from 'next/server';
import { getMissionStatus, getMissions } from '@/server/services/tigerMissionsService';

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
    
    // Haal mission status op
    const status = getMissionStatus(walletAddress);
    const missions = getMissions();
    
    return NextResponse.json({
      ...status,
      availableMissions: missions
    });
  } catch (error: any) {
    console.error('Error fetching mission status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 