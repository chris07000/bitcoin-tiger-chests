'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'
import ChestCard from '../components/chests/ChestCard'
import JackpotBanner from '../components/jackpot/JackpotBanner'
import BitcoinPrice from '../components/bitcoin/BitcoinPrice'
import { ChestProgressProvider } from '../context/ChestProgressContext'
import ChestProgress from '../components/chests/ChestProgress'
import RaffleWinners from '../components/raffle/RaffleWinners'
import { WalletProvider, useWallet } from '../context/WalletContext'

function HomeContent() {
  const { walletAddress } = useWallet()

  const handleChestOpen = () => {
    // Hier kunnen we later extra logica toevoegen als een chest wordt geopend
    console.log('Chest opened!')
  }

  return (
    <main className="pixel-container">
      <style jsx>{`
        .pixel-container {
          background: #0d1320;
          color: #fff;
          min-height: 100vh;
        }
        
        .pixel-header {
          padding: 3rem 1rem;
          text-align: center;
        }
        
        .pixel-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 2rem;
          color: #ffd700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px #000;
        }
        
        .pixel-subtitle {
          font-size: 1.1rem;
          color: #aaa;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .chest-section {
          margin-bottom: 0;
        }
        
        .pixel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          max-width: 850px;
          margin: 0 auto;
          padding: 0 0.8rem;
        }
        
        .progress-section {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
          margin-top: 2rem;
        }
        
        .pixel-main {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 1.2rem;
        }
        
        .pixel-footer {
          text-align: center;
          padding: 2rem 1rem;
          margin-top: 4rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .pixel-footer-text {
          color: #ffd700;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .pixel-footer-subtext {
          color: #aaa;
          font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
          .pixel-title {
            font-size: 1.5rem;
          }
          
          .pixel-subtitle {
            font-size: 0.9rem;
          }
          
          .pixel-grid {
            gap: 1.5rem;
          }
        }
        
        .user-won-tag {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #ffd700, #ff9500);
          color: #000;
          padding: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
          text-align: center;
          z-index: 3;
          font-family: 'Press Start 2P', monospace;
          box-shadow: 0 3px 10px rgba(255, 215, 0, 0.5);
          animation: pulse 2s infinite;
        }
        
        .user-won-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 3px solid #ffd700;
          box-sizing: border-box;
          border-radius: 8px;
          pointer-events: none;
          z-index: 1;
          animation: glow 1.5s infinite alternate;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes glow {
          from { box-shadow: 0 0 5px #ffd700; }
          to { box-shadow: 0 0 20px #ffd700; }
        }
      `}</style>
      <header className="pixel-header">
        <h1 className="pixel-title">Bitcoin Tiger Chests</h1>
        <p className="pixel-subtitle">
          Unlock the power of blockchain rewards with our mystery chests!
        </p>
      </header>

      <BitcoinPrice />
      <JackpotBanner />

      <div className="pixel-main">
        <div className="chest-section">
          <div className="pixel-grid">
            <ChestCard
              type="bronze"
              price={5000}
              maxWin={15000}
              minWin={2000}
              jackpotFee={1000}
              jackpotChance={0.01}
              walletAddress={walletAddress || ''}
              onOpenAction={handleChestOpen}
            />
            <ChestCard
              type="silver"
              price={20000}
              maxWin={60000}
              minWin={12000}
              jackpotFee={2500}
              jackpotChance={0.02}
              walletAddress={walletAddress || ''}
              onOpenAction={handleChestOpen}
            />
            <ChestCard
              type="gold"
              price={50000}
              maxWin={150000}
              minWin={30000}
              jackpotFee={5000}
              jackpotChance={0.02}
              walletAddress={walletAddress || ''}
              onOpenAction={handleChestOpen}
            />
          </div>
        </div>

        <div className="progress-section">
          <ChestProgress />
        </div>

        <RaffleWinners />
      </div>

      <footer className="pixel-footer">
        <p className="pixel-footer-text">
          ⚡ Powered by Bitcoin Lightning Network ⚡
        </p>
        <p className="pixel-footer-subtext">
          Bitcoin Tiger Collective
        </p>
      </footer>
    </main>
  )
}

export default function Home() {
  return (
    <WalletProvider>
      <ChestProgressProvider>
        <HomeContent />
      </ChestProgressProvider>
    </WalletProvider>
  )
}
