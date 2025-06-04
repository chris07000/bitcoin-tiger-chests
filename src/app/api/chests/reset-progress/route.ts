import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Admin endpoint to reset chest progress
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    console.log(`Resetting chest progress for ${walletAddress}`);

    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        ChestProgress: true
      }
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    let chestProgress;

    if (wallet.ChestProgress) {
      // Update existing progress to reset values
      chestProgress = await prisma.chestProgress.update({
        where: { id: wallet.ChestProgress.id },
        data: {
          bronzeOpened: 0,
          silverOpened: 0,
          goldOpened: 0,
          nextBronzeReward: 50,
          nextSilverReward: 50,
          nextGoldReward: 50,
          updatedAt: new Date()
        }
      });
      console.log('Reset existing ChestProgress');
    } else {
      // Create new progress with reset values
      chestProgress = await prisma.chestProgress.create({
        data: {
          id: crypto.randomUUID(),
          walletId: wallet.id,
          bronzeOpened: 0,
          silverOpened: 0,
          goldOpened: 0,
          nextBronzeReward: 50,
          nextSilverReward: 50,
          nextGoldReward: 50,
          updatedAt: new Date()
        }
      });
      console.log('Created new ChestProgress with reset values');
    }

    return NextResponse.json({
      success: true,
      message: 'Chest progress reset successfully',
      wallet: {
        address: wallet.address,
        balance: wallet.balance
      },
      chestProgress
    });
  } catch (error) {
    console.error('Error resetting chest progress:', error);
    return NextResponse.json(
      { error: 'Failed to reset chest progress', details: String(error) },
      { status: 500 }
    );
  }
} 