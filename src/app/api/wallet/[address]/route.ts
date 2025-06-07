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

// EMERGENCY CACHE to reduce database calls
const cache = new Map<string, {
  data: any;
  timestamp: number;
}>();

const CACHE_DURATION = 30000; // 30 seconds cache to reduce DB calls

function getCachedResponse(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache HIT for ${key}`);
    return cached.data;
  }
  console.log(`Cache MISS for ${key}`);
  return null;
}

function setCacheResponse(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
  console.log(`Cached response for ${key}`);
}

// In-memory fallback for when database is not available
const fallbackWallets = new Map<string, {
  address: string;
  balance: number;
  transactions: any[];
  createdAt: Date;
}>();

// GET endpoint - Haalt wallet informatie op
export async function GET(
  request: Request,
  context: { params: Promise<{ address: string }> }
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

    // CHECK CACHE FIRST to reduce database calls
    const cacheKey = `wallet_${walletAddress}`;
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse);
    }

    try {
      // Try database first
      if (prisma) {
        // Zoek de wallet in de database
        const wallet = await (prisma as any).wallet.findUnique({
          where: { address: walletAddress }
        });

        if (wallet) {
          // Haal transacties apart op
          const transactions = await (prisma as any).transaction.findMany({
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
          const response = {
            address: wallet.address,
            balance: wallet.balance,
            transactions: formattedTransactions,
            success: true,
            source: 'database'
          };

          // CACHE THE RESPONSE to reduce future DB calls
          setCacheResponse(cacheKey, response);
          
          return NextResponse.json(response);
        }
      }
    } catch (dbError) {
      console.warn('Database error, falling back to in-memory storage:', dbError);
    }

    // Fallback to in-memory storage
    const fallbackWallet = fallbackWallets.get(walletAddress);
    if (fallbackWallet) {
      const response = {
        address: fallbackWallet.address,
        balance: fallbackWallet.balance,
        transactions: fallbackWallet.transactions,
        success: true,
        source: 'memory'
      };

      // CACHE THE FALLBACK RESPONSE too
      setCacheResponse(cacheKey, response);

      return NextResponse.json(response);
    }

    // Als de wallet niet bestaat, return een 404
    return NextResponse.json({ error: "Wallet niet gevonden" }, { status: 404 });
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
  context: { params: Promise<{ address: string }> }
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

    // INVALIDATE CACHE when wallet is modified
    const cacheKey = `wallet_${walletAddress}`;
    cache.delete(cacheKey);
    console.log(`Cache invalidated for ${cacheKey} due to PUT request`);

    let wallet = null;
    let isNewWallet = false;
    let source = 'memory';

    try {
      // Try database first
      if (prisma) {
        console.log('Attempting database wallet initialization...');
        
        // Controleer of de wallet al bestaat
        wallet = await (prisma as any).wallet.findUnique({
          where: { address: walletAddress }
        });

        // Als de wallet nog niet bestaat, maak deze aan
        if (!wallet) {
          wallet = await (prisma as any).wallet.create({
            data: {
              id: walletAddress, // Gebruik het adres als ID
              address: walletAddress,
              balance: 0,
              updatedAt: new Date()
            }
          });
          isNewWallet = true;
          source = 'database';
          console.log(`Nieuwe wallet aangemaakt in database: ${walletAddress}`);
        } else {
          source = 'database';
          console.log(`Bestaande wallet gevonden in database: ${walletAddress}`);
        }
      }
    } catch (dbError) {
      console.warn('Database error during wallet initialization, using fallback:', dbError);
      // Continue to fallback logic below
    }

    // Fallback to in-memory storage if database failed
    if (!wallet) {
      console.log('Using in-memory fallback for wallet:', walletAddress);
      
      let fallbackWallet = fallbackWallets.get(walletAddress);
      if (!fallbackWallet) {
        fallbackWallet = {
          address: walletAddress,
          balance: 0,
          transactions: [],
          createdAt: new Date()
        };
        fallbackWallets.set(walletAddress, fallbackWallet);
        isNewWallet = true;
        console.log(`Nieuwe wallet aangemaakt in memory: ${walletAddress}`);
      }
      
      wallet = fallbackWallet;
      source = 'memory';
    }

    // CACHE THE RESPONSE to reduce future calls
    const response = {
      address: wallet.address,
      balance: wallet.balance,
      created: isNewWallet,
      source: source,
      success: true
    };
    setCacheResponse(cacheKey, response);

    // Return de wallet data
    return NextResponse.json(response);
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
  context: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await context.params;
    const { type, amount, paymentHash } = await request.json();

    console.log(`POST /api/wallet/${address} - ${type} ${amount} sats`);

    // Validate transaction type
    if (!Object.values(TransactionType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    // INVALIDATE CACHE when balance is updated
    const cacheKey = `wallet_${address}`;
    cache.delete(cacheKey);
    console.log(`Cache invalidated for ${cacheKey} due to balance update`);

    let wallet = null;
    let source = 'memory';

    try {
      // Try database first
      if (prisma) {
        // Get wallet
        wallet = await (prisma as any).wallet.findUnique({
          where: { address },
        });

        if (wallet) {
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
          const result = await (prisma as any).$transaction([
            (prisma as any).transaction.create({
              data: {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
                type,
                amount,
                paymentHash,
                walletId: wallet.id,
              },
            }),
            (prisma as any).wallet.update({
              where: { id: wallet.id },
              data: { 
                balance: newBalance,
                updatedAt: new Date()
              },
            }),
          ]);

          source = 'database';
          
          // Ensure balance is converted to number
          const serializedWallet = {
            address: result[1].address,
            balance: Number(result[1].balance),
            transaction: {
              type,
              amount,
              paymentHash,
              status: 'COMPLETED'
            },
            source
          };

          // CACHE THE UPDATED WALLET DATA
          setCacheResponse(cacheKey, {
            address: result[1].address,
            balance: Number(result[1].balance),
            transactions: [], // We could fetch these but for performance, keep empty
            success: true,
            source
          });

          return NextResponse.json(serializedWallet);
        }
      }
    } catch (dbError) {
      console.warn('Database error during transaction, using fallback:', dbError);
    }

    // Fallback to in-memory storage
    const fallbackWallet = fallbackWallets.get(address);
    if (!fallbackWallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Calculate new balance
    let newBalance = fallbackWallet.balance;
    if (type === 'DEPOSIT') {
      newBalance += amount;
    } else if (type === 'WITHDRAW') {
      if (fallbackWallet.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }
      newBalance -= amount;
    }

    // Update fallback wallet
    fallbackWallet.balance = newBalance;
    fallbackWallet.transactions.unshift({
      type,
      amount,
      paymentHash,
      status: 'COMPLETED',
      createdAt: new Date()
    });

    // CACHE THE UPDATED FALLBACK DATA
    setCacheResponse(cacheKey, {
      address: fallbackWallet.address,
      balance: fallbackWallet.balance,
      transactions: fallbackWallet.transactions,
      success: true,
      source: 'memory'
    });

    return NextResponse.json({
      address: fallbackWallet.address,
      balance: fallbackWallet.balance,
      transaction: {
        type,
        amount,
        paymentHash,
        status: 'COMPLETED'
      },
      source: 'memory'
    });
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 