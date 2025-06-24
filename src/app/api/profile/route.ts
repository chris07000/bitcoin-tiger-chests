import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to ensure profile exists for a wallet
export async function ensureProfileExists(walletAddress: string) {
  try {
    console.log(`Ensuring profile exists for wallet: ${walletAddress}`)
    
    // Get or create wallet first using raw SQL
    const walletResult = await prisma.$queryRaw`
      INSERT INTO "Wallet" (id, address, balance, "createdAt", "updatedAt")
      VALUES (${walletAddress}, ${walletAddress}, 0, ${new Date()}, ${new Date()})
      ON CONFLICT (address) DO UPDATE SET "updatedAt" = ${new Date()}
      RETURNING id
    ` as Array<{ id: string }>
    
    const walletId = walletResult[0].id
    console.log(`Wallet ID: ${walletId}`)

    // Check if profile exists
    const existingProfile = await prisma.$queryRaw`
      SELECT * FROM "UserProfile" WHERE "walletId" = ${walletId} LIMIT 1
    ` as Array<any>

    if (existingProfile.length > 0) {
      console.log('Found existing profile, updating lastSeen...')
      const updatedProfile = await prisma.$queryRaw`
        UPDATE "UserProfile" 
        SET "lastSeen" = ${new Date()}, "updatedAt" = ${new Date()}
        WHERE "walletId" = ${walletId}
        RETURNING *
      ` as Array<any>
      return updatedProfile[0]
    }

    // Create new profile
    console.log('Creating new profile...')
    const newProfile = await prisma.$queryRaw`
      INSERT INTO "UserProfile" ("id", "walletId", "joinedAt", "lastSeen", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${walletId}, ${new Date()}, ${new Date()}, ${new Date()}, ${new Date()})
      RETURNING *
    ` as Array<any>

    console.log('Profile created successfully:', newProfile[0]?.id)
    return newProfile[0]

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

    // Get or create wallet using raw SQL
    const walletResult = await prisma.$queryRaw`
      INSERT INTO "Wallet" (id, address, balance, "createdAt", "updatedAt")
      VALUES (${walletAddress}, ${walletAddress}, 0, ${new Date()}, ${new Date()})
      ON CONFLICT (address) DO UPDATE SET "updatedAt" = ${new Date()}
      RETURNING id
    ` as Array<{ id: string }>
    
    const walletId = walletResult[0].id

    // Upsert profile using raw SQL
    const profile = await prisma.$queryRaw`
      INSERT INTO "UserProfile" ("id", "walletId", "displayName", "bio", "avatar", "joinedAt", "lastSeen", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${walletId}, ${displayName}, ${bio}, ${avatar}, ${new Date()}, ${new Date()}, ${new Date()}, ${new Date()})
      ON CONFLICT ("walletId") 
      DO UPDATE SET 
        "displayName" = EXCLUDED."displayName",
        "bio" = EXCLUDED."bio", 
        "avatar" = EXCLUDED."avatar",
        "lastSeen" = EXCLUDED."lastSeen",
        "updatedAt" = EXCLUDED."updatedAt"
      RETURNING *
    ` as Array<any>

    return NextResponse.json(profile[0])
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
} 