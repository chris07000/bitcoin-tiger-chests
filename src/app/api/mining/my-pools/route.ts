import { NextRequest, NextResponse } from 'next/server';

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

    // Dummy memberships voor nu - later vervangen met echte database calls
    const dummyMemberships = [
      {
        poolId: 1,
        tigersStaked: 5,
        totalEarned: 25000,
        joinedAt: new Date().toISOString()
      },
      {
        poolId: 2, 
        tigersStaked: 8,
        totalEarned: 87500,
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      memberships: dummyMemberships
    });
  } catch (error) {
    console.error('Error fetching user memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memberships' },
      { status: 500 }
    );
  }
} 