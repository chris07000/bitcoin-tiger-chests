import mongoose from 'mongoose';

// Schema voor individuele transacties
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'chest', 'jackpot', 'coinflip'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentHash: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hoofdschema voor de wallet
const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  transactions: [transactionSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Interface voor het Wallet document
export interface IWallet extends mongoose.Document {
  address: string;
  balance: number;
  transactions: Array<{
    type: 'deposit' | 'withdraw' | 'chest' | 'jackpot' | 'coinflip';
    amount: number;
    paymentHash?: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
  }>;
  lastUpdated: Date;
}

// Methode om balance te updaten
walletSchema.methods.updateBalance = async function(amount: number) {
  this.balance += amount;
  this.lastUpdated = new Date();
  await this.save();
};

// Methode om transactie toe te voegen
walletSchema.methods.addTransaction = async function(
  type: 'deposit' | 'withdraw' | 'chest' | 'jackpot' | 'coinflip',
  amount: number,
  paymentHash?: string
) {
  this.transactions.push({
    type,
    amount,
    paymentHash,
    status: 'pending'
  });
  await this.save();
};

// Methode om transactie status te updaten
walletSchema.methods.updateTransactionStatus = async function(
  paymentHash: string,
  status: 'completed' | 'failed'
) {
  const transaction = this.transactions.find((t: any) => t.paymentHash === paymentHash);
  if (transaction) {
    transaction.status = status;
    await this.save();
  }
};

// Verwijder het bestaande model als het bestaat
if (mongoose.models.Wallet) {
  delete mongoose.models.Wallet;
}

// Export het model
export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);

// Types voor TypeScript
export interface ITransaction {
  type: 'deposit' | 'withdraw' | 'chest' | 'jackpot' | 'coinflip';
  amount: number;
  paymentHash?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface IWallet {
  address: string;
  balance: number;
  transactions: ITransaction[];
  lastUpdated: Date;
  updateBalance(amount: number): Promise<void>;
  addTransaction(type: 'deposit' | 'withdraw' | 'chest' | 'jackpot' | 'coinflip', amount: number, paymentHash?: string): Promise<void>;
  updateTransactionStatus(paymentHash: string, status: 'completed' | 'failed'): Promise<void>;
}