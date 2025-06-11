'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLightning } from '@/context/LightningContext';

interface SlotSymbol {
  id: string;
  emoji: string;
  name: string;
  value: number;
  rarity: number; // Higher = rarer
}

interface SpinResult {
  symbols: string[][];
  payout: number;
  isWin: boolean;
  winType?: string;
  bonus?: boolean;
  scatter?: boolean;
}

const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: 'tiger5', emoji: '', name: 'Tiger #5', value: 1, rarity: 1 },
  { id: 'tiger12', emoji: '', name: 'Tiger #12', value: 1.2, rarity: 2 },
  { id: 'tiger23', emoji: '', name: 'Tiger #23', value: 1.4, rarity: 3 },
  { id: 'tiger45', emoji: '', name: 'Tiger #45', value: 1.6, rarity: 4 },
  { id: 'tiger67', emoji: '', name: 'Tiger #67', value: 1.8, rarity: 5 },
  { id: 'tiger89', emoji: '', name: 'Tiger #89', value: 2, rarity: 6 },     // "Bells"
  { id: 'tiger123', emoji: '', name: 'Tiger #123', value: 3, rarity: 7 },   // "Strawberries"  
  { id: 'tiger234', emoji: '', name: 'Tiger #234', value: 4, rarity: 8 },   // "Melons"
  { id: 'tiger456', emoji: '', name: 'Tiger #456', value: 5, rarity: 9 },   // Almost Jackpot
  { id: 'tiger777', emoji: '', name: 'Tiger #777', value: 6, rarity: 10 },  // Jackpot
];

const BET_AMOUNTS = [400, 1000, 2000, 4000, 8000];

const WINLINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Center row  
  [6, 7, 8], // Bottom row
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];

// Client-side payout table (for DISPLAY ONLY - not used for actual game logic)
const getCustomPayout = (betAmount: number, symbolId: string): number => {
  const payoutTable: { [key: number]: { [key: string]: number } } = {
    400: {
      'tiger777': 20000,   'tiger456': 6000,    'tiger234': 6000,
      'tiger123': 6000,    'tiger89': 6000,     'tiger67': 2800,
      'tiger45': 2800,     'tiger23': 2800,     'tiger12': 2800,     'tiger5': 2800
    },
    1000: {
      'tiger777': 40000,   'tiger456': 16000,   'tiger234': 16000,
      'tiger123': 16000,   'tiger89': 16000,    'tiger67': 8000,
      'tiger45': 8000,     'tiger23': 8000,     'tiger12': 8000,     'tiger5': 8000
    },
    2000: {
      'tiger777': 80000,   'tiger456': 32000,   'tiger234': 32000,
      'tiger123': 32000,   'tiger89': 32000,    'tiger67': 16000,
      'tiger45': 16000,    'tiger23': 16000,    'tiger12': 16000,    'tiger5': 16000
    },
    4000: {
      'tiger777': 200000,  'tiger456': 80000,   'tiger234': 80000,
      'tiger123': 64000,   'tiger89': 64000,    'tiger67': 32000,
      'tiger45': 32000,    'tiger23': 32000,    'tiger12': 32000,    'tiger5': 32000
    },
    8000: {
      'tiger777': 400000,  'tiger456': 160000,  'tiger234': 160000,
      'tiger123': 148000,  'tiger89': 128000,   'tiger67': 64000,
      'tiger45': 64000,    'tiger23': 64000,    'tiger12': 64000,    'tiger5': 64000
    }
  };
  
  return payoutTable[betAmount]?.[symbolId] || 0;
};

const getWeightedRandomSymbol = (): SlotSymbol => {
  // This is now only used for visual effects during spinning animation
  // The actual game uses traditional slot machine reel strips (server-side)
  // Simple random selection for visual variety
  const randomIndex = Math.floor(Math.random() * SLOT_SYMBOLS.length);
  return SLOT_SYMBOLS[randomIndex];
};

export default function SlotMachine() {
  const [reels, setReels] = useState<string[][]>([[], [], []]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentBet, setCurrentBet] = useState(1000); // Default to 1000 sats
  const [lastWin, setLastWin] = useState<SpinResult | null>(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { walletAddress } = useWallet();
  const { balance, fetchBalance, updateBalanceWithTimestamp } = useLightning();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
    
    // Initialize reels
    initializeReels();
  }, []);

  const initializeReels = () => {
    const initialReels = [
      generateRandomReel(),
      generateRandomReel(),
      generateRandomReel()
    ];
    setReels(initialReels);
  };

  const generateRandomReel = (): string[] => {
    const reel: string[] = [];
    for (let i = 0; i < 3; i++) {
      const randomSymbol = getWeightedRandomSymbol();
      reel.push(randomSymbol.id);
    }
    return reel;
  };

  const spin = async () => {
    if (!walletAddress || balance < currentBet || isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);

    try {
      // Call secure server-side API that handles everything
      const response = await fetch('/api/slots/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          betAmount: currentBet
        })
      });

      const apiResult = await response.json();
      
      if (!apiResult.success) {
        alert(apiResult.error);
        setIsSpinning(false);
        return;
      }

      // Extract server-generated results
      const { gameResult, balance: newBalance, houseRevenue } = apiResult;
      
      // Update balance immediately with server response
      updateBalanceWithTimestamp(newBalance);
      console.log(`Spin result: Bet ${currentBet} sats, Payout ${gameResult.payout} sats, House Revenue ${houseRevenue} sats`);

      // Simulate spinning animation
      const spinDuration = 2000;
      const intervalDuration = 100;
      let elapsed = 0;

      const spinInterval = setInterval(() => {
        // Show random symbols during animation (visual only)
        setReels([
          generateRandomReel(),
          generateRandomReel(),
          generateRandomReel()
        ]);
        elapsed += intervalDuration;

        if (elapsed >= spinDuration) {
          clearInterval(spinInterval);
          
          // Show final server result
          setReels(gameResult.reels);
          setLastWin(gameResult);
          setGamesPlayed(prev => prev + 1);
          setIsSpinning(false);
        }
      }, intervalDuration);

    } catch (error) {
      console.error('Error processing spin:', error);
      alert('Failed to process spin. Please try again.');
      setIsSpinning(false);
      return;
    }
  };

  const getSymbolDisplay = (symbolId: string) => {
    // Extract tiger number from symbolId (e.g., 'tiger777' -> '777')
    const tigerNumber = symbolId.replace('tiger', '');
    return (
      <img 
        src={`/${tigerNumber}.png`} 
        alt={`Tiger #${tigerNumber}`}
        className="tiger-symbol"
        onError={(e) => {
          // Fallback to a default tiger if image doesn't exist
          e.currentTarget.src = '/5.png';
        }}
      />
    );
  };

  const getSymbolEmoji = (symbolId: string): string => {
    const symbol = SLOT_SYMBOLS.find(s => s.id === symbolId);
    return symbol ? symbol.emoji : '❓';
  };

  return (
    <div className="slot-machine">
      <header className="slot-header">
        <h1 className="slot-title">🎰 BITCOIN TIGER SLOTS 🐅</h1>
        <p className="slot-subtitle">
          Custom Win Table System - From 400 to 8,000 sats bets!
        </p>
      </header>

      <div className="slot-stats">
        <div className="stat">
          <span className="stat-label">Balance</span>
          <span className="stat-value">{balance.toLocaleString()} sats</span>
        </div>
        <div className="stat">
          <span className="stat-label">Current Bet</span>
          <span className="stat-value">{currentBet.toLocaleString()} sats</span>
        </div>
        <div className="stat">
          <span className="stat-label">Spins</span>
          <span className="stat-value">{gamesPlayed}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Status</span>
          <span className="stat-value">{isSpinning ? '🎰' : 'Ready'}</span>
        </div>
      </div>

      <div className="slot-container">
        <div className="reels-container">
          {reels.map((reel, reelIndex) => (
            <div key={reelIndex} className={`reel ${isSpinning ? 'spinning' : ''}`}>
              {reel.map((symbolId, symbolIndex) => (
                <div 
                  key={`${reelIndex}-${symbolIndex}`} 
                  className={`symbol winline-symbol`}
                >
                  {getSymbolDisplay(symbolId)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="paylines">
          <div className="paylines-indicator">
            <div className="payline-text">🎯 5 ACTIVE WINLINES 🎯</div>
            <div className="payline-description">Horizontal • Diagonal • All Ways Win!</div>
          </div>
        </div>
      </div>

      <div className="bet-controls">
        <div className="bet-selector">
          <label>Bet Amount:</label>
          <div className="bet-buttons">
            {BET_AMOUNTS.map(amount => (
              <button
                key={amount}
                className={`bet-button ${currentBet === amount ? 'active' : ''}`}
                onClick={() => setCurrentBet(amount)}
                disabled={balance < amount}
              >
                {amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button
          className="spin-button"
          onClick={spin}
          disabled={isSpinning || balance < currentBet || !walletAddress}
        >
          {isSpinning ? '🎰 SPINNING...' : `🎰 SPIN (${currentBet.toLocaleString()} sats)`}
        </button>
      </div>

      {lastWin && (
        <div className={`win-display ${lastWin.isWin ? 'win' : 'lose'}`}>
          {lastWin.isWin ? (
            <div className="win-message">
              <div className="win-type">{lastWin.winType}</div>
              {lastWin.payout > 0 && (
                <div className="win-amount">+{lastWin.payout.toLocaleString()} sats</div>
              )}
            </div>
          ) : (
            <div className="lose-message">Try again!</div>
          )}
        </div>
      )}

      <div className="paytable">
        <h3>💰 PAYTABLE (Current Bet: {currentBet.toLocaleString()} sats)</h3>
        <div className="winlines-info">
          <p>🎯 5 WINLINES: Top Row, Center Row, Bottom Row, Diagonal \, Diagonal /</p>
          <p>💎 Custom Win Table: Tiger #777 Jackpots up to 400,000 sats!</p>
        </div>
        <div className="paytable-grid">
          {SLOT_SYMBOLS.map(symbol => {
            const payout = getCustomPayout(currentBet, symbol.id);
            
            return (
              <div key={symbol.id} className="paytable-row">
                <span className="paytable-symbol">
                  <span className="paytable-symbol-display">
                    {getSymbolDisplay(symbol.id)}
                  </span>
                  {symbol.name}
                </span>
                <span className="paytable-payout">
                  3 in a row = {payout.toLocaleString()} sats
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="game-info">
          <p>🎰 Traditional Bitcoin Tiger Slot Machine!</p>
          <p>🏆 Tiger #777 = Jackpot | 🥈 Tiger #456 = Almost Jackpot</p>
          <p>🍈 Tiger #234 = "Melons" | 🍓 Tiger #123 = "Strawberries" | 🔔 Tiger #89 = "Bells"</p>
          <p>💰 Higher bets unlock massive payouts!</p>
          <p>📊 RTP: ~80-85% (Traditional Reel Strip System)</p>
          <p>🎯 Works like real casino machines with reel positioning!</p>
        </div>
      </div>

      <style jsx>{`
        .slot-machine {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #0d1320, #1a2332);
          color: white;
          min-height: 100vh;
        }
        
        .slot-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .slot-title {
          font-family: 'Press Start 2P', monospace;
          font-size: ${isMobile ? '1rem' : '1.5rem'};
          color: #ffd700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px #000;
        }
        
        .slot-subtitle {
          font-size: 1rem;
          color: #aaa;
          margin-bottom: 1rem;
        }
        
        .slot-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat {
          background: rgba(0, 0, 0, 0.5);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #333;
          text-align: center;
        }
        
        .stat-label {
          display: block;
          color: #aaa;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }
        
        .stat-value {
          color: #ffd700;
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .slot-container {
          background: linear-gradient(45deg, #2d3748, #1a2332);
          border: 3px solid #ffd700;
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 2rem;
          position: relative;
          transform: none !important;
        }
        
        .reels-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
          transform: none !important;
        }
        
        .reel {
          background: #000;
          border: 2px solid #333;
          border-radius: 10px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          transform: none !important;
          align-items: center;
          justify-content: center;
        }
        
        .reel.spinning {
          animation: none; /* Remove animation from reel container */
        }
        
        .reel.spinning .symbol {
          animation: symbolBlur 0.15s infinite;
        }
        
        @keyframes symbolBlur {
          0% { 
            opacity: 1;
            filter: blur(0px);
            transform: none;
          }
          50% { 
            opacity: 0.7;
            filter: blur(0.5px);
            transform: none;
          }
          100% { 
            opacity: 1;
            filter: blur(0px);
            transform: none;
          }
        }
        
        @keyframes symbolSpin {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-5px); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .symbol {
          font-size: 3rem;
          text-align: center;
          padding: 0.5rem;
          transition: none; /* Remove transition during spinning */
          display: flex;
          align-items: center;
          justify-content: center;
          transform: none; /* Default state */
          width: 100px;
          height: 100px;
          box-sizing: border-box;
          margin: 0 auto;
        }
        
        .tiger-symbol {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #333;
          transition: all 0.3s ease;
          display: block;
          margin: 0 auto;
        }
        
        .emoji-symbol {
          font-size: 4rem;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          margin: 0 auto;
          text-align: center;
        }
        
        .winline-symbol {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 215, 0, 0.3);
          position: relative;
        }
        
        .winline-symbol::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.2), transparent);
          border-radius: 10px;
          z-index: -1;
        }
        
        .winline-symbol .tiger-symbol {
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
        }
        
        .symbol.center .tiger-symbol {
          border-color: #ffd700;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .symbol.center {
          background: rgba(255, 215, 0, 0.2);
          border-radius: 8px;
          border: 2px solid #ffd700;
        }
        
        .paylines {
          text-align: center;
          margin-top: 1rem;
        }
        
        .paylines-indicator {
          color: #ffd700;
          font-weight: bold;
          letter-spacing: 2px;
        }
        
        .payline-text {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        
        .payline-description {
          font-size: 0.9rem;
          color: #aaa;
        }
        
        .bet-controls {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .bet-selector {
          margin-bottom: 1rem;
        }
        
        .bet-selector label {
          display: block;
          margin-bottom: 0.5rem;
          color: #ffd700;
          font-weight: bold;
        }
        
        .bet-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .bet-button {
          background: #2d3748;
          border: 2px solid #333;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .bet-button:hover:not(:disabled) {
          border-color: #ffd700;
          background: #3d4758;
        }
        
        .bet-button.active {
          background: #ffd700;
          color: #000;
          font-weight: bold;
        }
        
        .bet-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .spin-button {
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          border: 3px solid #ffd700;
          color: white;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-shadow: 1px 1px #000;
        }
        
        .spin-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        
        .spin-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .win-display {
          text-align: center;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          animation: fadeIn 0.5s ease;
        }
        
        .win-display.win {
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          border: 2px solid #ffd700;
        }
        
        .win-display.lose {
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          border: 2px solid #333;
        }
        
        .win-type {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .win-amount {
          font-size: 1.5rem;
          color: #ffd700;
          font-weight: bold;
        }
        
        .lose-message {
          font-size: 1.2rem;
          color: #fff;
        }
        
        .paytable {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid #333;
          border-radius: 10px;
          padding: 1.5rem;
        }
        
        .paytable h3 {
          text-align: center;
          color: #ffd700;
          margin-bottom: 1rem;
        }
        
        .winlines-info {
          text-align: center;
          margin-bottom: 1rem;
          color: #aaa;
          font-size: 0.9rem;
        }
        
        .paytable-grid {
          display: grid;
          gap: 0.5rem;
        }
        
        .paytable-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
        }
        
        .paytable-symbol {
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .paytable-symbol-display {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .paytable-symbol-display .tiger-symbol {
          width: 32px;
          height: 32px;
          border: 1px solid #333;
        }
        
        .paytable-payout {
          color: #ffd700;
          font-weight: bold;
        }
        
        .game-info {
          text-align: center;
          margin-top: 1rem;
          color: #aaa;
          font-size: 0.8rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .slot-machine {
            padding: 1rem 0.5rem;
          }
          
          .slot-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          
          .stat {
            padding: 0.5rem;
            font-size: 0.9rem;
          }
          
          .stat-value {
            font-size: 0.8rem;
          }
          
          .slot-container {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          
          .symbol {
            font-size: 2rem;
            padding: 0.2rem;
            width: 70px;
            height: 70px;
          }
          
          .tiger-symbol {
            width: 50px;
            height: 50px;
          }
          
          .emoji-symbol {
            font-size: 2.5rem;
            width: 50px;
            height: 50px;
          }
          
          .bet-controls {
            margin-bottom: 1rem;
          }
          
          .bet-selector {
            margin-bottom: 0.5rem;
          }
          
          .bet-buttons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.3rem;
            justify-content: center;
            margin-bottom: 0.5rem;
          }
          
          .bet-button {
            width: auto;
            padding: 0.4rem 0.2rem;
            font-size: 0.8rem;
          }
          
          .spin-button {
            padding: 0.8rem 1rem;
            font-size: 1rem;
            width: 100%;
          }
          
          .paytable {
            padding: 1rem;
          }
          
          .paytable-symbol-display .tiger-symbol {
            width: 20px;
            height: 20px;
          }
          
          .paytable-row {
            padding: 0.3rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
} 