'use client';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useLightning } from '@/context/LightningContext';
import ModalPortal from '../ui/Modal';

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
    <ModalPortal 
      isOpen={!!invoice} 
      onClose={handleCloseWithCleanup}
      className="lightning-modal-portal"
    >
      <div className="lightning-modal-content">
        <div className="lightning-modal-header">
          <h2>{isMobile ? 'Deposit' : 'Lightning Deposit'}</h2>
          <button 
            className="lightning-modal-close" 
            onClick={handleCloseWithCleanup}
          >
            ×
          </button>
        </div>
        
        <div className="lightning-input-group">
          <label>{isMobile ? 'Amount:' : 'Amount (sats):'}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(Math.max(0, parseInt(e.target.value) || 0))}
            min="1"
            className="lightning-amount-input"
          />
        </div>
        
        {!currentInvoice && (
          <div className="lightning-modal-buttons">
            <button 
              className="lightning-generate-btn"
              onClick={handleGenerateInvoice}
            >
              {isMobile ? 'Create' : 'Generate Invoice'}
            </button>
            <button 
              className="lightning-cancel-btn"
              onClick={handleCloseWithCleanup}
            >
              {isMobile ? '×' : 'Cancel'}
            </button>
          </div>
        )}

        {currentInvoice && (
          <>
            <div className="lightning-input-group">
              <label>{isMobile ? 'QR Code:' : 'Scan QR Code:'}</label>
              <div className="lightning-qr-container">
                <QRCode
                  value={currentInvoice}
                  size={isMobile ? 150 : 200}
                  level="H"
                />
              </div>
              <div className="lightning-invoice-text-container">
                <div className="lightning-invoice-text">
                  {isMobile 
                    ? `${currentInvoice.substring(0, 15)}...${currentInvoice.substring(currentInvoice.length - 15)}`
                    : currentInvoice
                  }
                </div>
                <button 
                  className="lightning-copy-button"
                  onClick={copyToClipboard}
                  title="Copy Lightning Invoice"
                >
                  {copySuccess ? (isMobile ? '✓' : 'Copied!') : (isMobile ? '📋' : 'Copy')}
                </button>
              </div>
            </div>

            <div className="lightning-status-message">
              {paymentStatus === 'pending' && (
                <p>{isMobile ? 'Waiting...' : 'Waiting for payment...'}</p>
              )}
              {paymentStatus === 'paid' && (
                <p className="lightning-success">
                  {isMobile ? 'Received! ⚡' : 'Payment received! ⚡'}
                </p>
              )}
              {paymentStatus === 'failed' && (
                <p className="lightning-error">
                  {isMobile ? 'Failed. Try again.' : 'Payment failed. Please try again.'}
                </p>
              )}
            </div>

            <div className="lightning-modal-buttons">
              <button 
                className="lightning-cancel-btn"
                onClick={handleCloseWithCleanup}
              >
                {isMobile ? 'Close' : 'Close'}
              </button>
            </div>
          </>
        )}
      
        <style jsx>{`
          .lightning-modal-content {
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

          .lightning-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .lightning-modal-header h2 {
            color: #FFB800;
            margin: 0;
            font-size: 1.2rem;
          }

          .lightning-modal-close {
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

          .lightning-input-group {
            margin-bottom: 1.5rem;
          }

          .lightning-input-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #FFB800;
            font-size: 0.8rem;
          }

          .lightning-amount-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #FF6B00;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
          }

          .lightning-qr-container {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
          }

          .lightning-invoice-text-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
          
          .lightning-invoice-text {
            font-family: monospace;
            font-size: 0.75rem;
            color: #FFB800;
            word-break: break-all;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #FFB800;
            padding: 0.5rem;
            border-radius: 4px;
            flex: 1;
          }
          
          .lightning-copy-button {
            background: #FFB800;
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
            font-family: 'Press Start 2P', monospace;
          }
          
          .lightning-copy-button:hover {
            background: #ffea00;
            transform: translateY(-1px);
          }

          .lightning-modal-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }

          .lightning-generate-btn {
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

          .lightning-cancel-btn {
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

          .lightning-status-message {
            background: rgba(255, 107, 0, 0.1);
            border: 1px solid rgba(255, 107, 0, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            text-align: center;
            font-size: 0.8rem;
          }

          .lightning-success {
            color: #10b981;
          }

          .lightning-error {
            color: #ef4444;
          }

          @media (max-width: 768px) {
            .lightning-modal-content {
              width: 95%;
              padding: 1rem;
              max-height: 85vh;
            }
            
            .lightning-modal-header h2 {
              font-size: 1rem;
            }
            
            .lightning-input-group label {
              font-size: 0.7rem;
            }
            
            .lightning-amount-input {
              font-size: 0.7rem;
              padding: 0.6rem;
            }
            
            .lightning-invoice-text-container {
              flex-direction: column;
              gap: 0.5rem;
            }
            
            .lightning-copy-button {
              width: 100%;
              min-width: auto;
            }
            
            .lightning-generate-btn,
            .lightning-cancel-btn {
              font-size: 0.6rem;
              padding: 0.6rem 1rem;
            }
            
            .lightning-modal-buttons {
              flex-direction: column;
            }
          }

          @media (max-width: 480px) {
            .lightning-modal-content {
              width: 98%;
              padding: 0.8rem;
              max-height: 80vh;
            }
            
            .lightning-modal-header {
              margin-bottom: 1rem;
            }
            
            .lightning-modal-header h2 {
              font-size: 0.9rem;
            }
            
            .lightning-input-group {
              margin-bottom: 1rem;
            }
            
            .lightning-invoice-text {
              font-size: 0.65rem;
              padding: 0.4rem;
            }
          }
        `}</style>
      </div>
    </ModalPortal>
  );
} 