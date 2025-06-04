import crypto from 'crypto';
import { bech32 } from 'bech32';

export function generateK1(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const k1 = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  console.log('Debug - Generated k1:', k1);
  return k1;
}

export function bech32Encode(prefix: string, data: string): string {
  const words = bech32.toWords(Buffer.from(data, 'utf8'));
  return bech32.encode(prefix, words, 1023);
}

export function createLNURLAuth(baseUrl: string, k1: string): string {
  console.log('Debug - LNURL inputs:', { baseUrl, k1 });

  // Remove protocol and trailing slashes
  const cleanBaseUrl = baseUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  console.log('Debug - Cleaned base URL:', cleanBaseUrl);
  
  // Create the auth URL according to LNURL-auth spec
  const params = new URLSearchParams({
    tag: 'login',
    k1: k1,
    action: 'login'
  });
  
  const url = `https://${cleanBaseUrl}/api/auth?${params.toString()}`;
  console.log('Debug - Full auth URL:', url);
  
  // Convert to bech32 format
  const words = bech32.toWords(Buffer.from(url, 'utf8'));
  const encoded = bech32.encode('lnurl', words, 1023).toUpperCase();
  console.log('Debug - Final LNURL:', encoded);
  
  return encoded;
}

export async function verifyK1(k1: string, key: string, sig: string): Promise<boolean> {
  console.log('Debug - Verify K1 inputs:', { k1, key, sig });
  
  try {
    const messageBuffer = Buffer.from(k1, 'hex');
    const signatureBuffer = Buffer.from(sig, 'hex');
    const publicKeyBuffer = Buffer.from(key, 'hex');

    const result = crypto.verify(
      'sha256',
      messageBuffer,
      publicKeyBuffer,
      signatureBuffer
    );

    console.log('Debug - Verification result:', result);
    return result;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
} 