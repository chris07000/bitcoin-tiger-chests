import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useLightning } from '@/context/LightningContext';
import ChestOpenModal from '../modals/ChestOpenModal';
import JackpotWinnerModal from '../modals/JackpotWinnerModal';
import { toast } from 'react-hot-toast';
import type { OpenResult } from '../modals/ChestOpenModal';

interface ChestCardProps {
  type: 'bronze' | 'silver' | 'gold';
  price: number;
  minWin: number;
  maxWin: number;
  specialPrize?: string;
  jackpotFee?: number;
  jackpotChance?: number;
}

interface Alert {
  type: 'success' | 'error';
  message: string;
}

export default function ChestCard({
  type,
  price,
  minWin,
  maxWin,
  specialPrize,
  jackpotFee,
  jackpotChance
}: ChestCardProps) {
  const { walletAddress } = useWallet();
  const { balance } = useLightning();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [reward, setReward] = useState(0);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const [openResult, setOpenResult] = useState<OpenResult | null>(null);
  const [isOpeningMultiple, setIsOpeningMultiple] = useState(false);

  const handleOpenChest = async (amount: number = 1) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    const totalCost = (price + (jackpotFee || 0)) * amount;
    if (balance < totalCost) {
      setAlert({ type: 'error', message: `Insufficient balance for ${amount} chests` });
      return;
    }

    if (isOpening || isOpeningMultiple) return;

    try {
      if (amount === 1) {
        setIsOpening(true);
      } else {
        setIsOpeningMultiple(true);
      }
      setAlert(null);

      const results = [];
      for (let i = 0; i < amount; i++) {
        const response = await fetch('/api/chests/open', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: walletAddress,
            chestType: type,
            joinJackpot: true
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to open chest');
        }

        results.push(result);
        
        // Als dit de laatste chest is of er maar één is
        if (i === amount - 1) {
          setOpenResult(result);
          if (result.isJackpotWin) {
            setShowJackpotModal(true);
          } else {
            setShowOpenModal(true);
          }
        }
      }

    } catch (error) {
      console.error('Error opening chest:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to open chest');
    } finally {
      setIsOpening(false);
      setIsOpeningMultiple(false);
    }
  };

  const handleClaimReward = async () => {
    if (!walletAddress || !reward) {
      return;
    }

    try {
      setIsClaiming(true);
      setAlert(null);

      // Add the reward
      const rewardResponse = await fetch(`/api/wallet/${walletAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'chest',
          amount: reward,
          paymentHash: `chest-reward-${Date.now()}`
        }),
      });

      if (!rewardResponse.ok) {
        const error = await rewardResponse.json();
        throw new Error(error.error || 'Failed to claim reward');
      }

      console.log('Reward claimed:', {
        amount: reward,
        type,
        currentBalance: balance
      });

      setAlert({ type: 'success', message: `Successfully claimed ${reward} sats!` });
      setReward(0);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error claiming reward:', error);
      setAlert({ type: 'error', message: error.message || 'Failed to claim reward' });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 capitalize">{type} Chest</h3>
        <p className="mb-2">Price: {price} sats</p>
        <p className="mb-2">Min Win: {minWin} sats</p>
        <p className="mb-2">Max Win: {maxWin} sats</p>
        {specialPrize && <p className="mb-2">Special Prize: {specialPrize}</p>}
        {jackpotFee && <p className="mb-2">Jackpot Fee: {jackpotFee} sats</p>}
        {jackpotChance && <p className="mb-2">Jackpot Chance: {jackpotChance}%</p>}

        {alert && (
          <div className={`p-2 mb-4 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {alert.message}
          </div>
        )}

        {!isOpen ? (
          <div>
            <button
              onClick={() => handleOpenChest(1)}
              disabled={isOpening || !walletAddress || balance < price}
              className={`w-full py-2 px-4 rounded ${
                isOpening || !walletAddress || balance < price
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isOpening ? 'Opening...' : 'Open Chest'}
            </button>

            <button
              onClick={() => handleOpenChest(5)}
              disabled={isOpening || !walletAddress || balance < (price * 5)}
              className={`w-full mt-2 py-2 px-4 rounded ${
                isOpening || !walletAddress || balance < (price * 5)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Open 5x
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold mb-4">You won {reward} sats!</p>
            <button
              onClick={handleClaimReward}
              disabled={isClaiming}
              className={`w-full py-2 px-4 rounded ${
                isClaiming
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isClaiming ? 'Claiming...' : 'Claim Reward'}
            </button>
          </div>
        )}
      </div>

      <ChestOpenModal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        result={openResult}
        type={type}
      />

      {openResult && (
        <JackpotWinnerModal
          isOpen={showJackpotModal}
          onClose={() => setShowJackpotModal(false)}
          amount={openResult.jackpotAmount || 0}
          walletAddress={walletAddress || ''}
        />
      )}
    </>
  );
} 