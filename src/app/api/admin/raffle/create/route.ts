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
    const { name, description, image, ticketPrice, totalTickets, endsAt } = data;

    // Validatie
    if (!name || !description || !image || !ticketPrice || !totalTickets || !endsAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Creëer een nieuwe raffle
    const raffle = await prisma.raffle.create({
      data: {
        name,
        description,
        image,
        ticketPrice: parseFloat(ticketPrice),
        totalTickets: parseInt(totalTickets),
        soldTickets: 0,
        endsAt: new Date(endsAt),
        winner: null,
        updatedAt: new Date()
      }
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
      { error: 'Failed to create raffle', details: String(error) },
      { status: 500 }
    );
  }
} 