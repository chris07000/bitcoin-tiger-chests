import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, payout, winType } = await request.json();

    if (!walletAddress || !payout) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call the wallet API to add the win amount
    const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/wallet/${walletAddress}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'SLOT_WIN',
        amount: -payout, // Negative amount to add to balance (wallet API uses negative for credits)
        paymentHash: `slot-win-${Date.now()}`
      })
    });

    if (!walletResponse.ok) {
      const errorData = await walletResponse.json();
      return NextResponse.json(
        { success: false, error: errorData.error || 'Failed to process win' },
        { status: 400 }
      );
    }

    const walletData = await walletResponse.json();

    return NextResponse.json({
      success: true,
      message: `Win payout: ${payout} sats (${winType})`,
      payout,
      winType,
      newBalance: walletData.balance
    });

  } catch (error) {
    console.error('Error processing payout:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 