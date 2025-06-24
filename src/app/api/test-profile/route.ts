import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet') || 'test-wallet'

    console.log('Testing profile creation for:', walletAddress)

    // Test 1: Check if we can query the UserProfile table
    console.log('Test 1: Checking UserProfile table...')
    const allProfiles = await prisma.$queryRaw`SELECT COUNT(*) FROM "UserProfile"`
    console.log('UserProfile table exists, count:', allProfiles)

    // Test 2: Check if wallet exists
    console.log('Test 2: Checking wallet...')
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      select: { id: true }
    })

    if (!wallet) {
      console.log('Creating test wallet...')
      wallet = await prisma.wallet.create({
        data: {
          id: walletAddress,
          address: walletAddress,
          balance: 0
        },
        select: { id: true }
      })
    }
    console.log('Wallet ID:', wallet.id)

    // Test 3: Try to create profile using raw SQL
    console.log('Test 3: Creating profile with raw SQL...')
    const existingProfile = await prisma.$queryRaw`
      SELECT * FROM "UserProfile" WHERE "walletId" = ${wallet.id} LIMIT 1
    ` as Array<any>

    let profile
    if (existingProfile.length === 0) {
      console.log('Creating new profile...')
      const newProfile = await prisma.$queryRaw`
        INSERT INTO "UserProfile" ("id", "walletId", "joinedAt", "lastSeen", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${wallet.id}, ${new Date()}, ${new Date()}, ${new Date()}, ${new Date()})
        RETURNING *
      ` as Array<any>
      profile = newProfile[0]
      console.log('Created profile:', profile)
    } else {
      profile = existingProfile[0]
      console.log('Found existing profile:', profile)
    }

    return NextResponse.json({
      success: true,
      walletId: wallet.id,
      profile,
      message: 'Profile test completed successfully'
    })

  } catch (error) {
    console.error('Profile test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: String(error)
    }, { status: 500 })
  }
} 