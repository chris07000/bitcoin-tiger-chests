import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Admin endpoint to force insert chest progress data
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    const bronzeOpened = parseInt(url.searchParams.get('bronze') || '0');
    const silverOpened = parseInt(url.searchParams.get('silver') || '0');
    const goldOpened = parseInt(url.searchParams.get('gold') || '0');

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

    console.log(`Force insert for ${walletAddress}: Bronze ${bronzeOpened}, Silver ${silverOpened}, Gold ${goldOpened}`);

    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        ChestProgress: true
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          id: crypto.randomUUID(),
          address: walletAddress,
          balance: 0,
          updatedAt: new Date()
        },
        include: {
          ChestProgress: true
        }
      });
      console.log(`Created new wallet: ${wallet.id}`);
    }

    // Delete existing chest progress if it exists
    if (wallet.ChestProgress) {
      await prisma.chestProgress.delete({
        where: { id: wallet.ChestProgress.id }
      });
      console.log('Deleted existing ChestProgress');
    }

    // Create new chest progress with specified values
    const chestProgress = await prisma.chestProgress.create({
      data: {
        id: crypto.randomUUID(),
        walletId: wallet.id,
        bronzeOpened,
        silverOpened,
        goldOpened,
        nextBronzeReward: 50,
        nextSilverReward: 50,
        nextGoldReward: 50,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      wallet: {
        address: wallet.address,
        balance: wallet.balance
      },
      chestProgress
    });
  } catch (error) {
    console.error('Error in force insert:', error);
    return NextResponse.json(
      { error: 'Failed to force insert chest progress', details: String(error) },
      { status: 500 }
    );
  }
} 