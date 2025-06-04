import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Reset endpoint om chest progress te resetten
export async function GET(request: Request) {
  try {
    // Get params from URL
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required as a query parameter' },
        { status: 400 }
      );
    }
    
    console.log(`Resetting chest progress for wallet ${walletAddress}`);
    
    // First check if the wallet exists
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: { ChestProgress: true }
    });
    
    // If wallet doesn't exist, return error
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }
    
    console.log(`Wallet found: ${wallet.id}`);
    
    let chestProgress;
    
    // If ChestProgress exists, reset it
    if (wallet.ChestProgress) {
      console.log(`Resetting existing ChestProgress: ${wallet.ChestProgress.id}`);
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
    } else {
      // If ChestProgress doesn't exist, create it
      console.log(`Creating new ChestProgress for wallet: ${wallet.id}`);
      chestProgress = await prisma.chestProgress.create({
        data: {
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
    }
    
    console.log(`ChestProgress operation successful: ${chestProgress.id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Chest progress reset successfully',
      chestProgress: {
        id: chestProgress.id,
        bronzeOpened: chestProgress.bronzeOpened,
        silverOpened: chestProgress.silverOpened,
        goldOpened: chestProgress.goldOpened,
        nextBronzeReward: chestProgress.nextBronzeReward,
        nextSilverReward: chestProgress.nextSilverReward,
        nextGoldReward: chestProgress.nextGoldReward
      }
    });
  } catch (error) {
    console.error('Error in reset-progress endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to reset chest progress', details: String(error) },
      { status: 500 }
    );
  }
} 