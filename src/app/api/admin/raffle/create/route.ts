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
      console.error('Prisma client not available');
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 500 }
      );
    }

    // Verwerk de request data
    const {
      name,
      description,
      image,
      ticketPrice,
      totalTickets,
      endsAt,
      isFree,
      pointCost,
      floorPrice,
      isCompletelyFree,
      maxTicketsPerWallet
    } = await request.json();

    // Validate required fields
    if (!name || !description || !image || !totalTickets || !endsAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Additional validation for different raffle types
    if (isCompletelyFree) {
      // Completely free marketing raffles
      if (isFree) {
        return NextResponse.json(
          { error: 'Raffle cannot be both completely free and Tiger Points free' },
          { status: 400 }
        );
      }
      if (!maxTicketsPerWallet || maxTicketsPerWallet < 1) {
        return NextResponse.json(
          { error: 'Max tickets per wallet is required for completely free raffles and must be at least 1' },
          { status: 400 }
        );
      }
    } else if (isFree) {
      // Tiger Points free raffles
      if (!pointCost || pointCost < 1) {
        return NextResponse.json(
          { error: 'Point cost is required for Tiger Points raffles and must be at least 1' },
          { status: 400 }
        );
      }
    } else {
      // Paid raffles
      if (!ticketPrice || ticketPrice < 1) {
        return NextResponse.json(
          { error: 'Ticket price is required for paid raffles and must be at least 1' },
          { status: 400 }
        );
      }
    }

    // Parse the end date
    const endDate = new Date(endsAt);
    
    if (isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid end date' },
        { status: 400 }
      );
    }

    // Check if end date is in the future
    if (endDate <= new Date()) {
      return NextResponse.json(
        { error: 'End date must be in the future' },
        { status: 400 }
      );
    }

    // Create the raffle
    const raffle = await prisma.raffle.create({
      data: {
        name,
        description,
        image,
        ticketPrice: parseFloat(ticketPrice),
        totalTickets: parseInt(totalTickets),
        endsAt: endDate,
        isFree: Boolean(isFree),
        pointCost: isFree ? parseInt(pointCost) : null,
        floorPrice: floorPrice ? parseFloat(floorPrice) : 300.0,
        isCompletelyFree: Boolean(isCompletelyFree),
        maxTicketsPerWallet: isCompletelyFree ? parseInt(maxTicketsPerWallet) : null
      }
    }).catch((error) => {
      console.error('Prisma raffle creation error:', error);
      throw error;
    });

    console.log('New raffle created:', raffle);

    return NextResponse.json({
      success: true,
      message: 'Raffle created successfully',
      raffle
    });
  } catch (error) {
    console.error('Error creating raffle:', error);
    return NextResponse.json(
      { error: 'Failed to create raffle', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 