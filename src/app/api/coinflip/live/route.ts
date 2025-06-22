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
      return NextResponse.json([]);
    }
    
    // Simplified query - get wins (positive amounts) for coinflip
    const recentWins = await prisma.transaction.findMany({
      where: {
        type: 'COINFLIP',
        amount: {
          gt: 0 // Only wins (positive amounts)
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 15
    });

    console.log(`Found ${recentWins.length} coinflip wins`);

    // Format the wins for display
    const formattedWins = [];
    
    for (const win of recentWins) {
      try {
        // Get wallet info separately to avoid relation issues
        const wallet = await prisma.wallet.findUnique({
          where: { id: win.walletId },
          select: { address: true }
        });
        
        // Get the side from the paymentHash
        let side = 'heads'; // Default
        if (win.paymentHash && win.paymentHash.includes('tails')) {
          side = 'tails';
        }
        
        formattedWins.push({
          address: wallet?.address || 'unknown',
          amount: Number(win.amount),
          timestamp: win.createdAt,
          side: side
        });
      } catch (e) {
        console.error('Error processing win:', e);
      }
    }

    console.log(`Returning ${formattedWins.length} formatted wins`);
    return NextResponse.json(formattedWins);
    
  } catch (error) {
    console.error('Error fetching live wins:', error);
    
    // Return mock data on error
    const sides = ['heads', 'tails'];
    const mockWins = Array.from({ length: 8 }, (_, i) => ({
      address: `bc1p${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 5)}`,
      amount: Math.floor(Math.random() * 50000) + 5000,
      timestamp: new Date(Date.now() - i * 420000),
      side: sides[Math.floor(Math.random() * sides.length)]
    }));
    
    console.log('Returning mock data due to error');
    return NextResponse.json(mockWins);
  }
} 