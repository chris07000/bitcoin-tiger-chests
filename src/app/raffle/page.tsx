'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'

export default function RafflePage() {
  const [ticketAmount, setTicketAmount] = useState<number>(1)
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(null)
  const [message, setMessage] = useState<string>('')
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [userTickets, setUserTickets] = useState<{[key: number]: number}>({})
  const [raffles, setRaffles] = useState<Array<{
    id: number,
    name: string,
    description: string,
    image: string,
    ticketPrice: number,
    totalTickets: number,
    soldTickets: number,
    endsAt: Date,
    winner: string | null,
    winnerPickedAt?: Date | null,
    isFree: boolean,
    pointCost: number,
    floorPrice?: number
  }>>([])
  const [filteredRaffles, setFilteredRaffles] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<string>('active') // Gewijzigd van 'all' naar 'active'
  const [categoryFilter, setcategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('end_time') // 'end_time', 'price_low', 'price_high'
  const [refreshingBalance, setRefreshingBalance] = useState<boolean>(false)
  const { balance, setBalance, fetchBalance, walletAddress: contextWalletAddress } = useLightning()
  // Ref voor de timer
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  // State voor de huidige tijd, gebruikt om de timers te forceren om bij te werken
  const [currentTime, setCurrentTime] = useState<number>(Date.now())

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmModalData, setConfirmModalData] = useState<{
    raffleId: number;
    raffleName: string;
    ticketAmount: number;
    ticketPrice: number;
    totalCost: number;
  } | null>(null)

  // Tiger Points state
  const [userPoints, setUserPoints] = useState<number>(0)
  const [refreshingPoints, setRefreshingPoints] = useState(false)

  // BTC Price for USD conversion  
  const [btcPrice, setBtcPrice] = useState<number>(60000) // Default $60k, can be updated from API
  const [refreshingBtcPrice, setRefreshingBtcPrice] = useState(false)

  useEffect(() => {
    // Use wallet address from LightningContext or localStorage as fallback
    const storedWallet = contextWalletAddress || localStorage.getItem('walletAddress')
    if (storedWallet) {
      setWalletAddress(storedWallet)
      
      // No need to fetch balance here since LightningContext handles it
      console.log('Raffle: Using wallet from context:', storedWallet, 'Balance:', balance)
    }

    // Fetch raffle data from API
    const fetchRaffles = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/raffle/list?status=all')
        if (response.ok) {
          const data = await response.json()
          if (data.raffles && data.raffles.length > 0) {
            console.log('Loaded raffles from API:', data.raffles.length);
            setRaffles(data.raffles)
            // Pas direct de filtering toe
            filterAndSortRaffles(data.raffles, statusFilter, categoryFilter, sortBy)
          } else {
            console.log('No raffles found in API');
            setRaffles([])
            setFilteredRaffles([])
          }
        } else {
          console.error('Failed to load raffles:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching raffles:', error)
      } finally {
        setLoading(false)
      }
    }

    // Fetch user tickets
    const fetchUserTickets = async () => {
      if (!walletAddress) return

      try {
        const response = await fetch(`/api/raffle/tickets?address=${walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setUserTickets(data.tickets || {})
        }
      } catch (error) {
        console.error('Error fetching user tickets:', error)
      }
    }

    // Fetch user points
    const fetchUserPoints = async () => {
      if (!walletAddress) return

      try {
        const response = await fetch(`/api/points/${walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setUserPoints(data.points || 0)
        }
      } catch (error) {
        console.error('Error fetching user points:', error)
      }
    }

    // Start timer die elke seconde de huidige tijd bijwerkt
    timerRef.current = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000); // Elke seconde bijwerken

    fetchRaffles()
    if (walletAddress) {
      fetchUserTickets()
      fetchUserPoints()
    }

    // Cleanup functie om de timer te stoppen wanneer de component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [walletAddress])

  // Effect voor het bijwerken van de timer
  useEffect(() => {
    // Geen specifieke actie nodig, de currentTime update zal de herrendering triggeren
    // en alle tijden zullen worden bijgewerkt omdat ze opnieuw worden berekend
    console.log("Updating raffle timers:", new Date().toLocaleTimeString());
  }, [currentTime])

  // Update filteredRaffles wanneer filters veranderen
  useEffect(() => {
    filterAndSortRaffles(raffles, statusFilter, categoryFilter, sortBy)
  }, [raffles, statusFilter, categoryFilter, sortBy])

  // Zorg ervoor dat bij eerste load altijd de actieve raffles worden getoond
  useEffect(() => {
    if (raffles.length > 0) {
      // Forceer de active filter bij het laden van de pagina
      setStatusFilter('active')
      filterAndSortRaffles(raffles, 'active', categoryFilter, sortBy)
    }
  }, [raffles.length]) // Alleen uitvoeren wanneer de raffles zijn geladen

  // Effect voor Bitcoin price updates - onafhankelijk systeem dat elke minuut de API raadpleegt
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        console.log('Raffle: Fetching fresh BTC price from API...');
        const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
        const data = await response.json();
        const price = parseFloat(data.data.amount);
        
        if (!isNaN(price) && price > 0) {
          setBtcPrice(price);
          localStorage.setItem('btcPrice', price.toString());
          (window as any).currentBtcPrice = price;
          console.log('Raffle: Updated BTC price to $' + price.toLocaleString());
        }
      } catch (error) {
        console.error('Raffle: Error fetching BTC price:', error);
        // Fallback to localStorage if API fails
        const storedPrice = localStorage.getItem('btcPrice');
        if (storedPrice) {
          const price = parseFloat(storedPrice);
          if (!isNaN(price) && price > 0) {
            setBtcPrice(price);
            console.log('Raffle: Using stored BTC price $' + price.toLocaleString());
          }
        }
      }
    }

    // Haal BTC prijs direct op bij component mount
    fetchBtcPrice()

    // Update elke minuut (60000ms) voor actuele prijs
    const priceInterval = setInterval(fetchBtcPrice, 60000)

    return () => clearInterval(priceInterval)
  }, [])

  // Functie om raffles te filteren en sorteren
  const filterAndSortRaffles = (
    raffleList: Array<any>,
    status: string,
    category: string,
    sortOrder: string
  ) => {
    // Filter op status (actief/beëindigd)
    let filtered = [...raffleList]
    const now = new Date()

    if (status === 'active') {
      filtered = filtered.filter(raffle => {
        const endDate = new Date(raffle.endsAt)
        return endDate > now && !raffle.winner
      })
    } else if (status === 'ended') {
      filtered = filtered.filter(raffle => {
        const endDate = new Date(raffle.endsAt)
        return endDate <= now || raffle.winner
      })
    }

    // Sorteren op gekozen criterium
    filtered.sort((a, b) => {
      if (sortOrder === 'end_time') {
        return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
      } else if (sortOrder === 'price_low') {
        return a.ticketPrice - b.ticketPrice
      } else if (sortOrder === 'price_high') {
        return b.ticketPrice - a.ticketPrice
      } else if (sortOrder === 'popularity') {
        const aPercentage = (a.soldTickets / a.totalTickets) * 100
        const bPercentage = (b.soldTickets / b.totalTickets) * 100
        return bPercentage - aPercentage
      }
      return 0
    })

    setFilteredRaffles(filtered)
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  // New function for direct purchase from Enter button
  const handleDirectPurchase = async (raffleId: number, defaultTicketAmount: number = 1) => {
    if (!raffleId || defaultTicketAmount <= 0 || !walletAddress) {
      setMessage('Please check your wallet connection and try again')
      return
    }

    const raffle = raffles.find(r => r.id === raffleId)
    if (!raffle) {
      setMessage('Raffle not found')
      return
    }

    // Check if user has sufficient balance/points
    if (raffle.isFree) {
      const pointCost = raffle.pointCost * defaultTicketAmount
      if (pointCost > userPoints) {
        setMessage('Insufficient Tiger Points')
        return
      }
    } else {
      const totalCost = raffle.ticketPrice * defaultTicketAmount
      if (totalCost > balance) {
        setMessage('Insufficient balance')
        return
      }
    }

    // Show confirmation modal
    setConfirmModalData({
      raffleId,
      raffleName: raffle.name,
      ticketAmount: defaultTicketAmount,
      ticketPrice: raffle.isFree ? 0 : raffle.ticketPrice,
      totalCost: raffle.isFree ? raffle.pointCost * defaultTicketAmount : raffle.ticketPrice * defaultTicketAmount
    })
    setShowConfirmModal(true)
  }

  // Function to actually purchase after confirmation
  const handleConfirmedPurchase = async () => {
    if (!confirmModalData || !walletAddress) {
      setMessage('Error: Missing purchase data')
      setShowConfirmModal(false)
      return
    }

    const { raffleId, ticketAmount: purchaseAmount } = confirmModalData
    
    // Set the selected raffle for visual feedback
    setSelectedRaffle(raffleId)
    setTicketAmount(purchaseAmount)

    // Reset message and close modal
    setMessage('')
    setShowConfirmModal(false)
    
    try {
      // Subtract cost from balance immediately for better UX
      const newBalance = balance - confirmModalData.totalCost
      setBalance(newBalance)
      
      // Update also in localStorage
      const lightningBalances = JSON.parse(localStorage.getItem('lightningBalances') || '{}')
      lightningBalances[walletAddress] = newBalance
      localStorage.setItem('lightningBalances', JSON.stringify(lightningBalances))
      
      // Set a timestamp for when we last updated the balance
      localStorage.setItem('lastBalanceFetch', Date.now().toString())

      // Make API call to purchase tickets
      const response = await fetch('/api/raffle/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          raffleId,
          ticketAmount: purchaseAmount
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Restore balance on error
        setBalance(balance)
        lightningBalances[walletAddress] = balance
        localStorage.setItem('lightningBalances', JSON.stringify(lightningBalances))
        
        throw new Error(data.error || 'Purchase failed')
      }

      // Refresh balance to get latest from server
      await fetchBalance()
      
      // Update points based on API response
      if (data.newPointsBalance !== undefined) {
        setUserPoints(data.newPointsBalance)
      } else {
        // Fallback: refresh points from server
        if (walletAddress) {
          const pointsResponse = await fetch(`/api/points/${walletAddress}`)
          if (pointsResponse.ok) {
            const pointsData = await pointsResponse.json()
            setUserPoints(pointsData.points || 0)
          }
        }
      }
      
      // Update local state with new tickets
      const updatedRaffles = raffles.map(raffle => {
        if (raffle.id === raffleId) {
          return {
            ...raffle,
            soldTickets: raffle.soldTickets + purchaseAmount
          }
        }
        return raffle
      })
      setRaffles(updatedRaffles)
      
      // Update user tickets
      setUserTickets(prev => ({
        ...prev,
        [raffleId]: (prev[raffleId] || 0) + purchaseAmount
      }))
      
      // Show success message with points info
      const pointsEarned = data.pointsEarned || 0
      const pointsSpent = data.pointsSpent || 0
      let pointsMessage = ''
      
      if (pointsSpent > 0) {
        pointsMessage = ` -${pointsSpent} Tiger Points spent!`
      } else if (pointsEarned > 0) {
        pointsMessage = ` +${pointsEarned} Tiger Points earned!`
      }
      
      setMessage(`Successfully purchased ${purchaseAmount} ticket${purchaseAmount > 1 ? 's' : ''}!${pointsMessage}`)
      
      // Reset selection after successful purchase
      setTimeout(() => {
        setSelectedRaffle(null)
        setTicketAmount(1)
      }, 2000)
    } catch (err: any) {
      setMessage(err.message || 'An error occurred')
      // Reset selection on error
      setSelectedRaffle(null)
      setTicketAmount(1)
    }
  }

  const handlePurchase = async () => {
    if (!selectedRaffle || ticketAmount <= 0 || !walletAddress) {
      setMessage('Please select a raffle and enter a valid ticket amount')
      return
    }

    const raffle = raffles.find(r => r.id === selectedRaffle)
    if (!raffle) {
      setMessage('Invalid raffle selection')
      return
    }

    const totalCost = raffle.ticketPrice * ticketAmount
    if (totalCost > balance) {
      setMessage('Insufficient balance')
      return
    }

    // Reset message
    setMessage('')
    
    try {
      // Subtract cost from balance immediately for better UX
      const newBalance = balance - totalCost
      setBalance(newBalance)
      
      // Update the global balance in the Lightning context
      setBalance(newBalance)
      
      // Update also in localStorage
      const lightningBalances = JSON.parse(localStorage.getItem('lightningBalances') || '{}')
      lightningBalances[walletAddress] = newBalance
      localStorage.setItem('lightningBalances', JSON.stringify(lightningBalances))
      
      // Set a timestamp for when we last updated the balance
      localStorage.setItem('lastBalanceFetch', Date.now().toString())

      // Make API call to purchase tickets
      const response = await fetch('/api/raffle/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          raffleId: selectedRaffle,
          ticketAmount
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        // Reverse the balance change if there's an error
        setBalance(balance)
        
        // Also update localStorage to revert the balance
        lightningBalances[walletAddress] = balance
        localStorage.setItem('lightningBalances', JSON.stringify(lightningBalances))
        
        throw new Error(error.error || 'Failed to purchase tickets')
      }

      const data = await response.json()
      
      // Gebruik de nieuwe balans die door de server is teruggestuurd
      if (data.newBalance !== undefined) {
        // Update de balans met de waarde van de server
        const serverBalance = data.newBalance
        setBalance(serverBalance)
        
        // Update localStorage met de nieuwe balans van de server
        lightningBalances[walletAddress] = serverBalance
        localStorage.setItem('lightningBalances', JSON.stringify(lightningBalances))
      }
      
      // Update local state with new tickets
      const updatedRaffles = raffles.map(raffle => {
        if (raffle.id === selectedRaffle) {
          return {
            ...raffle,
            soldTickets: raffle.soldTickets + ticketAmount
          }
        }
        return raffle
      })
      setRaffles(updatedRaffles)
      
      // Update user tickets
      setUserTickets(prev => ({
        ...prev,
        [selectedRaffle]: (prev[selectedRaffle] || 0) + ticketAmount
      }))
      
      // Show success message
      setMessage(`Successfully purchased ${ticketAmount} ticket${ticketAmount > 1 ? 's' : ''}!`)
      
      // Reset ticket amount
      setTicketAmount(1)
    } catch (err: any) {
      setMessage(err.message || 'An error occurred')
    }
  }

  const formatTimeLeft = (endDate: Date | string) => {
    // Gebruik de currentTime state in plaats van een nieuwe Date object te maken
    const now = new Date(currentTime);
    // Zorg ervoor dat endDate altijd een Date object is
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    // Check of de datum geldig is
    if (isNaN(end.getTime())) {
      console.error('Invalid date format:', endDate);
      return 'Invalid date';
    }
    
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Voeg seconden toe voor meer nauwkeurigheid
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }

  const getProgressPercentage = (raffle: typeof raffles[0]) => {
    return (raffle.soldTickets / raffle.totalTickets) * 100
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Functie om balans handmatig te verversen
  const refreshBalance = async () => {
    if (!walletAddress || refreshingBalance) return;
    
    setRefreshingBalance(true);
    try {
      const newBalance = await fetchBalance();
      if (newBalance !== undefined) {
        setBalance(newBalance);
        
        // Update ook in localStorage
        const lightningBalances = JSON.parse(localStorage.getItem('lightningBalances') || '{}');
        lightningBalances[walletAddress] = newBalance;
        localStorage.setItem('lightningBalances', JSON.stringify(lightningBalances));
        
        // Timestamp bijwerken
        localStorage.setItem('lastBalanceFetch', Date.now().toString());
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setRefreshingBalance(false);
    }
  };

  // Functie om points handmatig te verversen
  const refreshPoints = async () => {
    if (!walletAddress || refreshingPoints) return;
    
    setRefreshingPoints(true);
    try {
      const response = await fetch(`/api/points/${walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setUserPoints(data.points || 0)
      }
    } catch (error) {
      console.error('Error refreshing points:', error);
    } finally {
      setRefreshingPoints(false);
    }
  };

  // Functie om BTC prijs handmatig te verversen
  const refreshBtcPrice = async () => {
    if (refreshingBtcPrice) return;
    
    setRefreshingBtcPrice(true);
    try {
      console.log('Raffle: Manually refreshing BTC price...');
      const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
      const data = await response.json();
      const price = parseFloat(data.data.amount);
      
      if (!isNaN(price) && price > 0) {
        setBtcPrice(price);
        localStorage.setItem('btcPrice', price.toString());
        (window as any).currentBtcPrice = price;
        console.log('Raffle: Updated BTC price to:', price);
      }
    } catch (error) {
      console.error('Error refreshing BTC price:', error);
    } finally {
      setRefreshingBtcPrice(false);
    }
  };

  // Keyboard handling for confirmation modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmModal) {
        if (e.key === 'Escape') {
          setShowConfirmModal(false)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          handleConfirmedPurchase()
        }
      }
    }

    if (showConfirmModal) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore body scroll
      document.body.style.overflow = 'unset'
    }
  }, [showConfirmModal, handleConfirmedPurchase])

  return (
    <>
      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          background: #0A0A0B;
          color: #FFFFFF;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .page-content {
          min-height: 100vh;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          color: #FFFFFF;
          padding: 2rem 1rem;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        
        .subtitle {
          font-size: 1.125rem;
          color: #94A3B8;
          margin-bottom: 2rem;
          font-weight: 400;
          line-height: 1.6;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 107, 0, 0.15);
          border-radius: 12px;
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          gap: 3rem;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent);
        }
        
        .stat-card:hover {
          border-color: rgba(255, 107, 0, 0.3);
          background: rgba(255, 107, 0, 0.05);
          transform: translateY(-1px);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 0;
        }
        
        .stat-icon {
          font-size: 1.75rem;
          filter: drop-shadow(0 0 8px rgba(255, 107, 0, 0.3));
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #94A3B8;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FF6B00;
          letter-spacing: -0.01em;
        }
        
        .refresh-button {
          background: rgba(255, 107, 0, 0.1);
          border: 1px solid rgba(255, 107, 0, 0.2);
          border-radius: 8px;
          color: #FF6B00;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1rem;
        }
        
        .refresh-button:hover:not(:disabled) {
          background: rgba(255, 107, 0, 0.15);
          border-color: rgba(255, 107, 0, 0.4);
          transform: scale(1.05);
        }
        
        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .rotating {
          animation: rotate 1s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .message {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin: 0 auto 2rem;
          color: #22C55E;
          text-align: center;
          max-width: 500px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .controls-section {
          max-width: 1400px;
          margin: 0 auto 3rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }

        .filter-tabs {
          display: flex;
          gap: 0;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .filter-tab {
          background: transparent;
          border: none;
          color: #94A3B8;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          position: relative;
        }
        
        .filter-tab:hover:not(.active) {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
        }
        
        .filter-tab.active {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.25);
        }

        .sort-controls {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .sort-button {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #94A3B8;
          padding: 0.75rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        
        .sort-button:hover:not(.active) {
          border-color: rgba(255, 107, 0, 0.2);
          background: rgba(255, 107, 0, 0.04);
          color: #FFFFFF;
        }

        .sort-button.active {
          background: rgba(255, 107, 0, 0.1);
          border-color: rgba(255, 107, 0, 0.3);
          color: #FF6B00;
        }

        .raffles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 280px));
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          justify-content: start;
        }
        
        .raffle-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          min-width: 200px;
          max-width: 280px;
          margin: 0 auto;
        }
        
        .raffle-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        }
        
        .raffle-card:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: rgba(255, 107, 0, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 107, 0, 0.1);
        }
        
        .raffle-image-container {
          position: relative;
          width: 100%;
          height: 180px;
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.03) 0%, rgba(255, 184, 0, 0.03) 100%);
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .raffle-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }
        
        .raffle-card:hover .raffle-image {
          transform: scale(1.05);
        }

        .raffle-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .raffle-header {
          margin-bottom: 1rem;
        }
        
        .raffle-name {
          font-size: 1rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        
        .raffle-description {
          font-size: 0.875rem;
          color: #94A3B8;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .raffle-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .price-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #FF6B00;
          font-weight: 700;
          font-size: 0.9rem;
        }
        
        .price-display .icon {
          font-size: 1rem;
          filter: drop-shadow(0 0 6px rgba(255, 107, 0, 0.3));
        }
        
        .time-display {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #94A3B8;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .progress-section {
          margin-bottom: 1rem;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          position: relative;
        }
        
        .progress-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border-radius: 4px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF6B00 0%, #FFB800 100%);
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 0 12px rgba(255, 107, 0, 0.3);
        }
        
        .progress-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #94A3B8;
          font-weight: 500;
        }

        .raffle-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-top: auto;
        }
        
        .ticket-controls {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
        }
        
        .ticket-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          font-size: 1rem;
        }
        
        .ticket-btn:hover:not(:disabled) {
          background: rgba(255, 107, 0, 0.1);
          color: #FF6B00;
        }
        
        .ticket-input {
          width: 60px;
          background: transparent;
          border: none;
          color: #FFFFFF;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0;
          height: 36px;
        }
        
        .ticket-input:focus {
          outline: none;
        }
        
        .enter-button {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          border: none;
          color: #FFFFFF;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .enter-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .enter-button:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .enter-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255, 107, 0, 0.3);
        }
        
        .enter-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
        }
        
        .badge-ended {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }
        
        .badge-winner {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
        
        .badge-you-won {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: #FFFFFF;
          border: none;
          animation: pulse-glow 2s infinite;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3), 0 0 0 0 rgba(255, 107, 0, 0.4);
          }
          50% { 
            box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3), 0 0 0 8px rgba(255, 107, 0, 0);
          }
        }

        .user-tickets-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 107, 0, 0.9);
          color: #FFFFFF;
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
        }

        .winner-section {
          padding: 1.25rem;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.15);
          border-radius: 12px;
          margin-top: 1rem;
          backdrop-filter: blur(10px);
        }
        
        .winner-section.user-won {
          background: rgba(255, 107, 0, 0.05);
          border-color: rgba(255, 107, 0, 0.15);
        }
        
        .winner-label {
          font-size: 0.85rem;
          color: #94A3B8;
          margin-bottom: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .winner-address {
          font-weight: 700;
          color: #22C55E;
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }
        
        .winner-address.user-won {
          color: #FF6B00;
        }

        .loading-state {
          text-align: center;
          padding: 6rem 2rem;
          color: #94A3B8;
        }
        
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 107, 0, 0.1);
          border-top: 3px solid #FF6B00;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 6rem 2rem;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          opacity: 0.2;
          filter: grayscale(1);
        }
        
        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #94A3B8;
          margin-bottom: 0.75rem;
        }
        
        .empty-description {
          color: #64748B;
          font-size: 1rem;
          line-height: 1.6;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .confirmation-modal {
          background: rgba(26, 26, 27, 0.95);
          border: 1px solid rgba(255, 107, 0, 0.15);
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
        }
        
        .modal-header {
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        
        .modal-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          transform: scale(1.05);
        }
        
        .modal-body {
          padding: 1.5rem 2rem;
        }
        
        .raffle-info h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 1.5rem 0;
          text-align: center;
          letter-spacing: -0.01em;
        }
        
        .purchase-details, .balance-check {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }
        
        .detail-row:last-child {
          margin-bottom: 0;
        }
        
        .detail-row span:first-child {
          color: #94A3B8;
          font-weight: 500;
        }
        
        .detail-row span:last-child {
          color: #FFFFFF;
          font-weight: 700;
        }
        
        .total-row {
          border-top: 1px solid rgba(255, 107, 0, 0.15);
          padding-top: 0.75rem;
          margin-top: 0.75rem;
        }
        
        .total-row span {
          color: #FF6B00;
          font-size: 1.1rem;
          font-weight: 800;
        }
        
        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 0 2rem 2rem;
        }
        
        .cancel-button, .confirm-button {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
        }
        
        .cancel-button {
          background: rgba(255, 255, 255, 0.05);
          color: #94A3B8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          transform: translateY(-1px);
        }
        
        .confirm-button {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.25);
        }
        
        .confirm-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 0, 0.4);
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
          }
          
          .stats-bar {
            max-width: 100%;
            padding: 0 0.5rem;
          }
          
          .stat-card {
            padding: 1rem 1.5rem;
            gap: 2rem;
          }
          
          .stat-item {
            justify-content: center;
            min-width: auto;
            flex: 1;
          }
          
          .stat-icon {
            font-size: 1.25rem;
          }
          
          .stat-content {
            text-align: center;
          }
          
          .stat-label {
            font-size: 0.75rem;
          }
          
          .stat-value {
            font-size: 1rem;
          }
          
          .refresh-button {
            width: 28px;
            height: 28px;
            font-size: 0.9rem;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .filter-tabs {
            justify-content: center;
          }
          
          .raffles-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .modal-header {
            padding: 1.5rem 1.5rem 1rem;
          }
          
          .modal-body {
            padding: 1rem 1.5rem;
          }
          
          .modal-actions {
            padding: 0 1.5rem 1.5rem;
          }
        }

        /* Hot Raffles Table Section */
        .hot-raffles-section {
          max-width: 1400px;
          margin: 0 auto 4rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .hot-raffles-header {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hot-raffles-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .hot-raffles-tagline {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .hot-raffles-table {
          width: 100%;
          border-collapse: collapse;
          background: transparent;
        }

        .table-header {
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .table-header th {
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.8rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .table-header th:last-child {
          border-right: none;
        }

        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .table-row:hover {
          background: rgba(255, 107, 0, 0.02);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-cell {
          padding: 1.25rem 1.5rem;
          font-size: 0.9rem;
          color: #FFFFFF;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
        }

        .table-cell:last-child {
          border-right: none;
        }

        .rank-cell {
          font-weight: 800;
          color: #FF6B00;
          font-size: 1rem;
        }

        .raffle-info-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .raffle-avatar {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(255, 107, 0, 0.2);
          flex-shrink: 0;
        }

        .raffle-avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .raffle-id {
          font-family: 'Courier New', monospace;
          color: #94A3B8;
          font-size: 0.85rem;
        }

        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-active {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .tickets-sold {
          font-weight: 700;
          color: #FF6B00;
        }

        .price-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .price-icon {
          font-size: 0.9rem;
        }

        .value-cell {
          font-weight: 700;
          color: #22C55E;
        }

        .countdown-cell {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #FFB800;
        }

        .status-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          min-width: 60px;
        }

        .progress-bar-small {
          width: 50px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill-small {
          height: 100%;
          background: linear-gradient(90deg, #FF6B00 0%, #FFB800 100%);
          border-radius: 3px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 4px rgba(255, 107, 0, 0.3);
        }

        .progress-text-small {
          font-size: 0.75rem;
          font-weight: 600;
          color: #FF6B00;
        }

        /* Section Divider */
        .section-divider {
          max-width: 1400px;
          margin: 4rem auto;
          text-align: center;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent);
          margin: 2rem 0;
        }

        .ending-soon-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .ending-soon-subtitle {
          color: #94A3B8;
          font-size: 1rem;
        }

        /* Mobile HOT RAFFLES - Make table scrollable and adjust sizing */
        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
          }
          
          .stats-bar {
            max-width: 100%;
            padding: 0 0.5rem;
            margin-bottom: 2rem;
          }
          
          .stat-card {
            padding: 1rem;
            gap: 1.5rem;
            flex-direction: column;
            align-items: stretch;
          }
          
          .stat-item {
            justify-content: space-between;
            min-width: auto;
            flex: 1;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .stat-icon {
            font-size: 1.5rem;
          }
          
          .stat-content {
            text-align: left;
            flex: 1;
          }
          
          .stat-label {
            font-size: 0.8rem;
          }
          
          .stat-value {
            font-size: 1.1rem;
          }
          
          .refresh-button {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
          }
          
          .hot-raffles-section {
            margin: 0 auto 2rem;
          }
          
          .hot-raffles-header {
            padding: 1rem;
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .hot-raffles-title {
            font-size: 1.25rem;
          }
          
          .hot-raffles-tagline {
            font-size: 0.8rem;
          }
          
          /* Hide the table and show card layout instead */
          .hot-raffles-table-container {
            display: none;
          }
          
          /* Mobile card layout for hot raffles */
          .mobile-hot-raffles {
            display: block;
            padding: 1rem;
          }
          
          .mobile-raffle-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .mobile-raffle-card:hover {
            background: rgba(255, 107, 0, 0.02);
            border-color: rgba(255, 107, 0, 0.15);
          }
          
          .mobile-raffle-card:last-child {
            margin-bottom: 0;
          }
          
          .mobile-card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }
          
          .mobile-card-rank {
            background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
            color: #FFFFFF;
            font-weight: 800;
            font-size: 0.9rem;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            min-width: 2rem;
            text-align: center;
          }
          
          .mobile-card-avatar {
            width: 40px;
            height: 40px;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid rgba(255, 107, 0, 0.2);
            flex-shrink: 0;
          }
          
          .mobile-card-info {
            flex: 1;
            min-width: 0;
          }
          
          .mobile-card-name {
            font-weight: 600;
            color: #FFFFFF;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
            line-height: 1.2;
          }
          
          .mobile-card-id {
            font-family: 'Courier New', monospace;
            color: #94A3B8;
            font-size: 0.75rem;
          }
          
          .mobile-card-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }
          
          .mobile-stat-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 0.75rem;
            text-align: center;
          }
          
          .mobile-stat-label {
            font-size: 0.65rem;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.25rem;
            font-weight: 600;
          }
          
          .mobile-stat-value {
            font-size: 0.8rem;
            color: #FFFFFF;
            font-weight: 600;
          }
          
          .mobile-stat-value.price {
            color: #FF6B00;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
          }
          
          .mobile-stat-value.sold {
            color: #FF6B00;
          }
          
          .mobile-stat-value.value {
            color: #22C55E;
          }
          
          .mobile-stat-value.countdown {
            color: #FFB800;
            font-family: 'Courier New', monospace;
          }
          
          .mobile-progress-section {
            margin: 0.75rem 0;
          }
          
          .mobile-progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 0.5rem;
          }
          
          .mobile-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #FF6B00 0%, #FFB800 100%);
            border-radius: 2px;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 4px rgba(255, 107, 0, 0.3);
          }
          
          .mobile-progress-text {
            text-align: center;
            font-size: 0.7rem;
            color: #FF6B00;
            font-weight: 600;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .filter-tabs {
            justify-content: center;
          }
          
          .raffles-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .modal-header {
            padding: 1.5rem 1.5rem 1rem;
          }
          
          .modal-body {
            padding: 1rem 1.5rem;
          }
          
          .modal-actions {
            padding: 0 1.5rem 1.5rem;
          }
        }
        
        /* Desktop: Show table, hide mobile cards */
        @media (min-width: 769px) {
          .mobile-hot-raffles {
            display: none;
          }
        }
      `}</style>

      <div className="page-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="title">Bitcoin Tiger Raffles</h1>
          <p className="subtitle">
            Participate in exclusive raffles to win rare Bitcoin Tiger ordinals. 
            Use Lightning sats or earn entries with Tiger Points.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-label">Lightning Balance</div>
                <div className="stat-value">{balance.toLocaleString()} sats</div>
              </div>
              <button 
                className="refresh-button"
                onClick={refreshBalance}
                disabled={refreshingBalance}
                title="Refresh balance"
              >
                <div className={`refresh-icon ${refreshingBalance ? 'rotating' : ''}`}>
                  ↻
                </div>
              </button>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <Image 
                  src="/tiger-logo.png" 
                  alt="Tiger" 
                  width={56} 
                  height={56} 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255, 107, 0, 0.3))' }}
                />
              </div>
              <div className="stat-content">
                <div className="stat-label">Tiger Points</div>
                <div className="stat-value">{userPoints.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">₿</div>
              <div className="stat-content">
                <div className="stat-label">BTC Price</div>
                <div className="stat-value">${btcPrice.toLocaleString()}</div>
              </div>
              <button 
                className="refresh-button"
                onClick={refreshBtcPrice}
                disabled={refreshingBtcPrice}
                title="Refresh BTC price"
              >
                <div className={`refresh-icon ${refreshingBtcPrice ? 'rotating' : ''}`}>
                  ↻
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {message && <div className="message">{message}</div>}
        
        {/* Hot Raffles Section */}
        <div className="hot-raffles-section">
          <div className="hot-raffles-header">
            <h2 className="hot-raffles-title">HOT RAFFLES</h2>
            <div className="hot-raffles-tagline">PEER TO PEER, LUCK TO LUCK.</div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <div>Loading hot raffles...</div>
            </div>
          ) : filteredRaffles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔥</div>
              <div className="empty-title">No hot raffles</div>
              <div className="empty-description">
                Check back soon for exciting new raffles!
              </div>
            </div>
          ) : (
            <>
              <div className="hot-raffles-table-container">
                <table className="hot-raffles-table">
                  <thead className="table-header">
                    <tr>
                      <th>RANK</th>
                      <th>RAFFLE</th>
                      <th>RAFFLE ID</th>
                      <th>STATUS</th>
                      <th>TICKETS SOLD</th>
                      <th>TICKET PRICE</th>
                      <th>VALUE</th>
                      <th>FINISHES IN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRaffles.slice(0, 5).map((raffle, index) => {
                      const isActive = new Date(raffle.endsAt) > new Date() && !raffle.winner
                      const progressPercentage = (raffle.soldTickets / raffle.totalTickets) * 100
                      const estimatedValue = raffle.ticketPrice * raffle.totalTickets
                      
                      // Calculate realistic Tiger NFT value based on raffle's floor price
                      const getTigerValue = () => {
                        // Use the raffle's floor price if available, otherwise fallback to $300
                        return raffle.floorPrice ? raffle.floorPrice.toString() : "300"
                      }

                      // Convert sats to USD
                      const satsToDollars = (sats: number) => {
                        const btcAmount = sats / 100000000 // Convert sats to BTC
                        const usdAmount = btcAmount * btcPrice
                        return usdAmount.toFixed(2)
                      }
                      
                      return (
                        <tr key={raffle.id} className="table-row">
                          <td className="table-cell rank-cell">
                            #{index + 1}
                          </td>
                          
                          <td className="table-cell">
                            <div className="raffle-info-cell">
                              <div className="raffle-avatar">
                                <Image 
                                  src={raffle.image} 
                                  alt={raffle.name} 
                                  width={48} 
                                  height={48} 
                                  className="raffle-avatar-image"
                                  style={{ borderRadius: '8px', objectFit: 'cover' }}
                                />
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                  {raffle.name.length > 20 ? `${raffle.name.slice(0, 20)}...` : raffle.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                                  {progressPercentage.toFixed(0)}% sold
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="table-cell">
                            <div className="raffle-id">#{raffle.id}</div>
                          </td>
                          
                          <td className="table-cell">
                            <div className="status-progress">
                              <div className="progress-bar-small">
                                <div 
                                  className="progress-fill-small" 
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <div className="progress-text-small">
                                {progressPercentage.toFixed(0)}%
                              </div>
                            </div>
                          </td>
                          
                          <td className="table-cell">
                            <div className="tickets-sold">
                              {raffle.soldTickets}
                            </div>
                          </td>
                          
                          <td className="table-cell">
                            <div className="price-cell">
                              {raffle.isFree ? (
                                <>
                                  <span className="price-icon">🐅</span>
                                  <span>{raffle.pointCost}</span>
                                </>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="price-icon">⚡</span>
                                    <span>{raffle.ticketPrice.toLocaleString()}</span>
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: '1.25rem' }}>
                                    ${satsToDollars(raffle.ticketPrice)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          
                          <td className="table-cell">
                            <div className="value-cell">
                              ${raffle.isFree ? getTigerValue() : getTigerValue()}
                            </div>
                          </td>
                          
                          <td className="table-cell">
                            <div className="countdown-cell">
                              {isActive ? formatTimeLeft(raffle.endsAt) : 'ENDED'}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card Layout */}
              <div className="mobile-hot-raffles">
                {filteredRaffles.slice(0, 5).map((raffle, index) => {
                  const isActive = new Date(raffle.endsAt) > new Date() && !raffle.winner
                  const progressPercentage = (raffle.soldTickets / raffle.totalTickets) * 100
                  
                  // Calculate realistic Tiger NFT value based on raffle's floor price
                  const getTigerValue = () => {
                    return raffle.floorPrice ? raffle.floorPrice.toString() : "300"
                  }

                  // Convert sats to USD
                  const satsToDollars = (sats: number) => {
                    const btcAmount = sats / 100000000
                    const usdAmount = btcAmount * btcPrice
                    return usdAmount.toFixed(2)
                  }
                  
                  return (
                    <div key={raffle.id} className="mobile-raffle-card">
                      <div className="mobile-card-header">
                        <div className="mobile-card-rank">#{index + 1}</div>
                        <div className="mobile-card-avatar">
                          <Image 
                            src={raffle.image} 
                            alt={raffle.name} 
                            width={40} 
                            height={40} 
                            style={{ borderRadius: '6px', objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        </div>
                        <div className="mobile-card-info">
                          <div className="mobile-card-name">
                            {raffle.name.length > 25 ? `${raffle.name.slice(0, 25)}...` : raffle.name}
                          </div>
                          <div className="mobile-card-id">#{raffle.id}</div>
                        </div>
                      </div>
                      
                      <div className="mobile-progress-section">
                        <div className="mobile-progress-bar">
                          <div 
                            className="mobile-progress-fill" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="mobile-progress-text">
                          {progressPercentage.toFixed(0)}% sold ({raffle.soldTickets} tickets)
                        </div>
                      </div>
                      
                      <div className="mobile-card-stats">
                        <div className="mobile-stat-item">
                          <div className="mobile-stat-label">Ticket Price</div>
                          <div className="mobile-stat-value price">
                            {raffle.isFree ? (
                              <>
                                <span>🐅</span>
                                <span>{raffle.pointCost}</span>
                              </>
                            ) : (
                              <>
                                <span>⚡</span>
                                <span>{raffle.ticketPrice.toLocaleString()}</span>
                              </>
                            )}
                          </div>
                          {!raffle.isFree && (
                            <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                              ${satsToDollars(raffle.ticketPrice)}
                            </div>
                          )}
                        </div>
                        
                        <div className="mobile-stat-item">
                          <div className="mobile-stat-label">Value</div>
                          <div className="mobile-stat-value value">
                            ${getTigerValue()}
                          </div>
                        </div>
                        
                        <div className="mobile-stat-item">
                          <div className="mobile-stat-label">Tickets Sold</div>
                          <div className="mobile-stat-value sold">
                            {raffle.soldTickets}
                          </div>
                        </div>
                        
                        <div className="mobile-stat-item">
                          <div className="mobile-stat-label">Finishes In</div>
                          <div className="mobile-stat-value countdown">
                            {isActive ? formatTimeLeft(raffle.endsAt) : 'ENDED'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Section Divider */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <h2 className="ending-soon-title">ENDING SOON</h2>
          <div className="ending-soon-subtitle">Discover Almost Over Raffles</div>
        </div>
        
        {/* Controls Section */}
        <div className="controls-section">
          <div className="section-header">
            <div className="section-title">
              {statusFilter === 'active' && `Active Raffles (${filteredRaffles.length})`}
              {statusFilter === 'ended' && `Ended Raffles (${filteredRaffles.length})`}
              {statusFilter === 'all' && `All Raffles (${filteredRaffles.length})`}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Filter Tabs */}
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('active')}
                >
                  Active
                </button>
                <button 
                  className={`filter-tab ${statusFilter === 'ended' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('ended')}
                >
                  Ended
                </button>
                <button 
                  className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('all')}
                >
                  All
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-controls">
                <button className="sort-button">
                  <span>
                    {sortBy === 'end_time' && 'Ending Soon'}
                    {sortBy === 'price_low' && 'Price: Low to High'}
                    {sortBy === 'price_high' && 'Price: High to Low'}
                    {sortBy === 'popularity' && 'Most Popular'}
                  </span>
                  <span>▼</span>
                </button>
                {/* Simplified - in real implementation would add dropdown menu */}
              </div>
            </div>
          </div>

          {/* Quick Sort Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`filter-tab ${sortBy === 'end_time' ? 'active' : ''}`}
              onClick={() => handleSortChange('end_time')}
              style={{ marginBottom: 0 }}
            >
              🕒 Ending Soon
            </button>
            <button 
              className={`filter-tab ${sortBy === 'price_low' ? 'active' : ''}`}
              onClick={() => handleSortChange('price_low')}
              style={{ marginBottom: 0 }}
            >
              💰 Lowest Price
            </button>
            <button 
              className={`filter-tab ${sortBy === 'price_high' ? 'active' : ''}`}
              onClick={() => handleSortChange('price_high')}
              style={{ marginBottom: 0 }}
            >
              💎 Highest Price
            </button>
            <button 
              className={`filter-tab ${sortBy === 'popularity' ? 'active' : ''}`}
              onClick={() => handleSortChange('popularity')}
              style={{ marginBottom: 0 }}
            >
              🔥 Most Popular
            </button>
          </div>
        </div>

        {/* Raffles Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <div>Loading raffles...</div>
          </div>
        ) : filteredRaffles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <div className="empty-title">No raffles found</div>
            <div className="empty-description">
              {statusFilter === 'active' 
                ? 'No active raffles at the moment. Check back soon!'
                : statusFilter === 'ended'
                ? 'No ended raffles to display.'
                : 'No raffles available. New raffles are added regularly!'
              }
            </div>
          </div>
        ) : (
          <div className="raffles-grid">
            {filteredRaffles.map((raffle) => {
              const isActive = new Date(raffle.endsAt) > new Date() && !raffle.winner
              const isEnded = !isActive
              const userIsWinner = raffle.winner === walletAddress
              const userHasTickets = userTickets[raffle.id] > 0
              
              // Convert sats to USD
              const satsToDollars = (sats: number) => {
                const btcAmount = sats / 100000000
                const usdAmount = btcAmount * btcPrice
                return usdAmount.toFixed(2)
              }
              
              return (
                <div key={raffle.id} className="raffle-card">
                  {/* Status Badges */}
                  {userIsWinner && (
                    <div className="status-badge badge-you-won">
                      YOU WON! 🏆
                    </div>
                  )}
                  {isEnded && !userIsWinner && raffle.winner && (
                    <div className="status-badge badge-winner">
                      Completed
                    </div>
                  )}
                  {isEnded && !raffle.winner && (
                    <div className="status-badge badge-ended">
                      Ended
                    </div>
                  )}

                  {/* User Tickets Badge */}
                  {userHasTickets && (
                    <div className="user-tickets-badge">
                      {userTickets[raffle.id]} ticket{userTickets[raffle.id] > 1 ? 's' : ''}
                    </div>
                  )}
                  
                  {/* Raffle Image */}
                  <div className="raffle-image-container">
                    <Image 
                      src={raffle.image} 
                      alt={raffle.name} 
                      width={320} 
                      height={200} 
                      className="raffle-image"
                    />
                  </div>
                  
                  {/* Raffle Content */}
                  <div className="raffle-content">
                    <div className="raffle-header">
                      <h3 className="raffle-name">{raffle.name}</h3>
                      <p className="raffle-description">{raffle.description}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="raffle-stats">
                      <div className="price-display">
                        {raffle.isFree ? (
                          <>
                            <span>🐅</span>
                            <span>{raffle.pointCost} points</span>
                          </>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>⚡</span>
                              <span>{raffle.ticketPrice.toLocaleString()} sats</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: '1.25rem', marginTop: '0.125rem' }}>
                              ${satsToDollars(raffle.ticketPrice)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Timer Section */}
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      borderRadius: '8px', 
                      padding: '0.75rem', 
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <span style={{ 
                        color: isEnded ? '#94A3B8' : '#FFB800',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        fontFamily: 'Courier New, monospace',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>⏱️</span>
                        {isEnded ? 'Ended' : formatTimeLeft(raffle.endsAt)}
                      </span>
                    </div>
                    
                    {/* Progress */}
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${getProgressPercentage(raffle)}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        <span>{raffle.soldTickets} sold</span>
                        <span>{raffle.totalTickets} total</span>
                        <span>{Math.round(getProgressPercentage(raffle))}%</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    {!raffle.winner && !isEnded ? (
                      <div className="raffle-actions">
                        <div className="ticket-controls">
                          <button 
                            className="ticket-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedRaffle === raffle.id) {
                                setTicketAmount(prev => Math.max(1, prev - 1));
                              } else {
                                setSelectedRaffle(raffle.id);
                                setTicketAmount(1);
                              }
                            }}
                          >
                            −
                          </button>
                          
                          <input
                            type="number"
                            className="ticket-input"
                            value={selectedRaffle === raffle.id ? ticketAmount : 1}
                            onChange={(e) => {
                              e.stopPropagation();
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 1) {
                                setTicketAmount(value);
                                setSelectedRaffle(raffle.id);
                              }
                            }}
                            min="1"
                            max="100"
                            onClick={(e) => e.stopPropagation()}
                          />
                          
                          <button 
                            className="ticket-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedRaffle === raffle.id) {
                                setTicketAmount(prev => prev + 1);
                              } else {
                                setSelectedRaffle(raffle.id);
                                setTicketAmount(2);
                              }
                            }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="enter-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDirectPurchase(raffle.id, selectedRaffle === raffle.id ? ticketAmount : 1);
                          }}
                          disabled={
                            isEnded || 
                            (raffle.isFree ? userPoints < raffle.pointCost : balance < raffle.ticketPrice)
                          }
                        >
                          {isEnded ? 'Ended' : 'Enter'}
                        </button>
                      </div>
                    ) : raffle.winner ? (
                      <div className={`winner-section ${userIsWinner ? 'user-won' : ''}`}>
                        <div className="winner-label">
                          {userIsWinner ? 'Congratulations! 🎉' : 'Winner'}
                        </div>
                        <div className={`winner-address ${userIsWinner ? 'user-won' : ''}`}>
                          {userIsWinner 
                            ? 'You won this raffle!' 
                            : `${raffle.winner.slice(0, 8)}...${raffle.winner.slice(-6)}`
                          }
                        </div>
                        {raffle.winnerPickedAt && (
                          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.5rem' }}>
                            Drawn: {formatDate(raffle.winnerPickedAt)}
                          </div>
                        )}
                        {userHasTickets && !userIsWinner && (
                          <div style={{ fontSize: '0.8rem', color: '#A0A0A0', marginTop: '0.5rem' }}>
                            You had {userTickets[raffle.id]} ticket{userTickets[raffle.id] > 1 ? 's' : ''}
                          </div>
                        )}
                        {userIsWinner && (
                          <div style={{ fontSize: '0.8rem', color: '#FF6B00', marginTop: '0.5rem' }}>
                            Contact us to claim your prize! 🏆
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '1rem',
                        color: '#6B7280',
                        fontSize: '0.9rem'
                      }}>
                        This raffle has ended
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
          padding: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#6B7280',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>⚡ Powered by Bitcoin Lightning Network</p>
          <p style={{ margin: 0 }}>Bitcoin Tiger Collective - Where Community Meets Fortune</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && confirmModalData && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Raffle Entry</h3>
              <button 
                className="modal-close"
                onClick={() => setShowConfirmModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="raffle-info">
                <h4>{confirmModalData.raffleName}</h4>
                <div className="purchase-details">
                  <div className="detail-row">
                    <span>Tickets:</span>
                    <span>{confirmModalData.ticketAmount}</span>
                  </div>
                  <div className="detail-row">
                    <span>Price per ticket:</span>
                    <span>
                      {confirmModalData.ticketPrice === 0 
                        ? `${confirmModalData.totalCost / confirmModalData.ticketAmount} points`
                        : `${confirmModalData.ticketPrice.toLocaleString()} sats`
                      }
                    </span>
                  </div>
                  <div className="detail-row total-row">
                    <span>Total cost:</span>
                    <span>
                      {confirmModalData.ticketPrice === 0 
                        ? `${confirmModalData.totalCost} points`
                        : `${confirmModalData.totalCost.toLocaleString()} sats`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="balance-check">
                <div className="detail-row">
                  <span>
                    {confirmModalData.ticketPrice === 0 ? 'Current points:' : 'Current balance:'}
                  </span>
                  <span>
                    {confirmModalData.ticketPrice === 0 
                      ? `${userPoints.toLocaleString()} points`
                      : `${balance.toLocaleString()} sats`
                    }
                  </span>
                </div>
                <div className="detail-row">
                  <span>After purchase:</span>
                  <span>
                    {confirmModalData.ticketPrice === 0 
                      ? `${(userPoints - confirmModalData.totalCost).toLocaleString()} points`
                      : `${(balance - confirmModalData.totalCost).toLocaleString()} sats`
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={handleConfirmedPurchase}
              >
                Confirm Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 