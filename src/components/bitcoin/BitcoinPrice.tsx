'use client'
import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useLightning } from '../../context/LightningContext';
import DepositModal from './DepositModal';
import ModalPortal from '../ui/Modal';

export default function BitcoinPrice() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [satsPerUSD, setSatsPerUSD] = useState<number | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [invoice, setInvoice] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingWithdrawal, setPendingWithdrawal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { connectedWallet, walletAddress, connectXverse, connectMagicEden, disconnectWallet } = useWallet();
  const { balance: contextBalance, setBalance, withdraw, isInitialized, pendingWithdrawal: contextPendingWithdrawal, fetchBalance } = useLightning();
  
  // Nieuwe functie om de actuele balans op te halen
  const fetchActualBalance = async () => {
    if (!walletAddress) return;
    
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/wallet/${walletAddress}`);
      
      if (response.ok) {
        const data = await response.json();
        // Update balans in lightning context
        setBalance(data.balance);
        
        // Update balans in localStorage voor consistentie met Navbar
        const lightningBalances = JSON.parse(localStorage.getItem('lightningBalances') || '{}');
        lightningBalances[walletAddress] = data.balance;
        localStorage.setItem('lightningBalances', JSON.stringify(lightningBalances));
        
        // console.log('BitcoinPrice: Balans bijgewerkt via API:', data.balance);
      }
    } catch (error) {
      console.error('BitcoinPrice: Fout bij ophalen balans via API:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // useEffect voor balance events in plaats van polling
  useEffect(() => {
    if (!walletAddress) return;
    
    // Haal alleen bij laden de actuele balans op
    fetchActualBalance();
    
    // Luister naar balance update events in plaats van polling
    const handleBalanceUpdate = (event: CustomEvent<{ balance: number, wallet: string }>) => {
      // console.log('BitcoinPrice: Received balance update event', event.detail);
      
      // Alleen updaten als het voor onze huidige wallet is
      if (event.detail.wallet === walletAddress) {
        setBalance(event.detail.balance);
        // console.log('BitcoinPrice: Balance updated from event to', event.detail.balance);
      }
    };
    
    // Event listener toevoegen voor balance updates
    window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    
    // Cleanup alleen event listener
    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    };
  }, [walletAddress]);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
      const data = await response.json();
      const price = parseFloat(data.data.amount);
      setBtcPrice(price);
      setSatsPerUSD(Math.round(100000000 / price));
      
      // Save BTC price to localStorage for use in other components
      localStorage.setItem('btcPrice', price.toString());
      
      // Also create a global variable for immediate access
      (window as any).currentBtcPrice = price;
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!walletAddress) {
        setErrorMessage('Please connect your wallet first');
        setShowErrorAlert(true);
        return;
      }

      // First, refresh the balance from the server to ensure we have the latest balance
      // console.log('Refreshing balance before withdrawal validation...');
      setPendingWithdrawal(true);
      
      try {
        // Use fetchBalance from Lightning context which returns the balance value
        const freshBalance = await fetchBalance();
        // console.log('Fresh balance for withdrawal validation:', freshBalance);
        
        // Use the fresh balance for validation instead of cached contextBalance
        if (withdrawAmount > freshBalance) {
          setErrorMessage(`Insufficient balance. Current balance: ${freshBalance} sats, requested: ${withdrawAmount} sats`);
          setShowErrorAlert(true);
          setPendingWithdrawal(false);
          return;
        }
      } catch (balanceError) {
        console.error('Error fetching fresh balance:', balanceError);
        // Fallback to contextBalance if fresh balance fetch fails
        if (withdrawAmount > contextBalance) {
          setErrorMessage('Insufficient balance (using cached balance). Please refresh and try again.');
          setShowErrorAlert(true);
          setPendingWithdrawal(false);
          return;
        }
      }

      if (!invoice || !invoice.startsWith('lnbc')) {
        setErrorMessage('Please enter a valid Lightning invoice');
        setShowErrorAlert(true);
        setPendingWithdrawal(false);
        return;
      }

      // console.log('Proceeding with withdrawal after balance validation...');
      
      await withdraw(withdrawAmount, invoice);
      
      setShowWithdrawModal(false);
      setInvoice('');
      setShowSuccessAlert(true);
      
      // Refresh balance again after successful withdrawal
      setTimeout(() => {
        fetchBalance();
      }, 1000);
    } catch (error) {
      console.error('Error withdrawing:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process withdrawal');
      setShowErrorAlert(true);
    } finally {
      setPendingWithdrawal(false);
    }
  };

  // Format the price to be more compact on mobile
  const formatPrice = (price: number) => {
    if (isMobile) {
      if (price >= 1000000) {
        return `${(price / 1000000).toFixed(1)}M`;
      } else if (price >= 10000) {
        return `${Math.round(price / 1000)}K`;
      }
      return price.toLocaleString();
    }
    return price.toLocaleString();
  };

  if (!isClient) {
    return (
      <div className="bitcoin-price">
        <div className="price-container">
          <div className="btc-price">
            <span className="price-label">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bitcoin-price">
      <div className="price-container">
        {btcPrice && (
          <div className="btc-price">
            <span className="price-label">{isMobile ? 'BTC:' : 'BTC/USD:'}</span>
            <span className="price-value">${formatPrice(btcPrice)}</span>
          </div>
        )}
        {satsPerUSD && (
          <div className="sats-price">
            <span className="price-label">{isMobile ? 'sats/$:' : 'sats/USD:'}</span>
            <span className="price-value">{formatPrice(satsPerUSD)}</span>
          </div>
        )}
      </div>

      {!walletAddress ? (
        <div className="wallet-buttons">
          <button 
            className="pixel-button xverse"
            onClick={connectXverse}
          >
            {isMobile ? 'Xverse' : 'Connect Xverse'}
          </button>
          <button 
            className="pixel-button magiceden"
            onClick={connectMagicEden}
          >
            {isMobile ? 'Magic Eden' : 'Connect Magic Eden'}
          </button>
        </div>
      ) : (
        <div className="wallet-info">
          <div className="balance-info">
            <span className="balance-label">{isMobile ? 'Bal:' : 'Balance:'}</span>
            <span className="balance-value">{formatPrice(contextBalance)} sats</span>
            <button 
              className="refresh-button" 
              onClick={fetchActualBalance}
              disabled={isRefreshing}
              title="Refresh Balance"
            >
              ↻
            </button>
          </div>
          <span className="address">
            {connectedWallet === 'MagicEden' ? 'ME: ' : 'XV: '}
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </span>
          <div className="lightning-buttons">
            <button 
              className="pixel-button deposit"
              onClick={() => setShowDepositModal(true)}
              disabled={!isInitialized}
            >
              {isMobile ? '+' : 'Deposit'}
            </button>
            <button 
              className="pixel-button withdraw"
              onClick={() => setShowWithdrawModal(true)}
              disabled={!isInitialized}
            >
              {isMobile ? '-' : 'Withdraw'}
            </button>
            <button 
              className="pixel-button disconnect"
              onClick={disconnectWallet}
            >
              {isMobile ? '×' : 'Disconnect'}
            </button>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <ModalPortal 
          isOpen={showWithdrawModal} 
          onClose={() => setShowWithdrawModal(false)}
          className="btc-price-withdraw-modal"
        >
          <div className="btc-price-modal-content">
            <div className="btc-price-modal-header">
              <h2>Withdraw sats</h2>
              <button 
                className="btc-price-modal-close" 
                onClick={() => setShowWithdrawModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="btc-price-warning-message">
              ⚠️ {isMobile ? 'Create an invoice for EXACTLY this amount' : 'Important: Please create an invoice for EXACTLY this amount'}
            </div>
            
            <div className="btc-price-input-group">
              <label>Amount (sats):</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                min="1"
                max={contextBalance}
                className="btc-price-amount-input"
                disabled={pendingWithdrawal}
              />
            </div>
            
            <div className="btc-price-input-group">
              <label>Lightning Invoice:</label>
              <input
                type="text"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="lnbc..."
                className="btc-price-invoice-input"
                disabled={pendingWithdrawal}
              />
            </div>
            
            <div className="btc-price-modal-buttons">
              <button 
                className="btc-price-withdraw-btn"
                onClick={handleWithdraw}
                disabled={pendingWithdrawal}
              >
                {pendingWithdrawal ? '...' : isMobile ? 'Send' : 'Withdraw'}
              </button>
              <button 
                className="btc-price-cancel-btn"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setInvoice('');
                }}
                disabled={pendingWithdrawal}
              >
                {isMobile ? '×' : 'Cancel'}
              </button>
            </div>
            
            {contextPendingWithdrawal && (
              <div className="btc-price-pending-message">
                ⏳ {isMobile ? 'Processing...' : 'Processing withdrawal... Please wait'}
              </div>
            )}

            <style jsx>{`
              .btc-price-modal-content {
                background: linear-gradient(135deg, #1a1a1b 0%, #2a2a2b 100%);
                border: 2px solid #FF6B00;
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: calc(100vh - 4rem);
                overflow-y: auto;
                color: white;
                position: relative;
                font-family: 'Press Start 2P', monospace;
              }

              .btc-price-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
              }

              .btc-price-modal-header h2 {
                color: #FFB800;
                margin: 0;
                font-size: 1.2rem;
              }

              .btc-price-modal-close {
                background: none;
                border: none;
                color: #FF6B00;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .btc-price-warning-message {
                background-color: #fff3cd;
                border: 2px solid #ffeeba;
                color: #856404;
                padding: 1rem;
                margin-bottom: 1rem;
                border-radius: 4px;
                font-size: 0.7rem;
                text-align: center;
              }

              .btc-price-input-group {
                margin-bottom: 1.5rem;
              }

              .btc-price-input-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #FFB800;
                font-size: 0.8rem;
              }

              .btc-price-amount-input,
              .btc-price-invoice-input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #FF6B00;
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.3);
                color: white;
                font-family: 'Press Start 2P', monospace;
                font-size: 0.8rem;
              }

              .btc-price-modal-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
              }

              .btc-price-withdraw-btn {
                background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                flex: 1;
                font-family: 'Press Start 2P', monospace;
                font-size: 0.7rem;
              }

              .btc-price-withdraw-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }

              .btc-price-cancel-btn {
                background: transparent;
                color: #FF6B00;
                border: 1px solid #FF6B00;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                flex: 1;
                font-family: 'Press Start 2P', monospace;
                font-size: 0.7rem;
              }

              .btc-price-pending-message {
                background: rgba(255, 107, 0, 0.1);
                border: 1px solid rgba(255, 107, 0, 0.3);
                border-radius: 8px;
                padding: 1rem;
                margin-top: 1rem;
                text-align: center;
                font-size: 0.7rem;
              }

              @media (max-width: 768px) {
                .btc-price-modal-content {
                  width: 95%;
                  padding: 1rem;
                  max-height: 85vh;
                }
                
                .btc-price-modal-header h2 {
                  font-size: 1rem;
                }
                
                .btc-price-warning-message {
                  font-size: 0.6rem;
                  padding: 0.8rem;
                }
                
                .btc-price-input-group label {
                  font-size: 0.7rem;
                }
                
                .btc-price-amount-input,
                .btc-price-invoice-input {
                  font-size: 0.7rem;
                  padding: 0.6rem;
                }
                
                .btc-price-withdraw-btn,
                .btc-price-cancel-btn {
                  font-size: 0.6rem;
                  padding: 0.6rem 1rem;
                }
                
                .btc-price-modal-buttons {
                  flex-direction: column;
                }
              }

              @media (max-width: 480px) {
                .btc-price-modal-content {
                  width: 98%;
                  padding: 0.8rem;
                  max-height: 80vh;
                }
                
                .btc-price-modal-header h2 {
                  font-size: 0.9rem;
                }
                
                .btc-price-warning-message {
                  font-size: 0.5rem;
                  padding: 0.6rem;
                }
                
                .btc-price-amount-input,
                .btc-price-invoice-input {
                  padding: 0.5rem;
                  font-size: 0.6rem;
                }
                
                .btc-price-withdraw-btn,
                .btc-price-cancel-btn {
                  padding: 0.5rem 0.8rem;
                  font-size: 0.5rem;
                }
              }
            `}</style>
          </div>
        </ModalPortal>
      )}

      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
        />
      )}

      {showSuccessAlert && (
        <>
          <div className="success-overlay" onClick={() => setShowSuccessAlert(false)} />
          <div className="success-alert">
            <h2>⚡ {isMobile ? 'Success!' : 'Withdrawal Successful!'} ⚡</h2>
            <button className="ok-button" onClick={() => setShowSuccessAlert(false)}>
              OK
            </button>
          </div>
        </>
      )}

      {showErrorAlert && (
        <>
          <div className="error-overlay" onClick={() => setShowErrorAlert(false)} />
          <div className="error-alert">
            <h2>❌ Error ❌</h2>
            <p>{errorMessage}</p>
            <button className="ok-button" onClick={() => setShowErrorAlert(false)}>
              OK
            </button>
          </div>
        </>
      )}
      
      <style jsx>{`
        .refresh-button {
          background: transparent;
          border: none;
          color: #ffd700;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 2px 6px;
          border-radius: 3px;
          transition: all 0.2s;
          margin-left: 5px;
        }
        
        .refresh-button:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: rotate(180deg);
        }
        
        .refresh-button:disabled {
          opacity: 0.5;
          cursor: wait;
        }
      `}</style>
    </div>
  );
} 