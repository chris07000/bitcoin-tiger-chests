'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useWallet } from './WalletContext'

interface BalanceContextType {
  balance: string
  updateBalance: (newBalance: string) => void
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

export function BalanceProvider({ children }: { children: ReactNode }) {
  const { walletAddress, refreshBalance } = useWallet()
  const [balance, setBalance] = useState('0')

  // Update balance when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      refreshBalance()
    }
  }, [walletAddress, refreshBalance])

  const updateBalance = (newBalance: string) => {
    setBalance(newBalance)
    // Update the balance in the wallet context
    refreshBalance()
  }

  return (
    <BalanceContext.Provider value={{ balance, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance() {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider')
  }
  return context
} 