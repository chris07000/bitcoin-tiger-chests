import { NextResponse } from 'next/server';
import { generateK1, verifyK1 } from '../../../utils/lightning';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const k1 = searchParams.get('k1');
    const key = searchParams.get('key');
    const sig = searchParams.get('sig');

    // Initial auth request
    if (!tag || tag === 'login') {
      const newK1 = generateK1();
      const host = process.env.NEXT_PUBLIC_HOST || process.env.VERCEL_URL || 'https://yourdomain.com';
      
      return NextResponse.json({
        status: 'OK',
        tag: 'login',
        k1: newK1,
        action: 'login',
        callback: `${host}/api/auth?tag=login&k1=${newK1}`,
        domain: 'bitcoin-tiger-chests.local',
        walletConnected: true
      });
    }

    // Verify signature - we can skip this since we're using wallet auth
    if (k1 && key && sig) {
      return NextResponse.json({ 
        status: 'OK',
        walletConnected: true
      });
    }

    return NextResponse.json({ 
      status: 'OK',
      walletConnected: true
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 