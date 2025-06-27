'use client'
import Image from 'next/image'
import { useState } from 'react'
import ChestOpenModal from './ChestOpenModal'
import { useChestProgress } from '../../context/ChestProgressContext'
import { useLightning } from '@/context/LightningContext'
import { toast } from 'react-hot-toast'

interface ChestCardProps {
  type: 'bronze' | 'silver' | 'gold'
  price: number
  maxWin: number
  minWin: number
  specialPrize?: string
  jackpotFee?: number
  jackpotChance?: number
  isFree?: boolean
  walletAddress: string
  onOpenAction: () => void
}

export default function ChestCard({ 
  type, 
  price, 
  maxWin, 
  minWin,
  specialPrize,
  walletAddress,
  jackpotFee = type === 'bronze' ? 1000 : type === 'silver' ? 2500 : 5000,
  jackpotChance = type === 'bronze' ? 0.01 : type === 'silver' ? 0.02 : 0.02,
  isFree = false,
  onOpenAction
}: ChestCardProps) {
  const [joinJackpot, setJoinJackpot] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const [prize, setPrize] = useState<{ amount: number; isJackpot?: boolean; isSpecialPrize?: boolean; } | null>(null)
  const [prizes, setPrizes] = useState<{ amount: number; isJackpot?: boolean; isSpecialPrize?: boolean; }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isClaiming, setIsClaiming] = useState(false)
  const { addOpenedChest } = useChestProgress()
  const { setBalance, balance = 0, processBalanceUpdate } = useLightning()
  
  const title = type === 'gold' ? 'Gold\nChest' : `${type.charAt(0).toUpperCase() + type.slice(1)}\nChest`
  const totalPrice = joinJackpot ? price + jackpotFee : price
  
  const handleOpenChest = async (amount: number = 1) => {
    try {
      // Check if wallet is connected
      if (!walletAddress) {
        toast.error('Please connect your wallet first');
        return;
      }

      // Calculate total cost for all chests
      const totalCost = totalPrice * amount;
      
      // Check if enough balance for ALL chests
      if (!isFree && balance < totalCost) {
        setError(`You need ${totalCost.toLocaleString()} sats to open ${amount} chests. Please deposit more sats first.`);
        return;
      }

      if (isOpening) return;
      setIsOpening(true);
      setError(null);
      setPrize(null);
      setPrizes([]);
      
      console.log('[Open] Starting balance:', balance);
      
      // Step 1: Log and store starting balance
      const startingBalance = balance;
      console.log('[Open] Starting balance:', startingBalance);
      
      // Step 2: Calculate and pre-deduct amount from balance
      const deductedBalance = startingBalance - (totalPrice * amount);
      if (deductedBalance < 0 && !isFree) {
        setError(`Insufficient balance. You need ${totalPrice * amount} sats to open ${amount} chests.`);
        setIsOpening(false);
        return;
      }
      
      // Pre-deduct from UI to show immediate feedback
      if (!isFree) {
        console.log('[Open] Pre-deducting balance to:', deductedBalance);
        processBalanceUpdate(deductedBalance);
      }

      const results = [];
      
      for (let i = 0; i < amount; i++) {
        // Step 3: Call API to open chest
        console.log(`[Open] Opening chest ${i+1} of ${amount}`);
        const response = await fetch('/api/chests/open', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
            chestType: type,
            joinJackpot,
            isFree
          }),
        });

        // Step 4: Handle errors
        if (!response.ok) {
          const errorData = await response.json();
          console.error('[Open] Error response:', errorData);
          
          // If failed, restore original balance
          console.log('[Open] Restoring original balance:', startingBalance);
          processBalanceUpdate(startingBalance);
          
          if (errorData.error === 'Insufficient balance') {
            setError(`You need ${totalPrice * amount} sats to open ${amount} chests. Please deposit more sats first.`);
          } else {
            setError(errorData.error || 'Failed to open chest');
          }
          setIsOpening(false);
          return;
        }

        // Step 5: Process successful response
        const data = await response.json();
        console.log('[Open] Success response:', data);
        
        // Step 6: Update balance from API if provided
        if (data.balance !== undefined) {
          console.log('[Open] DB balance from API:', data.balance);
          console.log('[Open] Change from starting balance:', data.balance - startingBalance);
          processBalanceUpdate(data.balance);
        }
        
        results.push(data);
        
        // Add prize to the list
        const prizeAmount = data.reward || 0;
        setPrizes(prev => [...prev, {
          amount: prizeAmount,
          isJackpot: data.isJackpotWin || false
        }]);
        
        console.log('[Open] Prize added:', prizeAmount);

        // BELANGRIJK: Update progress voor deze chest, direct na de succesvolle API call
        console.log(`[Open] Updating progress for ${type} chest`);
        addOpenedChest(type);
        
        // Extra actie om ervoor te zorgen dat de onOpenAction wordt uitgevoerd
        try {
          onOpenAction();
          console.log('[Open] onOpenAction called successfully');
        } catch (actionError) {
          console.error('[Open] Error in onOpenAction:', actionError);
        }
        
        // Voeg extra verificatie toe door de progress na de update op te halen
        setTimeout(() => {
          try {
            fetch(`/api/chests/progress/${walletAddress}?t=${Date.now()}`, {
              method: 'GET',
              headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
            })
            .then(progressResponse => progressResponse.json())
            .then(progressData => {
              console.log('[Open] Verified progress after update:', progressData);
              console.log(`[Open] Current ${type}Opened value:`, progressData?.progress?.[`${type}Opened`]);
            })
            .catch(progressError => {
              console.error('[Open] Error verifying progress:', progressError);
            });
          } catch (verifyError) {
            console.error('[Open] Error in progress verification:', verifyError);
          }
        }, 500);
      }

      // Step 7: Set the prize for display
      if (results.length > 0) {
        const lastResult = results[results.length - 1];
        setPrize({
          amount: lastResult.reward || 0,
          isJackpot: lastResult.isJackpotWin || false
        });
      }
    } catch (error) {
      console.error('[Open] Exception:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsOpening(false);
    }
  };

  const handleClaimReward = async () => {
    try {
      setIsClaiming(true);
      setError(null);
      
      console.log('[Claim] Starting - current balance:', balance);
      
      // We don't need to do anything here - the reward has already been added to the database
      // in the chest opening API call. We just need to refresh the UI.
      
      // Just in case, let's refresh the balance by calling the wallet API
      try {
        const response = await fetch(`/api/wallet/${walletAddress}`);
        if (response.ok) {
          const data = await response.json();
          console.log('[Claim] Refreshed balance from wallet API:', data.balance);
          processBalanceUpdate(data.balance);
        }
      } catch (refreshError) {
        console.error('[Claim] Error refreshing balance:', refreshError);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('[Claim] Error:', error);
      setError('Failed to claim reward. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };
  
  const handleCloseModal = () => {
    setIsOpening(false)
    setPrize(null)
    setError(null)
  }
  
  return (
    <>
      <div 
        className="chest-card" 
        data-type={type}
      >
        <h2 className="chest-title">
          {title.split('\n').map((line, i) => (
            <span key={i} className="title-line">{line}</span>
          ))}
        </h2>
        
        <div className="chest-image-container">
          <div className="chest-glow"></div>
          <Image 
            src="/chestpixel.png"
            alt={`${type} chest`}
            width={128}
            height={128}
            className="chest-image"
          />
        </div>

        {!isFree && (
          <>
            <div className="chest-price">
              <div className="base-price">{price.toLocaleString()} sats</div>
              {joinJackpot && (
                <div className="jackpot-fee">+{jackpotFee} sats jackpot entry</div>
              )}
              {joinJackpot && (
                <div className="total-price">Total: {totalPrice.toLocaleString()} sats</div>
              )}
            </div>

            <ul className="chest-features">
              <li>Win up to {maxWin.toLocaleString()} sats</li>
              {specialPrize && <li>Chance to win {specialPrize}</li>}
              <li>Minimum win: {minWin.toLocaleString()} sats</li>
            </ul>

            <div className="jackpot-section">
              <label className="jackpot-toggle">
                <input 
                  type="checkbox"
                  checked={joinJackpot}
                  onChange={(e) => setJoinJackpot(e.target.checked)}
                />
                <span className="toggle-text">Join Progressive Jackpot</span>
              </label>
              {joinJackpot && (
                <div className="jackpot-info">
                  <span className="jackpot-chance">Win chance: {(jackpotChance * 100).toFixed(1)}%</span>
                  <span className="jackpot-contribution">Adds {jackpotFee * 0.2} sats to pool</span>
                </div>
              )}
            </div>
          </>
        )}

        {isFree && (
          <ul className="chest-features">
            <li>Win up to {maxWin.toLocaleString()} sats</li>
            {specialPrize && <li>Chance to win {specialPrize}</li>}
            <li>Minimum win: {minWin.toLocaleString()} sats</li>
          </ul>
        )}

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleOpenChest(1)}
            className="open-chest-button"
            disabled={isOpening || (!isFree && balance < totalPrice)}
          >
            {isOpening ? 'Opening...' : (isFree ? 'Open Free Chest!' : 'Open Chest')}
          </button>

          {!isFree && (
            <button 
              onClick={() => handleOpenChest(5)}
              className="open-chest-button open-multi-button"
              disabled={isOpening || balance < (totalPrice * 5)}
            >
              Open 5x
            </button>
          )}
        </div>

        <style jsx>{`
          .chest-card {
            background: rgba(26, 26, 27, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 107, 0, 0.3);
            border-radius: 16px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            min-height: 420px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          
          .chest-card:hover {
            transform: translateY(-8px);
            border-color: rgba(255, 107, 0, 0.6);
            box-shadow: 0 12px 40px rgba(255, 107, 0, 0.2);
          }
          
          .chest-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #FF6B00;
            margin-bottom: 1.2rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .title-line {
            display: block;
            line-height: 1.4;
          }
          
          .chest-image-container {
            position: relative;
            width: 100px;
            height: 100px;
            margin-bottom: 1.2rem;
          }
          
          .chest-glow {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(255, 107, 0, 0.4) 0%,
              rgba(255, 184, 0, 0.2) 50%,
              rgba(255, 107, 0, 0) 70%
            );
            filter: blur(15px);
            z-index: 0;
            animation: pulse 3s infinite alternate;
          }
          
          @keyframes pulse {
            0% {
              opacity: 0.6;
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
          
          .chest-image {
            position: relative;
            z-index: 1;
            image-rendering: pixelated;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .chest-price {
            width: 100%;
            margin-bottom: 1.2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 1rem;
            border: 1px solid rgba(255, 107, 0, 0.2);
          }
          
          .base-price {
            font-size: 1.2rem;
            font-weight: 700;
            color: #FF6B00;
            margin-bottom: 0.3rem;
          }
          
          .jackpot-fee {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
          }
          
          .total-price {
            font-size: 1rem;
            color: #ffffff;
            margin-top: 0.3rem;
            font-weight: 600;
          }
          
          .chest-features {
            list-style: none;
            padding: 0;
            margin: 0 0 1.2rem 0;
            width: 100%;
            text-align: center;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 1rem;
            border: 1px solid rgba(255, 107, 0, 0.2);
          }
          
          .chest-features li {
            color: #ffffff;
            font-size: 0.85rem;
            margin-bottom: 0.4rem;
            position: relative;
            padding-left: 1rem;
            line-height: 1.4;
          }
          
          .chest-features li:before {
            content: "•";
            color: #FF6B00;
            position: absolute;
            left: 0;
            font-weight: bold;
          }
          
          .jackpot-section {
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            background: rgba(255, 107, 0, 0.1);
            border-radius: 12px;
            padding: 1rem;
            border: 1px solid rgba(255, 107, 0, 0.3);
          }
          
          .jackpot-toggle {
            cursor: pointer;
            display: flex;
            align-items: center;
            user-select: none;
            margin-bottom: 0.6rem;
          }
          
          .jackpot-toggle input {
            margin-right: 0.8rem;
            accent-color: #FF6B00;
          }
          
          .toggle-text {
            color: #FF6B00;
            font-size: 0.9rem;
            font-weight: 600;
          }
          
          .jackpot-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
          }
          
          .jackpot-chance, .jackpot-contribution {
            margin-bottom: 0.3rem;
          }
          
          .open-chest-button {
            width: 100%;
            background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 0.8rem;
            box-shadow: 0 4px 20px rgba(255, 107, 0, 0.3);
          }
          
          .open-chest-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(255, 107, 0, 0.4);
          }
          
          .open-chest-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .open-multi-button {
            background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
            box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
          }
          
          .open-multi-button:hover:not(:disabled) {
            box-shadow: 0 8px 30px rgba(147, 51, 234, 0.4);
          }
          
          /* Custom styling per chest type */
          .chest-card[data-type="bronze"] .chest-glow {
            background: radial-gradient(
              circle,
              rgba(205, 127, 50, 0.4) 0%,
              rgba(205, 127, 50, 0.2) 50%,
              rgba(205, 127, 50, 0) 70%
            );
          }
          
          .chest-card[data-type="bronze"]:hover {
            border-color: rgba(205, 127, 50, 0.6);
            box-shadow: 0 12px 40px rgba(205, 127, 50, 0.2);
          }
          
          .chest-card[data-type="silver"] .chest-glow {
            background: radial-gradient(
              circle,
              rgba(192, 192, 192, 0.4) 0%,
              rgba(192, 192, 192, 0.2) 50%,
              rgba(192, 192, 192, 0) 70%
            );
          }
          
          .chest-card[data-type="silver"]:hover {
            border-color: rgba(192, 192, 192, 0.6);
            box-shadow: 0 12px 40px rgba(192, 192, 192, 0.2);
          }
          
          .chest-card[data-type="gold"] .chest-glow {
            background: radial-gradient(
              circle,
              rgba(255, 215, 0, 0.4) 0%,
              rgba(255, 215, 0, 0.2) 50%,
              rgba(255, 215, 0, 0) 70%
            );
          }
          
          .chest-card[data-type="gold"]:hover {
            border-color: rgba(255, 215, 0, 0.6);
            box-shadow: 0 12px 40px rgba(255, 215, 0, 0.2);
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .chest-card {
              padding: 1.2rem;
              min-height: 400px;
            }
            
            .chest-title {
              font-size: 1.2rem;
              margin-bottom: 1rem;
            }
            
            .chest-image-container {
              width: 90px;
              height: 90px;
              margin-bottom: 1rem;
            }
            
            .base-price {
              font-size: 1.1rem;
            }
            
            .open-chest-button {
              padding: 0.8rem 1.2rem;
              font-size: 0.9rem;
            }
          }
          
          @media (max-width: 480px) {
            .chest-card {
              padding: 1rem;
              min-height: 380px;
            }
            
            .chest-title {
              font-size: 1rem;
            }
            
            .chest-image-container {
              width: 80px;
              height: 80px;
            }
            
            .chest-features {
              padding: 0.8rem;
            }
            
            .chest-features li {
              font-size: 0.8rem;
            }
            
            .jackpot-section {
              padding: 0.8rem;
            }
          }
        `}</style>
      </div>

      {isOpening && prize && (
        <ChestOpenModal
          isOpen={isOpening}
          onClose={handleCloseModal}
          onClaim={handleClaimReward}
          type={type}
          prize={prize}
          multiplePrizes={prizes}
        />
      )}

      {error && (
        <div className="error-modal">
          <div className={`error-content ${getChestColor(type)}`}>
            <div className="pixel-border">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={handleCloseModal} className="error-button">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function getChestColor(type: 'bronze' | 'silver' | 'gold') {
  switch (type) {
    case 'bronze':
      return 'bg-gradient-to-br from-amber-600 to-amber-800'
    case 'silver':
      return 'bg-gradient-to-br from-gray-300 to-gray-500'
    case 'gold':
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  }
} 