import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Endpoint om een ChestProgress record geforceerd aan te maken
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    const bronzeOpened = parseInt(url.searchParams.get('bronze') || '0');
    const silverOpened = parseInt(url.searchParams.get('silver') || '0');
    const goldOpened = parseInt(url.searchParams.get('gold') || '0');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required as a query parameter' },
        { status: 400 }
      );
    }
    
    console.log(`Force inserting ChestProgress for wallet ${walletAddress}`);
    console.log(`Values: Bronze=${bronzeOpened}, Silver=${silverOpened}, Gold=${goldOpened}`);
    
    // First check if the wallet exists
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: { ChestProgress: true }
    });
    
    // If wallet doesn't exist, create it with an explicit ID
    if (!wallet) {
      const newWalletId = `wallet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      console.log(`Creating wallet with ID: ${newWalletId}`);
      
      wallet = await prisma.wallet.create({
        data: {
          id: newWalletId,
          address: walletAddress,
          balance: 0,
          updatedAt: new Date()
        },
        include: { ChestProgress: true }
      });
    }
    
    console.log(`Wallet: ${wallet.id}`);
    
    // Als er al een ChestProgress is, dan eerst verwijderen
    if (wallet.ChestProgress) {
      console.log(`Existing ChestProgress found: ${wallet.ChestProgress.id}, deleting it first`);
      
      await prisma.chestProgress.delete({
        where: { id: wallet.ChestProgress.id }
      });
    }
    
    // Nu een nieuwe ChestProgress aanmaken met een expliciete ID
    const newChestProgressId = uuidv4();
    console.log(`Creating ChestProgress with ID: ${newChestProgressId}`);
    
    const chestProgress = await prisma.chestProgress.create({
      data: {
        id: newChestProgressId,
        walletId: wallet.id,
        bronzeOpened: bronzeOpened,
        silverOpened: silverOpened,
        goldOpened: goldOpened,
        nextBronzeReward: 50,
        nextSilverReward: 50,
        nextGoldReward: 50,
        updatedAt: new Date()
      }
    });
    
    console.log(`Successfully created ChestProgress: ${chestProgress.id}`);
    
    return NextResponse.json({
      success: true,
      message: 'ChestProgress forced successfully',
      wallet: {
        id: wallet.id,
        address: wallet.address
      },
      chestProgress: {
        id: chestProgress.id,
        bronzeOpened: chestProgress.bronzeOpened,
        silverOpened: chestProgress.silverOpened,
        goldOpened: chestProgress.goldOpened
      }
    });
  } catch (error) {
    console.error('Error forcing ChestProgress:', error);
    return NextResponse.json(
      { error: 'Failed to force ChestProgress', details: String(error) },
      { status: 500 }
    );
  }
} 