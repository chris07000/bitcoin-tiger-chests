import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Security check - only allow from authorized sources
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'tiger-cron-secret-2024';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.log('🚫 Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('⏰ Starting automated daily payouts...');
    
    // Check if payouts were already processed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysPayouts = await (prisma as any).houseRevenue.findFirst({
      where: {
        source: 'MINING_HOUSE_EDGE',
        date: { gte: today }
      }
    });

    if (todaysPayouts) {
      console.log('⚠️ Daily payouts already processed today');
      return NextResponse.json({
        success: false,
        message: 'Daily payouts already processed today',
        lastPayout: todaysPayouts.date
      });
    }

    // Get all active pools with members
    const activePools = await (prisma as any).miningPool.findMany({
      where: { 
        isActive: true,
        currentTigers: { gt: 0 }
      },
      include: {
        poolMembers: {
          where: { isActive: true },
          include: {
            wallet: true
          }
        }
      }
    });

    if (activePools.length === 0) {
      console.log('ℹ️ No active pools found for payouts');
      return NextResponse.json({
        success: true,
        message: 'No active pools found',
        poolsProcessed: 0
      });
    }

    let totalHouseRevenue = 0;
    let totalMemberPayouts = 0;
    let poolsProcessed = 0;

    // Process each pool
    for (const pool of activePools) {
      if (pool.poolMembers.length === 0) continue;

      console.log(`⛏️ Processing ${pool.name}...`);

      // Calculate daily yield and house edge
      const baseYield = pool.dailyYield;
      const efficiencyMultiplier = Math.min(1.5, 1 + (pool.currentTigers / pool.maxTigers) * 0.5);
      const totalYield = baseYield * efficiencyMultiplier;
      
      const houseEdgePercentage = getHouseEdge(pool.poolType);
      const houseRevenue = totalYield * (houseEdgePercentage / 100);
      const memberYield = totalYield - houseRevenue;

      // Process pool payouts in transaction
      await (prisma as any).$transaction(async (tx: any) => {
        const totalMemberTigers = pool.poolMembers.reduce((sum: number, member: any) => sum + member.tigersStaked, 0);

        // Pay each member
        for (const member of pool.poolMembers) {
          const memberShare = (member.tigersStaked / totalMemberTigers) * memberYield;
          
          // Get member's tigers for bonuses
          const memberTigers = await tx.tigerStaking.findMany({
            where: {
              walletId: member.wallet.id,
              isActive: true
            }
          });
          
          const levelBonus = calculateTigerBonuses(memberTigers.slice(0, member.tigersStaked));
          const finalPayout = memberShare * (1 + levelBonus);
          
          // Pay member
          await tx.wallet.update({
            where: { id: member.wallet.id },
            data: {
              balance: member.wallet.balance + finalPayout
            }
          });
          
          // Record transaction
          await tx.transaction.create({
            data: {
              id: `auto_mining_payout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              amount: finalPayout,
              walletId: member.wallet.id,
              type: 'REWARD',
              status: 'COMPLETED',
              createdAt: new Date()
            }
          });
          
          // Update member stats
          await tx.poolMembership.update({
            where: { id: member.id },
            data: {
              totalEarned: member.totalEarned + finalPayout
            }
          });
        }
        
        // Update pool last payout
        await tx.miningPool.update({
          where: { id: pool.id },
          data: {
            lastPayout: new Date()
          }
        });
        
        // Record house revenue
        await tx.houseRevenue.create({
          data: {
            amount: houseRevenue,
            source: 'MINING_HOUSE_EDGE',
            sourceId: pool.id.toString(),
            description: `Automated daily payout: ${pool.name} (${pool.currentTigers} tigers, ${pool.poolMembers.length} members)`,
            date: new Date()
          }
        });
      });

      totalHouseRevenue += houseRevenue;
      totalMemberPayouts += memberYield;
      poolsProcessed++;
      
      console.log(`✅ ${pool.name}: ${houseRevenue} house, ${memberYield} members`);
    }

    const summary = {
      totalHouseRevenue,
      totalMemberPayouts,
      poolsProcessed,
      processedAt: new Date().toISOString()
    };

    console.log(`🏆 Automated payout summary:`);
    console.log(`💰 House revenue: ${totalHouseRevenue} sats`);
    console.log(`💎 Member payouts: ${totalMemberPayouts} sats`);
    console.log(`📊 Pools processed: ${poolsProcessed}`);

    return NextResponse.json({
      success: true,
      message: `Daily payouts processed successfully`,
      summary
    });

  } catch (error) {
    console.error('❌ Error in automated daily payouts:', error);
    return NextResponse.json(
      { error: 'Failed to process automated payouts' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    service: 'Daily Payouts Cron',
    status: 'ready',
    lastCheck: new Date().toISOString()
  });
}

function getHouseEdge(poolType: string): number {
  switch (poolType) {
    case 'COAL_MINE': return 10;
    case 'GOLD_MINE': return 15;
    case 'DIAMOND_MINE': return 20;
    case 'LIGHTNING_MINE': return 25;
    default: return 15;
  }
}

function calculateTigerBonuses(tigers: any[]): number {
  let totalBonus = 0;
  
  for (const tiger of tigers) {
    const levelBonus = (tiger.tigerLevel - 1) * 0.05;
    const guardianBonus = tiger.isGuardian ? 0.20 : 0;
    totalBonus += levelBonus + guardianBonus;
  }
  
  return tigers.length > 0 ? totalBonus / tigers.length : 0;
} 