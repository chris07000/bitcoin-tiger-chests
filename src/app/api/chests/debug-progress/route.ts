import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Test endpoint om chest progress direct aan te maken of bij te werken
export async function GET(request: Request) {
  try {
    // Haal parameters uit de query string
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    const action = url.searchParams.get('action') || 'get';
    const type = url.searchParams.get('type') || 'bronze';
    const setValue = url.searchParams.get('value');
    
    console.log(`Debug Progress API: ${action} for wallet ${walletAddress}, type ${type}, value ${setValue}`);
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Zoek de wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: { ChestProgress: true }
    });
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }
    
    console.log('Wallet found:', wallet.id);
    console.log('ChestProgress found:', wallet.ChestProgress ? 'Yes' : 'No');
    
    // Als er geen ChestProgress is, maak er een aan
    if (!wallet.ChestProgress && (action === 'set' || action === 'increment')) {
      console.log('Creating new ChestProgress for debug');
      
      const defaultProgress = {
        bronzeOpened: 0,
        silverOpened: 0,
        goldOpened: 0,
        nextBronzeReward: 50,
        nextSilverReward: 50,
        nextGoldReward: 50
      };
      
      // Voeg een UUID toe
      const newProgress = await prisma.chestProgress.create({
        data: {
          id: crypto.randomUUID(),
          walletId: wallet.id,
          ...defaultProgress,
          updatedAt: new Date()
        }
      });
      
      console.log('Created new ChestProgress:', newProgress);
      
      return NextResponse.json({
        action: 'created',
        progress: newProgress,
        message: 'Created new ChestProgress'
      });
    }
    
    // Als de actie 'get' is, return de huidige progress
    if (action === 'get') {
      return NextResponse.json({
        action: 'get',
        progress: wallet.ChestProgress
      });
    }
    
    // Als de actie 'set' is, update de waarde
    if (action === 'set' && setValue) {
      const field = `${type}Opened`;
      const value = parseInt(setValue, 10);
      
      if (isNaN(value)) {
        return NextResponse.json(
          { error: 'Invalid value, must be a number' },
          { status: 400 }
        );
      }
      
      const updatedProgress = await prisma.chestProgress.update({
        where: { id: wallet.ChestProgress!.id },
        data: {
          [field]: value,
          updatedAt: new Date()
        }
      });
      
      console.log(`Updated ${field} to ${value}:`, updatedProgress);
      
      return NextResponse.json({
        action: 'set',
        field,
        value,
        progress: updatedProgress
      });
    }
    
    // Als de actie 'increment' is, verhoog de waarde
    if (action === 'increment') {
      const field = `${type}Opened`;
      const currentValue = wallet.ChestProgress![field as keyof typeof wallet.ChestProgress];
      
      if (typeof currentValue !== 'number') {
        return NextResponse.json(
          { error: `Field ${field} is not a number` },
          { status: 400 }
        );
      }
      
      const updatedProgress = await prisma.chestProgress.update({
        where: { id: wallet.ChestProgress!.id },
        data: {
          [field]: currentValue + 1,
          updatedAt: new Date()
        }
      });
      
      console.log(`Incremented ${field} from ${currentValue} to ${currentValue + 1}:`, updatedProgress);
      
      return NextResponse.json({
        action: 'increment',
        field,
        oldValue: currentValue,
        newValue: currentValue + 1,
        progress: updatedProgress
      });
    }
    
    // Onbekende actie
    return NextResponse.json(
      { error: 'Unknown action, use get, set, or increment' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error in debug-progress API:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
} 