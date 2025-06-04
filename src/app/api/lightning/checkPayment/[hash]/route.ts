import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkPayment } from '@/server/services/lightning';
import { TransactionStatus } from '@/generated/prisma-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    console.log('Checking payment for hash:', hash);

    // Check payment status
    const paymentStatus = await checkPayment(hash);
    console.log('Payment status:', paymentStatus);

    if (paymentStatus.paid && prisma) {
      // Zoek de transactie direct
      const transaction = await prisma.transaction.findFirst({
        where: {
          paymentHash: hash
        }
      });
      
      if (transaction) {
        // Haal de wallet op
        const wallet = await prisma.wallet.findUnique({
          where: {
            id: transaction.walletId
          }
        });

        if (wallet && transaction.status !== TransactionStatus.COMPLETED && prisma) {
          // Update transaction status and wallet balance
          await prisma.$transaction([
            prisma.transaction.update({
              where: { id: transaction.id },
              data: { status: TransactionStatus.COMPLETED }
            }),
            prisma.wallet.update({
              where: { id: wallet.id },
              data: {
                balance: {
                  increment: transaction.amount
                }
              }
            })
          ]);
          
          console.log('Updated wallet:', {
            address: wallet.address,
            newBalance: wallet.balance + transaction.amount,
            transactionAmount: transaction.amount
          });
        }
      }
    }

    return NextResponse.json(paymentStatus);
  } catch (error) {
    console.error('Error checking payment:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}