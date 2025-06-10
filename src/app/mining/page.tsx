'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLightning } from '@/context/LightningContext';
import TigerSelector from '@/components/mining/TigerSelector';

interface MiningPool {
  id: number;
  name: string;
  description: string;
  poolType: string;
  minTigers: number;
  maxTigers: number;
  currentTigers: number;
  entryFee: number;
  dailyYield: number;
  riskPercentage: number;
  isActive: boolean;
}

interface PoolMembership {
  poolId: number;
  tigersStaked: number;
  totalEarned: number;
  joinedAt: string;
}

interface Tiger {
  id: string;
  tigerId: string;
  tigerName?: string;
  tigerImage?: string;
  tigerLevel: number;
  stakedAt: string;
  isGuardian: boolean;
}

export default function MiningPage() {
  const [pools, setPools] = useState<MiningPool[]>([]);
  const [myMemberships, setMyMemberships] = useState<PoolMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [selectedTigers, setSelectedTigers] = useState<Tiger[]>([]);
  const [showTigerSelector, setShowTigerSelector] = useState(false);

  const { walletAddress } = useWallet();
  const { balance } = useLightning();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchPools();
      fetchMyMemberships();
    }
  }, [walletAddress]);

  const fetchPools = async () => {
    try {
      const response = await fetch('/api/mining/pools');
      const data = await response.json();
      if (data.success) {
        setPools(data.pools);
      }
    } catch (error) {
      console.error('Error fetching pools:', error);
    }
  };

  const fetchMyMemberships = async () => {
    try {
      const response = await fetch(`/api/mining/my-pools?wallet=${walletAddress}`);
      const data = await response.json();
      if (data.success) {
        setMyMemberships(data.memberships);
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinPool = async (poolId: number) => {
    if (!walletAddress) return;

    try {
      const response = await fetch('/api/mining/join-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          poolId,
          tigersToStake: selectedTigers.length
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchPools();
        fetchMyMemberships();
        setSelectedPool(null);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error joining pool:', error);
    }
  };

  const getPoolTypeEmoji = (poolType: string) => {
    switch (poolType) {
      case 'COAL_MINE': return '⛏️';
      case 'GOLD_MINE': return '🥇';
      case 'DIAMOND_MINE': return '💎';
      case 'LIGHTNING_MINE': return '⚡';
      default: return '🏭';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 10) return '#4CAF50';
    if (risk < 20) return '#FF9800';
    return '#F44336';
  };

  if (loading) {
    return (
      <div className="mining-page">
        <div className="loading">Loading mining pools...</div>
      </div>
    );
  }

  return (
    <div className="mining-page">
      <header className="mining-header">
        <h1 className="mining-title">🏭 Tiger Mining Pools</h1>
        <p className="mining-subtitle">
          Pool your tigers together for bigger rewards!
        </p>
      </header>

      {myMemberships.length > 0 && (
        <section className="my-pools-section">
          <h2>🐅 My Active Pools</h2>
          <div className="membership-grid">
            {myMemberships.map((membership) => {
              const pool = pools.find(p => p.id === membership.poolId);
              if (!pool) return null;
              
              return (
                <div key={membership.poolId} className="membership-card">
                  <div className="pool-header">
                    <span className="pool-emoji">{getPoolTypeEmoji(pool.poolType)}</span>
                    <h3>{pool.name}</h3>
                  </div>
                  <div className="membership-stats">
                    <div className="stat">
                      <span>Tigers Staked:</span>
                      <span>{membership.tigersStaked}</span>
                    </div>
                    <div className="stat">
                      <span>Total Earned:</span>
                      <span>{membership.totalEarned.toLocaleString()} sats</span>
                    </div>
                    <div className="stat">
                      <span>Daily Yield:</span>
                      <span>{Math.round(pool.dailyYield * membership.tigersStaked / pool.currentTigers)} sats</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="available-pools-section">
        <h2>⛏️ Available Mining Pools</h2>
        <div className="pools-grid">
          {pools.map((pool) => {
            const progressPercentage = (pool.currentTigers / pool.maxTigers) * 100;
            const isJoined = myMemberships.some(m => m.poolId === pool.id);
            
            return (
              <div key={pool.id} className={`pool-card ${selectedPool === pool.id ? 'selected' : ''}`}>
                <div className="pool-header">
                  <span className="pool-emoji">{getPoolTypeEmoji(pool.poolType)}</span>
                  <h3>{pool.name}</h3>
                  {isJoined && <span className="joined-badge">Joined</span>}
                </div>
                
                <p className="pool-description">{pool.description}</p>
                
                <div className="pool-stats">
                  <div className="stat">
                    <span>Entry Fee:</span>
                    <span>{pool.entryFee.toLocaleString()} sats</span>
                  </div>
                  <div className="stat">
                    <span>Daily Yield:</span>
                    <span>{pool.dailyYield.toLocaleString()} sats</span>
                  </div>
                  <div className="stat">
                    <span>Risk:</span>
                    <span style={{ color: getRiskColor(pool.riskPercentage) }}>
                      {pool.riskPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="pool-progress">
                  <div className="progress-header">
                    <span>Tigers: {pool.currentTigers}/{pool.maxTigers}</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                {!isJoined && pool.currentTigers < pool.maxTigers && (
                  <div className="join-controls">
                    <button
                      className="join-button"
                      onClick={() => {
                        setSelectedPool(pool.id);
                        setShowTigerSelector(true);
                      }}
                      disabled={balance < pool.entryFee}
                    >
                      {selectedPool === pool.id && selectedTigers.length > 0 
                        ? `Join with ${selectedTigers.length} Tigers (${pool.entryFee.toLocaleString()} sats)`
                        : `Select Tigers (${pool.entryFee.toLocaleString()} sats)`
                      }
                    </button>
                  </div>
                )}
                
                {pool.currentTigers >= pool.maxTigers && (
                  <div className="pool-full">
                    🔒 Pool Full
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      
      {showTigerSelector && (
        <TigerSelector
          walletAddress={walletAddress || ''}
          onTigersSelected={(tigers: Tiger[]) => {
            setSelectedTigers(tigers);
            if (selectedPool && tigers.length > 0) {
              joinPool(selectedPool);
            }
            setShowTigerSelector(false);
          }}
          isOpen={showTigerSelector}
          onClose={() => setShowTigerSelector(false)}
        />
      )}
      
      <style jsx>{`
        .mining-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          background: #0d1320;
          color: white;
          min-height: 100vh;
        }
        
        .mining-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .mining-title {
          font-family: 'Press Start 2P', monospace;
          font-size: ${isMobile ? '1.5rem' : '2rem'};
          color: #ffd700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px #000;
        }
        
        .mining-subtitle {
          font-size: 1.1rem;
          color: #aaa;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .my-pools-section, .available-pools-section {
          margin-bottom: 3rem;
        }
        
        .my-pools-section h2, .available-pools-section h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ffd700;
          margin-bottom: 1.5rem;
        }
        
        .membership-grid, .pools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .membership-card, .pool-card {
          background: linear-gradient(135deg, #1a2332, #0d1320);
          border: 2px solid #333;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .pool-card:hover {
          border-color: #ffd700;
          transform: translateY(-2px);
        }
        
        .pool-card.selected {
          border-color: #ffd700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }
        
        .pool-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          position: relative;
        }
        
        .pool-emoji {
          font-size: 1.5rem;
        }
        
        .pool-header h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ffd700;
          margin: 0;
          flex: 1;
        }
        
        .joined-badge {
          background: #4CAF50;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        
        .pool-description {
          color: #aaa;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .pool-stats, .membership-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .stat {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        
        .stat span:first-child {
          color: #aaa;
        }
        
        .stat span:last-child {
          color: #ffd700;
          font-weight: bold;
        }
        
        .pool-progress {
          margin-bottom: 1rem;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #aaa;
        }
        
        .progress-bar {
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #ff9500);
          transition: width 0.3s ease;
        }
        
        .join-controls {
          border-top: 1px solid #333;
          padding-top: 1rem;
        }
        
        .join-button {
          background: linear-gradient(135deg, #ffd700, #ff9500);
          color: black;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .join-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }
        
        .join-button:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .pool-full {
          text-align: center;
          padding: 1rem;
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid #F44336;
          border-radius: 6px;
          color: #F44336;
          font-weight: bold;
        }
        
        .loading {
          text-align: center;
          padding: 3rem;
          color: #aaa;
          font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
          .membership-grid, .pools-grid {
            grid-template-columns: 1fr;
          }
          
          .pool-stats, .membership-stats {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
} 