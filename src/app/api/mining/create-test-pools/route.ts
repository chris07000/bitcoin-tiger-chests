import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🏭 Creating test mining pools...');
    
    const testPools = [
      {
        name: 'AntMiner S19 Pro Farm',
        description: 'Reliable mining workhorse with proven stability and consistent hash rates.',
        poolType: 'COAL_MINE',
        minTigers: 1,
        maxTigers: 50,
        entryFee: 5000, // 5K sats
        dailyYield: 1000, // 1K sats base daily yield
        riskPercentage: 5.0, // 5% risk
        isActive: true
      },
      {
        name: 'WhatsMiner M50S Facility',
        description: 'High-performance ASIC with optimized cooling and superior efficiency.',
        poolType: 'GOLD_MINE',
        minTigers: 2,
        maxTigers: 30,
        entryFee: 10000, // 10K sats
        dailyYield: 2500, // 2.5K sats base daily yield
        riskPercentage: 10.0, // 10% risk
        isActive: true
      },
      {
        name: 'AntMiner S21 Hydro Station',
        description: 'Next-gen hydro-cooled mining rig with maximum hash rate output.',
        poolType: 'DIAMOND_MINE',
        minTigers: 3,
        maxTigers: 20,
        entryFee: 25000, // 25K sats
        dailyYield: 5000, // 5K sats base daily yield
        riskPercentage: 20.0, // 20% risk
        isActive: true
      },
      {
        name: 'Lightning Quantum Rig X1',
        description: 'Experimental quantum-enhanced mining rig with lightning-fast processing.',
        poolType: 'LIGHTNING_MINE',
        minTigers: 5,
        maxTigers: 10,
        entryFee: 50000, // 50K sats
        dailyYield: 10000, // 10K sats base daily yield
        riskPercentage: 35.0, // 35% risk
        isActive: true
      }
    ];
    
    const createdPools = [];
    
    for (const poolData of testPools) {
      // Check if pool already exists
      const existing = await (prisma as any).miningPool.findFirst({
        where: { name: poolData.name }
      });
      
      if (!existing) {
        const pool = await (prisma as any).miningPool.create({
          data: poolData
        });
        createdPools.push(pool);
        console.log(`✅ Created pool: ${pool.name}`);
      } else {
        console.log(`⚠️ Pool already exists: ${poolData.name}`);
      }
    }
    
    console.log(`🏆 Created ${createdPools.length} new mining pools`);
    
    return NextResponse.json({
      success: true,
      message: `Created ${createdPools.length} test mining pools`,
      pools: createdPools.map(pool => ({
        id: pool.id,
        name: pool.name,
        type: pool.poolType,
        entryFee: pool.entryFee,
        dailyYield: pool.dailyYield,
        risk: pool.riskPercentage
      }))
    });
    
  } catch (error) {
    console.error('❌ Error creating test pools:', error);
    return NextResponse.json(
      { error: 'Failed to create test pools', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 