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
  tigerName: string;
  tigerImage: string;
  inscriptionNumber: number;
  contentType: string;
  isAvailable: boolean;
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
      case 'COAL_MINE': return '🔥';
      case 'GOLD_MINE': return '💎';
      case 'DIAMOND_MINE': return '⚡';
      case 'LIGHTNING_MINE': return '🚀';
      default: return '⛏️';
    }
  };

  const getRigTypeEmoji = (poolType: string) => {
    return getPoolTypeEmoji(poolType);
  };

  const getRigName = (poolType: string, originalName: string) => {
    switch (poolType) {
      case 'COAL_MINE': return 'AntMiner S19 Pro';
      case 'GOLD_MINE': return 'WhatsMiner M50S';
      case 'DIAMOND_MINE': return 'AntMiner S21 Hyd';
      case 'LIGHTNING_MINE': return 'Lightning Rig X1';
      default: return originalName;
    }
  };

  const getRigDescription = (poolType: string) => {
    switch (poolType) {
      case 'COAL_MINE': return 'Reliable mining workhorse with proven stability and consistent hash rates.';
      case 'GOLD_MINE': return 'High-performance ASIC with optimized cooling and superior efficiency.';
      case 'DIAMOND_MINE': return 'Next-gen hydro-cooled mining rig with maximum hash rate output.';
      case 'LIGHTNING_MINE': return 'Experimental quantum-enhanced mining rig with lightning-fast processing.';
      default: return 'Professional Bitcoin mining hardware for maximum profitability.';
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
        <div className="mining-facility">
          <h1 className="facility-title">⚡ LIGHTNING MINING FACILITY ⚡</h1>
          <div className="facility-stats">
            <div className="facility-stat">
              <span className="stat-icon">⛏️</span>
              <span className="stat-label">Total Hash Rate</span>
              <span className="stat-value">{pools.reduce((sum, pool) => sum + (pool.currentTigers * 15.5), 0).toFixed(1)} TH/s</span>
            </div>
            <div className="facility-stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-label">Active Rigs</span>
              <span className="stat-value">{pools.filter(p => p.currentTigers > 0).length}</span>
            </div>
            <div className="facility-stat">
              <span className="stat-icon">⚡</span>
              <span className="stat-label">Power Draw</span>
              <span className="stat-value">{(pools.reduce((sum, pool) => sum + (pool.currentTigers * 3.25), 0)).toFixed(1)} kW</span>
            </div>
          </div>
        </div>
        <p className="mining-subtitle">
          Deploy your Tigers to high-performance ASIC mining rigs for Bitcoin rewards!
        </p>
      </header>

      {myMemberships.length > 0 && (
        <section className="my-rigs-section">
          <h2>🔥 MY ACTIVE MINING RIGS</h2>
          <div className="rig-grid">
            {myMemberships.map((membership) => {
              const pool = pools.find(p => p.id === membership.poolId);
              if (!pool) return null;
              
              const hashRate = membership.tigersStaked * 15.5; // TH/s per tiger
              const powerDraw = membership.tigersStaked * 3.25; // kW per tiger
              const efficiency = (hashRate / powerDraw * 1000).toFixed(1); // GH/J
              
              return (
                <div key={membership.poolId} className="rig-card active">
                  <div className="rig-header">
                    <span className="rig-emoji">{getPoolTypeEmoji(pool.poolType)}</span>
                    <div className="rig-info">
                      <h3>{pool.name}</h3>
                      <div className="rig-status online">● ONLINE</div>
                    </div>
                  </div>
                  
                  <div className="rig-stats">
                    <div className="stat-row">
                      <div className="mining-stat">
                        <span className="stat-icon">⛏️</span>
                        <span className="stat-label">Hash Rate</span>
                        <span className="stat-value">{hashRate.toFixed(1)} TH/s</span>
                      </div>
                      <div className="mining-stat">
                        <span className="stat-icon">⚡</span>
                        <span className="stat-label">Power Draw</span>
                        <span className="stat-value">{powerDraw.toFixed(1)} kW</span>
                      </div>
                    </div>
                    
                    <div className="stat-row">
                      <div className="mining-stat">
                        <span className="stat-icon">🎯</span>
                        <span className="stat-label">Efficiency</span>
                        <span className="stat-value">{efficiency} GH/J</span>
                      </div>
                      <div className="mining-stat">
                        <span className="stat-icon">🐅</span>
                        <span className="stat-label">Tigers</span>
                        <span className="stat-value">{membership.tigersStaked}</span>
                      </div>
                    </div>
                    
                    <div className="earnings-section">
                      <div className="stat">
                        <span>Total Mined:</span>
                        <span className="earnings">{membership.totalEarned.toLocaleString()} sats</span>
                      </div>
                      <div className="stat">
                        <span>Daily Est:</span>
                        <span className="earnings">{Math.round(pool.dailyYield * membership.tigersStaked / pool.currentTigers).toLocaleString()} sats</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="available-rigs-section">
        <h2>⚡ AVAILABLE MINING RIGS</h2>
        <div className="rigs-grid">
          {pools.map((pool) => {
            const progressPercentage = (pool.currentTigers / pool.maxTigers) * 100;
            const isJoined = myMemberships.some(m => m.poolId === pool.id);
            const hashRatePerTiger = 15.5; // TH/s
            const powerPerTiger = 3.25; // kW
            const efficiency = (hashRatePerTiger / powerPerTiger * 1000).toFixed(1); // GH/J
            
            return (
              <div key={pool.id} className={`rig-card ${selectedPool === pool.id ? 'selected' : ''} ${isJoined ? 'owned' : ''}`}>
                <div className="rig-header">
                  <span className="rig-emoji">{getPoolTypeEmoji(pool.poolType)}</span>
                  <div className="rig-info">
                    <h3>{pool.name}</h3>
                    <div className={`rig-status ${pool.currentTigers > 0 ? 'online' : 'offline'}`}>
                      ● {pool.currentTigers > 0 ? 'MINING' : 'OFFLINE'}
                    </div>
                  </div>
                  {isJoined && <span className="owned-badge">OWNED</span>}
                </div>
                
                <div className="rig-description">{pool.description}</div>
                
                <div className="rig-specs">
                  <div className="spec-row">
                    <div className="spec">
                      <span className="spec-icon">⛏️</span>
                      <span className="spec-label">Hash Rate</span>
                      <span className="spec-value">{hashRatePerTiger} TH/s</span>
                    </div>
                    <div className="spec">
                      <span className="spec-icon">⚡</span>
                      <span className="spec-label">Power</span>
                      <span className="spec-value">{powerPerTiger} kW</span>
                    </div>
                  </div>
                  
                  <div className="spec-row">
                    <div className="spec">
                      <span className="spec-icon">🎯</span>
                      <span className="spec-label">Efficiency</span>
                      <span className="spec-value">{efficiency} GH/J</span>
                    </div>
                    <div className="spec">
                      <span className="spec-icon">💰</span>
                      <span className="spec-label">Daily Yield</span>
                      <span className="spec-value">{pool.dailyYield.toLocaleString()} sats</span>
                    </div>
                  </div>
                  
                  <div className="risk-spec">
                    <span className="spec-icon">⚠️</span>
                    <span className="spec-label">Failure Risk:</span>
                    <span className="spec-value" style={{ color: getRiskColor(pool.riskPercentage) }}>
                      {pool.riskPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="rig-slots">
                  <div className="slots-header">
                    <span>Tiger Slots: {pool.currentTigers}/{pool.maxTigers}</span>
                    <span className="utilization">{Math.round(progressPercentage)}% Utilization</span>
                  </div>
                  <div className="slots-bar">
                    <div 
                      className="slots-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="deployment-section">
                  <div className="deployment-cost">
                    <span className="cost-label">Deployment Cost:</span>
                    <span className="cost-value">{pool.entryFee.toLocaleString()} sats</span>
                  </div>
                  
                  {!isJoined && pool.currentTigers < pool.maxTigers && (
                    <button
                      className="deploy-button"
                      onClick={() => {
                        setSelectedPool(pool.id);
                        setShowTigerSelector(true);
                      }}
                      disabled={balance < pool.entryFee}
                    >
                      {selectedPool === pool.id && selectedTigers.length > 0 
                        ? `Deploy ${selectedTigers.length} Tigers`
                        : `Deploy Tigers`
                      }
                    </button>
                  )}
                  
                  {pool.currentTigers >= pool.maxTigers && (
                    <div className="rig-full">
                      🔒 RIG AT CAPACITY
                    </div>
                  )}
                  
                  {isJoined && (
                    <div className="rig-owned">
                      ✅ RIG DEPLOYED
                    </div>
                  )}
                </div>
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
        
        .mining-facility {
          background: linear-gradient(135deg, #1a2332, #2d3748);
          border: 2px solid #ffd700;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .facility-title {
          font-family: 'Press Start 2P', monospace;
          font-size: ${isMobile ? '1.2rem' : '1.8rem'};
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px #000;
          letter-spacing: 2px;
        }
        
        .facility-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .facility-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #333;
        }
        
        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          color: #aaa;
          font-size: 0.8rem;
          margin-bottom: 0.3rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .stat-value {
          color: #ffd700;
          font-weight: bold;
          font-size: 1.1rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .mining-subtitle {
          font-size: 1.1rem;
          color: #aaa;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .my-rigs-section, .available-rigs-section {
          margin-bottom: 3rem;
        }
        
        .my-rigs-section h2, .available-rigs-section h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ffd700;
          margin-bottom: 1.5rem;
        }
        
        .rig-grid, .rigs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .rig-card, .rig-card {
          background: linear-gradient(135deg, #1a2332, #0d1320);
          border: 2px solid #333;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .rig-card:hover {
          border-color: #ffd700;
          transform: translateY(-2px);
        }
        
        .rig-card.selected {
          border-color: #ffd700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }
        
        .rig-header, .rig-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          position: relative;
        }
        
        .rig-emoji, .rig-emoji {
          font-size: 1.5rem;
        }
        
        .rig-header h3, .rig-header h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ffd700;
          margin: 0;
          flex: 1;
        }
        
        .rig-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .rig-status {
          font-size: 0.6rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .rig-status.online {
          color: #4CAF50;
        }
        
        .rig-status.offline {
          color: #F44336;
        }
        
        .owned-badge {
          background: #4CAF50;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        
        .rig-card.owned {
          border-color: #4CAF50;
          background: linear-gradient(135deg, #1a2332, #1d3a2d);
        }
        
        .mining-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          flex: 1;
          margin: 0.2rem;
        }
        
        .mining-stat .stat-icon {
          font-size: 1rem;
          margin-bottom: 0.3rem;
        }
        
        .mining-stat .stat-label {
          font-size: 0.7rem;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.2rem;
        }
        
        .mining-stat .stat-value {
          font-size: 0.8rem;
          color: #ffd700;
          font-weight: bold;
        }
        
        .spec {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          flex: 1;
          margin: 0.2rem;
        }
        
        .spec-icon {
          font-size: 1rem;
          margin-bottom: 0.3rem;
        }
        
        .spec-label {
          font-size: 0.7rem;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.2rem;
        }
        
        .spec-value {
          font-size: 0.8rem;
          color: #ffd700;
          font-weight: bold;
        }
        
        .risk-spec {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: rgba(244, 67, 54, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }
        
        .utilization {
          color: #ffd700;
          font-weight: bold;
        }
        
        .rig-description {
          color: #aaa;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .rig-specs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        
        .earnings-section {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        
        .earnings {
          color: #ffd700;
          font-weight: bold;
        }
        
        .rig-slots {
          margin-bottom: 1rem;
        }
        
        .slots-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #aaa;
        }
        
        .slots-bar {
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .slots-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #ff9500);
          transition: width 0.3s ease;
        }
        
        .deployment-section {
          border-top: 1px solid #333;
          padding-top: 1rem;
        }
        
        .deployment-cost {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        
        .cost-label {
          color: #aaa;
        }
        
        .cost-value {
          color: #ffd700;
          font-weight: bold;
        }
        
        .deploy-button {
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
        
        .deploy-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }
        
        .deploy-button:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .rig-full {
          text-align: center;
          padding: 1rem;
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid #F44336;
          border-radius: 6px;
          color: #F44336;
          font-weight: bold;
        }
        
        .rig-owned {
          text-align: center;
          padding: 1rem;
          background: rgba(4, 170, 109, 0.1);
          border: 1px solid #4CAF50;
          border-radius: 6px;
          color: #4CAF50;
          font-weight: bold;
        }
        
        .loading {
          text-align: center;
          padding: 3rem;
          color: #aaa;
          font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
          .rig-grid, .rigs-grid {
            grid-template-columns: 1fr;
          }
          
          .rig-specs {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
} 