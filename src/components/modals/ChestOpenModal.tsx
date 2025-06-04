'use client'

interface OpenResult {
  reward: number;
  isJackpotWin: boolean;
  jackpotAmount?: number;
  balance: number;
}

interface ChestOpenModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: OpenResult | null;
  type: 'bronze' | 'silver' | 'gold';
  multipleResults?: OpenResult[];
}

export default function ChestOpenModal({ isOpen, onClose, result, type, multipleResults }: ChestOpenModalProps) {
  if (!isOpen) return null;

  const totalReward = multipleResults ? 
    multipleResults.reduce((sum, r) => sum + r.reward, 0) : 
    result?.reward || 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 capitalize">
            {multipleResults ? `${type} Chests Opened!` : `${type} Chest Opened!`}
          </h3>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            {multipleResults ? (
              <>
                <div className="space-y-2">
                  {multipleResults.map((r, i) => (
                    <p key={i} className="text-lg">
                      Chest {i + 1}: <span className="font-bold text-green-600">+{r.reward.toLocaleString()} sats</span>
                    </p>
                  ))}
                  <div className="border-t border-gray-300 mt-4 pt-4">
                    <p className="text-2xl font-bold text-green-600">
                      Total: +{totalReward.toLocaleString()} sats
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-3xl font-bold text-green-600">
                +{totalReward.toLocaleString()} sats
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export type { OpenResult }; 