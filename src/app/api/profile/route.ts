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

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        UserProfile: true,
        UserRanking: {
          include: {
            GameStats: true
          }
        }
      }
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          id: walletAddress,
          address: walletAddress,
          balance: 0
        },
        include: {
          UserProfile: true,
          UserRanking: {
            include: {
              GameStats: true
            }
          }
        }
      })
    }

    // Get or create profile
    let profile = wallet.UserProfile
    
    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          walletId: wallet.id,
          joinedAt: new Date(),
          lastSeen: new Date()
        }
      })
    } else {
      // Update last seen
      await prisma.userProfile.update({
        where: { id: profile.id },
        data: { lastSeen: new Date() }
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, displayName, bio, avatar } = body

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          id: walletAddress,
          address: walletAddress,
          balance: 0
        }
      })
    }

    // Upsert profile
    const profile = await prisma.userProfile.upsert({
      where: { walletId: wallet.id },
      update: {
        displayName,
        bio,
        avatar,
        lastSeen: new Date()
      },
      create: {
        walletId: wallet.id,
        displayName,
        bio,
        avatar,
        joinedAt: new Date(),
        lastSeen: new Date()
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
} 