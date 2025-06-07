import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const CANCELLED_INVOICES_DIR = path.join(process.cwd(), 'data');
const CANCELLED_INVOICES_FILE = path.join(CANCELLED_INVOICES_DIR, 'cancelled-invoices.json');

export async function POST(request: NextRequest) {
  try {
    const { paymentHash } = await request.json();
    
    if (!paymentHash) {
      return NextResponse.json(
        { error: 'Payment hash is required' },
        { status: 400 }
      );
    }

    try {
      // Check if cancelled invoices file exists
      if (!existsSync(CANCELLED_INVOICES_FILE)) {
        return NextResponse.json({ 
          isCancelled: false 
        });
      }

      // Read cancelled invoices
      const data = await readFile(CANCELLED_INVOICES_FILE, 'utf-8');
      const cancelledInvoices: { [key: string]: number } = JSON.parse(data);

      // Check if this payment hash is in the cancelled list
      const isCancelled = paymentHash in cancelledInvoices;
      
      console.log('Checked cancelled status for:', paymentHash, 'Result:', isCancelled);

      return NextResponse.json({ 
        isCancelled 
      });
    } catch (error) {
      console.error('Error reading cancelled invoices file:', error);
      // If we can't read the file, assume not cancelled to avoid blocking legitimate payments
      return NextResponse.json({ 
        isCancelled: false 
      });
    }
  } catch (error) {
    console.error('Error checking cancelled invoice:', error);
    return NextResponse.json(
      { error: 'Failed to check cancelled status' },
      { status: 500 }
    );
  }
} 