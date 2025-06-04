import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define TransactionType enum locally
enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  CHEST = 'CHEST',
  JACKPOT = 'JACKPOT',
  COINFLIP = 'COINFLIP',
  RAFFLE = 'RAFFLE',
  REWARD = 'REWARD'
}

// GET endpoint - Haalt wallet informatie op
export async function GET(
  request: Request,
  context: { params: { address: string } }
) {
  try {
    // Await params - dit werkt in zowel nieuwe als oudere NextJS versies
    const params = await context.params;
    const walletAddress = params.address;
    console.log(`GET /api/wallet/${walletAddress}`);

    // Veiligheidscheck
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json({ error: "Ongeldig wallet adres" }, { status: 400 });
    }

    // Controleer of prisma beschikbaar is
    if (!prisma) {
      console.error('Prisma client niet geïnitialiseerd');
      return NextResponse.json(
        { error: "Database verbinding niet beschikbaar" },
        { status: 500 }
      );
    }

    // Zoek de wallet in de database
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });

    // Als de wallet niet bestaat, return een 404
    if (!wallet) {
      return NextResponse.json({ error: "Wallet niet gevonden" }, { status: 404 });
    }

    // Haal transacties apart op
    const transactions = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Format de wallet data voor de response
    const formattedTransactions = transactions.map((t: any) => ({
      type: t.type,
      amount: t.amount,
      status: t.status,
      paymentHash: t.paymentHash,
      createdAt: t.createdAt
    }));

    // Return de wallet data met de huidige balans
    return NextResponse.json({
      address: wallet.address,
      balance: wallet.balance,
      transactions: formattedTransactions,
      success: true
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van de wallet" },
      { status: 500 }
    );
  }
}

// PUT endpoint - Initialiseert een wallet als deze nog niet bestaat
export async function PUT(
  request: Request,
  context: { params: { address: string } }
) {
  try {
    // Await params - dit werkt in zowel nieuwe als oudere NextJS versies
    const params = await context.params;
    const walletAddress = params.address;
    console.log(`PUT /api/wallet/${walletAddress}`);

    // Veiligheidscheck
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json({ error: "Ongeldig wallet adres" }, { status: 400 });
    }

    // Controleer of prisma beschikbaar is
    if (!prisma) {
      console.error('Prisma client niet geïnitialiseerd');
      return NextResponse.json(
        { error: "Database verbinding niet beschikbaar" },
        { status: 500 }
      );
    }

    // Controleer of de wallet al bestaat
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });

    // Als de wallet nog niet bestaat, maak deze aan
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          id: walletAddress, // Gebruik het adres als ID
          address: walletAddress,
          balance: 0,
          updatedAt: new Date()
        }
      });
      console.log(`Nieuwe wallet aangemaakt: ${walletAddress}`);
    }

    // Return de wallet data
    return NextResponse.json({
      address: wallet.address,
      balance: wallet.balance,
      created: wallet ? false : true
    });
  } catch (error) {
    console.error("Error initializing wallet:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het initialiseren van de wallet" },
      { status: 500 }
    );
  }
}

interface WalletRequest {
  type: 'jackpot' | 'chest' | 'deposit' | 'withdraw';
  amount: number;
  paymentHash: string;
}

// POST endpoint - Update wallet balance and create a transaction
export async function POST(
  request: Request,
  context: { params: { address: string } }
) {
  try {
    const { address } = await context.params;
    const { type, amount, paymentHash } = await request.json();

    // Controleer of prisma beschikbaar is
    if (!prisma) {
      console.error('Prisma client niet geïnitialiseerd');
      return NextResponse.json(
        { error: "Database verbinding niet beschikbaar" },
        { status: 500 }
      );
    }

    // Validate transaction type
    if (!Object.values(TransactionType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Calculate new balance
    let newBalance = wallet.balance;
    if (type === 'DEPOSIT') {
      newBalance += amount;
    } else if (type === 'WITHDRAW') {
      if (wallet.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }
      newBalance -= amount;
    }

    // Create transaction and update wallet in a transaction
    const result = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          type,
          amount,
          paymentHash,
          walletId: wallet.id,
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: newBalance,
          updatedAt: new Date()
        },
      }),
    ]);

    // Ensure balance is converted to number
    const serializedWallet = {
      address: result[1].address,
      balance: Number(result[1].balance),
      transaction: {
        type,
        amount,
        paymentHash,
        status: 'COMPLETED'
      }
    };

    return NextResponse.json(serializedWallet);
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 