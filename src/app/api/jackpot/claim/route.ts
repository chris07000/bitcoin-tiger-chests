import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { walletAddress, reward } = await req.json()

    if (!walletAddress || !reward) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get jackpot
    const jackpot = await prisma.jackpot.findUnique({
      where: { id: 1 }
    })

    if (!jackpot) {
      return NextResponse.json(
        { error: 'Jackpot not found' },
        { status: 404 }
      )
    }

    // Update jackpot balance
    const updatedJackpot = await prisma.jackpot.update({
      where: { id: 1 },
      data: {
        balance: {
          decrement: reward
        },
        lastUpdate: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      jackpotBalance: updatedJackpot.balance
    })
  } catch (error) {
    console.error('Error claiming reward:', error)
    return NextResponse.json(
      { error: 'Failed to claim reward' },
      { status: 500 }
    )
  }
} 