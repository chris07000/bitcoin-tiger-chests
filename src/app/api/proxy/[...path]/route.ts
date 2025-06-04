import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params in Next.js 15
    const { path: pathSegments } = await params;
    
    // Haal de benodigde informatie uit de URL
    const path = pathSegments || [];
    const id = path[0];
    
    if (!id) {
      // Direct fallback afbeelding teruggeven als er geen ID is
      return NextResponse.redirect(new URL('/guardian-default.png', request.url));
    }
    
    // Specifieke URL voor Rune Guardians (direct r.jpg)
    const url = `https://ordinals.com/content/${id}r.jpg`;
    
    try {
      // Haalt de content op van de echte bron - korte timeout voor snellere fallback
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 3000,
        headers: {
          'Accept': 'image/jpg,image/jpeg,image/png,image/*'
        }
      });
      
      // Controleer of we een geldige afbeelding hebben ontvangen (minimaal 1000 bytes)
      if (!response.data || response.data.length < 1000) {
        throw new Error('Invalid image response (too small)');
      }
      
      // Stuur de data terug met het juiste content type
      return new NextResponse(response.data, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      // Direct fallback afbeelding teruggeven
      return NextResponse.redirect(new URL('/guardian-default.png', request.url));
    }
  } catch (error) {
    // Direct fallback afbeelding teruggeven
    return NextResponse.redirect(new URL('/guardian-default.png', request.url));
  }
} 