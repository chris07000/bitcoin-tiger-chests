import React from 'react'
import Image from 'next/image'

type ChestType = 'bronze' | 'silver' | 'gold'

interface FreeChestRewardModalProps {
  isOpen: boolean
  onClose: () => void
  onClaim: () => void
  type: ChestType
}

const FreeChestRewardModal: React.FC<FreeChestRewardModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  type
}) => {
  if (!isOpen) return null

  return (
    <div className="chest-modal-overlay">
      <div className="chest-modal">
        <div className="chest-content">
          <div className="mb-6">
            <Image 
              src="/chestpixel.png"
              alt={`${type} chest`}
              width={128}
              height={128}
              className="chest-image"
            />
          </div>
          
          <h2 className="text-2xl text-yellow-400 font-pixel mb-4">
            Congratulations!
          </h2>
          
          <p className="text-white font-pixel mb-6">
            You've opened 50 {type} chests!
            <br />
            Here's your free {type} chest!
          </p>

          <button
            onClick={onClaim}
            className={`pixel-button ${type}`}
          >
            OPEN FREE CHEST!
          </button>
        </div>
      </div>

      <style jsx>{`
        .chest-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          z-index: 9999;
        }

        .chest-modal {
          position: relative;
          background: #000;
          border: 4px solid #f8d74a;
          border-radius: 8px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          text-align: center;
        }

        .chest-image {
          image-rendering: pixelated;
        }

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
          width: 100%;
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

        .pixel-button:active {
          transform: translate(4px, 4px);
          box-shadow: none;
        }
      `}</style>
    </div>
  )
}

export default FreeChestRewardModal 