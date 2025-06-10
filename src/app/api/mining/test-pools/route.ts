import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test of de mining pool models werken
    const pools = await prisma.miningPool.findMany({
      include: {
        poolMembers: {
          include: {
            wallet: {
              select: {
                address: true,
                balance: true
              }
            }
          }
        }
      }
    });
    
    const poolStats = pools.map(pool => ({
      id: pool.id,
      name: pool.name,
      type: pool.poolType,
      currentTigers: pool.currentTigers,
      maxTigers: pool.maxTigers,
      entryFee: pool.entryFee,
      dailyYield: pool.dailyYield,
      membersCount: pool.poolMembers.length,
      isActive: pool.isActive
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Mining pools loaded successfully!',
      totalPools: pools.length,
      pools: poolStats
    });
    
  } catch (error) {
    console.error('Error testing pools:', error);
    return NextResponse.json({
      error: 'Database connection issue',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 