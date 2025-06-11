import { NextRequest, NextResponse } from 'next/server';

// MULTIPLAYER REEL STRIPS: 9 symbols like official machine (NO Tiger #5!)
// Tiger #12 is now the lowest symbol, proper 9-symbol balance
const REEL_STRIPS = {
  reel1: [
    // 100 positions - 9 symbols only, like official Multiplayer
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23',
    'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23',
    'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45',
    'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger67', 'tiger67', 'tiger67', 'tiger67', 'tiger67',
    'tiger89', 'tiger89', 'tiger89', 'tiger123', 'tiger123', 'tiger123', 'tiger234', 'tiger234', 'tiger456', 'tiger456',
    'tiger777', 'tiger777', 'tiger12', 'tiger23', 'tiger45', 'tiger67', 'tiger89', 'tiger123', 'tiger234', 'tiger456'
  ],
  reel2: [
    // 100 positions - Same distribution for consistency
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23',
    'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23',
    'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45',
    'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger67', 'tiger67', 'tiger67', 'tiger67', 'tiger67',
    'tiger89', 'tiger89', 'tiger89', 'tiger123', 'tiger123', 'tiger123', 'tiger234', 'tiger234', 'tiger456', 'tiger456',
    'tiger777', 'tiger777', 'tiger12', 'tiger23', 'tiger45', 'tiger67', 'tiger89', 'tiger123', 'tiger234', 'tiger456'
  ],
  reel3: [
    // 100 positions - Consistent across all reels
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12', 'tiger12',
    'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23',
    'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23', 'tiger23',
    'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45',
    'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger45', 'tiger67', 'tiger67', 'tiger67', 'tiger67', 'tiger67',
    'tiger89', 'tiger89', 'tiger89', 'tiger123', 'tiger123', 'tiger123', 'tiger234', 'tiger234', 'tiger456', 'tiger456',
    'tiger777', 'tiger777', 'tiger12', 'tiger23', 'tiger45', 'tiger67', 'tiger89', 'tiger123', 'tiger234', 'tiger456'
  ]
};

// ORIGINAL MULTIPLAYER PAYOUTS - 9 symbols like official machine!
// Tiger #5 REMOVED - Tiger #12 is now the lowest symbol
const getCustomPayout = (betAmount: number, symbolId: string): number => {
  const payoutTable: { [key: number]: { [key: string]: number } } = {
    400: {
      'tiger777': 20000,   // 50x bet - TOP JACKPOT!
      'tiger456': 6000,    // 15x bet - Great win
      'tiger234': 6000,    // 15x bet - Great win  
      'tiger123': 6000,    // 15x bet - Great win
      'tiger89': 6000,     // 15x bet - Great win
      'tiger67': 2800,     // 7x bet - Good win
      'tiger45': 2800,     // 7x bet - Good win
      'tiger23': 2800,     // 7x bet - Good win
      'tiger12': 2800      // 7x bet - LOWEST SYMBOL
    },
    1000: {
      'tiger777': 40000,   // 40x bet - TOP JACKPOT!
      'tiger456': 16000,   // 16x bet - Great win
      'tiger234': 16000,   // 16x bet - Great win
      'tiger123': 16000,   // 16x bet - Great win
      'tiger89': 16000,    // 16x bet - Great win
      'tiger67': 8000,     // 8x bet - Good win
      'tiger45': 8000,     // 8x bet - Good win
      'tiger23': 8000,     // 8x bet - Good win
      'tiger12': 8000      // 8x bet - LOWEST SYMBOL
    },
    2000: {
      'tiger777': 80000,   // 40x bet - TOP JACKPOT!
      'tiger456': 32000,   // 16x bet - Great win
      'tiger234': 32000,   // 16x bet - Great win
      'tiger123': 32000,   // 16x bet - Great win
      'tiger89': 32000,    // 16x bet - Great win
      'tiger67': 16000,    // 8x bet - Good win
      'tiger45': 16000,    // 8x bet - Good win
      'tiger23': 16000,    // 8x bet - Good win
      'tiger12': 16000     // 8x bet - LOWEST SYMBOL
    },
    4000: {
      'tiger777': 200000,  // 50x bet - BIG JACKPOT!
      'tiger456': 80000,   // 20x bet - Great win
      'tiger234': 80000,   // 20x bet - Great win
      'tiger123': 64000,   // 16x bet - Good win
      'tiger89': 64000,    // 16x bet - Good win
      'tiger67': 32000,    // 8x bet - Decent win
      'tiger45': 32000,    // 8x bet - Decent win
      'tiger23': 32000,    // 8x bet - Decent win
      'tiger12': 32000     // 8x bet - LOWEST SYMBOL
    },
    8000: {
      'tiger777': 400000,  // 50x bet - MEGA JACKPOT!
      'tiger456': 160000,  // 20x bet - Huge win
      'tiger234': 160000,  // 20x bet - Huge win
      'tiger123': 148000,  // 18.5x bet - Big win
      'tiger89': 128000,   // 16x bet - Big win
      'tiger67': 64000,    // 8x bet - Good win
      'tiger45': 64000,    // 8x bet - Good win
      'tiger23': 64000,    // 8x bet - Good win
      'tiger12': 64000     // 8x bet - LOWEST SYMBOL
    }
  };
  
  return payoutTable[betAmount]?.[symbolId] || 0;
};

// RTP CALCULATOR - Analyzes mathematical expectation (BALANCED MULTIPLAYER)
const calculateTheoreticalRTP = (): number => {
  // Count symbol frequencies across all reels
  const symbolCounts: { [key: string]: number } = {};
  const totalPositions = 100; // Each reel has 100 positions
  
  // Count symbols in each reel
  Object.values(REEL_STRIPS).forEach(reel => {
    reel.forEach(symbol => {
      symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    });
  });
  
  // Calculate probability of 3-of-a-kind on any winline for each symbol
  let totalExpectedReturn = 0;
  const betAmount = 1000; // Use 1000 as base bet for calculation
  
  console.log('🎰 BALANCED MULTIPLAYER ANALYSIS (Original Payouts, Adjusted Frequencies):');
  
  // For each symbol, calculate probability and expected return
  Object.keys(symbolCounts).forEach(symbol => {
    // Probability of getting this symbol on each reel
    const probReel1 = (REEL_STRIPS.reel1.filter(s => s === symbol).length) / totalPositions;
    const probReel2 = (REEL_STRIPS.reel2.filter(s => s === symbol).length) / totalPositions;
    const probReel3 = (REEL_STRIPS.reel3.filter(s => s === symbol).length) / totalPositions;
    
    // Probability of 3-of-a-kind for this symbol
    const prob3OfAKind = probReel1 * probReel2 * probReel3;
    
    // Expected return for this symbol (across 5 winlines)
    const payout = getCustomPayout(betAmount, symbol);
    const expectedReturnPerLine = prob3OfAKind * payout;
    const expectedReturnAllLines = expectedReturnPerLine * 5; // 5 winlines
    
    totalExpectedReturn += expectedReturnAllLines;
    
    const multiplier = payout / betAmount;
    console.log(`${symbol}: Freq=${probReel1.toFixed(1)}% Prob=${(prob3OfAKind * 100).toFixed(3)}% Payout=${payout.toLocaleString()} (${multiplier}x) Expected=${expectedReturnAllLines.toFixed(1)}`);
  });
  
  const rtp = (totalExpectedReturn / betAmount) * 100;
  const houseEdge = 100 - rtp;
  
  console.log(`📊 BALANCED MULTIPLAYER RESULTS:`);
  console.log(`Total Expected Return: ${totalExpectedReturn.toFixed(2)} sats`);
  console.log(`Theoretical RTP: ${rtp.toFixed(2)}%`);
  console.log(`House Edge: ${houseEdge.toFixed(2)}%`);
  console.log(`💰 House Profit per 1000 sats bet: ${(betAmount - totalExpectedReturn).toFixed(2)} sats`);
  
  // Show frequency distribution
  console.log(`🎯 NEW SYMBOL FREQUENCIES:`);
  Object.keys(symbolCounts).forEach(symbol => {
    const freq1 = REEL_STRIPS.reel1.filter(s => s === symbol).length;
    console.log(`${symbol}: ${freq1}% frequency per reel`);
  });
  
  return rtp;
};

// Calculate RTP on server startup for monitoring
console.log('🎰 BALANCED MULTIPLAYER SLOT MACHINE RTP ANALYSIS:');
calculateTheoreticalRTP();

const SLOT_SYMBOLS = [
  'tiger12', 'tiger23', 'tiger45', 'tiger67',
  'tiger89', 'tiger123', 'tiger234', 'tiger456', 'tiger777'
];

const WINLINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Center row  
  [6, 7, 8], // Bottom row
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];

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

// Server-side win calculation (NO BLANK CHECK - all symbols can win!)
const calculateServerPayout = (resultReels: string[][], betAmount: number) => {
  let totalPayout = 0;
  let winTypes: string[] = [];
  
  // Convert 3x3 reels to flat array for winline checking
  const flatReels = [
    resultReels[0][0], resultReels[1][0], resultReels[2][0], // Top row
    resultReels[0][1], resultReels[1][1], resultReels[2][1], // Center row
    resultReels[0][2], resultReels[1][2], resultReels[2][2]  // Bottom row
  ];
  
  // Check all 5 winlines - ANY 3-of-a-kind wins (no blanks to exclude!)
  for (let lineIndex = 0; lineIndex < WINLINES.length; lineIndex++) {
    const line = WINLINES[lineIndex];
    const lineSymbols = line.map(pos => flatReels[pos]);
    
    // Check for 3-of-a-kind - all symbols are valid!
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

    // Log house revenue for monitoring
    const houseRevenue = totalPayout > 0 ? (betAmount - totalPayout) : betAmount;
    const rtp = totalPayout > 0 ? ((totalPayout / betAmount) * 100).toFixed(1) : '0.0';
    console.log(`🎰 Spin: ${betAmount} sats bet → ${totalPayout} sats win | House: +${houseRevenue} sats | RTP: ${rtp}%`);

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