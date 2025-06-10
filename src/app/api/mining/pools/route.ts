import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Haal alle actieve mining pools op
    let pools = await prisma.miningPool.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        poolType: 'asc'
      }
    });

    // Als er geen pools zijn, maak wat basis pools aan
    if (pools.length === 0) {
      console.log('No mining pools found, creating default pools...');
      
      const defaultPools = [
        {
          name: "Coal Mine Alpha",
          description: "Low risk, steady returns for beginners",
          poolType: "COAL_MINE" as any,
          minTigers: 5,
          maxTigers: 50,
          entryFee: 10000,
          dailyYield: 50000,
          riskPercentage: 5
        },
        {
          name: "Gold Rush Mine",
          description: "Medium risk with golden opportunities",
          poolType: "GOLD_MINE" as any,
          minTigers: 10,
          maxTigers: 100,
          entryFee: 25000,
          dailyYield: 150000,
          riskPercentage: 15
        },
        {
          name: "Diamond Deep Mine",
          description: "High risk, high reward for experienced miners",
          poolType: "DIAMOND_MINE" as any,
          minTigers: 20,
          maxTigers: 200,
          entryFee: 50000,
          dailyYield: 400000,
          riskPercentage: 25
        },
        {
          name: "Lightning Strike Mine",
          description: "Exclusive premium mining experience",
          poolType: "LIGHTNING_MINE" as any,
          minTigers: 50,
          maxTigers: 500,
          entryFee: 100000,
          dailyYield: 1000000,
          riskPercentage: 35
        }
      ];

      // Maak de pools aan in de database
      for (const poolData of defaultPools) {
        await prisma.miningPool.create({
          data: poolData
        });
      }

      // Haal de nieuwe pools op
      pools = await prisma.miningPool.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          poolType: 'asc'
        }
      });
    }

    return NextResponse.json({
      success: true,
      pools: pools
    });
  } catch (error) {
    console.error('Error fetching mining pools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mining pools' },
      { status: 500 }
    );
  }
} 