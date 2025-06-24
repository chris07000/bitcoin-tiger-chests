'use client'
import { useState, useEffect } from 'react'

export default function JackpotBanner() {
  const [jackpotAmount, setJackpotAmount] = useState(250000)
  const [lastWinner, setLastWinner] = useState<string | null>(null)
  const [winnerProfile, setWinnerProfile] = useState<{displayName?: string, avatar?: string} | null>(null)
  const [isGlowing, setIsGlowing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const fetchJackpot = async () => {
    try {
      const response = await fetch('/api/jackpot');
      if (!response.ok) throw new Error('Failed to fetch jackpot');
      const data = await response.json();
      setJackpotAmount(data.balance);
      
      if (data.lastWinner && data.lastWinner !== lastWinner) {
        setLastWinner(data.lastWinner);
        
        // Fetch winner profile
        try {
          const profileResponse = await fetch('/api/profile/display', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addresses: [data.lastWinner] })
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setWinnerProfile(profileData[data.lastWinner] || null);
          }
        } catch (profileError) {
          console.error('Error fetching winner profile:', profileError);
          setWinnerProfile(null);
        }
      }
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
              <div className="winner-display">
                {winnerProfile?.avatar && (
                  <img 
                    src={winnerProfile.avatar} 
                    alt="Winner avatar" 
                    className="winner-avatar"
                  />
                )}
                <span className="winner-text">
                  {isMobile ? 'Winner: ' : 'Last Winner: '}
                  <span className="winner-name">
                    {winnerProfile?.displayName || formatWinner(lastWinner)}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .jackpot-banner-container {
          width: 100%;
          padding: 1rem 0;
          display: flex;
          justify-content: center;
          z-index: 10;
        }
        
        .jackpot-banner {
          width: 100%;
          max-width: 600px;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 50%, #FFA500 100%);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 
            0 8px 32px rgba(255, 107, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .jackpot-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shine 3s infinite;
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .jackpot-inner {
          position: relative;
          z-index: 1;
        }
        
        .jackpot-title {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.5rem;
        }
        
        .jackpot-text {
          font-size: 1.2rem;
          font-weight: 900;
          color: #000;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
          line-height: 1;
          letter-spacing: 1px;
        }
        
        .jackpot-amount {
          font-size: 2.5rem;
          font-weight: 900;
          color: #000;
          text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
          margin: 0.5rem 0;
          transition: all 0.3s ease;
        }
        
        .jackpot-glow {
          animation: glow 0.5s ease-in-out;
        }
        
        @keyframes glow {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }
        
        .jackpot-last-winner {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.2);
        }
        
        .winner-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .winner-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.3);
          object-fit: cover;
        }
        
        .winner-text {
          font-size: 0.9rem;
          color: rgba(0, 0, 0, 0.8);
          font-weight: 600;
        }
        
        .winner-name {
          color: #000;
          font-weight: 700;
        }
        
        @media (max-width: 768px) {
          .jackpot-banner {
            margin: 0 1rem;
            padding: 1rem;
          }
          
          .jackpot-text {
            font-size: 1rem;
          }
          
          .jackpot-amount {
            font-size: 1.8rem;
          }
          
          .winner-text {
            font-size: 0.8rem;
          }
          
          .winner-avatar {
            width: 20px;
            height: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .jackpot-amount {
            font-size: 1.5rem;
          }
          
          .jackpot-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
} 