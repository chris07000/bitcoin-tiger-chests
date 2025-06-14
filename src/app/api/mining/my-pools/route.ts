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
        memberships: []
      });
    }

    // Haal pool memberships op
    const memberships = await prisma.poolMembership.findMany({
      where: {
        walletId: wallet.id,
        isActive: true
      },
      include: {
        pool: true
      }
    });

    // Format voor frontend
    const formattedMemberships = memberships.map(membership => ({
      poolId: membership.poolId,
      tigersStaked: membership.tigersStaked,
      totalEarned: membership.totalEarned,
      joinedAt: membership.joinedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      memberships: formattedMemberships
    });
  } catch (error) {
    console.error('Error fetching user memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memberships' },
      { status: 500 }
    );
  }
} 