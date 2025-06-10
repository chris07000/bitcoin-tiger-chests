import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, poolId, selectedTigers } = await request.json();
    
    if (!walletAddress || !poolId || !selectedTigers || selectedTigers.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Zoek wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Haal pool info op
    const pool = await prisma.miningPool.findUnique({
      where: { id: poolId }
    });

    if (!pool || !pool.isActive) {
      return NextResponse.json(
        { error: 'Pool not found or inactive' },
        { status: 404 }
      );
    }

    // Check if pool has space
    if (pool.currentTigers + selectedTigers.length > pool.maxTigers) {
      return NextResponse.json(
        { error: 'Pool is full or not enough space' },
        { status: 400 }
      );
    }

    // Check if user has sufficient balance
    if (wallet.balance < pool.entryFee) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Verifieer dat de tigers bestaan en van deze user zijn
    const tigerIds = selectedTigers.map((t: any) => t.id);
    const userTigers = await prisma.tigerStaking.findMany({
      where: {
        id: { in: tigerIds },
        walletId: wallet.id,
        isActive: true
      }
    });

    if (userTigers.length !== selectedTigers.length) {
      return NextResponse.json(
        { error: 'Some tigers not found or not owned by user' },
        { status: 400 }
      );
    }

    // Check if user already has membership in this pool
    const existingMembership = await prisma.poolMembership.findUnique({
      where: {
        poolId_walletId: {
          poolId: poolId,
          walletId: wallet.id
        }
      }
    });

    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Betaal entry fee van balance af
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance - pool.entryFee,
          updatedAt: new Date()
        }
      });

      // 2. Registreer transactie
      await tx.transaction.create({
        data: {
          id: `mining_join_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          amount: -pool.entryFee,
          walletId: wallet.id,
          type: 'RAFFLE', // We gebruiken RAFFLE type voor mining ook
          status: 'COMPLETED',
          createdAt: new Date()
        }
      });

      // 3. Update of create pool membership
      if (existingMembership) {
        await tx.poolMembership.update({
          where: { id: existingMembership.id },
          data: {
            tigersStaked: existingMembership.tigersStaked + selectedTigers.length,
            isActive: true
          }
        });
      } else {
        await tx.poolMembership.create({
          data: {
            poolId: poolId,
            walletId: wallet.id,
            tigersStaked: selectedTigers.length,
            joinedAt: new Date(),
            isActive: true,
            totalEarned: 0
          }
        });
      }

      // 4. Update pool tiger count
      await tx.miningPool.update({
        where: { id: poolId },
        data: {
          currentTigers: pool.currentTigers + selectedTigers.length,
          updatedAt: new Date()
        }
      });

      // 5. Log the revenue for the house (entry fee goes to project)
      // Dit is waar het project geld verdient!
      const houseRevenue = pool.entryFee;
      console.log(`💰 Mining pool revenue: ${houseRevenue} sats from pool ${pool.name}`);
      
      // 5. Record house revenue in database
      await tx.houseRevenue.create({
        data: {
          amount: pool.entryFee,
          source: 'MINING_ENTRY_FEE',
          sourceId: poolId.toString(),
          description: `Entry fee from pool: ${pool.name} (${selectedTigers.length} tigers)`,
          date: new Date()
        }
      });
      
      const houseRevenueRecorded = pool.entryFee;
      console.log(`💰 Mining pool revenue recorded: ${houseRevenueRecorded} sats from pool ${pool.name}`);
      
      return {
        poolId,
        tigersAdded: selectedTigers.length,
        entryFeePaid: pool.entryFee,
        houseRevenue,
        newBalance: wallet.balance - pool.entryFee
      };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully joined ${pool.name} with ${selectedTigers.length} tigers!`,
      ...result
    });
  } catch (error) {
    console.error('Error joining pool:', error);
    return NextResponse.json(
      { error: 'Failed to join pool' },
      { status: 500 }
    );
  }
} 