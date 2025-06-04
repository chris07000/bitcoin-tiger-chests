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
  const { checkPayment } = useLightning();

  // Check if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let checkCount = 0;
    const MAX_CHECKS = 20; // 1 minute of checking (20 * 3 seconds)

    const checkPaymentStatus = async () => {
      if (!paymentHash) return;

      try {
        checkCount++;
        
        const encodedHash = encodeURIComponent(paymentHash);
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

    if (paymentHash) {
      checkCount = 0; // Reset counter
      checkPaymentStatus(); // Check immediately
      intervalId = setInterval(checkPaymentStatus, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentHash, onCloseAction, checkPayment]);

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };

  const handleGenerateInvoice = () => {
    onAmountChangeAction(amount);
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
        
        {!invoice && (
          <div className="modal-buttons">
            <button onClick={handleGenerateInvoice}>
              {isMobile ? 'Create' : 'Generate Invoice'}
            </button>
            <button onClick={onCloseAction}>
              {isMobile ? '×' : 'Cancel'}
            </button>
          </div>
        )}

        {invoice && (
          <>
            <div className="input-group">
              <label>{isMobile ? 'QR Code:' : 'Scan QR Code:'}</label>
              <div className="qr-container">
                <QRCode
                  value={invoice}
                  size={isMobile ? 150 : 200}
                  level="H"
                />
              </div>
              <div className="invoice-text">
                {isMobile 
                  ? `${invoice.substring(0, 15)}...${invoice.substring(invoice.length - 15)}`
                  : invoice
                }
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
              <button onClick={onCloseAction}>
                {isMobile ? 'Close' : 'Close'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 