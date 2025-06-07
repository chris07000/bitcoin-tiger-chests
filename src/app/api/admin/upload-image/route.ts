import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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

    // Check if Blob storage is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { 
          error: 'Image upload not configured. Please add BLOB_READ_WRITE_TOKEN to your Vercel environment variables.',
          hint: 'Go to Vercel Dashboard → Project Settings → Environment Variables'
        },
        { status: 503 }
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

    try {
      // Upload naar Vercel Blob Storage
      const blob = await put(fileName, file, {
        access: 'public',
      });

      console.log('Image uploaded to Vercel Blob:', blob.url);
      
      return NextResponse.json({
        success: true,
        filePath: blob.url // Return the full Blob URL
      });
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      return NextResponse.json(
        { error: 'Failed to save the image to cloud storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: String(error) },
      { status: 500 }
    );
  }
} 