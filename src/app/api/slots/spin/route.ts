import { NextRequest, NextResponse } from 'next/server';

// Server-side symbol weights (NEVER exposed to client)
const SYMBOL_WEIGHTS: { [key: string]: number } = {
  'tiger5': 35,      // Most common (lowest payout)
  'tiger12': 30,     // Very common
  'tiger23': 25,     // Common
  'tiger45': 20,     // Less common
  'tiger67': 15,     // Uncommon
  'tiger89': 8,      // "Bells" - rare
  'tiger123': 5,     // "Strawberries" - very rare
  'tiger234': 3,     // "Melons" - extremely rare
  'tiger456': 2,     // Almost Jackpot - ultra rare
  'tiger777': 1,     // Jackpot - legendary rare
};

const SLOT_SYMBOLS = [
  'tiger5', 'tiger12', 'tiger23', 'tiger45', 'tiger67',
  'tiger89', 'tiger123', 'tiger234', 'tiger456', 'tiger777'
];

const WINLINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Center row  
  [6, 7, 8], // Bottom row
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];

// Server-side payout table (NEVER exposed to client)
const getCustomPayout = (betAmount: number, symbolId: string): number => {
  const payoutTable: { [key: number]: { [key: string]: number } } = {
    400: {
      'tiger777': 20000,   'tiger456': 6000,    'tiger234': 6000,
      'tiger123': 6000,    'tiger89': 6000,     'tiger67': 2800,
      'tiger45': 2800,     'tiger23': 2800,     'tiger12': 2800,
      'tiger5': 2800
    },
    1000: {
      'tiger777': 40000,   'tiger456': 16000,   'tiger234': 16000,
      'tiger123': 16000,   'tiger89': 16000,    'tiger67': 8000,
      'tiger45': 8000,     'tiger23': 8000,     'tiger12': 8000,
      'tiger5': 8000
    },
    2000: {
      'tiger777': 80000,   'tiger456': 32000,   'tiger234': 32000,
      'tiger123': 32000,   'tiger89': 32000,    'tiger67': 16000,
      'tiger45': 16000,    'tiger23': 16000,    'tiger12': 16000,
      'tiger5': 16000
    },
    4000: {
      'tiger777': 200000,  'tiger456': 80000,   'tiger234': 80000,
      'tiger123': 64000,   'tiger89': 64000,    'tiger67': 32000,
      'tiger45': 32000,    'tiger23': 32000,    'tiger12': 32000,
      'tiger5': 32000
    },
    8000: {
      'tiger777': 400000,  'tiger456': 160000,  'tiger234': 160000,
      'tiger123': 148000,  'tiger89': 128000,   'tiger67': 64000,
      'tiger45': 64000,    'tiger23': 64000,    'tiger12': 64000,
      'tiger5': 64000
    }
  };
  
  return payoutTable[betAmount]?.[symbolId] || 0;
};

// Cryptographically secure random number generation
const getSecureRandomSymbol = (): string => {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  
  // Use crypto.getRandomValues for true randomness
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  const randomNum = (randomArray[0] / (0xFFFFFFFF + 1)) * totalWeight;
  
  let currentWeight = 0;
  for (const symbolId of SLOT_SYMBOLS) {
    currentWeight += SYMBOL_WEIGHTS[symbolId];
    if (randomNum <= currentWeight) {
      return symbolId;
    }
  }
  return SLOT_SYMBOLS[0];
};

// Server-side win calculation
const calculateServerPayout = (resultReels: string[][], betAmount: number) => {
  let totalPayout = 0;
  let winTypes: string[] = [];
  
  // Convert 3x3 reels to flat array for winline checking
  const flatReels = [
    resultReels[0][0], resultReels[1][0], resultReels[2][0], // Top row
    resultReels[0][1], resultReels[1][1], resultReels[2][1], // Center row
    resultReels[0][2], resultReels[1][2], resultReels[2][2]  // Bottom row
  ];
  
  // Check all 5 winlines - ONLY 3-of-a-kind wins
  for (let lineIndex = 0; lineIndex < WINLINES.length; lineIndex++) {
    const line = WINLINES[lineIndex];
    const lineSymbols = line.map(pos => flatReels[pos]);
    
    // Check for 3-of-a-kind ONLY
    if (lineSymbols[0] === lineSymbols[1] && lineSymbols[1] === lineSymbols[2]) {
      const payout = getCustomPayout(betAmount, lineSymbols[0]);
      totalPayout += payout;
      winTypes.push(`Line ${lineIndex + 1}: Three ${lineSymbols[0].replace('tiger', 'Tiger #')}s`);
    }
  }
  
  return { totalPayout, winTypes };
};

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, betAmount } = await request.json();

    if (!walletAddress || !betAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate bet amount against allowed amounts
    const allowedBets = [400, 1000, 2000, 4000, 8000];
    if (!allowedBets.includes(betAmount)) {
      return NextResponse.json(
        { success: false, error: 'Invalid bet amount' },
        { status: 400 }
      );
    }

    // First, deduct the bet amount
    const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/wallet/${walletAddress}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'WITHDRAW',
        amount: betAmount,
        paymentHash: `slot-bet-${Date.now()}`
      })
    });

    if (!walletResponse.ok) {
      const errorData = await walletResponse.json();
      return NextResponse.json(
        { success: false, error: errorData.error || 'Insufficient balance' },
        { status: 400 }
      );
    }

    const walletData = await walletResponse.json();

    // Generate secure random result (SERVER-SIDE ONLY)
    const finalReels = [
      [getSecureRandomSymbol(), getSecureRandomSymbol(), getSecureRandomSymbol()],
      [getSecureRandomSymbol(), getSecureRandomSymbol(), getSecureRandomSymbol()],
      [getSecureRandomSymbol(), getSecureRandomSymbol(), getSecureRandomSymbol()]
    ];

    // Calculate payout (SERVER-SIDE ONLY)
    const { totalPayout, winTypes } = calculateServerPayout(finalReels, betAmount);

    // If there's a win, add it to balance
    let finalBalance = walletData.balance;
    if (totalPayout > 0) {
      const payoutResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/wallet/${walletAddress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DEPOSIT',
          amount: totalPayout,
          paymentHash: `slot-win-${Date.now()}`
        })
      });

      if (payoutResponse.ok) {
        const payoutData = await payoutResponse.json();
        finalBalance = payoutData.balance;
      }
    }

    // Log house revenue
    const houseRevenue = totalPayout > 0 ? (betAmount - totalPayout) : betAmount;
    console.log(`House Revenue: ${houseRevenue} sats from ${betAmount} sats bet (${totalPayout} sats payout)`);

    return NextResponse.json({
      success: true,
      gameResult: {
        reels: finalReels,
        payout: totalPayout,
        isWin: totalPayout > 0,
        winType: winTypes.length > 0 ? winTypes.join(' + ') : undefined
      },
      balance: finalBalance,
      houseRevenue
    });

  } catch (error) {
    console.error('Error processing slot spin:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 