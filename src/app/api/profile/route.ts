import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to ensure profile exists for a wallet
export async function ensureProfileExists(walletAddress: string) {
  try {
    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      select: { id: true }
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          id: walletAddress,
          address: walletAddress,
          balance: 0
        },
        select: { id: true }
      })
    }

    // Check if profile exists using raw query
    const existingProfile = await prisma.$queryRaw`
      SELECT * FROM "UserProfile" WHERE "walletId" = ${wallet.id} LIMIT 1
    ` as Array<any>

    let profile
    if (existingProfile.length === 0) {
      // Create new profile
      const newProfile = await prisma.$queryRaw`
        INSERT INTO "UserProfile" ("walletId", "joinedAt", "lastSeen")
        VALUES (${wallet.id}, ${new Date()}, ${new Date()})
        RETURNING *
      ` as Array<any>
      profile = newProfile[0]
    } else {
      // Update last seen
      const updatedProfile = await prisma.$queryRaw`
        UPDATE "UserProfile" 
        SET "lastSeen" = ${new Date()}
        WHERE "walletId" = ${wallet.id}
        RETURNING *
      ` as Array<any>
      profile = updatedProfile[0]
    }

    return profile
  } catch (error) {
    console.error('Error ensuring profile exists:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Use the helper function
    const profile = await ensureProfileExists(walletAddress)
    
    if (!profile) {
      return NextResponse.json({ error: 'Failed to create/get profile' }, { status: 500 })
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

    // Use raw SQL for upsert
    const profile = await prisma.$queryRaw`
      INSERT INTO "UserProfile" ("walletId", "displayName", "bio", "avatar", "joinedAt", "lastSeen")
      VALUES (${wallet.id}, ${displayName}, ${bio}, ${avatar}, ${new Date()}, ${new Date()})
      ON CONFLICT ("walletId") 
      DO UPDATE SET 
        "displayName" = EXCLUDED."displayName",
        "bio" = EXCLUDED."bio", 
        "avatar" = EXCLUDED."avatar",
        "lastSeen" = EXCLUDED."lastSeen"
      RETURNING *
    ` as Array<any>

    return NextResponse.json(profile[0])
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
} 