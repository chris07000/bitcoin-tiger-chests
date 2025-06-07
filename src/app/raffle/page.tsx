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
    winnerPickedAt?: Date | null
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

    // Start timer die elke seconde de huidige tijd bijwerkt
    timerRef.current = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000); // Elke seconde bijwerken

    fetchRaffles()
    if (walletAddress) {
      fetchUserTickets()
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

    const totalCost = raffle.ticketPrice * defaultTicketAmount
    if (totalCost > balance) {
      setMessage('Insufficient balance')
      return
    }

    // Set the selected raffle for visual feedback
    setSelectedRaffle(raffleId)
    setTicketAmount(defaultTicketAmount)

    // Reset message
    setMessage('')
    
    try {
      // Subtract cost from balance immediately for better UX
      const newBalance = balance - totalCost
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
          raffleId: raffleId,
          ticketAmount: defaultTicketAmount
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
        if (raffle.id === raffleId) {
          return {
            ...raffle,
            soldTickets: raffle.soldTickets + defaultTicketAmount
          }
        }
        return raffle
      })
      setRaffles(updatedRaffles)
      
      // Update user tickets
      setUserTickets(prev => ({
        ...prev,
        [raffleId]: (prev[raffleId] || 0) + defaultTicketAmount
      }))
      
      // Show success message
      setMessage(`Successfully purchased ${defaultTicketAmount} ticket${defaultTicketAmount > 1 ? 's' : ''}!`)
      
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

  return (
    <>
      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          background: #0d1320;
        }
        
        .page-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 5rem 0 2rem 0;
          color: #fff;
          background: #0d1320;
        }

        .title {
          font-size: 2rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }
        
        .subtitle {
          font-size: 1rem;
          font-family: 'Press Start 2P', monospace;
          color: #ccc;
          margin-bottom: 2rem;
          text-align: center;
          max-width: 800px;
          line-height: 1.6;
        }
        
        .balance-display {
          font-size: 1.1rem;
          color: #ffd700;
          margin: 0 0 1.5rem 0;
          padding: 0.8rem 1.5rem;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid #ffd700;
          display: inline-flex;
          align-items: center;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
          font-family: 'Press Start 2P', monospace;
          transition: all 0.3s ease;
        }
        
        .balance-display:hover {
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
          transform: translateY(-2px);
        }
        
        .balance-value {
          font-weight: bold;
          color: #ffd700;
        }
        
        .balance-sats {
          font-size: 0.9rem;
          margin-left: 4px;
        }
        
        .refresh-button {
          background: rgba(255, 215, 0, 0.2);
          color: #ffd700;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-left: 10px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .refresh-button:hover:not(:disabled) {
          background: rgba(255, 215, 0, 0.4);
          transform: rotate(180deg);
        }
        
        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .refresh-icon {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        
        .rotating {
          animation: rotate 1s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .message {
          font-size: 1rem;
          font-family: 'Press Start 2P', monospace;
          padding: 0.5rem 1rem;
          margin: 0.5rem auto 1.5rem;
          display: inline-block;
          text-shadow: 1px 1px #000;
          color: #4afc4a;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          text-align: center;
        }
        
        .raffles-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
          width: 100%;
          max-width: 1400px;
          margin-bottom: 2rem;
        }
        
        .raffle-card {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          padding: 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        
        .raffle-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        
        .raffle-card.selected {
          border-color: #ffd700;
          background: rgba(25, 25, 25, 0.5);
        }
        
        .raffle-image-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 1 / 1;
          padding: 1rem;
        }
        
        .raffle-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 4px;
        }
        
        .raffle-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .raffle-name {
          font-size: 0.9rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 0.2rem;
        }
        
        .raffle-description {
          font-size: 0.75rem;
          color: #ccc;
          margin-bottom: 0.3rem;
          font-family: Arial, sans-serif;
          line-height: 1.2;
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
        }
        
        .raffle-price {
          font-size: 1.1rem;
          color: #ffd700;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .raffle-time {
          font-size: 0.9rem;
          color: #ff9c00;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.3rem;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #ffaa00);
          border-radius: 5px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #ccc;
        }
        
        .user-tickets {
          display: inline-block;
          padding: 0.3rem 0.6rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          color: #4afc4a;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .ticket-purchase {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 600px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 2px solid rgba(255, 215, 0, 0.3);
        }
        
        .ticket-amount {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .ticket-input {
          width: 80px;
          padding: 0.8rem;
          font-size: 1.2rem;
          text-align: center;
          background: #111;
          color: #ffd700;
          border: 2px solid #ffd700;
          border-radius: 4px;
          font-family: 'Press Start 2P', monospace;
        }
        
        .ticket-button {
          background: #333;
          color: #fff;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .ticket-button:hover {
          background: #555;
        }
        
        .purchase-button {
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-family: 'Press Start 2P', monospace;
          background: #ffd700;
          border: none;
          color: #000;
          cursor: pointer;
          transition: all 0.2s;
          display: block;
          min-width: 300px;
          text-align: center;
          border-radius: 4px;
        }
        
        .purchase-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #ffe970;
        }
        
        .purchase-button:active:not(:disabled) {
          transform: translateY(2px);
        }
        
        .purchase-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .total-cost {
          font-size: 1.1rem;
          color: #ffd700;
          margin-bottom: 1rem;
        }
        
        .winner-tag {
          position: absolute;
          top: 0;
          right: 0;
          background: #4afc4a;
          color: #000;
          padding: 0.3rem 0.6rem;
          font-size: 0.8rem;
          font-weight: bold;
          z-index: 2;
        }
        
        .user-won-tag {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #ffd700, #ff9500);
          color: #000;
          padding: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
          text-align: center;
          z-index: 3;
          font-family: 'Press Start 2P', monospace;
          box-shadow: 0 3px 10px rgba(255, 215, 0, 0.5);
          animation: pulse 2s infinite;
        }
        
        .user-won-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 3px solid #ffd700;
          box-sizing: border-box;
          border-radius: 8px;
          pointer-events: none;
          z-index: 1;
          animation: glow 1.5s infinite alternate;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes glow {
          from { box-shadow: 0 0 5px #ffd700; }
          to { box-shadow: 0 0 20px #ffd700; }
        }
        
        .winner-name {
          color: #4afc4a;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .footer {
          text-align: center;
          margin-top: 2rem;
          padding: 0.75rem;
          color: #aaa;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.5;
        }
        
        .footer p {
          margin: 0.4rem 0;
        }
        
        .filter-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 1200px;
          justify-content: center;
        }
        
        .filter-dropdown {
          position: relative;
        }
        
        .filter-button {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          padding: 0.8rem 1.5rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Press Start 2P', monospace;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .filter-button:hover {
          border-color: rgba(255, 215, 0, 0.5);
        }
        
        .dropdown-arrow {
          font-size: 0.7rem;
          margin-left: auto;
        }
        
        .user-tickets-badge {
          position: absolute;
          top: 5px;
          left: 5px;
          background: rgba(255, 215, 0, 0.9);
          color: #000;
          padding: 0.2rem 0.4rem;
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 4px;
          z-index: 2;
        }
        
        .raffle-price-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }
        
        .raffle-price-tag {
          color: var(--gold);
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .raffle-ticket-count {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .ticket-icon {
          font-size: 1rem;
        }
        
        .ticket-sold {
          color: var(--gold);
          font-weight: bold;
        }
        
        .ticket-total {
          color: #aaa;
        }
        
        .ticket-percentage {
          color: #ccc;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          margin-left: 0.3rem;
          font-size: 0.7rem;
        }
        
        .raffle-action-area {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: auto;
        }
        
        .ticket-control {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 0.5rem;
        }
        
        .ticket-control-button {
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          border: 1px solid rgba(255, 215, 0, 0.3);
          width: 24px;
          height: 24px;
          border-radius: 4px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .ticket-control-button:hover:not(:disabled) {
          background: rgba(255, 215, 0, 0.2);
        }
        
        .ticket-control-input {
          width: 40px;
          padding: 0.3rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .raffle-timer {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          color: #ff9c00;
          white-space: nowrap;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.2rem;
          border-radius: 4px;
          width: 100%;
          margin-top: 0.1rem;
          margin-bottom: 0.2rem;
        }
        
        .timer-icon {
          margin-right: 0.2rem;
        }
        
        .enter-button {
          background: var(--gold);
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 0.3rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          width: 100%;
        }
        
        .enter-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #ffe970;
        }
        
        .enter-button:active:not(:disabled) {
          transform: translateY(2px);
        }
        
        .raffle-winner-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          margin-top: auto;
          background: rgba(74, 252, 74, 0.1);
          padding: 0.6rem;
          border-radius: 4px;
        }
        
        .winner-label {
          font-size: 0.8rem;
          color: #aaa;
        }
        
        .winner-address {
          font-size: 0.9rem;
          color: #4afc4a;
          font-weight: bold;
        }
        
        .winner-date {
          font-size: 0.8rem;
          color: #aaa;
          margin-top: 0.3rem;
        }
        
        .user-participation {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
        }
        
        .winner-instructions {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
        }
        
        @media (max-width: 1200px) {
          .raffles-container {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .raffles-container {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
          
          .filter-container {
            gap: 0.5rem;
          }
          
          .filter-button {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
          
          .balance-display {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 480px) {
          .raffles-container {
            grid-template-columns: 1fr;
          }
          
          .filter-button {
            padding: 0.5rem 0.8rem;
            font-size: 0.7rem;
          }
          
          .raffle-name {
            font-size: 1rem;
          }
          
          .raffle-description {
            font-size: 0.8rem;
          }
          
          .balance-display {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
            width: 80%;
          }
        }
        
        .filter-button.active {
          background: rgba(255, 215, 0, 0.2);
          border-color: #ffd700;
        }
        
        /* Extra opvallende stijl voor de actieve filter knop */
        .filter-button.active.primary {
          background: rgba(255, 215, 0, 0.4);
          border-color: #ffd700;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }
      `}</style>

      <div className="page-content">
        <h1 className="title">Bitcoin Tiger Raffles</h1>
        <p className="subtitle">Win exclusive Bitcoin Tiger Ordinals by purchasing raffle tickets</p>
        
        <div className="balance-display">
          Available Balance: <span className="balance-value">{balance.toLocaleString()}</span>
          <span className="balance-sats"> sats</span>
          <button 
            className="refresh-button"
            onClick={refreshBalance}
            disabled={refreshingBalance}
            title="Refresh balance"
          >
            <div className={`refresh-icon ${refreshingBalance ? 'rotating' : ''}`}>↻</div>
          </button>
        </div>
        
        {message && <div className="message">{message}</div>}
        
        <div className="filter-container">
          <div className="filter-dropdown">
            <button 
              className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('all')}
            >
              All Raffles
            </button>
          </div>
          <div className="filter-dropdown">
            <button 
              className={`filter-button ${statusFilter === 'active' ? 'active primary' : ''}`}
              onClick={() => handleStatusFilterChange('active')}
            >
              Active Raffles
            </button>
          </div>
          <div className="filter-dropdown">
            <button 
              className={`filter-button ${statusFilter === 'ended' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('ended')}
            >
              Ended Raffles
            </button>
          </div>
          <div className="filter-dropdown">
            <button 
              className={`filter-button ${sortBy === 'end_time' ? 'active primary' : ''}`}
              onClick={() => handleSortChange('end_time')}
            >
              Ending Soon
            </button>
          </div>
          <div className="filter-dropdown">
            <button 
              className={`filter-button ${sortBy === 'price_low' ? 'active' : ''}`}
              onClick={() => handleSortChange('price_low')}
            >
              Price Low to High
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: "'Press Start 2P', monospace",
            color: '#ffd700'
          }}>
            Loading raffles...
          </div>
        ) : filteredRaffles.length === 0 ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: "'Press Start 2P', monospace",
            color: '#ccc',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <p>No raffles found for current filter</p>
            <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Try changing filters or check back later</p>
          </div>
        ) : (
          <div className="raffles-container">
            {filteredRaffles.map((raffle, index) => {
              // Bepaal of raffle actief of beëindigd is
              const isActive = new Date(raffle.endsAt) > new Date() && !raffle.winner
              const isEnded = !isActive
              const userIsWinner = raffle.winner === walletAddress
              
              return (
                <div key={raffle.id} className="raffle-card">
                  {/* Toon een speciale markering als de gebruiker gewonnen heeft */}
                  {userIsWinner && (
                    <>
                      <div className="user-won-tag">YOU WON! 🏆</div>
                      <div className="user-won-ribbon"></div>
                    </>
                  )}
                  
                  {isEnded && (
                    <div className="winner-tag" style={{
                      background: userIsWinner ? '#ffd700' : '#4afc4a'
                    }}>
                      {raffle.winner ? 'COMPLETED' : 'ENDED'}
                    </div>
                  )}
                  
                  <div className="raffle-image-container">
                    <Image 
                      src={raffle.image} 
                      alt={raffle.name} 
                      width={300} 
                      height={300} 
                      className="raffle-image"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    {userTickets[raffle.id] && (
                      <div className="user-tickets-badge">
                        {userTickets[raffle.id]} ticket{userTickets[raffle.id] > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  <div className="raffle-details">
                    <h3 className="raffle-name">{raffle.name}</h3>
                    <p className="raffle-description">{raffle.description}</p>
                  </div>
                  
                  <div className="raffle-price-bar">
                    <div className="raffle-price-tag">
                      <span>₿</span> {raffle.ticketPrice.toLocaleString()} sats
                    </div>
                    
                    <div className="raffle-ticket-count">
                      <span className="ticket-icon">🎟️</span> 
                      <span className="ticket-sold">{raffle.soldTickets}</span>
                      <span className="ticket-total">/{raffle.totalTickets}</span>
                      <span className="ticket-percentage">{Math.round(getProgressPercentage(raffle))}%</span>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressPercentage(raffle)}%` }}
                    ></div>
                  </div>
                  
                  {!raffle.winner ? (
                    <div className="raffle-action-area">
                      <div className="ticket-control">
                        <button 
                          className="ticket-control-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedRaffle === raffle.id) {
                              setTicketAmount(prev => Math.max(1, prev - 1));
                            } else {
                              setSelectedRaffle(raffle.id);
                              setTicketAmount(1);
                            }
                          }}
                          disabled={raffle.winner !== null || isEnded}
                        >-</button>
                        
                        <input
                          type="number"
                          className="ticket-control-input"
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
                          disabled={isEnded}
                        />
                        
                        <button 
                          className="ticket-control-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedRaffle === raffle.id) {
                              setTicketAmount(prev => prev + 1);
                            } else {
                              setSelectedRaffle(raffle.id);
                              setTicketAmount(1);
                            }
                          }}
                          disabled={raffle.winner !== null || isEnded}
                        >+</button>
                      </div>

                      <div className="raffle-timer">
                        <span className="timer-icon">⏱️</span>
                        <span className="timer-text">{isEnded ? 'Ended' : formatTimeLeft(raffle.endsAt)}</span>
                      </div>
                      
                      <button
                        className="enter-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectPurchase(raffle.id, selectedRaffle === raffle.id ? ticketAmount : 1);
                        }}
                        disabled={isEnded || balance < raffle.ticketPrice}
                      >
                        {isEnded ? 'Ended' : 'Enter'}
                      </button>
                    </div>
                  ) : (
                    <div className="raffle-winner-info" style={{
                      background: userIsWinner ? 'rgba(255, 215, 0, 0.2)' : 'rgba(74, 252, 74, 0.1)'
                    }}>
                      <div className="winner-label">
                        {userIsWinner ? 'You won this raffle! 🎉' : 'Winner:'}
                      </div>
                      <div className="winner-address" title={raffle.winner} style={{
                        color: userIsWinner ? '#ffd700' : '#4afc4a'
                      }}>
                        {userIsWinner 
                          ? 'Your wallet' 
                          : `${raffle.winner.slice(0, 6)}...${raffle.winner.slice(-4)}`}
                      </div>
                      {raffle.winnerPickedAt && (
                        <div className="winner-date">
                          Drawn: {formatDate(raffle.winnerPickedAt)}
                        </div>
                      )}
                      {userTickets[raffle.id] > 0 && !userIsWinner && (
                        <div className="user-participation">
                          You had {userTickets[raffle.id]} ticket{userTickets[raffle.id] > 1 ? 's' : ''}
                        </div>
                      )}
                      {userIsWinner && (
                        <div className="winner-instructions">
                          Contact us to claim your prize!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="footer">
          <p>⚡ Powered by Bitcoin Lightning Network ⚡</p>
          <p>Bitcoin Tiger Collective</p>
        </div>
      </div>
    </>
  )
} 