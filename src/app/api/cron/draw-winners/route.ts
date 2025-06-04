import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// API Key voor beveiliging van de cron route
const CRON_API_KEY = process.env.ADMIN_API_KEY;

export async function GET(request: Request) {
  try {
    // Controleer autorisatie
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    
    if (!apiKey || apiKey !== CRON_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
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

    // Zoek raffles die zijn afgelopen maar nog geen winnaar hebben
    const now = new Date();
    const expiredRaffles = await prisma.raffle.findMany({
      where: {
        endsAt: { lt: now },   // Raffles waarvan de eindtijd is verstreken
        winner: null,          // Die nog geen winnaar hebben
      }
    });

    // Geen verlopen raffles zonder winnaar
    if (expiredRaffles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired raffles found that need a winner',
        processed: 0
      });
    }

    // Aantal succesvol verwerkte raffles bijhouden
    let processedCount = 0;
    const results = [];

    // Loop door elke verlopen raffle
    for (const raffle of expiredRaffles) {
      try {
        // Haal alle tickets op voor deze raffle
        const tickets = await prisma.raffleTicket.findMany({
          where: { raffleId: raffle.id },
          include: { Wallet: true }
        });

        // Sla over als er geen tickets zijn verkocht
        if (!tickets || tickets.length === 0) {
          results.push({
            raffleId: raffle.id, 
            name: raffle.name,
            status: 'skipped', 
            reason: 'No tickets purchased'
          });
          continue;
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
          results.push({
            raffleId: raffle.id, 
            name: raffle.name,
            status: 'skipped', 
            reason: 'No valid tickets in pool'
          });
          continue;
        }

        // Kies willekeurig een winnaar
        const winnerIndex = Math.floor(Math.random() * ticketPool.length);
        const winnerAddress = ticketPool[winnerIndex];

        // Update de raffle met de winnaar
        await prisma.raffle.update({
          where: { id: raffle.id },
          data: { 
            winner: winnerAddress,
            winnerPickedAt: new Date(),
            updatedAt: new Date()
          }
        });

        // Log het resultaat
        console.log(`Auto-draw winner for raffle ${raffle.id}: ${winnerAddress}`);
        results.push({
          raffleId: raffle.id, 
          name: raffle.name,
          status: 'success', 
          winner: winnerAddress
        });
        processedCount++;
      } catch (raffleError) {
        console.error(`Error processing raffle ${raffle.id}:`, raffleError);
        results.push({
          raffleId: raffle.id, 
          name: raffle.name,
          status: 'error', 
          error: String(raffleError)
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} expired raffles`,
      processed: processedCount,
      results
    });

  } catch (error) {
    console.error('Error in auto draw winners:', error);
    return NextResponse.json(
      { error: 'Failed to process expired raffles', details: String(error) },
      { status: 500 }
    );
  }
} 