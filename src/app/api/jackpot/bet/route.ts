import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { walletAddress, betAmount, selectedSide } = await req.json()

    if (!walletAddress || !betAmount || !selectedSide) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get or create jackpot
    let jackpot = await prisma.jackpot.findUnique({
      where: { id: 1 }
    })

    if (!jackpot) {
      jackpot = await prisma.jackpot.create({
        data: {
          id: 1,
          balance: 250000,
          totalContributions: 0,
          lastUpdate: new Date()
        }
      })
    }

    // Update jackpot balance
    const updatedJackpot = await prisma.jackpot.update({
      where: { id: 1 },
      data: {
        balance: {
          increment: betAmount
        },
        totalContributions: {
          increment: betAmount
        },
        lastUpdate: new Date()
      }
    })

    // Simulate coin flip
    const flipResult = Math.random() < 0.5 ? 'heads' : 'tails'
    const won = flipResult === selectedSide

    // Calculate reward (2x bet amount if won)
    const reward = won ? betAmount * 2 : 0

    return NextResponse.json({
      won,
      reward,
      result: flipResult,
      jackpotBalance: updatedJackpot.balance
    })
  } catch (error) {
    console.error('Error placing bet:', error)
    return NextResponse.json(
      { error: 'Failed to place bet' },
      { status: 500 }
    )
  }
} 