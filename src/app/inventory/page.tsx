'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/context/WalletContext'
import Image from 'next/image'
import Link from 'next/link'

interface UserStats {
  totalCasts: number
  energyPoints: number
  crystalShards: number
  rareFinds: number
}

interface UserUpgrades {
  cooldownReduction: number // hours reduced from 24h cooldown
  rareChance: number // % bonus chance for rare items
  extraCasts: number // bonus casts per day
  autoCollect: boolean // auto-collect daily rewards
  luckyStreak: number // streak multiplier
}

interface ShopItem {
  id: string
  name: string
  description: string
  icon: string
  cost: {
    energyPoints?: number
    crystalShards?: number
    rareFinds?: number
  }
  category: 'cooldown' | 'luck' | 'chests' | 'permanent' | 'consumable' | 'tigers'
  effect: string
  maxLevel?: number
}

const SHOP_ITEMS: ShopItem[] = [
  // Energy Point Items
  {
    id: 'cooldown_1h',
    name: 'Time Acceleration I',
    description: 'Reduce spell cooldown by 1 hour',
    icon: '⏰',
    cost: { energyPoints: 5 },
    category: 'cooldown',
    effect: 'Reduces next cooldown by 1 hour'
  },
  {
    id: 'cooldown_4h',
    name: 'Time Acceleration II',
    description: 'Reduce spell cooldown by 4 hours',
    icon: '⏰',
    cost: { energyPoints: 15 },
    category: 'cooldown',
    effect: 'Reduces next cooldown by 4 hours'
  },
  {
    id: 'lucky_boost',
    name: 'Lucky Charm',
    description: 'Increase rare item chance for next 3 casts',
    icon: '🍀',
    cost: { energyPoints: 10 },
    category: 'luck',
    effect: '+25% rare chance for 3 casts'
  },
  
  // Crystal Shard Items
  {
    id: 'bronze_key',
    name: 'Bronze Chest Key',
    description: 'Instantly open a Bronze Chest',
    icon: '🔑',
    cost: { crystalShards: 8 },
    category: 'chests',
    effect: 'Opens 1 Bronze Chest'
  },
  {
    id: 'silver_key',
    name: 'Silver Chest Key',
    description: 'Instantly open a Silver Chest',
    icon: '🗝️',
    cost: { crystalShards: 25 },
    category: 'chests',
    effect: 'Opens 1 Silver Chest'
  },
  {
    id: 'gold_key',
    name: 'Gold Chest Key',
    description: 'Instantly open a Gold Chest',
    icon: '🔐',
    cost: { crystalShards: 75 },
    category: 'chests',
    effect: 'Opens 1 Gold Chest'
  },
  {
    id: 'tiger_buff',
    name: 'Tiger Energy Boost',
    description: 'Double mission rewards for 24 hours',
    icon: '🐅',
    cost: { crystalShards: 30 },
    category: 'consumable',
    effect: '2x mission rewards for 24h'
  },
  
  // Tiger Minting
  {
    id: 'mint_tiger',
    name: 'Tiger Mint',
    description: 'Mint a new Tiger NFT',
    icon: '🐅',
    cost: { crystalShards: 1000 },
    category: 'tigers',
    effect: 'Mints 1 Tiger NFT'
  },
  
  // Rare Ancient Relic Items
  {
    id: 'permanent_luck',
    name: 'Ancient Luck Rune',
    description: 'Permanently increase rare item chance by 5%',
    icon: '🔮',
    cost: { rareFinds: 1 },
    category: 'permanent',
    effect: '+5% permanent rare chance',
    maxLevel: 10
  },
  {
    id: 'extra_cast',
    name: 'Mystic Catalyst',
    description: 'Gain +1 spell cast per day (permanent)',
    icon: '⚡',
    cost: { rareFinds: 2 },
    category: 'permanent',
    effect: '+1 daily spell cast',
    maxLevel: 3
  },
  {
    id: 'auto_collect',
    name: 'Spectral Assistant',
    description: 'Automatically collect daily rewards',
    icon: '👻',
    cost: { rareFinds: 3 },
    category: 'permanent',
    effect: 'Auto-collect daily rewards'
  }
]

export default function InventoryPage() {
  const { walletAddress } = useWallet()
  const [userStats, setUserStats] = useState<UserStats>({
    totalCasts: 0,
    energyPoints: 0,
    crystalShards: 0,
    rareFinds: 0
  })
  const [userUpgrades, setUserUpgrades] = useState<UserUpgrades>({
    cooldownReduction: 0,
    rareChance: 0,
    extraCasts: 0,
    autoCollect: false,
    luckyStreak: 0
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)

  useEffect(() => {
    if (walletAddress) {
      loadUserData()
    }
  }, [walletAddress])

  const loadUserData = () => {
    if (!walletAddress) return
    
    // Load mining stats
    const stored = localStorage.getItem(`mining_stats_${walletAddress}`)
    if (stored) {
      setUserStats(JSON.parse(stored))
    }
    
    // Load upgrades
    const upgrades = localStorage.getItem(`mining_upgrades_${walletAddress}`)
    if (upgrades) {
      setUserUpgrades(JSON.parse(upgrades))
    }
  }

  const saveUserData = (newStats: UserStats, newUpgrades: UserUpgrades) => {
    if (!walletAddress) return
    localStorage.setItem(`mining_stats_${walletAddress}`, JSON.stringify(newStats))
    localStorage.setItem(`mining_upgrades_${walletAddress}`, JSON.stringify(newUpgrades))
    setUserStats(newStats)
    setUserUpgrades(newUpgrades)
  }

  const canAfford = (item: ShopItem): boolean => {
    const cost = item.cost
    if (cost.energyPoints && userStats.energyPoints < cost.energyPoints) return false
    if (cost.crystalShards && userStats.crystalShards < cost.crystalShards) return false
    if (cost.rareFinds && userStats.rareFinds < cost.rareFinds) return false
    return true
  }

  const handlePurchase = (item: ShopItem) => {
    if (!canAfford(item)) return
    
    setSelectedItem(item)
    setShowPurchaseModal(true)
  }

  const confirmPurchase = () => {
    if (!selectedItem || !walletAddress) return
    
    const cost = selectedItem.cost
    const newStats = { ...userStats }
    const newUpgrades = { ...userUpgrades }
    
    // Deduct costs
    if (cost.energyPoints) newStats.energyPoints -= cost.energyPoints
    if (cost.crystalShards) newStats.crystalShards -= cost.crystalShards
    if (cost.rareFinds) newStats.rareFinds -= cost.rareFinds
    
    // Apply effects based on item type
    switch (selectedItem.id) {
      case 'cooldown_1h':
        newUpgrades.cooldownReduction += 1
        break
      case 'cooldown_4h':
        newUpgrades.cooldownReduction += 4
        break
      case 'permanent_luck':
        newUpgrades.rareChance += 5
        break
      case 'extra_cast':
        newUpgrades.extraCasts += 1
        break
      case 'auto_collect':
        newUpgrades.autoCollect = true
        break
      case 'mint_tiger':
        // Tiger minting would be handled by backend
        alert(`Successfully minted ${selectedItem.name.split(' ')[0]} Tiger! Check your collection.`)
        break
      // Add more cases for other items
    }
    
    saveUserData(newStats, newUpgrades)
    setShowPurchaseModal(false)
    setSelectedItem(null)
  }

  const getCategoryItems = () => {
    if (selectedCategory === 'all') return SHOP_ITEMS
    return SHOP_ITEMS.filter(item => item.category === selectedCategory)
  }

  const getCostDisplay = (cost: ShopItem['cost']) => {
    const parts = []
    if (cost.energyPoints) {
      parts.push(
        <span key="energy" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {cost.energyPoints}
          <Image
            src="/bolt.png"
            alt="Energy"
            width={24}
            height={24}
            unoptimized
          />
        </span>
      )
    }
    if (cost.crystalShards) {
      parts.push(
        <span key="shards" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {cost.crystalShards}
          <Image
            src="/shards.png"
            alt="Crystal Shards"
            width={24}
            height={24}
            unoptimized
          />
        </span>
      )
    }
    if (cost.rareFinds) {
      parts.push(
        <span key="relics" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {cost.rareFinds}
          <Image
            src="/ancientrelic.png"
            alt="Ancient Relics"
            width={24}
            height={24}
            unoptimized
          />
        </span>
      )
    }
    
    return parts.length > 1 ? (
      <span>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && ' + '}
          </span>
        ))}
      </span>
    ) : parts[0]
  }

  return (
    <div className="inventory-page">
      {/* Background */}
      <div className="page-background">
        <Image
          src="/lab.png"
          alt="Inventory Background"
          fill
          style={{ objectFit: 'cover', opacity: 0.1 }}
          unoptimized
        />
      </div>

      {/* Navigation */}
      <div className="nav-header">
        <Link href="/mining" className="back-link">
          ← Back to Mining
        </Link>
        <h1>🎒 Mystical Inventory</h1>
      </div>

      {/* Cross-Promotion Banners */}
      <div className="promo-section">
        <div className="promo-grid">
          <a href="https://bitcointigercollective.xyz/jackpot" target="_blank" rel="noopener noreferrer" className="promo-card coinflip">
            <div className="promo-icon">🪙</div>
            <div className="promo-content">
              <h3>Coinflip Casino</h3>
              <p>Double your sats instantly!</p>
              <div className="promo-cta">Play Now →</div>
            </div>
          </a>
          
          <a href="https://bitcointigercollective.xyz" target="_blank" rel="noopener noreferrer" className="promo-card chests">
            <div className="promo-icon">📦</div>
            <div className="promo-content">
              <h3>Mystery Chests</h3>
              <p>Rare prizes & big wins!</p>
              <div className="promo-cta">Open Chests →</div>
            </div>
          </a>
          
          <Link href="/marketplace" className="promo-card marketplace">
            <div className="promo-icon">🏪</div>
            <div className="promo-content">
              <h3>Shard Marketplace</h3>
              <p>Trade shards for sats!</p>
              <div className="promo-cta">Coming Soon</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Resource Display */}
      <div className="resources-panel">
        <div className="resource-item">
          <div className="resource-icon">
            <Image
              src="/bolt.png"
              alt="Energy"
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <div className="resource-info">
            <div className="resource-amount">{userStats.energyPoints}</div>
            <div className="resource-name">Energy Points</div>
          </div>
        </div>
        <div className="resource-item">
          <div className="resource-icon">
            <Image
              src="/shards.png"
              alt="Crystal Shards"
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <div className="resource-info">
            <div className="resource-amount">{userStats.crystalShards}</div>
            <div className="resource-name">Crystal Shards</div>
          </div>
        </div>
        <div className="resource-item">
          <div className="resource-icon">
            <Image
              src="/ancientrelic.png"
              alt="Ancient Relics"
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <div className="resource-info">
            <div className="resource-amount">{userStats.rareFinds}</div>
            <div className="resource-name">Ancient Relics</div>
          </div>
        </div>
      </div>

      {/* Current Upgrades */}
      <div className="upgrades-panel">
        <h2>🔮 Active Upgrades</h2>
        <div className="upgrades-grid">
          {userUpgrades.cooldownReduction > 0 && (
            <div className="upgrade-item">
              <span>⏰ Cooldown Reduction: -{userUpgrades.cooldownReduction}h</span>
            </div>
          )}
          {userUpgrades.rareChance > 0 && (
            <div className="upgrade-item">
              <span>🍀 Rare Chance: +{userUpgrades.rareChance}%</span>
            </div>
          )}
          {userUpgrades.extraCasts > 0 && (
            <div className="upgrade-item">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Image
                  src="/bolt.png"
                  alt="Energy"
                  width={24}
                  height={24}
                  unoptimized
                />
                Extra Casts: +{userUpgrades.extraCasts}/day
              </span>
            </div>
          )}
          {userUpgrades.autoCollect && (
            <div className="upgrade-item">
              <span>👻 Auto-Collect: Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Shop Categories */}
      <div className="categories-panel">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Items
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'cooldown' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('cooldown')}
        >
          ⏰ Time
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'luck' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('luck')}
        >
          🍀 Luck
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'chests' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('chests')}
        >
          🔑 Chests
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'tigers' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('tigers')}
        >
          🐅 Tigers
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'permanent' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('permanent')}
        >
          🔮 Permanent
        </button>
      </div>

      {/* Shop Items */}
      <div className="shop-panel">
        <h2>🏪 Mystical Shop</h2>
        <div className="shop-grid">
          {getCategoryItems().map(item => (
            <div key={item.id} className={`shop-item ${!canAfford(item) ? 'unaffordable' : ''} ${item.category === 'tigers' ? 'tiger-item' : ''}`}>
              <div className="item-icon">{item.icon}</div>
              <div className="item-name">{item.name}</div>
              <div className="item-description">{item.description}</div>
              <div className="item-effect">{item.effect}</div>
              <div className="item-cost">{getCostDisplay(item.cost)}</div>
              <button 
                className="purchase-btn"
                onClick={() => handlePurchase(item)}
                disabled={!canAfford(item)}
              >
                {canAfford(item) ? 'Purchase' : 'Not Enough Resources'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Purchase</h3>
            <div className="purchase-item">
              <div className="item-display">
                <span className="item-icon-large">{selectedItem.icon}</span>
                <div className="item-details">
                  <div className="item-name">{selectedItem.name}</div>
                  <div className="item-effect">{selectedItem.effect}</div>
                </div>
              </div>
              <div className="cost-display">
                <div className="cost-label">Cost:</div>
                <div className="cost-amount">{getCostDisplay(selectedItem.cost)}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmPurchase}>
                Confirm Purchase
              </button>
              <button className="cancel-btn" onClick={() => setShowPurchaseModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .inventory-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a2e 0%, #16213e 25%, #1a1a3e 50%, #0e0e2a 75%, #0a0618 100%);
          position: relative;
          padding: 2rem;
        }

        .page-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }

        .nav-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .back-link {
          background: rgba(157, 78, 221, 0.2);
          border: 2px solid rgba(157, 78, 221, 0.4);
          border-radius: 10px;
          padding: 0.8rem 1.5rem;
          color: #c77dff;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          background: rgba(157, 78, 221, 0.4);
          border-color: rgba(157, 78, 221, 0.8);
          transform: translateY(-2px);
        }

        .nav-header h1 {
          font-size: 3rem;
          color: #c77dff;
          margin: 0;
          text-shadow: 0 0 20px rgba(199, 125, 255, 0.5);
        }

        .promo-section {
          margin-bottom: 3rem;
        }

        .promo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .promo-card {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .promo-card:hover {
          border-color: rgba(157, 78, 221, 0.8);
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(157, 78, 221, 0.3);
        }

        .promo-card.coinflip:hover {
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.3);
        }

        .promo-card.chests:hover {
          border-color: rgba(76, 201, 240, 0.8);
          box-shadow: 0 15px 35px rgba(76, 201, 240, 0.3);
        }

        .promo-card.marketplace:hover {
          border-color: rgba(34, 197, 94, 0.8);
          box-shadow: 0 15px 35px rgba(34, 197, 94, 0.3);
        }

        .promo-icon {
          font-size: 3rem;
          filter: drop-shadow(0 0 15px rgba(157, 78, 221, 0.8));
        }

        .promo-content h3 {
          color: #e0aaff;
          font-size: 1.3rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .promo-content p {
          color: #c77dff;
          margin: 0 0 1rem 0;
          opacity: 0.9;
        }

        .promo-cta {
          color: #9d4edd;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .resources-panel {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .resource-item {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          min-width: 150px;
          backdrop-filter: blur(10px);
        }

        .resource-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .resource-amount {
          font-size: 2rem;
          font-weight: 700;
          color: #e0aaff;
          margin-bottom: 0.5rem;
        }

        .resource-name {
          font-size: 0.9rem;
          color: #c77dff;
          opacity: 0.8;
        }

        .upgrades-panel {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 1px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 3rem;
          backdrop-filter: blur(10px);
        }

        .upgrades-panel h2 {
          color: #c77dff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .upgrades-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .upgrade-item {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(157, 78, 221, 0.2);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          color: #e0aaff;
        }

        .categories-panel {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .category-btn {
          background: rgba(157, 78, 221, 0.2);
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 10px;
          padding: 0.8rem 1.5rem;
          color: #c77dff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .category-btn:hover, .category-btn.active {
          background: rgba(157, 78, 221, 0.4);
          border-color: rgba(157, 78, 221, 0.8);
          transform: translateY(-2px);
        }

        .shop-panel {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 1px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .shop-panel h2 {
          color: #c77dff;
          margin-bottom: 2rem;
          text-align: center;
        }

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .shop-item {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .shop-item:hover:not(.unaffordable) {
          border-color: rgba(157, 78, 221, 0.6);
          transform: translateY(-5px);
        }

        .shop-item.tiger-item {
          border-color: rgba(255, 215, 0, 0.4);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
        }

        .shop-item.tiger-item:hover:not(.unaffordable) {
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }

        .shop-item.unaffordable {
          opacity: 0.5;
          filter: grayscale(50%);
        }

        .item-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .item-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #e0aaff;
          margin-bottom: 0.5rem;
        }

        .tiger-item .item-name {
          color: #ffd700;
        }

        .item-description {
          font-size: 0.9rem;
          color: #c77dff;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .item-effect {
          font-size: 0.9rem;
          color: #9d4edd;
          margin-bottom: 1rem;
          font-style: italic;
        }

        .tiger-item .item-effect {
          color: #ffb000;
        }

        .item-cost {
          font-size: 1.1rem;
          color: #ffd700;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .purchase-btn {
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.3), rgba(114, 9, 183, 0.3));
          border: 2px solid rgba(157, 78, 221, 0.5);
          border-radius: 8px;
          padding: 0.8rem 1.5rem;
          color: #e0aaff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          width: 100%;
        }

        .tiger-item .purchase-btn {
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.3));
          border-color: rgba(255, 215, 0, 0.5);
          color: #ffb000;
        }

        .purchase-btn:hover:not(:disabled) {
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.5), rgba(114, 9, 183, 0.5));
          transform: translateY(-2px);
        }

        .tiger-item .purchase-btn:hover:not(:disabled) {
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.5), rgba(255, 165, 0, 0.5));
        }

        .purchase-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .modal-content {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.95), rgba(26, 26, 62, 0.95));
          border: 2px solid rgba(157, 78, 221, 0.5);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          backdrop-filter: blur(15px);
        }

        .modal-content h3 {
          color: #c77dff;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .purchase-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .item-display {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .item-icon-large {
          font-size: 3rem;
        }

        .item-details .item-name {
          font-size: 1.2rem;
          color: #e0aaff;
          margin-bottom: 0.5rem;
        }

        .item-details .item-effect {
          color: #9d4edd;
          font-style: italic;
        }

        .cost-display {
          text-align: center;
        }

        .cost-label {
          color: #c77dff;
          margin-bottom: 0.5rem;
        }

        .cost-amount {
          font-size: 1.3rem;
          color: #ffd700;
          font-weight: 700;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
        }

        .confirm-btn, .cancel-btn {
          flex: 1;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .confirm-btn {
          background: linear-gradient(45deg, rgba(74, 252, 74, 0.3), rgba(34, 197, 34, 0.3));
          border: 2px solid rgba(74, 252, 74, 0.5);
          color: #4afc4a;
        }

        .confirm-btn:hover {
          background: linear-gradient(45deg, rgba(74, 252, 74, 0.5), rgba(34, 197, 34, 0.5));
        }

        .cancel-btn {
          background: linear-gradient(45deg, rgba(255, 107, 107, 0.3), rgba(220, 38, 38, 0.3));
          border: 2px solid rgba(255, 107, 107, 0.5);
          color: #ff6b6b;
        }

        .cancel-btn:hover {
          background: linear-gradient(45deg, rgba(255, 107, 107, 0.5), rgba(220, 38, 38, 0.5));
        }

        @media (max-width: 768px) {
          .inventory-page {
            padding: 1rem;
          }

          .nav-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .nav-header h1 {
            font-size: 2rem;
          }

          .promo-grid {
            grid-template-columns: 1fr;
          }

          .promo-card {
            flex-direction: column;
            text-align: center;
          }

          .resources-panel {
            gap: 1rem;
          }

          .shop-grid {
            grid-template-columns: 1fr;
          }

          .categories-panel {
            gap: 0.5rem;
          }

          .category-btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
} 