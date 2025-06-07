import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { paymentHash } = await request.json();
    
    if (!paymentHash) {
      return NextResponse.json(
        { error: 'Payment hash is required' },
        { status: 400 }
      );
    }

    console.log('Cancelling invoice with payment hash:', paymentHash);

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 500 }
      );
    }

    // Find the transaction and mark it as cancelled
    const transaction = await (prisma as any).transaction.findFirst({
      where: {
        paymentHash: paymentHash
      }
    });

    if (transaction) {
      // Update the transaction memo to mark it as cancelled
      await (prisma as any).transaction.update({
        where: { id: transaction.id },
        data: {
          memo: (transaction.memo || '') + ' [CANCELLED]'
        }
      });

      console.log('Invoice marked as cancelled:', paymentHash);
      return NextResponse.json({ 
        success: true, 
        message: 'Invoice cancelled successfully' 
      });
    } else {
      console.log('Transaction not found for payment hash:', paymentHash);
      return NextResponse.json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
  } catch (error) {
    console.error('Error cancelling invoice:', error);
    return NextResponse.json(
      { error: 'Failed to cancel invoice' },
      { status: 500 }
    );
  }
} 