import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, winAmount } = await request.json();

    if (!walletAddress || winAmount == null) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate win amount
    if (winAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid win amount' },
        { status: 400 }
      );
    }

    // If no win, just return success
    if (winAmount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No payout this time',
        winAmount: 0
      });
    }

    // Call the wallet API to add the win amount
    const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/wallet/${walletAddress}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'DEPOSIT',
        amount: winAmount,
        paymentHash: `slot-win-${Date.now()}`
      })
    });

    if (!walletResponse.ok) {
      const errorData = await walletResponse.json();
      return NextResponse.json(
        { success: false, error: errorData.error || 'Failed to process payout' },
        { status: 400 }
      );
    }

    const walletData = await walletResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Payout processed successfully',
      winAmount,
      newBalance: walletData.balance
    });

  } catch (error) {
    console.error('Error processing slot payout:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 