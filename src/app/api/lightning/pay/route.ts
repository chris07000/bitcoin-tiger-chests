import { NextResponse } from 'next/server';
import { decode } from 'bolt11';
import { prisma } from '@/lib/prisma';
import { TransactionType, TransactionStatus } from '@/generated/prisma-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { invoice, withdrawAmount, walletAddress } = await request.json();
    console.log('Received withdraw request:', { 
      invoice: invoice.substring(0, 20) + '...', 
      withdrawAmount,
      walletAddress
    });

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_VOLTAGE_API_ENDPOINT || !process.env.VOLTAGE_REST_PORT || !process.env.VOLTAGE_ADMIN_MACAROON) {
      console.error('Missing environment variables');
      throw new Error('Missing required environment variables');
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 500 }
      );
    }

    try {
      // Decode invoice locally with bolt11
      console.log('Decoding invoice locally...');
      const decodedInvoice = decode(invoice);
      console.log('Decoded invoice:', decodedInvoice);

      // Get amount from decoded invoice
      const invoiceAmount = decodedInvoice.satoshis || 0;
      console.log('Invoice amount:', invoiceAmount, 'Withdraw amount:', withdrawAmount);

      // Check if amounts match
      if (invoiceAmount !== withdrawAmount) {
        console.error('Invoice amount mismatch:', { invoiceAmount, withdrawAmount });
        return NextResponse.json(
          { error: `Invoice amount (${invoiceAmount} sats) does not match withdraw amount (${withdrawAmount} sats)` },
          { status: 400 }
        );
      }

      // Find wallet and check balance
      const wallet = await prisma.wallet.findUnique({
        where: { address: walletAddress }
      });

      if (!wallet) {
        return NextResponse.json(
          { error: 'Wallet not found' },
          { status: 404 }
        );
      }

      if (wallet.balance < withdrawAmount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      // If amounts match, execute payment
      const apiUrl = `https://${process.env.NEXT_PUBLIC_VOLTAGE_API_ENDPOINT}:${process.env.VOLTAGE_REST_PORT}/v1/channels/transactions`;
      console.log('Making payment request to:', apiUrl);

      const response = await fetch(
        apiUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Grpc-Metadata-macaroon': process.env.VOLTAGE_ADMIN_MACAROON,
          },
          body: JSON.stringify({
            payment_request: invoice,
          }),
        }
      );

      console.log('Voltage API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Voltage:', errorText);
        throw new Error(`Failed to pay invoice: ${errorText}`);
      }

      const data = await response.json();
      console.log('Payment successful:', data);

      // Voeg alleen een transactie toe voor auditing, zonder de balans te updaten
      await prisma.transaction.create({
        data: {
          id: uuidv4(),
          walletId: wallet.id,
          type: TransactionType.WITHDRAW,
          amount: withdrawAmount,
          paymentHash: data.payment_hash,
          status: TransactionStatus.COMPLETED
        }
      });
      
      return NextResponse.json({
        paymentHash: data.payment_hash,
        paymentPreimage: data.payment_preimage,
        status: data.status,
        amount: invoiceAmount
      });
    } catch (decodeError) {
      console.error('Error decoding or paying invoice:', decodeError);
      return NextResponse.json(
        { error: decodeError instanceof Error ? decodeError.message : 'Failed to process payment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in request handling:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 