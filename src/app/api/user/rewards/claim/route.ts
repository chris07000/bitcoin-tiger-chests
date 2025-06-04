import { NextResponse } from 'next/server';
import { claimReward, claimAllRewards } from '@/lib/ranking';

// POST /api/user/rewards/claim
export async function POST(request: Request) {
  try {
    const { walletAddress, rewardId, claimAll } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    let result;
    
    // Claim één specifieke reward of alle rewards
    if (claimAll) {
      result = await claimAllRewards(walletAddress);
    } else {
      if (!rewardId) {
        return NextResponse.json(
          { error: 'Reward ID is required when not claiming all rewards' },
          { status: 400 }
        );
      }
      
      result = await claimReward(walletAddress, rewardId);
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to claim reward' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      { error: 'Failed to claim reward' },
      { status: 500 }
    );
  }
} 