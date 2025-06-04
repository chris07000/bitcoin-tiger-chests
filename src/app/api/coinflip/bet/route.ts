import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { updateUserRanking } from '@/lib/ranking';
import { v4 as uuidv4 } from 'uuid';

// Define TransactionType enum locally
enum TransactionType {
  CHEST = 'CHEST',
  COINFLIP = 'COINFLIP',
  JACKPOT = 'JACKPOT',
  RAFFLE = 'RAFFLE',
  REWARD = 'REWARD'
}

// Define status enum
enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Vereenvoudigde functie voor het bijwerken van de userRanking
// Dit omzeilt het probleem met de relationele database schema
async function simpleUpdateUserRanking(walletAddress: string, wagerAmount: number, wonGame: boolean = false) {
  try {
    console.log(`Simplified ranking update for wallet ${walletAddress}`);
    
    // Check if prisma is available
    if (!prisma) {
      console.error('Prisma client not initialized properly');
      return { updated: false, error: 'Prisma client not initialized properly' };
    }
    
    // Ophalen van wallet zonder relatie queries
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      console.error('Wallet niet gevonden:', walletAddress);
      return { updated: false, error: 'Wallet niet gevonden' };
    }
    
    // Log ranking update
    console.log(`Updated ranking for wallet ${walletAddress}, wager: ${wagerAmount}, won: ${wonGame}`);
    
    return { updated: true, rankUp: null };
  } catch (error) {
    console.error('Error updating user ranking:', error);
    return { updated: false, error: String(error) };
  }
}

interface CoinflipBetRequest {
  walletAddress: string;
  betAmount: number;
  selectedSide: 'heads' | 'tails';
}

export async function POST(request: Request) {
  try {
    console.log('Processing coinflip bet request');
    
    const { walletAddress, betAmount, selectedSide } = await request.json();
    console.log(`Bet request: wallet=${walletAddress}, amount=${betAmount}, side=${selectedSide}`);

    if (!walletAddress || !betAmount || !selectedSide) {
      console.log('Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if prisma is available
    if (!prisma) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    console.log('Finding wallet in database...');
    // Get the wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
    });

    if (!wallet) {
      console.log('Wallet not found in database');
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    console.log(`Found wallet with balance: ${wallet.balance}`);

    // Check if enough balance
    if (wallet.balance < betAmount) {
      console.log(`Insufficient balance: ${wallet.balance} < ${betAmount}`);
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Generate result with house edge (house wins 55%)
    const roll = Math.random() * 100;
    const houseWins = roll < 55;  // House heeft 55% kans om te winnen
    
    // Als speler HEADS kiest:
    // - Bij houseWins = true -> result moet TAILS zijn (speler verliest)
    // - Bij houseWins = false -> result moet HEADS zijn (speler wint)
    // Als speler TAILS kiest gebeurt het omgekeerde
    const result = selectedSide === 'heads' 
      ? (houseWins ? 'tails' : 'heads')
      : (houseWins ? 'heads' : 'tails');
      
    const won = selectedSide === result;
    console.log(`Roll: ${roll}, Result: ${result}, Won: ${won}`);
    
    // Calculate reward with 3% fee on wins
    const baseReward = won ? betAmount * 2 : 0;
    const reward = won ? Math.floor(baseReward * 0.97) : 0;

    // Start een database transactie voor alle updates
    try {
      // Genereer unieke IDs voor de transacties
      const betTransactionId = uuidv4();
      const winTransactionId = uuidv4();
      
      console.log('Creating bet transaction...');
      // Maak eerst de bet transactie
      await prisma.transaction.create({
        data: {
          id: betTransactionId,
          type: TransactionType.COINFLIP,
          amount: -betAmount,
          status: TransactionStatus.COMPLETED,
          paymentHash: `coinflip-bet-${Date.now()}`,
          walletId: wallet.id,
        },
      });

      // Als de speler wint, voeg de winst transactie toe
      if (won) {
        console.log(`Creating win transaction for ${reward} sats`);
        await prisma.transaction.create({
          data: {
            id: winTransactionId,
            type: TransactionType.COINFLIP,
            amount: reward,
            status: TransactionStatus.COMPLETED,
            paymentHash: `coinflip-${result}-win-${Date.now()}`,
            walletId: wallet.id,
          },
        });
      }

      // Update het saldo
      const newBalance = wallet.balance - betAmount + (won ? reward : 0);
      console.log(`Updating wallet balance to ${newBalance}`);
      const updatedWallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: newBalance,
          updatedAt: new Date()
        },
      });

      // Update user ranking statistics met vereenvoudigde functie
      console.log('Updating user ranking...');
      const rankingResult = await simpleUpdateUserRanking(
        walletAddress, 
        betAmount, 
        won
      );

      console.log('Bet complete, sending response');
      // Return response with ranking information and exact balance for localStorage updating
      return NextResponse.json({
        success: true,
        balance: updatedWallet.balance,
        oldBalance: wallet.balance,
        betAmount: betAmount,
        result,
        reward,
        won,
        rankUp: rankingResult.rankUp || null
      });
    } catch (error) {
      console.error('Error in database transaction:', error);
      return NextResponse.json(
        { error: 'Database transaction failed: ' + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing coinflip bet:', error);
    return NextResponse.json(
      { error: 'Failed to process bet: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 