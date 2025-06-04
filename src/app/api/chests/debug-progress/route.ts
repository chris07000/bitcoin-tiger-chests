import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Debug endpoint voor chest progress
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    const action = url.searchParams.get('action') || 'get';
    const type = url.searchParams.get('type') || 'bronze';
    const setValue = url.searchParams.get('value');

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

    console.log(`Debug action: ${action} for ${walletAddress}, type: ${type}`);

    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        ChestProgress: true
      }
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    if (action === 'get') {
      return NextResponse.json({
        wallet: {
          address: wallet.address,
          balance: wallet.balance
        },
        chestProgress: wallet.ChestProgress
      });
    }

    if (action === 'create') {
      if (!wallet.ChestProgress) {
        const newProgress = await prisma.chestProgress.create({
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

        return NextResponse.json({
          action: 'created',
          chestProgress: newProgress
        });
      } else {
        return NextResponse.json({
          action: 'already_exists',
          chestProgress: wallet.ChestProgress
        });
      }
    }

    if (action === 'increment' && wallet.ChestProgress) {
      const currentValue = wallet.ChestProgress[`${type}Opened` as keyof typeof wallet.ChestProgress] as number;
      const newValue = currentValue + 1;

      const updatedProgress = await prisma.chestProgress.update({
        where: { id: wallet.ChestProgress.id },
        data: {
          [`${type}Opened`]: newValue,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        action: 'incremented',
        type,
        oldValue: currentValue,
        newValue,
        chestProgress: updatedProgress
      });
    }

    if (action === 'set' && setValue && wallet.ChestProgress) {
      const value = parseInt(setValue);
      const oldValue = wallet.ChestProgress[`${type}Opened` as keyof typeof wallet.ChestProgress] as number;

      const updatedProgress = await prisma.chestProgress.update({
        where: { id: wallet.ChestProgress.id },
        data: {
          [`${type}Opened`]: value,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        action: 'set',
        type,
        oldValue,
        newValue: value,
        chestProgress: updatedProgress
      });
    }

    return NextResponse.json({ error: 'Invalid action or missing chest progress' }, { status: 400 });
  } catch (error) {
    console.error('Error in debug progress:', error);
    return NextResponse.json(
      { error: 'Failed to debug chest progress', details: String(error) },
      { status: 500 }
    );
  }
} 