import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkPayment } from '@/server/services/lightning';
import { TransactionStatus } from '@/generated/prisma-client';

// In-memory set to track payments being processed (prevent race conditions)
const processingPayments = new Set<string>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    console.log('🔍 Checking payment for hash:', hash);

    // Prevent race conditions by checking if payment is already being processed
    if (processingPayments.has(hash)) {
      console.log('⚠️ Payment already being processed:', hash);
      return NextResponse.json({
        paid: false,
        message: 'Payment check in progress'
      });
    }

    // Add to processing set
    processingPayments.add(hash);

    try {
      // Check payment status with Voltage
      const paymentStatus = await checkPayment(hash);
      console.log('💳 Voltage payment status:', {
        hash: hash.substring(0, 10) + '...',
        paid: paymentStatus.paid,
        amount: paymentStatus.amount,
        state: paymentStatus.state
      });

      if (paymentStatus.paid && prisma) {
        // Check if this invoice was cancelled
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/lightning/cancelled-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentHash: hash })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.isCancelled) {
              console.log('❌ Payment received for cancelled invoice:', hash);
              return NextResponse.json({
                ...paymentStatus,
                message: 'Invoice was cancelled - payment not credited'
              });
            }
          }
        } catch (error) {
          console.log('⚠️ Could not check cancelled status, proceeding:', error);
        }

        // Find the transaction by payment hash
        const transaction = await prisma.transaction.findFirst({
          where: {
            paymentHash: hash,
            type: 'DEPOSIT' // Only process deposit transactions
          },
          include: {
            Wallet: true // Include wallet info for better logging
          }
        });
        
        if (!transaction) {
          console.log('❌ No matching transaction found for hash:', hash);
          return NextResponse.json({
            ...paymentStatus,
            message: 'No matching transaction found'
          });
        }

        console.log('📋 Found transaction:', {
          id: transaction.id,
          walletAddress: transaction.Wallet.address,
          amount: transaction.amount,
          status: transaction.status,
          paidAmount: paymentStatus.amount
        });

        // CRITICAL: Validate that the paid amount matches the expected amount
        if (paymentStatus.amount && paymentStatus.amount !== transaction.amount) {
          console.error('💥 AMOUNT MISMATCH DETECTED!', {
            expectedAmount: transaction.amount,
            paidAmount: paymentStatus.amount,
            difference: paymentStatus.amount - transaction.amount,
            transactionId: transaction.id,
            walletAddress: transaction.Wallet.address,
            paymentHash: hash
          });
          
          // Log this to help debug the 25k->60k issue
          return NextResponse.json({
            ...paymentStatus,
            error: `Amount mismatch: expected ${transaction.amount} sats, but received ${paymentStatus.amount} sats`,
            expectedAmount: transaction.amount,
            receivedAmount: paymentStatus.amount
          }, { status: 400 });
        }

        // Check if already completed (prevent double crediting)
        if (transaction.status === TransactionStatus.COMPLETED) {
          console.log('✅ Transaction already completed:', transaction.id);
          return NextResponse.json({
            ...paymentStatus,
            message: 'Payment already processed'
          });
        }

        // Process the payment with database transaction for atomicity
        const result = await prisma.$transaction(async (tx) => {
          // Double-check status within transaction to prevent race conditions
          const freshTransaction = await tx.transaction.findUnique({
            where: { id: transaction.id }
          });

          if (!freshTransaction || freshTransaction.status === TransactionStatus.COMPLETED) {
            console.log('⚠️ Transaction status changed during processing:', freshTransaction?.status);
            return null;
          }

          // Update transaction status
          const updatedTransaction = await tx.transaction.update({
            where: { id: transaction.id },
            data: { status: TransactionStatus.COMPLETED }
          });

          // Update wallet balance
          const updatedWallet = await tx.wallet.update({
            where: { id: transaction.walletId },
            data: {
              balance: {
                increment: transaction.amount
              },
              updatedAt: new Date()
            }
          });

          return { updatedTransaction, updatedWallet };
        });

        if (result) {
          console.log('✅ Payment processed successfully:', {
            transactionId: result.updatedTransaction.id,
            walletAddress: result.updatedWallet.address,
            oldBalance: result.updatedWallet.balance - transaction.amount,
            newBalance: result.updatedWallet.balance,
            creditedAmount: transaction.amount
          });
        } else {
          console.log('⚠️ Payment processing skipped (already completed)');
        }
      }

      return NextResponse.json(paymentStatus);
    } finally {
      // Always remove from processing set
      processingPayments.delete(hash);
    }
  } catch (error) {
    // Ensure we remove from processing set on error
    const { hash } = await params;
    processingPayments.delete(hash);
    
    console.error('❌ Error checking payment:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}