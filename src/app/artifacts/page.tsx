'use client'
import Image from 'next/image'

export default function ArtifactsPage() {
  return (
    <div className="artifacts-container">
      <div className="artifacts-header">
        <h1 className="pixel-title">BTC Tiger Artifacts</h1>
        <p className="artifacts-intro">
          Exclusive Ordinals that give holders a share in the Tiger's games profits. These rare artifacts were distributed through airdrops, 
          player rewards, raffles, and exclusive auctions.
        </p>
      </div>

      <div className="artifacts-grid">
        <div className="artifact-card gold">
          <div className="artifact-image-container">
            <Image 
              src="/artifacts/gold.png"
              alt="Golden Artifact"
              width={160}
              height={160}
              className="artifact-image"
              unoptimized
              priority
            />
          </div>
          <div className="artifact-info">
            <h2>Golden Artifact</h2>
            <ul className="artifact-features">
              <li>5.0% Profit Share</li>
              <li>Only 5 in existence</li>
              <li>Highest tier of profit sharing</li>
              <li>Ultra-rare collectible</li>
            </ul>
            <a 
              href="https://magiceden.io/ordinals/marketplace/tigerartifacts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="marketplace-link"
            >
              Trade on Magic Eden
            </a>
          </div>
        </div>

        <div className="artifact-card silver">
          <div className="artifact-image-container">
            <Image 
              src="/artifacts/silver.png"
              alt="Silver Artifact"
              width={160}
              height={160}
              className="artifact-image"
              unoptimized
              priority
            />
          </div>
          <div className="artifact-info">
            <h2>Silver Artifact</h2>
            <ul className="artifact-features">
              <li>2.5% Profit Share</li>
              <li>Only 15 in existence</li>
              <li>Medium tier of profit sharing</li>
              <li>Rare collectible</li>
            </ul>
            <a 
              href="https://magiceden.io/ordinals/marketplace/tigerartifacts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="marketplace-link"
            >
              Trade on Magic Eden
            </a>
          </div>
        </div>

        <div className="artifact-card bronze">
          <div className="artifact-image-container">
            <Image 
              src="/artifacts/bronze.png"
              alt="Bronze Artifact"
              width={160}
              height={160}
              className="artifact-image"
              unoptimized
              priority
            />
          </div>
          <div className="artifact-info">
            <h2>Bronze Artifact</h2>
            <ul className="artifact-features">
              <li>1.26% Profit Share</li>
              <li>Only 30 in existence</li>
              <li>Entry tier of profit sharing</li>
              <li>Limited collectible</li>
            </ul>
            <a 
              href="https://magiceden.io/ordinals/marketplace/tigerartifacts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="marketplace-link"
            >
              Trade on Magic Eden
            </a>
          </div>
        </div>
      </div>

      <div className="profit-sharing-explanation">
        <h2 className="section-title">How Profit Sharing Works</h2>
        <div className="profit-example">
          <h3>Example Calculation:</h3>
          <p>When BTC Tiger games generate profit (e.g. 20M sats):</p>
          <ul className="profit-list">
            <li>20% goes to the project (4M sats)</li>
            <li>80% is distributed to artifact holders (16M sats)</li>
          </ul>
          <div className="distribution-title">Example distribution per artifact type:</div>
          <div className="distribution-grid">
            <div className="artifact-type gold">
              <div className="artifact-percentage">Golden Artifacts: 5.0% each</div>
              <div className="artifact-count">(800,000 Sats per Artifact)</div>
            </div>
            <div className="artifact-type silver">
              <div className="artifact-percentage">Silver Artifacts: 2.5% each</div>
              <div className="artifact-count">(400,000 Sats per Artifact)</div>
            </div>
            <div className="artifact-type bronze">
              <div className="artifact-percentage">Bronze Artifacts: 1.26% each</div>
              <div className="artifact-count">(201,600 Sats per Artifact)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="artifacts-footer">
        <h2 className="section-title">How to Obtain Artifacts</h2>
        <div className="obtain-methods">
          <div className="method">
            <h3>Past Distributions</h3>
            <p>Artifacts were previously distributed through:</p>
            <ul className="method-list">
              <li>Community airdrops</li>
              <li>Player rewards</li>
              <li>Exclusive raffles</li>
              <li>Project auctions</li>
            </ul>
          </div>
          <div className="method">
            <h3>Current Opportunities</h3>
            <p>Keep an eye on our announcements for future opportunities to acquire artifacts through special events and promotions.</p>
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
        .artifacts-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
          color: white;
          font-family: 'Press Start 2P', monospace;
        }
        
        .artifacts-header {
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
        
        .artifacts-intro {
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.8;
          font-size: 0.9rem;
          color: #ccc;
        }
        
        .artifacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }
        
        .artifact-card {
          background: linear-gradient(135deg, #000000, #0d1320);
          border: var(--pixel-size) solid;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .artifact-card:hover {
          transform: translateY(-8px);
        }
        
        .artifact-card.gold {
          border-color: var(--gold);
        }
        
        .artifact-card.gold:hover {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
        }
        
        .artifact-card.silver {
          border-color: var(--silver);
        }
        
        .artifact-card.silver:hover {
          box-shadow: 0 0 20px rgba(192, 192, 192, 0.7);
        }
        
        .artifact-card.bronze {
          border-color: var(--bronze);
        }
        
        .artifact-card.bronze:hover {
          box-shadow: 0 0 20px rgba(205, 127, 50, 0.7);
        }
        
        .artifact-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .artifact-image-container::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.2) 0%,
            rgba(255, 215, 0, 0.1) 30%,
            transparent 70%
          );
          animation: rotate 10s linear infinite;
        }
        
        .artifact-card.gold .artifact-image-container::before {
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.2) 0%,
            rgba(255, 215, 0, 0.1) 30%,
            transparent 70%
          );
        }
        
        .artifact-card.silver .artifact-image-container::before {
          background: radial-gradient(
            circle at center,
            rgba(192, 192, 192, 0.2) 0%,
            rgba(192, 192, 192, 0.1) 30%,
            transparent 70%
          );
        }
        
        .artifact-card.bronze .artifact-image-container::before {
          background: radial-gradient(
            circle at center,
            rgba(205, 127, 50, 0.2) 0%,
            rgba(205, 127, 50, 0.1) 30%,
            transparent 70%
          );
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .artifact-image {
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
          transition: transform 0.3s ease;
        }
        
        .artifact-card:hover .artifact-image {
          transform: scale(1.1);
        }
        
        .artifact-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .artifact-info h2 {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .artifact-card.gold h2 {
          color: var(--gold);
        }
        
        .artifact-card.silver h2 {
          color: var(--silver);
        }
        
        .artifact-card.bronze h2 {
          color: var(--bronze);
        }
        
        .artifact-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          flex: 1;
        }
        
        .artifact-features li {
          padding: 0.5rem 0;
          position: relative;
          padding-left: 1.2rem;
          font-size: 0.8rem;
          line-height: 1.4;
          color: #ccc;
        }
        
        .artifact-features li::before {
          content: '►';
          position: absolute;
          left: 0;
          color: currentColor;
        }
        
        .marketplace-link {
          background: linear-gradient(to bottom, #222, #000);
          color: var(--gold);
          text-decoration: none;
          padding: 1rem;
          text-align: center;
          border: 2px solid var(--gold);
          border-radius: 4px;
          transition: all 0.3s ease;
          font-size: 0.8rem;
          display: block;
          margin-top: auto;
        }
        
        .marketplace-link:hover {
          background: var(--gold);
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
        }
        
        .profit-sharing-explanation,
        .artifacts-footer {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(13, 19, 32, 0.7));
          border: 2px solid var(--gold);
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .section-title {
          color: var(--gold);
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .profit-example {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          padding: 1.5rem;
        }
        
        .profit-example h3 {
          color: var(--gold);
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        
        .profit-list {
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .profit-list li {
          padding: 0.5rem 0;
          font-size: 0.9rem;
        }
        
        .distribution-title {
          color: var(--gold);
          margin: 1.5rem 0 1rem;
          font-size: 1rem;
          text-align: center;
        }
        
        .distribution-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .artifact-type {
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        
        .artifact-type.gold {
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid var(--gold);
        }
        
        .artifact-type.silver {
          background: rgba(192, 192, 192, 0.1);
          border: 2px solid var(--silver);
        }
        
        .artifact-type.bronze {
          background: rgba(205, 127, 50, 0.1);
          border: 2px solid var(--bronze);
        }
        
        .artifact-percentage {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        
        .artifact-type.gold .artifact-percentage {
          color: var(--gold);
        }
        
        .artifact-type.silver .artifact-percentage {
          color: var(--silver);
        }
        
        .artifact-type.bronze .artifact-percentage {
          color: var(--bronze);
        }
        
        .artifact-count {
          font-size: 0.8rem;
          color: #ccc;
        }
        
        .obtain-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .method {
          background: rgba(0, 0, 0, 0.5);
          padding: 1.5rem;
          border-radius: 8px;
        }
        
        .method h3 {
          color: var(--gold);
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        
        .method p {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.5;
          color: #ccc;
        }
        
        .method-list {
          padding-left: 1.5rem;
        }
        
        .method-list li {
          padding: 0.3rem 0;
          font-size: 0.9rem;
          color: #ccc;
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
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .artifacts-container {
            padding: 1rem;
          }
          
          .pixel-title {
            font-size: 1.8rem;
            margin-top: 2rem;
          }
          
          .artifacts-intro {
            font-size: 0.8rem;
            line-height: 1.6;
          }
          
          .artifacts-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .artifact-image {
            width: 120px;
            height: 120px;
          }
          
          .artifact-info h2 {
            font-size: 1.2rem;
          }
          
          .artifact-features li {
            font-size: 0.75rem;
          }
          
          .marketplace-link {
            font-size: 0.7rem;
            padding: 0.8rem;
          }
          
          .profit-sharing-explanation,
          .artifacts-footer {
            padding: 1.5rem;
          }
          
          .section-title {
            font-size: 1.3rem;
          }
          
          .distribution-grid {
            grid-template-columns: 1fr;
          }
          
          .obtain-methods {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .pixel-footer {
            padding: 1.5rem 1rem;
            margin-top: 3rem;
          }
          
          .pixel-footer-text {
            font-size: 0.8rem;
          }
          
          .pixel-footer-subtext {
            font-size: 0.7rem;
          }
        }
        
        @media (max-width: 480px) {
          .pixel-title {
            font-size: 1.5rem;
          }
          
          .artifacts-intro {
            font-size: 0.7rem;
          }
          
          .artifact-image {
            width: 100px;
            height: 100px;
          }
          
          .profit-example h3 {
            font-size: 1rem;
          }
          
          .profit-list li,
          .method-list li {
            font-size: 0.75rem;
          }
          
          .pixel-footer {
            padding: 1rem;
            margin-top: 2rem;
          }
          
          .pixel-footer-text {
            font-size: 0.7rem;
          }
          
          .pixel-footer-subtext {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  )
} 