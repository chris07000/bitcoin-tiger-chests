import { useState, useEffect } from 'react';
import { useLightning } from '@/context/LightningContext';
import { useWallet } from '@/context/WalletContext';
import { toast } from 'react-hot-toast';

interface ChestState {
  isOpening: boolean;
  isOpen: boolean;
  reward: number | null;
  isJackpotWin: boolean;
  jackpotWinAmount: number | null;
  message: string | null;
}

const Chests = () => {
  const [isOpening, setIsOpening] = useState(false);
  const [joinJackpot, setJoinJackpot] = useState(false);
  const [chestState, setChestState] = useState<ChestState>({
    isOpening: false,
    isOpen: false,
    reward: null,
    isJackpotWin: false,
    jackpotWinAmount: null,
    message: null
  });
  const [chestOpenSound, setChestOpenSound] = useState<HTMLAudioElement | null>(null);
  const [winSound, setWinSound] = useState<HTMLAudioElement | null>(null);
  const { balance, setBalance } = useLightning();
  const { walletAddress } = useWallet();

  useEffect(() => {
    // Preload sounds
    const openSound = new Audio('/sounds/chest-open.mp3');
    const winSound = new Audio('/sounds/win.mp3');
    setChestOpenSound(openSound);
    setWinSound(winSound);
  }, []);

  const handleChestOpen = async (chestType: string) => {
    let totalCost = 0;
    try {
      if (isOpening) return;

      if (!walletAddress) {
        toast.error('Please connect your wallet first');
        return;
      }

      // Controleer of er voldoende saldo is
      const chestConfig = {
        bronze: { cost: 5000, jackpotFee: 1000 },
        silver: { cost: 20000, jackpotFee: 2500 },
        gold: { cost: 50000, jackpotFee: 5000 }
      };

      const config = chestConfig[chestType as keyof typeof chestConfig];
      if (!config) {
        toast.error('Invalid chest type');
        return;
      }

      totalCost = config.cost + (joinJackpot ? config.jackpotFee : 0);

      if (balance < totalCost) {
        toast.error('Insufficient balance');
        return;
      }

      // Trek direct de kosten af in de UI
      const newBalance = balance - totalCost;
      setBalance(newBalance);

      setIsOpening(true);
      setChestState(prev => ({ ...prev, isOpening: true }));

      // Speel het openen geluid
      if (chestOpenSound) {
        chestOpenSound.play();
      }

      // Wacht op de animatie
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Open de kist
      const response = await fetch('/api/chests/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          chestType,
          joinJackpot,
          isFree: false
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to open chest');
      }

      const data = await response.json();

      // Update de chest state
      setChestState(prev => ({
        ...prev,
        isOpening: false,
        isOpen: true,
        reward: data.reward || 0,
        isJackpotWin: data.isJackpotWin || false,
        jackpotWinAmount: data.jackpotAmount || 0,
        message: data.isJackpotWin 
          ? `You won ${(data.reward || 0).toLocaleString()} sats + ${(data.jackpotAmount || 0).toLocaleString()} sats jackpot!` 
          : `You won ${(data.reward || 0).toLocaleString()} sats!`
      }));

      // Voeg de reward toe aan de huidige balance
      const finalBalance = newBalance + (data.reward || 0) + (data.isJackpotWin ? (data.jackpotAmount || 0) : 0);
      setBalance(finalBalance);

      // Speel het win geluid
      if (winSound) {
        winSound.play();
      }

    } catch (error) {
      console.error('Error opening chest:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to open chest');
      setChestState(prev => ({ ...prev, isOpening: false }));
      // Herstel de balance als er een fout optreedt
      setBalance(balance);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={() => handleChestOpen('bronze')}
          disabled={isOpening}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Open Bronze Chest (5,000 sats)
        </button>
        <button
          onClick={() => handleChestOpen('silver')}
          disabled={isOpening}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50"
        >
          Open Silver Chest (20,000 sats)
        </button>
        <button
          onClick={() => handleChestOpen('gold')}
          disabled={isOpening}
          className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 disabled:opacity-50"
        >
          Open Gold Chest (50,000 sats)
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="joinJackpot"
          checked={joinJackpot}
          onChange={(e) => setJoinJackpot(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="joinJackpot" className="text-sm text-gray-700">
          Join Jackpot (Extra 1,000/2,500/5,000 sats)
        </label>
      </div>

      {chestState.isOpen && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">{chestState.message}</p>
        </div>
      )}
    </div>
  );
};

export default Chests; 