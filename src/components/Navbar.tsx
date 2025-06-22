'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'
import { useWallet } from '@/context/WalletContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [balance, setBalance] = useState<string>('0')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userRank, setUserRank] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastBalanceFetch, setLastBalanceFetch] = useState<number>(0)
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const [showCollectionMenu, setShowCollectionMenu] = useState(false)
  const [showGamesMenu, setShowGamesMenu] = useState(false)
  const { fetchBalance, forceRefreshBalance, walletAddress } = useLightning()
  const { connectedWallet, connectXverse, connectUnisat, connectMagicEden, disconnectWallet } = useWallet()
  
  // Page load effect to force balance refresh
  useEffect(() => {
    if (walletAddress) {
      console.log('Navbar: Page loaded, checking if balance refresh needed for:', walletAddress);
      
      // Check if we recently refreshed (within last 30 seconds)
      const lastFetch = localStorage.getItem('lastBalanceFetch');
      const now = Date.now();
      if (lastFetch && (now - parseInt(lastFetch)) < 30000) {
        console.log('Navbar: Skipping page load refresh - recent fetch detected');
        return;
      }
      
      // Force refresh balance on page load only if really needed
      setTimeout(() => {
        forceRefreshBalance().then(newBalance => {
          if (newBalance > 0 || newBalance === 0) {
            setBalance(newBalance.toLocaleString());
            console.log('Navbar: Balance refreshed on page load:', newBalance);
          }
        }).catch(error => {
          console.error('Navbar: Failed to refresh balance on page load:', error);
        });
      }, 1000); // Increased delay to 1 second
    }
  }, [walletAddress, forceRefreshBalance]);
  
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
    let balanceInterval: NodeJS.Timeout
    
    const updateBalance = async () => {
      if (walletAddress) {
        console.log('Navbar: Attempting balance update...')
      
        // AGGRESSIVE Debounce: Check for recent updates (increased to 10 seconds)
        const lastFetch = localStorage.getItem('lastBalanceFetch');
        const now = Date.now();
        if (lastFetch && (now - parseInt(lastFetch)) < 10000) {
          console.log('Navbar: Skipping balance fetch - recent update detected (10s debounce)');
          return;
        }
        
        await fetchActualBalance()
      }
    }

    const handleBalanceUpdate = (event: CustomEvent<{ balance: number, wallet: string }>) => {
      console.log('Navbar: Received balance update event');
      
      if (event.detail.wallet === walletAddress) {
        console.log(`Balance updated from event to ${event.detail.balance}`);
        setBalance(event.detail.balance.toLocaleString());
        
        // Update local storage to sync across components
        const balances = JSON.parse(localStorage.getItem('lightningBalances') || '{}');
        balances[event.detail.wallet] = event.detail.balance;
        localStorage.setItem('lightningBalances', JSON.stringify(balances));
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdowns when clicking outside
      if (!showGamesMenu && !showCollectionMenu && !showWalletMenu) return
      
      setShowGamesMenu(false)
      setShowCollectionMenu(false)
      setShowWalletMenu(false)
    }

    if (walletAddress) {
      // Initial balance fetch
      updateBalance()
      
      // DRASTICALLY reduced polling: only every 60 seconds instead of 15
      balanceInterval = setInterval(updateBalance, 60000)
      
      // Listen for balance update events from other components
      window.addEventListener('balanceUpdate', handleBalanceUpdate as EventListener)
    }

    // Add click outside listener
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      if (balanceInterval) clearInterval(balanceInterval)
      window.removeEventListener('balanceUpdate', handleBalanceUpdate as EventListener)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [walletAddress, connectedWallet]) // Simplified dependencies
  
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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0
      }}
      className="refresh-btn"
      onClick={fetchActualBalance}
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
            
            {/* Games & Collection Group */}
            <div className="dropdown-group">
              <div className="games-menu-container">
                <button 
                  className={`nav-link games-btn ${pathname === '/' || pathname === '/jackpot' ? 'active' : ''}`}
                  onClick={() => setShowGamesMenu(!showGamesMenu)}
                >
                  Games <span className="dropdown-arrow">▼</span>
                </button>
                {showGamesMenu && (
                  <div className="games-dropdown">
                    <button
                      className="games-option"
                      onClick={() => {
                        router.push('/');
                        setShowGamesMenu(false);
                      }}
                    >
                      Chests
                    </button>
                    <button
                      className="games-option"
                      onClick={() => {
                        router.push('/jackpot');
                        setShowGamesMenu(false);
                      }}
                    >
                      Coinflip
                    </button>
                  </div>
                )}
              </div>
              <div className="collection-menu-container">
                <button 
                  className={`nav-link collection-btn ${pathname === '/tigers' || pathname === '/artifacts' || pathname === '/staking' ? 'active' : ''}`}
                  onClick={() => setShowCollectionMenu(!showCollectionMenu)}
                >
                  Collection <span className="dropdown-arrow">▼</span>
                </button>
                {showCollectionMenu && (
                  <div className="collection-dropdown">
                    <button
                      className="collection-option"
                      onClick={() => {
                        router.push('/tigers');
                        setShowCollectionMenu(false);
                      }}
                    >
                      Tigers
                    </button>
                    <button
                      className="collection-option"
                      onClick={() => {
                        router.push('/artifacts');
                        setShowCollectionMenu(false);
                      }}
                    >
                      Artifacts
                    </button>
                    <button
                      className="collection-option"
                      onClick={() => {
                        router.push('/staking');
                        setShowCollectionMenu(false);
                      }}
                    >
                      Staking
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <Link 
              href="/raffle" 
              className={`nav-link ${pathname === '/raffle' ? 'active' : ''}`}
            >
              Raffle
            </Link>
            <Link 
              href="/mining" 
              className={`nav-link ${pathname === '/mining' ? 'active' : ''}`}
            >
              Mining
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
          onClick={() => {
            console.log('Hamburger menu clicked, current state:', isMenuOpen);
            console.log('Setting menu state to:', !isMenuOpen);
            setIsMenuOpen(!isMenuOpen);
          }}
          style={{
            backgroundColor: isMenuOpen ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 107, 0, 0.1)'
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu - Simplified since styles are in global CSS */}
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
            
            {/* Games Section */}
            <div className="mobile-games-section">
              <div className="mobile-section-title">Games</div>
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
            </div>
            
            <Link 
              href="/raffle" 
              className={`mobile-nav-link ${pathname === '/raffle' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Raffle
            </Link>
            <Link 
              href="/mining" 
              className={`mobile-nav-link ${pathname === '/mining' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Mining
            </Link>
            
            {/* Collection Section */}
            <div className="mobile-collection-section">
              <div className="mobile-section-title">Collection</div>
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
                href="/staking" 
                className={`mobile-nav-link ${pathname === '/staking' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Staking
              </Link>
            </div>
            
            <Link 
              href="/how-to-play" 
              className={`mobile-nav-link ${pathname === '/how-to-play' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              How to Play
            </Link>
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
          padding: 0.5rem 0.5rem 0.5rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 60px;
          position: relative;
        }
        
        /* Left side - Social Icons */
        .navbar-left {
          display: flex;
          align-items: center;
          flex: 0 0 auto;
          margin-right: 2rem;
        }
        
        .social-icons {
          display: flex;
          gap: 0.4rem;
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 107, 0, 0.2);
          color: #FF6B00;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          text-decoration: none;
          box-sizing: border-box;
        }
        
        .social-icon:hover {
          background: rgba(255, 107, 0, 0.1);
          border-color: rgba(255, 107, 0, 0.4);
          color: #FFB800;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
        }
        
        .social-icon svg {
          width: 12px;
          height: 12px;
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
        
        /* Dropdown Group - Games & Collection together */
        .dropdown-group {
          display: flex;
          gap: 0.125rem;
          align-items: center;
        }
        
        .nav-link {
          color: #94A3B8 !important;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          text-decoration: none !important;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          height: 32px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        
        .nav-link:hover:not(.active) {
          color: #FFFFFF !important;
          background: rgba(255, 107, 0, 0.05);
          border-color: rgba(255, 107, 0, 0.2);
          transform: translateY(-1px);
        }
        
        .nav-link.active {
          background: rgba(255, 107, 0, 0.1);
          border-color: rgba(255, 107, 0, 0.3);
          color: #FF6B00 !important;
          box-shadow: 0 2px 8px rgba(255, 107, 0, 0.15);
        }
        
        /* Specific overrides for regular nav links */
        .nav-links > .nav-link:link,
        .nav-links > .nav-link:visited,
        .nav-links > .nav-link:focus {
          color: #94A3B8 !important;
        }
        
        .nav-links > .nav-link:hover:not(.active) {
          color: #FFFFFF !important;
        }
        
        .nav-links > .nav-link.active {
          color: #FF6B00 !important;
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
          height: 32px;
          box-sizing: border-box;
        }
        
        .balance-text {
          color: #FF6B00;
          font-weight: 600;
          font-size: 0.8rem;
          line-height: 1;
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
          height: 32px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
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
          height: 32px;
          box-sizing: border-box;
        }
        
        .wallet-address {
          color: #FFB800;
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
          line-height: 1;
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
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        
        .disconnect-btn:hover {
          background: rgba(255, 0, 0, 0.3);
          color: #fff;
          transform: scale(1.05);
        }
        
        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 107, 0, 0.1);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 6px;
          cursor: pointer;
          padding: 8px;
          z-index: 101;
          box-sizing: border-box;
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          gap: 4px;
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-menu-btn:hover {
          background: rgba(255, 107, 0, 0.2);
          border-color: rgba(255, 107, 0, 0.5);
          transform: translateY(-50%) scale(1.05);
        }
        
        .mobile-menu-btn:active {
          transform: translateY(-50%) scale(0.95);
        }
        
        .mobile-menu-btn span {
          width: 20px;
          height: 3px;
          background: #FF6B00;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
          display: block;
        }
        
        .mobile-menu-btn.open span:first-child {
          transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.open span:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }
        
        .mobile-menu-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }
        
        /* Mobile Menu */
        .mobile-menu {
          /* Styles are overridden in global CSS for specificity */
        }
        
        .mobile-nav-links {
          /* Styles are overridden in global CSS for specificity */
        }
        
        .mobile-nav-link {
          /* Styles are overridden in global CSS for specificity */
        }
        
        .mobile-section-title {
          /* Styles are overridden in global CSS for specificity */
        }
        
        .mobile-games-section,
        .mobile-collection-section {
          /* Styles are overridden in global CSS for specificity */
        }
        
        .mobile-balance-section {
          /* Styles are overridden in global CSS for specificity */
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
          .navbar {
            display: block !important;
            visibility: visible !important;
          }
          
          .navbar-container {
            display: flex !important;
            visibility: visible !important;
            padding: 0.5rem 3rem 0.5rem 1rem;
            position: relative;
          }
          
          .navbar-left {
            display: flex !important;
            flex: 1;
          }
          
          .navbar-center {
            display: none !important;
          }
          
          .navbar-right {
            display: flex !important;
            gap: 0.5rem;
            margin-right: 3rem;
          }
          
          .balance-display {
            display: flex !important;
            font-size: 0.7rem;
            padding: 0.3rem 0.5rem;
            gap: 0.2rem;
          }
          
          .balance-text {
            font-size: 0.7rem;
          }
          
          .mobile-menu-btn {
            display: flex !important;
            visibility: visible !important;
            position: absolute !important;
            right: 1rem !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 101 !important;
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
          
          .refresh-btn {
            width: 13px !important;
            height: 13px !important;
            font-size: 0.55rem !important;
            margin: 0 0 0 2px !important;
          }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0.5rem 3rem 0.5rem 0.75rem;
            display: flex !important;
            visibility: visible !important;
            position: relative;
          }
          
          .navbar {
            display: block !important;
            visibility: visible !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 100 !important;
          }
          
          .navbar-left {
            display: flex !important;
            flex: 1;
          }
          
          .navbar-center {
            display: none !important;
          }
          
          .navbar-right {
            display: flex !important;
            gap: 0.25rem;
            margin-right: 3rem;
            align-items: center;
          }
          
          .balance-display {
            display: flex !important;
            font-size: 0.4rem;
            padding: 0.15rem 0.25rem;
            gap: 0.05rem;
            min-width: fit-content;
            white-space: nowrap;
          }
          
          .balance-text {
            font-size: 0.4rem;
            font-weight: 700;
          }
          
          .mobile-menu-btn {
            display: flex !important;
            position: absolute !important;
            right: 0.75rem !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 101 !important;
          }
          
          .social-icons {
            gap: 0.3rem;
          }
          
          .social-icon {
            width: 20px;
            height: 20px;
          }
          
          .social-icon svg {
            width: 10px;
            height: 10px;
          }
          
          .wallet-connect-btn,
          .wallet-info {
            font-size: 0.4rem;
            padding: 0.15rem 0.2rem;
            height: 20px;
          }
          
          .wallet-address {
            font-size: 0.35rem;
          }
          
          .disconnect-btn {
            padding: 0.05rem 0.15rem;
            font-size: 0.4rem;
            min-width: 14px;
            height: 14px;
          }
          
          .refresh-btn {
            width: 8px !important;
            height: 8px !important;
            font-size: 0.35rem !important;
            margin: 0 0 0 1px !important;
          }
        }
        
        /* Games Dropdown Styling */
        .games-menu-container {
          position: relative;
        }
        
        .games-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
        }
        
        .games-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 6px;
          min-width: 140px;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          margin-top: 4px;
          backdrop-filter: blur(20px);
        }
        
        .games-option {
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
          font-family: inherit;
        }
        
        .games-option:last-child {
          border-bottom: none;
        }
        
        .games-option:hover {
          background: rgba(255, 107, 0, 0.1);
          color: #FF6B00;
        }
        
        .collection-option {
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
          font-family: inherit;
        }
        
        .collection-option:last-child {
          border-bottom: none;
        }
        
        .collection-option:hover {
          background: rgba(255, 107, 0, 0.1);
          color: #FF6B00;
        }
        
        /* Mobile Games Section */
        .mobile-games-section {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border-top: 1px solid rgba(255, 107, 0, 0.3);
          border-bottom: 1px solid rgba(255, 107, 0, 0.3);
          background: rgba(255, 107, 0, 0.05);
          border-radius: 8px;
        }
        
        .mobile-games-section .mobile-nav-link {
          margin-left: 1rem;
          border-left: 3px solid rgba(255, 107, 0, 0.5);
          padding-left: 1rem;
          background: rgba(255, 107, 0, 0.1) !important;
        }
        
        /* Collection Dropdown Styling */
        .collection-menu-container {
          position: relative;
        }
        
        .collection-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
        }
        
        .dropdown-arrow {
          font-size: 0.7rem;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .collection-btn:hover .dropdown-arrow,
        .games-btn:hover .dropdown-arrow {
          transform: translateY(-1px);
        }
        
        .collection-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 6px;
          min-width: 140px;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          margin-top: 4px;
          backdrop-filter: blur(20px);
        }
        
        .mobile-collection-section {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border-top: 1px solid rgba(255, 107, 0, 0.3);
          border-bottom: 1px solid rgba(255, 107, 0, 0.3);
          background: rgba(255, 107, 0, 0.05);
          border-radius: 8px;
        }
        
        .mobile-section-title {
          color: #FF6B00 !important;
          font-size: 0.8rem !important;
          font-weight: 700 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          padding: 0 0.25rem;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .mobile-collection-section .mobile-nav-link {
          margin-left: 1rem;
          border-left: 3px solid rgba(255, 107, 0, 0.5);
          padding-left: 1rem;
          background: rgba(255, 107, 0, 0.1) !important;
        }
      `}</style>
    </nav>
  )
} 