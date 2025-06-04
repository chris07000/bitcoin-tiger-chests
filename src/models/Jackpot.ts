import { prisma } from '../lib/prisma';

export interface IJackpot {
  id: number;
  balance: number;
  totalContributions: number;
  lastWinner?: string;
  lastWinAmount?: number;
  lastWinDate?: Date;
  lastUpdate: Date;
  walletId?: string;
}

// Helper functie om de jackpot bij te werken
export async function updateJackpotBalance(amount: number) {
  const jackpot = await prisma?.jackpot.findFirst();
  
  if (!jackpot) {
    return await prisma?.jackpot.create({
      data: { 
        balance: amount,
        totalContributions: amount
      }
    });
  }
  
  return await prisma?.jackpot.update({
    where: { id: jackpot.id },
    data: { 
      balance: { increment: amount },
      totalContributions: { increment: amount }
    }
  });
}

// Helper functie om de jackpot te claimen
export async function claimJackpot(walletAddress: string) {
  const jackpot = await prisma?.jackpot.findFirst();
  
  if (!jackpot || jackpot.balance <= 0) {
    throw new Error('No jackpot to claim');
  }

  const winAmount = jackpot.balance;
  
  await prisma?.jackpot.update({
    where: { id: jackpot.id },
    data: {
      balance: 0,
      lastWinner: walletAddress,
      lastWinAmount: winAmount,
      lastWinDate: new Date(),
      lastUpdate: new Date()
    }
  });
  
  return winAmount;
}

// Helper functie om de huidige jackpot te krijgen
export async function getJackpot() {
  let jackpot = await prisma?.jackpot.findFirst();
  
  if (!jackpot) {
    jackpot = await prisma?.jackpot.create({
      data: {
        balance: 0,
        totalContributions: 0
      }
    });
  }
  
  return jackpot;
}

// Default export voor compatibiliteit
export default {
  updateBalance: updateJackpotBalance,
  claim: claimJackpot,
  get: getJackpot
}; 