import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Total revenue by source
    const revenueBySource = await prisma.houseRevenue.groupBy({
      by: ['source'],
      where: {
        date: { gte: startDate }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });
    
    // Daily revenue trend
    const dailyRevenue = await prisma.$queryRaw`
      SELECT 
        DATE(date) as day,
        SUM(amount) as total_amount,
        COUNT(*) as transaction_count
      FROM "HouseRevenue" 
      WHERE date >= ${startDate}
      GROUP BY DATE(date)
      ORDER BY day DESC
      LIMIT 30
    `;
    
    // Recent revenue transactions
    const recentTransactions = await prisma.houseRevenue.findMany({
      where: {
        date: { gte: startDate }
      },
      orderBy: {
        date: 'desc'
      },
      take: 20
    });
    
    // Total stats
    const totalStats = await prisma.houseRevenue.aggregate({
      where: {
        date: { gte: startDate }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });
    
    // All-time revenue
    const allTimeRevenue = await prisma.houseRevenue.aggregate({
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });
    
    const summary = {
      period: `${days} days`,
      totalRevenue: totalStats._sum.amount || 0,
      totalTransactions: totalStats._count || 0,
      allTimeRevenue: allTimeRevenue._sum.amount || 0,
      allTimeTransactions: allTimeRevenue._count || 0,
      averagePerDay: days > 0 ? (totalStats._sum.amount || 0) / days : 0,
      revenueBySource: revenueBySource.map(item => ({
        source: item.source,
        amount: item._sum.amount || 0,
        transactions: item._count || 0
      })),
      dailyTrend: dailyRevenue,
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        source: tx.source,
        description: tx.description,
        date: tx.date
      }))
    };
    
    console.log(`📊 Revenue Dashboard - ${days} days:`);
    console.log(`💰 Total Revenue: ${summary.totalRevenue} sats`);
    console.log(`📈 Average per day: ${Math.round(summary.averagePerDay)} sats`);
    console.log(`🏦 All-time: ${summary.allTimeRevenue} sats`);
    
    return NextResponse.json({
      success: true,
      summary
    });
    
  } catch (error) {
    console.error('❌ Error fetching revenue dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
} 