'use client'

import { useState, useEffect } from 'react'
import { useLightning } from '@/context/LightningContext'
import { useWallet } from '@/context/WalletContext'
import Image from 'next/image'
import Link from 'next/link'

interface SpellResult {
  hash: string
  lastFour: string
  reward: string
  type: 'nothing' | 'energy' | 'shards' | 'raffle' | 'sats' | 'rare'
  amount?: number
}

interface UserUpgrades {
  cooldownReduction: number
  rareChance: number
  extraCasts: number
  autoCollect: boolean
  luckyStreak: number
}

export default function MiningPage() {
  const { balance } = useLightning()
  const { walletAddress } = useWallet()
  
  const [canCast, setCanCast] = useState(true)
  const [isCasting, setIsCasting] = useState(false)
  const [lastCast, setLastCast] = useState<Date | null>(null)
  const [spellResult, setSpellResult] = useState<SpellResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [castsToday, setCastsToday] = useState(0)
  const [userStats, setUserStats] = useState({
    totalCasts: 0,
    energyPoints: 0,
    crystalShards: 0,
    rareFinds: 0
  })
  const [userUpgrades, setUserUpgrades] = useState<UserUpgrades>({
    cooldownReduction: 0,
    rareChance: 0,
    extraCasts: 0,
    autoCollect: false,
    luckyStreak: 0
  })

  useEffect(() => {
    if (walletAddress) {
      loadUserStats()
      loadUserUpgrades()
      checkLastCast()
      checkDailyReset()
    }
  }, [walletAddress])

  const loadUserStats = () => {
    if (!walletAddress) return
    const stored = localStorage.getItem(`mining_stats_${walletAddress}`)
    if (stored) {
      setUserStats(JSON.parse(stored))
    }
  }

  const loadUserUpgrades = () => {
    if (!walletAddress) return
    const stored = localStorage.getItem(`mining_upgrades_${walletAddress}`)
    if (stored) {
      setUserUpgrades(JSON.parse(stored))
    }
  }

  const saveUserStats = (newStats: typeof userStats) => {
    if (!walletAddress) return
    localStorage.setItem(`mining_stats_${walletAddress}`, JSON.stringify(newStats))
    setUserStats(newStats)
  }

  const checkDailyReset = () => {
    if (!walletAddress) return
    const today = new Date().toDateString()
    const lastResetDate = localStorage.getItem(`last_reset_${walletAddress}`)
    
    if (lastResetDate !== today) {
      // Reset daily casts
      setCastsToday(0)
      localStorage.setItem(`daily_casts_${walletAddress}`, '0')
      localStorage.setItem(`last_reset_${walletAddress}`, today)
    } else {
      // Load current daily casts
      const stored = localStorage.getItem(`daily_casts_${walletAddress}`)
      if (stored) {
        setCastsToday(parseInt(stored))
      }
    }
  }

  const checkLastCast = () => {
    if (!walletAddress) return
    const stored = localStorage.getItem(`last_cast_${walletAddress}`)
    if (stored) {
      const lastCastDate = new Date(stored)
      setLastCast(lastCastDate)
      
      const now = new Date()
      const timeDiff = now.getTime() - lastCastDate.getTime()
      const baseCooldownHours = 24
      const actualCooldownHours = Math.max(1, baseCooldownHours - userUpgrades.cooldownReduction)
      const hoursDiff = timeDiff / (1000 * 3600)
      
      if (hoursDiff < actualCooldownHours) {
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
    
    // Apply rare chance bonus from upgrades
    const baseRareChance = 10 // Base 10% for rare patterns
    const bonusRareChance = userUpgrades.rareChance
    const totalRareChance = baseRareChance + bonusRareChance
    const rareRoll = Math.random() * 100
    
    // Force rare if within bonus chance
    const forceRare = rareRoll < totalRareChance
    
    // Different patterns for different rewards
    if (lowerCase.endsWith('7') && !forceRare) {
      return { hash, lastFour, reward: 'Nothing... The spirits are silent', type: 'nothing' }
    }
    
    if (lowerCase.includes('33') || forceRare) {
      const amount = forceRare ? 5 : 3
      return { hash, lastFour, reward: `${amount} Energy Points`, type: 'energy', amount }
    }
    
    if (lowerCase.includes('69') || forceRare) {
      const amount = forceRare ? 8 : 5
      return { hash, lastFour, reward: `${amount} Crystal Shards`, type: 'shards', amount }
    }
    
    if (lowerCase.includes('888')) {
      return { hash, lastFour, reward: 'Instant Raffle Entry!', type: 'raffle', amount: 1 }
    }
    
    if (lowerCase.includes('ff') || lowerCase.includes('aa')) {
      const amount = forceRare ? 150 : 100
      return { hash, lastFour, reward: `${amount} Free Sats!`, type: 'sats', amount }
    }
    
    if (lowerCase === 'dead' || lowerCase === 'beef' || forceRare) {
      return { hash, lastFour, reward: 'RARE: Ancient Relic Fragment!', type: 'rare', amount: 1 }
    }
    
    // Default small rewards with upgrade bonuses
    const randomRewards = [
      { reward: forceRare ? '3 Energy Points' : '1 Energy Point', type: 'energy' as const, amount: forceRare ? 3 : 1 },
      { reward: forceRare ? '4 Crystal Shards' : '2 Crystal Shards', type: 'shards' as const, amount: forceRare ? 4 : 2 },
      { reward: forceRare ? '75 Sats' : '50 Sats', type: 'sats' as const, amount: forceRare ? 75 : 50 }
    ]
    
    const selected = randomRewards[Math.floor(Math.random() * randomRewards.length)]
    return { hash, lastFour, reward: selected.reward, type: selected.type, amount: selected.amount }
  }

  const castSpell = async () => {
    const maxCastsPerDay = 1 + userUpgrades.extraCasts
    
    if (!canCast || !walletAddress || isCasting || castsToday >= maxCastsPerDay) return
    
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
      
      // Update daily casts
      const newCastsToday = castsToday + 1
      setCastsToday(newCastsToday)
      localStorage.setItem(`daily_casts_${walletAddress}`, newCastsToday.toString())
      
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
      
      // Use cooldown reduction from upgrades
      setTimeout(() => {
        const maxCasts = 1 + userUpgrades.extraCasts
        if (castsToday < maxCasts - 1) { // Allow more casts if player has extra casts
          setCanCast(true)
        }
      }, 100)
    }, 2000)
  }

  const getTimeUntilNextCast = (): string => {
    if (!lastCast) return ''
    
    const now = new Date()
    const timeDiff = now.getTime() - lastCast.getTime()
    const baseCooldownHours = 24
    const actualCooldownHours = Math.max(1, baseCooldownHours - userUpgrades.cooldownReduction)
    const hoursLeft = actualCooldownHours - (timeDiff / (1000 * 3600))
    
    if (hoursLeft <= 0) {
      const maxCasts = 1 + userUpgrades.extraCasts
      if (castsToday < maxCasts) {
        setCanCast(true)
      }
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

  const maxCastsPerDay = 1 + userUpgrades.extraCasts
  const castsRemaining = maxCastsPerDay - castsToday

  return (
    <div className="mining-laboratory">
      {/* Prominent Inventory Navigation */}
      <div className="nav-section">
        <Link href="/inventory" className="inventory-cta">
          <div className="cta-content">
            <div className="cta-icon">🎒</div>
            <div className="cta-text">
              <div className="cta-title">Shop & Inventory</div>
              <div className="cta-subtitle">Use your resources!</div>
            </div>
            {(userStats.energyPoints > 0 || userStats.crystalShards > 0 || userStats.rareFinds > 0) && (
              <div className="resource-badges">
                {userStats.energyPoints > 0 && <span className="badge energy">{userStats.energyPoints} ⚡</span>}
                {userStats.crystalShards > 0 && <span className="badge shards">{userStats.crystalShards} 💎</span>}
                {userStats.rareFinds > 0 && <span className="badge rare">{userStats.rareFinds} 🏺</span>}
              </div>
            )}
          </div>
        </Link>
      </div>

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
        className={`laboratory-chamber ${isCasting ? 'casting' : ''} ${!canCast || castsRemaining <= 0 ? 'disabled' : ''}`}
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
            {canCast && castsRemaining > 0 ? (
              <div className="cast-button-container">
                <div className="cast-button">
                  <div className="cast-icon">⚡</div>
                  <div className="cast-text">Cast Spell</div>
                  <div className="cast-subtitle">
                    {castsRemaining} cast{castsRemaining !== 1 ? 's' : ''} remaining today
                  </div>
                  {userUpgrades.rareChance > 0 && (
                    <div className="bonus-text">+{userUpgrades.rareChance}% rare chance!</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="cooldown-container">
                {castsRemaining <= 0 ? (
                  <div>
                    <div className="cooldown-text">Daily Limit Reached</div>
                    <div className="cooldown-time">
                      {maxCastsPerDay} cast{maxCastsPerDay !== 1 ? 's' : ''} used today
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="cooldown-text">Spell on Cooldown</div>
                    <div className="cooldown-time">Next cast in: {getTimeUntilNextCast()}</div>
                    {userUpgrades.cooldownReduction > 0 && (
                      <div className="bonus-text">-{userUpgrades.cooldownReduction}h cooldown reduction!</div>
                    )}
                  </div>
                )}
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
        
        {/* Active Upgrades Display */}
        {(userUpgrades.cooldownReduction > 0 || userUpgrades.rareChance > 0 || userUpgrades.extraCasts > 0) && (
          <div className="upgrades-display">
            <h3>🔮 Active Upgrades</h3>
            <div className="upgrade-list">
              {userUpgrades.cooldownReduction > 0 && (
                <div className="upgrade-badge">⏰ -{userUpgrades.cooldownReduction}h cooldown</div>
              )}
              {userUpgrades.rareChance > 0 && (
                <div className="upgrade-badge">🍀 +{userUpgrades.rareChance}% rare</div>
              )}
              {userUpgrades.extraCasts > 0 && (
                <div className="upgrade-badge">⚡ +{userUpgrades.extraCasts} daily casts</div>
              )}
            </div>
          </div>
        )}
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
            <div className="result-actions">
              <button 
                className="result-close"
                onClick={() => setShowResult(false)}
              >
                Continue Mining
              </button>
              <Link href="/inventory" className="result-shop">
                🎒 Use Resources
              </Link>
            </div>
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

        .nav-section {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 10;
        }

        .inventory-cta {
          background: linear-gradient(135deg, rgba(157, 78, 221, 0.2), rgba(114, 9, 183, 0.3));
          border: 2px solid rgba(157, 78, 221, 0.6);
          border-radius: 15px;
          padding: 1rem;
          color: #e0aaff;
          text-decoration: none;
          display: block;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          min-width: 200px;
        }

        .inventory-cta:hover {
          background: linear-gradient(135deg, rgba(157, 78, 221, 0.4), rgba(114, 9, 183, 0.5));
          border-color: rgba(157, 78, 221, 0.9);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 30px rgba(157, 78, 221, 0.3);
        }

        .cta-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cta-icon {
          font-size: 2rem;
          filter: drop-shadow(0 0 10px rgba(157, 78, 221, 0.8));
        }

        .cta-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .cta-subtitle {
          font-size: 0.8rem;
          opacity: 0.8;
          color: #c77dff;
        }

        .resource-badges {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-left: auto;
        }

        .badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-weight: 600;
          text-align: center;
        }

        .badge.energy {
          background: rgba(157, 78, 221, 0.3);
          border: 1px solid rgba(157, 78, 221, 0.6);
        }

        .badge.shards {
          background: rgba(76, 201, 240, 0.3);
          border: 1px solid rgba(76, 201, 240, 0.6);
        }

        .badge.rare {
          background: rgba(255, 215, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.6);
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
          margin-bottom: 0.5rem;
        }

        .bonus-text {
          font-size: 0.9rem;
          color: #4afc4a;
          font-weight: 600;
          margin-top: 0.5rem;
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
          margin-bottom: 2rem;
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

        .upgrades-display {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(157, 78, 221, 0.2);
        }

        .upgrades-display h3 {
          color: #c77dff;
          margin-bottom: 1rem;
          text-align: center;
        }

        .upgrade-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .upgrade-badge {
          background: rgba(157, 78, 221, 0.3);
          border: 1px solid rgba(157, 78, 221, 0.5);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          color: #e0aaff;
          font-weight: 600;
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

        .result-actions {
          display: flex;
          gap: 1rem;
        }

        .result-close, .result-shop {
          flex: 1;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-close {
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.3), rgba(114, 9, 183, 0.3));
          border: 2px solid rgba(157, 78, 221, 0.5);
          color: #e0aaff;
        }

        .result-close:hover {
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.5), rgba(114, 9, 183, 0.5));
          transform: translateY(-2px);
        }

        .result-shop {
          background: linear-gradient(45deg, rgba(74, 252, 74, 0.3), rgba(34, 197, 34, 0.3));
          border: 2px solid rgba(74, 252, 74, 0.5);
          color: #4afc4a;
        }

        .result-shop:hover {
          background: linear-gradient(45deg, rgba(74, 252, 74, 0.5), rgba(34, 197, 34, 0.5));
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .nav-section {
            top: 0.5rem;
            right: 0.5rem;
          }

          .inventory-cta {
            padding: 0.8rem;
            min-width: 160px;
          }

          .cta-icon {
            font-size: 1.5rem;
          }

          .cta-title {
            font-size: 1rem;
          }

          .cta-subtitle {
            font-size: 0.7rem;
          }

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

          .result-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
} 