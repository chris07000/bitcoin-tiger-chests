'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'

export default function Navbar() {
  const pathname = usePathname()
  const [balance, setBalance] = useState<string>('0')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userRank, setUserRank] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastBalanceFetch, setLastBalanceFetch] = useState<number>(0)
  const { fetchBalance, walletAddress } = useLightning()
  
  // Functie om de actuele balans op te halen
  const fetchActualBalance = async () => {
    if (!walletAddress) return;
    
    try {
      setIsRefreshing(true)
      
      // Gebruik de fetchBalance functie uit de Lightning Context
      const newBalance = await fetchBalance();
      
      // Alleen updaten als we een geldige balans hebben
      if (newBalance > 0 || newBalance === 0) {
        setBalance(newBalance.toLocaleString())
        console.log('Navbar: Balans bijgewerkt via API:', newBalance)
      } else {
        console.warn('Navbar: Ongeldige balans ontvangen:', newBalance)
      }
      
      // Update lastFetch timestamp
      setLastBalanceFetch(Date.now())
    } catch (error) {
      console.error('Navbar: Fout bij ophalen balans via API:', error)
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // Functie om user rank op te halen
  const fetchUserRank = async () => {
    if (!walletAddress) return;
    
    try {
      const response = await fetch(`/api/ranking/user-rank?walletAddress=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        if (data.rank) {
          setUserRank(data.rank);
        }
      }
    } catch (error) {
      console.error('Error fetching user rank:', error);
    }
  };
  
  useEffect(() => {
    // Functie om balance te updaten
    const updateBalance = async () => {
      if (!walletAddress) return;
      
      try {
        const now = Date.now();
        // Throttling: alleen API calls uitvoeren als het nodig is
        // Haal de tijd sinds de laatste update op van de state
        const timeSinceLastFetch = now - lastBalanceFetch;
        
        // Alleen nieuwe balans ophalen als het lang genoeg geleden is
        // OF als er nog nooit een fetch is gedaan
        if (lastBalanceFetch === 0 || timeSinceLastFetch > 2000) { // 2 seconden interval
          console.log(`Navbar: Time since last balance fetch: ${timeSinceLastFetch}ms, fetching new balance`);
          
          // Gebruik fetchBalance om de balans op te halen
          const currentBalance = await fetchBalance();
        
        // Alleen de balans bijwerken als we een geldige waarde hebben
        if (currentBalance > 0 || (currentBalance === 0 && balance === '0')) {
            setBalance(currentBalance.toLocaleString());
            setLastBalanceFetch(now);
            console.log('Navbar: Balance updated to', currentBalance);
          }
        } else {
          console.log(`Navbar: Skipping balance fetch, last fetch was ${timeSinceLastFetch}ms ago`);
        }
        
        // Haal user rank op als we dat nog niet hebben
        if (!userRank) {
          fetchUserRank();
        }
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    };

    // Update direct bij laden
    updateBalance();

    // Update elke seconde, maar voer alleen de API call uit als het nodig is
    const interval = setInterval(updateBalance, 1000);
    
    // Luister naar custom balance update events
    const handleBalanceUpdate = (event: CustomEvent<{ balance: number, wallet: string }>) => {
      console.log('Navbar: Received balance update event', event.detail);
      
      // Alleen updaten als het voor onze huidige wallet is
      if (event.detail.wallet === walletAddress) {
        setBalance(event.detail.balance.toLocaleString());
        setLastBalanceFetch(Date.now());
        console.log('Navbar: Balance updated from event to', event.detail.balance);
      }
    };
    
    // Event listener toevoegen voor balance updates
    window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);

    // Cleanup interval en event listener
    return () => {
      clearInterval(interval);
      window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    };
  }, [walletAddress, balance, lastBalanceFetch, userRank, fetchBalance]);
  
  // Functie om handmatig de balans te verversen
  const refreshBalance = async () => {
    if (walletAddress) {
      setIsRefreshing(true);
      
      try {
        // Forceer volledige balans refresh via API, negeer caching
        const forceRefreshOptions = {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        };
        
        // Voer een directe API call uit voor de meest actuele balans
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/wallet/${walletAddress}`, forceRefreshOptions);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fresh balance data from API:', data);
          
          // Update de balans state
          setBalance(data.balance.toLocaleString());
          
          console.log(`Manually refreshed balance: ${data.balance} sats`);
          
          // Indien beschikbaar, gebruik ook de fetchBalance functie voor volledige synchronisatie
          setTimeout(() => {
            fetchBalance();
          }, 100);
        } else {
          console.error('Failed to manually refresh balance');
          await fetchActualBalance();
        }
      } catch (error) {
        console.error('Error in refreshBalance:', error);
        await fetchActualBalance();
      } finally {
        setIsRefreshing(false);
      }
    }
  }
  
  // Bepaal rank badge path
  const getRankBadgePath = () => {
    if (!userRank) return ''
    
    const rankBase = userRank.split(' ')[0]
    switch(rankBase) {
      case 'Initiate': return '/badges/initiate.png'
      case 'Hunter': return '/badges/hunter.png'
      case 'Elite': return '/badges/elite.png'
      case 'Master': return '/badges/master.png'
      case 'Grandmaster': return '/badges/grandmaster.png'
      case 'Legend': return '/badges/legend.png'
      default: return ''
    }
  }
  
  // Render badge component
  const rankBadge = userRank && getRankBadgePath() ? (
    /* Tijdelijk verborgen ranking link 
    <Link href="/ranking" title={userRank} style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '3px' }}>
      <Image 
        src={getRankBadgePath()} 
        width={20} 
        height={20} 
        alt={userRank}
        style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.4))' }}
      />
    </Link>
    */
    null
  ) : null
  
  // Render refresh button
  const refreshButton = (
    <button 
      style={{
        background: '#ffd700',
        color: '#000',
        border: '1px solid #995c00',
        fontSize: '0.6rem',
        width: '14px',
        height: '14px',
        padding: '1px',
        margin: '0 0 0 3px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '0px'
      }}
      onClick={refreshBalance}
      disabled={isRefreshing}
      title="Refresh Balance"
    >
      {isRefreshing ? '•' : '↻'}
    </button>
  )
  
  return (
    <nav className="nav-container">
      <div className="nav-content" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="mobile-nav-row">
          {/* BTC logo links */}
          <Link href="/" className="nav-link active btc-logo">BTC</Link>
          
          {/* Mobile Balance */}
          <div className="mobile-balance" style={{ display: 'flex', alignItems: 'center' }}>
            <span>{balance} sats</span>{rankBadge}
            {refreshButton}
          </div>

          {/* Hamburger Menu Button rechts op dezelfde rij */}
          <button 
            className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <Link 
              href="/home" 
              className={`nav-link ${pathname === '/home' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/" 
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Chests
            </Link>
            <Link 
              href="/jackpot" 
              className={`nav-link ${pathname === '/jackpot' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Coinflip
            </Link>
            <Link 
              href="/raffle" 
              className={`nav-link ${pathname === '/raffle' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Raffle
            </Link>
            <Link 
              href="/staking" 
              className={`nav-link ${pathname === '/staking' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Staking
            </Link>
            <Link 
              href="/tigers" 
              className={`nav-link ${pathname === '/tigers' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tigers
            </Link>
            <Link 
              href="/artifacts" 
              className={`nav-link ${pathname === '/artifacts' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Artifacts
            </Link>
            <Link 
              href="/how-to-play" 
              className={`nav-link ${pathname === '/how-to-play' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              How to Play
            </Link>
            <div className="balance-info" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="balance-value">Balance: {balance} sats</span>{rankBadge}
              {refreshButton}
            </div>
          </div>
          
          <div className="social-links">
            <a
              href="https://x.com/OrdinalTigerBTC"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://discord.com/invite/bitcointigercollective"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          <div className="nav-links">
            <Link 
              href="/home" 
              className={`nav-link ${pathname === '/home' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/" 
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              Chests
            </Link>
            <Link 
              href="/jackpot" 
              className={`nav-link ${pathname === '/jackpot' ? 'active' : ''}`}
            >
              Coinflip
            </Link>
            <Link 
              href="/raffle" 
              className={`nav-link ${pathname === '/raffle' ? 'active' : ''}`}
            >
              Raffle
            </Link>
            <Link 
              href="/staking" 
              className={`nav-link ${pathname === '/staking' ? 'active' : ''}`}
            >
              Staking
            </Link>
            <Link 
              href="/tigers" 
              className={`nav-link ${pathname === '/tigers' ? 'active' : ''}`}
            >
              Tigers
            </Link>
            <Link 
              href="/artifacts" 
              className={`nav-link ${pathname === '/artifacts' ? 'active' : ''}`}
            >
              Artifacts
            </Link>
            <Link 
              href="/how-to-play" 
              className={`nav-link ${pathname === '/how-to-play' ? 'active' : ''}`}
            >
              How to Play
            </Link>
            <div className="balance-info" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="balance-value">Balance: {balance} sats</span>{rankBadge}
              {refreshButton}
            </div>
          </div>
          
          <div className="social-links">
            <a
              href="https://x.com/OrdinalTigerBTC"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://discord.com/invite/bitcointigercollective"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .mobile-balance, .balance-info {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .rank-badge {
          display: inline-block;
          margin-left: 3px;
          filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.4));
          vertical-align: middle;
        }
        
        /* Verberg mobile-balance op desktop */
        @media (min-width: 769px) {
          .mobile-balance {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
} 