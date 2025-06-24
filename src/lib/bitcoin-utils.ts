// Simplified Bitcoin Layer 1 utilities using APIs
// We'll add crypto libraries later if needed

interface BitcoinTransaction {
  txid: string
  confirmations: number
  amount: number
  address: string
  timestamp: number
  blockHeight?: number
}

interface FeeEstimate {
  fastestFee: number
  halfHourFee: number
  hourFee: number
  economyFee: number
  minimumFee: number
}

interface AddressInfo {
  address: string
  balance: number
  txCount: number
  unconfirmedBalance: number
}

interface BTCPayInvoice {
  id: string
  storeId: string
  amount: string
  currency: string
  type: string
  checkoutLink: string
  status: string
  additionalStatus: string
  monitoringExpiration: number
  expirationTime: number
  createdTime: number
  availableStatusesForManualMarking: string[]
  archived: boolean
  metadata: {
    orderId?: string
    buyerName?: string
    buyerEmail?: string
  }
}

interface BTCPayPaymentMethod {
  paymentMethod: string
  destination: string
  paymentLink: string
  rate: string
  paymentMethodPaid: string
  totalPaid: string
  due: string
  amount: string
  networkFee: string
  cryptoCode: string
}

export class BitcoinService {
  private apiUrl: string

  constructor() {
    // Use mainnet or testnet based on environment
    this.apiUrl = process.env.NODE_ENV === 'production'
      ? 'https://mempool.space/api'
      : 'https://mempool.space/testnet/api'
  }

  // Validate Bitcoin address format
  validateAddress(address: string): boolean {
    // Basic Bitcoin address validation
    const patterns = [
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy P2PKH/P2SH
      /^bc1[a-z0-9]{39,59}$/, // Bech32 mainnet
      /^tb1[a-z0-9]{39,59}$/, // Bech32 testnet
    ]
    
    return patterns.some(pattern => pattern.test(address))
  }

  // Get address information and balance
  async getAddressInfo(address: string): Promise<AddressInfo> {
    try {
      const response = await fetch(`${this.apiUrl}/address/${address}`)
      if (!response.ok) throw new Error('Failed to fetch address info')
      
      const data = await response.json()
      
      return {
        address,
        balance: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
        txCount: data.chain_stats.tx_count,
        unconfirmedBalance: data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum
      }
    } catch (error) {
      console.error('Error fetching address info:', error)
      throw error
    }
  }

  // Check for new incoming transactions
  async getAddressTransactions(address: string, afterTxid?: string): Promise<BitcoinTransaction[]> {
    try {
      const response = await fetch(`${this.apiUrl}/address/${address}/txs`)
      if (!response.ok) throw new Error('Failed to fetch transactions')
      
      const txs = await response.json()
      
      // Filter to only incoming transactions
      const incomingTxs = txs
        .filter((tx: any) => {
          // Only transactions that send money TO our address
          return tx.vout.some((output: any) => 
            output.scriptpubkey_address === address
          )
        })
        .map((tx: any) => {
          // Calculate amount received to our address
          const receivedAmount = tx.vout
            .filter((output: any) => output.scriptpubkey_address === address)
            .reduce((sum: number, output: any) => sum + output.value, 0)

          return {
            txid: tx.txid,
            confirmations: tx.status.confirmed 
              ? (tx.status.block_height ? 1 : 0) 
              : 0,
            amount: receivedAmount,
            address,
            timestamp: tx.status.block_time || Math.floor(Date.now() / 1000),
            blockHeight: tx.status.block_height
          }
        })

      // If afterTxid provided, only return transactions after that one
      if (afterTxid) {
        const afterIndex = incomingTxs.findIndex((tx: any) => tx.txid === afterTxid)
        return afterIndex > 0 ? incomingTxs.slice(0, afterIndex) : []
      }

      return incomingTxs
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  }

  // Get current network fee estimates
  async getFeeEstimates(): Promise<FeeEstimate> {
    try {
      const response = await fetch(`${this.apiUrl}/v1/fees/recommended`)
      if (!response.ok) throw new Error('Failed to fetch fee estimates')
      
      const fees = await response.json()
      
      return {
        fastestFee: fees.fastestFee,
        halfHourFee: fees.halfHourFee,
        hourFee: fees.hourFee,
        economyFee: fees.economyFee,
        minimumFee: fees.minimumFee || 1
      }
    } catch (error) {
      console.error('Error fetching fees:', error)
      // Return conservative defaults
      return {
        fastestFee: 25,
        halfHourFee: 15,
        hourFee: 10,
        economyFee: 5,
        minimumFee: 1
      }
    }
  }

  // Check if transaction is confirmed
  async getTransactionStatus(txid: string): Promise<{
    confirmed: boolean
    confirmations: number
    blockHeight?: number
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/tx/${txid}`)
      if (!response.ok) throw new Error('Transaction not found')
      
      const tx = await response.json()
      
      return {
        confirmed: tx.status.confirmed,
        confirmations: tx.status.confirmed ? 1 : 0,
        blockHeight: tx.status.block_height
      }
    } catch (error) {
      console.error('Error checking transaction status:', error)
      return {
        confirmed: false,
        confirmations: 0
      }
    }
  }

  // Generate a deposit address (simplified - for production use HD wallets)
  generateDepositAddress(userIdentifier: string): string {
    // This is a MOCK implementation
    // In production, you'd generate proper HD wallet addresses
    console.warn('MOCK: Generate proper Bitcoin address for user:', userIdentifier)
    
    // Return a valid testnet address format for testing
    return process.env.NODE_ENV === 'production'
      ? 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4' // Mock mainnet address
      : 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx' // Mock testnet address
  }
}

export class BTCPayService {
  private baseUrl: string
  private apiKey: string
  private storeId: string

  constructor() {
    this.baseUrl = process.env.BTCPAY_SERVER_URL || ''
    this.apiKey = process.env.BTCPAY_API_KEY || ''
    this.storeId = process.env.BTCPAY_STORE_ID || ''
    
    if (!this.baseUrl || !this.apiKey || !this.storeId) {
      console.warn('BTCPay Server environment variables not configured')
    }
  }

  private getHeaders() {
    return {
      'Authorization': `token ${this.apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  // Create a new invoice for Bitcoin payment
  async createInvoice(amount: number, orderId: string, buyerEmail?: string): Promise<BTCPayInvoice> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/stores/${this.storeId}/invoices`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: satoshisToBTC(amount).toString(),
          currency: 'BTC',
          metadata: {
            orderId,
            buyerEmail: buyerEmail || `user@bitcointiger.io`,
            buyerName: 'Bitcoin Tiger User'
          },
          checkout: {
            speedPolicy: 'MediumSpeed', // Wait for 1 confirmation
            paymentMethods: ['BTC'],
            expirationMinutes: 60,
            monitoringMinutes: 1440, // 24 hours
            paymentTolerance: 0,
            redirectURL: process.env.NEXT_PUBLIC_BASE_URL,
            redirectAutomatically: false,
            requiresRefundEmail: false,
            checkoutType: 'V1'
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`BTCPay API error: ${response.status} - ${errorText}`)
      }

      const invoice = await response.json()
      return invoice
    } catch (error) {
      console.error('Error creating BTCPay invoice:', error)
      throw error
    }
  }

  // Get invoice status and payment details
  async getInvoice(invoiceId: string): Promise<BTCPayInvoice> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/stores/${this.storeId}/invoices/${invoiceId}`, {
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching BTCPay invoice:', error)
      throw error
    }
  }

  // Get payment methods for an invoice (includes Bitcoin address)
  async getPaymentMethods(invoiceId: string): Promise<BTCPayPaymentMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/stores/${this.storeId}/invoices/${invoiceId}/payment-methods`, {
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch payment methods: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      throw error
    }
  }

  // Check if invoice is paid and confirmed
  async isInvoicePaid(invoiceId: string): Promise<{
    paid: boolean
    confirmed: boolean
    status: string
    amountPaid?: number
  }> {
    try {
      const invoice = await this.getInvoice(invoiceId)
      
      const paid = invoice.status === 'Processing' || invoice.status === 'Settled'
      const confirmed = invoice.status === 'Settled'
      
      // Get payment amount if paid
      let amountPaid = 0
      if (paid) {
        const paymentMethods = await this.getPaymentMethods(invoiceId)
        const btcMethod = paymentMethods.find(pm => pm.cryptoCode === 'BTC')
        if (btcMethod && btcMethod.totalPaid) {
          amountPaid = btcToSatoshis(parseFloat(btcMethod.totalPaid))
        }
      }

      return {
        paid,
        confirmed,
        status: invoice.status,
        amountPaid: paid ? amountPaid : undefined
      }
    } catch (error) {
      console.error('Error checking invoice payment status:', error)
      return {
        paid: false,
        confirmed: false,
        status: 'Error'
      }
    }
  }

  // Validate if BTCPay Server is properly configured
  async validateConfiguration(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/stores/${this.storeId}`, {
        headers: this.getHeaders()
      })
      return response.ok
    } catch (error) {
      console.error('BTCPay Server configuration invalid:', error)
      return false
    }
  }
}

// Helper functions
export function satoshisToBTC(satoshis: number): number {
  return satoshis / 100000000
}

export function btcToSatoshis(btc: number): number {
  return Math.round(btc * 100000000)
}

export function formatBitcoinAmount(satoshis: number): string {
  if (satoshis >= 100000000) {
    return `₿${satoshisToBTC(satoshis).toFixed(8)}`
  }
  return `${satoshis.toLocaleString()} sats`
}

// Export singleton instance
export const bitcoinService = new BitcoinService()
export const btcPayService = new BTCPayService() 