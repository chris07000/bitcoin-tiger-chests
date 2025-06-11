import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, betAmount } = await request.json();

    if (!walletAddress || !betAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate bet amount
    if (betAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid bet amount' },
        { status: 400 }
      );
    }

    // Call the wallet API to deduct the bet amount
    const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/wallet/${walletAddress}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'WITHDRAW',
        amount: betAmount,
        paymentHash: `slot-bet-${Date.now()}`
      })
    });

    if (!walletResponse.ok) {
      const errorData = await walletResponse.json();
      return NextResponse.json(
        { success: false, error: errorData.error || 'Insufficient balance' },
        { status: 400 }
      );
    }

    const walletData = await walletResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Bet placed successfully',
      gameId: Date.now(),
      remainingBalance: walletData.balance
    });

  } catch (error) {
    console.error('Error processing slot spin:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 