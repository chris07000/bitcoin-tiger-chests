import { NextResponse } from 'next/server';
import { generateMonthlyRakeback, generateWeeklyLossCompensation } from '@/lib/ranking';

// Veiligheidscheck voor admin-only endpoints
const verifyAdminKey = (request: Request) => {
  const apiKey = request.headers.get('x-api-key');
  const adminKey = process.env.ADMIN_API_KEY;
  
  if (!apiKey || apiKey !== adminKey) {
    return false;
  }
  
  return true;
};

// POST /api/admin/generate-rewards
export async function POST(request: Request) {
  try {
    // Controleer de admin API key
    if (!verifyAdminKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { type } = await request.json();
    
    if (!type || !['monthly', 'weekly'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid reward type. Must be "monthly" or "weekly"' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (type === 'monthly') {
      result = await generateMonthlyRakeback();
    } else if (type === 'weekly') {
      result = await generateWeeklyLossCompensation();
    }
    
    // Check if result is defined and has the expected structure
    if (!result || !result.success) {
      return NextResponse.json(
        { error: result?.error || 'Failed to generate rewards' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating rewards:', error);
    return NextResponse.json(
      { error: 'Failed to generate rewards' },
      { status: 500 }
    );
  }
} 