import { NextRequest, NextResponse } from 'next/server';

// Server-side symbol weights (NEVER exposed to client)
// Adjusted for realistic 80% RTP (20% house edge)
const SYMBOL_WEIGHTS: { [key: string]: number } = {
  'tiger5': 25,      // High frequency, lower payouts
  'tiger12': 22,     // High frequency 
  'tiger23': 20,     // Medium-high frequency
  'tiger45': 18,     // Medium frequency
  'tiger67': 15,     // Medium frequency
  'tiger89': 12,     // Medium-low frequency ("Bells")
  'tiger123': 8,     // Low frequency ("Strawberries")
  'tiger234': 6,     // Very low frequency ("Melons")
  'tiger456': 4,     // Ultra low frequency (Almost Jackpot)
  'tiger777': 2,     // Jackpot - still rare but more frequent
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

// Traditional slot machine reel strips (like real casinos)
// Each reel has a predefined sequence of symbols with exact weights
const REEL_STRIPS = {
  reel1: [
    // 100 positions on reel 1 - optimized for payouts
    'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger45', 'tiger5', 'tiger12', 'tiger5', 'tiger67',
    'tiger12', 'tiger5', 'tiger12', 'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger89', 'tiger5', 'tiger12',
    'tiger23', 'tiger5', 'tiger45', 'tiger5', 'tiger12', 'tiger5', 'tiger67', 'tiger5', 'tiger12', 'tiger5',
    'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger123', 'tiger5', 'tiger12', 'tiger5', 'tiger45', 'tiger12',
    'tiger5', 'tiger67', 'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger89',
    'tiger12', 'tiger5', 'tiger45', 'tiger5', 'tiger12', 'tiger5', 'tiger234', 'tiger12', 'tiger5', 'tiger67',
    'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger45', 'tiger12', 'tiger5',
    'tiger89', 'tiger5', 'tiger12', 'tiger5', 'tiger67', 'tiger5', 'tiger456', 'tiger12', 'tiger5', 'tiger23',
    'tiger5', 'tiger12', 'tiger5', 'tiger123', 'tiger5', 'tiger12', 'tiger5', 'tiger45', 'tiger12', 'tiger5',
    'tiger67', 'tiger5', 'tiger12', 'tiger5', 'tiger777', 'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger12'
  ],
  reel2: [
    // 100 positions on reel 2 - different distribution for variety
    'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger45', 'tiger12', 'tiger5', 'tiger23',
    'tiger5', 'tiger67', 'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger12', 'tiger89', 'tiger5',
    'tiger45', 'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger67', 'tiger5', 'tiger12', 'tiger5', 'tiger23',
    'tiger5', 'tiger12', 'tiger123', 'tiger5', 'tiger45', 'tiger5', 'tiger12', 'tiger5', 'tiger67', 'tiger5',
    'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger89', 'tiger45', 'tiger5', 'tiger12', 'tiger5', 'tiger23',
    'tiger5', 'tiger234', 'tiger12', 'tiger5', 'tiger67', 'tiger5', 'tiger23', 'tiger5', 'tiger12', 'tiger5',
    'tiger45', 'tiger5', 'tiger123', 'tiger12', 'tiger5', 'tiger89', 'tiger5', 'tiger23', 'tiger5', 'tiger12',
    'tiger67', 'tiger5', 'tiger456', 'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger45', 'tiger5', 'tiger12',
    'tiger5', 'tiger89', 'tiger5', 'tiger67', 'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger123', 'tiger5',
    'tiger12', 'tiger777', 'tiger5', 'tiger23', 'tiger5', 'tiger12', 'tiger45', 'tiger5', 'tiger67', 'tiger5'
  ],
  reel3: [
    // 100 positions on reel 3 - optimized for near-misses and excitement
    'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger45', 'tiger5', 'tiger12', 'tiger23', 'tiger5', 'tiger67',
    'tiger5', 'tiger12', 'tiger5', 'tiger23', 'tiger89', 'tiger5', 'tiger45', 'tiger5', 'tiger12', 'tiger5',
    'tiger67', 'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger123', 'tiger5', 'tiger23', 'tiger45', 'tiger5',
    'tiger12', 'tiger5', 'tiger89', 'tiger5', 'tiger67', 'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger45',
    'tiger5', 'tiger234', 'tiger12', 'tiger5', 'tiger67', 'tiger5', 'tiger23', 'tiger89', 'tiger5', 'tiger45',
    'tiger5', 'tiger12', 'tiger123', 'tiger5', 'tiger67', 'tiger23', 'tiger5', 'tiger12', 'tiger5', 'tiger89',
    'tiger45', 'tiger5', 'tiger67', 'tiger5', 'tiger456', 'tiger12', 'tiger5', 'tiger23', 'tiger5', 'tiger123',
    'tiger5', 'tiger89', 'tiger45', 'tiger5', 'tiger67', 'tiger5', 'tiger12', 'tiger23', 'tiger5', 'tiger234',
    'tiger5', 'tiger45', 'tiger12', 'tiger5', 'tiger89', 'tiger67', 'tiger5', 'tiger23', 'tiger5', 'tiger123',
    'tiger12', 'tiger5', 'tiger777', 'tiger5', 'tiger45', 'tiger5', 'tiger67', 'tiger23', 'tiger5', 'tiger12'
  ]
};

// Traditional slot machine reel positioning
const getReelSymbol = (reelIndex: number, position: number): string => {
  const reelKey = `reel${reelIndex + 1}` as keyof typeof REEL_STRIPS;
  const strip = REEL_STRIPS[reelKey];
  return strip[position % strip.length];
};

// Generate traditional slot result (like real casino machines)
const generateTraditionalSlotResult = (): string[][] => {
  // Generate random positions for each reel (0-99)
  const randomArray = new Uint32Array(3);
  crypto.getRandomValues(randomArray);
  
  const reelPositions = [
    randomArray[0] % 100, // Reel 1 position  
    randomArray[1] % 100, // Reel 2 position
    randomArray[2] % 100  // Reel 3 position
  ];
  
  // Build 3x3 result grid from reel positions
  const result: string[][] = [[], [], []];
  
  for (let reel = 0; reel < 3; reel++) {
    const basePosition = reelPositions[reel];
    // Show 3 consecutive symbols from this reel position
    for (let row = 0; row < 3; row++) {
      const symbolPosition = (basePosition + row) % 100;
      result[reel][row] = getReelSymbol(reel, symbolPosition);
    }
  }
  
  return result;
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

    // Generate traditional slot result (like real casino machines)
    const finalReels = generateTraditionalSlotResult();

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