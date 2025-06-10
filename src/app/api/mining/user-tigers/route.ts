import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log(`🐅 Fetching real tigers for wallet: ${walletAddress}`);
    
    // Check cache first (1 hour cache)
    const cacheKey = `miningTigers_${walletAddress}`;
    const cacheTimestamp = `miningTigers_${walletAddress}_timestamp`;
    
    // Voor nu tijdelijk cache skippen voor testing
    // const cachedTigers = localStorage.getItem(cacheKey);
    // const cachedTime = localStorage.getItem(cacheTimestamp);
    
    // if (cachedTigers && cachedTime) {
    //   const cacheAge = Date.now() - parseInt(cachedTime);
    //   if (cacheAge < 3600000) { // 1 hour
    //     console.log('Using cached tiger data');
    //     return NextResponse.json({
    //       success: true,
    //       tigers: JSON.parse(cachedTigers)
    //     });
    //   }
    // }

    // Validate Bitcoin address
    if (!walletAddress.startsWith('bc') && !walletAddress.includes('@')) {
      return NextResponse.json({
        success: true,
        tigers: [],
        message: 'Invalid Bitcoin address format'
      });
    }

    try {
      // Use Hiro API to fetch real inscriptions
      console.log('🔍 Calling Hiro Ordinals API...');
      const response = await axios.get('https://api.hiro.so/ordinals/v1/inscriptions', {
        params: {
          address: walletAddress,
          limit: 60
        },
        timeout: 30000
      });

      if (!response.data || !response.data.results) {
        console.log('❌ Invalid response from Hiro API');
        return NextResponse.json({
          success: true,
          tigers: [],
          message: 'No inscriptions found'
        });
      }

      const inscriptions = response.data.results;
      console.log(`📄 Retrieved ${inscriptions.length} inscriptions from wallet`);

      // Filter for tigers (Bitcoin Tigers, not Tiger Artifacts)
      const tigers = inscriptions
        .filter((inscription: any) => isBitcoinTiger(inscription))
        .map((inscription: any) => {
          const tigerNumber = extractTigerNumber(inscription);
          return {
            id: inscription.id,
            tigerId: inscription.id,
            tigerName: generateTigerName(inscription, tigerNumber),
            tigerImage: `https://ordinals.com/content/${inscription.id}`,
            inscriptionNumber: tigerNumber,
            contentType: inscription.content_type,
            isAvailable: true // Available for mining
          };
        });

      console.log(`🐅 Found ${tigers.length} Bitcoin Tigers for mining`);

      // Log de gevonden tigers voor debugging
      if (tigers.length > 0) {
        console.log('Tigers found:', tigers.slice(0, 3).map(t => ({
          id: t.id.slice(0, 10) + '...',
          name: t.tigerName,
          number: t.inscriptionNumber
        })));
      }

      return NextResponse.json({
        success: true,
        tigers,
        totalTigers: tigers.length,
        walletAddress
      });

    } catch (apiError: any) {
      console.error('❌ API Error:', apiError.message);
      return NextResponse.json({
        success: true,
        tigers: [],
        message: 'Error fetching inscriptions'
      });
    }

  } catch (error) {
    console.error('❌ Error in user-tigers API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tigers' },
      { status: 500 }
    );
  }
}

// Check if inscription is a Bitcoin Tiger (not Tiger Artifact)
function isBitcoinTiger(inscription: any): boolean {
  // Known Bitcoin Tiger patterns (different from Tiger Artifacts)
  const BITCOIN_TIGER_PATTERNS = [
    "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei",
    "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i", 
    "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi",
    "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i"
  ];

  // Check tegen bekende Bitcoin Tiger IDs
  if (BITCOIN_TIGER_PATTERNS.some(pattern => inscription.id.startsWith(pattern))) {
    console.log(`✅ Matched known Bitcoin Tiger: ${inscription.id}`);
    return true;
  }

  // Check naam patterns
  const nameCheck = inscription.meta?.name && (
    inscription.meta.name.toLowerCase().includes('bitcoin tiger') ||
    inscription.meta.name.toLowerCase().includes('btc tiger') ||
    inscription.meta.name.match(/tiger\s*#?\d+/i)
  );

  // Check collectie
  const collectionCheck = inscription.collection_symbol && (
    inscription.collection_symbol.toLowerCase().includes('bitcointiger') ||
    inscription.collection_symbol.toLowerCase().includes('btctiger')
  );

  // Moet een afbeelding zijn
  const isImage = inscription.content_type && inscription.content_type.startsWith('image/');

  // EXCLUDE Tiger Artifacts (have different pattern)
  const isTigerArtifact = inscription.id.startsWith("8bbcfe18749d7d7644ce09eba10e86929e4a1642e2bb1e7a8ad76e4f5eff6f3ai");
  
  if (isTigerArtifact) {
    return false; // Skip Tiger Artifacts
  }

  return isImage && (nameCheck || collectionCheck);
}

// Extract tiger number from inscription
function extractTigerNumber(inscription: any): number {
  // Try to extract from name first
  if (inscription.meta?.name) {
    const match = inscription.meta.name.match(/(?:tiger\s*)?#?(\d+)/i);
    if (match) {
      return parseInt(match[1]);
    }
  }

  // Fallback: use last 4 chars of ID
  const idSuffix = inscription.id.slice(-8, -4);
  const numberFromId = parseInt(idSuffix, 16) % 10000;
  return numberFromId || 1;
}

// Generate tiger name from inscription data
function generateTigerName(inscription: any, tigerNumber: number): string {
  // Use existing name if available
  if (inscription.meta?.name && !inscription.meta.name.includes('Unnamed')) {
    return inscription.meta.name;
  }

  // Generate name based on number and ID
  const prefixes = [
    'Thunder', 'Lightning', 'Storm', 'Shadow', 'Golden', 'Silver',
    'Fire', 'Ice', 'Wind', 'Earth', 'Royal', 'Savage', 'Wild',
    'Mystic', 'Phantom', 'Ancient', 'Noble', 'Fierce'
  ];

  const suffixes = [
    'Tiger', 'Beast', 'Hunter', 'Warrior', 'Guardian', 'King',
    'Lord', 'Master', 'Champion', 'Legend', 'Spirit'
  ];

  const prefix = prefixes[tigerNumber % prefixes.length];
  const suffix = suffixes[(tigerNumber + 7) % suffixes.length];

  return `${prefix} ${suffix} #${tigerNumber}`;
} 