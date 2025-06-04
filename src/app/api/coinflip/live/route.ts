import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define TransactionType enum locally
enum TransactionType {
  CHEST = 'CHEST',
  COINFLIP = 'COINFLIP',
  JACKPOT = 'JACKPOT',
  RAFFLE = 'RAFFLE',
  REWARD = 'REWARD'
}

// Define the status enum needed by Prisma
enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Define the transaction interface to type the 'win' parameter
interface Transaction {
  id: string;
  type: string;
  amount: number;
  paymentHash?: string;
  createdAt: Date;
  wallet: {
    address: string;
  };
}

export async function GET() {
  try {
    console.log('Fetching coinflip live wins');
    
    // Check if prisma is available
    if (!prisma || !prisma.transaction) {
      console.error('Prisma client not initialized properly');
      throw new Error('Database connection not available');
    }
    
    // Probeer de database te benaderen
    const recentWins = await prisma.transaction.findMany({
      where: {
        type: TransactionType.COINFLIP,
        amount: {
          gt: 0 // Only get wins (positive amounts)
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        Wallet: {
          select: {
            address: true
          }
        }
      }
    });

    console.log(`Found ${recentWins.length} coinflip wins`);

    // Format the wins for display
    const formattedWins = recentWins.map((win) => {
      // Get the side from the paymentHash
      // The paymentHash format is: "coinflip-{side}-win-timestamp"
      let side = 'heads'; // Default to heads
      
      if (win.paymentHash) {
        if (win.paymentHash.includes('heads')) {
          side = 'heads';
        } else if (win.paymentHash.includes('tails')) {
          side = 'tails';
        }
      }
      
      return {
        address: win.Wallet?.address || 'unknown',
        amount: Number(win.amount),
        timestamp: win.createdAt,
        side: side
      };
    });

    return NextResponse.json(formattedWins);
  } catch (error) {
    console.error('Error fetching live wins:', error);
    
    // Fallback: generate mock data if database fails
    const sides = ['heads', 'tails'];
    const mockWins = Array.from({ length: 10 }, (_, i) => ({
      address: `bc1p${i}...xyz`,
      amount: Math.floor(Math.random() * 100000) + 5000,
      timestamp: new Date(Date.now() - i * 360000),
      side: sides[Math.floor(Math.random() * sides.length)]
    }));
    
    return NextResponse.json(mockWins);
  }
} 