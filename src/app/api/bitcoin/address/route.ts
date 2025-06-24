import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bitcoinService } from '@/lib/bitcoin-utils'
import { ensureProfileExists } from '@/lib/profile-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

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

    // For now, generate address based on wallet ID (mock implementation)
    // In production, you'd store this in a separate table or add column to Wallet
    const bitcoinAddress = bitcoinService.generateDepositAddress(wallet.id)

    return NextResponse.json({
      bitcoinAddress,
      network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
      minConfirmations: 1,
      note: 'This is a demo implementation. In production, generate unique addresses per user.'
    })

  } catch (error) {
    console.error('Error generating Bitcoin address:', error)
    return NextResponse.json({ error: 'Failed to generate Bitcoin address' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, checkTransactions, bitcoinAddress } = await request.json()

    if (!walletAddress || !bitcoinAddress) {
      return NextResponse.json({ error: 'Wallet address and Bitcoin address required' }, { status: 400 })
    }

    // Get wallet
    const walletResult = await prisma.$queryRaw`
      SELECT id FROM "Wallet" WHERE address = ${walletAddress} LIMIT 1
    ` as Array<{ id: string }>

    if (walletResult.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const wallet = walletResult[0]

    if (checkTransactions) {
      // Validate the Bitcoin address
      if (!bitcoinService.validateAddress(bitcoinAddress)) {
        return NextResponse.json({ error: 'Invalid Bitcoin address' }, { status: 400 })
      }

      // Check for new transactions
      const transactions = await bitcoinService.getAddressTransactions(bitcoinAddress)
      
      // Filter for confirmed transactions that haven't been processed yet
      const newTransactions = []
      
      for (const tx of transactions) {
        if (tx.confirmations >= 1) {
          // Check if we already processed this transaction
          const existingTxResult = await prisma.$queryRaw`
            SELECT id FROM "Transaction" 
            WHERE "paymentHash" = ${tx.txid} AND type = 'DEPOSIT'
            LIMIT 1
          ` as Array<{ id: string }>

          if (existingTxResult.length === 0) {
            // New confirmed transaction - add to wallet balance
            try {
              // Create transaction record
              await prisma.$queryRaw`
                INSERT INTO "Transaction" (id, "walletId", type, amount, "paymentHash", status, "createdAt")
                VALUES (gen_random_uuid(), ${wallet.id}, 'DEPOSIT', ${tx.amount}, ${tx.txid}, 'COMPLETED', ${new Date()})
              `

              // Update wallet balance
              await prisma.$queryRaw`
                UPDATE "Wallet" 
                SET balance = balance + ${tx.amount}, "updatedAt" = ${new Date()}
                WHERE id = ${wallet.id}
              `

              newTransactions.push(tx)
              console.log(`✅ Bitcoin deposit processed: ${tx.amount} sats from ${tx.txid}`)
            } catch (error) {
              console.error('Error processing Bitcoin transaction:', error)
            }
          }
        }
      }

      return NextResponse.json({
        newTransactions,
        totalFound: transactions.length,
        addressInfo: await bitcoinService.getAddressInfo(bitcoinAddress)
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error checking Bitcoin transactions:', error)
    return NextResponse.json({ error: 'Failed to check transactions' }, { status: 500 })
  }
} 