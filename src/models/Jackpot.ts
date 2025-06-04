/**
 * GEEN MONGOOSE HIER - ALLEEN PRISMA
 * Volledig herschreven zonder mongoose afhankelijkheden
 */

// Importeer alleen Prisma client
import { prisma } from '../lib/prisma';

// Basis interface voor Jackpot data
export interface IJackpot {
  id: number;
  balance: number;
  totalContributions: number;
  lastWinner?: string;
  lastWinAmount?: number;
  lastWinDate?: Date;
  lastUpdate: Date;
}

// Jackpot beheer functie
async function getJackpot() {
  try {
    // Haal jackpot op of maak een nieuwe aan als deze niet bestaat
    const jackpot = await prisma?.jackpot.findFirst();
    if (!jackpot) {
      return await prisma?.jackpot.create({
        data: {
          id: 1,
          balance: 250000,
          totalContributions: 0
        }
      });
    }
    return jackpot;
  } catch (error) {
    console.error('Prisma error in getJackpot:', error);
    // Fallback object indien database niet beschikbaar is
    return {
      id: 1,
      balance: 250000,
      totalContributions: 0,
      lastUpdate: new Date()
    };
  }
}

// Eenvoudige export, zonder mongoose
export default {
  getJackpot,
  updateBalance: async (amount: number) => {
    try {
      const jackpot = await getJackpot();
      if (jackpot) {
        await prisma?.jackpot.update({
          where: { id: jackpot.id },
          data: {
            balance: {
              increment: amount
            },
            totalContributions: {
              increment: amount
            },
            lastUpdate: new Date()
          }
        });
      }
      return jackpot;
    } catch (error) {
      console.error('Error updating jackpot balance:', error);
      return null;
    }
  },
  claim: async (walletAddress: string) => {
    try {
      const jackpot = await getJackpot();
      if (!jackpot || jackpot.balance <= 0) return 0;
      
      const amount = jackpot.balance;
      await prisma?.jackpot.update({
        where: { id: jackpot.id },
        data: {
          balance: 0,
          lastWinner: walletAddress,
          lastWinAmount: amount,
          lastWinDate: new Date(),
          lastUpdate: new Date()
        }
      });
      return amount;
    } catch (error) {
      console.error('Error claiming jackpot:', error);
      return 0;
    }
  }
}; 