import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType, TransactionStatus } from '@/generated/prisma-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { amount, memo, walletAddress } = await request.json();
    console.log('💰 Generating invoice for:', { 
      amount, 
      memo: memo?.substring(0, 50) + '...', 
      walletAddress: walletAddress?.substring(0, 10) + '...' 
    });

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount: must be greater than 0' },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

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
      console.log('📝 Creating new wallet for address:', walletAddress);
      wallet = await prisma.wallet.create({
        data: {
          id: uuidv4(),
          address: walletAddress,
          balance: 0,
          updatedAt: new Date()
        }
      });
    }

    // Check for recent duplicate requests (within last 30 seconds)
    const thirtySecondsAgo = new Date(Date.now() - 30000);
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        amount: amount,
        createdAt: {
          gte: thirtySecondsAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (recentTransactions.length > 0) {
      console.log('⚠️ Recent duplicate invoice request detected:', {
        walletAddress,
        amount,
        recentCount: recentTransactions.length,
        mostRecent: recentTransactions[0].createdAt
      });
      
      // Return existing invoice if possible, or limit creation rate
      return NextResponse.json(
        { error: 'Please wait before creating another invoice of the same amount' },
        { status: 429 }
      );
    }

    // Generate invoice via Voltage API
    const apiUrl = `https://${process.env.NEXT_PUBLIC_VOLTAGE_API_ENDPOINT}:${process.env.VOLTAGE_REST_PORT}/v1/invoices`;
    console.log('🔌 Making request to Voltage API:', apiUrl);

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
      const errorText = await response.text();
      console.error('❌ Voltage API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Voltage API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('⚡ Voltage invoice response:', {
      payment_request: data.payment_request?.substring(0, 30) + '...',
      r_hash: data.r_hash?.substring(0, 20) + '...',
      value: data.value
    });

    // Validate the response
    if (!data.payment_request || !data.r_hash) {
      throw new Error('Invalid response from Voltage API - missing payment_request or r_hash');
    }

    // Check if transaction with this hash already exists (shouldn't happen but safety check)
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        paymentHash: data.r_hash
      }
    });

    if (existingTransaction) {
      console.error('💥 DUPLICATE PAYMENT HASH DETECTED!', {
        paymentHash: data.r_hash,
        existingTransactionId: existingTransaction.id,
        existingWallet: existingTransaction.walletId,
        newWallet: wallet.id
      });
      
      return NextResponse.json(
        { error: 'Payment hash collision detected - please try again' },
        { status: 500 }
      );
    }

    // Create transaction record
    const transactionId = uuidv4();
    const transaction = await prisma.transaction.create({
      data: {
        id: transactionId,
        walletId: wallet.id,
        type: TransactionType.DEPOSIT,
        amount: amount,
        paymentHash: data.r_hash,
        status: TransactionStatus.PENDING
      }
    });

    console.log('✅ Transaction created successfully:', {
      transactionId: transaction.id,
      walletAddress: wallet.address,
      amount: amount,
      paymentHash: data.r_hash?.substring(0, 20) + '...',
      status: transaction.status
    });

    return NextResponse.json({
      paymentRequest: data.payment_request,
      paymentHash: data.r_hash
    });
  } catch (error) {
    console.error('❌ Error in invoice generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate invoice' },
      { status: 500 }
    );
  }
} 