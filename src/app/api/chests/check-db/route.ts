import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Endpoint om de database rechtstreeks te controleren
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table') || 'ChestProgress';
    const walletAddress = url.searchParams.get('wallet');
    
    console.log(`Checking database table: ${table}`);
    
    // Rechtstreekse queries uitvoeren
    // We gebruiken $queryRaw om SQL rechtstreeks uit te voeren
    
    // Lijst van alle tabellen in de database
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('Database tables:', tables);
    
    // Query voor de specifieke tabel
    let tableData = [];
    let walletData = null;
    let chestProgressData = null;
    
    if (table === 'ChestProgress') {
      tableData = await prisma.$queryRaw`
        SELECT * FROM "ChestProgress"
      `;
      
      if (walletAddress) {
        // Vind eerst het wallet record
        const wallet = await prisma.wallet.findUnique({
          where: { address: walletAddress }
        });
        
        if (wallet) {
          walletData = wallet;
          
          // Vind de bijbehorende ChestProgress
          chestProgressData = await prisma.chestProgress.findUnique({
            where: { walletId: wallet.id }
          });
        }
      }
    } else if (table === 'Wallet') {
      if (walletAddress) {
        tableData = await prisma.$queryRaw`
          SELECT * FROM "Wallet" WHERE address = ${walletAddress}
        `;
      } else {
        tableData = await prisma.$queryRaw`
          SELECT * FROM "Wallet"
        `;
      }
    } else {
      // Voor andere tabellen, gebruik een veiligere methode
      try {
        // We kunnen geen directe tabel naam invoegen in een query string, dus we moeten dit anders doen
        if (table === 'TigerStaking') {
          tableData = await prisma.tigerStaking.findMany({
            take: 10
          });
        } else if (table === 'Transaction') {
          tableData = await prisma.transaction.findMany({
            take: 10
          });
        } else if (table === 'UserRanking') {
          tableData = await prisma.userRanking.findMany({
            take: 10
          });
        } else {
          tableData = [{message: `Table ${table} not explicitly supported`}];
        }
      } catch (tableError) {
        console.error(`Error querying table ${table}:`, tableError);
        tableData = [{error: `Failed to query table ${table}`}];
      }
    }
    
    return NextResponse.json({
      success: true,
      tables,
      tableData,
      walletData,
      chestProgressData,
      walletAddress
    });
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json(
      { error: 'Failed to check database', details: String(error) },
      { status: 500 }
    );
  }
} 