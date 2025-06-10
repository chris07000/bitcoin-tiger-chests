import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🏭 Starting mining pool payouts processing...');
    
    // Get all active pools
    const activePools = await prisma.miningPool.findMany({
      where: { 
        isActive: true,
        currentTigers: { gt: 0 } // Only pools with tigers
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

    let totalHouseRevenue = 0;
    let totalPayouts = 0;
    const poolResults = [];

    for (const pool of activePools) {
      console.log(`⛏️ Processing pool: ${pool.name} (${pool.currentTigers} tigers)`);
      
      if (pool.poolMembers.length === 0) {
        console.log(`⚠️ No active members in ${pool.name}, skipping...`);
        continue;
      }

      // Base pool yield per day
      const baseYield = pool.dailyYield;
      
      // Apply efficiency based on tiger count (more tigers = better efficiency)
      const efficiencyMultiplier = Math.min(1.5, 1 + (pool.currentTigers / pool.maxTigers) * 0.5);
      const totalYield = baseYield * efficiencyMultiplier;
      
      // House edge (10-20% depending on pool type)
      const houseEdgePercentage = getHouseEdge(pool.poolType);
      const houseRevenue = totalYield * (houseEdgePercentage / 100);
      const memberYield = totalYield - houseRevenue;
      
      console.log(`💰 Pool ${pool.name}: ${totalYield} total, ${houseRevenue} house, ${memberYield} members`);
      
      // Calculate payouts per member (weighted by tigers)
      const totalMemberTigers = pool.poolMembers.reduce((sum, member) => sum + member.tigersStaked, 0);
      
      await prisma.$transaction(async (tx) => {
        for (const member of pool.poolMembers) {
          // Calculate member's share based on tigers staked
          const memberShare = (member.tigersStaked / totalMemberTigers) * memberYield;
          
          // Apply tiger level bonuses (get user's tigers)
          const memberTigers = await tx.tigerStaking.findMany({
            where: {
              walletId: member.wallet.id,
              isActive: true
            }
          });
          
          const levelBonus = calculateTigerBonuses(memberTigers.slice(0, member.tigersStaked));
          const finalPayout = memberShare * (1 + levelBonus);
          
          // Pay the member
          await tx.wallet.update({
            where: { id: member.wallet.id },
            data: {
              balance: member.wallet.balance + finalPayout,
              updatedAt: new Date()
            }
          });
          
          // Record the transaction
          await tx.transaction.create({
            data: {
              id: `mining_payout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
          
          console.log(`💎 Paid ${finalPayout} sats to ${member.wallet.address} (${member.tigersStaked} tigers)`);
        }
        
        // Update pool last payout
        await tx.miningPool.update({
          where: { id: pool.id },
          data: {
            lastPayout: new Date()
          }
        });
        
        // Record house edge revenue in database
        await tx.houseRevenue.create({
          data: {
            amount: houseRevenue,
            source: 'MINING_HOUSE_EDGE',
            sourceId: pool.id.toString(),
            description: `Daily house edge from ${pool.name} (${pool.currentTigers} tigers, ${pool.poolMembers.length} members)`,
            date: new Date()
          }
        });
      });
      
      totalHouseRevenue += houseRevenue;
      totalPayouts += memberYield;
      
      poolResults.push({
        poolName: pool.name,
        totalYield,
        houseRevenue,
        memberYield,
        membersCount: pool.poolMembers.length,
        tigersCount: pool.currentTigers
      });
    }
    
    console.log(`🏆 Payout Summary:`);
    console.log(`💰 Total house revenue: ${totalHouseRevenue} sats`);
    console.log(`💎 Total member payouts: ${totalPayouts} sats`);
    console.log(`📊 Processed ${poolResults.length} pools`);
    
    return NextResponse.json({
      success: true,
      summary: {
        totalHouseRevenue,
        totalPayouts,
        poolsProcessed: poolResults.length,
        poolResults
      }
    });
    
  } catch (error) {
    console.error('❌ Error processing payouts:', error);
    return NextResponse.json(
      { error: 'Failed to process payouts' },
      { status: 500 }
    );
  }
}

// House edge per pool type (project's cut)
function getHouseEdge(poolType: string): number {
  switch (poolType) {
    case 'COAL_MINE': return 10; // 10% house edge
    case 'GOLD_MINE': return 15; // 15% house edge  
    case 'DIAMOND_MINE': return 20; // 20% house edge
    case 'LIGHTNING_MINE': return 25; // 25% house edge (highest risk/reward)
    default: return 15;
  }
}

// Calculate tiger level bonuses
function calculateTigerBonuses(tigers: any[]): number {
  let totalBonus = 0;
  
  for (const tiger of tigers) {
    // Level bonus: 5% per level above 1
    const levelBonus = (tiger.tigerLevel - 1) * 0.05;
    
    // Guardian bonus: extra 20%
    const guardianBonus = tiger.isGuardian ? 0.20 : 0;
    
    totalBonus += levelBonus + guardianBonus;
  }
  
  // Average bonus across all tigers
  return tigers.length > 0 ? totalBonus / tigers.length : 0;
} 