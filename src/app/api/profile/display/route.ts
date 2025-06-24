import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { addresses } = await request.json()

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json({ error: 'Addresses array required' }, { status: 400 })
    }

    const profiles: Record<string, { displayName?: string, avatar?: string }> = {}

    // Get profiles for all addresses
    for (const address of addresses) {
      try {
        const wallet = await prisma.wallet.findUnique({
          where: { address },
          select: { id: true }
        })

        if (wallet) {
          // Try to get profile with raw query to avoid TypeScript issues
          const profileData = await prisma.$queryRaw`
            SELECT "displayName", "avatar" 
            FROM "UserProfile" 
            WHERE "walletId" = ${wallet.id}
            LIMIT 1
          ` as Array<{ displayName?: string, avatar?: string }>

          if (profileData.length > 0) {
            profiles[address] = {
              displayName: profileData[0].displayName || undefined,
              avatar: profileData[0].avatar || undefined
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching profile for ${address}:`, error)
        // Continue with other addresses
      }
    }

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
} 