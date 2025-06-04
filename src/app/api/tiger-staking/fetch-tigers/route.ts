import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { KNOWN_BITCOIN_TIGER_IDS, isKnownBitcoinTiger, TIGER_PATTERNS } from '@/server/services/tigerStakingService';

// Fallback data verwijderd - we returneren nu lege arrays als er geen tigers gevonden worden

export async function GET(
  request: NextRequest
) {
  try {
    // Haal de wallet address uit de query parameters
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');

    // Valideer de wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    console.log(`Fetching Bitcoin Tigers for wallet: ${walletAddress}`);
    
    try {
      // Magic Eden API aanroepen voor Bitcoin Tigers collectie
      // Magic Eden BTC endpoints - https://api-mainnet.magiceden.dev/v2/ord/btc
      const response = await axios.get('https://api-mainnet.magiceden.dev/v2/ord/btc/wallets/tokens', {
        params: { 
          wallet: walletAddress,
          limit: 100, // Maximaal 100 items ophalen
          offset: 0,
          // Momenteel filteren we op client side door bekende IDs te checken
          // collectionSymbol: 'tigers', // Bitcoin Tigers collectie
          sortBy: 'inscriptionNumber', // Sorteer op inscription nummer
          sortDirection: 'desc' // Nieuwste eerst
        },
        headers: {
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 seconden timeout
      });
      
      if (response.data && response.data.tokens) {
        console.log(`Found ${response.data.tokens.length} total inscriptions for wallet ${walletAddress}`);
        
        // Filter op bekende Bitcoin Tiger IDs
        const filteredTokens = response.data.tokens.filter((token: any) => {
          // Check if this is a known Bitcoin Tiger by ID
          const isKnown = isKnownBitcoinTiger(token.id);
          
          // Als het een bekende Tiger is, log dit
          if (isKnown) {
            console.log(`Found known Bitcoin Tiger: ${token.id}`);
          }
          
          return isKnown;
        });
        
        console.log(`Found ${filteredTokens.length} Bitcoin Tigers from known IDs`);
        
        // Als we geen bekende Tigers vinden, probeer te filteren op naam of eigenschappen
        let tigers = filteredTokens;
        
        if (filteredTokens.length === 0) {
          console.log('No known Bitcoin Tigers found, trying to identify by properties...');
          
          // Probeer te filteren op basis van naam of eigenschappen
          tigers = response.data.tokens.filter((token: any) => {
            // Check for tiger-related properties
            const name = (token.name || '').toLowerCase();
            const collection = (token.collection || '').toLowerCase();
            
            const isTiger = 
              name.includes('tiger') || 
              collection.includes('tiger') ||
              name.includes('guardian') ||  // Rune Guardians
              collection.includes('guardian') ||  // Rune Guardians 
              collection.includes('rune') ||  // Rune Guardians
              (token.collectionSymbol && (
                token.collectionSymbol.toLowerCase() === 'tigers' ||
                token.collectionSymbol.toLowerCase().includes('guardian') ||
                token.collectionSymbol.toLowerCase().includes('rune')
              ));
              
            return isTiger;
          });
          
          console.log(`Found ${tigers.length} potential Bitcoin Tigers by properties`);
        }
        
        // Transformeer de data naar het gewenste formaat
        const formattedTigers = await Promise.all(tigers.map(async (token: any, index: number) => {
          // Bepaal de meest betrouwbare image URL
          const imageUri = token.imageURI || token.contentURI;
          let imageUrl;
          
          // Controleer of het een Rune Guardian is op basis van collection of properties
          const isRuneGuardian = 
            (token.collection && token.collection.toLowerCase().includes('guardian')) ||
            (token.collection && token.collection.toLowerCase().includes('rune')) ||
            (token.name && token.name.toLowerCase().includes('guardian')) ||
            (token.name && token.name.toLowerCase().includes('rune'));
          
          // Log extra debug info
          if (isRuneGuardian) {
            console.log(`Rune Guardian gevonden in Magic Eden resultaten: ${token.id}`);
            console.log(`Details: naam=${token.name}, collection=${token.collection}, type=${token.contentType || 'onbekend'}`);
          }
          
          // Voor Rune Guardians gebruiken we een marker
          if (isRuneGuardian) {
            console.log(`Rune Guardian gevonden: ${token.id}`);
            // Geen image URL voor Rune Guardians, frontend toont default
            imageUrl = '';
          } else {
            // Voor normale tigers gebruiken we direct de Hiro API
            imageUrl = `https://api.hiro.so/ordinals/v1/inscriptions/${token.id}/content`;
          }
          
          return {
            id: token.id,
            key: `${token.id}_${index}`, // Add a unique key for React
            name: token.name || `${isKnownBitcoinTiger(token.id) ? 'Bitcoin Tiger' : 'Rune Guardian'} #${token.inscriptionNumber || '?'}`,
            image: imageUrl,
            inscriptionNumber: token.inscriptionNumber,
            inscriptionId: token.id,
            isKnownTiger: isKnownBitcoinTiger(token.id),
            isRuneGuardian: isRuneGuardian,
            // Metadata voor debugging
            directContentUrl: `https://ordinals.com/content/${token.id}`,
            originalImageUrl: imageUri
          };
        }));
        
        // Return de tigers - geen fallback, gewoon een lege array als er niets is
        return NextResponse.json({ 
          tokens: formattedTigers,
          count: formattedTigers.length,
          source: 'magic-eden-api',
          usingFallback: false,
          knownCount: filteredTokens.length
        });
      } else {
        throw new Error('Invalid response format from Magic Eden API');
      }
    } catch (apiError: any) {
      console.error('Error fetching Bitcoin Tigers from API:', apiError);
      console.error('API Error details:', apiError.message);
      
      if (apiError.response) {
        console.error('API Status:', apiError.response.status);
        console.error('API Response data:', apiError.response.data);
      }
      
      // Probeer alternatieve API - Hiro API
      try {
        console.log('Attempting to fetch from Hiro API...');
        
        // Array om alle inscriptions op te slaan
        let allInscriptions: any[] = [];
        let offset = 0;
        const limit = 60; // Hiro's standaard limit per request
        const maxInscriptions = 300; // Maximum aantal inscriptions dat we willen ophalen
        let hasMore = true;
        
        // Fetch inscriptions met paginatie
        while (hasMore && allInscriptions.length < maxInscriptions) {
          const hiro_response = await axios.get(`https://api.hiro.so/ordinals/v1/inscriptions`, {
            params: {
              address: walletAddress,
              limit: limit,
              offset: offset
            },
            timeout: 10000
          });
          
          if (hiro_response.data && hiro_response.data.results && hiro_response.data.results.length > 0) {
            const currentBatch = hiro_response.data.results;
            allInscriptions = [...allInscriptions, ...currentBatch];
            console.log(`Fetched ${currentBatch.length} inscriptions, total now: ${allInscriptions.length}`);
            
            // Ga naar de volgende pagina
            offset += limit;
            
            // Check of we meer moeten ophalen
            hasMore = currentBatch.length === limit;
          } else {
            hasMore = false;
          }
        }
        
        if (allInscriptions.length > 0) {
          console.log(`Found total of ${allInscriptions.length} inscriptions from Hiro API`);
          
          // First check for known Bitcoin Tiger IDs
          const knownTigers = allInscriptions.filter((inscription: any) => 
            isKnownBitcoinTiger(inscription.id)
          );
          
          console.log(`Found ${knownTigers.length} known Bitcoin Tigers from Hiro API`);
          
          // If no known Tigers found, try to filter by properties
          let tigers = knownTigers;
          
          if (knownTigers.length === 0) {
            tigers = allInscriptions.filter((inscription: any) => {
              // Filter op basis van naam of eigenschappen die Tigers identificeren
              const isTiger = 
                (inscription.meta?.name && (
                  inscription.meta.name.toLowerCase().includes('tiger') ||
                  inscription.meta.name.toLowerCase().includes('guardian') ||
                  inscription.meta.name.toLowerCase().includes('rune')
                )) ||
                (inscription.meta?.collection?.name && (
                  inscription.meta.collection.name.toLowerCase().includes('tiger') ||
                  inscription.meta.collection.name.toLowerCase().includes('guardian') ||
                  inscription.meta.collection.name.toLowerCase().includes('rune')
                )) ||
                (inscription.collection_symbol && (
                  inscription.collection_symbol.toLowerCase() === 'tigers' ||
                  inscription.collection_symbol.toLowerCase().includes('guardian') ||
                  inscription.collection_symbol.toLowerCase().includes('rune')
                ));
              
              return isTiger && inscription.content_type?.startsWith('image/');
            });
            
            console.log(`Found ${tigers.length} potential Bitcoin Tigers by properties from Hiro API`);
          }
          
          // Format the tigers
          const formattedTigers = await Promise.all(tigers.map(async (inscription: any, index: number) => {
            // Bepaal de beste URL voor de afbeelding
            // Specifieke URL strategie voor Rune Guardians en Tigers
            const isRuneGuardian = typeof TIGER_PATTERNS.find((p: {
              baseId: string;
              maxIndex: number;
              series: string | number;
            }) => 
              inscription.id.startsWith(p.baseId) && 
              typeof p.series === 'string' && 
              p.series.includes('rune')
            ) !== 'undefined';
            
            let imageUrl;
            
            // Voor debugging, log de content type
            console.log(`Inscription ${inscription.id} content type: ${inscription.content_type}`);
            
            // Verbeterde URL strategie voor Rune Guardians en Tigers
            if (isRuneGuardian) {
              console.log(`Rune Guardian gevonden: ${inscription.id}`);
              // Geen image URL voor Rune Guardians, frontend toont default
              imageUrl = '';
            } else {
              // Normale tigers direct via Hiro API
              imageUrl = `https://api.hiro.so/ordinals/v1/inscriptions/${inscription.id}/content`;
            }
            
            const collectionType = isRuneGuardian ? 'Rune Guardian' : 'Bitcoin Tiger';
            
            return {
              id: inscription.id,
              key: `${inscription.id}_${index}`, // Add a unique key for React
              name: inscription.meta?.name || `${collectionType} #${inscription.number || '?'}`,
              image: imageUrl, // Meervoudige image URLs voor Rune Guardians
              inscriptionNumber: inscription.number,
              inscriptionId: inscription.id,
              isKnownTiger: isKnownBitcoinTiger(inscription.id),
              isRuneGuardian: isRuneGuardian,
              // Metadata voor debugging
              contentType: inscription.content_type,
              collection: collectionType
            };
          }));
          
          return NextResponse.json({ 
            tokens: formattedTigers,
            count: formattedTigers.length,
            source: 'hiro-api',
            usingFallback: false,
            knownCount: knownTigers.length,
            totalFetched: allInscriptions.length
          });
        } else {
          console.log('No inscriptions found from Hiro API');
        }
      } catch (fallbackError) {
        console.error('Hiro API also failed:', fallbackError);
      }
      
      // Als beide API's falen, geef een lege array terug
      console.log('Both APIs failed, returning empty array');
      return NextResponse.json({ 
        tokens: [],
        count: 0,
        usingFallback: false,
        error: 'Bitcoin Tigers could not be retrieved. Please try again later.',
        knownCount: 0
      });
    }
  } catch (error: any) {
    console.error('Error in fetch-tigers endpoint:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 