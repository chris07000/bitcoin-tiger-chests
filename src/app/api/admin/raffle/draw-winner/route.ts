import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Admin API key - normaal gesproken zou je dit in een .env file zetten
const ADMIN_API_KEY = 'Bitcoin-Tiger-Admin-Secret-Key';

export async function POST(request: NextRequest) {
  try {
    // Controleer de API key voor authenticatie
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: missing API key' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.split('Bearer ')[1];
    if (apiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: invalid API key' },
        { status: 401 }
      );
    }

    // Controleer of prisma beschikbaar is
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 500 }
      );
    }

    // Verwerk de request data
    const data = await request.json();
    const { raffleId } = data;

    if (!raffleId) {
      return NextResponse.json(
        { error: 'Missing raffle ID' },
        { status: 400 }
      );
    }

    // Haal de raffle op
    const raffle = await prisma.raffle.findUnique({
      where: { id: parseInt(raffleId) }
    });

    if (!raffle) {
      return NextResponse.json(
        { error: 'Raffle not found' },
        { status: 404 }
      );
    }

    if (raffle.winner) {
      return NextResponse.json(
        { error: 'This raffle already has a winner', winner: raffle.winner },
        { status: 400 }
      );
    }

    // Haal alle tickets op voor deze raffle
    const tickets = await prisma.raffleTicket.findMany({
      where: { raffleId: parseInt(raffleId) },
      include: { Wallet: true }
    });

    if (!tickets || tickets.length === 0) {
      return NextResponse.json(
        { error: 'No tickets purchased for this raffle' },
        { status: 400 }
      );
    }

    // Selecteer een willekeurige ticket
    const ticketPool: string[] = [];
    tickets.forEach(ticket => {
      // Voeg wallet address toe aan de pool voor elk ticket dat gekocht is
      for (let i = 0; i < ticket.quantity; i++) {
        ticketPool.push(ticket.Wallet.address);
      }
    });

    // Controleer of er tickets zijn
    if (ticketPool.length === 0) {
      return NextResponse.json(
        { error: 'No tickets in pool' },
        { status: 400 }
      );
    }

    // Kies willekeurig een winnaar
    const winnerIndex = Math.floor(Math.random() * ticketPool.length);
    const winnerAddress = ticketPool[winnerIndex];

    // Update de raffle met de winnaar
    const updatedRaffle = await prisma.raffle.update({
      where: { id: parseInt(raffleId) },
      data: { 
        winner: winnerAddress,
        winnerPickedAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log(`Winner drawn for raffle ${raffleId}: ${winnerAddress}`);

    return NextResponse.json({
      success: true,
      message: 'Winner successfully drawn',
      raffle: updatedRaffle
    });
  } catch (error) {
    console.error('Error drawing winner:', error);
    return NextResponse.json(
      { error: 'Failed to draw winner', details: String(error) },
      { status: 500 }
    );
  }
} 