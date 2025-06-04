import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }
    
    // Find the wallet ID for this address
    const wallet = await prisma.wallet.findUnique({
      where: { address }
    })
    
    if (!wallet) {
      // No tickets found for this wallet, but this is not an error
      return NextResponse.json({ tickets: {} })
    }
    
    // Get all tickets purchased by this wallet
    const tickets = await prisma.raffleTicket.findMany({
      where: { walletId: wallet.id }
    })
    
    // Organize tickets by raffle
    const ticketsByRaffle: { [key: number]: number } = {}
    
    tickets.forEach(ticket => {
      ticketsByRaffle[ticket.raffleId] = (ticketsByRaffle[ticket.raffleId] || 0) + ticket.quantity
    })
    
    return NextResponse.json({ tickets: ticketsByRaffle })
  } catch (error) {
    console.error('Error fetching user tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user tickets', details: String(error) },
      { status: 500 }
    )
  }
} 