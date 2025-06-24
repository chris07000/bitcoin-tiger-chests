'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@/context/WalletContext'
import { useLightning } from '@/context/LightningContext'
import { formatBitcoinAmount } from '@/lib/bitcoin-utils'
import LightningModal from '../lightning/LightningModal'

interface DepositModalProps {
  onClose: () => void
}

interface BTCPayInvoice {
  invoiceId: string
  bitcoinAddress: string
  amount: number
  amountBTC: string
  checkoutLink: string
  expiresAt: string
  network: string
}

export default function DepositModal({ onClose }: DepositModalProps) {
  const [depositType, setDepositType] = useState<'lightning' | 'bitcoin' | null>(null)
  const [amount, setAmount] = useState(10000)
  const [btcPayInvoice, setBtcPayInvoice] = useState<BTCPayInvoice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>('')
  
  // Lightning states
  const [lightningInvoice, setLightningInvoice] = useState<string | null>(null)
  const [lightningPaymentHash, setLightningPaymentHash] = useState<string | null>(null)
  
  const { walletAddress } = useWallet()
  const { generateInvoice, isInitialized } = useLightning()

  // Generate Bitcoin invoice when Bitcoin deposit is selected
  useEffect(() => {
    if (depositType === 'bitcoin' && walletAddress && !btcPayInvoice) {
      createBitcoinInvoice()
    }
  }, [depositType, walletAddress, amount])

  const createBitcoinInvoice = async () => {
    if (!walletAddress) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/bitcoin/address?wallet=${walletAddress}&amount=${amount}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Failed to create Bitcoin invoice')
      }
      
      const invoiceData = await response.json()
      setBtcPayInvoice(invoiceData)
      
      // Start monitoring payment status
      startPaymentMonitoring(invoiceData.invoiceId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  const startPaymentMonitoring = (invoiceId: string) => {
    const checkPayment = async () => {
      if (!walletAddress) return
      
      try {
        setCheckingPayment(true)
        const response = await fetch('/api/bitcoin/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            invoiceId
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.confirmed) {
            setPaymentStatus(`✅ Payment confirmed! Received ${formatBitcoinAmount(data.amount)}`)
            // Close modal after successful payment
            setTimeout(() => onClose(), 3000)
          } else if (data.paid) {
            setPaymentStatus('⏳ Payment received, waiting for confirmation...')
          } else {
            setPaymentStatus('🔍 Waiting for payment...')
          }
        }
      } catch (err) {
        console.error('Error checking payment status:', err)
      } finally {
        setCheckingPayment(false)
      }
    }

    // Check immediately, then every 30 seconds
    checkPayment()
    const interval = setInterval(checkPayment, 30000)
    
    // Cleanup interval when component unmounts or payment is confirmed
    return () => clearInterval(interval)
  }

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount)
    if (btcPayInvoice) {
      // Reset and create new invoice with new amount
      setBtcPayInvoice(null)
      setPaymentStatus('')
    }
  }

  const handleLightningDeposit = async () => {
    if (!walletAddress || !isInitialized) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await generateInvoice(amount, `Deposit for ${walletAddress}`)
      setLightningInvoice(response.paymentRequest)
      setLightningPaymentHash(response.paymentHash)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate Lightning invoice')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const openBTCPayCheckout = () => {
    if (btcPayInvoice?.checkoutLink) {
      window.open(btcPayInvoice.checkoutLink, '_blank')
    }
  }

  if (lightningInvoice && depositType === 'lightning') {
    return (
      <LightningModal
        invoice={lightningInvoice}
        initialAmount={amount}
        onCloseAction={() => {
          setLightningInvoice(null)
          setLightningPaymentHash(null)
          onClose()
        }}
        paymentHash={lightningPaymentHash}
        onAmountChangeAction={(newAmount) => {
          setAmount(newAmount)
          handleLightningDeposit()
        }}
      />
    )
  }

  return (
    <div className="deposit-modal-overlay" onClick={onClose}>
      <div className="deposit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Choose Deposit Method</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {!depositType && (
          <div className="deposit-options">
            <div className="option-card lightning" onClick={() => setDepositType('lightning')}>
              <div className="option-icon">⚡</div>
              <h3>Lightning Network</h3>
              <p>Instant deposits, low fees</p>
              <ul>
                <li>✅ Instant confirmation</li>
                <li>✅ Very low fees</li>
                <li>✅ Perfect for small amounts</li>
              </ul>
            </div>

            <div className="option-card bitcoin" onClick={() => setDepositType('bitcoin')}>
              <div className="option-icon">₿</div>
              <h3>Bitcoin Layer 1</h3>
              <p>On-chain deposits via BTCPay</p>
              <ul>
                <li>✅ Maximum security</li>
                <li>✅ No channel required</li>
                <li>✅ Powered by BTCPay Server</li>
                <li>⏱️ ~10-60 min confirmation</li>
                <li>💰 Higher network fees</li>
              </ul>
            </div>
          </div>
        )}

        {depositType === 'lightning' && (
          <div className="lightning-deposit">
            <button className="back-button" onClick={() => setDepositType(null)}>
              ← Back
            </button>
            
            <div className="amount-input">
              <label>Amount (sats):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
            </div>
            
            <button 
              className="generate-button"
              onClick={handleLightningDeposit}
              disabled={loading || !isInitialized}
            >
              {loading ? 'Generating...' : 'Generate Lightning Invoice'}
            </button>
          </div>
        )}

        {depositType === 'bitcoin' && (
          <div className="bitcoin-deposit">
            <button className="back-button" onClick={() => setDepositType(null)}>
              ← Back
            </button>
            
            <div className="amount-input">
              <label>Amount (sats):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(Math.max(1000, parseInt(e.target.value) || 1000))}
                min="1000"
              />
              <small>Minimum: 1,000 sats</small>
            </div>
            
            <div className="deposit-info">
              <h3>Bitcoin Deposit via BTCPay Server</h3>
              
              {loading ? (
                <div className="loading">Creating BTCPay invoice...</div>
              ) : btcPayInvoice ? (
                <div className="invoice-container">
                  <div className="invoice-details">
                    <p><strong>Amount:</strong> {formatBitcoinAmount(btcPayInvoice.amount)} (₿{btcPayInvoice.amountBTC})</p>
                    <p><strong>Network:</strong> {btcPayInvoice.network}</p>
                    <p><strong>Expires:</strong> {new Date(btcPayInvoice.expiresAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="payment-options">
                    <button 
                      className="btcpay-checkout-button"
                      onClick={openBTCPayCheckout}
                    >
                      🚀 Open BTCPay Checkout
                    </button>
                    
                    <div className="address-manual">
                      <p><strong>Or send manually to:</strong></p>
                      <div className="address-display">
                        <code>{btcPayInvoice.bitcoinAddress}</code>
                        <button 
                          className="copy-button"
                          onClick={() => copyToClipboard(btcPayInvoice.bitcoinAddress)}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="deposit-notes">
                    <p><strong>Important:</strong></p>
                    <ul>
                      <li>Send exactly {formatBitcoinAmount(btcPayInvoice.amount)} to this address</li>
                      <li>Payment will be credited after 1 confirmation</li>
                      <li>This invoice expires in 1 hour</li>
                      <li>Only send Bitcoin to this address</li>
                    </ul>
                  </div>
                  
                  {paymentStatus && (
                    <div className="payment-status">
                      {checkingPayment && <span className="spinner">⏳</span>}
                      <p>{paymentStatus}</p>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className="generate-button"
                  onClick={createBitcoinInvoice}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Bitcoin Invoice'}
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <style jsx>{`
          .deposit-modal-overlay {
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

          .deposit-modal {
            background: linear-gradient(135deg, #1a1a1b 0%, #2a2a2b 100%);
            border: 2px solid #FF6B00;
            border-radius: 16px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: calc(100vh - 2rem);
            overflow-y: auto;
            color: white;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .close-button {
            background: none;
            border: none;
            color: #FF6B00;
            font-size: 1.5rem;
            cursor: pointer;
          }

          .deposit-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          .option-card {
            background: rgba(26, 26, 27, 0.6);
            border: 2px solid rgba(255, 107, 0, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
          }

          .option-card:hover {
            border-color: #FF6B00;
            transform: translateY(-2px);
          }

          .option-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .option-card h3 {
            color: #FFB800;
            margin-bottom: 0.5rem;
          }

          .option-card ul {
            text-align: left;
            margin-top: 1rem;
            padding-left: 1rem;
            color: rgba(255, 255, 255, 0.8);
          }

          .option-card li {
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
          }

          .back-button {
            background: none;
            border: 1px solid #FF6B00;
            color: #FF6B00;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 1rem;
          }

          .amount-input {
            margin-bottom: 1rem;
          }

          .amount-input label {
            display: block;
            margin-bottom: 0.5rem;
            color: #FFB800;
          }

          .amount-input input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #FF6B00;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
          }

          .amount-input small {
            display: block;
            margin-top: 0.25rem;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
          }

          .generate-button, .btcpay-checkout-button {
            background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
            margin-bottom: 1rem;
          }

          .generate-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .invoice-container {
            margin-top: 1rem;
          }

          .invoice-details {
            background: rgba(255, 107, 0, 0.1);
            border: 1px solid rgba(255, 107, 0, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .payment-options {
            margin-bottom: 1rem;
          }

          .address-manual {
            margin-top: 1rem;
          }

          .address-display {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          .address-display code {
            background: rgba(0, 0, 0, 0.5);
            padding: 0.75rem;
            border-radius: 8px;
            flex: 1;
            word-break: break-all;
            font-size: 0.8rem;
          }

          .copy-button {
            background: #10b981;
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            cursor: pointer;
          }

          .deposit-notes {
            background: rgba(255, 107, 0, 0.1);
            border: 1px solid rgba(255, 107, 0, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .deposit-notes ul {
            margin: 0.5rem 0 0 1rem;
          }

          .payment-status {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            text-align: center;
          }

          .loading {
            text-align: center;
            padding: 2rem;
            color: #FFB800;
          }

          @media (max-width: 768px) {
            .deposit-modal-overlay {
              padding: 0.5rem;
              align-items: flex-start;
              padding-top: 2rem;
              overflow-y: auto;
            }
            
            .deposit-modal {
              width: 95%;
              max-height: 85vh;
              padding: 1rem;
              margin-top: 1rem;
              margin-bottom: 1rem;
            }
            
            .modal-header h2 {
              font-size: 1.2rem;
              margin-bottom: 1rem;
            }
            
            .deposit-options {
              grid-template-columns: 1fr;
              gap: 0.8rem;
            }
            
            .option-card {
              padding: 1rem;
            }
            
            .option-card h3 {
              font-size: 0.9rem;
              margin-bottom: 0.4rem;
            }
            
            .option-card p {
              font-size: 0.8rem;
            }
            
            .option-card ul {
              margin-top: 0.5rem;
              padding-left: 0.8rem;
            }
            
            .option-card li {
              margin-bottom: 0.2rem;
              font-size: 0.75rem;
            }
            
            .amount-input input {
              padding: 0.6rem;
            }
            
            .amount-input label {
              font-size: 0.9rem;
              margin-bottom: 0.4rem;
            }
            
            .generate-button, .btcpay-checkout-button {
              padding: 0.8rem 1.5rem;
              font-size: 0.9rem;
            }
            
            .back-button {
              padding: 0.4rem 0.8rem;
              font-size: 0.8rem;
              margin-bottom: 0.8rem;
            }
            
            .invoice-details {
              padding: 0.8rem;
              margin-bottom: 0.8rem;
            }
            
            .invoice-details p {
              font-size: 0.8rem;
              margin-bottom: 0.3rem;
            }
            
            .address-display {
              flex-direction: column;
              gap: 0.4rem;
            }
            
            .address-display code {
              font-size: 0.7rem;
              padding: 0.6rem;
            }
            
            .copy-button {
              padding: 0.6rem 0.8rem;
              width: 100%;
            }
            
            .deposit-notes {
              padding: 0.8rem;
              margin-bottom: 0.8rem;
            }
            
            .deposit-notes ul {
              margin: 0.4rem 0 0 0.8rem;
            }
            
            .deposit-notes li {
              font-size: 0.75rem;
              margin-bottom: 0.2rem;
            }
            
            .payment-status {
              padding: 0.8rem;
              font-size: 0.8rem;
            }
            
            .error-message {
              padding: 0.8rem;
              margin-top: 0.8rem;
              font-size: 0.8rem;
            }
            
            .loading {
              padding: 1.5rem;
              font-size: 0.9rem;
            }
          }

          @media (max-width: 480px) {
            .deposit-modal-overlay {
              padding: 0.25rem;
              padding-top: 1rem;
              overflow-y: auto;
            }
            
            .deposit-modal {
              width: 98%;
              max-height: 80vh;
              padding: 0.8rem;
            }
            
            .modal-header h2 {
              font-size: 1rem;
              margin-bottom: 0.8rem;
            }
            
            .close-button {
              font-size: 1.2rem;
            }
            
            .option-card {
              padding: 0.8rem;
            }
            
            .option-icon {
              font-size: 1.5rem;
              margin-bottom: 0.5rem;
            }
            
            .option-card h3 {
              font-size: 0.8rem;
            }
            
            .option-card p {
              font-size: 0.7rem;
            }
            
            .option-card li {
              font-size: 0.7rem;
            }
            
            .amount-input input {
              padding: 0.5rem;
              font-size: 0.9rem;
            }
            
            .amount-input small {
              font-size: 0.7rem;
            }
            
            .generate-button, .btcpay-checkout-button {
              padding: 0.7rem 1.2rem;
              font-size: 0.8rem;
            }
            
            .address-display code {
              font-size: 0.65rem;
              padding: 0.5rem;
            }
            
            .invoice-details p {
              font-size: 0.75rem;
            }
            
            .deposit-notes li {
              font-size: 0.7rem;
            }
          }
        `}</style>
      </div>
    </div>
  )
} 