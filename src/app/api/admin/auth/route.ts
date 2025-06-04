import { NextRequest, NextResponse } from 'next/server';

// Laad de admin credentials uit environment variabelen
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Controleer of de environment variabelen zijn ingesteld
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_API_KEY) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { username, password } = await request.json();
    
    // Valideer de admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Login success, stuur API key terug
      return NextResponse.json({
        success: true,
        token: ADMIN_API_KEY,
      });
    }
    
    // Invalid credentials
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in admin authentication:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 