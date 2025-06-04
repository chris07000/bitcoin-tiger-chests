'use client'
import { useState, useEffect } from 'react'

export default function JackpotBanner() {
  const [jackpotAmount, setJackpotAmount] = useState(250000)
  const [lastWinner, setLastWinner] = useState<string | null>(null)
  const [isGlowing, setIsGlowing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const fetchJackpot = async () => {
    try {
      const response = await fetch('/api/jackpot');
      if (!response.ok) throw new Error('Failed to fetch jackpot');
      const data = await response.json();
      setJackpotAmount(data.balance);
      if (data.lastWinner) setLastWinner(data.lastWinner);
    } catch (error) {
      console.error('Error fetching jackpot:', error);
    }
  };

  // Check if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch jackpot every 30 seconds
  useEffect(() => {
    fetchJackpot();
    const interval = setInterval(fetchJackpot, 30000);
    return () => clearInterval(interval);
  }, []);

  // Glow effect when jackpot updates
  useEffect(() => {
    setIsGlowing(true);
    const timeout = setTimeout(() => setIsGlowing(false), 500);
    return () => clearTimeout(timeout);
  }, [jackpotAmount]);

  // Format jackpot amount for display
  const formatJackpot = (amount: number) => {
    if (isMobile && amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (isMobile && amount >= 10000) {
      return `${Math.round(amount / 1000)}K`;
    }
    return amount.toLocaleString();
  };

  // Format winner address for display
  const formatWinner = (address: string) => {
    if (isMobile) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return address;
  };

  return (
    <div className="jackpot-banner-container">
      <div className="jackpot-banner">
        <div className="jackpot-inner">
          <div className="jackpot-title">
            <span className="jackpot-text">PROGRESSIVE</span>
            <span className="jackpot-text">JACKPOT</span>
          </div>
          
          <div className={`jackpot-amount ${isGlowing ? 'jackpot-glow' : ''}`}>
            {formatJackpot(jackpotAmount)} sats
          </div>

          {lastWinner && (
            <div className="jackpot-last-winner">
              {isMobile ? 'Winner: ' : 'Last Winner: '}
              {formatWinner(lastWinner)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 