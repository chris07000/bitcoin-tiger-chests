import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteContext {
  params: {
    id: string
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 })
    }

    // Delete the crypto address using raw query as fallback
    await prisma.$executeRaw`DELETE FROM "CryptoAddress" WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting crypto address:', error)
    return NextResponse.json({ error: 'Failed to delete crypto address' }, { status: 500 })
  }
} 