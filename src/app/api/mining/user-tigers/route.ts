import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Zoek wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });

    if (!wallet) {
      return NextResponse.json({
        success: true,
        tigers: []
      });
    }

    // Haal alle gestakte tigers op die nog niet in mining pools zitten
    const stakedTigers = await prisma.tigerStaking.findMany({
      where: {
        walletId: wallet.id,
        isActive: true
      },
      select: {
        id: true,
        tigerId: true,
        tigerName: true,
        tigerImage: true,
        tigerLevel: true,
        stakedAt: true,
        isGuardian: true
      }
    });

    return NextResponse.json({
      success: true,
      tigers: stakedTigers
    });
  } catch (error) {
    console.error('Error fetching user tigers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user tigers' },
      { status: 500 }
    );
  }
} 