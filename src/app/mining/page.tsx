'use client'

import { useState, useEffect } from 'react'
import { useLightning } from '@/context/LightningContext'
import { useWallet } from '@/context/WalletContext'
import Image from 'next/image'

interface SpellResult {
  hash: string
  lastFour: string
  reward: string
  type: 'nothing' | 'energy' | 'shards' | 'raffle' | 'sats' | 'rare'
  amount?: number
}

export default function MiningPage() {
  const { balance } = useLightning()
  const { walletAddress } = useWallet()
  
  const [canCast, setCanCast] = useState(true)
  const [isCasting, setIsCasting] = useState(false)
  const [lastCast, setLastCast] = useState<Date | null>(null)
  const [spellResult, setSpellResult] = useState<SpellResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [userStats, setUserStats] = useState({
    totalCasts: 0,
    energyPoints: 0,
    crystalShards: 0,
    rareFinds: 0
  })

  useEffect(() => {
    if (walletAddress) {
      loadUserStats()
      checkLastCast()
    }
  }, [walletAddress])

  const loadUserStats = () => {
    if (!walletAddress) return
    const stored = localStorage.getItem(`mining_stats_${walletAddress}`)
    if (stored) {
      setUserStats(JSON.parse(stored))
    }
  }

  const saveUserStats = (newStats: typeof userStats) => {
    if (!walletAddress) return
    localStorage.setItem(`mining_stats_${walletAddress}`, JSON.stringify(newStats))
    setUserStats(newStats)
  }

  const checkLastCast = () => {
    if (!walletAddress) return
    const stored = localStorage.getItem(`last_cast_${walletAddress}`)
    if (stored) {
      const lastCastDate = new Date(stored)
      setLastCast(lastCastDate)
      
      const now = new Date()
      const timeDiff = now.getTime() - lastCastDate.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)
      
      if (hoursDiff < 24) {
        setCanCast(false)
      }
    }
  }

  const generatePseudoHash = (): string => {
    const prefixes = ['TigerFlame', 'MysticRoar', 'CrystalCall', 'ShadowCast', 'LightningStrike']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    
    // Generate random 4-character suffix
    const chars = '0123456789ABCDEFabcdef'
    let suffix = ''
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return `${prefix}_${suffix}`
  }

  const determineReward = (lastFour: string): SpellResult => {
    const hash = generatePseudoHash()
    const lowerCase = lastFour.toLowerCase()
    
    // Different patterns for different rewards
    if (lowerCase.endsWith('7')) {
      return { hash, lastFour, reward: 'Nothing... The spirits are silent', type: 'nothing' }
    }
    
    if (lowerCase.includes('33')) {
      return { hash, lastFour, reward: '3 Energy Points', type: 'energy', amount: 3 }
    }
    
    if (lowerCase.includes('69')) {
      return { hash, lastFour, reward: '5 Crystal Shards', type: 'shards', amount: 5 }
    }
    
    if (lowerCase.includes('888')) {
      return { hash, lastFour, reward: 'Instant Raffle Entry!', type: 'raffle', amount: 1 }
    }
    
    if (lowerCase.includes('ff') || lowerCase.includes('aa')) {
      return { hash, lastFour, reward: '100 Free Sats!', type: 'sats', amount: 100 }
    }
    
    if (lowerCase === 'dead' || lowerCase === 'beef') {
      return { hash, lastFour, reward: 'RARE: Ancient Relic Fragment!', type: 'rare', amount: 1 }
    }
    
    // Default small rewards
    const randomRewards = [
      { reward: '1 Energy Point', type: 'energy' as const, amount: 1 },
      { reward: '2 Crystal Shards', type: 'shards' as const, amount: 2 },
      { reward: '50 Sats', type: 'sats' as const, amount: 50 }
    ]
    
    const selected = randomRewards[Math.floor(Math.random() * randomRewards.length)]
    return { hash, lastFour, reward: selected.reward, type: selected.type, amount: selected.amount }
  }

  const castSpell = async () => {
    if (!canCast || !walletAddress || isCasting) return
    
    setIsCasting(true)
    
    // Generate spell result
    const hash = generatePseudoHash()
    const lastFour = hash.slice(-4)
    const result = determineReward(lastFour)
    
    // Simulate casting delay
    setTimeout(() => {
      setSpellResult(result)
      setShowResult(true)
      setIsCasting(false)
      setCanCast(false)
      
      // Update user stats
      const newStats = { ...userStats }
      newStats.totalCasts += 1
      
      if (result.type === 'energy' && result.amount) {
        newStats.energyPoints += result.amount
      } else if (result.type === 'shards' && result.amount) {
        newStats.crystalShards += result.amount
      } else if (result.type === 'rare' && result.amount) {
        newStats.rareFinds += result.amount
      }
      
      saveUserStats(newStats)
      
      // Save last cast time
      const now = new Date()
      setLastCast(now)
      localStorage.setItem(`last_cast_${walletAddress}`, now.toISOString())
    }, 2000)
  }

  const getTimeUntilNextCast = (): string => {
    if (!lastCast) return ''
    
    const now = new Date()
    const timeDiff = now.getTime() - lastCast.getTime()
    const hoursLeft = 24 - (timeDiff / (1000 * 3600))
    
    if (hoursLeft <= 0) {
      setCanCast(true)
      return ''
    }
    
    const hours = Math.floor(hoursLeft)
    const minutes = Math.floor((hoursLeft - hours) * 60)
    return `${hours}h ${minutes}m`
  }

  const getRewardColor = (type: string): string => {
    switch (type) {
      case 'rare': return '#ffd700'
      case 'raffle': return '#ff6b6b'
      case 'sats': return '#4ecdc4'
      case 'energy': return '#9d4edd'
      case 'shards': return '#4cc9f0'
      default: return '#666'
    }
  }

  return (
    <div className="mining-laboratory">
      {/* Floating magical particles */}
      <div className="magical-particles">
        {Array.from({length: 15}).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {/* Clickable Laboratory Background */}
      <div 
        className={`laboratory-chamber ${isCasting ? 'casting' : ''} ${!canCast ? 'disabled' : ''}`}
        onClick={castSpell}
      >
        <Image
          src="/lab.png"
          alt="Mystical Laboratory"
          fill
          className="lab-background"
          style={{ objectFit: 'cover' }}
          unoptimized
          priority
        />
        
        {/* Casting Overlay */}
        {isCasting && (
          <div className="casting-overlay">
            <div className="casting-circle">
              <div className="casting-rune">🔮</div>
              <div className="casting-text">Casting Spell...</div>
            </div>
          </div>
        )}

        {/* Cast Button Overlay */}
        {!isCasting && (
          <div className="cast-overlay">
            {canCast ? (
              <div className="cast-button-container">
                <div className="cast-button">
                  <div className="cast-icon">⚡</div>
                  <div className="cast-text">Cast Daily Spell</div>
                  <div className="cast-subtitle">Click the laboratory to cast!</div>
                </div>
              </div>
            ) : (
              <div className="cooldown-container">
                <div className="cooldown-text">Spell on Cooldown</div>
                <div className="cooldown-time">Next cast in: {getTimeUntilNextCast()}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Panel */}
      <div className="stats-panel">
        <h2 className="stats-title">🧙‍♂️ Mining Stats</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{userStats.energyPoints}</div>
            <div className="stat-label">Energy Points</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💎</div>
            <div className="stat-value">{userStats.crystalShards}</div>
            <div className="stat-label">Crystal Shards</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{userStats.rareFinds}</div>
            <div className="stat-label">Rare Finds</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{userStats.totalCasts}</div>
            <div className="stat-label">Total Casts</div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && spellResult && (
        <div className="result-modal" onClick={() => setShowResult(false)}>
          <div className="result-content" onClick={(e) => e.stopPropagation()}>
            <div className="result-header">
              <h3>🔮 Spell Cast Complete!</h3>
            </div>
            <div className="result-hash">
              <div className="hash-label">Spell Hash:</div>
              <div className="hash-value">{spellResult.hash}</div>
            </div>
            <div className="result-pattern">
              <div className="pattern-label">Pattern:</div>
              <div className="pattern-value">{spellResult.lastFour}</div>
            </div>
            <div 
              className="result-reward"
              style={{ color: getRewardColor(spellResult.type) }}
            >
              {spellResult.reward}
            </div>
            <button 
              className="result-close"
              onClick={() => setShowResult(false)}
            >
              Continue Mining
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .mining-laboratory {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a2e 0%, #16213e 25%, #1a1a3e 50%, #0e0e2a 75%, #0a0618 100%);
          position: relative;
          overflow: hidden;
        }

        .magical-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, #9d4edd 0%, #7209b7 50%, transparent 100%);
          border-radius: 50%;
          animation: float infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
        }

        .laboratory-chamber {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 500px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 20px;
          margin: 2rem;
          overflow: hidden;
          border: 2px solid rgba(157, 78, 221, 0.3);
        }

        .laboratory-chamber:hover:not(.disabled) {
          border-color: rgba(157, 78, 221, 0.8);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(157, 78, 221, 0.3);
        }

        .laboratory-chamber.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .lab-background {
          border-radius: 18px;
        }

        .casting-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 3;
        }

        .casting-circle {
          width: 200px;
          height: 200px;
          border: 3px solid #9d4edd;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          animation: spell-cast 2s ease-in-out infinite;
          background: radial-gradient(circle, rgba(157, 78, 221, 0.2) 0%, transparent 70%);
        }

        @keyframes spell-cast {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            border-color: #9d4edd;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            border-color: #c77dff;
          }
        }

        .casting-rune {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: rune-glow 1s ease-in-out infinite alternate;
        }

        @keyframes rune-glow {
          from {
            filter: drop-shadow(0 0 10px #9d4edd);
          }
          to {
            filter: drop-shadow(0 0 25px #c77dff);
          }
        }

        .casting-text {
          color: #e0aaff;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
        }

        .cast-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg, 
            rgba(16, 18, 56, 0.7) 0%, 
            rgba(26, 26, 62, 0.6) 50%, 
            rgba(16, 18, 56, 0.7) 100%
          );
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }

        .cast-button-container {
          text-align: center;
        }

        .cast-button {
          background: linear-gradient(135deg, rgba(157, 78, 221, 0.3), rgba(114, 9, 183, 0.3));
          border: 2px solid rgba(157, 78, 221, 0.8);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .cast-button:hover {
          background: linear-gradient(135deg, rgba(157, 78, 221, 0.5), rgba(114, 9, 183, 0.5));
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(157, 78, 221, 0.4);
        }

        .cast-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 20px #9d4edd);
        }

        .cast-text {
          font-size: 1.8rem;
          font-weight: 700;
          color: #e0aaff;
          margin-bottom: 0.5rem;
        }

        .cast-subtitle {
          font-size: 1rem;
          color: #c77dff;
          opacity: 0.8;
        }

        .cooldown-container {
          text-align: center;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .cooldown-text {
          font-size: 1.5rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .cooldown-time {
          font-size: 1.2rem;
          color: #999;
          font-weight: 600;
        }

        .stats-panel {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem;
          border: 1px solid rgba(157, 78, 221, 0.3);
          backdrop-filter: blur(15px);
        }

        .stats-title {
          font-size: 1.8rem;
          color: #c77dff;
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }

        .stat-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(157, 78, 221, 0.2);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          border-color: rgba(157, 78, 221, 0.5);
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #e0aaff;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #c77dff;
          opacity: 0.8;
        }

        .result-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .result-content {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.95), rgba(26, 26, 62, 0.95));
          border-radius: 20px;
          padding: 3rem;
          border: 2px solid rgba(157, 78, 221, 0.5);
          text-align: center;
          max-width: 500px;
          width: 90%;
          backdrop-filter: blur(15px);
        }

        .result-header h3 {
          font-size: 2rem;
          color: #c77dff;
          margin-bottom: 2rem;
        }

        .result-hash {
          margin-bottom: 1.5rem;
        }

        .hash-label, .pattern-label {
          font-size: 0.9rem;
          color: #c77dff;
          opacity: 0.8;
          margin-bottom: 0.5rem;
        }

        .hash-value {
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          color: #e0aaff;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .result-pattern {
          margin-bottom: 2rem;
        }

        .pattern-value {
          font-family: 'Courier New', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.8rem;
          border-radius: 8px;
          color: #ffd700;
        }

        .result-reward {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .result-close {
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.3), rgba(114, 9, 183, 0.3));
          border: 2px solid rgba(157, 78, 221, 0.5);
          border-radius: 12px;
          padding: 1rem 2rem;
          color: #e0aaff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .result-close:hover {
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.5), rgba(114, 9, 183, 0.5));
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .laboratory-chamber {
            margin: 1rem;
            height: 60vh;
            min-height: 400px;
          }

          .cast-icon {
            font-size: 3rem;
          }

          .cast-text {
            font-size: 1.4rem;
          }

          .stats-panel {
            margin: 1rem;
            padding: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .result-content {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  )
} 