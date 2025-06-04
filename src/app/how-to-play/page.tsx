'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import JackpotBanner from '@/components/jackpot/JackpotBanner'

export default function HowToPlayPage() {
  const [activeTab, setActiveTab] = React.useState('getting-started')
  const [jackpotAmount, setJackpotAmount] = useState(0)
  const [isLoadingJackpot, setIsLoadingJackpot] = useState(true)

  useEffect(() => {
    // Fetch the current jackpot amount when the component mounts
    async function fetchJackpot() {
      setIsLoadingJackpot(true)
      try {
        const response = await fetch('/api/jackpot')
        const data = await response.json()
        
        if (data && data.amount) {
          setJackpotAmount(data.amount)
        } else {
          // Als er geen amount is, gebruik een fallback
          setJackpotAmount(5750000)
        }
      } catch (error) {
        console.error('Error fetching jackpot:', error)
        // Set a fallback amount if the API call fails
        setJackpotAmount(5750000)
      } finally {
        setIsLoadingJackpot(false)
      }
    }

    fetchJackpot()
    
    // Set up an interval to refresh the jackpot amount every 30 seconds
    const intervalId = setInterval(fetchJackpot, 30000)
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Format the jackpot amount with commas
  const formattedJackpot = new Intl.NumberFormat().format(jackpotAmount)

  return (
    <div className="howtoplay-container">
      <div className="howtoplay-header">
        <h1 className="pixel-title">How To Play BTC Tiger Chests</h1>
        <p className="howtoplay-intro">
          Learn how to connect your wallet, deposit funds, and start opening chests to win exciting prizes 
          including Bitcoin, rare artifacts, and the chance to hit the Jackpot.
        </p>
      </div>

      <div className="howtoplay-tabs-container">
        <div className="howtoplay-tabs">
          <button 
            className={`tab ${activeTab === 'getting-started' ? 'active' : ''}`}
            onClick={() => handleTabChange('getting-started')}
          >
            Getting Started
          </button>
          <button 
            className={`tab ${activeTab === 'wallets' ? 'active' : ''}`}
            onClick={() => handleTabChange('wallets')}
          >
            Wallets & Deposits
          </button>
          <button 
            className={`tab ${activeTab === 'chest-types' ? 'active' : ''}`}
            onClick={() => handleTabChange('chest-types')}
          >
            Chest Types
          </button>
          <button 
            className={`tab ${activeTab === 'jackpot' ? 'active' : ''}`}
            onClick={() => handleTabChange('jackpot')}
          >
            Jackpot System
          </button>
          <button 
            className={`tab ${activeTab === 'lightning' ? 'active' : ''}`}
            onClick={() => handleTabChange('lightning')}
          >
            Lightning Network
          </button>
          <button 
            className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => handleTabChange('rewards')}
          >
            Rewards & Prizes
          </button>
          <button 
            className={`tab ${activeTab === 'coinflip' ? 'active' : ''}`}
            onClick={() => handleTabChange('coinflip')}
          >
            Coinflip Game
          </button>
          <button 
            className={`tab ${activeTab === 'raffle' ? 'active' : ''}`}
            onClick={() => handleTabChange('raffle')}
          >
            Ordinals Raffle
          </button>
        </div>

        <div className="howtoplay-content">
          {/* Getting Started Tab */}
          <div className={`tab-content ${activeTab === 'getting-started' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Getting Started</h2>
              
              <div className="steps-container">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Connect Your Wallet</h3>
                    <p>Connect your Bitcoin wallet (Xverse or Magic Eden) to interact with BTC Tiger Collective games.</p>
                  </div>
                </div>
                
                <div className="step-card">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Set Up Lightning</h3>
                    <p>Download a Lightning wallet like Muun, Wallet of Satoshi, or Phoenix to enable fast and cheap transactions.</p>
                  </div>
                </div>
                
                <div className="step-card">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Transfer Sats</h3>
                    <p>Transfer sats from your Bitcoin wallet to your Lightning wallet for gaming.</p>
                  </div>
                </div>
                
                <div className="step-card">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Deposit to BTC Tiger</h3>
                    <p>Send sats from your Lightning wallet to Bitcoin Tiger Collective to fund your game balance.</p>
                  </div>
                </div>
                
                <div className="step-card">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Choose Your Chest</h3>
                    <p>Select from Bronze, Silver, or Gold chests based on your playing style and budget.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wallets & Deposits Tab */}
          <div className={`tab-content ${activeTab === 'wallets' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Wallets & Deposits</h2>
              
              <div className="wallets-grid">
                <div className="wallet-category">
                  <h3 className="category-title">Bitcoin Wallets</h3>
                  <div className="wallet-options">
                    <div className="wallet-option">
                      <Link href="https://www.xverse.app/" target="_blank" rel="noopener noreferrer" className="wallet-link">
                        <div className="wallet-info">
                          <div className="wallet-logo">
                            <Image src="/xverse.png" alt="Xverse Wallet" width={40} height={40} />
                          </div>
                          <div className="wallet-details">
                            <h4>Xverse Wallet</h4>
                            <p>Complete Bitcoin & Ordinals wallet</p>
                          </div>
                        </div>
                        <div className="wallet-badge recommended">Recommended</div>
                      </Link>
                    </div>
                    
                    <div className="wallet-option">
                      <Link href="https://magiceden.io/wallet" target="_blank" rel="noopener noreferrer" className="wallet-link">
                        <div className="wallet-info">
                          <div className="wallet-logo">
                            <Image src="/magiceden.png" alt="Magic Eden Wallet" width={40} height={40} />
                          </div>
                          <div className="wallet-details">
                            <h4>Magic Eden Wallet</h4>
                            <p>Ordinals & BRC-20 support</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="wallet-category">
                  <h3 className="category-title">Lightning Wallets</h3>
                  <div className="wallet-options">
                    <div className="wallet-option">
                      <Link href="https://muun.com/" target="_blank" rel="noopener noreferrer" className="wallet-link">
                        <div className="wallet-info">
                          <div className="wallet-logo">
                            <Image src="/muun.png" alt="Muun Wallet" width={40} height={40} />
                          </div>
                          <div className="wallet-details">
                            <h4>Muun Wallet</h4>
                            <p>Self-custodial Bitcoin & Lightning</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    
                    <div className="wallet-option">
                      <Link href="https://walletofsatoshi.com/" target="_blank" rel="noopener noreferrer" className="wallet-link">
                        <div className="wallet-info">
                          <div className="wallet-logo">
                            <Image src="/wos.png" alt="Wallet of Satoshi" width={40} height={40} />
                          </div>
                          <div className="wallet-details">
                            <h4>Wallet of Satoshi</h4>
                            <p>Simple & fast Lightning wallet</p>
                          </div>
                        </div>
                        <div className="wallet-badge easy">Easy to Use</div>
                      </Link>
                    </div>
                    
                    <div className="wallet-option">
                      <Link href="https://phoenix.acinq.co/" target="_blank" rel="noopener noreferrer" className="wallet-link">
                        <div className="wallet-info">
                          <div className="wallet-logo">
                            <Image src="/phoenix.png" alt="Phoenix Wallet" width={40} height={40} />
                          </div>
                          <div className="wallet-details">
                            <h4>Phoenix Wallet</h4>
                            <p>Advanced Lightning features</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="deposit-guide">
                <h3 className="guide-title">How to Deposit</h3>
                <div className="deposit-steps">
                  <div className="deposit-step">
                    <div className="step-icon">1</div>
                    <p>Install your preferred Lightning wallet from the options above</p>
                  </div>
                  <div className="deposit-step">
                    <div className="step-icon">2</div>
                    <p>In your Bitcoin wallet, send sats to your Lightning wallet address</p>
                  </div>
                  <div className="deposit-step">
                    <div className="step-icon">3</div>
                    <p>Wait for the transaction to confirm (usually 10-30 minutes)</p>
                  </div>
                  <div className="deposit-step">
                    <div className="step-icon">4</div>
                    <p>Once your sats are in your Lightning wallet, send them to Bitcoin Tiger Collective</p>
                  </div>
                  <div className="deposit-step">
                    <div className="step-icon">5</div>
                    <p>Your sats will be available in your game balance immediately</p>
                  </div>
                  <div className="deposit-step">
                    <div className="step-icon">6</div>
                    <p>Start playing and winning!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chest Types Tab */}
          <div className={`tab-content ${activeTab === 'chest-types' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Chest Types</h2>
              
              <div className="chests-container">
                <div className="chest-card bronze">
                  <div className="chest-image bronze-filter">
                    <Image src="/chestpixel.png" alt="Bronze Chest" width={120} height={120} />
                  </div>
                  <div className="chest-info">
                    <h3>Bronze Chest</h3>
                    <ul className="chest-features">
                      <li>Lowest entry cost</li>
                      <li>Perfect for beginners</li>
                      <li>1% chance at Jackpot</li>
                      <li>Common rewards</li>
                    </ul>
                  </div>
                </div>
                
                <div className="chest-card silver">
                  <div className="chest-image silver-filter">
                    <Image src="/chestpixel.png" alt="Silver Chest" width={120} height={120} />
                  </div>
                  <div className="chest-info">
                    <h3>Silver Chest</h3>
                    <ul className="chest-features">
                      <li>Medium entry cost</li>
                      <li>For regular players</li>
                      <li>2% chance at Jackpot</li>
                      <li>Uncommon rewards</li>
                    </ul>
                  </div>
                </div>
                
                <div className="chest-card gold">
                  <div className="chest-image gold-filter">
                    <Image src="/chestpixel.png" alt="Gold Chest" width={120} height={120} />
                  </div>
                  <div className="chest-info">
                    <h3>Gold Chest</h3>
                    <ul className="chest-features">
                      <li>Premium entry cost</li>
                      <li>For high rollers</li>
                      <li>Best chance at Jackpot</li>
                      <li>Rare rewards</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="chest-comparison">
                <h3 className="comparison-title">Chest Comparison</h3>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Chest Type</th>
                      <th>Entry Cost</th>
                      <th>Jackpot Chance</th>
                      <th>Reward Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bronze-row">
                      <td>Bronze</td>
                      <td>Low</td>
                      <td>1%</td>
                      <td>Common</td>
                    </tr>
                    <tr className="silver-row">
                      <td>Silver</td>
                      <td>Medium</td>
                      <td>2%</td>
                      <td>Uncommon</td>
                    </tr>
                    <tr className="gold-row">
                      <td>Gold</td>
                      <td>High</td>
                      <td>2%</td>
                      <td>Rare</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Jackpot System Tab */}
          <div className={`tab-content ${activeTab === 'jackpot' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Jackpot System</h2>
              
              <div className="jackpot-info">
                <div className="jackpot-component-wrapper">
                  <JackpotBanner />
                </div>
                
                <div className="jackpot-explanation">
                  <h3>How the Jackpot Works</h3>
                  
                  <div className="jackpot-steps">
                    <div className="jackpot-step">
                      <div className="step-icon">1</div>
                      <p>A small percentage of each chest purchase goes to the Jackpot pool</p>
                    </div>
                    <div className="jackpot-step">
                      <div className="step-icon">2</div>
                      <p>The Jackpot grows with every chest opened by all players</p>
                    </div>
                    <div className="jackpot-step">
                      <div className="step-icon">3</div>
                      <p>When you open a chest, you have a chance to win the entire Jackpot</p>
                    </div>
                    <div className="jackpot-step">
                      <div className="step-icon">4</div>
                      <p>Gold chests have the highest chance, followed by Silver and Bronze</p>
                    </div>
                    <div className="jackpot-step">
                      <div className="step-icon">5</div>
                      <p>When someone wins, the Jackpot resets and starts growing again</p>
                    </div>
                  </div>
                  
                  <div className="jackpot-note">
                    Check the current Jackpot amount on the <Link href="/" className="jackpot-link">Chests page</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lightning Network Tab */}
          <div className={`tab-content ${activeTab === 'lightning' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Lightning Network</h2>
              
              <div className="lightning-container">
                <div className="lightning-intro">
                  <div className="lightning-logo">
                    <Image src="/lightningnetwork.png" alt="Lightning Network" width={100} height={100} />
                  </div>
                  <div className="lightning-text">
                    <h3>Fast & Cheap Transactions</h3>
                    <p>Bitcoin Tiger Collective uses the Lightning Network for instant, low-fee Bitcoin transactions, making it perfect for gaming.</p>
                  </div>
                </div>
                
                <div className="lightning-benefits">
                  <div className="benefit-card">
                    <h4>Instant Deposits & Withdrawals</h4>
                    <p>No waiting for Bitcoin blockchain confirmations - transactions are instant!</p>
                  </div>
                  
                  <div className="benefit-card">
                    <h4>Minimal Transaction Fees</h4>
                    <p>Lightning Network fees are a tiny fraction of regular Bitcoin transactions.</p>
                  </div>
                  
                  <div className="benefit-card">
                    <h4>Secure Payments</h4>
                    <p>Benefit from Bitcoin's security while enjoying the speed of Lightning.</p>
                  </div>
                  
                  <div className="benefit-card">
                    <h4>Perfect for Gaming</h4>
                    <p>The fast settlement time makes Lightning ideal for gaming platforms.</p>
                  </div>
                </div>
                
                <div className="lightning-resources">
                  <h3>Lightning Resources</h3>
                  <div className="resources-grid">
                    <Link href="https://lightning.network/" target="_blank" rel="noopener noreferrer" className="resource-link">
                      <div className="resource-card">
                        <h4>Lightning Network Official Site</h4>
                        <p>Learn more about how Lightning works</p>
                      </div>
                    </Link>
                    
                    <Link href="https://amboss.space/" target="_blank" rel="noopener noreferrer" className="resource-link">
                      <div className="resource-card">
                        <h4>Amboss Explorer</h4>
                        <p>Explore Lightning Network statistics</p>
                      </div>
                    </Link>
                    
                    <Link href="https://www.youtube.com/watch?v=rrr_zPmEiME" target="_blank" rel="noopener noreferrer" className="resource-link">
                      <div className="resource-card">
                        <h4>Lightning Explained</h4>
                        <p>Video explainer for beginners</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rewards & Prizes Tab */}
          <div className={`tab-content ${activeTab === 'rewards' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Rewards & Prizes</h2>
              
              <div className="rewards-container">
                <div className="rewards-intro">
                  <h3>What Can You Win?</h3>
                  <p>Bitcoin Tiger Collective offers exciting Bitcoin rewards when you open chests. Win instant sats or hit the jackpot - every chest has a chance to win big!</p>
                </div>
                
                <div className="rewards-grid">
                  <div className="reward-card">
                    <div className="reward-icon">
                      <span className="reward-icon-placeholder">₿</span>
                    </div>
                    <div className="reward-info">
                      <h4>Bitcoin Rewards</h4>
                      <p>Win instant sats payouts directly to your wallet - the higher the chest tier, the bigger the potential reward!</p>
                    </div>
                  </div>
                  
                  <div className="reward-card">
                    <div className="reward-icon">
                      <span className="reward-icon-placeholder">💰</span>
                    </div>
                    <div className="reward-info">
                      <h4>Jackpot Wins</h4>
                      <p>Every chest has a chance to win the entire accumulated Jackpot, with Gold chests having the highest probability!</p>
                    </div>
                  </div>
                </div>
                
                <div className="odds-info">
                  <h3>Improving Your Chances</h3>
                  <div className="odds-text">
                    <p>The more you play, the better your chances of winning big rewards!</p>
                    <ul className="odds-list">
                      <li>Gold chests have the highest payout and 2% jackpot chance</li>
                      <li>Silver chests offer balanced risk/reward with 2% jackpot chance</li>
                      <li>Bronze chests are low cost with 1% jackpot chance</li>
                      <li>Every chest you open contributes to the growing jackpot!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coinflip Tab */}
          <div className={`tab-content ${activeTab === 'coinflip' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Coinflip Game</h2>
              
              <div className="coinflip-container">
                <div className="coinflip-intro">
                  <h3>Test Your Luck with Coinflip</h3>
                  <p>Our Coinflip game offers a simple but exciting way to double your sats. Choose heads or tails and place your bet!</p>
                </div>
                
                <div className="coinflip-demo">
                  <div className="coinflip-image">
                    <Image src="/tiger-logo.png" alt="Bitcoin Tiger" width={180} height={180} />
                  </div>
                </div>
                
                <div className="coinflip-steps">
                  <div className="coinflip-step">
                    <div className="step-icon">1</div>
                    <div className="step-content">
                      <h3>Choose Your Side</h3>
                      <p>Select either Heads or Tails as your prediction for the coin flip.</p>
                    </div>
                  </div>
                  
                  <div className="coinflip-step">
                    <div className="step-icon">2</div>
                    <div className="step-content">
                      <h3>Select Bet Amount</h3>
                      <p>Choose how many sats you want to bet from the preset amounts or enter a custom value.</p>
                    </div>
                  </div>
                  
                  <div className="coinflip-step">
                    <div className="step-icon">3</div>
                    <div className="step-content">
                      <h3>Flip the Coin</h3>
                      <p>Click the Flip button and watch the animation as the coin determines your fate.</p>
                    </div>
                  </div>
                  
                  <div className="coinflip-step">
                    <div className="step-icon">4</div>
                    <div className="step-content">
                      <h3>Win or Lose</h3>
                      <p>If your prediction is correct, you win 1.94x your bet amount. If not, you lose your bet.</p>
                    </div>
                  </div>
                </div>
                
                <div className="coinflip-features">
                  <div className="feature-card">
                    <h3>Fair Play</h3>
                    <p>Our coin flip uses a provably fair random system to ensure completely unbiased results.</p>
                  </div>
                  
                  <div className="feature-card">
                    <h3>Instant Results</h3>
                    <p>No waiting - see your win or loss immediately after the coin flip animation.</p>
                  </div>
                  
                  <div className="feature-card">
                    <h3>Almost Double</h3>
                    <p>1.94x multiplier on all wins - slightly under 2x for a fair house edge.</p>
                  </div>
                </div>
                
                <div className="coinflip-note">
                  <p>Ready to try your luck? Visit the <Link href="/jackpot" className="coinflip-link">Coinflip page</Link> to start playing!</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Raffle Tab */}
          <div className={`tab-content ${activeTab === 'raffle' ? 'active' : ''}`}>
            <div className="howtoplay-section">
              <h2 className="section-title">Ordinals Raffle</h2>
              
              <div className="raffle-container">
                <div className="raffle-intro">
                  <h3>Win Exclusive Bitcoin Tiger Ordinals</h3>
                  <p>Participate in our raffles to win exclusive Bitcoin Tiger Ordinals and other rare digital artifacts using your Lightning balance.</p>
                </div>
                
                <div className="raffle-demo">
                  <div className="raffle-image">
                    <Image src="/tiger-logo.png" alt="Bitcoin Tiger Ordinal" width={180} height={180} />
                  </div>
                </div>
                
                <div className="raffle-steps">
                  <div className="raffle-step">
                    <div className="step-icon">1</div>
                    <div className="step-content">
                      <h3>Browse Available Raffles</h3>
                      <p>Explore our selection of exclusive Bitcoin Tiger Ordinals available in the raffle system.</p>
                    </div>
                  </div>
                  
                  <div className="raffle-step">
                    <div className="step-icon">2</div>
                    <div className="step-content">
                      <h3>Purchase Tickets</h3>
                      <p>Use your Lightning balance to purchase raffle tickets. Each ticket gives you a chance to win!</p>
                    </div>
                  </div>
                  
                  <div className="raffle-step">
                    <div className="step-icon">3</div>
                    <div className="step-content">
                      <h3>Wait for the Drawing</h3>
                      <p>Raffles run for a limited time. Once the raffle period ends, a winner is randomly selected.</p>
                    </div>
                  </div>
                  
                  <div className="raffle-step">
                    <div className="step-icon">4</div>
                    <div className="step-content">
                      <h3>Claim Your Prize</h3>
                      <p>If you win, the Bitcoin Tiger Ordinal will be automatically transferred to your wallet!</p>
                    </div>
                  </div>
                </div>
                
                <div className="raffle-features">
                  <div className="raffle-feature-card">
                    <h3>Exclusive Access</h3>
                    <p>Get access to rare Bitcoin Tiger Ordinals that are only available through our raffle system.</p>
                  </div>
                  
                  <div className="raffle-feature-card">
                    <h3>Fair Distribution</h3>
                    <p>Our provably fair selection system ensures every ticket has an equal chance of winning.</p>
                  </div>
                  
                  <div className="raffle-feature-card">
                    <h3>Low Entry Cost</h3>
                    <p>Ticket prices are kept affordable so everyone has a chance to participate and win.</p>
                  </div>
                </div>
                
                <div className="raffle-note">
                  <p>Ready to try your luck? Visit the <Link href="/raffle" className="raffle-link">Raffle page</Link> to start buying tickets!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="pixel-footer">
        <p className="pixel-footer-text">
          ⚡ Powered by Bitcoin Lightning Network ⚡
        </p>
        <p className="pixel-footer-subtext">
          Bitcoin Tiger Collective
        </p>
      </footer>

      <style jsx>{`
        .howtoplay-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
          color: white;
          font-family: 'Press Start 2P', monospace;
        }
        
        .howtoplay-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 2rem;
        }
        
        .pixel-title {
          font-size: 2.5rem;
          color: var(--gold);
          margin-bottom: 1.5rem;
          text-shadow: var(--pixel-size) var(--pixel-size) #000;
          letter-spacing: 2px;
        }
        
        .howtoplay-intro {
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.8;
          font-size: 0.9rem;
          color: #ccc;
        }
        
        .howtoplay-tabs-container {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(13, 19, 32, 0.7));
          border: 2px solid var(--gold);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 4rem;
          position: relative;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .howtoplay-tabs {
          display: flex;
          flex-wrap: wrap;
          border-bottom: 2px solid var(--gold);
          background: rgba(0, 0, 0, 0.5);
        }
        
        .tab {
          background: transparent;
          border: none;
          color: #ccc;
          padding: 1rem 1.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-right: 1px solid rgba(255, 215, 0, 0.3);
          position: relative;
          outline: none;
        }
        
        .tab:hover {
          color: var(--gold);
          background: rgba(255, 215, 0, 0.05);
        }
        
        .tab.active {
          color: var(--gold);
          background: rgba(0, 0, 0, 0.7);
        }
        
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--gold);
        }
        
        .howtoplay-content {
          padding: 2rem;
          min-height: 500px;
        }
        
        .tab-content {
          display: none;
          animation: fadeIn 0.5s ease;
        }
        
        .tab-content.active {
          display: block;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .howtoplay-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          color: var(--gold);
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          text-shadow: 1px 1px #000;
        }
        
        .pixel-footer {
          text-align: center;
          padding: 2rem 1rem;
          margin-top: 4rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .pixel-footer-text {
          color: var(--gold);
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .pixel-footer-subtext {
          color: #aaa;
          font-size: 0.8rem;
        }
        
        /* Getting Started Tab Styles */
        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .step-card {
          background: linear-gradient(135deg, #000000, #0d1320);
          border: 2px solid var(--gold);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        .step-number {
          background: var(--gold);
          color: #000;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          font-weight: bold;
          margin-right: 1rem;
          flex-shrink: 0;
          font-family: Arial, sans-serif;
        }
        
        .step-content {
          flex: 1;
        }
        
        .step-content h3 {
          color: var(--gold);
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .step-content p {
          color: #ccc;
          font-size: 0.8rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        /* Wallets & Deposits Tab Styles */
        .wallets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .wallet-category {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .category-title {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 1px 1px #000;
        }
        
        .wallet-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .wallet-option {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .wallet-option:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .wallet-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          text-decoration: none;
          color: white;
        }
        
        .wallet-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .wallet-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          padding: 0.5rem;
          overflow: hidden;
        }
        
        .wallet-details {
          font-family: Arial, sans-serif;
        }
        
        .wallet-details h4 {
          font-size: 1rem;
          margin-bottom: 0.3rem;
          color: white;
        }
        
        .wallet-details p {
          font-size: 0.8rem;
          color: #aaa;
        }
        
        .wallet-badge {
          background: var(--gold);
          color: #000;
          font-size: 0.7rem;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }
        
        .wallet-badge.easy {
          background: #4CAF50;
        }
        
        .deposit-guide {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .guide-title {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 1px 1px #000;
        }
        
        .deposit-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .deposit-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .deposit-step:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: translateY(-3px);
        }
        
        .step-icon {
          background: var(--gold);
          color: #000;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.9rem;
          font-weight: bold;
          flex-shrink: 0;
          font-family: Arial, sans-serif;
        }
        
        .deposit-step p {
          color: #ccc;
          font-size: 0.8rem;
          line-height: 1.6;
          margin: 0;
          font-family: Arial, sans-serif;
        }
        
        /* Chest Types Tab Styles */
        .chests-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .chest-card {
          background: linear-gradient(135deg, #000000, #0d1320);
          border: 3px solid;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .chest-card:hover {
          transform: translateY(-8px);
        }
        
        .chest-card.bronze {
          border-color: var(--bronze);
        }
        
        .chest-card.bronze:hover {
          box-shadow: 0 0 20px rgba(205, 127, 50, 0.7);
        }
        
        .chest-card.silver {
          border-color: var(--silver);
        }
        
        .chest-card.silver:hover {
          box-shadow: 0 0 20px rgba(192, 192, 192, 0.7);
        }
        
        .chest-card.gold {
          border-color: var(--gold);
        }
        
        .chest-card.gold:hover {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
        }
        
        .chest-image {
          margin-bottom: 1.5rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: visible;
        }
        
        .chest-image::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.1) 0%,
            rgba(255, 215, 0, 0.05) 30%,
            transparent 70%
          );
          animation: rotate 10s linear infinite;
        }
        
        .chest-card.bronze .chest-image::before {
          background: radial-gradient(
            circle at center,
            rgba(205, 127, 50, 0.1) 0%,
            rgba(205, 127, 50, 0.05) 30%,
            transparent 70%
          );
        }
        
        .chest-card.silver .chest-image::before {
          background: radial-gradient(
            circle at center,
            rgba(192, 192, 192, 0.1) 0%,
            rgba(192, 192, 192, 0.05) 30%,
            transparent 70%
          );
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .chest-info {
          text-align: center;
          width: 100%;
        }
        
        .chest-info h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        
        .chest-card.bronze h3 {
          color: var(--bronze);
        }
        
        .chest-card.silver h3 {
          color: var(--silver);
        }
        
        .chest-card.gold h3 {
          color: var(--gold);
        }
        
        .chest-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .chest-features li {
          padding: 0.5rem 0;
          position: relative;
          font-size: 0.8rem;
          line-height: 1.4;
          color: #ccc;
          font-family: Arial, sans-serif;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .chest-features li:last-child {
          border-bottom: none;
        }
        
        .chest-comparison {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .comparison-title {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 1px 1px #000;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-family: Arial, sans-serif;
        }
        
        .comparison-table th {
          background: rgba(0, 0, 0, 0.5);
          color: var(--gold);
          padding: 0.8rem;
          text-align: left;
          font-size: 0.9rem;
        }
        
        .comparison-table td {
          padding: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
          color: #ccc;
        }
        
        .bronze-row td:first-child {
          color: var(--bronze);
        }
        
        .silver-row td:first-child {
          color: var(--silver);
        }
        
        .gold-row td:first-child {
          color: var(--gold);
        }
        
        /* Jackpot System Tab Styles */
        .jackpot-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .jackpot-component-wrapper {
          width: 100%;
          margin: 0 auto;
        }
        
        .jackpot-live-display {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(20, 20, 20, 0.6));
          border: 2px solid var(--gold);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
        }
        
        .jackpot-live-display::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.1) 0%,
            rgba(255, 215, 0, 0.05) 30%,
            transparent 70%
          );
          animation: pulse 3s ease-in-out infinite;
        }
        
        .jackpot-label {
          font-family: 'Press Start 2P', monospace;
          color: var(--gold);
          font-size: 1rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
          position: relative;
          z-index: 1;
        }
        
        .jackpot-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.8rem;
          position: relative;
          z-index: 1;
        }
        
        .jackpot-amount {
          color: #FFD700;
          font-weight: bold;
          animation: glow 2s infinite;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
        }
        
        .jackpot-currency {
          font-size: 1rem;
          opacity: 0.8;
          color: var(--gold);
        }
        
        .jackpot-loading {
          font-family: 'Press Start 2P', monospace;
          color: var(--gold);
          font-size: 1rem;
          position: relative;
          z-index: 1;
        }
        
        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
          100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        
        .jackpot-explanation h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-shadow: 1px 1px #000;
        }
        
        .jackpot-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .jackpot-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .jackpot-step:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: translateX(5px);
        }
        
        .jackpot-step p {
          color: #ccc;
          font-size: 0.8rem;
          line-height: 1.6;
          margin: 0;
          font-family: Arial, sans-serif;
        }
        
        .jackpot-note {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 8px;
          text-align: center;
          font-family: Arial, sans-serif;
          font-size: 0.9rem;
          color: #eee;
        }
        
        .jackpot-link {
          color: var(--gold);
          text-decoration: underline;
          transition: all 0.3s ease;
        }
        
        .jackpot-link:hover {
          text-decoration: none;
          color: #fff;
        }
        
        /* Lightning Network Tab Styles */
        .lightning-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .lightning-intro {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .lightning-logo {
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        
        .lightning-logo::after {
          content: '';
          position: absolute;
          width: 150%;
          height: 150%;
          background: conic-gradient(
            rgba(255, 215, 0, 0.1),
            rgba(255, 215, 0, 0),
            rgba(255, 215, 0, 0.1),
            rgba(255, 215, 0, 0)
          );
          animation: rotate 8s linear infinite;
        }
        
        .lightning-text {
          flex: 1;
        }
        
        .lightning-text h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px #000;
        }
        
        .lightning-text p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .lightning-benefits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .benefit-card {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .benefit-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .benefit-card h4 {
          color: var(--gold);
          font-size: 1rem;
          margin-bottom: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
        }
        
        .benefit-card p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .lightning-resources {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .lightning-resources h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 1px 1px #000;
        }
        
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .resource-card {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          height: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .resource-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }
        
        .resource-link:hover .resource-card {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .resource-card h4 {
          color: var(--gold);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .resource-card p {
          color: #ccc;
          font-size: 0.8rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        /* Rewards & Prizes Tab Styles */
        .rewards-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .rewards-intro {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .rewards-intro h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px #000;
        }
        
        .rewards-intro p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .reward-card {
          background: linear-gradient(135deg, #000000, #0d1320);
          border: 2px solid var(--gold);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .reward-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        .reward-icon {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }
        
        .reward-info {
          flex: 1;
        }
        
        .reward-info h4 {
          color: var(--gold);
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .reward-info p {
          color: #ccc;
          font-size: 0.8rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .odds-info {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .odds-info h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-align: center;
          text-shadow: 1px 1px #000;
        }
        
        .odds-text {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .odds-text p {
          margin-bottom: 1rem;
        }
        
        .odds-list {
          padding-left: 1.5rem;
        }
        
        .odds-list li {
          padding: 0.5rem 0;
          font-size: 0.9rem;
          color: #ccc;
        }
        
        /* Coinflip Tab Styles */
        .coinflip-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .coinflip-intro {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .coinflip-intro h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px #000;
        }
        
        .coinflip-intro p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        
        .coinflip-demo {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 1rem 0;
        }
        
        .coinflip-image {
          position: relative;
          width: 180px;
          height: 180px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          overflow: hidden;
        }
        
        .coinflip-image::after {
          content: '';
          position: absolute;
          width: 150%;
          height: 150%;
          background: linear-gradient(
            transparent 0%,
            rgba(255, 215, 0, 0.1) 45%,
            rgba(255, 215, 0, 0.2) 50%,
            rgba(255, 215, 0, 0.1) 55%,
            transparent 100%
          );
          animation: coinflip-shine 2s ease-in-out infinite;
        }
        
        @keyframes coinflip-shine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .coinflip-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        .coinflip-step {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.3s ease;
        }
        
        .coinflip-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
        }
        
        .coinflip-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        .feature-card {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
        }
        
        .feature-card h3 {
          color: var(--gold);
          font-size: 1.1rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px #000;
        }
        
        .feature-card p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .coinflip-note {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          margin-top: 1rem;
        }
        
        .coinflip-note p {
          color: #eee;
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .coinflip-link {
          color: var(--gold);
          text-decoration: underline;
          transition: all 0.3s ease;
        }
        
        .coinflip-link:hover {
          color: white;
        }
        
        /* Raffle Tab Styles */
        .raffle-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .raffle-intro {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .raffle-intro h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px #000;
        }
        
        .raffle-intro p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        
        .raffle-demo {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 1rem 0;
        }
        
        .raffle-image {
          position: relative;
          width: 180px;
          height: 180px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          overflow: hidden;
        }
        
        .raffle-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.1) 0%,
            rgba(255, 215, 0, 0.05) 30%,
            transparent 70%
          );
          animation: pulse 3s ease-in-out infinite;
        }
        
        .raffle-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        .raffle-step {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.3s ease;
        }
        
        .raffle-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
        }
        
        .raffle-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        .raffle-feature-card {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .raffle-feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
        }
        
        .raffle-feature-card h3 {
          color: var(--gold);
          font-size: 1.1rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px #000;
        }
        
        .raffle-feature-card p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .raffle-note {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          margin-top: 1rem;
        }
        
        .raffle-note p {
          color: #eee;
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: Arial, sans-serif;
        }
        
        .raffle-link {
          color: var(--gold);
          text-decoration: underline;
          transition: all 0.3s ease;
        }
        
        .raffle-link:hover {
          color: white;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .howtoplay-container {
            padding: 1rem;
          }
          
          .pixel-title {
            font-size: 1.8rem;
            margin-top: 2rem;
          }
          
          .howtoplay-intro {
            font-size: 0.8rem;
            line-height: 1.6;
          }
          
          .howtoplay-tabs {
            flex-direction: column;
            border-bottom: none;
          }
          
          .tab {
            border-right: none;
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);
            text-align: left;
            padding: 0.8rem 1rem;
          }
          
          .tab.active::after {
            display: none;
          }
          
          .howtoplay-content {
            padding: 1.5rem;
          }
          
          .steps-container,
          .wallets-grid,
          .deposit-steps,
          .chests-container,
          .jackpot-info,
          .lightning-benefits,
          .resources-grid,
          .rewards-grid {
            grid-template-columns: 1fr;
          }
          
          .jackpot-info {
            grid-template-columns: 1fr;
          }
          
          .jackpot-illustration {
            margin-bottom: 1.5rem;
          }
          
          .lightning-intro {
            flex-direction: column;
            text-align: center;
          }
          
          .lightning-logo {
            margin: 0 auto 1.5rem;
          }
          
          .comparison-table th,
          .comparison-table td {
            padding: 0.6rem;
            font-size: 0.8rem;
          }
          
          .reward-card {
            flex-direction: column;
            text-align: center;
          }
          
          .reward-icon {
            margin: 0 auto 1rem;
          }
          
          .chests-container {
            padding: 0 1rem;
          }
          
          .chest-card {
            width: 100%;
            max-width: 280px;
            margin: 0 auto 2rem;
            padding: 1rem;
          }
          
          .chest-image {
            width: 100%;
            max-width: 150px;
            height: 150px;
            padding: 0.5rem;
            margin: 0 auto 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .chest-image img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
          }
        }
        
        @media (max-width: 480px) {
          .pixel-title {
            font-size: 1.5rem;
          }
          
          .howtoplay-intro {
            font-size: 0.7rem;
          }
          
          .section-title {
            font-size: 1.3rem;
          }
          
          .tab {
            font-size: 0.65rem;
            padding: 0.7rem;
          }
          
          .step-card, 
          .wallet-category,
          .deposit-guide,
          .chest-comparison,
          .jackpot-info,
          .lightning-intro,
          .lightning-resources,
          .rewards-intro,
          .odds-info {
            padding: 1rem;
          }
          
          .step-number, 
          .step-icon {
            width: 30px;
            height: 30px;
            font-size: 0.8rem;
          }
          
          .step-content h3,
          .category-title,
          .guide-title,
          .comparison-title,
          .jackpot-explanation h3,
          .lightning-text h3,
          .rewards-intro h3,
          .odds-info h3 {
            font-size: 1rem;
          }
          
          .wallet-details h4,
          .chest-info h3,
          .benefit-card h4,
          .resource-card h4,
          .reward-info h4 {
            font-size: 0.9rem;
          }
          
          .wallet-details p,
          .step-content p,
          .deposit-step p,
          .chest-features li,
          .jackpot-step p,
          .lightning-text p,
          .benefit-card p,
          .resource-card p,
          .odds-text,
          .odds-list li,
          .reward-info p {
            font-size: 0.75rem;
          }
          
          .chest-card {
            max-width: 240px;
          }
          
          .chest-image {
            padding: 0.8rem;
          }
          
          .chest-image img {
            width: 80px;
            height: 80px;
          }
          
          .chest-card {
            max-width: 220px;
            padding: 0.8rem;
          }
          
          .chest-image {
            max-width: 120px;
            height: 120px;
            padding: 0.5rem;
          }
        }
        
        .wallet-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: var(--gold);
        }
        
        .jackpot-placeholder {
          width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 50%;
          font-family: 'Press Start 2P', monospace;
          font-size: 1.5rem;
          color: var(--gold);
          position: relative;
          z-index: 1;
        }
        
        .bronze-filter img {
          filter: sepia(0.5) hue-rotate(355deg) saturate(1.2);
        }
        
        .silver-filter img {
          filter: saturate(0) brightness(1.2);
        }
        
        .gold-filter img {
          filter: sepia(0.8) hue-rotate(320deg) saturate(3);
        }

        .reward-icon-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          font-size: 2rem;
        }
      `}</style>
    </div>
  )
} 