'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import JackpotBanner from '@/components/jackpot/JackpotBanner'
import { WalletProvider, useWallet } from '@/context/WalletContext'
import BitcoinPrice from '@/components/bitcoin/BitcoinPrice'

function HomeContent() {
  const { walletAddress } = useWallet()
  const [recentWinners, setRecentWinners] = useState<{
    address: string;
    amount: number;
    game: string;
    timestamp: string;
  }[]>([])
  
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    // Animatie bij laden
    setIsVisible(true)
    
    // Haal echte winnaars op van de API
    const fetchWinners = async () => {
      try {
        const response = await fetch('/api/winners')
        if (response.ok) {
          const data = await response.json()
          setRecentWinners(data)
        }
      } catch (error) {
        console.error('Error fetching winners:', error)
      }
    }
    
    // Initial fetch
    fetchWinners()
    
    // Ververs elke 30 seconden
    const interval = setInterval(fetchWinners, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="casino-home">
      <div className="hero-section" ref={heroRef}>
        <div className="casino-chips">
          <div className="casino-chip chip-gold"></div>
          <div className="casino-chip chip-silver"></div>
          <div className="casino-chip chip-bronze"></div>
        </div>
        
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="banner-container">
            <Image 
              src="/tigerbanner.png" 
              alt="Bitcoin Tiger Collective" 
              width={800} 
              height={300} 
              className="banner-image"
              priority
            />
          </div>
          
          <p className="hero-subtitle">
            Win instant Bitcoin with lightning-fast games!
          </p>
          
          <div className="jackpot-ticker">
            <div className="ticker-label">Latest Winners:</div>
            <div className="ticker-content">
              <div className="ticker-items">
                {recentWinners.slice(0, 5).map((winner, i) => (
                  <span key={i}>
                    {winner.game === 'Jackpot' ? '💎' : 
                     winner.game === 'Bronze Chest' ? '🥉' :
                     winner.game === 'Silver Chest' ? '🥈' :
                     winner.game === 'Gold Chest' ? '🥇' :
                     winner.game === 'Coinflip' ? '🪙' : 
                     winner.game === 'Raffle' ? '🎟️' : '🏆'} {winner.address} won {winner.amount.toLocaleString()} sats
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <span>Lightning Fast</span>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <span>100% Secure</span>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <span>Massive Jackpots</span>
            </div>
          </div>
          
          <div className="cta-buttons">
            <Link href="/" className="cta-button primary">
              <span className="button-glow"></span>
              Play Now
            </Link>
            <Link href="/how-to-play" className="cta-button secondary">
              How to Play
            </Link>
          </div>
        </div>
        
        <div className="hero-games-header">
          <div className="section-title">
            <span className="title-icon">🎮</span>
            <h2 className="pixel-text">Featured Games</h2>
          </div>
        </div>
        
        <div className="games-grid hero-games">
          <Link href="/" className="game-card chest-game">
            <div className="hot-badge">POPULAR</div>
            <div className="game-image chest-image">
              <div className="shine-effect"></div>
              <div className="pulse-overlay"></div>
              <Image 
                src="/chests.png" 
                alt="Mystery Chests" 
                width={320}
                height={320}
                className="chest-img"
                priority
              />
            </div>
            <div className="game-info">
              <h3 className="pixel-text">Mystery Chests</h3>
              <p className="game-description">Open chests to win up to 150,000 sats</p>
              <div className="play-now pixel-text">PLAY NOW <span className="play-arrow">→</span></div>
            </div>
          </Link>
          
          <Link href="/jackpot" className="game-card coinflip-game">
            <div className="game-image coinflip-image">
              <div className="shine-effect"></div>
              <div className="pulse-overlay"></div>
              <Image 
                src="/tigercoin.png" 
                alt="Coinflip" 
                width={320} 
                height={320}
                className="coinflip-img"
              />
            </div>
            <div className="game-info">
              <h3 className="pixel-text">Coinflip</h3>
              <p className="game-description">Double your sats with 50% win chance</p>
              <div className="play-now pixel-text">PLAY NOW <span className="play-arrow">→</span></div>
            </div>
          </Link>
          
          <Link href="/raffle" className="game-card raffle-game">
            <div className="game-image raffle-image">
              <div className="shine-effect"></div>
              <div className="pulse-overlay"></div>
              <Image 
                src="/raffle.png" 
                alt="Bitcoin Raffle" 
                width={320}
                height={320}
                className="raffle-img"
                priority
              />
            </div>
            <div className="game-info">
              <h3 className="pixel-text">Bitcoin Raffle</h3>
              <p className="game-description">Win exclusive Bitcoin Ordinals</p>
              <div className="play-now pixel-text">PLAY NOW <span className="play-arrow">→</span></div>
            </div>
          </Link>
        </div>
        
        <div className="jackpot-display">
          <div className="golden-frame"></div>
          <JackpotBanner />
        </div>
        
        <div className="falling-bitcoins">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="falling-bitcoin" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}>₿</div>
          ))}
        </div>
      </div>

      <div className="winners-and-bitcoin">
        <div className="recent-winners">
          <div className="section-header">
            <div className="section-title">
              <span className="title-icon">🏆</span>
              <h2>Live Winners</h2>
            </div>
          </div>
          
          <div className="winners-feed">
            {recentWinners.map((winner, i) => (
              <div key={i} className="winner-entry">
                <div className="winner-game">{winner.game}</div>
                <div className="winner-address">{winner.address}</div>
                <div className="winner-amount">{winner.amount.toLocaleString()} sats</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bitcoin-price-section">
          <div className="section-header">
            <div className="section-title">
              <span className="title-icon">₿</span>
              <h2>Bitcoin Price</h2>
            </div>
          </div>
          
          <div className="bitcoin-price-container">
            <BitcoinPrice />
          </div>
        </div>
      </div>
      
      <div className="benefits-section">
        <div className="section-header centered">
          <div className="section-title">
            <span className="title-icon">⭐</span>
            <h2>Why Choose Bitcoin Tiger</h2>
          </div>
        </div>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Instant Payments</h3>
            <p>Withdraw your winnings instantly with Bitcoin Lightning</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <p>Our games use provably fair technology ensuring 100% transparency</p>
            <h3>Provably Fair</h3>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🔄</div>
            <h3>Low House Edge</h3>
            <p>Our games offer some of the best odds in the industry</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Play anywhere, anytime on any device</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <div className="slot-symbols">
          <div className="slot-reel">
            <div className="slot-symbol">₿</div>
            <div className="slot-symbol">🎰</div>
            <div className="slot-symbol">💰</div>
            <div className="slot-symbol">⚡</div>
            <div className="slot-symbol">7️⃣</div>
          </div>
          <div className="slot-reel delayed-1">
            <div className="slot-symbol">💰</div>
            <div className="slot-symbol">⚡</div>
            <div className="slot-symbol">₿</div>
            <div className="slot-symbol">7️⃣</div>
            <div className="slot-symbol">🎰</div>
          </div>
          <div className="slot-reel delayed-2">
            <div className="slot-symbol">⚡</div>
            <div className="slot-symbol">7️⃣</div>
            <div className="slot-symbol">💰</div>
            <div className="slot-symbol">₿</div>
            <div className="slot-symbol">🎰</div>
          </div>
        </div>
        
        <div className="cta-content">
          <div className="cta-ribbon">
            <span>LIMITED TIME OFFER</span>
          </div>
          <h2 className="glow-text">Ready to Win Bitcoin?</h2>
          <div className="jackpot-win-animation">
            <div className="coins coin-1">₿</div>
            <div className="coins coin-2">₿</div>
            <div className="coins coin-3">₿</div>
            <p>Join thousands of players who win sats every day!</p>
          </div>
          <Link href="/" className="cta-button primary large pulse-button">
            <span className="shine"></span>
            Start Playing Now
          </Link>
        </div>
      </div>

      <style jsx>{`
        .casino-home {
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          color: #fff;
          min-height: 100vh;
          padding-bottom: 3rem;
          padding-top: 60px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Modern Text Style */
        .pixel-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        /* Hero Section */
        .hero-section {
          background: transparent !important;
          backdrop-filter: none !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 4rem 2rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin: 2rem 1rem 3rem;
          box-shadow: none !important;
        }
        
        .hero-section::before {
          display: none !important;
        }
        
        .casino-chips {
          display: none;
        }
        
        .falling-bitcoins {
          display: none;
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s ease-out;
        }
        
        .hero-content.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .hero-logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .banner-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .banner-image {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(255, 107, 0, 0.3);
        }
        
        .sparkle-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .hero-logo-image {
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(255, 107, 0, 0.3);
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
          font-weight: 500;
        }
        
        .jackpot-ticker {
          background: transparent !important;
          backdrop-filter: none !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 1rem;
          margin-bottom: 2rem;
          overflow: hidden;
        }
        
        .ticker-label {
          color: #FF6B00;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .ticker-content {
          overflow: hidden;
          height: 1.5rem;
        }
        
        .ticker-items {
          display: flex;
          animation: scroll 20s linear infinite;
          white-space: nowrap;
        }
        
        .ticker-items span {
          margin-right: 3rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }
        
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .hero-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        
        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .feature-icon {
          font-size: 1.2rem;
          color: #FF6B00;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        
        .cta-button {
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: inline-block;
        }
        
        .cta-button.primary {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
        }
        
        .cta-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 0, 0.4);
        }
        
        .cta-button.secondary {
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          color: #FF6B00;
        }
        
        .cta-button.secondary:hover {
          border-color: rgba(255, 107, 0, 0.6);
          transform: translateY(-2px);
        }
        
        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .cta-button:hover .button-glow {
          left: 100%;
        }
        
        .hero-games-header {
          margin-bottom: 2rem;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .section-title h2 {
          font-size: 1.8rem;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }
        
        .title-icon {
          font-size: 1.5rem;
          color: #FF6B00;
        }
        
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
          padding: 0 1rem;
        }
        
        .game-card {
          background: transparent !important;
          backdrop-filter: none !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          position: relative;
          overflow: visible;
          box-shadow: none !important;
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .game-card:hover {
          transform: translateY(-8px);
          border-color: transparent !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        
        .hot-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 3;
        }
        
        .game-image {
          height: 280px;
          margin-bottom: 1rem;
          border-radius: 0;
          overflow: visible;
          position: relative;
          background: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: none !important;
          box-shadow: none !important;
          width: 100%;
        }
        
        .chest-img,
        .coinflip-img,
        .raffle-img {
          max-width: 280px;
          max-height: 280px;
          width: auto;
          height: auto;
          object-fit: contain;
          object-position: center center;
          border-radius: 0;
          background: none !important;
          box-shadow: none !important;
          border: none !important;
          display: block;
          margin: 0 auto;
        }
        
        .shine-effect {
          display: none !important;
        }
        
        .pulse-overlay {
          display: none !important;
        }
        
        .game-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
        }
        
        .game-info h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #FF6B00;
          text-align: center;
        }
        
        .game-description {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
          font-size: 0.9rem;
          line-height: 1.4;
          flex: 1;
          text-align: center;
        }
        
        .play-now {
          color: #FF6B00;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .play-arrow {
          transition: transform 0.3s ease;
        }
        
        .game-card:hover .play-arrow {
          transform: translateX(4px);
        }
        
        .jackpot-display {
          margin: 3rem 1rem;
          position: relative;
        }
        
        .golden-frame {
          display: none;
        }
        
        .winners-and-bitcoin {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 3rem 1rem;
        }
        
        .recent-winners,
        .bitcoin-price-section {
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .section-header {
          margin-bottom: 1.5rem;
        }
        
        .section-header.centered {
          text-align: center;
        }
        
        .winners-feed {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .winner-entry {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: none;
          font-size: 0.9rem;
          background: rgba(255, 107, 0, 0.05);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .winner-entry:hover {
          background: rgba(255, 107, 0, 0.1);
          transform: translateX(4px);
        }
        
        .winner-game {
          color: #FF6B00;
          font-weight: 600;
        }
        
        .winner-address {
          color: rgba(255, 255, 255, 0.8);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .winner-amount {
          color: #FFB800;
          font-weight: 600;
          text-align: right;
        }
        
        .benefits-section {
          margin: 4rem 1rem;
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 16px;
          padding: 3rem 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .benefit-card {
          background: rgba(26, 26, 27, 0.4);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 107, 0, 0.2);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        
        .benefit-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 107, 0, 0.4);
          box-shadow: 0 8px 24px rgba(255, 107, 0, 0.15);
        }
        
        .benefit-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #FF6B00;
        }
        
        .benefit-card h3 {
          color: #FFB800;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        .benefit-card p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }
        
        .cta-section {
          background: rgba(26, 26, 27, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 24px;
          margin: 4rem 1rem;
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .slot-symbols {
          display: none;
        }
        
        .cta-content {
          position: relative;
          z-index: 2;
        }
        
        .cta-ribbon {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: white;
          padding: 0.5rem 2rem;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 1.5rem;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        
        .glow-text {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(255, 107, 0, 0.5);
        }
        
        .jackpot-win-animation {
          margin-bottom: 2rem;
        }
        
        .jackpot-win-animation p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin-top: 1rem;
        }
        
        .coins {
          display: inline-block;
          font-size: 2rem;
          color: #FFB800;
          margin: 0 0.5rem;
          animation: bounce 2s infinite;
        }
        
        .coin-1 { animation-delay: 0s; }
        .coin-2 { animation-delay: 0.2s; }
        .coin-3 { animation-delay: 0.4s; }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        
        .pulse-button {
          animation: buttonPulse 2s infinite;
        }
        
        @keyframes buttonPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .cta-button.large {
          padding: 1.5rem 3rem;
          font-size: 1.1rem;
        }
        
        .shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shineEffect 2s infinite;
        }
        
        @keyframes shineEffect {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 1rem 2rem;
            margin: 1rem 0.5rem 2rem;
          }
          
          .banner-image {
            max-width: 95%;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .games-grid {
            grid-template-columns: 1fr;
            padding: 0 0.5rem;
          }
          
          .winners-and-bitcoin {
            grid-template-columns: 1fr;
            margin: 2rem 0.5rem;
          }
          
          .benefits-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-section {
            margin: 3rem 0.5rem;
            padding: 3rem 1rem;
          }
          
          .glow-text {
            font-size: 2rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-features {
            flex-direction: column;
            gap: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .banner-image {
            max-width: 90%;
          }
          
          .cta-button.large {
            padding: 1rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  )
}

export default function Home() {
  return (
    <WalletProvider>
      <HomeContent />
    </WalletProvider>
  )
} 