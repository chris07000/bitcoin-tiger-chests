import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get total contributions
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const jackpot = await prisma.jackpot.findUnique({
      where: { id: 1 }
    });

    if (!jackpot) {
      return NextResponse.json(
        { error: 'Jackpot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      totalContributions: jackpot.totalContributions
    });

  } catch (error) {
    console.error('Error getting jackpot contributions:', error);
    return NextResponse.json(
      { error: 'Failed to get jackpot contributions' },
      { status: 500 }
    );
  }
}

// Update total contributions (admin only)
export async function POST(request: Request) {
  try {
    const { amount, walletAddress } = await request.json();
    
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid contribution amount' },
        { status: 400 }
      );
    }

    const jackpot = await prisma.jackpot.update({
      where: { id: 1 },
      data: {
        balance: {
          increment: amount
        },
        totalContributions: {
          increment: amount
        },
        lastUpdate: new Date()
      }
    });

    return NextResponse.json({
      balance: jackpot.balance,
      totalContributions: jackpot.totalContributions
    });

  } catch (error) {
    console.error('Error updating jackpot contributions:', error);
    return NextResponse.json(
      { error: 'Failed to update jackpot contributions' },
      { status: 500 }
    );
  }
} 