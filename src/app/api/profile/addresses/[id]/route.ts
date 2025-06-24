import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 })
    }

    // Delete the crypto address
    await prisma.cryptoAddress.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting crypto address:', error)
    return NextResponse.json({ error: 'Failed to delete crypto address' }, { status: 500 })
  }
} 