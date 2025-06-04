import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionStatus, TransactionType, Prisma } from '@/generated/prisma-client';
import { updateUserRanking } from '@/lib/ranking';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const INITIAL_JACKPOT = 250000; // Basis jackpot bedrag

export async function POST(request: Request) {
  try {
    const { walletAddress, chestType, joinJackpot, isFree } = await request.json();

    if (!walletAddress || !chestType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if prisma is available
    if (!prisma) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Haal de wallet op
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Bepaal de chest kosten en kansen
    const chestConfig = {
      bronze: { cost: 5000, jackpotFee: 1000, minReward: 2000, maxReward: 15000, jackpotContribution: 200 },
      silver: { cost: 20000, jackpotFee: 2500, minReward: 12000, maxReward: 60000, jackpotContribution: 500 },
      gold: { cost: 50000, jackpotFee: 5000, minReward: 30000, maxReward: 150000, jackpotContribution: 1000 }
    };

    const config = chestConfig[chestType as keyof typeof chestConfig];
    if (!config) {
      return NextResponse.json(
        { error: 'Invalid chest type' },
        { status: 400 }
      );
    }

    // Bereken de totale kosten
    const totalCost = config.cost + (joinJackpot ? config.jackpotFee : 0);

    // Controleer of er voldoende saldo is (skip voor gratis kisten)
    if (!isFree && wallet.balance < totalCost) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Bereken de beloning
    const getPrizeAmount = () => {
      const rand = Math.random();
      
      if (chestType === 'bronze') {
        if (rand < 0.47) return 2000 + Math.floor(Math.random() * (4499 - 2000 + 1));  // 47.0%: 2000-4499 (Loss)
        if (rand < 0.92) return 4500 + Math.floor(Math.random() * (5500 - 4500 + 1));  // 45.0%: 4500-5500 (Break-even)
        if (rand < 0.99) return 5501 + Math.floor(Math.random() * (8000 - 5501 + 1));  // 7.0%: 5501-8000 (Small-win)
        if (rand < 0.995) return 8001 + Math.floor(Math.random() * (12000 - 8001 + 1)); // 0.5%: 8001-12000 (Win)
        return 12001 + Math.floor(Math.random() * (15000 - 12001 + 1));                // 0.5%: 12001-15000 (Mega)
      }
      
      if (chestType === 'silver') {
        if (rand < 0.48) return 12000 + Math.floor(Math.random() * (17999 - 12000 + 1));  // 48.0%: 12000-17999 (Loss)
        if (rand < 0.925) return 18000 + Math.floor(Math.random() * (22000 - 18000 + 1));  // 44.5%: 18000-22000 (Break-even)
        if (rand < 0.985) return 22001 + Math.floor(Math.random() * (40000 - 22001 + 1));  // 6.0%: 22001-40000 (Small-win)
        if (rand < 0.9925) return 40001 + Math.floor(Math.random() * (50000 - 40001 + 1)); // 0.75%: 40001-50000 (Win)
        return 50001 + Math.floor(Math.random() * (60000 - 50001 + 1));                   // 0.75%: 50001-60000 (Mega)
      }
      
      // Gold chest
      if (rand < 0.49) return 30000 + Math.floor(Math.random() * (44999 - 30000 + 1));  // 49.0%: 30000-44999 (Loss)
      if (rand < 0.92) return 45000 + Math.floor(Math.random() * (55000 - 45000 + 1));  // 43.0%: 45000-55000 (Break-even)
      if (rand < 0.97) return 55001 + Math.floor(Math.random() * (80000 - 55001 + 1));  // 5.0%: 55001-80000 (Small-win)
      if (rand < 0.98) return 80001 + Math.floor(Math.random() * (100000 - 80001 + 1)); // 1.0%: 80001-100000 (Win)
      if (rand < 0.99) return 100001 + Math.floor(Math.random() * (125000 - 100001 + 1)); // 1.0%: 100001-125000 (Upper-win)
      return 125001 + Math.floor(Math.random() * (150000 - 125001 + 1));               // 1.0%: 125001-150000 (Mega)
    };

    const reward = getPrizeAmount();
    let isJackpotWin = false;
    let jackpotAmount = 0;

    // Start een database transactie voor alle updates
    const result = await prisma.$transaction(async (tx) => {
      console.log('Starting balance:', wallet.balance);
      console.log('Total cost:', totalCost);
      console.log('Reward:', reward);

      // Check initial wallet state
      const initialWallet = await tx.wallet.findUnique({
        where: { id: wallet.id }
      });
      console.log('Initial wallet state in transaction:', initialWallet);

      // Trek de kosten af als het geen gratis kist is
      let currentWalletBalance = initialWallet?.balance || wallet.balance;
      
      if (!isFree) {
        // Eerst de kosten transactie
        await tx.transaction.create({
          data: {
            id: uuidv4(), // Unieke ID genereren
            type: TransactionType.CHEST,
            amount: -totalCost,
            paymentHash: `chest-cost-${Date.now()}`,
            walletId: wallet.id,
            status: TransactionStatus.COMPLETED
          },
        });

        // Update het saldo direct na de kosten
        const updatedWalletAfterCost = await tx.wallet.update({
          where: { id: wallet.id },
          data: { 
            balance: currentWalletBalance - totalCost,
            updatedAt: new Date()
          },
        });
        console.log('Wallet after cost deduction:', updatedWalletAfterCost);
        currentWalletBalance = updatedWalletAfterCost.balance;
      }

      // Voeg de reward toe
      await tx.transaction.create({
        data: {
          id: uuidv4(), // Unieke ID genereren
          type: TransactionType.CHEST,
          amount: reward,
          paymentHash: `chest-reward-${Date.now()}`,
          walletId: wallet.id,
          status: TransactionStatus.COMPLETED
        },
      });

      // Update het saldo voor de reward
      const updatedWalletAfterReward = await tx.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: currentWalletBalance + reward,
          updatedAt: new Date()
        },
      });
      console.log('Wallet after reward addition:', updatedWalletAfterReward);
      currentWalletBalance = updatedWalletAfterReward.balance;

      // Update de jackpot
      if (joinJackpot) {
        const jackpot = await tx.jackpot.upsert({
          where: { id: 1 },
          update: {
            balance: {
              increment: config.jackpotContribution
            },
            totalContributions: {
              increment: config.jackpotContribution
            },
            lastUpdate: new Date()
          },
          create: {
            id: 1,
            balance: INITIAL_JACKPOT + config.jackpotContribution,
            totalContributions: config.jackpotContribution,
            lastUpdate: new Date()
          }
        });

        if (jackpot.totalContributions >= 250000) {
          isJackpotWin = Math.random() < 0.01;
        }

        if (isJackpotWin) {
          jackpotAmount = jackpot.balance;
          
          // Update het saldo voor de jackpot winst
          const updatedWalletAfterJackpot = await tx.wallet.update({
            where: { id: wallet.id },
            data: { 
              balance: currentWalletBalance + jackpotAmount,
              updatedAt: new Date()
            },
          });
          console.log('Wallet after jackpot win:', updatedWalletAfterJackpot);
          currentWalletBalance = updatedWalletAfterJackpot.balance;
          
          await tx.jackpot.update({
            where: { id: 1 },
            data: {
              lastWinner: walletAddress,
              lastWinAmount: jackpot.balance,
              balance: INITIAL_JACKPOT + config.jackpotContribution,
              totalContributions: config.jackpotContribution,
              lastUpdate: new Date()
            }
          });

          await tx.transaction.create({
            data: {
              id: uuidv4(), // Unieke ID genereren
              type: TransactionType.JACKPOT,
              amount: jackpotAmount,
              paymentHash: `jackpot-win-${Date.now()}`,
              walletId: wallet.id,
              status: TransactionStatus.COMPLETED
            },
          });
        }
      }

      // Haal het laatste saldo op
      const updatedWallet = await tx.wallet.findUnique({
        where: { id: wallet.id }
      });

      return {
        wallet: updatedWallet || wallet,
        reward,
        isJackpotWin,
        jackpotAmount
      };
    });

    // Zorg voor fallback naar oorspronkelijke wallet als result.wallet null is
    const finalWallet = result?.wallet || wallet;
    
    console.log('Returning balance:', finalWallet.balance);
    console.log('Final transaction result:', {
      startingBalance: wallet.balance,
      cost: totalCost,
      reward: result.reward,
      isJackpotWin: result.isJackpotWin,
      jackpotAmount: result.jackpotAmount || 0,
      finalBalance: finalWallet.balance
    });

    // Update user ranking with the chest wager
    if (!isFree) {
      try {
        await updateUserRanking(
          walletAddress, 
          config.cost, 
          'CHEST', 
          result.reward > config.cost // Counts as won if reward is greater than cost
        );
      } catch (rankingError) {
        console.error('Error updating user ranking:', rankingError);
        // Continue without ranking update if it fails
      }
    } else {
      // Als het een free chest is, update dan de chest progress
      try {
        console.log('==========================================');
        console.log('UPDATING CHEST PROGRESS FOR FREE CHEST DEBUG');
        console.log(`Chest type: ${chestType}`);
        console.log(`Wallet address: ${walletAddress}`);
        
        // Haal de huidige chest progress op
        const walletWithProgress = await prisma.wallet.findUnique({
          where: { address: walletAddress },
          include: { ChestProgress: true }
        });
        
        console.log('Wallet found:', walletWithProgress ? 'YES' : 'NO');
        console.log('Wallet ID:', walletWithProgress?.id);
        console.log('ChestProgress found:', walletWithProgress?.ChestProgress ? 'YES' : 'NO');
        
        if (!walletWithProgress) {
          console.error(`Wallet not found for address ${walletAddress}`);
          throw new Error('Wallet not found');
        }
        
        // Als ChestProgress bestaat, update het
        if (walletWithProgress?.ChestProgress) {
          // Update de opened counter voor dit type chest
          const progressField = `${chestType}Opened`;
          const currentValue = walletWithProgress.ChestProgress[progressField as keyof typeof walletWithProgress.ChestProgress];
          
          console.log(`Current value for ${progressField}: ${currentValue}`);
          
          if (typeof currentValue === 'number') {
            // Update de chest progress
            console.log(`Updating ${progressField} from ${currentValue} to ${currentValue + 1}`);
            
            try {
              const updatedProgress = await prisma.chestProgress.update({
                where: { id: walletWithProgress.ChestProgress.id },
                data: {
                  [progressField]: currentValue + 1,
                  updatedAt: new Date()
                }
              });
              
              console.log('ChestProgress update successful');
              console.log('Updated ChestProgress:', updatedProgress);
            } catch (updateError) {
              console.error('ERROR UPDATING CHESTPROGRESS:', updateError);
              throw updateError;
            }
          } else {
            console.error(`Field ${progressField} is not a number:`, currentValue);
          }
        } else {
          // Als er geen ChestProgress bestaat, maak een nieuwe aan
          console.log('No ChestProgress found for wallet, creating one now with UUID');
          
          // Maak een default ChestProgress met een UUID
          const defaultProgress = {
            bronzeOpened: 0,
            silverOpened: 0,
            goldOpened: 0,
            nextBronzeReward: 50,
            nextSilverReward: 50,
            nextGoldReward: 50
          };
          
          // Update de juiste teller voor dit type
          defaultProgress[`${chestType}Opened` as keyof typeof defaultProgress] = 1;
          console.log(`Creating new ChestProgress with ${chestType}Opened=1`);
          
          // Gebruik de uuid() functie van Prisma
          try {
            const newChestProgress = await prisma.chestProgress.create({
              data: {
                id: crypto.randomUUID(), // Gebruik Node's native UUID generator
                walletId: walletWithProgress.id,
                ...defaultProgress,
                updatedAt: new Date()
              }
            });
            
            console.log('ChestProgress creation successful');
            console.log('New ChestProgress:', newChestProgress);
          } catch (createError) {
            console.error('ERROR CREATING CHESTPROGRESS:', createError);
            throw createError;
          }
        }
        console.log('==========================================');
      } catch (progressError) {
        console.error('Error updating chest progress for free chest:', progressError);
        // Continue without progress update if it fails
      }
    }

    return NextResponse.json({
      reward: result.reward,
      isJackpotWin: result.isJackpotWin,
      jackpotAmount: result.jackpotAmount,
      balance: finalWallet.balance
    });

  } catch (error) {
    console.error('Error opening chest:', error);
    return NextResponse.json(
      { error: 'Failed to open chest', details: String(error) },
      { status: 500 }
    );
  }
} 