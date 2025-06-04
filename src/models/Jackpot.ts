import mongoose, { Schema, Document } from 'mongoose';

export interface IJackpot extends Document {
  balance: number;
  totalContributions: number;
  lastWinner?: string;
  lastWinAmount?: number;
  lastWinDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JackpotSchema: Schema = new Schema({
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  totalContributions: {
    type: Number,
    required: true,
    default: 0
  },
  lastWinner: {
    type: String,
    required: false
  },
  lastWinAmount: {
    type: Number,
    required: false
  },
  lastWinDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Statische methode om de jackpot bij te werken
JackpotSchema.statics.updateBalance = async function(amount: number) {
  const jackpot = await this.findOne();
  if (!jackpot) {
    return await this.create({ balance: amount });
  }
  
  jackpot.balance += amount;
  await jackpot.save();
  return jackpot;
};

// Statische methode om de jackpot te claimen
JackpotSchema.statics.claim = async function(walletAddress: string) {
  const jackpot = await this.findOne();
  if (!jackpot || jackpot.balance <= 0) {
    throw new Error('No jackpot to claim');
  }

  const winAmount = jackpot.balance;
  jackpot.balance = 0;
  jackpot.lastWinner = walletAddress;
  jackpot.lastWinAmount = winAmount;
  jackpot.lastWinDate = new Date();
  
  await jackpot.save();
  return winAmount;
};

export default mongoose.models.Jackpot || mongoose.model<IJackpot>('Jackpot', JackpotSchema); 