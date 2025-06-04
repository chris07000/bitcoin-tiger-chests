import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST endpoint - Sla wallet sessie op in een cookie
export async function POST(request: Request) {
  try {
    const { connectedWallet, walletAddress, publicKey, addressType } = await request.json();
    
    console.log(`POST /api/wallet/session - Setting wallet session for ${walletAddress}`);

    // Valideer de input
    if (!connectedWallet || !walletAddress) {
      return NextResponse.json({ error: "Wallet gegevens onvolledig" }, { status: 400 });
    }

    // Creëer de wallet sessie data
    const walletSessionData = {
      connectedWallet,
      walletAddress,
      publicKey: publicKey || null,
      addressType: addressType || null,
      timestamp: Date.now()
    };

    // Sla de wallet sessie op in een cookie
    // Gebruik een secure cookie die alleen via HTTPS toegankelijk is
    // Max-Age is 7 dagen (60 * 60 * 24 * 7 = 604800 seconden)
    cookies().set({
      name: 'wallet_session',
      value: JSON.stringify(walletSessionData),
      maxAge: 604800,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    });

    return NextResponse.json({
      success: true,
      message: "Wallet sessie succesvol opgeslagen"
    });
  } catch (error) {
    console.error("Error saving wallet session:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het opslaan van de wallet sessie" },
      { status: 500 }
    );
  }
}

// GET endpoint - Haal wallet sessie op uit cookie
export async function GET() {
  try {
    console.log('GET /api/wallet/session - Getting wallet session');
    
    // Haal de wallet sessie op uit de cookie
    const walletSessionCookie = cookies().get('wallet_session');
    
    if (!walletSessionCookie || !walletSessionCookie.value) {
      return NextResponse.json({ 
        success: false,
        authenticated: false,
        message: "Geen wallet sessie gevonden"
      });
    }
    
    // Parse de wallet sessie data
    const walletSessionData = JSON.parse(walletSessionCookie.value);
    
    // Controleer of de sessie niet te oud is (max 7 dagen)
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 dagen in milliseconden
    if (Date.now() - walletSessionData.timestamp > MAX_AGE) {
      // Verwijder de verlopen cookie
      cookies().delete('wallet_session');
      
      return NextResponse.json({
        success: false,
        authenticated: false,
        message: "Wallet sessie verlopen"
      });
    }
    
    return NextResponse.json({
      success: true,
      authenticated: true,
      walletData: {
        connectedWallet: walletSessionData.connectedWallet,
        walletAddress: walletSessionData.walletAddress,
        publicKey: walletSessionData.publicKey,
        addressType: walletSessionData.addressType
      }
    });
  } catch (error) {
    console.error("Error fetching wallet session:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van de wallet sessie" },
      { status: 500 }
    );
  }
}

// DELETE endpoint - Verwijder wallet sessie cookie
export async function DELETE() {
  try {
    console.log('DELETE /api/wallet/session - Removing wallet session');
    
    // Verwijder de wallet sessie cookie
    cookies().delete('wallet_session');
    
    return NextResponse.json({
      success: true,
      message: "Wallet sessie succesvol verwijderd"
    });
  } catch (error) {
    console.error("Error deleting wallet session:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het verwijderen van de wallet sessie" },
      { status: 500 }
    );
  }
} 