'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RaffleWinner {
  id: number;
  raffleName: string;
  description: string;
  image: string;
  winnerAddress: string;
  winnerPickedAt: string;
  ticketPrice: number;
  totalTickets: number;
  displayAddress: string;
}

export default function RaffleWinners() {
  const [winners, setWinners] = useState<RaffleWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const response = await fetch('/api/raffles/winners');
      const data = await response.json();
      
      if (data.success) {
        setWinners(data.winners);
      }
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="winners-section">
        <h2 className="winners-title">🏆 Recent Winners</h2>
        <div className="loading-message">Loading winners...</div>
        <style jsx>{`
          .winners-section {
            width: 100%;
            max-width: 900px;
            margin: 3rem auto;
            padding: 0 1rem;
          }
          .winners-title {
            font-family: 'Press Start 2P', monospace;
            font-size: 1.5rem;
            color: #ffd700;
            text-align: center;
            margin-bottom: 2rem;
            text-shadow: 2px 2px #000;
          }
          .loading-message {
            text-align: center;
            color: #aaa;
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <div className="winners-section">
        <h2 className="winners-title">🏆 Recent Winners</h2>
        <div className="no-winners-message">No recent winners yet</div>
        <style jsx>{`
          .winners-section {
            width: 100%;
            max-width: 900px;
            margin: 3rem auto;
            padding: 0 1rem;
          }
          .winners-title {
            font-family: 'Press Start 2P', monospace;
            font-size: 1.5rem;
            color: #ffd700;
            text-align: center;
            margin-bottom: 2rem;
            text-shadow: 2px 2px #000;
          }
          .no-winners-message {
            text-align: center;
            color: #aaa;
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="winners-section">
      <h2 className="winners-title">🏆 Recent Winners</h2>
      <div className="winners-grid">
        {winners.map((winner) => (
          <div key={winner.id} className="winner-card">
            <div className="winner-image">
              <Image
                src={winner.image}
                alt={winner.raffleName}
                width={60}
                height={60}
                className="raffle-image"
              />
            </div>
            <div className="winner-info">
              <h3 className="raffle-name">{winner.raffleName}</h3>
              <div className="winner-details">
                <span className="winner-address">👤 {winner.displayAddress}</span>
                <span className="winner-time">⏰ {formatDate(winner.winnerPickedAt)}</span>
              </div>
            </div>
            <div className="confetti">🎉</div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .winners-section {
          width: 100%;
          max-width: 900px;
          margin: 3rem auto;
          padding: 0 1rem;
        }
        
        .winners-title {
          font-family: 'Press Start 2P', monospace;
          font-size: ${isMobile ? '1.2rem' : '1.5rem'};
          color: #ffd700;
          text-align: center;
          margin-bottom: 2rem;
          text-shadow: 2px 2px #000;
        }
        
        .winners-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .winner-card {
          background: linear-gradient(135deg, #1a2332, #0d1320);
          border: 2px solid #ffd700;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
        }
        
        .winner-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(255, 215, 0, 0.2);
          border-color: #ffea00;
        }
        
        .winner-image {
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #333;
        }
        
        .raffle-image {
          border-radius: 6px;
        }
        
        .winner-info {
          flex: 1;
          min-width: 0;
        }
        
        .raffle-name {
          font-family: 'Press Start 2P', monospace;
          font-size: ${isMobile ? '0.7rem' : '0.9rem'};
          color: #ffd700;
          margin: 0 0 0.5rem 0;
          text-shadow: 1px 1px #000;
          line-height: 1.4;
        }
        
        .winner-details {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .winner-address,
        .winner-time {
          font-size: ${isMobile ? '0.7rem' : '0.8rem'};
          color: #aaa;
          font-family: monospace;
        }
        
        .winner-address {
          color: #4CAF50;
          font-weight: bold;
        }
        
        .confetti {
          font-size: 1.5rem;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @media (min-width: 769px) {
          .winners-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1rem;
          }
          
          .winner-details {
            flex-direction: row;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 