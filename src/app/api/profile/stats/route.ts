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

    // Get wallet with game stats
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        UserRanking: {
          include: {
            GameStats: true
          }
        }
      }
    })

    if (!wallet || !wallet.UserRanking?.GameStats) {
      // Return default stats if no data found
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

    const stats = wallet.UserRanking.GameStats

    return NextResponse.json({
      chestsPlayed: stats.chestsPlayed,
      chestsWon: stats.chestsWon,
      chestsWagered: stats.chestsWagered,
      coinflipPlayed: stats.coinflipPlayed,
      coinflipWon: stats.coinflipWon,
      coinflipWagered: stats.coinflipWagered,
      rafflesEntered: stats.rafflesEntered,
      rafflesWon: stats.rafflesWon,
      rafflesWagered: stats.rafflesWagered
    })
  } catch (error) {
    console.error('Error fetching game stats:', error)
    return NextResponse.json({ error: 'Failed to fetch game stats' }, { status: 500 })
  }
} 