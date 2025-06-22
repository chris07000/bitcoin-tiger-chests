import React, { useState, useEffect } from 'react'
import { useChestProgress } from '@/context/ChestProgressContext'
import Image from 'next/image'
import ChestOpenModal from './ChestOpenModal'
import FreeChestRewardModal from './FreeChestRewardModal'
import { useWallet } from '@/context/WalletContext'
import { useLightning } from '@/context/LightningContext'
import { toast } from 'react-hot-toast'

type ChestType = 'bronze' | 'silver' | 'gold'

interface ChestWin {
  amount: number
  isJackpot: boolean
}

const ChestProgress: React.FC = () => {
  const { progress, canClaimFreeChest, claimFreeChest, addOpenedChest } = useChestProgress()
  const { balance, walletAddress, refreshBalance } = useWallet()
  const { setBalance } = useLightning()
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState<ChestType>('bronze')
  const [showChestModal, setShowChestModal] = useState(false)
  const [win, setWin] = useState<{ amount: number; isJackpot: boolean } | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check voor nieuwe free chests wanneer progress verandert
  useEffect(() => {
    if (!isClient) return
    // Check for free chests when progress changes
    const types: ChestType[] = ['bronze', 'silver', 'gold']
    for (const type of types) {
      if (canClaimFreeChest(type)) {
        setSelectedType(type)
        setShowModal(true)
        break
      }
    }
  }, [progress, canClaimFreeChest, isClient])

  // Bereken progress percentage voor elk type
  const getProgress = (type: ChestType) => {
    const opened = progress[`${type}Opened` as keyof typeof progress] || 0
    const nextReward = progress[`next${type.charAt(0).toUpperCase() + type.slice(1)}Reward` as keyof typeof progress] || 0
    const remaining = nextReward - opened
    const percentage = nextReward > 0 ? (opened / nextReward) * 100 : 0

    return {
      opened,
      remaining,
      percentage: Math.min(percentage, 100)
    }
  }

  const handleClaimFreeChest = async () => {
    try {
      if (!walletAddress) {
        toast.error('Please connect your wallet first');
        return;
      }

      console.log(`Claiming free ${selectedType} chest - DEBUG LOGGING`);
      console.log(`Current progress in ChestProgress component:`, JSON.stringify(progress));
      
      // 1. EERST direct een update naar de database sturen via het debug endpoint
      try {
        console.log(`Force update to database for ${selectedType}Opened`);
        
        // Verhoog de teller voor dit type chest
        const currentValue = progress[`${selectedType}Opened` as keyof typeof progress] || 0;
        const newValue = currentValue + 1;
        
        // Directe database update
        await forceUpdateChestProgress(selectedType, newValue);
        console.log(`Direct database update complete: ${selectedType}Opened = ${newValue}`);
      } catch (directUpdateError) {
        console.error('Error with direct database update:', directUpdateError);
      }
      
      // 2. Open de free chest via de API
      console.log(`Calling API to open free ${selectedType} chest`);
      const response = await fetch('/api/chests/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({
          walletAddress,
          chestType: selectedType,
          joinJackpot: true,
          isFree: true
        }),
      });

      if (!response.ok) {
        console.error(`API call failed with status ${response.status}: ${response.statusText}`);
        throw new Error('Failed to open free chest');
      }

      const data = await response.json();
      console.log(`Free ${selectedType} chest opened successfully:`, data);
      console.log('Complete API response:', JSON.stringify(data));
      
      // 3. Update the win state with the result
      setWin({
        amount: data.reward || 0,
        isJackpot: data.isJackpotWin || false
      });
      
      // 4. Update local state voor UI
      console.log(`Updating local progress state for ${selectedType} chest`);
      addOpenedChest(selectedType);
      claimFreeChest(selectedType);
      
      // 5. Sluit de claimModal
      setShowModal(false);
      
      // 6. Controleer de database update
      setTimeout(() => {
        console.log('Checking current database state after free chest claim...');
        refreshBalance(); // Refresh wallet balance
        
        // Check de database status via het debug endpoint
        fetch(`/api/chests/debug-progress?wallet=${walletAddress}&action=get`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log('Current database state:', data);
          
          // Als de waarde nog steeds 0 is, doe nog een force update
          const currentDBValue = data?.progress?.[`${selectedType}Opened`];
          console.log(`Current ${selectedType}Opened value in database:`, currentDBValue);
          
          if (currentDBValue === 0) {
            console.log('Database value still 0, forcing another update');
            forceUpdateChestProgress(selectedType, 1);
          }
        })
        .catch(err => {
          console.error('Error checking database state:', err);
        });
      }, 1000);
      
      // 7. Toon het chest open modal
      setTimeout(() => {
        setShowChestModal(true);
      }, 100);
    } catch (error) {
      console.error('Error opening free chest:', error);
      toast.error('Failed to open free chest. Please try again.');
      
      let errorMsg = 'Unknown error';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      console.error(`Detailed error: ${errorMsg}`);
    }
  };

  const handleClaimReward = async () => {
    try {
      if (!walletAddress || !win) return;

      // Claim the reward
      const claimResponse = await fetch('/api/chests/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          chestType: selectedType,
          reward: win.amount
        }),
      });

      if (!claimResponse.ok) {
        throw new Error('Failed to claim reward');
      }

      const claimData = await claimResponse.json();
      setBalance(claimData.balance);
      
      handleCloseChestModal();
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward');
    }
  };

  const handleCloseChestModal = () => {
    setShowChestModal(false)
    setWin(null)
    setSelectedType('bronze')
  }

  // Voeg een helper functie toe om de database direct te updaten
  const forceUpdateChestProgress = async (type: ChestType, value: number) => {
    if (!walletAddress) return;
    
    try {
      console.log(`Force updating ${type}Opened to ${value} in database`);
      
      // Gebruik het debug endpoint om de database direct te updaten
      const response = await fetch(`/api/chests/debug-progress?wallet=${walletAddress}&action=set&type=${type}&value=${value}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      const data = await response.json();
      console.log('Force update result:', data);
      
      // Vernieuw de frontend data
      setTimeout(() => {
        console.log('Refreshing frontend data after force update');
        refreshBalance();
      }, 500);
      
      return data;
    } catch (error) {
      console.error('Error forcing update:', error);
      return null;
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Modals */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Free Chest Reward Modal */}
        {showModal && selectedType && (
          <div className="pointer-events-auto">
            <FreeChestRewardModal
              isOpen={true}
              onClose={() => setShowModal(false)}
              onClaim={handleClaimFreeChest}
              type={selectedType}
            />
          </div>
        )}

        {/* Chest Open Modal */}
        {showChestModal && selectedType && win && (
          <div className="pointer-events-auto">
            <ChestOpenModal
              isOpen={true}
              onClose={handleCloseChestModal}
              onClaim={handleClaimReward}
              type={selectedType}
              prize={{
                amount: win.amount,
                isJackpot: win.isJackpot
              }}
            />
          </div>
        )}
      </div>

      {/* Progress Container */}
      <div className="progress-container">
        <h2 className="progress-title">Free Chest Progress</h2>

        {/* Progress bars */}
        {(['bronze', 'silver', 'gold'] as const).map(type => {
          const { opened, remaining, percentage } = getProgress(type as ChestType)
          const canClaim = canClaimFreeChest(type)

          return (
            <div key={type} className="progress-item">
              <div className="progress-header">
                <span className="chest-type">{type}</span>
                <span className="opened-count">{opened} opened</span>
              </div>

              {/* Progress bar */}
              <div className="progress-bar-container">
                <div 
                  className={`progress-bar-fill ${type}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Remaining text */}
              <div className="progress-status">
                {canClaim ? (
                  <span className="free-chest-available">Free chest available!</span>
                ) : (
                  <span>{remaining} more until free chest</span>
                )}
              </div>
            </div>
          )
        })}

        <style jsx>{`
          .progress-container {
            background: rgba(26, 26, 27, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 107, 0, 0.3);
            border-radius: 16px;
            padding: 2rem;
            width: 100%;
            max-width: 800px;
            margin: 2rem auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .progress-title {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 2rem;
            text-align: center;
            text-transform: none;
            letter-spacing: normal;
          }

          .progress-item {
            margin-bottom: 1.5rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 107, 0, 0.2);
            transition: all 0.3s ease;
          }

          .progress-item:hover {
            border-color: rgba(255, 107, 0, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(255, 107, 0, 0.1);
          }

          .progress-item:last-child {
            margin-bottom: 0;
          }

          .progress-header {
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 1rem;
            text-transform: capitalize;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .chest-type {
            color: #FF6B00;
            font-weight: 700;
            font-size: 1.1rem;
          }

          .opened-count {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
          }

          .progress-bar-container {
            background: rgba(255, 255, 255, 0.05);
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 1rem;
            border: 1px solid rgba(255, 107, 0, 0.2);
          }

          .progress-bar-fill {
            height: 100%;
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }

          .progress-bar-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .progress-bar-fill.bronze {
            background: linear-gradient(135deg, #cd7f32 0%, #b87333 100%);
          }

          .progress-bar-fill.silver {
            background: linear-gradient(135deg, #c0c0c0 0%, #a9a9a9 100%);
          }

          .progress-bar-fill.gold {
            background: linear-gradient(135deg, #ffd700 0%, #daa520 100%);
          }

          .progress-status {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            font-weight: 500;
            text-align: center;
          }

          .free-chest-available {
            color: #22c55e;
            font-weight: 700;
            font-size: 1rem;
            text-align: center;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            margin-top: 0.5rem;
            animation: pulse-glow 2s infinite;
          }

          @keyframes pulse-glow {
            0%, 100% { 
              box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
              transform: scale(1.02);
            }
          }

          @media (max-width: 768px) {
            .progress-container {
              padding: 1.5rem;
              margin: 1.5rem auto;
            }

            .progress-title {
              font-size: 1.5rem;
              margin-bottom: 1.5rem;
            }

            .progress-item {
              padding: 1.2rem;
              margin-bottom: 1.2rem;
            }

            .progress-header {
              font-size: 0.9rem;
            }

            .chest-type {
              font-size: 1rem;
            }

            .opened-count {
              font-size: 0.8rem;
            }
          }

          @media (max-width: 480px) {
            .progress-container {
              padding: 1rem;
              margin: 1rem auto;
            }

            .progress-title {
              font-size: 1.3rem;
            }

            .progress-item {
              padding: 1rem;
            }

            .progress-header {
              flex-direction: column;
              gap: 0.5rem;
              text-align: center;
            }
          }
        `}</style>
      </div>
    </>
  )
}

export default ChestProgress 