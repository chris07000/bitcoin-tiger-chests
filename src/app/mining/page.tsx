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
      'tiger777': 20000,   // 50x bet - TOP JACKPOT!
      'tiger456': 6000,    // 15x bet - Great win
      'tiger234': 6000,    // 15x bet - Great win  
      'tiger123': 6000,    // 15x bet - Great win
      'tiger89': 6000,     // 15x bet - Great win
      'tiger67': 2800,     // 7x bet - Good win
      'tiger45': 2800,     // 7x bet - Good win
      'tiger23': 2800,     // 7x bet - Good win
      'tiger12': 2800,     // 7x bet - Good win
      'tiger5': 400        // 1x bet - Break even
    },
    1000: {
      'tiger777': 40000,   // 40x bet - TOP JACKPOT!
      'tiger456': 16000,   // 16x bet - Great win
      'tiger234': 16000,   // 16x bet - Great win
      'tiger123': 16000,   // 16x bet - Great win
      'tiger89': 16000,    // 16x bet - Great win
      'tiger67': 8000,     // 8x bet - Good win
      'tiger45': 8000,     // 8x bet - Good win
      'tiger23': 8000,     // 8x bet - Good win
      'tiger12': 8000,     // 8x bet - Good win
      'tiger5': 1000       // 1x bet - Break even
    },
    2000: {
      'tiger777': 80000,   // 40x bet - TOP JACKPOT!
      'tiger456': 32000,   // 16x bet - Great win
      'tiger234': 32000,   // 16x bet - Great win
      'tiger123': 32000,   // 16x bet - Great win
      'tiger89': 32000,    // 16x bet - Great win
      'tiger67': 16000,    // 8x bet - Good win
      'tiger45': 16000,    // 8x bet - Good win
      'tiger23': 16000,    // 8x bet - Good win
      'tiger12': 16000,    // 8x bet - Good win
      'tiger5': 2000       // 1x bet - Break even
    },
    4000: {
      'tiger777': 200000,  // 50x bet - BIG JACKPOT!
      'tiger456': 80000,   // 20x bet - Great win
      'tiger234': 80000,   // 20x bet - Great win
      'tiger123': 64000,   // 16x bet - Good win
      'tiger89': 64000,    // 16x bet - Good win
      'tiger67': 32000,    // 8x bet - Decent win
      'tiger45': 32000,    // 8x bet - Decent win
      'tiger23': 32000,    // 8x bet - Decent win
      'tiger12': 32000,    // 8x bet - Decent win
      'tiger5': 4000       // 1x bet - Break even
    },
    8000: {
      'tiger777': 400000,  // 50x bet - MEGA JACKPOT!
      'tiger456': 160000,  // 20x bet - Huge win
      'tiger234': 160000,  // 20x bet - Huge win
      'tiger123': 148000,  // 18.5x bet - Big win
      'tiger89': 128000,   // 16x bet - Big win
      'tiger67': 64000,    // 8x bet - Good win
      'tiger45': 64000,    // 8x bet - Good win
      'tiger23': 64000,    // 8x bet - Good win
      'tiger12': 64000,    // 8x bet - Good win
      'tiger5': 8000       // 1x bet - Break even
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
  const [spinningReels, setSpinningReels] = useState<string[][]>([[], [], []]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelStates, setReelStates] = useState<boolean[]>([false, false, false]);
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
    setSpinningReels(initialReels);
  };

  const generateRandomReel = (): string[] => {
    const reel: string[] = [];
    for (let i = 0; i < 3; i++) {
      const randomSymbol = getWeightedRandomSymbol();
      reel.push(randomSymbol.id);
    }
    return reel;
  };

  // Generate a long spinning reel for animation (multiple symbols)
  const generateSpinningReel = (): string[] => {
    const reel: string[] = [];
    for (let i = 0; i < 20; i++) { // Create 20 symbols for smooth spinning
      const randomSymbol = getWeightedRandomSymbol();
      reel.push(randomSymbol.id);
    }
    return reel;
  };

  const spin = async () => {
    if (!walletAddress || balance < currentBet || isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);
    setReelStates([true, true, true]); // All reels spinning

    // Generate spinning animation data
    const spinningData = [
      generateSpinningReel(),
      generateSpinningReel(),
      generateSpinningReel()
    ];
    setSpinningReels(spinningData);

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
        setReelStates([false, false, false]);
        return;
      }

      // Extract server-generated results
      const { gameResult, balance: newBalance, houseRevenue } = apiResult;
      
      // Update balance immediately with server response
      updateBalanceWithTimestamp(newBalance);
      console.log(`Spin result: Bet ${currentBet} sats, Payout ${gameResult.payout} sats, House Revenue ${houseRevenue} sats`);

      // Stop reels one by one with realistic timing
      setTimeout(() => {
        setReelStates([false, true, true]); // Stop first reel
        // Update first reel with final result
        setReels(prev => [gameResult.reels[0], prev[1], prev[2]]);
      }, 1000);

      setTimeout(() => {
        setReelStates([false, false, true]); // Stop second reel
        // Update second reel with final result
        setReels(prev => [prev[0], gameResult.reels[1], prev[2]]);
      }, 1500);

      setTimeout(() => {
        setReelStates([false, false, false]); // Stop third reel
        // Update third reel with final result and show complete result
        setReels(gameResult.reels);
        setLastWin(gameResult);
        setGamesPlayed(prev => prev + 1);
        setIsSpinning(false);
      }, 2000);

    } catch (error) {
      console.error('Error processing spin:', error);
      alert('Failed to process spin. Please try again.');
      setIsSpinning(false);
      setReelStates([false, false, false]);
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
          Original Multiplayer Payouts - Up to 400,000 sats jackpots!
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
            <div key={reelIndex} className="reel-wrapper">
              <div className="reel-window">
                <div className={`reel ${reelStates[reelIndex] ? 'spinning' : ''}`}>
                  {reelStates[reelIndex] ? (
                    // Show spinning animation
                    <div className="spinning-symbols">
                      {spinningReels[reelIndex].map((symbolId, symbolIndex) => (
                        <div 
                          key={`spin-${reelIndex}-${symbolIndex}`} 
                          className="symbol"
                        >
                          {getSymbolDisplay(symbolId)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Show final result
                    reel.map((symbolId, symbolIndex) => (
                      <div 
                        key={`final-${reelIndex}-${symbolIndex}`} 
                        className="symbol winline-symbol"
                      >
                        {getSymbolDisplay(symbolId)}
                      </div>
                    ))
                  )}
                </div>
              </div>
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
        <h3>💰 ORIGINAL MULTIPLAYER PAYTABLE (Current Bet: {currentBet.toLocaleString()} sats)</h3>
        <div className="winlines-info">
          <p>🎯 5 WINLINES: Top Row, Center Row, Bottom Row, Diagonal \, Diagonal /</p>
          <p>💎 Exact Multiplayer Payouts: Tiger #777 = 50x bet multiplier!</p>
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
          <p>🎰 ORIGINAL MULTIPLAYER Bitcoin Tiger Slot Machine!</p>
          <p>🏆 Tiger #777 = 50x Bet JACKPOT! | 🥈 Tiger #456 = 20x Bet</p>
          <p>🍈 Tiger #234 = 16x | 🍓 Tiger #123 = 16x | 🔔 Tiger #89 = 16x</p>
          <p>💰 Exact payouts from real Multiplayer kast!</p>
          <p>📊 Rare wins but significant rewards!</p>
          <p>🎯 Max win: 400,000 sats on 8,000 sats bet! (50x multiplier)</p>
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
        }
        
        .reels-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .reel-wrapper {
          position: relative;
          background: #000;
          border: 2px solid #333;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .reel-window {
          height: 300px; /* Fixed height to show exactly 3 symbols */
          overflow: hidden;
          position: relative;
        }
        
        .reel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          transition: none;
        }
        
        .reel.spinning .spinning-symbols {
          animation: reelSpin 0.1s linear infinite;
        }
        
        @keyframes reelSpin {
          0% { 
            transform: translateY(0px);
          }
          100% { 
            transform: translateY(-100px); /* Move one symbol height */
          }
        }
        
        .spinning-symbols {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .symbol {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin: 0;
          padding: 0;
        }
        
        .tiger-symbol {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #333;
          transition: all 0.3s ease;
          display: block;
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
          
          .reel-window {
            height: 210px; /* Smaller for mobile */
          }
          
          .symbol {
            width: 70px;
            height: 70px;
          }
          
          .tiger-symbol {
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
          
          @keyframes reelSpin {
            0% { 
              transform: translateY(0px);
            }
            100% { 
              transform: translateY(-70px); /* Smaller movement for mobile */
            }
          }
        }
      `}</style>
    </div>
  );
} 