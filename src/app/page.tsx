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
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          color: #fff;
          min-height: 100vh;
        }
        
        .pixel-header {
          padding: 2rem 1rem;
          text-align: center;
          background: rgba(26, 26, 27, 0.3);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 107, 0, 0.2);
          margin-bottom: 2rem;
        }
        
        .banner-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          position: relative;
          padding: 2rem;
        }
        
        .banner-frame {
          position: relative;
          background: rgba(26, 26, 27, 0.4);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 107, 0, 0.3);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 900px;
          width: 100%;
        }
        
        .banner-frame::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            #FF6B00, #FFB800, #FF6B00, #FFB800, #FF6B00);
          background-size: 400% 400%;
          border-radius: 26px;
          z-index: -1;
          animation: gradientShift 4s ease infinite;
          opacity: 0.7;
        }
        
        .banner-frame::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(135deg, 
            rgba(255, 107, 0, 0.1) 0%, 
            rgba(255, 184, 0, 0.05) 50%, 
            rgba(255, 107, 0, 0.1) 100%);
          border-radius: 28px;
          z-index: -2;
          filter: blur(8px);
        }
        
        .banner-inner-frame {
          position: relative;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 107, 0, 0.2);
          border-radius: 16px;
          padding: 1rem;
          overflow: hidden;
        }
        
        .banner-inner-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 107, 0, 0.6), 
            transparent);
        }
        
        .banner-inner-frame::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 184, 0, 0.4), 
            transparent);
        }
        
        .banner-decorative-corners {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .banner-decorative-corners::before,
        .banner-decorative-corners::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 107, 0, 0.6);
        }
        
        .banner-decorative-corners::before {
          top: 8px;
          left: 8px;
          border-right: none;
          border-bottom: none;
          border-radius: 8px 0 0 0;
        }
        
        .banner-decorative-corners::after {
          bottom: 8px;
          right: 8px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 8px 0;
        }
        
        .banner-frame:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 0 80px rgba(255, 107, 0, 0.3);
        }
        
        .banner-frame:hover::before {
          opacity: 1;
          animation-duration: 2s;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .banner-image {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          position: relative;
          z-index: 2;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
          -ms-interpolation-mode: nearest-neighbor;
          filter: drop-shadow(0 8px 32px rgba(255, 107, 0, 0.4));
        }
        
        .banner-frame:hover .banner-image {
          transform: scale(1.02);
          filter: drop-shadow(0 12px 48px rgba(255, 107, 0, 0.6));
        }
        
        .pixel-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 500;
        }
        
        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .chest-section {
          margin-bottom: 4rem;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }
        
        .pixel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .progress-section {
          width: 100%;
          margin-top: 4rem;
        }
        
        .pixel-main {
          padding: 2rem 0;
        }
        
        .pixel-footer {
          text-align: center;
          padding: 4rem 1rem;
          margin-top: 5rem;
          border-top: 1px solid rgba(255, 107, 0, 0.3);
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(20px);
          position: relative;
        }
        
        .pixel-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #FF6B00, transparent);
        }
        
        .pixel-footer-text {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .pixel-footer-subtext {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          font-weight: 500;
        }
        
        .components-section {
          padding: 0 1rem;
          max-width: 1200px;
          margin: 0 auto 3rem auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .component-wrapper {
          background: rgba(26, 26, 27, 0.4);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 107, 0, 0.2);
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .component-wrapper:hover {
          border-color: rgba(255, 107, 0, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 107, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .banner-container {
            padding: 1rem;
          }
          
          .banner-frame {
            padding: 1rem;
            border-radius: 20px;
            max-width: 100%;
          }
          
          .banner-frame::before {
            border-radius: 22px;
          }
          
          .banner-frame::after {
            border-radius: 24px;
          }
          
          .banner-inner-frame {
            padding: 0.75rem;
            border-radius: 12px;
          }
          
          .banner-decorative-corners::before,
          .banner-decorative-corners::after {
            width: 15px;
            height: 15px;
          }
          
          .banner-decorative-corners::before {
            top: 6px;
            left: 6px;
          }
          
          .banner-decorative-corners::after {
            bottom: 6px;
            right: 6px;
          }
          
          .banner-image {
            max-width: 95%;
          }
          
          .pixel-subtitle {
            font-size: 1rem;
          }
          
          .section-title {
            font-size: 1.6rem;
          }
          
          .pixel-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .pixel-header {
            padding: 2rem 1rem;
          }
          
          .pixel-main {
            padding: 1.5rem 0;
          }
          
          .content-wrapper {
            padding: 0 0.5rem;
          }
          
          .components-section {
            padding: 0 0.5rem;
          }
          
          .pixel-footer {
            padding: 3rem 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .banner-container {
            padding: 0.5rem;
          }
          
          .banner-frame {
            padding: 0.75rem;
            border-radius: 16px;
          }
          
          .banner-frame::before {
            border-radius: 18px;
          }
          
          .banner-frame::after {
            border-radius: 20px;
          }
          
          .banner-inner-frame {
            padding: 0.5rem;
            border-radius: 10px;
          }
          
          .banner-decorative-corners::before,
          .banner-decorative-corners::after {
            width: 12px;
            height: 12px;
          }
          
          .banner-decorative-corners::before {
            top: 4px;
            left: 4px;
          }
          
          .banner-decorative-corners::after {
            bottom: 4px;
            right: 4px;
          }
          
          .banner-image {
            max-width: 90%;
          }
          
          .pixel-subtitle {
            font-size: 0.9rem;
          }
          
          .section-title {
            font-size: 1.4rem;
          }
          
          .pixel-header {
            padding: 1.5rem 0.5rem;
          }
          
          .pixel-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
        
        .user-won-tag {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: white;
          padding: 0.8rem;
          font-size: 1rem;
          font-weight: 700;
          text-align: center;
          z-index: 3;
          box-shadow: 0 4px 20px rgba(255, 107, 0, 0.5);
          animation: pulse 2s infinite;
          border-radius: 12px 12px 0 0;
        }
        
        .user-won-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid #FF6B00;
          box-sizing: border-box;
          border-radius: 16px;
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
          from { box-shadow: 0 0 10px rgba(255, 107, 0, 0.5); }
          to { box-shadow: 0 0 30px rgba(255, 107, 0, 0.8); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }
        
        /* Global image sharpening */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
          -ms-interpolation-mode: nearest-neighbor;
          image-rendering: optimizeQuality;
        }
      `}</style>
      
      <header className="pixel-header">
        <div className="banner-container">
          <div className="banner-frame">
            <div className="banner-decorative-corners"></div>
            <div className="banner-inner-frame">
              <Image 
                src="/tigerbanner.png" 
                alt="Bitcoin Tiger Collective" 
                width={800} 
                height={300} 
                className="banner-image"
                priority
              />
            </div>
          </div>
        </div>
        <p className="pixel-subtitle">
          Unlock the power of blockchain rewards with our mystery chests and experience the future of Bitcoin gaming
        </p>
      </header>

      <div className="components-section">
        <div className="component-wrapper">
          <BitcoinPrice />
        </div>
        <div className="component-wrapper">
          <JackpotBanner />
        </div>
      </div>

      <div className="pixel-main">
        <div className="content-wrapper">
          <div className="chest-section">
            <div className="section-header">
              <h2 className="section-title">Mystery Chests</h2>
              <p className="section-subtitle">
                Choose your adventure and discover incredible Bitcoin rewards
              </p>
            </div>
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
        </div>
      </div>

      <footer className="pixel-footer">
        <p className="pixel-footer-text">
          Powered by Bitcoin Lightning Network
        </p>
        <p className="pixel-footer-subtext">
          The Future of Bitcoin Gaming
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
