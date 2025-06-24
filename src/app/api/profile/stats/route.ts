import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Get wallet first
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      select: { id: true }
    })

    if (!wallet) {
      // Return default stats if wallet not found
      return NextResponse.json({
        chestsPlayed: 0,
        chestsWon: 0,
        chestsWagered: 0,
        coinflipPlayed: 0,
        coinflipWon: 0,
        coinflipWagered: 0,
        rafflesEntered: 0,
        rafflesWon: 0,
        rafflesWagered: 0
      })
    }

    // Get all transactions for this wallet
    const transactions = await prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        type: {
          in: ['CHEST', 'COINFLIP', 'RAFFLE']
        }
      },
      select: {
        type: true,
        amount: true
      }
    })

    // Calculate stats from transactions
    const chestTxs = transactions.filter(tx => tx.type === 'CHEST')
    const coinflipTxs = transactions.filter(tx => tx.type === 'COINFLIP')
    const raffleTxs = transactions.filter(tx => tx.type === 'RAFFLE')

    // Chest stats
    const chestsPlayed = chestTxs.filter(tx => tx.amount < 0).length
    const chestsWon = chestTxs.filter(tx => tx.amount > 0).length
    const chestsWagered = chestTxs
      .filter(tx => tx.amount < 0)
      .reduce((total, tx) => total + Math.abs(tx.amount), 0)

    // Coinflip stats
    const coinflipPlayed = coinflipTxs.filter(tx => tx.amount < 0).length
    const coinflipWon = coinflipTxs.filter(tx => tx.amount > 0).length
    const coinflipWagered = coinflipTxs
      .filter(tx => tx.amount < 0)
      .reduce((total, tx) => total + Math.abs(tx.amount), 0)

    // Raffle stats
    const rafflesEntered = raffleTxs.filter(tx => tx.amount < 0).length
    const rafflesWon = raffleTxs.filter(tx => tx.amount > 0).length
    const rafflesWagered = raffleTxs
      .filter(tx => tx.amount < 0)
      .reduce((total, tx) => total + Math.abs(tx.amount), 0)

    return NextResponse.json({
      chestsPlayed,
      chestsWon,
      chestsWagered: Math.round(chestsWagered),
      coinflipPlayed,
      coinflipWon,
      coinflipWagered: Math.round(coinflipWagered),
      rafflesEntered,
      rafflesWon,
      rafflesWagered: Math.round(rafflesWagered)
    })

  } catch (error) {
    console.error('Error fetching game stats:', error)
    return NextResponse.json({ error: 'Failed to fetch game stats' }, { status: 500 })
  }
} 