'use client';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useLightning } from '@/context/LightningContext';

interface LightningModalProps {
  invoice: string | null;
  initialAmount: number;
  onCloseAction: () => void;
  paymentHash: string | null;
  onAmountChangeAction: (amount: number) => void;
}

export default function LightningModal({ 
  invoice, 
  initialAmount, 
  onCloseAction, 
  paymentHash,
  onAmountChangeAction 
}: LightningModalProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed'>('pending');
  const [isMobile, setIsMobile] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { checkPayment } = useLightning();

  // Keep track of current invoice and payment hash to prevent cross-contamination
  const [currentInvoice, setCurrentInvoice] = useState<string | null>(null);
  const [currentPaymentHash, setCurrentPaymentHash] = useState<string | null>(null);

  // Check if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update current invoice and payment hash when props change
  useEffect(() => {
    if (invoice && paymentHash) {
      console.log('LightningModal: New invoice/payment hash set:', {
        invoice: invoice.substring(0, 20) + '...',
        paymentHash: paymentHash
      });
      setCurrentInvoice(invoice);
      setCurrentPaymentHash(paymentHash);
      setPaymentStatus('pending'); // Reset status for new invoice
    }
  }, [invoice, paymentHash]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let checkCount = 0;
    const MAX_CHECKS = 20; // 1 minute of checking (20 * 3 seconds)

    const checkPaymentStatus = async () => {
      if (!currentPaymentHash) return;

      try {
        checkCount++;
        
        const encodedHash = encodeURIComponent(currentPaymentHash);
        const status = await checkPayment(encodedHash);

        if (status.paid) {
          clearInterval(intervalId);
          setPaymentStatus('paid');
          setTimeout(() => {
            onCloseAction();
          }, 2000);
          return;
        }
        
        // If we've checked too many times, mark as failed
        if (checkCount >= MAX_CHECKS) {
          clearInterval(intervalId);
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        
        // Only mark as failed if we've tried enough times
        if (checkCount >= MAX_CHECKS) {
          clearInterval(intervalId);
          setPaymentStatus('failed');
        }
      }
    };

    if (currentPaymentHash) {
      checkCount = 0; // Reset counter
      checkPaymentStatus(); // Check immediately
      intervalId = setInterval(checkPaymentStatus, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentPaymentHash, onCloseAction, checkPayment]);

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };

  const handleGenerateInvoice = () => {
    onAmountChangeAction(amount);
  };

  // Cleanup function to prevent invoice overlap
  const handleCloseWithCleanup = async () => {
    if (currentPaymentHash) {
      console.log('LightningModal: Cleaning up invoice on close:', currentPaymentHash);
      
      try {
        // Call the cancel API to mark the invoice as cancelled in the database
        const response = await fetch('/api/lightning/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentHash: currentPaymentHash
          }),
        });
        
        if (response.ok) {
          console.log('LightningModal: Successfully cancelled invoice:', currentPaymentHash);
        } else {
          console.error('LightningModal: Failed to cancel invoice:', await response.text());
        }
      } catch (error) {
        console.error('LightningModal: Error calling cancel API:', error);
      }
      
      // Also mark in localStorage as backup
      localStorage.setItem(`cancelled_invoice_${currentPaymentHash}`, Date.now().toString());
    }
    
    // Reset local state
    setCurrentInvoice(null);
    setCurrentPaymentHash(null);
    setPaymentStatus('pending');
    
    // Call the original close action
    onCloseAction();
  };

  const copyToClipboard = async () => {
    if (!currentInvoice) return;
    
    console.log('COPY DEBUG: invoice value =', currentInvoice);
    console.log('COPY DEBUG: invoice starts with =', currentInvoice.substring(0, 10));
    
    try {
      await navigator.clipboard.writeText(currentInvoice);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy invoice:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentInvoice;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isMobile ? 'Deposit' : 'Lightning Deposit'}</h2>
        <div className="input-group">
          <label>{isMobile ? 'Amount:' : 'Amount (sats):'}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(Math.max(0, parseInt(e.target.value) || 0))}
            min="1"
            className="amount-input"
          />
        </div>
        
        {!currentInvoice && (
          <div className="modal-buttons">
            <button onClick={handleGenerateInvoice}>
              {isMobile ? 'Create' : 'Generate Invoice'}
            </button>
            <button onClick={handleCloseWithCleanup}>
              {isMobile ? '×' : 'Cancel'}
            </button>
          </div>
        )}

        {currentInvoice && (
          <>
            <div className="input-group">
              <label>{isMobile ? 'QR Code:' : 'Scan QR Code:'}</label>
              <div className="qr-container">
                <QRCode
                  value={currentInvoice}
                  size={isMobile ? 150 : 200}
                  level="H"
                />
              </div>
              <div className="invoice-text-container">
                <div className="invoice-text">
                  {isMobile 
                    ? `${currentInvoice.substring(0, 15)}...${currentInvoice.substring(currentInvoice.length - 15)}`
                    : currentInvoice
                  }
                </div>
                <button 
                  className="copy-button"
                  onClick={copyToClipboard}
                  title="Copy Lightning Invoice"
                >
                  {copySuccess ? (isMobile ? '✓' : 'Copied!') : (isMobile ? '📋' : 'Copy')}
                </button>
              </div>
            </div>

            <div className="status-message">
              {paymentStatus === 'pending' && (
                <p>{isMobile ? 'Waiting...' : 'Waiting for payment...'}</p>
              )}
              {paymentStatus === 'paid' && (
                <p className="success">
                  {isMobile ? 'Received! ⚡' : 'Payment received! ⚡'}
                </p>
              )}
              {paymentStatus === 'failed' && (
                <p className="error">
                  {isMobile ? 'Failed. Try again.' : 'Payment failed. Please try again.'}
                </p>
              )}
            </div>

            <div className="modal-buttons">
              <button onClick={handleCloseWithCleanup}>
                {isMobile ? 'Close' : 'Close'}
              </button>
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        .invoice-text-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .invoice-text {
          font-family: var(--font-geist-mono);
          font-size: 0.75rem;
          color: var(--gold);
          word-break: break-all;
          background: black;
          border: 1px solid var(--gold);
          padding: 0.5rem;
          border-radius: 4px;
          flex: 1;
        }
        
        .copy-button {
          background: var(--gold);
          color: black;
          border: 1px solid black;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: bold;
          min-width: ${isMobile ? '40px' : '60px'};
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .copy-button:hover {
          background: #ffea00;
          transform: translateY(-1px);
        }
        
        .copy-button:active {
          transform: translateY(0);
        }
        
        @media (max-width: 768px) {
          .invoice-text-container {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .copy-button {
            width: 100%;
            min-width: auto;
          }
          
          .invoice-text {
            font-size: 0.7rem;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
} 