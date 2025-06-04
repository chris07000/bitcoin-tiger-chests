import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionStatus, TransactionType } from '@/generated/prisma-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { walletAddress, chestType, reward, claimId = `claim-${Date.now()}` } = await request.json();

    if (!walletAddress || !chestType || !reward) {
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

    // Haal de wallet op
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }
    
    console.log('Claim request:', { walletAddress, chestType, reward, claimId });
    console.log('Wallet before claim:', wallet);

    // Check for existing transaction with this claim ID to prevent double-claiming
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        paymentHash: claimId,
        walletId: wallet.id
      }
    });

    if (existingTransaction) {
      console.log('Claim already processed:', existingTransaction);
      return NextResponse.json({
        success: true,
        balance: wallet.balance,
        alreadyClaimed: true
      });
    }

    // Update wallet en maak transactie in één database transactie
    const result = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          id: uuidv4(), // Unieke ID genereren
          type: TransactionType.CHEST,
          amount: reward,
          paymentHash: claimId,
          walletId: wallet.id,
          status: TransactionStatus.COMPLETED
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: wallet.balance + reward,
          updatedAt: new Date()
        },
      }),
    ]);
    
    console.log('Wallet after claim transaction:', result[1]);

    return NextResponse.json({
      success: true,
      balance: result[1].balance
    });

  } catch (error) {
    console.error('Error claiming chest reward:', error);
    return NextResponse.json(
      { error: 'Failed to claim reward: ' + String(error) },
      { status: 500 }
    );
  }
} 