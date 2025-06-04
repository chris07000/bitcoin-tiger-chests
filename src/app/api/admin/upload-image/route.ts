import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Admin API key voor beveiliging
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Controleer autorisatie
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split('Bearer ')[1] !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }

    // Verwerk de formData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Controleer bestandstype
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Controleer bestandsgrootte (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Maak een unieke bestandsnaam
    const fileExt = file.name.split('.').pop();
    const fileName = `raffle-${uuidv4()}.${fileExt}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);

    // Converteer het bestand naar een ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Schrijf het bestand naar de publieke map
    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error('Error writing file to disk:', error);
      return NextResponse.json(
        { error: 'Failed to save the image' },
        { status: 500 }
      );
    }

    // Return het pad naar het bestand
    const publicPath = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      filePath: publicPath
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: String(error) },
      { status: 500 }
    );
  }
} 