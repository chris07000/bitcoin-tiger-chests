import { NextRequest, NextResponse } from 'next/server';
import { tigerStakingService, CHEST_PERIOD } from '@/server/services/tigerStakingService';
import { prisma } from '@/lib/prisma';

// Minimale stake tijd voor een chest
const MIN_STAKE_TIME_SECONDS = 10; // Minimaal 10 seconden staking vereist voor een chest

// Extend the TigerChestClaim type to include totalReward
interface ExtendedTigerChestClaim {
  success: boolean;
  satoshisAmount: number;
  totalReward?: number;
  chestRemaining: number;
  claimedAt: number;
  rewardType: string;
  rewards?: number[];
}

export async function POST(
  request: NextRequest
) {
  // Variabelen buiten de try block definiëren zodat ze beschikbaar zijn in de catch block
  let walletAddress: string = '';
  let tigerLevel: number = 1;
  let chestsCount: number = 1;
  let tigerId: string | undefined;
  
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    console.log('Processing chest claim request...');
    
    // Haal de request body op
    const body = await request.json();
    walletAddress = body.walletAddress || '';
    tigerLevel = body.tigerLevel || 1;
    chestsCount = body.chestsCount || 1;
    tigerId = body.tigerId;
    
    // Variabelen voor staking data
    let chestsToAward = chestsCount;
    let stakedTigerId: string | null = null;
    
    console.log(`Claim chest request for wallet: ${walletAddress}, tiger level: ${tigerLevel}, chests: ${chestsCount}, tigerId: ${tigerId || 'not specified'}`);

    // Valideer de request body
    if (!walletAddress) {
      console.log('Error: No wallet address provided in request');
      return NextResponse.json(
        { error: 'Wallet address is required', success: false },
        { status: 400 }
      );
    }

    // Controleer of de wallet bestaat in de database
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });
    
    if (!wallet) {
      console.log(`Wallet ${walletAddress} not found`);
      return NextResponse.json(
        { error: 'Wallet not found', success: false },
        { status: 400 }
      );
    }
    
    // Controleer of er tigers zijn gestaked
    const stakingStatus = await tigerStakingService.getTigerStakingStatus(walletAddress);
    
    if (stakingStatus.totalStaked === 0) {
      console.log(`No staked tigers found for wallet ${walletAddress}`);
      return NextResponse.json(
        { error: 'No staked tigers found', success: false },
        { status: 400 }
      );
    }
    
    // Als een specifieke tiger is opgegeven, controleer of deze beschikbaar is
    if (tigerId) {
      const stakedTiger = await prisma.tigerStaking.findFirst({
        where: {
          walletId: wallet.id,
          tigerId: tigerId,
          isActive: true
        }
      });
        
      if (!stakedTiger) {
          console.log(`Tiger ${tigerId} not found in staked tigers`);
          return NextResponse.json(
            { error: 'Tiger not found or not staked', success: false },
            { status: 400 }
          );
        }
        
        // Controleer hoe lang de tiger gestaked is
      const stakedAt = stakedTiger.stakedAt.getTime();
        const currentTime = Date.now();
        const secondsSinceStaked = (currentTime - stakedAt) / 1000;
        
        console.log(`Tiger ${tigerId} was staked at ${new Date(stakedAt).toISOString()}`);
        console.log(`Current time is ${new Date(currentTime).toISOString()}`);
        console.log(`Tiger ${tigerId} has been staked for ${secondsSinceStaked.toFixed(1)} seconds`);
        console.log(`Minimum required staking time: ${MIN_STAKE_TIME_SECONDS} seconds`);
        
        if (secondsSinceStaked < MIN_STAKE_TIME_SECONDS) {
          console.log(`REJECTION: Tiger ${tigerId} has not been staked long enough (${secondsSinceStaked.toFixed(1)}s < ${MIN_STAKE_TIME_SECONDS}s)`);
          return NextResponse.json(
            { 
              error: `Tiger must be staked for at least ${MIN_STAKE_TIME_SECONDS} seconds before claiming (${Math.ceil(MIN_STAKE_TIME_SECONDS - secondsSinceStaked)}s remaining)`,
              success: false,
              timeRemaining: Math.ceil(MIN_STAKE_TIME_SECONDS - secondsSinceStaked)
            },
            { status: 403 }
          );
        }
        
        // Controleer of de nextChestAt tijd is bereikt
      const nextChestAt = stakedTiger.nextChestAt.getTime();
        if (currentTime < nextChestAt) {
          const timeRemaining = Math.ceil((nextChestAt - currentTime) / 1000);
          console.log(`REJECTION: Chest for tiger ${tigerId} not ready yet (${timeRemaining}s remaining)`);
          return NextResponse.json(
            {
              error: `Chest for this tiger is not ready yet (${timeRemaining}s remaining)`,
              success: false,
              timeRemaining: timeRemaining
            },
            { status: 403 }
          );
        }
        
        console.log(`APPROVED: Tiger ${tigerId} has been staked long enough (${secondsSinceStaked.toFixed(1)}s >= ${MIN_STAKE_TIME_SECONDS}s)`);
        
        // Sla tigerStake ID op voor later gebruik
        chestsToAward = tigerLevel; // Gebruik de chestsCount/tigerLevel die als parameter is meegegeven
        stakedTigerId = tigerId; // Gebruik de meegegeven tigerId als ID
    }

    try {
      // Claim chest via de service of gebruik de fallback
      console.log(`Claiming chest for wallet: ${walletAddress} with level ${tigerLevel} (${chestsCount} chests)`);
      let result;
      
      try {
        result = await tigerStakingService.claimChest(walletAddress);
        
        // If we received tiger level and chests count, apply multiplier
        if (result.success && result.satoshisAmount > 0) {
          // Determine reward type if it's missing
          if (!(result as ExtendedTigerChestClaim).rewardType) {
            const baseReward = result.satoshisAmount;
            if (baseReward >= 25000) {
              (result as ExtendedTigerChestClaim).rewardType = "JACKPOT";
            } else if (baseReward >= 10000) {
              (result as ExtendedTigerChestClaim).rewardType = "HIGH_ROLL";
            } else {
              (result as ExtendedTigerChestClaim).rewardType = "LOW_ROLL";
            }
            console.log(`Determined reward type: ${(result as ExtendedTigerChestClaim).rewardType} based on amount: ${baseReward}`);
          }
          
          // Apply multiplier for tiger level
          const baseReward = result.satoshisAmount;
          let totalReward = baseReward;
          
          // Generate separate rewards for each additional chest instead of multiplying
          if (chestsCount > 1) {
            console.log(`Generating separate rewards for ${chestsCount} chests...`);
            
            // Store all generated rewards
            const allRewards = [baseReward];
            
            // Generate a separate reward for each additional chest
            for (let i = 1; i < chestsCount; i++) {
              // Create a different entropy for each chest
              const chestSpecificEntropy = (Date.now() ^ Math.random() * 100000 ^ walletAddress.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0) ^ i) % 10000;
              let chestRandomValue = Math.abs((Math.sin(chestSpecificEntropy) * 10000) % 100);
              chestRandomValue = Math.min(99.99, Math.max(0, chestRandomValue));
              
              let chestReward: number;
              let chestRewardType: string;
              
              if (chestRandomValue < 0.001) {
                // 0.001% kans op jackpot (15.000-30.000 sats) - EXTREMELY RARE
                const jackpotBase = Math.abs(Math.sin((Date.now() + i) * walletAddress.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) * 15000);
                chestReward = Math.floor(jackpotBase + 15000);
                chestRewardType = "JACKPOT";
                console.log(`JACKPOT HIT for chest #${i+1}! Value ${chestRandomValue} < 0.001`);
              } else if (chestRandomValue < 0.01) {
                // 0.009% kans op high roll (5.000-15.000 sats) - VERY RARE
                const highRollBase = Math.abs(Math.cos((Date.now() + i) * Math.random() * 10000) * 10000);
                chestReward = Math.floor(highRollBase + 5000);
                chestRewardType = "HIGH_ROLL";
                console.log(`HIGH ROLL for chest #${i+1}! Value ${chestRandomValue} < 0.01`);
              } else {
                // 99.99% kans op low roll (1.000-5.000 sats) - NORMAL
                const lowRollBase = Math.abs(Math.tan(chestSpecificEntropy) * 4000);
                chestReward = Math.floor(lowRollBase + 1000);
                chestRewardType = "LOW_ROLL";
                console.log(`LOW ROLL for chest #${i+1}: Value ${chestRandomValue} >= 0.01`);
              }
              
              allRewards.push(chestReward);
              totalReward += chestReward;
            }
            
            console.log(`Generated ${chestsCount} separate rewards: ${allRewards.join(', ')} = ${totalReward} sats total`);
            
            // Add the total reward and individual rewards to the result
            (result as ExtendedTigerChestClaim).totalReward = totalReward;
            (result as ExtendedTigerChestClaim).rewards = allRewards;
          } else {
            // Single chest, still set the rewards array
            (result as ExtendedTigerChestClaim).rewards = [baseReward];
          }
        }
      } catch (serviceError) {
        console.log('Error from tigerStakingService, using fallback reward generation');
        
        // Improved randomization with multiple entropy sources
        // Use a combination of current time, random values, and wallet-specific data for true randomness
        const timestamp = Date.now();
        const randomSeed = Math.random() * 100000;
        const walletHash = walletAddress.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
        
        // Create a combined entropy source by mixing multiple values
        // IMPORTANT: Use absolute value to ensure it's always positive
        const combinedEntropy = (timestamp ^ randomSeed ^ walletHash) % 10000;
        let randomValue = Math.abs((Math.sin(combinedEntropy) * 10000) % 100);
        
        // Ensure the value is between 0 and 100 for percentage calculations
        randomValue = Math.min(99.99, Math.max(0, randomValue));
        
        console.log(`Generated random value using improved entropy: ${randomValue.toFixed(6)} (ensured positive)`);
        
        // Genereer een willekeurige beloning op basis van de kansen:
        // 99.99% low roll, 0.009% high roll, 0.001% jackpot
        let satoshisAmount;
        let rewardType;
        
        if (randomValue < 0.001) {
          // 0.001% kans op jackpot (15.000-30.000 sats) - EXTREMELY RARE
          const jackpotBase = Math.abs(Math.sin(timestamp * walletHash) * 15000);
          satoshisAmount = Math.floor(jackpotBase + 15000);
          rewardType = "JACKPOT";
          console.log(`JACKPOT HIT! Value ${randomValue} < 0.001`);
        } else if (randomValue < 0.01) {
          // 0.009% kans op high roll (5.000-15.000 sats) - VERY RARE
          const highRollBase = Math.abs(Math.cos(timestamp * randomSeed) * 10000);
          satoshisAmount = Math.floor(highRollBase + 5000);
          rewardType = "HIGH_ROLL";
          console.log(`HIGH ROLL! Value ${randomValue} < 0.01`);
        } else {
          // 99.99% kans op low roll (1.000-5.000 sats) - NORMAL
          const lowRollBase = Math.abs(Math.tan(combinedEntropy) * 4000);
          satoshisAmount = Math.floor(lowRollBase + 1000);
          rewardType = "LOW_ROLL";
          console.log(`LOW ROLL: Value ${randomValue} >= 0.01`);
        }
        
        // Apply multiplier for tiger level
        const baseReward = satoshisAmount;
        let totalReward = baseReward;
        // Initialize an array to store all individual rewards
        const allRewards = [baseReward];
        
        // Generate separate rewards for each additional chest instead of multiplying
        if (chestsCount > 1) {
          console.log(`Generating separate rewards for ${chestsCount} chests...`);
          
          // Generate a separate reward for each additional chest
          for (let i = 1; i < chestsCount; i++) {
            // Create a different entropy for each chest
            const chestSpecificEntropy = (timestamp ^ randomSeed ^ walletHash ^ i) % 10000;
            let chestRandomValue = Math.abs((Math.sin(chestSpecificEntropy) * 10000) % 100);
            chestRandomValue = Math.min(99.99, Math.max(0, chestRandomValue));
            
            let chestReward: number;
            let chestRewardType: string;
            
            if (chestRandomValue < 0.001) {
              // 0.001% kans op jackpot (15.000-30.000 sats) - EXTREMELY RARE
              const jackpotBase = Math.abs(Math.sin((timestamp + i) * walletHash) * 15000);
              chestReward = Math.floor(jackpotBase + 15000);
              chestRewardType = "JACKPOT";
              console.log(`JACKPOT HIT for chest #${i+1}! Value ${chestRandomValue} < 0.001`);
            } else if (chestRandomValue < 0.01) {
              // 0.009% kans op high roll (5.000-15.000 sats) - VERY RARE
              const highRollBase = Math.abs(Math.cos((timestamp + i) * randomSeed) * 10000);
              chestReward = Math.floor(highRollBase + 5000);
              chestRewardType = "HIGH_ROLL";
              console.log(`HIGH ROLL for chest #${i+1}! Value ${chestRandomValue} < 0.01`);
            } else {
              // 99.99% kans op low roll (1.000-5.000 sats) - NORMAL
              const lowRollBase = Math.abs(Math.tan(chestSpecificEntropy) * 4000);
              chestReward = Math.floor(lowRollBase + 1000);
              chestRewardType = "LOW_ROLL";
              console.log(`LOW ROLL for chest #${i+1}: Value ${chestRandomValue} >= 0.01`);
            }
            
            allRewards.push(chestReward);
            totalReward += chestReward;
          }
          
          console.log(`Generated ${chestsCount} separate rewards: ${allRewards.join(', ')} = ${totalReward} sats total`);
        }
        
        console.log(`⚡ Generated total reward of ${totalReward} sats for ${chestsCount} chests for wallet ${walletAddress}`);
        
        result = {
          success: true,
          satoshisAmount: baseReward,
          totalReward: totalReward,
          chestRemaining: 0,
          claimedAt: Date.now(),
          rewardType,
          rewards: allRewards // Include all individual rewards
        } as ExtendedTigerChestClaim;
        
        // Als de claim succesvol was, update de wallet balance in de database
        // Update de nextChestAt datum van één van de tigers
        try {
          const stakedTigers = await prisma.tigerStaking.findMany({
            where: {
              walletId: wallet.id,
              isActive: true,
              nextChestAt: {
                lte: new Date()
              }
            },
            orderBy: {
              nextChestAt: 'asc'
            },
            take: 1
          });
          
          if (stakedTigers.length > 0) {
            const tigerToUpdate = stakedTigers[0];
            
            // Update de nextChestAt datum
            await prisma.tigerStaking.update({
              where: {
                id: tigerToUpdate.id
              },
              data: {
                nextChestAt: new Date(Date.now() + CHEST_PERIOD) // Gebruik CHEST_PERIOD in plaats van harde waarde
              }
            });
            
            console.log(`Updated nextChestAt for tiger ${tigerToUpdate.tigerId} to ${CHEST_PERIOD/1000} seconds from now`);
          }
        } catch (updateError) {
          console.log('Error updating tiger nextChestAt:', updateError);
        }
      }
      
    console.log('Chest claim result:', result);
      
      // Als de claim succesvol was, update de wallet balance in de database
      if (result.success) {
        try {
          // Controleer of de balans al is bijgewerkt door de service
          if (!(result as any).balanceUpdated) {
            // Get the reward amount (prefer totalReward if available)
            const rewardAmount = (result as ExtendedTigerChestClaim).totalReward || result.satoshisAmount || 0;
            
            // Update wallet balance
            await prisma.wallet.update({
              where: { id: wallet.id },
              data: {
                balance: { increment: rewardAmount },
                updatedAt: new Date()
              }
            });
            
            // Maak transactie record
            await prisma.transaction.create({
              data: {
                id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                amount: rewardAmount,
                walletId: wallet.id,
                type: "CHEST",
                status: 'COMPLETED'
              }
            });
            
            // Registreer de claim
            await prisma.tigerChestClaim.create({
              data: {
                id: `claim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                walletId: wallet.id,
                tigerId: tigerId || 'unknown',
                stakedId: stakedTigerId || undefined,
                amount: rewardAmount,
                rewardType: (result as ExtendedTigerChestClaim).rewardType || 'LOW_ROLL'
              }
            });
            
            console.log(`⚡ Updated wallet balance and created transaction record for ${rewardAmount} sats`);
            console.log(`⚡ User ${walletAddress} now has ${wallet.balance + rewardAmount} sats total`);
          } else {
            console.log('⚡ Balance already updated by tigerStakingService.claimChest, skipping duplicate update');
          }
        } catch (dbError) {
          console.log('Error updating wallet balance:', dbError);
        }
    }

    // Return het resultaat
    return NextResponse.json(result);
    } catch (error: any) {
      console.log('Error processing chest claim:', error);
      
      // Use the same improved randomization method as above
      const timestamp = Date.now();
      const randomSeed = Math.random() * 100000;
      const walletHash = walletAddress.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
      
      const combinedEntropy = (timestamp ^ randomSeed ^ walletHash) % 10000;
      let randomValue = Math.abs((Math.sin(combinedEntropy) * 10000) % 100);
      
      // Ensure the value is between 0 and 100 for percentage calculations
      randomValue = Math.min(99.99, Math.max(0, randomValue));
      
      console.log(`Generated random value for error fallback: ${randomValue.toFixed(6)} (ensured positive)`);
      
      let satoshisAmount;
      let rewardType;
      
      if (randomValue < 0.001) {
        // 0.001% kans op jackpot (15.000-30.000 sats) - EXTREMELY RARE
        const jackpotBase = Math.abs(Math.sin(timestamp * walletHash) * 15000);
        satoshisAmount = Math.floor(jackpotBase + 15000);
        rewardType = "JACKPOT";
        console.log(`JACKPOT HIT in error fallback! Value ${randomValue} < 0.001`);
      } else if (randomValue < 0.01) {
        // 0.009% kans op high roll (5.000-15.000 sats) - VERY RARE
        const highRollBase = Math.abs(Math.cos(timestamp * randomSeed) * 10000);
        satoshisAmount = Math.floor(highRollBase + 5000);
        rewardType = "HIGH_ROLL";
        console.log(`HIGH ROLL in error fallback! Value ${randomValue} < 0.01`);
      } else {
        // 99.99% kans op low roll (1.000-5.000 sats) - NORMAL
        const lowRollBase = Math.abs(Math.tan(combinedEntropy) * 4000);
        satoshisAmount = Math.floor(lowRollBase + 1000);
        rewardType = "LOW_ROLL";
        console.log(`LOW ROLL in error fallback: Value ${randomValue} >= 0.01`);
      }
      
      // Apply multiplier for tiger level if provided
      const baseReward = satoshisAmount;
      let totalReward = baseReward;
      let allRewards = [baseReward];
      
      // Generate separate rewards for each additional chest instead of multiplying
      if (chestsCount > 1) {
        console.log(`Generating separate rewards for ${chestsCount} chests...`);
        
        // Generate a separate reward for each additional chest
        for (let i = 1; i < chestsCount; i++) {
          // Create a different entropy for each chest
          const chestSpecificEntropy = (timestamp ^ randomSeed ^ walletHash ^ i) % 10000;
          let chestRandomValue = Math.abs((Math.sin(chestSpecificEntropy) * 10000) % 100);
          chestRandomValue = Math.min(99.99, Math.max(0, chestRandomValue));
          
          let chestReward: number;
          let chestRewardType: string;
          
          if (chestRandomValue < 0.001) {
            // 0.001% kans op jackpot (15.000-30.000 sats) - EXTREMELY RARE
            const jackpotBase = Math.abs(Math.sin((timestamp + i) * walletHash) * 15000);
            chestReward = Math.floor(jackpotBase + 15000);
            chestRewardType = "JACKPOT";
            console.log(`JACKPOT HIT for chest #${i+1} in error fallback! Value ${chestRandomValue} < 0.001`);
          } else if (chestRandomValue < 0.01) {
            // 0.009% kans op high roll (5.000-15.000 sats) - VERY RARE
            const highRollBase = Math.abs(Math.cos((timestamp + i) * randomSeed) * 10000);
            chestReward = Math.floor(highRollBase + 5000);
            chestRewardType = "HIGH_ROLL";
            console.log(`HIGH ROLL in error fallback! Value ${chestRandomValue} < 0.01`);
          } else {
            // 99.99% kans op low roll (1.000-5.000 sats) - NORMAL
            const lowRollBase = Math.abs(Math.tan(chestSpecificEntropy) * 4000);
            chestReward = Math.floor(lowRollBase + 1000);
            chestRewardType = "LOW_ROLL";
            console.log(`LOW ROLL in error fallback: Value ${chestRandomValue} >= 0.01`);
          }
          
          allRewards.push(chestReward);
          totalReward += chestReward;
        }
        
        console.log(`Generated ${chestsCount} separate rewards: ${allRewards.join(', ')} = ${totalReward} sats total`);
      }
      
      // Maak een result object aan voor de return
      const result = {
        success: true,
        satoshisAmount: baseReward,
        totalReward: totalReward,
        chestRemaining: 0,
        claimedAt: Date.now(),
        rewardType,
        rewards: allRewards // Include all individual rewards
      } as ExtendedTigerChestClaim;
      
      // Return het resultaat
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.log('Error processing chest claim:', error);
    
    // Use the same improved randomization method as above
    const timestamp = Date.now();
    const randomSeed = Math.random() * 100000;
    const walletHash = walletAddress.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
    
    const combinedEntropy = (timestamp ^ randomSeed ^ walletHash) % 10000;
    let randomValue = Math.abs((Math.sin(combinedEntropy) * 10000) % 100);
    
    // Ensure the value is between 0 and 100 for percentage calculations
    randomValue = Math.min(99.99, Math.max(0, randomValue));
    
    console.log(`Generated random value for error fallback: ${randomValue.toFixed(6)} (ensured positive)`);
    
    let satoshisAmount;
    let rewardType;
    
    if (randomValue < 0.001) {
      // 0.001% kans op jackpot (15.000-30.000 sats) - EXTREMELY RARE
      const jackpotBase = Math.abs(Math.sin(timestamp * walletHash) * 15000);
      satoshisAmount = Math.floor(jackpotBase + 15000);
      rewardType = "JACKPOT";
      console.log(`JACKPOT HIT in error fallback! Value ${randomValue} < 0.001`);
    } else if (randomValue < 0.01) {
      // 0.009% kans op high roll (5.000-15.000 sats) - VERY RARE
      const highRollBase = Math.abs(Math.cos(timestamp * randomSeed) * 10000);
      satoshisAmount = Math.floor(highRollBase + 5000);
      rewardType = "HIGH_ROLL";
      console.log(`HIGH ROLL in error fallback! Value ${randomValue} < 0.01`);
    } else {
      // 99.99% kans op low roll (1.000-5.000 sats) - NORMAL
      const lowRollBase = Math.abs(Math.tan(combinedEntropy) * 4000);
      satoshisAmount = Math.floor(lowRollBase + 1000);
      rewardType = "LOW_ROLL";
      console.log(`LOW ROLL in error fallback: Value ${randomValue} >= 0.01`);
    }
    
    // Apply multiplier for tiger level if provided
    const baseReward = satoshisAmount;
    let totalReward = baseReward;
    let allRewards = [baseReward];
    
    // Generate separate rewards for each additional chest instead of multiplying
    if (chestsCount > 1) {
      console.log(`Generating separate rewards for ${chestsCount} chests...`);
      
      // Generate a separate reward for each additional chest
      for (let i = 1; i < chestsCount; i++) {
        // Create a different entropy for each chest
        const chestSpecificEntropy = (timestamp ^ randomSeed ^ walletHash ^ i) % 10000;
        let chestRandomValue = Math.abs((Math.sin(chestSpecificEntropy) * 10000) % 100);
        chestRandomValue = Math.min(99.99, Math.max(0, chestRandomValue));
        
        let chestReward: number;
        let chestRewardType: string;
        
        if (chestRandomValue < 0.001) {
          // 0.001% kans op jackpot (15.000-30.000 sats) - EXTREMELY RARE
          const jackpotBase = Math.abs(Math.sin((timestamp + i) * walletHash) * 15000);
          chestReward = Math.floor(jackpotBase + 15000);
          chestRewardType = "JACKPOT";
          console.log(`JACKPOT HIT for chest #${i+1} in error fallback! Value ${chestRandomValue} < 0.001`);
        } else if (chestRandomValue < 0.01) {
          // 0.009% kans op high roll (5.000-15.000 sats) - VERY RARE
          const highRollBase = Math.abs(Math.cos((timestamp + i) * randomSeed) * 10000);
          chestReward = Math.floor(highRollBase + 5000);
          chestRewardType = "HIGH_ROLL";
          console.log(`HIGH ROLL in error fallback! Value ${chestRandomValue} < 0.01`);
        } else {
          // 99.99% kans op low roll (1.000-5.000 sats) - NORMAL
          const lowRollBase = Math.abs(Math.tan(chestSpecificEntropy) * 4000);
          chestReward = Math.floor(lowRollBase + 1000);
          chestRewardType = "LOW_ROLL";
          console.log(`LOW ROLL in error fallback: Value ${chestRandomValue} >= 0.01`);
        }
        
        allRewards.push(chestReward);
        totalReward += chestReward;
      }
      
      console.log(`Generated ${chestsCount} separate rewards: ${allRewards.join(', ')} = ${totalReward} sats total`);
    }
    
    // Maak een result object aan voor de return
    const result = {
      success: true,
      satoshisAmount: baseReward,
      totalReward: totalReward,
      chestRemaining: 0,
      claimedAt: Date.now(),
      rewardType,
      rewards: allRewards // Include all individual rewards
    } as ExtendedTigerChestClaim;
    
    // Return het resultaat
    return NextResponse.json(result);
  }
} 