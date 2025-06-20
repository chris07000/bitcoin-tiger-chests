'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'
import { useWallet } from '@/context/WalletContext'

export default function Navbar() {
  const pathname = usePathname()
  const [balance, setBalance] = useState<string>('0')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userRank, setUserRank] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastBalanceFetch, setLastBalanceFetch] = useState<number>(0)
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const { fetchBalance, walletAddress } = useLightning()
  const { connectedWallet, connectXverse, connectUnisat, connectMagicEden, disconnectWallet } = useWallet()
  
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
        if (lastBalanceFetch === 0 || timeSinceLastFetch > 30000) { // 30 seconden interval (was 2000)
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

    // Update elke 30 seconden in plaats van elke seconde (was 1000)
    const interval = setInterval(updateBalance, 30000);
    
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
  
  // Close wallet dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showWalletMenu && !target.closest('.wallet-menu-container')) {
        setShowWalletMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWalletMenu]);
  
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
        background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
        color: '#000',
        border: 'none',
        fontSize: '0.6rem',
        width: '14px',
        height: '14px',
        padding: '1px',
        margin: '0 0 0 3px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(255, 107, 0, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onClick={refreshBalance}
      disabled={isRefreshing}
      title="Refresh Balance"
      onMouseEnter={(e) => {
        if (!isRefreshing) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 107, 0, 0.2)';
      }}
    >
      {isRefreshing ? '•' : '↻'}
    </button>
  )
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Social Icons */}
        <div className="navbar-left">
          <div className="social-icons">
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

        {/* Center - Navigation Links (Desktop) */}
        <div className="navbar-center">
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
              href="/mining" 
              className={`nav-link ${pathname === '/mining' ? 'active' : ''}`}
            >
              Mining
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
          </div>
        </div>

        {/* Right side - Balance & Wallet */}
        <div className="navbar-right">
          <div className="balance-display">
            <span className="balance-text">{balance} sats</span>
            {rankBadge}
            {refreshButton}
          </div>
          
          {/* Wallet Connect */}
          {!walletAddress ? (
            <div className="wallet-menu-container">
              <button 
                className="wallet-connect-btn"
                onClick={() => setShowWalletMenu(!showWalletMenu)}
              >
                Connect
              </button>
              {showWalletMenu && (
                <div className="wallet-dropdown">
                  <button className="wallet-option" onClick={() => { connectXverse(); setShowWalletMenu(false); }}>
                    Xverse
                  </button>
                  <button className="wallet-option" onClick={() => { connectUnisat(); setShowWalletMenu(false); }}>
                    Unisat
                  </button>
                  <button className="wallet-option" onClick={() => { connectMagicEden(); setShowWalletMenu(false); }}>
                    Magic Eden
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="wallet-info">
              <span className="wallet-address" title={walletAddress}>
                {connectedWallet === 'MagicEden' ? 'ME' : connectedWallet === 'Unisat' ? 'UN' : 'XV'}
                {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-3)}
              </span>
              <button 
                className="disconnect-btn"
                onClick={disconnectWallet}
                title="Disconnect Wallet"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav-links">
            <Link 
              href="/home" 
              className={`mobile-nav-link ${pathname === '/home' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/" 
              className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Chests
            </Link>
            <Link 
              href="/jackpot" 
              className={`mobile-nav-link ${pathname === '/jackpot' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Coinflip
            </Link>
            <Link 
              href="/raffle" 
              className={`mobile-nav-link ${pathname === '/raffle' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Raffle
            </Link>
            <Link 
              href="/staking" 
              className={`mobile-nav-link ${pathname === '/staking' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Staking
            </Link>
            <Link 
              href="/mining" 
              className={`mobile-nav-link ${pathname === '/mining' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Mining
            </Link>
            <Link 
              href="/tigers" 
              className={`mobile-nav-link ${pathname === '/tigers' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tigers
            </Link>
            <Link 
              href="/artifacts" 
              className={`mobile-nav-link ${pathname === '/artifacts' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Artifacts
            </Link>
            <Link 
              href="/how-to-play" 
              className={`mobile-nav-link ${pathname === '/how-to-play' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              How to Play
            </Link>
            
            {/* Mobile Balance & Wallet */}
            <div className="mobile-balance-section">
              <div className="mobile-balance">
                <span>{balance} sats</span>
                {rankBadge}
                {refreshButton}
              </div>
              
              {!walletAddress ? (
                <button 
                  className="mobile-wallet-btn"
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                >
                  Connect
                </button>
              ) : (
                <div className="mobile-wallet-info">
                  <span className="mobile-wallet-address">
                    {connectedWallet === 'MagicEden' ? 'ME' : connectedWallet === 'Unisat' ? 'UN' : 'XV'}
                    {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-3)}
                  </span>
                  <button 
                    className="mobile-disconnect-btn"
                    onClick={disconnectWallet}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Navbar with exact raffle page theme */
        .navbar {
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          border-bottom: 1px solid rgba(255, 107, 0, 0.15);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.4), transparent);
        }
        
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 60px;
        }
        
        /* Left side - Social Icons */
        .navbar-left {
          display: flex;
          align-items: center;
          flex: 0 0 auto;
        }
        
        .social-icons {
          display: flex;
          gap: 0.5rem;
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 107, 0, 0.2);
          color: #FF6B00;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          text-decoration: none;
        }
        
        .social-icon:hover {
          background: rgba(255, 107, 0, 0.1);
          border-color: rgba(255, 107, 0, 0.4);
          color: #FFB800;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
        }
        
        .social-icon svg {
          width: 14px;
          height: 14px;
        }
        
        /* Center - Navigation Links */
        .navbar-center {
          display: none;
          flex: 1 1 auto;
          max-width: 800px;
        }
        
        .nav-links {
          display: flex;
          gap: 0.25rem;
          align-items: center;
          justify-content: center;
        }
        
        .nav-link {
          color: #94A3B8;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .nav-link:hover:not(.active) {
          color: #FFFFFF;
          background: rgba(255, 107, 0, 0.05);
          border-color: rgba(255, 107, 0, 0.2);
          transform: translateY(-1px);
        }
        
        .nav-link.active {
          background: rgba(255, 107, 0, 0.1);
          border-color: rgba(255, 107, 0, 0.3);
          color: #FF6B00;
          box-shadow: 0 2px 8px rgba(255, 107, 0, 0.15);
        }
        
        /* Right side - Balance & Wallet */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 0 0 auto;
        }
        
        .balance-display {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 107, 0, 0.15);
          border-radius: 6px;
          padding: 0.4rem 0.6rem;
          backdrop-filter: blur(10px);
        }
        
        .balance-text {
          color: #FF6B00;
          font-weight: 600;
          font-size: 0.8rem;
        }
        
        /* Wallet Connect Styling */
        .wallet-menu-container {
          position: relative;
        }
        
        .wallet-connect-btn {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(255, 107, 0, 0.2);
        }
        
        .wallet-connect-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
        }
        
        .wallet-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 6px;
          min-width: 120px;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          margin-top: 4px;
          backdrop-filter: blur(20px);
        }
        
        .wallet-option {
          display: block;
          width: 100%;
          padding: 0.6rem 0.75rem;
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          border-bottom: 1px solid rgba(255, 107, 0, 0.1);
        }
        
        .wallet-option:last-child {
          border-bottom: none;
        }
        
        .wallet-option:hover {
          background: rgba(255, 107, 0, 0.1);
          color: #FF6B00;
        }
        
        .wallet-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 107, 0, 0.1);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 6px;
          padding: 0.4rem 0.6rem;
          backdrop-filter: blur(10px);
        }
        
        .wallet-address {
          color: #FFB800;
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
        }
        
        .disconnect-btn {
          background: rgba(255, 0, 0, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(255, 0, 0, 0.3);
          border-radius: 4px;
          padding: 0.2rem 0.4rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          min-width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .disconnect-btn:hover {
          background: rgba(255, 0, 0, 0.3);
          color: #fff;
          transform: scale(1.05);
        }
        
        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }
        
        .mobile-menu-btn span {
          width: 24px;
          height: 2px;
          background: #FF6B00;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: 1px;
        }
        
        .mobile-menu-btn.open span:first-child {
          transform: rotate(45deg);
        }
        
        .mobile-menu-btn.open span:nth-child(2) {
          opacity: 0;
        }
        
        .mobile-menu-btn.open span:nth-child(3) {
          transform: rotate(-45deg);
        }
        
        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          border-bottom: 1px solid rgba(255, 107, 0, 0.15);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 90;
        }
        
        .mobile-nav-links {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .mobile-nav-link {
          color: #94A3B8;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .mobile-nav-link:hover:not(.active) {
          color: #FFFFFF;
          background: rgba(255, 107, 0, 0.05);
          border-color: rgba(255, 107, 0, 0.2);
        }
        
        .mobile-nav-link.active {
          background: rgba(255, 107, 0, 0.1);
          border-color: rgba(255, 107, 0, 0.3);
          color: #FF6B00;
          box-shadow: 0 2px 8px rgba(255, 107, 0, 0.15);
        }
        
        .mobile-balance-section {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 107, 0, 0.15);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .mobile-balance {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 107, 0, 0.15);
          border-radius: 6px;
          padding: 0.6rem;
          backdrop-filter: blur(10px);
          color: #FF6B00;
          font-weight: 600;
          font-size: 0.8rem;
        }
        
        .mobile-wallet-btn {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 0.6rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(255, 107, 0, 0.2);
        }
        
        .mobile-wallet-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 107, 0, 0.1);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 6px;
          padding: 0.6rem;
          backdrop-filter: blur(10px);
        }
        
        .mobile-wallet-address {
          color: #FFB800;
          font-weight: 600;
          font-size: 0.8rem;
        }
        
        .mobile-disconnect-btn {
          background: rgba(255, 0, 0, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(255, 0, 0, 0.3);
          border-radius: 4px;
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
        }
        
        /* Desktop responsive */
        @media (min-width: 1024px) {
          .navbar-center {
            display: block;
          }
          
          .mobile-menu-btn {
            display: none;
          }
          
          .navbar-left {
            flex: 0 0 auto;
          }
          
          .navbar-center {
            flex: 1 1 auto;
            display: flex;
            justify-content: center;
          }
          
          .navbar-right {
            flex: 0 0 auto;
            justify-content: flex-end;
          }
        }
        
        /* Tablet responsive */
        @media (max-width: 1023px) {
          .navbar-left {
            display: none;
          }
          
          .navbar-center {
            display: none;
          }
          
          .balance-display {
            display: none;
          }
          
          .wallet-connect-btn,
          .wallet-info {
            font-size: 0.75rem;
            padding: 0.35rem 0.5rem;
          }
          
          .wallet-address {
            font-size: 0.7rem;
          }
          
          .disconnect-btn {
            padding: 0.15rem 0.3rem;
            font-size: 0.75rem;
          }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0.5rem 0.75rem;
          }
          
          .social-icons {
            gap: 0.4rem;
          }
          
          .social-icon {
            width: 24px;
            height: 24px;
          }
          
          .social-icon svg {
            width: 12px;
            height: 12px;
          }
          
          .wallet-connect-btn,
          .wallet-info {
            font-size: 0.7rem;
            padding: 0.3rem 0.4rem;
          }
          
          .wallet-address {
            font-size: 0.65rem;
          }
          
          .disconnect-btn {
            padding: 0.1rem 0.25rem;
            font-size: 0.7rem;
            min-width: 20px;
          }
        }
      `}</style>
    </nav>
  )
} 