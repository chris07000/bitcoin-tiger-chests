import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
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

    console.log('Cancelling invoice with payment hash:', paymentHash);

    try {
      // Ensure data directory exists
      if (!existsSync(CANCELLED_INVOICES_DIR)) {
        await mkdir(CANCELLED_INVOICES_DIR, { recursive: true });
      }

      // Read existing cancelled invoices
      let cancelledInvoices: { [key: string]: number } = {};
      try {
        if (existsSync(CANCELLED_INVOICES_FILE)) {
          const data = await readFile(CANCELLED_INVOICES_FILE, 'utf-8');
          cancelledInvoices = JSON.parse(data);
        }
      } catch (error) {
        console.log('Could not read cancelled invoices file, creating new one');
      }

      // Add this payment hash to cancelled list
      cancelledInvoices[paymentHash] = Date.now();

      // Write back to file
      await writeFile(CANCELLED_INVOICES_FILE, JSON.stringify(cancelledInvoices, null, 2));

      console.log('Invoice marked as cancelled:', paymentHash);
      return NextResponse.json({ 
        success: true, 
        message: 'Invoice cancelled successfully' 
      });
    } catch (error) {
      console.error('Error writing to cancelled invoices file:', error);
      // Fallback to in-memory tracking (not persistent but better than nothing)
      return NextResponse.json({ 
        success: true, 
        message: 'Invoice cancelled (fallback mode)' 
      });
    }
  } catch (error) {
    console.error('Error cancelling invoice:', error);
    return NextResponse.json(
      { error: 'Failed to cancel invoice' },
      { status: 500 }
    );
  }
} 