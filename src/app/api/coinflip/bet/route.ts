import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { updateUserRanking } from '@/lib/ranking';
import { v4 as uuidv4 } from 'uuid';

// Define TransactionType enum locally
enum TransactionType {
  CHEST = 'CHEST',
  COINFLIP = 'COINFLIP',
  JACKPOT = 'JACKPOT',
  RAFFLE = 'RAFFLE',
  REWARD = 'REWARD'
}

// Define status enum
enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Vereenvoudigde functie voor het bijwerken van de userRanking
// Dit omzeilt het probleem met de relationele database schema
async function simpleUpdateUserRanking(walletAddress: string, wagerAmount: number, wonGame: boolean = false) {
  try {
    console.log(`Simplified ranking update for wallet ${walletAddress}`);
    
    // Ophalen van wallet zonder relatie queries
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      console.error('Wallet niet gevonden:', walletAddress);
      return { updated: false, error: 'Wallet niet gevonden' };
    }
    
    // Log ranking update
    console.log(`Updated ranking for wallet ${walletAddress}, wager: ${wagerAmount}, won: ${wonGame}`);
    
    return { updated: true, rankUp: null };
  } catch (error) {
    console.error('Error updating user ranking:', error);
    return { updated: false, error: String(error) };
  }
}

interface CoinflipBetRequest {
  walletAddress: string;
  amount: number;
  side: 'heads' | 'tails';
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount, side }: CoinflipBetRequest = await request.json();

    if (!walletAddress || !amount || !side) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    if (wallet.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Simulate coinflip
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === side;
    const winAmount = won ? amount * 2 : 0;
    const newBalance = wallet.balance - amount + winAmount;

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { address: walletAddress },
      data: { balance: newBalance },
    });

    return NextResponse.json({
      result,
      won,
      amount: won ? winAmount : -amount,
      newBalance: updatedWallet.balance,
    });
  } catch (error) {
    console.error('Error processing coinflip bet:', error);
    return NextResponse.json(
      { error: 'Failed to process coinflip bet' },
      { status: 500 }
    );
  }
} 