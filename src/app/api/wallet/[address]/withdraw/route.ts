import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    console.log('Processing withdrawal for address:', address);
    
    const { amount, paymentHash } = await request.json();
    console.log('Withdrawal details:', { amount, paymentHash });

    // Check if prisma is available
    if (!prisma) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Get wallet and check balance
    const wallet = await prisma.wallet.findUnique({
      where: { address },
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

    // Create transaction and update wallet in a transaction
    const result = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          id: uuidv4(),
          type: 'WITHDRAW',
          amount,
          paymentHash,
          walletId: wallet.id,
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: wallet.balance - amount,
          updatedAt: new Date()
        },
      }),
    ]);

    // Get updated wallet with latest transactions
    const updatedWallet = await prisma.wallet.findUnique({
      where: { id: wallet.id }
    });
    
    // Haal transacties apart op
    const transactions = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('Withdrawal processed, new balance:', updatedWallet?.balance);

    return NextResponse.json({
      address: updatedWallet?.address,
      balance: updatedWallet?.balance,
      transactions: transactions
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal: ' + String(error) },
      { status: 500 }
    );
  }
} 