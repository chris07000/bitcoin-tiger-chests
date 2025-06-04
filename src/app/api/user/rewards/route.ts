import { NextResponse } from 'next/server';
import { getClaimableRewards } from '@/lib/ranking';

// GET /api/user/rewards?address=walletAddress
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('address');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    const result = await getClaimableRewards(walletAddress);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to get rewards' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting rewards:', error);
    return NextResponse.json(
      { error: 'Failed to get rewards' },
      { status: 500 }
    );
  }
} 