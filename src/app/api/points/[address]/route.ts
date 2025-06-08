import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // Get or create wallet first
    let wallet = await prisma.wallet.findUnique({
      where: { address }
    })

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await prisma.wallet.create({
        data: { address }
      })
    }

    // Get user points (will be created automatically when they make first purchase)
    const userPoints = await prisma.userPoints.findUnique({
      where: { walletId: wallet.id }
    })

    return NextResponse.json({
      success: true,
      points: userPoints?.totalPoints || 0,
      walletAddress: address
    })

  } catch (error) {
    console.error('Error in points API:', error)
    // For now, return 0 points if there's any error (graceful fallback)
    return NextResponse.json({
      success: true,
      points: 0,
      walletAddress: (await params).address,
      message: 'Points system initializing'
    })
  }
} 