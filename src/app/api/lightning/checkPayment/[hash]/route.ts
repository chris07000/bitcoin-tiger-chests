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
      // Check if this invoice was cancelled (using a simple in-memory tracking)
      // This is a quick fix - in production we'd use a proper database table
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/lightning/cancelled-check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentHash: hash })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.isCancelled) {
            console.log('Payment received for cancelled invoice:', hash);
            return NextResponse.json({
              ...paymentStatus,
              message: 'Invoice was cancelled - payment not credited'
            });
          }
        }
      } catch (error) {
        console.log('Could not check cancelled status, proceeding with payment:', error);
      }

      // Zoek de transactie direct
      const transaction = await (prisma as any).transaction.findFirst({
        where: {
          paymentHash: hash
        }
      });
      
      if (transaction) {
        // Haal de wallet op
        const wallet = await (prisma as any).wallet.findUnique({
          where: {
            id: transaction.walletId
          }
        });

        if (wallet && transaction.status !== TransactionStatus.COMPLETED && prisma) {
          // Update transaction status and wallet balance
          await (prisma as any).$transaction([
            (prisma as any).transaction.update({
              where: { id: transaction.id },
              data: { status: TransactionStatus.COMPLETED }
            }),
            (prisma as any).wallet.update({
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