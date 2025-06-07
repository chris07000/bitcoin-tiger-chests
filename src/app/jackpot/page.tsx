'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'
import Link from 'next/link'

export default function JackpotPage() {
  const [betAmount, setBetAmount] = useState<number>(0)
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<'heads' | 'tails' | null>(null)
  const [message, setMessage] = useState<string>('')
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [liveWins, setLiveWins] = useState<Array<{address: string, amount: number, timestamp: Date, side: string}>>([])
  const { balance, setBalance, walletAddress: contextWalletAddress } = useLightning()
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [winAudio, setWinAudio] = useState<HTMLAudioElement | null>(null)
  const [showRankUpModal, setShowRankUpModal] = useState(false)
  const [rankUpLevel, setRankUpLevel] = useState('')

  useEffect(() => {
    // Use wallet address from LightningContext or localStorage as fallback
    const storedWallet = contextWalletAddress || localStorage.getItem('walletAddress')
    if (storedWallet) {
      setWalletAddress(storedWallet)
      
      // No need to fetch balance here since LightningContext handles it
      console.log('Coinflip: Using wallet from context:', storedWallet, 'Balance:', balance)
    }

    // Initialize audio on client side only
    if (typeof window !== 'undefined') {
      setAudio(new Audio('/coin-flip.mp3'))
      setWinAudio(new Audio('/win.mp3'))
      
      // Voeg event listener toe voor wanneer de tab weer actief wordt
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log('Tab weer actief, balans verversen...');
          const currentWallet = localStorage.getItem('walletAddress');
          if (currentWallet) {
            fetchCurrentBalance(currentWallet);
          }
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Clean up de event listener
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // Start polling for live wins
    const fetchLiveWins = async () => {
      try {
        const response = await fetch('/api/coinflip/live')
        if (response.ok) {
          const data = await response.json()
          setLiveWins(data)
        }
      } catch (error) {
        console.error('Error fetching live wins:', error)
      }
    }

    // Initial fetch
    fetchLiveWins()

    // Poll every 5 seconds
    const interval = setInterval(fetchLiveWins, 5000)

    return () => interval && clearInterval(interval)
  }, [])

  // Functie om actuele balans op te halen uit database
  const fetchCurrentBalance = async (walletAddr: string) => {
    try {
      console.log(`Ophalen actuele balans voor wallet: ${walletAddr}...`);
      const response = await fetch(`/api/wallet/${walletAddr}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Actuele balans opgehaald: ${data.balance}`);
        
        // Update zowel state als localStorage
        setBalance(data.balance);
        updateBalanceInStorage(walletAddr, data.balance);
      } else {
        console.error('Fout bij ophalen balans:', await response.text());
      }
    } catch (error) {
      console.error('Fout bij API-aanroep voor balans:', error);
    }
  }

  // Update de balans in localStorage na een succesvolle inzet
  const updateBalanceInStorage = (walletAddr: string, newBalance: number) => {
    try {
      // Update balans in lightningBalances
      const balances = JSON.parse(localStorage.getItem('lightningBalances') || '{}');
      balances[walletAddr] = newBalance;
      localStorage.setItem('lightningBalances', JSON.stringify(balances));
      
      // Update lastFetch timestamp om te voorkomen dat Navbar onnodig opnieuw ophaalt
      localStorage.setItem('lastBalanceFetch', Date.now().toString());
      
      console.log(`Balans bijgewerkt naar ${newBalance} voor wallet ${walletAddr}`);
    } catch (err) {
      console.error('Fout bij bijwerken balans in localStorage:', err);
    }
  }

  const handleBet = async () => {
    if (!selectedSide || betAmount <= 0 || !walletAddress) {
      setMessage('Please select a side and enter a valid bet amount')
      return
    }

    if (betAmount > balance) {
      setMessage('Insufficient balance')
      return
    }

    // Reset states
    setMessage('')
    
    // Start met willekeurige positie (heads of tails)
    const randomStart = Math.random() > 0.5 ? 'heads' : 'tails'
    setResult(randomStart)
    
    // Direct het inzetbedrag aftrekken
    const newBalance = balance - betAmount
    setBalance(newBalance)
    updateBalanceInStorage(walletAddress, newBalance)

    try {
      // Speel het coin flip geluid af
      if (audio) {
        audio.currentTime = 0
        audio.play()
      }
      
      // Doe eerst de API call
      const response = await fetch('/api/coinflip/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          betAmount,
          selectedSide
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        // Bij error het bedrag teruggeven
        setBalance(balance)
        updateBalanceInStorage(walletAddress, balance)
        throw new Error(error.error || 'Failed to place bet')
      }

      const data = await response.json()
      
      // Bereken willekeurige animatie parameters
      const startRotation = randomStart === 'heads' ? 0 : 180
      const rotations = Math.floor(Math.random() * 5) + 5 // 5-10 rotaties
      const duration = Math.floor(Math.random() * 2000) + 4000 // 4-6 seconden
      const endRotation = data.result === 'heads' ? rotations * 360 : rotations * 360 + 180
      
      // Start de animatie met willekeurige parameters
      const coinElement = document.querySelector('.coin') as HTMLElement
      if (coinElement) {
        coinElement.style.setProperty('--start-rotation', `${startRotation}deg`)
        coinElement.style.setProperty('--end-rotation', `${endRotation}deg`)
        coinElement.style.setProperty('--animation-duration', `${duration}ms`)
      }
      
      setIsFlipping(true)
      
      // Wacht tot de animatie klaar is
      setTimeout(() => {
        // Stop de animatie
        setIsFlipping(false)
        
        // Zet het resultaat
        setResult(data.result)
        
        // Update balance bij winst of verlies met het juiste bedrag uit de API
        const finalBalance = data.balance
        setBalance(finalBalance)
        updateBalanceInStorage(walletAddress, finalBalance)
        
        if (data.won) {
          setMessage(`You won ${data.reward.toLocaleString()} sats!`)
          // Speel win geluid af
          if (winAudio) {
            winAudio.currentTime = 0
            winAudio.play()
          }
        } else {
          setMessage(`You lost ${betAmount.toLocaleString()} sats!`)
        }
        
        // Check voor rank-up
        if (data.rankUp) {
          setRankUpLevel(data.rankUp)
          setShowRankUpModal(true)
        }
        
        setBetAmount(0)
        setSelectedSide(null)
      }, duration) // Gebruik de willekeurige duur

    } catch (err: any) {
      setMessage(err.message || 'An error occurred')
      setIsFlipping(false)
    }
  }

  return (
    <>
      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          background: #0d1320;
        }
        
        .page-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 5rem 0 2rem 0;
          color: #fff;
          background: #0d1320;
        }

        .ordinal-left, .ordinal-right {
          display: none;
        }

        .title {
          font-size: 1.6rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }
        
        @media (min-width: 769px) {
          .title {
            display: none;
          }
        }
        
        .balance-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .balance-display {
          font-size: 1.1rem;
          color: #ffd700;
          margin: 0 0 1.5rem 0;
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid #ffd700;
          display: inline-block;
          border-radius: 4px;
          text-align: center;
        }

        .coin {
          width: 180px;
          height: 180px;
          margin: 1.5rem auto;
          position: relative;
          transform-style: preserve-3d;
          perspective: 1500px;
          border-radius: 50%;
          background: transparent;
          image-rendering: pixelated;
          -webkit-font-smoothing: none;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .coin-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-family: 'Press Start 2P', monospace;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          image-rendering: pixelated;
        }

        .coin-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .heads {
          background: #FFB800;
          border: 6px solid #000;
          box-shadow: 
            inset -4px -4px 0 #995C00,
            inset 4px 4px 0 #FFD700;
          transform: rotateY(0deg);
        }

        .tails {
          background: #FFB800;
          border: 6px solid #000;
          box-shadow: 
            inset -4px -4px 0 #995C00,
            inset 4px 4px 0 #FFD700;
          transform: rotateY(180deg);
        }

        @keyframes flip {
          0% { transform: rotateY(var(--start-rotation)); }
          100% { transform: rotateY(var(--end-rotation)); }
        }

        .flipping {
          animation: flip var(--animation-duration) cubic-bezier(0.5, 0, 0.2, 1);
        }

        .coin.heads {
          transform: rotateY(0deg);
        }

        .coin.tails {
          transform: rotateY(180deg);
        }

        .side-selection {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin: 1rem 0 1.5rem;
        }

        .side-button {
          padding: 0.7rem 1.5rem;
          font-size: 1.1rem;
          font-family: 'Press Start 2P', monospace;
          background: #1a2942;
          border: 3px solid #ffd700;
          color: #ffd700;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 1px 1px #000;
        }

        .side-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #263c5f;
        }

        .side-button.selected {
          background: #ffd700;
          color: #000;
          text-shadow: none;
        }

        .side-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bet-input {
          margin: 0.75rem 0 1.5rem;
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 500px;
        }

        .bet-amount-button {
          padding: 0.5rem 0.8rem;
          font-size: 0.9rem;
          font-family: 'Press Start 2P', monospace;
          background: #1a2942;
          border: 2px solid #ffd700;
          color: #ffd700;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 1px 1px #000;
        }

        .bet-amount-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #263c5f;
        }

        .bet-amount-button.selected {
          background: #ffd700;
          color: #000;
          text-shadow: none;
        }

        .bet-amount-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .flip-button {
          padding: 0.9rem 2.5rem;
          font-size: 1.3rem;
          font-family: 'Press Start 2P', monospace;
          background: #ffd700;
          border: none;
          color: #000;
          cursor: pointer;
          transition: all 0.2s;
          margin: 0.5rem 0 2rem;
          display: block;
          min-width: 300px;
        }

        .flip-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #ffe970;
        }

        .flip-button:active:not(:disabled) {
          transform: translateY(2px);
        }

        .flip-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .message {
          font-size: 1rem;
          font-family: 'Press Start 2P', monospace;
          padding: 0.5rem 1rem;
          margin: 0.5rem auto;
          display: inline-block;
          text-shadow: 1px 1px #000;
        }

        .message.won {
          color: #4afc4a;
        }

        .message.lost {
          color: #fc4a4a;
        }

        .live-wins {
          width: 100%;
          max-width: 800px;
          margin: 1rem 0;
          padding: 1rem 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .live-wins h2 {
          font-size: 1.2rem;
          color: #ffd700;
          margin-bottom: 1rem;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 1px 1px #000;
        }

        .win-list {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .win-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.7rem;
          border-bottom: 1px solid #263c5f;
          font-size: 0.8rem;
          background: rgba(0, 0, 0, 0.2);
        }

        .win-item:last-child {
          border-bottom: none;
        }

        .win-info {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .win-address {
          color: #ffd700;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 150px;
        }

        .win-side {
          color: #fff;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.7rem;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
        }

        .win-amount {
          color: #44ff44;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .win-time {
          color: #aaa;
          font-size: 0.7rem;
        }

        .win-icon {
          margin-right: 0.2rem;
          color: #ffd700;
        }

        .footer {
          text-align: center;
          margin-top: 2rem;
          padding: 0.75rem;
          color: #aaa;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.5;
        }

        .footer p {
          margin: 0.4rem 0;
        }

        @media (min-width: 769px) {
          .coin {
            width: 220px;
            height: 220px;
          }
          
          .coin-image {
            transform: scale(1.1);
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 1.3rem;
            margin-top: 4rem;
          }
          
          .balance-display {
            font-size: 0.9rem;
          }
          
          .side-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
          
          .bet-amount-button {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
          }
          
          .flip-button {
            padding: 0.7rem 1.8rem;
            font-size: 1.1rem;
            min-width: 250px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 1rem;
            margin-top: 2rem;
          }
          
          .coin {
            width: 150px;
            height: 150px;
          }
          
          .balance-display {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
          
          .side-selection {
            gap: 0.7rem;
          }
          
          .side-button {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
          
          .bet-input {
            gap: 0.3rem;
          }
          
          .bet-amount-button {
            padding: 0.3rem 0.5rem;
            font-size: 0.7rem;
          }
          
          .flip-button {
            padding: 0.6rem 1.5rem;
            font-size: 0.9rem;
            min-width: 200px;
          }
          
          .message {
            font-size: 0.7rem;
          }
          
          .live-wins h2 {
            font-size: 0.9rem;
          }
          
          .win-item {
            padding: 0.5rem;
            font-size: 0.7rem;
          }
        }

        .coin-shine {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 50%;
          height: 300%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 40%,
            rgba(255, 255, 255, 0.7) 50%,
            rgba(255, 255, 255, 0.3) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          animation: coinShine 3s infinite;
          pointer-events: none;
          z-index: 5;
        }
        
        @keyframes coinShine {
          0% {
            left: -100%;
            top: -100%;
          }
          100% {
            left: 200%;
            top: 100%;
          }
        }
        
        .coin-text {
          font-size: 7rem;
          font-family: 'Press Start 2P', monospace;
          color: #000;
          font-weight: bold;
          position: relative;
          z-index: 2;
        }
        
        @media (max-width: 768px) {
          .coin-text {
            font-size: 5rem;
          }
        }
        
        @media (max-width: 480px) {
          .coin-text {
            font-size: 4rem;
          }
        }

        /* Rank-up modal styles */
        .rank-up-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .rank-up-container {
          background: rgba(26, 41, 66, 0.95);
          border: 3px solid #ffd700;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          max-width: 90%;
          width: 400px;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
          position: relative;
          animation: scale-in 0.5s;
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .rank-up-title {
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1rem;
          font-size: 1.4rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .rank-level {
          font-family: 'Press Start 2P', monospace;
          background: linear-gradient(to right, #ffd700, #ffaa00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2rem;
          margin: 1rem 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .rank-up-message {
          margin-bottom: 1.5rem;
          line-height: 1.5;
          color: #fff;
        }
        
        .rank-up-button {
          padding: 0.8rem 1.5rem;
          background: #ffd700;
          border: none;
          font-family: 'Press Start 2P', monospace;
          color: #000;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .rank-up-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .rank-details-link {
          display: block;
          margin-top: 1rem;
          color: #4afc4a;
          text-decoration: underline;
          cursor: pointer;
        }

        .refresh-button {
          background: #1a2942;
          border: 2px solid #ffd700;
          color: #ffd700;
          border-radius: 4px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        
        .refresh-button:hover {
          background: #263c5f;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="page-content">
        <h1 className="title">Tiger Coinflip</h1>
        
        <div className="balance-container">
          <div className="balance-display">
            Balance: {balance.toLocaleString()} sats
          </div>
          <button 
            className="refresh-button" 
            onClick={() => walletAddress && fetchCurrentBalance(walletAddress)}
            title="Refresh Balance">
            ↻
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('won') ? 'won' : 'lost'}`}>
            {message}
          </div>
        )}

        <div 
          className={`coin ${isFlipping ? 'flipping' : ''} ${result || ''}`}
          style={{ 
            transform: result === 'tails' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: isFlipping ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div className="coin-circle heads">
            <span className="coin-text">₿</span>
            <div className="coin-shine"></div>
          </div>
          <div className="coin-circle tails">
            <span className="coin-text">⚡</span>
            <div className="coin-shine"></div>
          </div>
        </div>

        <div className="side-selection">
          <button
            className={`side-button ${selectedSide === 'heads' ? 'selected' : ''}`}
            onClick={() => setSelectedSide('heads')}
            disabled={isFlipping}
          >
            Heads
          </button>
          <button
            className={`side-button ${selectedSide === 'tails' ? 'selected' : ''}`}
            onClick={() => setSelectedSide('tails')}
            disabled={isFlipping}
          >
            Tails
          </button>
        </div>

        <div className="bet-input">
          <button
            className={`bet-amount-button ${betAmount === 1000 ? 'selected' : ''}`}
            onClick={() => setBetAmount(1000)}
            disabled={isFlipping}
          >
            1,000
          </button>
          <button
            className={`bet-amount-button ${betAmount === 2000 ? 'selected' : ''}`}
            onClick={() => setBetAmount(2000)}
            disabled={isFlipping}
          >
            2,000
          </button>
          <button
            className={`bet-amount-button ${betAmount === 5000 ? 'selected' : ''}`}
            onClick={() => setBetAmount(5000)}
            disabled={isFlipping}
          >
            5,000
          </button>
          <button
            className={`bet-amount-button ${betAmount === 10000 ? 'selected' : ''}`}
            onClick={() => setBetAmount(10000)}
            disabled={isFlipping}
          >
            10,000
          </button>
          <input
            type="number"
            value={betAmount === 0 ? '' : betAmount}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseInt(e.target.value);
              if (!isNaN(value) && value >= 0 && value <= 100000) {
                setBetAmount(value);
              }
            }}
            placeholder="Custom amount"
            disabled={isFlipping}
            className="bet-amount-button"
            style={{ width: '120px', textAlign: 'center' }}
          />
        </div>

        <button
          className="flip-button"
          onClick={handleBet}
          disabled={isFlipping || !selectedSide || betAmount <= 0}
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>

        <div className="live-wins">
          <h2>Recent Wins</h2>
          <div className="win-list">
            {liveWins.map((win, index) => (
              <div key={index} className="win-item">
                <div className="win-info">
                  <span className="win-icon">🏆</span>
                  <span className="win-address">
                    {win.address.slice(0, 6)}...{win.address.slice(-4)}
                  </span>
                  <span className="win-side">
                    {win.side}
                  </span>
                </div>
                <div className="win-details">
                  <span className="win-amount">
                    +{win.amount.toLocaleString()} sats
                  </span>
                  <span className="win-time">
                    {new Date(win.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="footer">
          <p>⚡ Powered by Bitcoin Lightning Network ⚡</p>
          <p>Bitcoin Tiger Collective</p>
        </div>
      </div>

      {/* Add the rank-up modal */}
      {showRankUpModal && (
        <div className="rank-up-modal">
          <div className="rank-up-container">
            <h2 className="rank-up-title">RANK UP!</h2>
            <div className="rank-level">{rankUpLevel}</div>
            <p className="rank-up-message">
              Congratulations! You've reached {rankUpLevel} rank with this bet! 
              Your new rank comes with exclusive benefits.
            </p>
            <button 
              className="rank-up-button" 
              onClick={() => setShowRankUpModal(false)}
            >
              Awesome!
            </button>
            <Link href="/ranking" className="rank-details-link">
              View my rank details
            </Link>
          </div>
        </div>
      )}
    </>
  )
} 