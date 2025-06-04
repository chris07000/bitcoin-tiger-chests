import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(
  request: Request,
  { params }: { params: { walletAddress: string } }
) {
  // Ontvang de walletAddress uit de URL parameter
  const walletAddress = params.walletAddress;
  
  console.log(`GET /api/chests/progress/${walletAddress}`);

  try {
    if (!walletAddress) {
      console.log('Wallet address is missing in params');
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!prisma) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Haal de wallet op uit de database
    console.log(`Looking up wallet: ${walletAddress}`);
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        ChestProgress: true
      }
    });
    
    console.log('Wallet lookup result:', wallet ? 'Found' : 'Not found');
    
    if (!wallet) {
      console.log(`Wallet not found: ${walletAddress}, returning 404`);
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Log de gevonden ChestProgress
    console.log('ChestProgress found:', wallet.ChestProgress);

    // Als er geen chest progress is, maak standaard data
    if (!wallet.ChestProgress) {
      console.log('No ChestProgress found, returning default values');
      const defaultProgress = {
        bronzeOpened: 0,
        silverOpened: 0,
        goldOpened: 0,
        nextBronzeReward: 50,
        nextSilverReward: 50,
        nextGoldReward: 50
      };

      // Maak direct een nieuwe chest progress aan
      try {
        console.log('Creating new ChestProgress record');
        const newProgress = await prisma.chestProgress.create({
          data: {
            id: crypto.randomUUID(),
            walletId: wallet.id,
            ...defaultProgress,
            updatedAt: new Date()
          }
        });
        console.log('Created new ChestProgress successfully:', newProgress);
        
        return NextResponse.json({ 
          progress: defaultProgress, 
          created: true,
          id: newProgress.id 
        });
      } catch (createError) {
        console.error('Error creating new ChestProgress:', createError);
        // We continueren met het returnen van de default data
        return NextResponse.json({ progress: defaultProgress, created: false });
      }
    }

    // Return chest progress data met extra fields voor debugging
    const progress = {
      bronzeOpened: wallet.ChestProgress.bronzeOpened,
      silverOpened: wallet.ChestProgress.silverOpened,
      goldOpened: wallet.ChestProgress.goldOpened,
      nextBronzeReward: wallet.ChestProgress.nextBronzeReward,
      nextSilverReward: wallet.ChestProgress.nextSilverReward,
      nextGoldReward: wallet.ChestProgress.nextGoldReward
    };
    
    console.log('Returning ChestProgress:', progress);
    
    return NextResponse.json({
      progress,
      updatedAt: wallet.ChestProgress.updatedAt,
      id: wallet.ChestProgress.id
    });
  } catch (error) {
    console.error('Error fetching chest progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chest progress', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { walletAddress: string } }
) {
  // Ontvang de walletAddress uit de URL parameter
  const walletAddress = params.walletAddress;
  
  console.log(`POST /api/chests/progress/${walletAddress}`);
  
  try {
    // Haal de progress data uit de request body
    const data = await request.json();
    const { progress } = data;
    
    console.log(`Received progress update for ${walletAddress}:`, progress);

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress data is required' },
        { status: 400 }
      );
    }

    if (!prisma) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Haal de wallet op uit de database
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        ChestProgress: true
      }
    });

    if (!wallet) {
      // Initialiseer de wallet als deze niet bestaat
      console.log(`Creating new wallet for ${walletAddress}`);
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
      console.log(`Created new wallet with id ${wallet.id}`);
    }

    console.log(`Found wallet with id ${wallet.id}`);
    console.log(`ChestProgress exists: ${wallet.ChestProgress ? 'Yes' : 'No'}`);
    
    let updatedProgress;

    // Update of maak chest progress
    if (wallet.ChestProgress) {
      // Update bestaande progress
      console.log(`Updating ChestProgress with id ${wallet.ChestProgress.id}`);
      console.log(`Current bronzeOpened: ${wallet.ChestProgress.bronzeOpened}, new value: ${progress.bronzeOpened}`);
      console.log(`Current silverOpened: ${wallet.ChestProgress.silverOpened}, new value: ${progress.silverOpened}`);
      console.log(`Current goldOpened: ${wallet.ChestProgress.goldOpened}, new value: ${progress.goldOpened}`);
      
      updatedProgress = await prisma.chestProgress.update({
        where: { id: wallet.ChestProgress.id },
        data: {
          bronzeOpened: progress.bronzeOpened,
          silverOpened: progress.silverOpened,
          goldOpened: progress.goldOpened,
          nextBronzeReward: progress.nextBronzeReward,
          nextSilverReward: progress.nextSilverReward,
          nextGoldReward: progress.nextGoldReward,
          updatedAt: new Date()
        }
      });
      
      console.log(`Updated ChestProgress successfully:`, updatedProgress);
    } else {
      // Maak nieuwe progress
      console.log(`Creating new ChestProgress for wallet ${wallet.id}`);
      
      updatedProgress = await prisma.chestProgress.create({
        data: {
          id: crypto.randomUUID(),
          walletId: wallet.id,
          bronzeOpened: progress.bronzeOpened,
          silverOpened: progress.silverOpened,
          goldOpened: progress.goldOpened,
          nextBronzeReward: progress.nextBronzeReward || 50,
          nextSilverReward: progress.nextSilverReward || 50,
          nextGoldReward: progress.nextGoldReward || 50,
          updatedAt: new Date()
        }
      });
      
      console.log(`Created new ChestProgress with id ${updatedProgress.id}`);
    }

    // Controleer de database na de update
    const verifyWallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: { ChestProgress: true }
    });
    
    console.log(`Verification - ChestProgress exists: ${verifyWallet?.ChestProgress ? 'Yes' : 'No'}`);
    
    if (verifyWallet?.ChestProgress) {
      console.log(`Verification - bronzeOpened: ${verifyWallet.ChestProgress.bronzeOpened}`);
      console.log(`Verification - silverOpened: ${verifyWallet.ChestProgress.silverOpened}`);
      console.log(`Verification - goldOpened: ${verifyWallet.ChestProgress.goldOpened}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Chest progress updated successfully',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error updating chest progress:', error);
    return NextResponse.json(
      { error: 'Failed to update chest progress', details: String(error) },
      { status: 500 }
    );
  }
} 