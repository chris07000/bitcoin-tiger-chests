'use client'
import Image from 'next/image'

export default function ArtifactsPage() {
  return (
    <div className="page-content">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="title">Profit-Sharing Artifacts</h1>
        <p className="subtitle">
          Legendary digital artifacts that grant you eternal profit sharing from our platform's revenue. 
          These exclusive NFTs provide passive income based on our daily earnings.
        </p>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label">Total Artifacts</div>
              <div className="stat-value">50</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Profit Shared</div>
              <div className="stat-value">$25,000+</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Daily Revenue</div>
              <div className="stat-value">$500+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Artifacts Grid */}
      <div className="artifacts-section">
        <div className="section-header">
          <h2 className="section-title">Available Artifacts</h2>
        </div>

        <div className="artifacts-grid">
          {/* Legendary Artifact */}
          <div className="artifact-card legendary">
            <div className="artifact-image-container">
              <Image 
                src="/artifacts/gold.png"
                alt="Legendary Philosopher's Stone"
                width={120}
                height={120}
                className="artifact-image"
                unoptimized
                priority
              />
            </div>
            <div className="artifact-content">
              <div className="artifact-header">
                <h3 className="artifact-name">Legendary Philosopher's Stone</h3>
                <div className="artifact-rarity legendary-rarity">Legendary</div>
              </div>
              <div className="artifact-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <span className="benefit-text">5.0% Profit Share</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔥</span>
                  <span className="benefit-text">Only 5 Exist</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">👑</span>
                  <span className="benefit-text">Supreme Power</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✨</span>
                  <span className="benefit-text">Daily Payouts</span>
                </div>
              </div>
              <button className="marketplace-button">
                <span>View in Marketplace</span>
              </button>
            </div>
          </div>

          {/* Rare Artifact */}
          <div className="artifact-card rare">
            <div className="artifact-image-container">
              <Image 
                src="/artifacts/silver.png"
                alt="Rare Crystal of Power"
                width={120}
                height={120}
                className="artifact-image"
                unoptimized
                priority
              />
            </div>
            <div className="artifact-content">
              <div className="artifact-header">
                <h3 className="artifact-name">Rare Crystal of Power</h3>
                <div className="artifact-rarity rare-rarity">Rare</div>
              </div>
              <div className="artifact-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <span className="benefit-text">2.5% Profit Share</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔥</span>
                  <span className="benefit-text">Only 15 Exist</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🌙</span>
                  <span className="benefit-text">Medium Power</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✨</span>
                  <span className="benefit-text">Daily Payouts</span>
                </div>
              </div>
              <button className="marketplace-button">
                <span>View in Marketplace</span>
              </button>
            </div>
          </div>

          {/* Common Artifact */}
          <div className="artifact-card common">
            <div className="artifact-image-container">
              <Image 
                src="/artifacts/bronze.png"
                alt="Mystic Moonstone Shard"
                width={120}
                height={120}
                className="artifact-image"
                unoptimized
                priority
              />
            </div>
            <div className="artifact-content">
              <div className="artifact-header">
                <h3 className="artifact-name">Mystic Moonstone Shard</h3>
                <div className="artifact-rarity common-rarity">Common</div>
              </div>
              <div className="artifact-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <span className="benefit-text">1.26% Profit Share</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔥</span>
                  <span className="benefit-text">Only 30 Exist</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🌙</span>
                  <span className="benefit-text">Basic Power</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✨</span>
                  <span className="benefit-text">Daily Payouts</span>
                </div>
              </div>
              <button className="marketplace-button">
                <span>View in Marketplace</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="info-section">
        <div className="info-card">
          <div className="info-header">
            <h2 className="info-title">How Profit Sharing Works</h2>
          </div>
          <div className="info-content">
            <h3 className="formula-title">Revenue Distribution Formula:</h3>
            <p className="info-description">When the platform generates revenue (e.g. 20M sats daily):</p>
            <div className="distribution-items">
              <div className="distribution-item">
                <span className="distribution-icon">💰</span>
                <span className="distribution-text">20% flows to development fund (4M sats)</span>
              </div>
              <div className="distribution-item">
                <span className="distribution-icon">🎁</span>
                <span className="distribution-text">80% distributed to artifact holders (16M sats)</span>
              </div>
            </div>
            <div className="payout-grid">
              <div className="payout-card legendary">
                <div className="payout-header">Philosopher's Stone</div>
                <div className="payout-percentage">5.0% each</div>
                <div className="payout-amount">800,000 Sats per Stone</div>
              </div>
              <div className="payout-card rare">
                <div className="payout-header">Crystal of Power</div>
                <div className="payout-percentage">2.5% each</div>
                <div className="payout-amount">400,000 Sats per Crystal</div>
              </div>
              <div className="payout-card common">
                <div className="payout-header">Moonstone Shard</div>
                <div className="payout-percentage">1.26% each</div>
                <div className="payout-amount">201,600 Sats per Shard</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acquisition Section */}
      <div className="acquisition-section">
        <div className="acquisition-card">
          <div className="acquisition-header">
            <h2 className="acquisition-title">How to Acquire Artifacts</h2>
          </div>
          <div className="acquisition-content">
            <div className="acquisition-methods">
              <div className="method-card">
                <h3 className="method-title">Past Opportunities</h3>
                <p className="method-description">Artifacts were previously distributed through:</p>
                <div className="method-list">
                  <div className="method-item">🌟 Exclusive Airdrops</div>
                  <div className="method-item">⚔️ Special Achievements</div>
                  <div className="method-item">🎲 Limited Lotteries</div>
                  <div className="method-item">🏛️ Auction Events</div>
                </div>
              </div>
              <div className="method-card">
                <h3 className="method-title">Future Opportunities</h3>
                <p className="method-description">
                  Stay tuned for upcoming opportunities to acquire artifacts through 
                  special events, promotions, and exclusive drops. Follow our announcements 
                  to never miss a chance.
                </p>
                <div className="notification-signup">
                  <button className="notify-button">
                    <span>Get Notified</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-content {
          min-height: 100vh;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          color: #FFFFFF;
          padding: 2rem 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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

        .stats-section {
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

        .artifacts-section {
          max-width: 1200px;
          margin: 0 auto 3rem;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          text-align: center;
        }

        .artifacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 0 auto;
        }
        
        .artifact-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
        }
        
        .artifact-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        }
        
        .artifact-card:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: rgba(255, 107, 0, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 107, 0, 0.1);
        }
        
        .artifact-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.03) 0%, rgba(255, 184, 0, 0.03) 100%);
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .artifact-image {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 20px rgba(255, 107, 0, 0.4));
        }
        
        .artifact-card:hover .artifact-image {
          transform: scale(1.05);
        }

        .artifact-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .artifact-header {
          margin-bottom: 1.5rem;
        }
        
        .artifact-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        
        .artifact-rarity {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .legendary-rarity {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 140, 0, 0.1) 100%);
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .rare-rarity {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
          color: #A855F7;
          border: 1px solid rgba(147, 51, 234, 0.3);
        }

        .common-rarity {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%);
          color: #3B82F6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .artifact-benefits {
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .benefit-item:last-child {
          border-bottom: none;
        }

        .benefit-icon {
          font-size: 1.1rem;
          filter: drop-shadow(0 0 8px rgba(255, 107, 0, 0.3));
        }

        .benefit-text {
          font-size: 0.9rem;
          color: #94A3B8;
          font-weight: 500;
        }

        .marketplace-button {
          width: 100%;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          padding: 0.875rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .marketplace-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(255, 107, 0, 0.3);
        }

        .info-section, .acquisition-section {
          max-width: 1200px;
          margin: 0 auto 3rem;
        }

        .info-card, .acquisition-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          position: relative;
        }

        .info-card::before, .acquisition-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        }

        .info-header, .acquisition-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .info-title, .acquisition-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1rem;
        }

        .formula-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #FF6B00;
          margin-bottom: 1rem;
        }

        .info-description {
          font-size: 1rem;
          color: #94A3B8;
          margin-bottom: 1.5rem;
        }

        .distribution-items {
          margin-bottom: 2rem;
        }

        .distribution-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          margin-bottom: 0.75rem;
          border: 1px solid rgba(255, 107, 0, 0.1);
        }

        .distribution-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 0 8px rgba(255, 107, 0, 0.3));
        }

        .distribution-text {
          color: #FFFFFF;
          font-weight: 500;
        }

        .payout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .payout-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid;
          position: relative;
          overflow: hidden;
        }

        .payout-card.legendary {
          border-color: rgba(255, 215, 0, 0.3);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 140, 0, 0.02) 100%);
        }

        .payout-card.rare {
          border-color: rgba(147, 51, 234, 0.3);
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(168, 85, 247, 0.02) 100%);
        }

        .payout-card.common {
          border-color: rgba(59, 130, 246, 0.3);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%);
        }

        .payout-header {
          font-size: 1rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .payout-percentage {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .payout-card.legendary .payout-percentage {
          color: #FFD700;
        }

        .payout-card.rare .payout-percentage {
          color: #A855F7;
        }

        .payout-card.common .payout-percentage {
          color: #3B82F6;
        }

        .payout-amount {
          font-size: 0.85rem;
          color: #94A3B8;
        }

        .acquisition-content {
          margin-top: 1rem;
        }

        .acquisition-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .method-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .method-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #FF6B00;
          margin-bottom: 1rem;
        }

        .method-description {
          color: #94A3B8;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .method-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .method-item {
          padding: 0.75rem;
          background: rgba(255, 107, 0, 0.05);
          border-radius: 6px;
          color: #FFFFFF;
          border-left: 3px solid rgba(255, 107, 0, 0.3);
          font-size: 0.9rem;
        }

        .notification-signup {
          margin-top: 1.5rem;
        }

        .notify-button {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }
        
        .notify-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(255, 107, 0, 0.3);
        }

        @media (max-width: 768px) {
          .stat-card {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1rem;
          }

          .artifacts-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .payout-grid {
            grid-template-columns: 1fr;
          }

          .acquisition-methods {
            grid-template-columns: 1fr;
          }

          .info-card, .acquisition-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
} 