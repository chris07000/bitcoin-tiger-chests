import { NextRequest, NextResponse } from 'next/server';

// API key voor beveiliging
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

// Interval ID om bij te houden of de cron al loopt
let cronIntervalId: NodeJS.Timeout | null = null;

// Functie om de winnaar-trekking API aan te roepen
async function callDrawWinnersAPI() {
  try {
    // Pas de base URL aan op basis van environment
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VERCEL_URL || 'https://yourdomain.com'
      : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      
    // Roep de API aan
    const response = await fetch(`${baseUrl}/api/cron/draw-winners?apiKey=${ADMIN_API_KEY}`, {
      method: 'GET',
    });
    
    const data = await response.json();
    console.log('Auto-draw winners cron job result:', data);
    
    // Controleer of er raffles zijn verwerkt
    if (data.processed > 0) {
      console.log(`${data.processed} raffle(s) processed and winners drawn automatically`);
    }
  } catch (error) {
    console.error('Error calling auto-draw winners API:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Controleer autorisatie met API Key
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split('Bearer ')[1] !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }
    
    // Haal interval in minuten uit request body, standaard 1 minuut
    const { intervalMinutes = 1 } = await request.json();
    
    // Controleer of cron al loopt
    if (cronIntervalId) {
      // Stop bestaande cron
      clearInterval(cronIntervalId);
      console.log('Previous auto-draw cron job stopped');
    }
    
    // Start nieuwe cron job
    const intervalMs = intervalMinutes * 60 * 1000;
    cronIntervalId = setInterval(callDrawWinnersAPI, intervalMs);
    
    console.log(`Auto-draw winners cron job started, interval: ${intervalMinutes} minute(s)`);
    
    // Voer gelijk een eerste check uit
    callDrawWinnersAPI();
    
    return NextResponse.json({
      success: true,
      message: `Auto-draw winners cron job started with interval of ${intervalMinutes} minute(s)`
    });
  } catch (error) {
    console.error('Error setting up auto-draw cron job:', error);
    return NextResponse.json(
      { error: 'Failed to setup auto-draw cron job', details: String(error) },
      { status: 500 }
    );
  }
}

// Route om de cron job te stoppen
export async function DELETE(request: NextRequest) {
  try {
    // Controleer autorisatie met API Key
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split('Bearer ')[1] !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }
    
    // Stop de cron job als deze loopt
    if (cronIntervalId) {
      clearInterval(cronIntervalId);
      cronIntervalId = null;
      console.log('Auto-draw winners cron job stopped');
      
      return NextResponse.json({
        success: true,
        message: 'Auto-draw winners cron job stopped'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'No active auto-draw winners cron job found to stop'
    });
  } catch (error) {
    console.error('Error stopping auto-draw cron job:', error);
    return NextResponse.json(
      { error: 'Failed to stop auto-draw cron job', details: String(error) },
      { status: 500 }
    );
  }
} 