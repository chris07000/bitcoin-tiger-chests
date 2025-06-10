import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // For now, just return success without database operations
    // We'll add database functionality once TypeScript recognizes the models
    return NextResponse.json({
      success: true,
      message: 'Bet placed successfully (demo mode)',
      gameId: Math.floor(Math.random() * 10000),
      remainingBalance: 50000 // Demo balance
    });

  } catch (error) {
    console.error('Error processing slot spin:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 