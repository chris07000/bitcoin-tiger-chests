'use client'
import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useLightning } from '../../context/LightningContext';
import LightningModal from '../lightning/LightningModal';

export default function BitcoinPrice() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [satsPerUSD, setSatsPerUSD] = useState<number | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [invoice, setInvoice] = useState<string>('');
  const [depositInvoice, setDepositInvoice] = useState<string | null>(null);
  const [depositPaymentHash, setDepositPaymentHash] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [isClient, setIsClient] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingWithdrawal, setPendingWithdrawal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { connectedWallet, walletAddress, connectXverse, connectMagicEden, disconnectWallet } = useWallet();
  const { balance: contextBalance, setBalance, withdraw, generateInvoice, isInitialized, pendingWithdrawal: contextPendingWithdrawal } = useLightning();
  
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
        
        console.log('BitcoinPrice: Balans bijgewerkt via API:', data.balance);
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
  
  // Nieuwe useEffect om de balans regelmatig bij te werken
  useEffect(() => {
    if (!walletAddress) return;
    
    // Haal direct bij laden de actuele balans op
    fetchActualBalance();
    
    // Update elke 10 seconden
    const balanceInterval = setInterval(() => {
      fetchActualBalance();
    }, 10000);
    
    return () => clearInterval(balanceInterval);
  }, [walletAddress]);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
      const data = await response.json();
      const price = parseFloat(data.data.amount);
      setBtcPrice(price);
      setSatsPerUSD(Math.round(100000000 / price));
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  const handleDeposit = async (amount: number) => {
    try {
      if (!walletAddress) {
        setErrorMessage('Please connect your wallet first');
        setShowErrorAlert(true);
        return;
      }

      if (!isInitialized) {
        setErrorMessage('Please wait while we connect to your wallet');
        setShowErrorAlert(true);
        return;
      }

      const response = await generateInvoice(amount, `Deposit for ${walletAddress}`);
      setDepositInvoice(response.paymentRequest);
      setDepositPaymentHash(response.paymentHash);
    } catch (error) {
      console.error('Error generating invoice:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate invoice');
      setShowErrorAlert(true);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!walletAddress) {
        setErrorMessage('Please connect your wallet first');
        setShowErrorAlert(true);
        return;
      }

      if (withdrawAmount > contextBalance) {
        setErrorMessage('Insufficient balance');
        setShowErrorAlert(true);
        return;
      }

      if (!invoice || !invoice.startsWith('lnbc')) {
        setErrorMessage('Please enter a valid Lightning invoice');
        setShowErrorAlert(true);
        return;
      }

      setPendingWithdrawal(true);

      await withdraw(withdrawAmount, invoice);
      
      setShowWithdrawModal(false);
      setInvoice('');
      setShowSuccessAlert(true);
      
      // Haal de bijgewerkte balans op na een succesvolle withdraw
      fetchActualBalance();
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
              onClick={() => {
                setShowDepositModal(true);
              }}
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
        <div className="modal">
          <div className="modal-content">
            <h2>Withdraw sats</h2>
            <div className="warning-message">
              ⚠️ {isMobile ? 'Create an invoice for EXACTLY this amount' : 'Important: Please create an invoice for EXACTLY this amount'}
            </div>
            <div className="input-group">
              <label>Amount (sats):</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                min="1"
                max={contextBalance}
                className="amount-input"
                disabled={pendingWithdrawal}
              />
            </div>
            <div className="input-group">
              <label>Lightning Invoice:</label>
              <input
                type="text"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="lnbc..."
                className="invoice-input"
                disabled={pendingWithdrawal}
              />
            </div>
            <div className="modal-buttons">
              <button 
                onClick={handleWithdraw}
                disabled={pendingWithdrawal}
                className={pendingWithdrawal ? 'pending' : ''}
              >
                {pendingWithdrawal ? '...' : isMobile ? 'Send' : 'Withdraw'}
              </button>
              <button 
                onClick={() => {
                  setShowWithdrawModal(false);
                  setInvoice('');
                }}
                disabled={pendingWithdrawal}
              >
                {isMobile ? '×' : 'Cancel'}
              </button>
            </div>
            {pendingWithdrawal && (
              <div className="pending-message">
                ⏳ {isMobile ? 'Processing...' : 'Processing withdrawal... Please wait'}
              </div>
            )}
          </div>
        </div>
      )}

      {showDepositModal && (
        <LightningModal
          invoice={depositInvoice}
          initialAmount={depositAmount}
          onCloseAction={() => {
            setShowDepositModal(false);
            setDepositInvoice(null);
            setDepositPaymentHash(null);
          }}
          paymentHash={depositPaymentHash}
          onAmountChangeAction={(amount) => {
            setDepositAmount(amount);
            handleDeposit(amount);
          }}
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