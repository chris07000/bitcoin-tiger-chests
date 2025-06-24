'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@/context/WalletContext'
import { useLightning } from '@/context/LightningContext'
import { bitcoinService, formatBitcoinAmount } from '@/lib/bitcoin-utils'
import LightningModal from '../lightning/LightningModal'

interface DepositModalProps {
  onClose: () => void
}

export default function DepositModal({ onClose }: DepositModalProps) {
  const [depositType, setDepositType] = useState<'lightning' | 'bitcoin' | null>(null)
  const [amount, setAmount] = useState(10000)
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [checkingTransactions, setCheckingTransactions] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<string>('')
  
  // Lightning states
  const [lightningInvoice, setLightningInvoice] = useState<string | null>(null)
  const [lightningPaymentHash, setLightningPaymentHash] = useState<string | null>(null)
  
  const { walletAddress } = useWallet()
  const { generateInvoice, isInitialized } = useLightning()

  // Generate Bitcoin address when Bitcoin deposit is selected
  useEffect(() => {
    if (depositType === 'bitcoin' && walletAddress && !bitcoinAddress) {
      generateBitcoinAddress()
    }
  }, [depositType, walletAddress])

  const generateBitcoinAddress = async () => {
    if (!walletAddress) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/bitcoin/address?wallet=${walletAddress}`)
      if (!response.ok) throw new Error('Failed to generate Bitcoin address')
      
      const data = await response.json()
      setBitcoinAddress(data.bitcoinAddress)
      
      // Start checking for transactions
      startTransactionMonitoring(data.bitcoinAddress)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate address')
    } finally {
      setLoading(false)
    }
  }

  const startTransactionMonitoring = (address: string) => {
    const checkTransactions = async () => {
      if (!walletAddress) return
      
      try {
        setCheckingTransactions(true)
        const response = await fetch('/api/bitcoin/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            bitcoinAddress: address,
            checkTransactions: true
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.newTransactions.length > 0) {
            setTransactionStatus(`✅ Received ${data.newTransactions.length} transaction(s)!`)
            // Close modal after successful deposit
            setTimeout(() => onClose(), 2000)
          } else {
            setTransactionStatus('Waiting for transaction...')
          }
        }
      } catch (err) {
        console.error('Error checking transactions:', err)
      } finally {
        setCheckingTransactions(false)
      }
    }

    // Check every 30 seconds
    const interval = setInterval(checkTransactions, 30000)
    
    // Cleanup interval when component unmounts
    return () => clearInterval(interval)
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
              <p>On-chain deposits, higher security</p>
              <ul>
                <li>✅ Maximum security</li>
                <li>✅ No channel required</li>
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
            
            <div className="deposit-info">
              <h3>Bitcoin Deposit Address</h3>
              <p>Send Bitcoin to this address:</p>
              
              {loading ? (
                <div className="loading">Generating address...</div>
              ) : bitcoinAddress ? (
                <div className="address-container">
                  <div className="address-display">
                    <code>{bitcoinAddress}</code>
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard(bitcoinAddress)}
                    >
                      Copy
                    </button>
                  </div>
                  
                  <div className="deposit-notes">
                    <p><strong>Important:</strong></p>
                    <ul>
                      <li>Minimum confirmations: 1</li>
                      <li>Network: {process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Testnet'}</li>
                      <li>Only send Bitcoin to this address</li>
                    </ul>
                  </div>
                  
                  {checkingTransactions && (
                    <div className="transaction-status">
                      🔍 Monitoring for transactions...
                      {transactionStatus && <p>{transactionStatus}</p>}
                    </div>
                  )}
                </div>
              ) : null}
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
          }

          .deposit-modal {
            background: linear-gradient(135deg, #1a1a1b 0%, #2a2a2b 100%);
            border: 2px solid #FF6B00;
            border-radius: 16px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
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

          .generate-button {
            background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
          }

          .generate-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .address-container {
            margin-top: 1rem;
          }

          .address-display {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .address-display code {
            background: rgba(0, 0, 0, 0.5);
            padding: 0.75rem;
            border-radius: 8px;
            flex: 1;
            word-break: break-all;
            font-size: 0.9rem;
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

          .transaction-status {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
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
            .deposit-options {
              grid-template-columns: 1fr;
            }
            
            .deposit-modal {
              padding: 1rem;
            }
          }
        `}</style>
      </div>
    </div>
  )
} 