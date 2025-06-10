import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Dummy data voor nu - later vervangen met echte database calls
    const dummyPools = [
      {
        id: 1,
        name: "Coal Mine Alpha",
        description: "Low risk, steady returns for beginners",
        poolType: "COAL_MINE",
        minTigers: 5,
        maxTigers: 50,
        currentTigers: 23,
        entryFee: 10000,
        dailyYield: 50000,
        riskPercentage: 5,
        isActive: true
      },
      {
        id: 2,
        name: "Gold Rush Mine",
        description: "Medium risk with golden opportunities",
        poolType: "GOLD_MINE",
        minTigers: 10,
        maxTigers: 100,
        currentTigers: 67,
        entryFee: 25000,
        dailyYield: 150000,
        riskPercentage: 15,
        isActive: true
      },
      {
        id: 3,
        name: "Diamond Deep Mine",
        description: "High risk, high reward for experienced miners",
        poolType: "DIAMOND_MINE",
        minTigers: 20,
        maxTigers: 200,
        currentTigers: 145,
        entryFee: 50000,
        dailyYield: 400000,
        riskPercentage: 25,
        isActive: true
      },
      {
        id: 4,
        name: "Lightning Strike Mine",
        description: "Exclusive premium mining experience",
        poolType: "LIGHTNING_MINE",
        minTigers: 50,
        maxTigers: 500,
        currentTigers: 312,
        entryFee: 100000,
        dailyYield: 1000000,
        riskPercentage: 35,
        isActive: true
      }
    ];

    return NextResponse.json({
      success: true,
      pools: dummyPools
    });
  } catch (error) {
    console.error('Error fetching mining pools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mining pools' },
      { status: 500 }
    );
  }
} 