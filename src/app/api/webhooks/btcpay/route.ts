import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

interface BTCPayWebhookEvent {
  deliveryId: string
  webhookId: string
  originalDeliveryId: string
  isRedelivery: boolean
  type: string
  timestamp: number
  storeId: string
  invoiceId: string
}

interface BTCPayInvoiceData {
  id: string
  storeId: string
  amount: string
  currency: string
  status: string
  additionalStatus: string
  createdTime: number
  expirationTime: number
  monitoringExpiration: number
  metadata: {
    orderId?: string
    buyerEmail?: string
  }
}

// Verify webhook signature
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  if (!secret) return true // Skip verification if no secret configured
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex')
  
  return `sha256=${expectedSignature}` === signature
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('btcpay-sig') || ''
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET || ''

    // Verify webhook signature
    if (webhookSecret && !verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const webhookData = JSON.parse(body) as BTCPayWebhookEvent & { data: BTCPayInvoiceData }

    console.log('BTCPay webhook received:', {
      type: webhookData.type,
      invoiceId: webhookData.invoiceId,
      status: webhookData.data?.status
    })

    // Only process invoice settled events
    if (webhookData.type !== 'InvoiceSettled' && webhookData.type !== 'InvoiceProcessing') {
      return NextResponse.json({ message: 'Event type not processed' })
    }

    const invoiceId = webhookData.invoiceId
    const invoiceData = webhookData.data

    if (!invoiceId || !invoiceData) {
      return NextResponse.json({ error: 'Missing invoice data' }, { status: 400 })
    }

    // Find the pending transaction in our database
    const pendingTransaction = await prisma.$queryRaw`
      SELECT t.id, t."walletId", t.amount, w.address as "walletAddress"
      FROM "Transaction" t
      JOIN "Wallet" w ON w.id = t."walletId"
      WHERE t."paymentHash" = ${invoiceId} 
      AND t.type = 'DEPOSIT_PENDING' 
      AND t.status = 'PENDING'
      LIMIT 1
    ` as Array<{
      id: string
      walletId: string
      amount: number
      walletAddress: string
    }>

    if (pendingTransaction.length === 0) {
      console.log('No pending transaction found for invoice:', invoiceId)
      return NextResponse.json({ message: 'Transaction not found or already processed' })
    }

    const transaction = pendingTransaction[0]

    // Parse the paid amount from BTCPay (amount is in BTC, convert to satoshis)
    const paidAmountBTC = parseFloat(invoiceData.amount)
    const paidAmountSats = Math.round(paidAmountBTC * 100000000)

    try {
      // Update transaction status to completed
      await prisma.$queryRaw`
        UPDATE "Transaction" 
        SET 
          status = 'COMPLETED', 
          amount = ${paidAmountSats},
          "updatedAt" = ${new Date()}
        WHERE id = ${transaction.id}
      `

      // Add amount to wallet balance
      await prisma.$queryRaw`
        UPDATE "Wallet" 
        SET 
          balance = balance + ${paidAmountSats},
          "updatedAt" = ${new Date()}
        WHERE id = ${transaction.walletId}
      `

      console.log(`✅ BTCPay webhook processed: ${paidAmountSats} sats for wallet ${transaction.walletAddress}`)

      return NextResponse.json({ 
        success: true,
        processed: {
          invoiceId,
          walletAddress: transaction.walletAddress,
          amount: paidAmountSats,
          status: invoiceData.status
        }
      })

    } catch (dbError) {
      console.error('Database error processing webhook:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

  } catch (error) {
    console.error('BTCPay webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'BTCPay webhook endpoint active',
    timestamp: new Date().toISOString()
  })
} 