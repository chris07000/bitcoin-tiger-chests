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
  { id: 'tiger12', emoji: '', name: 'Tiger #12', value: 1.25, rarity: 2 },
  { id: 'tiger23', emoji: '', name: 'Tiger #23', value: 1.5, rarity: 3 },
  { id: 'tiger45', emoji: '', name: 'Tiger #45', value: 2, rarity: 4 },
  { id: 'tiger67', emoji: '', name: 'Tiger #67', value: 2.5, rarity: 5 },
  { id: 'tiger89', emoji: '', name: 'Tiger #89', value: 3, rarity: 6 },
  { id: 'tiger123', emoji: '', name: 'Tiger #123', value: 4, rarity: 7 },
  { id: 'tiger234', emoji: '', name: 'Tiger #234', value: 5, rarity: 8 },
  { id: 'tiger456', emoji: '', name: 'Tiger #456', value: 6, rarity: 9 },
  { id: 'tiger777', emoji: '', name: 'Tiger #777', value: 8, rarity: 10 },
];

const BET_AMOUNTS = [100, 500, 1000, 5000, 25000];

const WINLINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Center row  
  [6, 7, 8], // Bottom row
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];

// Escalating multipliers based on bet amount (like Multiplayer machine)
const getPayoutMultiplier = (betAmount: number, symbolValue: number): number => {
  const baseMultipliers = {
    100: { 8: 20, 6: 15, 5: 12, 4: 8, 3: 6, 2.5: 4, 2: 3, 1.5: 2, 1.25: 1.5, 1: 1 },
    500: { 8: 15, 6: 12, 5: 9, 4: 7, 3: 5, 2.5: 4, 2: 3, 1.5: 2, 1.25: 1.5, 1: 1 },
    1000: { 8: 12, 6: 9, 5: 7, 4: 5, 3: 4, 2.5: 3, 2: 2.5, 1.5: 2, 1.25: 1.5, 1: 1 },
    5000: { 8: 10, 6: 8, 5: 6, 4: 4.5, 3: 3.5, 2.5: 2.8, 2: 2.2, 1.5: 1.8, 1.25: 1.4, 1: 1 },
    25000: { 8: 8, 6: 6, 5: 5, 4: 4, 3: 3, 2.5: 2.5, 2: 2, 1.5: 1.5, 1.25: 1.25, 1: 1 }
  };
  
  const multipliers = baseMultipliers[betAmount as keyof typeof baseMultipliers] || baseMultipliers[100];
  return multipliers[symbolValue as keyof typeof multipliers] || 1;
};

const getWeightedRandomSymbol = (): SlotSymbol => {
  // Adjusted weights for better house edge
  const weights: { [key: string]: number } = {
    'tiger5': 30,     // Most common
    'tiger12': 25,
    'tiger23': 20,
    'tiger45': 15,
    'tiger67': 12,
    'tiger89': 8,
    'tiger123': 5,
    'tiger234': 3,
    'tiger456': 2,
    'tiger777': 1,   // Rarest (jackpot)
  };
  
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  let randomNum = Math.random() * totalWeight;
  
  for (const symbol of SLOT_SYMBOLS) {
    const weight = weights[symbol.id] || 1;
    randomNum -= weight;
    if (randomNum <= 0) {
      return symbol;
    }
  }
  return SLOT_SYMBOLS[0];
};

const calculatePayout = (resultReels: string[][], betAmount: number): SpinResult => {
  let totalPayout = 0;
  let winTypes: string[] = [];
  
  // Correctly convert 3x3 reels to flat array for winline checking
  // resultReels[0] = reel1 [top, center, bottom]
  // resultReels[1] = reel2 [top, center, bottom]  
  // resultReels[2] = reel3 [top, center, bottom]
  // We need: [top-left, top-center, top-right, center-left, center-center, center-right, bottom-left, bottom-center, bottom-right]
  const flatReels = [
    resultReels[0][0], resultReels[1][0], resultReels[2][0], // Top row: left, center, right
    resultReels[0][1], resultReels[1][1], resultReels[2][1], // Center row: left, center, right
    resultReels[0][2], resultReels[1][2], resultReels[2][2]  // Bottom row: left, center, right
  ];
  
  // Check all 5 winlines - ONLY 3-of-a-kind wins (classic slot machine)
  for (let lineIndex = 0; lineIndex < WINLINES.length; lineIndex++) {
    const line = WINLINES[lineIndex];
    const lineSymbols = line.map(pos => flatReels[pos]);
    
    // Check for 3-of-a-kind ONLY
    if (lineSymbols[0] === lineSymbols[1] && lineSymbols[1] === lineSymbols[2]) {
      const symbol = SLOT_SYMBOLS.find(s => s.id === lineSymbols[0]);
      if (symbol) {
        const multiplier = getPayoutMultiplier(betAmount, symbol.value);
        const payout = Math.floor(betAmount * multiplier);
        totalPayout += payout;
        winTypes.push(`Line ${lineIndex + 1}: Three ${symbol.name}s`);
      }
    }
  }
  
  return {
    symbols: resultReels,
    payout: totalPayout,
    isWin: totalPayout > 0,
    winType: winTypes.length > 0 ? winTypes.join(' + ') : undefined
  };
};

export default function SlotMachine() {
  const [reels, setReels] = useState<string[][]>([[], [], []]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentBet, setCurrentBet] = useState(1000);
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

  const processWinPayout = async (winAmount: number, winType: string) => {
    try {
      // Call payout API to add win to database balance
      const response = await fetch('/api/slots/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          winAmount
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Directly update balance with the new balance from API response (bypass cache)
        if (result.newBalance !== undefined) {
          updateBalanceWithTimestamp(result.newBalance);
          console.log(`Win payout successful: ${winAmount} sats - Balance updated to: ${result.newBalance}`);
        } else {
          // Fallback to fetchBalance if newBalance not in response
          await fetchBalance();
          console.log(`Win payout successful: ${winAmount} sats (${winType})`);
        }
      } else {
        console.error('Win payout failed:', result.error);
      }
    } catch (error) {
      console.error('Error processing win payout:', error);
    }
  };

  const spin = async () => {
    if (!walletAddress || balance < currentBet || isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);

    try {
      // Call API to deduct bet from database balance
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

      // Directly update balance with the new balance from API response (bypass cache)
      if (apiResult.remainingBalance !== undefined) {
        updateBalanceWithTimestamp(apiResult.remainingBalance);
        console.log(`Bet placed: ${currentBet} sats - Balance updated to: ${apiResult.remainingBalance}`);
      } else {
        // Fallback to fetchBalance if remainingBalance not in response
        await fetchBalance();
        console.log('Bet placed successfully via database');
      }
    } catch (error) {
      console.error('Error processing bet:', error);
      alert('Failed to place bet. Please try again.');
      setIsSpinning(false);
      return;
    }

    // Simulate spinning animation
    const spinDuration = 2000;
    const intervalDuration = 100;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      setReels([
        generateRandomReel(),
        generateRandomReel(),
        generateRandomReel()
      ]);
      elapsed += intervalDuration;

      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        
        // Final result calculation
        const finalReels = [
          generateRandomReel(),
          generateRandomReel(),
          generateRandomReel()
        ];
        
        const result = calculatePayout(finalReels, currentBet);
        setReels(finalReels);
        setLastWin(result);
        setGamesPlayed(prev => prev + 1);
        
        if (result.payout > 0) {
          // Process win payout
          processWinPayout(result.payout, result.winType || 'Win');
        }
        
        setIsSpinning(false);
      }
    }, intervalDuration);
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
          Spin the reels and win big with Bitcoin Tiger magic!
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
          <p>💡 Higher bets unlock better multipliers per symbol!</p>
        </div>
        <div className="paytable-grid">
          {SLOT_SYMBOLS.map(symbol => {
            const multiplier = getPayoutMultiplier(currentBet, symbol.value);
            const payout = Math.floor(currentBet * multiplier);
            
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
          <p>🎰 Classic 5-winline Bitcoin Tiger slot machine!</p>
          <p>📈 Escalating payouts: Higher bets = Better multipliers per symbol</p>
          <p>🏆 Best multipliers at 100 sats bet, scaling down for higher bets</p>
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