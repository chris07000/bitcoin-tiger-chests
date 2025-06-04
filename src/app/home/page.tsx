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
          <div className="hero-logo-container">
            <div className="sparkle-wrapper">
              <div className="sparkle sparkle-1"></div>
              <div className="sparkle sparkle-2"></div>
              <div className="sparkle sparkle-3"></div>
              <div className="sparkle sparkle-4"></div>
              <Image 
                src="/tiger-logo.png" 
                alt="Bitcoin Tiger" 
                width={150} 
                height={150} 
                className="hero-logo-image"
              />
            </div>
          </div>
          
          <h1 className="hero-title pixel-text">
            <span className="title-gradient">Bitcoin Tiger</span>
            <span className="title-normal">Collective</span>
          </h1>
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
              <div className="chest-container">
                <Image 
                  src="/chestpixel2.png" 
                  alt="Mystery Chests" 
                  width={240}
                  height={240}
                  className="chest-img"
                  style={{ 
                    objectFit: "contain", 
                    width: "auto", 
                    height: "auto", 
                    maxWidth: "90%",
                    maxHeight: "90%",
                    margin: "auto"
                  }}
                  priority
                />
              </div>
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
              <div className="coinflip-container">
                <Image 
                  src="/tigercoin.gif" 
                  alt="Coinflip" 
                  width={150} 
                  height={150}
                  className="coinflip-img"
                />
              </div>
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
              <div className="raffle-container">
                <Image 
                  src="/tiger-pixel1.png" 
                  alt="Bitcoin Raffle" 
                  width={230}
                  height={230}
                  className="raffle-img"
                  style={{ 
                    objectFit: "contain", 
                    width: "auto", 
                    height: "auto", 
                    maxWidth: "90%",
                    maxHeight: "90%",
                    margin: "auto"
                  }}
                  priority
                />
              </div>
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
          background: #0d1320;
          color: #fff;
          min-height: 100vh;
          padding-bottom: 3rem;
          padding-top: 60px;
          background-image: 
            url('/noise.png'),
            radial-gradient(circle at 10% 10%, rgba(255, 215, 0, 0.03) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(255, 215, 0, 0.03) 0%, transparent 40%);
          font-family: "Roboto", sans-serif;
        }
        
        /* Pixel Text Style */
        .pixel-text {
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, rgba(13, 19, 32, 0.9) 0%, rgba(22, 28, 48, 0.9) 100%);
          padding: 4rem 1rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 215, 0, 0.3);
          margin-top: 20px;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .casino-chips {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
        }
        
        .casino-chip {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          animation: floatChip 15s infinite linear;
          opacity: 0.5;
        }
        
        .chip-gold {
          background: radial-gradient(circle at center, #ffd700, #b8860b);
          top: 20%;
          left: 5%;
          animation-delay: 0s;
          animation-duration: 20s;
        }
        
        .chip-silver {
          background: radial-gradient(circle at center, #c0c0c0, #a9a9a9);
          bottom: 10%;
          right: 10%;
          animation-delay: 5s;
          animation-duration: 25s;
        }
        
        .chip-bronze {
          background: radial-gradient(circle at center, #cd7f32, #8b4513);
          top: 70%;
          left: 15%;
          animation-delay: 10s;
          animation-duration: 18s;
        }
        
        @keyframes floatChip {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(100px, 50px) rotate(90deg);
          }
          50% {
            transform: translate(200px, 0) rotate(180deg);
          }
          75% {
            transform: translate(100px, -50px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        
        .falling-bitcoins {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          overflow: hidden;
        }
        
        .falling-bitcoin {
          position: absolute;
          color: #ffd700;
          top: -20px;
          font-size: 20px;
          opacity: 0.5;
          animation: fallingBitcoin 20s linear infinite;
        }
        
        @keyframes fallingBitcoin {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(calc(100vh + 20px)) rotate(360deg);
            opacity: 0;
          }
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
          position: relative;
        }
        
        .sparkle-wrapper {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .hero-logo-image {
          z-index: 2;
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
          animation: logoFloat 3s ease-in-out infinite;
        }
        
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .sparkle {
          position: absolute;
          background: rgba(255, 215, 0, 0.6);
          border-radius: 50%;
          z-index: 1;
        }
        
        .sparkle-1 {
          width: 20px;
          height: 20px;
          top: 20%;
          left: 10%;
          animation: sparkleFloat 4s ease-in-out infinite;
        }
        
        .sparkle-2 {
          width: 15px;
          height: 15px;
          top: 10%;
          right: 15%;
          animation: sparkleFloat 3.5s ease-in-out infinite 0.5s;
        }
        
        .sparkle-3 {
          width: 25px;
          height: 25px;
          bottom: 20%;
          right: 10%;
          animation: sparkleFloat 4.5s ease-in-out infinite 1s;
        }
        
        .sparkle-4 {
          width: 18px;
          height: 18px;
          bottom: 15%;
          left: 15%;
          animation: sparkleFloat 5s ease-in-out infinite 1.5s;
        }
        
        @keyframes sparkleFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px) scale(1.3);
            opacity: 1;
          }
        }
        
        .hero-title {
          font-size: 2.8rem;
          color: #fff;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        
        .title-gradient {
          background: linear-gradient(90deg, #ffd700, #ff9500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }
        
        .title-normal {
          color: #fff;
          font-size: 2rem;
          opacity: 0.9;
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 1rem;
          opacity: 0.9;
        }
        
        .jackpot-ticker {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 30px;
          padding: 0.5rem 1rem;
          margin: 0 auto 1.5rem;
          max-width: 80%;
          overflow: hidden;
          border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .ticker-label {
          color: #ffd700;
          font-weight: bold;
          margin-right: 0.5rem;
          white-space: nowrap;
        }
        
        .ticker-content {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        
        .ticker-items {
          display: flex;
          animation: tickerScroll 25s linear infinite;
          padding-right: 50px;
        }
        
        .ticker-items span {
          white-space: nowrap;
          margin-right: 30px;
        }
        
        @keyframes tickerScroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
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
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 30px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .feature:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .feature-icon {
          font-size: 1.5rem;
        }
        
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .cta-button {
          padding: 0.8rem 1.8rem;
          font-weight: bold;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        
        .cta-button.large {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }
        
        .button-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(255, 215, 0, 0.3), transparent 70%);
          transform: scale(0);
          border-radius: 50%;
          animation: buttonPulse 2s infinite;
          z-index: 0;
        }
        
        @keyframes buttonPulse {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        
        .cta-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(45deg);
          z-index: 1;
          transition: all 0.3s ease;
          opacity: 0;
        }
        
        .cta-button:hover::after {
          opacity: 1;
          animation: shine 1.5s infinite;
        }
        
        .cta-button.primary {
          background: linear-gradient(135deg, #ffd700, #ff9900);
          color: #0d1320;
          border: none;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }
        
        .cta-button.secondary {
          background: transparent;
          color: #fff;
          border: 2px solid #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }
        
        .jackpot-display {
          margin: 0 auto;
          max-width: 800px;
          position: relative;
        }
        
        .golden-frame {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #ffd700, transparent, #ffd700, transparent, #ffd700);
          border-image-slice: 1;
          z-index: 1;
          pointer-events: none;
          animation: borderGlow 4s infinite linear;
        }
        
        @keyframes borderGlow {
          0% {
            border-image: linear-gradient(0deg, #ffd700, transparent, #ffd700, transparent, #ffd700);
            border-image-slice: 1;
          }
          25% {
            border-image: linear-gradient(90deg, #ffd700, transparent, #ffd700, transparent, #ffd700);
            border-image-slice: 1;
          }
          50% {
            border-image: linear-gradient(180deg, #ffd700, transparent, #ffd700, transparent, #ffd700);
            border-image-slice: 1;
          }
          75% {
            border-image: linear-gradient(270deg, #ffd700, transparent, #ffd700, transparent, #ffd700);
            border-image-slice: 1;
          }
          100% {
            border-image: linear-gradient(360deg, #ffd700, transparent, #ffd700, transparent, #ffd700);
            border-image-slice: 1;
          }
        }
        
        /* Games Section */
        .games-section {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
          padding-bottom: 1rem;
        }
        
        .section-header.centered {
          justify-content: center;
          text-align: center;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .title-icon {
          font-size: 2rem;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
        }
        
        .section-title h2 {
          margin: 0;
          font-size: 1.8rem;
          color: #ffd700;
          text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.5);
        }
        
        .view-all {
          color: #8a2be2;
          text-decoration: none;
          background: linear-gradient(90deg, #8a2be2, #4b0082);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 0.8rem;
          position: relative;
          padding-bottom: 0.2rem;
        }
        
        .view-all::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #8a2be2, #4b0082);
        }
        
        .games-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        
        @media (max-width: 900px) {
          .games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 600px) {
          .games-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .game-card {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 3px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transform-style: preserve-3d;
          perspective: 1000px;
          height: 380px;
          width: 100%;
        }
        
        .game-card:hover {
          transform: translateY(-10px) rotateX(5deg);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 215, 0, 0.5);
          z-index: 1;
        }
        
        .game-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%);
          pointer-events: none;
        }
        
        .game-card.chest-game {
          border-color: rgba(255, 165, 0, 0.3);
        }
        
        .game-card.coinflip-game {
          border-color: rgba(173, 216, 230, 0.3);
        }
        
        .game-card.raffle-game {
          border-color: rgba(138, 43, 226, 0.3);
        }
        
        .game-image {
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        
        .hot-badge {
          position: absolute;
          top: 10px;
          right: -25px;
          background: linear-gradient(135deg, #ff4500, #ff7800);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 0.3rem 0.6rem;
          border-radius: 3px;
          z-index: 5;
          box-shadow: 0 0 10px rgba(255, 69, 0, 0.7);
          transform: rotate(35deg);
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
        }
        
        .pulse-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 30%, rgba(255, 215, 0, 0.1) 70%);
          opacity: 0;
          animation: pulsateOverlay 2s infinite;
        }
        
        @keyframes pulsateOverlay {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        
        .chest-image {
          background: linear-gradient(135deg, #0d0a2c 0%, #0c1836 100%);
          background-image: url('/starry-bg.png');
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        
        .chest-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .chest-img {
          filter: drop-shadow(0 0 15px rgba(255, 165, 0, 0.5));
          width: 300px;
          height: 300px;
          object-fit: contain;
        }
        
        .game-card:hover .chest-container {
          animation: floatChest 3s infinite ease-in-out;
        }
        
        @keyframes floatChest {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        
        .coinflip-image {
          background: #fd6f17;
          position: relative;
          overflow: hidden;
        }
        
        .coinflip-container {
          position: relative;
          transition: transform 0.5s ease;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .coinflip-img {
          filter: drop-shadow(0 0 15px rgba(255, 255, 0, 0.5));
          width: 160px;
          height: 160px;
          object-fit: contain;
          animation: spin 8s infinite linear;
        }
        
        @keyframes spin {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        
        .raffle-image {
          background: linear-gradient(135deg, #4a2445 0%, #2a142d 100%);
          position: relative;
          overflow: hidden;
        }
        
        .raffle-image::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: radial-gradient(circle at center, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
          animation: rotateBg 20s infinite linear;
        }
        
        .raffle-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }
        
        .raffle-img {
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
          animation: floatRaffle 3s infinite ease-in-out;
        }
        
        @keyframes floatRaffle {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        
        .shine-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%);
          transform: translateX(-100%);
          transition: transform 0.6s;
          z-index: 3;
        }
        
        .game-card:hover .shine-effect {
          transform: translateX(100%);
        }
        
        .game-info {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          border-top: 2px solid rgba(255, 215, 0, 0.2);
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
          position: relative;
          z-index: 2;
        }
        
        .game-info::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 10%;
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
        }
        
        .game-info h3 {
          margin: 0 0 0.5rem;
          font-size: 1.3rem;
          color: #ffd700;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
          text-align: center;
          text-transform: uppercase;
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 1px;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(138, 43, 226, 0.3);
        }
        
        .game-description {
          margin: 0.5rem 0 1rem;
          opacity: 0.8;
          font-size: 0.9rem;
          flex-grow: 1;
          color: #a58fff;
          text-align: center;
        }
        
        .chest-game .game-description {
          color: #ffa500;
        }
        
        .coinflip-game .game-description {
          color: #add8e6;
        }
        
        .raffle-game .game-description {
          color: #ba55d3;
        }
        
        .play-now {
          align-self: center;
          background: rgba(0, 0, 0, 0.5);
          color: #ffd700;
          padding: 0.7rem 1.4rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 2px solid rgba(255, 215, 0, 0.3);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
          cursor: pointer;
        }
        
        .play-arrow {
          transition: transform 0.3s ease;
        }
        
        .game-card:hover .play-now {
          background: rgba(255, 215, 0, 0.2);
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        }
        
        .game-card:hover .play-arrow {
          transform: translateX(5px);
        }
        
        .chest-game:hover .play-now {
          border-color: rgba(255, 165, 0, 0.5);
        }
        
        .coinflip-game:hover .play-now {
          border-color: rgba(173, 216, 230, 0.5);
        }
        
        .raffle-game:hover .play-now {
          border-color: rgba(138, 43, 226, 0.5);
        }
        
        /* Winners and Bitcoin Section */
        .winners-and-bitcoin {
          margin-top: 2rem;
        }
        
        .winners-feed {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255, 215, 0, 0.1);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .winner-entry {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
          animation: fadeIn 0.5s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .winner-entry:hover {
          background: rgba(255, 215, 0, 0.05);
          transform: translateX(5px);
        }
        
        .winner-game {
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
        }
        
        .winner-address {
          opacity: 0.8;
        }
        
        .winner-amount {
          text-align: right;
          font-weight: bold;
          background: linear-gradient(90deg, #ffd700, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .bitcoin-price-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 215, 0, 0.1);
          height: 100%;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        /* Benefits Section */
        .benefits-section {
          padding: 3rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        .benefit-card {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 215, 0, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .benefit-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1), transparent 70%);
          transform: scale(0);
          border-radius: 50%;
          z-index: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .benefit-card:hover::before {
          transform: scale(1);
          opacity: 1;
          animation: none;
        }
        
        .benefit-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .benefit-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }
        
        .benefit-card h3 {
          margin: 0 0 0.8rem;
          color: #ffd700;
          position: relative;
          z-index: 1;
          text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
        }
        
        .benefit-card p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
          position: relative;
          z-index: 1;
        }
        
        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, rgba(13, 19, 32, 0.9) 0%, rgba(22, 28, 48, 0.9) 100%);
          padding: 3rem 1rem;
          margin-top: 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .slot-symbols {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .slot-reel {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 8px;
          padding: 0.5rem;
          width: 60px;
          height: 80px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }
        
        .slot-symbol {
          font-size: 2rem;
          line-height: 1;
          animation: slotSpin 4s infinite;
        }
        
        .delayed-1 .slot-symbol {
          animation-delay: 0.2s;
        }
        
        .delayed-2 .slot-symbol {
          animation-delay: 0.4s;
        }
        
        @keyframes slotSpin {
          0%, 10% {
            transform: translateY(0);
          }
          90%, 100% {
            transform: translateY(-400%);
          }
        }
        
        .cta-ribbon {
          background: linear-gradient(135deg, #ff4500, #ff7800);
          color: white;
          font-weight: bold;
          padding: 0.5rem 1.5rem;
          position: relative;
          margin: 0 auto 1.5rem;
          display: inline-block;
          box-shadow: 0 0 10px rgba(255, 69, 0, 0.5);
          clip-path: polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%);
          animation: pulse 2s infinite alternate;
        }
        
        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        
        .glow-text {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          position: relative;
          animation: textShadowPulse 2s infinite alternate;
        }
        
        @keyframes textShadowPulse {
          0% {
            text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
          }
          100% {
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6);
          }
        }
        
        .jackpot-win-animation {
          position: relative;
          margin-bottom: 2rem;
        }
        
        .coins {
          position: absolute;
          color: #ffd700;
          font-size: 1.5rem;
          animation: coinsUp 3s infinite;
          opacity: 0;
        }
        
        .coin-1 {
          left: 20%;
          animation-delay: 0s;
        }
        
        .coin-2 {
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0.5s;
        }
        
        .coin-3 {
          right: 20%;
          animation-delay: 1s;
        }
        
        @keyframes coinsUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px);
            opacity: 0;
          }
        }
        
        .cta-content p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          position: relative;
        }
        
        .pulse-button {
          position: relative;
          animation: buttonScale 2s infinite alternate;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        
        .shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-100%);
          animation: shineEffect 3s infinite;
        }
        
        @keyframes shineEffect {
          0% {
            transform: translateX(-100%);
          }
          20%, 100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes buttonScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        /* Animations */
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6); }
          100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
        }
        
        @keyframes shine {
          0% { transform: rotate(45deg) translateX(-120%); }
          100% { transform: rotate(45deg) translateX(120%); }
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .casino-home {
            padding-top: 50px;
          }
          
          .hero-section {
            padding: 3rem 0.75rem 2rem;
            margin-top: 10px;
          }
          
          .hero-logo-container {
            margin-bottom: 1.5rem;
          }
          
          .sparkle-wrapper {
            width: 120px;
            height: 120px;
          }
          
          .hero-title {
            font-size: 1.8rem;
          }
          
          .title-normal {
            font-size: 1.4rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .hero-features {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
          
          .cta-buttons {
            flex-direction: column;
            gap: 1rem;
          }
          
          .cta-button {
            width: 100%;
            text-align: center;
          }
          
          .winners-and-bitcoin {
            grid-template-columns: 1fr;
          }
          
          .games-grid {
            grid-template-columns: 1fr;
          }
          
          .game-card {
            height: 350px;
          }
          
          .game-image {
            height: 180px;
          }
          
          .chest-img, .coinflip-img {
            width: 130px;
            height: 130px;
          }
          
          .raffle-artifact {
            width: 50px;
            height: 50px;
            gap: 0.8rem;
          }
          
          .benefits-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-content h2 {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .casino-home {
            padding-top: 40px;
          }
          
          .hero-section {
            padding: 2rem 0.5rem 1.5rem;
            margin-top: 5px;
          }
          
          .hero-logo-container {
            margin-bottom: 1rem;
          }
          
          .sparkle-wrapper {
            width: 100px;
            height: 100px;
          }
          
          .sparkle-1, .sparkle-3 {
            width: 15px;
            height: 15px;
          }
          
          .sparkle-2, .sparkle-4 {
            width: 10px;
            height: 10px;
          }
          
          .hero-logo-image {
            width: 80px;
            height: 80px;
          }
          
          .hero-title {
            font-size: 1.5rem;
          }
          
          .title-normal {
            font-size: 1.2rem;
          }
          
          .jackpot-ticker {
            font-size: 0.7rem;
            padding: 0.3rem 0.6rem;
          }
          
          .ticker-label {
            font-size: 0.7rem;
          }
          
          .ticker-items span {
            font-size: 0.7rem;
            margin-right: 20px;
          }
          
          .feature {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
          }
          
          .feature-icon {
            font-size: 1.2rem;
          }
          
          .game-card {
            margin-bottom: 1rem;
          }
        }
        
        /* Adjust games grid in hero section */
        .hero-games {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          z-index: 5;
          position: relative;
        }
        
        .hero-games .game-card {
          background-color: #000000;
          background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
          width: calc(33.333% - 1rem);
          max-width: 310px;
          min-width: 280px;
          border: 2px solid rgba(255, 215, 0, 0.2);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 3;
          height: 380px;
        }
        
        .hero-games .game-card.chest-game {
          border-color: rgba(255, 165, 0, 0.5);
        }
        
        .hero-games .game-card.coinflip-game {
          border-color: rgba(173, 216, 230, 0.5);
        }
        
        .hero-games .game-card.raffle-game {
          border-color: rgba(138, 43, 226, 0.5);
        }
        
        .hero-games .game-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 215, 0, 0.5);
        }
        
        .hero-games .game-card.chest-game:hover {
          border-color: rgba(255, 165, 0, 0.8);
        }
        
        .hero-games .game-card.coinflip-game:hover {
          border-color: rgba(173, 216, 230, 0.8);
        }
        
        .hero-games .game-card.raffle-game:hover {
          border-color: rgba(138, 43, 226, 0.8);
        }
        
        /* Hero Games Header */
        .hero-games-header {
          text-align: center;
          margin-top: 3rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 5;
        }
        
        .hero-games-header .section-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .hero-games-header .title-icon {
          font-size: 1.5rem;
          background: linear-gradient(135deg, #ffd700, #ff9500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        
        .hero-games-header h2 {
          font-size: 1.8rem;
          margin: 0;
          color: #ffd700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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