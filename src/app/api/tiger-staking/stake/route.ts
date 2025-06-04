import { NextRequest, NextResponse } from 'next/server';
import { tigerStakingService } from '@/server/services/tigerStakingService';
import { prisma } from '@/lib/prisma';

// Constante voor de minimale stakingstijd
const MIN_STAKE_TIME_SECONDS = 7 * 24 * 60 * 60; // 7 dagen wachttijd voor een chest

export async function POST(
  request: NextRequest
) {
  try {
    // Haal de request body op
    const body = await request.json();
    const { walletAddress, tigerId, tigerData } = body;

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

    // Voeg server-side tijdstempels toe aan de tigerData
    const currentTime = Date.now();
    const nextChestTime = currentTime + (MIN_STAKE_TIME_SECONDS * 1000);
    
    console.log(`Setting stake time to ${new Date(currentTime).toISOString()}`);
    console.log(`Setting nextChestAt to ${new Date(nextChestTime).toISOString()} (exactly ${MIN_STAKE_TIME_SECONDS}s later)`);

    // VEREENVOUDIGDE AANPAK: Gebruik tijdelijk alleen de tigerStakingService
    // Probeer tiger te staken met server-side tijdstempels
    const tigerDataToUse = {
      name: tigerData.name || `Bitcoin Tiger #${tigerId}`,
      image: tigerData.image || `/tiger-pixel1.png`,
      isRuneGuardian: tigerData.isRuneGuardian || false,
      stakedAt: currentTime,     // Server-side bepaald tijdstip
      nextChestAt: nextChestTime, // Server-side bepaald tijdstip
      level: tigerData.level || 1
    };

    try {
      // Controleer of er een wallet bestaat in de database (dit werkt nog steeds)
      let wallet = await prisma?.wallet.findUnique({
        where: { address: walletAddress }
      });
      
      if (wallet) {
        console.log(`Found wallet in database: ${wallet.id}`);
      } else {
        console.log(`Wallet not found in database, proceeding with in-memory service only`);
      }
    } catch (dbError) {
      console.warn('Database operation failed, proceeding with in-memory service:', dbError);
    }

    // Stake de Bitcoin Tiger via de service (werkt altijd)
    const stakingStatus = await tigerStakingService.stakeTiger(
      walletAddress,
      tigerId,
      tigerDataToUse
    );

    // Return de bijgewerkte staking status
    return NextResponse.json({
      ...stakingStatus,
      serverStakedAt: currentTime,
      serverNextChestAt: nextChestTime
    });
  } catch (error: any) {
    console.error('Error staking Bitcoin Tiger:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 