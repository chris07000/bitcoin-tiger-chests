import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, poolId, tigersToStake } = await request.json();
    
    if (!walletAddress || !poolId || !tigersToStake) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hier zou normaal de lightning payment en database update plaatsvinden
    console.log('Pool join request:', {
      walletAddress,
      poolId,
      tigersToStake
    });

    // Simuleer een succesvolle pool join
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: `Successfully joined pool ${poolId} with ${tigersToStake} tigers!`,
      poolId,
      tigersStaked: tigersToStake
    });
  } catch (error) {
    console.error('Error joining pool:', error);
    return NextResponse.json(
      { error: 'Failed to join pool' },
      { status: 500 }
    );
  }
} 