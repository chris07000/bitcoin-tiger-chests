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