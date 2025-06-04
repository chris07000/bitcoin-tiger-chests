import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const INITIAL_JACKPOT = 250000;

export async function POST() {
  try {
    const jackpot = await prisma?.jackpot.findFirst();
    if (!jackpot) {
      return NextResponse.json(
        { error: 'Jackpot not found' },
        { status: 404 }
      );
    }

    // Reset jackpot to 250k + current contribution
    const currentContribution = jackpot.balance - (jackpot.lastWinAmount || 0);
    
    // Update using Prisma
    const updatedJackpot = await prisma?.jackpot.update({
      where: { id: jackpot.id },
      data: {
        balance: INITIAL_JACKPOT + currentContribution,
        lastUpdate: new Date()
      }
    });

    return NextResponse.json({
      message: 'Jackpot reset successfully',
      newBalance: updatedJackpot?.balance
    });

  } catch (error) {
    console.error('Error resetting jackpot:', error);
    return NextResponse.json(
      { error: 'Failed to reset jackpot' },
      { status: 500 }
    );
  }
} 