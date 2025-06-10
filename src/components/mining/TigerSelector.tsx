'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Tiger {
  id: string;
  tigerId: string;
  tigerName: string;
  tigerImage: string;
  inscriptionNumber: number;
  contentType: string;
  isAvailable: boolean;
}

interface TigerSelectorProps {
  walletAddress: string;
  onTigersSelected: (tigers: Tiger[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function TigerSelector({ 
  walletAddress, 
  onTigersSelected, 
  isOpen, 
  onClose 
}: TigerSelectorProps) {
  const [tigers, setTigers] = useState<Tiger[]>([]);
  const [selectedTigers, setSelectedTigers] = useState<Tiger[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && walletAddress) {
      fetchUserTigers();
    }
  }, [isOpen, walletAddress]);

  const fetchUserTigers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mining/user-tigers?wallet=${walletAddress}`);
      const data = await response.json();
      
      if (data.success) {
        setTigers(data.tigers);
        console.log(`🐅 Loaded ${data.tigers.length} tigers for mining selection`);
      } else {
        console.error('Failed to load tigers:', data.error);
        setTigers([]);
      }
    } catch (error) {
      console.error('Error fetching tigers:', error);
      // Fallback to empty tigers array if API fails
      setTigers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTiger = (tiger: Tiger) => {
    const isSelected = selectedTigers.some(t => t.id === tiger.id);
    if (isSelected) {
      setSelectedTigers(selectedTigers.filter(t => t.id !== tiger.id));
    } else {
      setSelectedTigers([...selectedTigers, tiger]);
    }
  };

  const confirmSelection = () => {
    onTigersSelected(selectedTigers);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="tiger-selector-overlay">
      <div className="tiger-selector-modal">
        <div className="modal-header">
          <h2>🐅 Select Tigers for Mining</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading your tigers...</div>
          ) : tigers.length === 0 ? (
            <div className="no-tigers">
              <div className="no-tigers-icon">🐅</div>
              <h3>No Tigers Available for Mining</h3>
              <p>You need to have <strong>staked tigers</strong> to participate in mining pools.</p>
              <div className="action-hints">
                <p>💡 <strong>Get started:</strong></p>
                <ol>
                  <li>Go to the Tiger Staking page</li>
                  <li>Stake some tigers to level them up</li>
                  <li>Come back here to join mining pools!</li>
                </ol>
              </div>
              <p className="tip">Higher level tigers earn more mining rewards! 🚀</p>
            </div>
          ) : (
            <>
              <div className="selection-info">
                <p>Selected: {selectedTigers.length} tigers</p>
                <div className="available-info">
                  <span>🐅 Available Tigers: {tigers.length}</span>
                </div>
              </div>
              
              <div className="tigers-grid">
                {tigers.map((tiger) => {
                  const isSelected = selectedTigers.some(t => t.id === tiger.id);
                  return (
                    <div 
                      key={tiger.id} 
                      className={`tiger-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleTiger(tiger)}
                    >
                      <div className="tiger-image">
                        <Image
                          src={tiger.tigerImage || '/tiger-logo.png'}
                          alt={tiger.tigerName || 'Tiger'}
                          width={60}
                          height={60}
                        />
                      </div>
                      
                      <div className="tiger-info">
                        <h4>{tiger.tigerName || `Tiger #${tiger.tigerId.slice(-3)}`}</h4>
                      </div>
                      
                      <div className="selection-indicator">
                        {isSelected ? '✓' : '+'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="confirm-button" 
            onClick={confirmSelection}
            disabled={selectedTigers.length === 0}
          >
            Select {selectedTigers.length} Tiger{selectedTigers.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .tiger-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .tiger-selector-modal {
          background: linear-gradient(135deg, #1a2332, #0d1320);
          border: 2px solid #ffd700;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #333;
        }
        
        .modal-header h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: ${isMobile ? '1rem' : '1.2rem'};
          color: #ffd700;
          margin: 0;
        }
        
        .close-button {
          background: none;
          border: none;
          color: #ffd700;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .modal-body {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }
        
        .loading, .no-tigers {
          text-align: center;
          padding: 3rem;
          color: #aaa;
        }
        
        .no-tigers-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .no-tigers h3 {
          color: #ffd700;
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
        }
        
        .no-tigers p {
          margin: 0.8rem 0;
          line-height: 1.6;
        }
        
        .action-hints {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid #ffd700;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          text-align: left;
        }
        
        .action-hints p {
          color: #ffd700;
          font-weight: bold;
          margin: 0 0 1rem 0;
        }
        
        .action-hints ol {
          color: #ccc;
          margin: 0;
          padding-left: 1.2rem;
        }
        
        .action-hints li {
          margin: 0.5rem 0;
        }
        
        .no-tigers .tip {
          color: #4CAF50;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .selection-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
        }
        
        .available-info {
          color: #aaa;
          font-size: 0.9rem;
        }
        
        .tigers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .tiger-card {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid #333;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .tiger-card:hover {
          border-color: #ffd700;
          transform: translateY(-2px);
        }
        
        .tiger-card.selected {
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.1);
        }
        
        .tiger-image {
          position: relative;
          margin-bottom: 0.5rem;
        }
        
        .tiger-info h4 {
          margin: 0 0 0.5rem 0;
          color: #ffd700;
          font-size: 0.9rem;
        }
        
        .selection-indicator {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #333;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .tiger-card.selected .selection-indicator {
          background: #4CAF50;
        }
        
        .modal-footer {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #333;
        }
        
        .cancel-button {
          background: #333;
          color: #aaa;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          flex: 1;
        }
        
        .confirm-button {
          background: linear-gradient(135deg, #ffd700, #ff9500);
          color: black;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          flex: 2;
        }
        
        .confirm-button:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .tigers-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          
          .selection-info {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
} 