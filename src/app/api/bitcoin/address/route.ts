import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { btcPayService } from '@/lib/bitcoin-utils'
import { ensureProfileExists } from '@/lib/profile-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')
    const amount = parseInt(searchParams.get('amount') || '10000') // Default 10k sats

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Ensure profile exists
    await ensureProfileExists(walletAddress)

    // Get wallet using raw SQL to avoid schema issues
    const walletResult = await prisma.$queryRaw`
      SELECT id FROM "Wallet" WHERE address = ${walletAddress} LIMIT 1
    ` as Array<{ id: string }>

    if (walletResult.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const wallet = walletResult[0]

    // Create BTCPay Server invoice
    const orderId = `btc-deposit-${wallet.id}-${Date.now()}`
    const invoice = await btcPayService.createInvoice(amount, orderId, `${walletAddress}@bitcointiger.io`)
    
    // Get payment methods to extract Bitcoin address
    const paymentMethods = await btcPayService.getPaymentMethods(invoice.id)
    const btcMethod = paymentMethods.find(pm => pm.cryptoCode === 'BTC')
    
    if (!btcMethod) {
      throw new Error('Bitcoin payment method not available')
    }

    // Store invoice ID in database for later verification
    await prisma.$queryRaw`
      INSERT INTO "Transaction" (id, "walletId", type, amount, "paymentHash", status, "createdAt")
      VALUES (gen_random_uuid(), ${wallet.id}, 'DEPOSIT_PENDING', ${amount}, ${invoice.id}, 'PENDING', ${new Date()})
    `

    return NextResponse.json({
      invoiceId: invoice.id,
      bitcoinAddress: btcMethod.destination,
      amount: amount,
      amountBTC: btcMethod.amount,
      checkoutLink: invoice.checkoutLink,
      expiresAt: new Date(invoice.expirationTime * 1000).toISOString(),
      network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet'
    })

  } catch (error) {
    console.error('Error creating BTCPay invoice:', error)
    return NextResponse.json({ 
      error: 'Failed to create Bitcoin payment invoice',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, invoiceId } = await request.json()

    if (!walletAddress || !invoiceId) {
      return NextResponse.json({ error: 'Wallet address and invoice ID required' }, { status: 400 })
    }

    // Get wallet
    const walletResult = await prisma.$queryRaw`
      SELECT id FROM "Wallet" WHERE address = ${walletAddress} LIMIT 1
    ` as Array<{ id: string }>

    if (walletResult.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const wallet = walletResult[0]

    // Check payment status with BTCPay Server
    const paymentStatus = await btcPayService.isInvoicePaid(invoiceId)
    
    if (paymentStatus.paid && paymentStatus.confirmed) {
      // Check if we already processed this payment
      const existingTxResult = await prisma.$queryRaw`
        SELECT id FROM "Transaction" 
        WHERE "paymentHash" = ${invoiceId} AND status = 'COMPLETED'
        LIMIT 1
      ` as Array<{ id: string }>

      if (existingTxResult.length === 0) {
        // Update transaction to completed and add balance
        const amountPaid = paymentStatus.amountPaid || 0
        
        await prisma.$queryRaw`
          UPDATE "Transaction" 
          SET status = 'COMPLETED', amount = ${amountPaid}, "updatedAt" = ${new Date()}
          WHERE "paymentHash" = ${invoiceId} AND type = 'DEPOSIT_PENDING'
        `

        // Update wallet balance
        await prisma.$queryRaw`
          UPDATE "Wallet" 
          SET balance = balance + ${amountPaid}, "updatedAt" = ${new Date()}
          WHERE id = ${wallet.id}
        `

        console.log(`✅ BTCPay deposit processed: ${amountPaid} sats from invoice ${invoiceId}`)
        
        return NextResponse.json({
          paid: true,
          confirmed: true,
          amount: amountPaid,
          status: paymentStatus.status
        })
      }
    }

    return NextResponse.json({
      paid: paymentStatus.paid,
      confirmed: paymentStatus.confirmed,
      status: paymentStatus.status,
      amount: paymentStatus.amountPaid
    })

  } catch (error) {
    console.error('Error checking BTCPay payment status:', error)
    return NextResponse.json({ 
      error: 'Failed to check payment status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 