import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma-client';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Haal de laatste 5 raffle winnaars op
    const recentWinners = await prisma.raffle.findMany({
      where: {
        winner: {
          not: null
        },
        winnerPickedAt: {
          not: null
        }
      },
      orderBy: {
        winnerPickedAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        winner: true,
        winnerPickedAt: true,
        ticketPrice: true,
        totalTickets: true
      }
    });

    // Format de data voor frontend gebruik
    const formattedWinners = recentWinners.map((winner: any) => ({
      id: winner.id,
      raffleName: winner.name,
      description: winner.description,
      image: winner.image,
      winnerAddress: winner.winner,
      winnerPickedAt: winner.winnerPickedAt,
      ticketPrice: winner.ticketPrice,
      totalTickets: winner.totalTickets,
      // Kort wallet address format voor display
      displayAddress: winner.winner ? 
        `${winner.winner.slice(0, 6)}...${winner.winner.slice(-4)}` : 
        'Unknown'
    }));

    return NextResponse.json({
      success: true,
      winners: formattedWinners
    });
  } catch (error) {
    console.error('Error fetching raffle winners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch raffle winners' },
      { status: 500 }
    );
  }
} 