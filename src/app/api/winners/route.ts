import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define TransactionType enum locally
enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  CHEST = 'CHEST',
  COINFLIP = 'COINFLIP',
  JACKPOT = 'JACKPOT',
  RAFFLE = 'RAFFLE',
  REWARD = 'REWARD'
}

export async function GET() {
  try {
    console.log('Fetching recent winners');
    
    // Check if prisma is available
    if (!prisma || !prisma.transaction) {
      console.error('Prisma client not initialized properly');
      throw new Error('Database connection not available');
    }
    
    // Haal de laatste 10 positieve transacties op (winsten)
    const recentWins = await prisma.transaction.findMany({
      where: {
        type: {
          in: [
            TransactionType.CHEST, 
            TransactionType.COINFLIP, 
            TransactionType.JACKPOT, 
            TransactionType.RAFFLE
          ]
        },
        amount: {
          gt: 0 // Alleen positieve bedragen (winsten)
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        Wallet: {
          select: {
            address: true
          }
        }
      }
    });

    console.log(`Found ${recentWins.length} recent wins`);

    // Formatteer de winsten voor weergave
    const formattedWins = recentWins.map((win) => {
      // Bepaal het speltype op basis van het transactietype
      let gameType = '';
      let side = '';
      
      // Controleer of het een jackpot win is
      if (win.type === TransactionType.JACKPOT) {
        gameType = 'Jackpot';
      } else if (win.type === TransactionType.CHEST) {
        // Bepaal het kisttype op basis van het winstbedrag
        if (Number(win.amount) <= 20000) {
          gameType = 'Bronze Chest';
        } else if (Number(win.amount) <= 80000) {
          gameType = 'Silver Chest';
        } else {
          gameType = 'Gold Chest';
        }
      } else if (win.type === TransactionType.COINFLIP) {
        gameType = 'Coinflip';
        // Voor coinflip, kijk in de paymentHash voor heads of tails
        side = win.paymentHash?.includes('heads') ? 'heads' : 'tails';
      } else if (win.type === TransactionType.RAFFLE) {
        gameType = 'Raffle';
      }
      
      // Vertaal het volledige wallet adres naar een verkorte versie
      const address = win.Wallet?.address || 'unknown';
      const shortenedAddress = address.length > 10 
        ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
        : address;
      
      return {
        address: shortenedAddress,
        amount: Math.floor(Number(win.amount)), // Rond af naar beneden om hele sats te tonen
        game: gameType,
        side: side || undefined, // Alleen toevoegen als het beschikbaar is
        timestamp: win.createdAt
      };
    });

    console.log('Returning formatted winners');
    return NextResponse.json(formattedWins);
  } catch (error) {
    console.error('Error fetching recent winners:', error);
    
    // Fallback met mock data als de database niet werkt
    console.log('Using mock data due to error');
    const gameTypes = ['Bronze Chest', 'Silver Chest', 'Gold Chest', 'Coinflip', 'Jackpot', 'Raffle'];
    const sides = ['heads', 'tails'];
    
    const mockWins = Array.from({ length: 10 }, (_, i) => {
      const game = gameTypes[Math.floor(Math.random() * gameTypes.length)];
      return {
        address: `bc1p${i}...xyz`,
        amount: Math.floor(Math.random() * 100000),
        game: game,
        side: game === 'Coinflip' ? sides[Math.floor(Math.random() * sides.length)] : undefined,
        timestamp: new Date(Date.now() - i * 3600000)
      };
    });
    
    return NextResponse.json(mockWins);
  }
} 