'use client'

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';
import { useWallet } from '@/context/WalletContext';

interface JackpotWinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  walletAddress: string;
}

export default function JackpotWinnerModal({ isOpen, onClose, amount, walletAddress }: JackpotWinnerModalProps) {
  const { refreshBalance } = useWallet();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        // Links
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x: 0.2, y: 0.5 }
        });

        // Rechts
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x: 0.8, y: 0.5 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleClaim = async () => {
    if (isClaiming) return;

    try {
      setIsClaiming(true);
      
      const response = await fetch(`/api/wallet/${walletAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'jackpot',
          amount: amount,
          paymentHash: `jackpot-${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim jackpot');
      }

      const data = await response.json();
      
      if (data.success) {
        await refreshBalance();
        toast.success('Gefeliciteerd! Jackpot is toegevoegd aan je balance! 🎉');
        onClose();
      } else {
        throw new Error('Jackpot claim failed');
      }
    } catch (error) {
      console.error('Error claiming jackpot:', error);
      toast.error('Er ging iets mis bij het claimen van de jackpot');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      {/* Overlay */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)' }} />
      
      {/* Modal */}
      <div style={{ position: 'relative', width: '90%', maxWidth: '600px', margin: '0 20px', background: 'linear-gradient(to bottom, #f59e0b, #d97706, #b45309)', padding: '32px', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center' }}>
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-24px', left: '-24px', right: '-24px', bottom: '-24px', backgroundColor: '#fbbf24', opacity: 0.2, borderRadius: '8px', animation: 'pulse 2s infinite' }} />
        
        <h2 style={{ fontSize: '3.75rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem', animation: 'pulse 2s infinite' }}>
          JACKPOT WINNER!
        </h2>
        
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '24px', marginBottom: '2rem' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            {amount.toLocaleString()} sats
          </p>
          <p style={{ fontSize: '1.25rem', color: '#fef08a', wordBreak: 'break-all' }}>
            {walletAddress}
          </p>
        </div>

        <button
          onClick={handleClaim}
          onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
          onMouseUp={e => e.currentTarget.style.transform = isHovering ? 'translateY(-2px)' : 'translateY(0)'}
          onMouseOver={e => {
            setIsHovering(true);
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
            if (!isClaiming) {
              e.currentTarget.style.backgroundColor = '#16a34a';
            }
          }}
          onMouseOut={e => {
            setIsHovering(false);
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
            if (!isClaiming) {
              e.currentTarget.style.backgroundColor = '#22c55e';
            }
          }}
          disabled={isClaiming}
          style={{ 
            padding: '16px 48px',
            backgroundColor: isClaiming ? '#d1d5db' : '#22c55e',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            cursor: isClaiming ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            border: 'none',
            outline: 'none',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            transform: 'translateY(0)'
          }}
        >
          {isClaiming ? 'Claiming...' : 'Claim Jackpot'}
        </button>
      </div>
    </div>
  );
} 