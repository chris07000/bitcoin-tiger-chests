import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ChestOpenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  type: 'bronze' | 'silver' | 'gold';
  prize: {
    amount: number;
    isJackpot?: boolean;
    isSpecialPrize?: boolean;
  };
  multiplePrizes?: {
    amount: number;
    isJackpot?: boolean;
    isSpecialPrize?: boolean;
  }[];
}

export default function ChestOpenModal({
  isOpen,
  onClose,
  onClaim,
  type,
  prize,
  multiplePrizes = []
}: ChestOpenModalProps) {
  const [animationState, setAnimationState] = useState<'opening' | 'revealing' | 'revealed'>('opening');
  const [isClaiming, setIsClaiming] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Start the opening animation
      setTimeout(() => {
        setAnimationState('revealing');
        // Start the revealing animation
        setTimeout(() => {
          setAnimationState('revealed');
        }, 1000);
      }, 2000);
    } else {
      setAnimationState('opening');
      setIsClaiming(false);
    }
  }, [isOpen]);

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await onClaim();
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
    setIsClaiming(false);
  };

  if (!isOpen) return null;

  return (
    <div className="chest-modal-overlay">
      <div className="chest-modal">
        <div className={`chest-animation ${animationState}`}>
          {animationState === 'opening' && (
            <div className="chest-opening">
              <Image
                src="/chestpixel.png"
                alt="Opening chest"
                width={256}
                height={256}
                className="chest-image-large"
              />
              <div className="opening-text">Opening chest...</div>
            </div>
          )}
          
          {animationState === 'revealing' && (
            <div className="chest-revealing">
              <div className="revealing-light"></div>
              <div className="revealing-text">Revealing prize...</div>
            </div>
          )}
          
          {animationState === 'revealed' && (
            <div className="chest-revealed">
              {multiplePrizes.length > 0 ? (
                <div className="multiple-prizes pixel-border">
                  <h3 className="prizes-title">Your Prizes:</h3>
                  <div className="prizes-list">
                    {multiplePrizes.map((p, index) => (
                      <div key={index} className="prize-row">
                        {p.isJackpot ? (
                          <div className="jackpot-win">JACKPOT!</div>
                        ) : p.isSpecialPrize ? (
                          <div className="special-prize">SPECIAL PRIZE!</div>
                        ) : null}
                        <div className="prize-amount">
                          {p.amount.toLocaleString()} sats
                        </div>
                      </div>
                    ))}
                    <div className="prize-total">
                      <div className="total-label">Total:</div>
                      <div className="total-amount">
                        {multiplePrizes.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} sats
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prize-amount">
                  {prize.isJackpot ? (
                    <div className="jackpot-win">JACKPOT!</div>
                  ) : prize.isSpecialPrize ? (
                    <div className="special-prize">SPECIAL PRIZE!</div>
                  ) : null}
                  <div className="sats-amount">
                    {prize.amount.toLocaleString()} sats
                  </div>
                </div>
              )}
              <button 
                onClick={handleClaim}
                disabled={isClaiming}
                className={`pixel-button ${type} ${isClaiming ? 'claiming' : ''}`}
              >
                {isClaiming ? 'Claiming...' : 'Claim Prize'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .pixel-button {
          background: #000;
          border: none;
          padding: 10px 20px;
          color: #f8d74a;
          font-family: 'Press Start 2P', monospace;
          font-size: 16px;
          text-transform: uppercase;
          position: relative;
          cursor: pointer;
          margin-top: 20px;
          image-rendering: pixelated;
        }

        .pixel-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent 2%,
            rgba(255, 255, 255, 0.2) 3%,
            rgba(255, 255, 255, 0.2) 97%,
            transparent 98%
          );
        }

        .pixel-button.bronze {
          background: linear-gradient(to bottom, #cd7f32, #a0522d);
        }

        .pixel-button.silver {
          background: linear-gradient(to bottom, #c0c0c0, #808080);
        }

        .pixel-button.gold {
          background: linear-gradient(to bottom, #ffd700, #daa520);
        }

        .pixel-button:hover {
          transform: translate(2px, 2px);
          box-shadow: -2px -2px 0 1px #000;
        }

        .pixel-button:active,
        .pixel-button.claiming {
          transform: translate(4px, 4px);
          box-shadow: none;
        }

        .pixel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: translate(4px, 4px);
          box-shadow: none;
        }

        .pixel-button::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: transparent;
          border: 2px solid #000;
          pointer-events: none;
        }

        .multiple-prizes {
          background: #000;
          padding: 20px;
          border-radius: 4px;
          position: relative;
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          min-width: 300px;
        }

        .pixel-border {
          border: 4px solid #fff;
          box-shadow: 0 0 0 4px #000;
          position: relative;
        }

        .pixel-border::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 4px solid #000;
          pointer-events: none;
        }

        .prizes-title {
          color: #f8d74a;
          font-size: 16px;
          text-align: center;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .prizes-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .prize-row {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          color: #fff;
          font-size: 14px;
          text-shadow: 2px 2px #000;
        }

        .prize-amount {
          font-family: 'Press Start 2P', monospace;
          color: #f8d74a;
        }

        .prize-total {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #f8d74a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
          font-size: 14px;
        }

        .total-label {
          color: #f8d74a;
          text-transform: uppercase;
        }

        .total-amount {
          font-family: 'Press Start 2P', monospace;
          color: #f8d74a;
          font-size: 16px;
        }

        .jackpot-win {
          color: #ffd700;
          font-weight: bold;
          animation: pulse 1s infinite;
          margin-right: 10px;
        }

        .special-prize {
          color: #ff69b4;
          font-weight: bold;
          margin-right: 10px;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
} 