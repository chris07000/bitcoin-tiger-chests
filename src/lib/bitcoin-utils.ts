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