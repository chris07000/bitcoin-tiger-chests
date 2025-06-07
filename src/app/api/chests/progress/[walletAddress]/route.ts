import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// In-memory fallback when database is not available
const progressCache = new Map<string, any>();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  // Await the params in Next.js 15
  const { walletAddress } = await params;
  
  console.log(`GET /api/chests/progress/${walletAddress}`);

  try {
    if (!walletAddress) {
      console.log('Wallet address is missing in params');
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Try database first, but handle 403 errors gracefully
    try {
      if (!prisma) {
        throw new Error('Prisma client not initialized');
      }

      // Haal de wallet op uit de database
      console.log(`Looking up wallet: ${walletAddress}`);
      const wallet = await (prisma as any).wallet.findUnique({
        where: { address: walletAddress },
        include: {
          ChestProgress: true
        }
      });
      
      console.log('Wallet lookup result:', wallet ? 'Found' : 'Not found');
      
      if (!wallet) {
        console.log(`Wallet not found: ${walletAddress}, using fallback`);
        // Use fallback instead of 404
        const defaultProgress = {
          bronzeOpened: 0,
          silverOpened: 0,
          goldOpened: 0,
          nextBronzeReward: 50,
          nextSilverReward: 50,
          nextGoldReward: 50
        };
        
        // Cache for future use
        progressCache.set(walletAddress, defaultProgress);
        
        return NextResponse.json({ 
          progress: defaultProgress, 
          source: 'fallback'
        });
      }

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

        // Try to create, but don't fail if it doesn't work
        try {
          console.log('Creating new ChestProgress record');
          const newProgress = await (prisma as any).chestProgress.create({
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
            id: newProgress.id,
            source: 'database'
          });
        } catch (createError) {
          console.error('Error creating new ChestProgress, using fallback:', createError);
          progressCache.set(walletAddress, defaultProgress);
          return NextResponse.json({ 
            progress: defaultProgress, 
            source: 'fallback'
          });
        }
      }

      // Return chest progress data
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
        id: wallet.ChestProgress.id,
        source: 'database'
      });

    } catch (dbError: any) {
      console.error('Database error, using fallback:', dbError);
      
      // Check if it's a 403/rate limit error
      if (dbError.message?.includes('403') || dbError.message?.includes('rate limit')) {
        console.log('Rate limit detected, using cached fallback');
      }
      
      // Use cached data if available
      const cachedProgress = progressCache.get(walletAddress);
      if (cachedProgress) {
        return NextResponse.json({ 
          progress: cachedProgress, 
          source: 'cache'
        });
      }
      
      // Default fallback
      const defaultProgress = {
        bronzeOpened: 0,
        silverOpened: 0,
        goldOpened: 0,
        nextBronzeReward: 50,
        nextSilverReward: 50,
        nextGoldReward: 50
      };
      
      progressCache.set(walletAddress, defaultProgress);
      
      return NextResponse.json({ 
        progress: defaultProgress, 
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('Error fetching chest progress:', error);
    
    // Always provide fallback data instead of failing
    const defaultProgress = {
      bronzeOpened: 0,
      silverOpened: 0,
      goldOpened: 0,
      nextBronzeReward: 50,
      nextSilverReward: 50,
      nextGoldReward: 50
    };
    
    return NextResponse.json({ 
      progress: defaultProgress, 
      source: 'emergency_fallback'
    });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  // Await the params in Next.js 15
  const { walletAddress } = await params;
  
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

    // Try database update first
    try {
      if (!prisma) {
        throw new Error('Prisma client not initialized');
      }

      // Haal de wallet op uit de database
      let wallet = await (prisma as any).wallet.findUnique({
        where: { address: walletAddress },
        include: {
          ChestProgress: true
        }
      });

      if (!wallet) {
        // Initialiseer de wallet als deze niet bestaat
        console.log(`Creating new wallet for ${walletAddress}`);
        wallet = await (prisma as any).wallet.create({
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
        
        updatedProgress = await (prisma as any).chestProgress.update({
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
        
        updatedProgress = await (prisma as any).chestProgress.create({
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

      // Cache the successful update
      progressCache.set(walletAddress, progress);

      return NextResponse.json({
        success: true,
        message: 'Chest progress updated successfully',
        progress: updatedProgress,
        source: 'database'
      });

    } catch (dbError: any) {
      console.error('Database error during update, using cache fallback:', dbError);
      
      // Cache the progress anyway for future use
      progressCache.set(walletAddress, progress);
      
      return NextResponse.json({
        success: true,
        message: 'Chest progress cached (database temporarily unavailable)',
        progress: progress,
        source: 'cache'
      });
    }

  } catch (error) {
    console.error('Error updating chest progress:', error);
    
    // Still try to cache the progress
    try {
      const data = await request.json();
      if (data.progress) {
        progressCache.set(walletAddress, data.progress);
      }
    } catch (parseError) {
      console.error('Could not parse request for caching:', parseError);
    }
    
    return NextResponse.json(
      { error: 'Failed to update chest progress', details: String(error) },
      { status: 500 }
    );
  }
} 