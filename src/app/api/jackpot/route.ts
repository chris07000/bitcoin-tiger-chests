import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@/generated/prisma-client';

const INITIAL_JACKPOT = 250000;

export async function GET() {
  try {
    // Check if prisma is available
    if (!prisma || !prisma.jackpot) {
      console.error('Prisma client not initialized properly');
      throw new Error('Database connection not available');
    }
    
    // Get or create the jackpot
    let jackpot = await prisma.jackpot.findUnique({
      where: { id: 1 }
    });

    if (!jackpot) {
      jackpot = await prisma.jackpot.create({
        data: {
          id: 1,
          balance: INITIAL_JACKPOT,
          totalContributions: 0,
          lastUpdate: new Date()
        }
      });
    }

    return NextResponse.json({
      balance: Number(jackpot.balance),
      lastWinner: jackpot.lastWinner || null
    });

  } catch (error) {
    console.error('Error getting jackpot:', error);
    
    // Fallback data indien er een database probleem is
    const fallbackJackpot = {
      balance: INITIAL_JACKPOT,
      lastWinner: null
    };
    
    return NextResponse.json(fallbackJackpot);
  }
} 