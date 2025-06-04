import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JackpotModel from '@/models/Jackpot';

const INITIAL_JACKPOT = 250000;

export async function POST() {
  try {
    await connectDB();
    
    const jackpot = await JackpotModel.findOne();
    if (!jackpot) {
      return NextResponse.json(
        { error: 'Jackpot not found' },
        { status: 404 }
      );
    }

    // Reset jackpot to 250k + current contribution
    const currentContribution = jackpot.balance - (jackpot.lastWinAmount || 0);
    jackpot.balance = INITIAL_JACKPOT + currentContribution;
    jackpot.lastUpdate = new Date();
    await jackpot.save();

    return NextResponse.json({
      message: 'Jackpot reset successfully',
      newBalance: jackpot.balance
    });

  } catch (error) {
    console.error('Error resetting jackpot:', error);
    return NextResponse.json(
      { error: 'Failed to reset jackpot' },
      { status: 500 }
    );
  }
} 