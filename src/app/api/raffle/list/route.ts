import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // 'active', 'ended', 'all'
    
    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    
    let where = {}
    const now = new Date()
    
    if (status === 'active') {
      where = { 
        endsAt: { gt: now },
        winner: null
      }
    } else if (status === 'ended') {
      where = { 
        OR: [
          { endsAt: { lte: now } },
          { winner: { not: null } }
        ]
      }
    }
    
    const raffles = await prisma.raffle.findMany({
      where,
      orderBy: [
        { endsAt: 'asc' }
      ]
    })
    
    console.log(`Fetched ${raffles.length} raffles with status: ${status || 'all'}`);
    
    return NextResponse.json({ raffles })
  } catch (error) {
    console.error('Error fetching raffles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch raffles', details: String(error) },
      { status: 500 }
    )
  }
} 