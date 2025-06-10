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
  { id: 'tiger12', emoji: '', name: 'Tiger #12', value: 2, rarity: 2 },
  { id: 'tiger23', emoji: '', name: 'Tiger #23', value: 3, rarity: 3 },
  { id: 'tiger45', emoji: '', name: 'Tiger #45', value: 4, rarity: 4 },
  { id: 'tiger67', emoji: '', name: 'Tiger #67', value: 5, rarity: 5 },
  { id: 'tiger89', emoji: '', name: 'Tiger #89', value: 8, rarity: 6 },
  { id: 'tiger123', emoji: '', name: 'Tiger #123', value: 12, rarity: 7 },
  { id: 'tiger234', emoji: '', name: 'Tiger #234', value: 15, rarity: 8 },
  { id: 'tiger456', emoji: '', name: 'Tiger #456', value: 25, rarity: 9 },
  { id: 'tiger777', emoji: '', name: 'Tiger #777', value: 50, rarity: 10 },
  { id: 'scatter', emoji: '🎰', name: 'Scatter', value: 0, rarity: 6 },
  { id: 'bonus', emoji: '🎁', name: 'Bonus', value: 0, rarity: 7 },
];

const BET_AMOUNTS = [100, 500, 1000, 5000, 10000, 25000, 50000];

export default function SlotMachine() {
  const [reels, setReels] = useState<string[][]>([[], [], []]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentBet, setCurrentBet] = useState(1000);
  const [lastWin, setLastWin] = useState<SpinResult | null>(null);
  const [totalWins, setTotalWins] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusWin, setBonusWin] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { walletAddress } = useWallet();
  const { balance } = useLightning();

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

  const getWeightedRandomSymbol = (): SlotSymbol => {
    // Adjusted weights for better house edge (8-10%)
    const weights: { [key: string]: number } = {
      'tiger5': 25,    // Most common
      'tiger12': 20,
      'tiger23': 15,
      'tiger45': 12,
      'tiger67': 10,
      'tiger89': 8,
      'tiger123': 5,
      'tiger234': 3,
      'tiger456': 2,
      'tiger777': 1,      // Rarest
      'scatter': 4,    // Medium rare for bonus features
      'bonus': 3
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

  const calculatePayout = (resultReels: string[][]): SpinResult => {
    const centerLine = [resultReels[0][1], resultReels[1][1], resultReels[2][1]];
    
    // Check for scatter symbols (anywhere on reels)
    const scatterCount = resultReels.flat().filter(symbol => symbol === 'scatter').length;
    if (scatterCount >= 3) {
      const scatterPayout = Math.floor(currentBet * scatterCount * 1.5); // Reduced from 2x
      return {
        symbols: resultReels,
        payout: scatterPayout,
        isWin: true,
        winType: `${scatterCount} Scatters!`,
        scatter: true
      };
    }

    // Check for bonus symbols (center line only)
    const bonusCount = centerLine.filter(symbol => symbol === 'bonus').length;
    if (bonusCount >= 2) {
      return {
        symbols: resultReels,
        payout: 0,
        isWin: true,
        winType: 'Bonus Round!',
        bonus: true
      };
    }

    // Check center line for wins
    if (centerLine[0] === centerLine[1] && centerLine[1] === centerLine[2]) {
      // Three of a kind on center line
      const symbol = SLOT_SYMBOLS.find(s => s.id === centerLine[0]);
      if (symbol && symbol.id !== 'scatter' && symbol.id !== 'bonus') {
        const payout = Math.floor(currentBet * symbol.value * 0.7); // Reduced from 0.8 to 0.7
        return {
          symbols: resultReels,
          payout,
          isWin: true,
          winType: `Three ${symbol.name}s!`
        };
      }
    }

    // Check for two of a kind (only high value symbols)
    if (centerLine[0] === centerLine[1] || centerLine[1] === centerLine[2]) {
      const matchSymbol = centerLine[0] === centerLine[1] ? centerLine[0] : centerLine[1];
      const symbol = SLOT_SYMBOLS.find(s => s.id === matchSymbol);
      if (symbol && symbol.id !== 'scatter' && symbol.id !== 'bonus' && symbol.value >= 8) { // Increased from 5 to 8
        const payout = Math.floor(currentBet * symbol.value * 0.15); // Reduced from 0.2 to 0.15
        return {
          symbols: resultReels,
          payout,
          isWin: true,
          winType: `Two ${symbol.name}s!`
        };
      }
    }

    return {
      symbols: resultReels,
      payout: 0,
      isWin: false
    };
  };

  const triggerBonusRound = () => {
    setShowBonus(true);
    // Bonus: pick from treasure chests (reduced payouts for better house edge)
    const bonuses = [
      Math.floor(currentBet * 1.5),
      Math.floor(currentBet * 3),
      Math.floor(currentBet * 6),
      Math.floor(currentBet * 10),
      Math.floor(currentBet * 15)
    ];
    const randomBonus = bonuses[Math.floor(Math.random() * bonuses.length)];
    setBonusWin(randomBonus);
    
    setTimeout(() => {
      setShowBonus(false);
      setTotalWins(prev => prev + randomBonus);
    }, 3000);
  };

  const spin = async () => {
    if (!walletAddress || balance < currentBet || isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);

    try {
      // Call API to place bet
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

      console.log('Bet placed:', apiResult.message);
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
        
        const result = calculatePayout(finalReels);
        setReels(finalReels);
        setLastWin(result);
        setGamesPlayed(prev => prev + 1);
        
        if (result.bonus) {
          triggerBonusRound();
        } else if (result.payout > 0) {
          setTotalWins(prev => prev + result.payout);
        }
        
        setIsSpinning(false);
      }
    }, intervalDuration);
  };

  const getSymbolDisplay = (symbolId: string) => {
    if (symbolId === 'scatter') {
      return <span className="emoji-symbol">🎰</span>;
    }
    if (symbolId === 'bonus') {
      return <span className="emoji-symbol">🎁</span>;
    }
    
    // Extract tiger number from symbolId (e.g., 'tiger777' -> '777')
    const tigerNumber = symbolId.replace('tiger', '');
    return (
      <img 
        src={`/tigers/${tigerNumber}.png`} 
        alt={`Tiger #${tigerNumber}`}
        className="tiger-symbol"
        onError={(e) => {
          // Fallback to a default tiger if image doesn't exist
          e.currentTarget.src = '/tigers/5.png';
        }}
      />
    );
  };

  const getSymbolEmoji = (symbolId: string): string => {
    const symbol = SLOT_SYMBOLS.find(s => s.id === symbolId);
    return symbol ? symbol.emoji : '❓';
  };

  const getRTP = () => {
    return gamesPlayed > 0 ? ((totalWins / (gamesPlayed * currentBet)) * 100).toFixed(1) : '0.0';
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
          <span className="stat-label">Total Won</span>
          <span className="stat-value">{totalWins.toLocaleString()} sats</span>
        </div>
        <div className="stat">
          <span className="stat-label">RTP</span>
          <span className="stat-value">{getRTP()}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Games</span>
          <span className="stat-value">{gamesPlayed}</span>
        </div>
      </div>

      <div className="slot-container">
        <div className="reels-container">
          {reels.map((reel, reelIndex) => (
            <div key={reelIndex} className={`reel ${isSpinning ? 'spinning' : ''}`}>
              {reel.map((symbolId, symbolIndex) => (
                <div 
                  key={`${reelIndex}-${symbolIndex}`} 
                  className={`symbol ${symbolIndex === 1 ? 'center' : ''}`}
                >
                  {getSymbolDisplay(symbolId)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="payline">
          <div className="payline-indicator">━━━ PAYLINE ━━━</div>
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

      {showBonus && (
        <div className="bonus-overlay">
          <div className="bonus-content">
            <h2>🎁 BONUS ROUND! 🎁</h2>
            <p>Tiger chose your treasure!</p>
            <div className="bonus-amount">+{bonusWin.toLocaleString()} sats</div>
          </div>
        </div>
      )}

      <div className="paytable">
        <h3>💰 PAYTABLE</h3>
        <div className="paytable-grid">
          {SLOT_SYMBOLS.filter(s => s.id !== 'scatter' && s.id !== 'bonus').map(symbol => (
            <div key={symbol.id} className="paytable-row">
              <span className="paytable-symbol">
                <span className="paytable-symbol-display">
                  {getSymbolDisplay(symbol.id)}
                </span>
                {symbol.name}
              </span>
              <span className="paytable-payout">
                3x = {Math.floor(currentBet * symbol.value * 0.7).toLocaleString()}
                {symbol.value >= 8 && (
                  <span className="two-kind"> | 2x = {Math.floor(currentBet * symbol.value * 0.15).toLocaleString()}</span>
                )}
              </span>
            </div>
          ))}
          <div className="paytable-row special">
            <span className="paytable-symbol">🎰 3+ Scatters</span>
            <span className="paytable-payout">1.5x bet per scatter</span>
          </div>
          <div className="paytable-row special">
            <span className="paytable-symbol">🎁 2+ Bonus</span>
            <span className="paytable-payout">Bonus Round! (1.5x - 15x)</span>
          </div>
        </div>
        
        <div className="house-edge-info">
          <p>🎲 House Edge: ~8-10% | Expected RTP: ~90-92%</p>
          <p>💡 Higher value symbols have better odds for 2-of-a-kind wins!</p>
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
        
        .reel {
          background: #000;
          border: 2px solid #333;
          border-radius: 10px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          transition: all 0.1s ease;
        }
        
        .reel.spinning {
          animation: spin 0.1s infinite;
        }
        
        @keyframes spin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
        
        .symbol {
          font-size: 3rem;
          text-align: center;
          padding: 0.5rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tiger-symbol {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #333;
          transition: all 0.3s ease;
        }
        
        .emoji-symbol {
          font-size: 3rem;
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
        
        .payline {
          text-align: center;
          margin-top: 1rem;
        }
        
        .payline-indicator {
          color: #ffd700;
          font-weight: bold;
          letter-spacing: 2px;
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
        
        .bonus-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.5s ease;
        }
        
        .bonus-content {
          background: linear-gradient(45deg, #8e44ad, #9b59b6);
          border: 3px solid #ffd700;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          animation: bounceIn 0.5s ease;
        }
        
        .bonus-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #ffd700;
        }
        
        .bonus-amount {
          font-size: 2.5rem;
          color: #ffd700;
          font-weight: bold;
          margin-top: 1rem;
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
        
        .paytable-row.special {
          background: rgba(255, 215, 0, 0.1);
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
        
        .paytable-symbol-display .emoji-symbol {
          font-size: 1.5rem;
        }
        
        .paytable-payout {
          color: #ffd700;
          font-weight: bold;
        }
        
        .two-kind {
          color: #ffd700;
          font-weight: bold;
        }
        
        .house-edge-info {
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
          
          .symbol {
            font-size: 2rem;
            padding: 0.3rem;
          }
          
          .tiger-symbol {
            width: 60px;
            height: 60px;
          }
          
          .emoji-symbol {
            font-size: 2rem;
          }
          
          .paytable-symbol-display .tiger-symbol {
            width: 24px;
            height: 24px;
          }
          
          .bet-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .bet-button {
            width: 120px;
          }
          
          .spin-button {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 