import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType, TransactionStatus } from '@/generated/prisma-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { amount, memo, walletAddress } = await request.json();
    console.log('Generating invoice for:', { amount, memo, walletAddress });

    if (!process.env.NEXT_PUBLIC_VOLTAGE_API_ENDPOINT || !process.env.VOLTAGE_REST_PORT || !process.env.VOLTAGE_INVOICE_MACAROON) {
      throw new Error('Missing required environment variables');
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 500 }
      );
    }

    // Find or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          id: uuidv4(),
          address: walletAddress,
          balance: 0,
          updatedAt: new Date()
        }
      });
    }

    // Generate invoice via Voltage API
    const apiUrl = `https://${process.env.NEXT_PUBLIC_VOLTAGE_API_ENDPOINT}:${process.env.VOLTAGE_REST_PORT}/v1/invoices`;
    console.log('Making request to Voltage API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Grpc-Metadata-macaroon': process.env.VOLTAGE_INVOICE_MACAROON
      },
      body: JSON.stringify({
        value: amount.toString(),
        memo: memo || `Deposit for ${walletAddress}`,
        expiry: '3600'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate invoice');
    }

    const data = await response.json();
    console.log('Voltage invoice response:', data);

    // Add transaction to wallet
    await prisma.transaction.create({
      data: {
        id: uuidv4(),
        walletId: wallet.id,
        type: TransactionType.DEPOSIT,
        amount: amount,
        paymentHash: data.r_hash,
        status: TransactionStatus.PENDING
      }
    });

    return NextResponse.json({
      paymentRequest: data.payment_request,
      paymentHash: data.r_hash
    });
  } catch (error) {
    console.error('Error in invoice generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate invoice' },
      { status: 500 }
    );
  }
} 