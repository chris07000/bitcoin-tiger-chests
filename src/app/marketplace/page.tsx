'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/context/WalletContext'
import { useLightning } from '@/context/LightningContext'
import Image from 'next/image'
import Link from 'next/link'

interface MarketOrder {
  id: string
  type: 'buy' | 'sell'
  amount: number
  pricePerShard: number
  totalSats: number
  seller?: string
  buyer?: string
  timestamp: number
}

interface UserStats {
  totalCasts: number
  energyPoints: number
  crystalShards: number
  rareFinds: number
}

export default function MarketplacePage() {
  const { walletAddress } = useWallet()
  const { balance } = useLightning()
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalCasts: 0,
    energyPoints: 0,
    crystalShards: 0,
    rareFinds: 0
  })
  
  const [marketOrders, setMarketOrders] = useState<MarketOrder[]>([
    // Mock data for demonstration
    {
      id: '1',
      type: 'sell',
      amount: 50,
      pricePerShard: 100,
      totalSats: 5000,
      seller: 'bc1q...xyz123',
      timestamp: Date.now() - 3600000
    },
    {
      id: '2',
      type: 'sell',
      amount: 25,
      pricePerShard: 95,
      totalSats: 2375,
      seller: 'bc1q...abc456',
      timestamp: Date.now() - 1800000
    },
    {
      id: '3',
      type: 'buy',
      amount: 100,
      pricePerShard: 90,
      totalSats: 9000,
      buyer: 'bc1q...def789',
      timestamp: Date.now() - 900000
    }
  ])
  
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [orderForm, setOrderForm] = useState({
    amount: '',
    pricePerShard: ''
  })
  
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<MarketOrder | null>(null)

  useEffect(() => {
    if (walletAddress) {
      loadUserStats()
    }
  }, [walletAddress])

  const loadUserStats = () => {
    if (!walletAddress) return
    const stored = localStorage.getItem(`mining_stats_${walletAddress}`)
    if (stored) {
      setUserStats(JSON.parse(stored))
    }
  }

  const calculateTotal = () => {
    const amount = parseInt(orderForm.amount) || 0
    const price = parseInt(orderForm.pricePerShard) || 0
    return amount * price
  }

  const handleCreateOrder = () => {
    if (!walletAddress || !orderForm.amount || !orderForm.pricePerShard) return
    
    const amount = parseInt(orderForm.amount)
    const pricePerShard = parseInt(orderForm.pricePerShard)
    const totalSats = amount * pricePerShard
    
    // Validation
    if (activeTab === 'sell' && amount > userStats.crystalShards) {
      alert('Not enough Crystal Shards!')
      return
    }
    
    if (activeTab === 'buy' && totalSats > balance) {
      alert('Not enough sats!')
      return
    }
    
    const newOrder: MarketOrder = {
      id: Date.now().toString(),
      type: activeTab,
      amount,
      pricePerShard,
      totalSats,
      [activeTab === 'sell' ? 'seller' : 'buyer']: walletAddress,
      timestamp: Date.now()
    }
    
    setMarketOrders([newOrder, ...marketOrders])
    setOrderForm({ amount: '', pricePerShard: '' })
    alert(`${activeTab === 'sell' ? 'Sell' : 'Buy'} order created successfully!`)
  }

  const handleTradeOrder = (order: MarketOrder) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const confirmTrade = () => {
    if (!selectedOrder || !walletAddress) return
    
    // This would normally be handled by backend
    alert(`Trade completed! ${selectedOrder.type === 'sell' ? 'Bought' : 'Sold'} ${selectedOrder.amount} Crystal Shards for ${selectedOrder.totalSats} sats`)
    
    // Remove order from market
    setMarketOrders(marketOrders.filter(order => order.id !== selectedOrder.id))
    setShowOrderModal(false)
    setSelectedOrder(null)
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const getSellOrders = () => marketOrders.filter(order => order.type === 'sell').sort((a, b) => a.pricePerShard - b.pricePerShard)
  const getBuyOrders = () => marketOrders.filter(order => order.type === 'buy').sort((a, b) => b.pricePerShard - a.pricePerShard)

  return (
    <div className="marketplace-page">
      {/* Background */}
      <div className="page-background">
        <Image
          src="/lab.png"
          alt="Marketplace Background"
          fill
          style={{ objectFit: 'cover', opacity: 0.05 }}
          unoptimized
        />
      </div>

      {/* Navigation */}
      <div className="nav-header">
        <Link href="/inventory" className="back-link">
          ← Back to Inventory
        </Link>
        <h1>🏪 Shard Marketplace</h1>
        <div className="beta-badge">BETA</div>
      </div>

      {/* Market Stats */}
      <div className="market-stats">
        <div className="stat-card">
          <div className="stat-label">Your Shards</div>
          <div className="stat-value">
            {userStats.crystalShards}
            <Image
              src="/shards.png"
              alt="Crystal Shards"
              width={24}
              height={24}
              style={{ marginLeft: '8px', display: 'inline-block' }}
              unoptimized
            />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Your Balance</div>
          <div className="stat-value">{balance.toLocaleString()} sats</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Market Price</div>
          <div className="stat-value">~95 sats/shard</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">24h Volume</div>
          <div className="stat-value">1,250 shards</div>
        </div>
      </div>

      {/* Order Creation */}
      <div className="order-section">
        <div className="order-tabs">
          <button 
            className={`tab-btn ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveTab('buy')}
          >
            🛒 Buy Shards
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => setActiveTab('sell')}
          >
            💰 Sell Shards
          </button>
        </div>

        <div className="order-form">
          <div className="form-group">
            <label>Amount (Crystal Shards)</label>
            <input
              type="number"
              value={orderForm.amount}
              onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})}
              placeholder="Enter amount..."
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Price per Shard (sats)</label>
            <input
              type="number"
              value={orderForm.pricePerShard}
              onChange={(e) => setOrderForm({...orderForm, pricePerShard: e.target.value})}
              placeholder="Enter price..."
              min="1"
            />
          </div>
          
          <div className="order-total">
            <div className="total-label">Total: </div>
            <div className="total-value">{calculateTotal().toLocaleString()} sats</div>
          </div>
          
          <button 
            className="create-order-btn"
            onClick={handleCreateOrder}
            disabled={!orderForm.amount || !orderForm.pricePerShard}
          >
            Create {activeTab === 'buy' ? 'Buy' : 'Sell'} Order
          </button>
        </div>
      </div>

      {/* Market Orders */}
      <div className="market-section">
        <div className="orders-container">
          {/* Sell Orders */}
          <div className="order-book">
            <h3>🔥 Sell Orders (Available to Buy)</h3>
            <div className="order-list">
              {getSellOrders().map(order => (
                <div key={order.id} className="order-item sell-order">
                  <div className="order-info">
                    <div className="order-amount">
                      {order.amount}
                      <Image
                        src="/shards.png"
                        alt="Crystal Shards"
                        width={16}
                        height={16}
                        style={{ marginLeft: '4px', display: 'inline-block' }}
                        unoptimized
                      />
                    </div>
                    <div className="order-price">{order.pricePerShard} sats/shard</div>
                    <div className="order-total">{order.totalSats.toLocaleString()} sats total</div>
                    <div className="order-time">{formatTimeAgo(order.timestamp)}</div>
                  </div>
                  <button 
                    className="trade-btn buy-btn"
                    onClick={() => handleTradeOrder(order)}
                    disabled={order.seller === walletAddress}
                  >
                    {order.seller === walletAddress ? 'Your Order' : 'Buy'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buy Orders */}
          <div className="order-book">
            <h3>💚 Buy Orders (Available to Sell)</h3>
            <div className="order-list">
              {getBuyOrders().map(order => (
                <div key={order.id} className="order-item buy-order">
                  <div className="order-info">
                    <div className="order-amount">
                      {order.amount}
                      <Image
                        src="/shards.png"
                        alt="Crystal Shards"
                        width={16}
                        height={16}
                        style={{ marginLeft: '4px', display: 'inline-block' }}
                        unoptimized
                      />
                    </div>
                    <div className="order-price">{order.pricePerShard} sats/shard</div>
                    <div className="order-total">{order.totalSats.toLocaleString()} sats total</div>
                    <div className="order-time">{formatTimeAgo(order.timestamp)}</div>
                  </div>
                  <button 
                    className="trade-btn sell-btn"
                    onClick={() => handleTradeOrder(order)}
                    disabled={order.buyer === walletAddress}
                  >
                    {order.buyer === walletAddress ? 'Your Order' : 'Sell'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Promotion */}
      <div className="promo-section">
        <h3>🎯 Use Your Shards</h3>
        <div className="promo-grid">
          <Link href="/inventory" className="promo-card">
            <div className="promo-icon">🐅</div>
            <div className="promo-content">
              <h4>Mint Tigers</h4>
              <p>1000 shards → Tiger NFT</p>
            </div>
          </Link>
          
          <a href="https://bitcointigercollective.xyz" target="_blank" rel="noopener noreferrer" className="promo-card">
            <div className="promo-icon">🔑</div>
            <div className="promo-content">
              <h4>Chest Keys</h4>
              <p>8-75 shards → Instant chests</p>
            </div>
          </a>
          
          <Link href="/mining" className="promo-card">
            <div className="promo-icon">
              <Image
                src="/bolt.png"
                alt="Energy"
                width={32}
                height={32}
                unoptimized
              />
            </div>
            <div className="promo-content">
              <h4>Mine More</h4>
              <p>Daily free shards</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Trade Confirmation Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Trade</h3>
            <div className="trade-details">
              <div className="trade-info">
                <div className="trade-type">
                  {selectedOrder.type === 'sell' ? 'Buying' : 'Selling'} Crystal Shards
                </div>
                <div className="trade-amounts">
                  <div className="amount-item">
                    <span className="label">Amount:</span>
                    <span className="value" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {selectedOrder.amount}
                      <Image
                        src="/shards.png"
                        alt="Crystal Shards"
                        width={16}
                        height={16}
                        unoptimized
                      />
                    </span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Price per shard:</span>
                    <span className="value">{selectedOrder.pricePerShard} sats</span>
                  </div>
                  <div className="amount-item total">
                    <span className="label">Total:</span>
                    <span className="value">{selectedOrder.totalSats.toLocaleString()} sats</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmTrade}>
                Confirm Trade
              </button>
              <button className="cancel-btn" onClick={() => setShowOrderModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .marketplace-page {
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

        .beta-badge {
          background: linear-gradient(45deg, #ff6b6b, #ff8e53);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .market-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-label {
          font-size: 0.9rem;
          color: #c77dff;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e0aaff;
        }

        .order-section {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 3rem;
          backdrop-filter: blur(10px);
        }

        .order-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .tab-btn {
          flex: 1;
          background: rgba(157, 78, 221, 0.2);
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 10px;
          padding: 1rem;
          color: #c77dff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .tab-btn:hover, .tab-btn.active {
          background: rgba(157, 78, 221, 0.4);
          border-color: rgba(157, 78, 221, 0.8);
          transform: translateY(-2px);
        }

        .order-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #c77dff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .form-group input {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 8px;
          padding: 1rem;
          color: #e0aaff;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(157, 78, 221, 0.8);
        }

        .order-total {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .total-label {
          color: #c77dff;
          font-weight: 600;
        }

        .total-value {
          color: #ffd700;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .create-order-btn {
          background: linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3));
          border: 2px solid rgba(34, 197, 94, 0.5);
          border-radius: 10px;
          padding: 1rem 2rem;
          color: #4ade80;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .create-order-btn:hover:not(:disabled) {
          background: linear-gradient(45deg, rgba(34, 197, 94, 0.5), rgba(16, 185, 129, 0.5));
          transform: translateY(-2px);
        }

        .create-order-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .market-section {
          margin-bottom: 3rem;
        }

        .orders-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .order-book {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .order-book h3 {
          color: #c77dff;
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.2rem;
        }

        .order-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(157, 78, 221, 0.2);
        }

        .sell-order {
          border-left: 4px solid #ff6b6b;
        }

        .buy-order {
          border-left: 4px solid #4ade80;
        }

        .order-info {
          flex: 1;
        }

        .order-amount {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e0aaff;
          margin-bottom: 0.3rem;
        }

        .order-price {
          color: #c77dff;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }

        .order-total {
          color: #ffd700;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }

        .order-time {
          color: #666;
          font-size: 0.8rem;
        }

        .trade-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .buy-btn {
          background: linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3));
          border-color: rgba(34, 197, 94, 0.5);
          color: #4ade80;
        }

        .buy-btn:hover:not(:disabled) {
          background: linear-gradient(45deg, rgba(34, 197, 94, 0.5), rgba(16, 185, 129, 0.5));
          transform: translateY(-2px);
        }

        .sell-btn {
          background: linear-gradient(45deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3));
          border-color: rgba(239, 68, 68, 0.5);
          color: #f87171;
        }

        .sell-btn:hover:not(:disabled) {
          background: linear-gradient(45deg, rgba(239, 68, 68, 0.5), rgba(220, 38, 38, 0.5));
          transform: translateY(-2px);
        }

        .trade-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .promo-section {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 15px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .promo-section h3 {
          color: #c77dff;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .promo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .promo-card {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(157, 78, 221, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .promo-card:hover {
          border-color: rgba(157, 78, 221, 0.8);
          transform: translateY(-3px);
        }

        .promo-icon {
          font-size: 2rem;
        }

        .promo-content h4 {
          color: #e0aaff;
          margin: 0 0 0.3rem 0;
          font-size: 1rem;
        }

        .promo-content p {
          color: #c77dff;
          margin: 0;
          font-size: 0.8rem;
          opacity: 0.8;
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

        .trade-details {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .trade-type {
          color: #e0aaff;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
        }

        .trade-amounts {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .amount-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .amount-item.total {
          border-top: 1px solid rgba(157, 78, 221, 0.3);
          padding-top: 0.8rem;
          margin-top: 0.5rem;
        }

        .amount-item .label {
          color: #c77dff;
        }

        .amount-item .value {
          color: #e0aaff;
          font-weight: 600;
        }

        .amount-item.total .value {
          color: #ffd700;
          font-size: 1.1rem;
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
          .marketplace-page {
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

          .market-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .order-form {
            grid-template-columns: 1fr;
          }

          .orders-container {
            grid-template-columns: 1fr;
          }

          .promo-grid {
            grid-template-columns: 1fr;
          }

          .promo-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
} 