import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

export async function POST(request: Request) {
  try {
    const { walletAddress, reward } = await request.json();

    if (!walletAddress || !reward) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if prisma is available
    if (!prisma) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Get the wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Start een database transactie voor alle updates
    const updatedWallet = await prisma.$transaction(async (tx) => {
      // Voeg de winst transactie toe
      await tx.transaction.create({
        data: {
          id: uuidv4(), // Unieke ID genereren
          type: TransactionType.COINFLIP,
          amount: reward,
          status: TransactionStatus.COMPLETED,
          paymentHash: `coinflip-win-${Date.now()}`,
          walletId: wallet.id,
        },
      });

      // Update het saldo
      return await tx.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: {
            increment: reward
          },
          updatedAt: new Date()
        },
      });
    });

    return NextResponse.json({
      success: true,
      balance: updatedWallet?.balance || wallet.balance
    });

  } catch (error) {
    console.error('Error claiming coinflip reward:', error);
    return NextResponse.json(
      { error: 'Failed to claim reward: ' + String(error) },
      { status: 500 }
    );
  }
} 