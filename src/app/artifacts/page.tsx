'use client'
import Image from 'next/image'

export default function ArtifactsPage() {
  return (
    <div className="mystical-laboratory">
      {/* Floating magical particles */}
      <div className="magical-particles">
        {Array.from({length: 20}).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      <div className="lab-header">
        <div className="mystical-symbol">🔮</div>
        <h1 className="arcane-title">Mystical Alchemist's Laboratory</h1>
        <p className="enchanted-intro">
          Welcome to the ancient laboratory where mystical artifacts hold the secrets of eternal profit sharing. 
          These legendary relics were forged in the depths of arcane knowledge and bestow their holders with 
          magical powers over the realm's treasury.
        </p>
        <div className="energy-orb"></div>
      </div>

      <div className="artifacts-cauldron">
        <div className="artifact-vessel legendary">
          <div className="artifact-glow legendary-glow"></div>
          <div className="artifact-container">
            <div className="rune-circle">
              <div className="mystical-artifact">
                <div className="artifact-essence legendary-essence"></div>
                <div className="artifact-core">
                  <Image 
                    src="/artifacts/gold.png"
                    alt="Legendary Philosopher's Stone"
                    width={80}
                    height={80}
                    className="artifact-image"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="artifact-grimoire">
            <h2 className="spell-name">Legendary Philosopher's Stone</h2>
            <div className="magic-properties">
              <div className="enchantment">⚡ 5.0% Eternal Profit Share</div>
              <div className="enchantment">🔥 Only 5 Forged in Existence</div>
              <div className="enchantment">👑 Supreme Arcane Power</div>
              <div className="enchantment">✨ Legendary Magical Aura</div>
            </div>
            <button className="transmutation-portal">
              <span className="portal-text">Enter Magical Marketplace</span>
              <div className="portal-energy"></div>
            </button>
          </div>
        </div>

        <div className="artifact-vessel rare">
          <div className="artifact-glow rare-glow"></div>
          <div className="artifact-container">
            <div className="rune-circle">
              <div className="mystical-artifact">
                <div className="artifact-essence rare-essence"></div>
                <div className="artifact-core">
                  <Image 
                    src="/artifacts/silver.png"
                    alt="Rare Crystal of Power"
                    width={80}
                    height={80}
                    className="artifact-image"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="artifact-grimoire">
            <h2 className="spell-name">Rare Crystal of Power</h2>
            <div className="magic-properties">
              <div className="enchantment">⚡ 2.5% Mystical Profit Share</div>
              <div className="enchantment">🔥 Only 15 Crystals Exist</div>
              <div className="enchantment">🌙 Medium Arcane Influence</div>
              <div className="enchantment">✨ Rare Magical Resonance</div>
            </div>
            <button className="transmutation-portal">
              <span className="portal-text">Enter Magical Marketplace</span>
              <div className="portal-energy"></div>
            </button>
          </div>
        </div>

        <div className="artifact-vessel common">
          <div className="artifact-glow common-glow"></div>
          <div className="artifact-container">
            <div className="rune-circle">
              <div className="mystical-artifact">
                <div className="artifact-essence common-essence"></div>
                <div className="artifact-core">
                  <Image 
                    src="/artifacts/bronze.png"
                    alt="Mystic Moonstone Shard"
                    width={80}
                    height={80}
                    className="artifact-image"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="artifact-grimoire">
            <h2 className="spell-name">Mystic Moonstone Shard</h2>
            <div className="magic-properties">
              <div className="enchantment">⚡ 1.26% Ethereal Profit Share</div>
              <div className="enchantment">🔥 Only 30 Shards Remain</div>
              <div className="enchantment">🌙 Beginner's Magical Focus</div>
              <div className="enchantment">✨ Common Arcane Properties</div>
            </div>
            <button className="transmutation-portal">
              <span className="portal-text">Enter Magical Marketplace</span>
              <div className="portal-energy"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="alchemy-tome">
        <div className="laboratory-background"></div>
        <div className="tome-header">
          <div className="mystical-symbol">📜</div>
          <h2 className="chapter-title">The Ancient Art of Profit Alchemy</h2>
        </div>
        <div className="magical-formula">
          <h3 className="formula-title">Sacred Transmutation Ritual:</h3>
          <p className="arcane-knowledge">When the realm's mystical energies generate power (e.g. 20M sats):</p>
          <div className="spell-components">
            <div className="component">🔮 20% flows to the Grand Arcanum (4M sats)</div>
            <div className="component">✨ 80% is channeled to artifact holders (16M sats)</div>
          </div>
          <div className="distribution-spell">Mystical Distribution per Artifact Type:</div>
          <div className="enchantment-grid">
            <div className="artifact-power legendary">
              <div className="power-level">Philosopher's Stone: 5.0% each</div>
              <div className="sats-manifestation">(800,000 Sats per Stone)</div>
            </div>
            <div className="artifact-power rare">
              <div className="power-level">Crystal of Power: 2.5% each</div>
              <div className="sats-manifestation">(400,000 Sats per Crystal)</div>
            </div>
            <div className="artifact-power common">
              <div className="power-level">Moonstone Shard: 1.26% each</div>
              <div className="sats-manifestation">(201,600 Sats per Shard)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="acquisition-grimoire">
        <div className="tome-header">
          <div className="mystical-symbol">🧙‍♂️</div>
          <h2 className="chapter-title">How to Acquire Mystical Artifacts</h2>
        </div>
        <div className="acquisition-methods">
          <div className="ancient-method">
            <h3 className="method-title">Past Magical Rituals</h3>
            <p className="method-description">Artifacts were previously bestowed through:</p>
            <div className="ritual-list">
              <div className="ritual">🌟 Celestial Airdrops</div>
              <div className="ritual">⚔️ Heroic Quest Rewards</div>
              <div className="ritual">🎲 Mystical Lottery Draws</div>
              <div className="ritual">🏛️ Sacred Auction Ceremonies</div>
            </div>
          </div>
          <div className="future-prophecy">
            <h3 className="method-title">Future Magical Opportunities</h3>
            <p className="prophecy-text">
              The ancient spirits whisper of future opportunities to acquire artifacts through 
              legendary events and mystical promotions. Keep your magical senses attuned to our 
              arcane announcements.
            </p>
          </div>
        </div>
      </div>

      <footer className="mystical-footer">
        <div className="footer-runes">
          <div className="rune">⚡</div>
          <div className="rune">🔮</div>
          <div className="rune">⚡</div>
        </div>
        <p className="footer-incantation">
          Powered by the Lightning Realm's Mystical Energies
        </p>
        <p className="footer-signature">
          The Arcane Bitcoin Tiger Collective
        </p>
      </footer>

      <style jsx>{`
        .mystical-laboratory {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a2e 0%, #16213e 25%, #1a1a3e 50%, #0e0e2a 75%, #0a0618 100%);
          position: relative;
          overflow-x: hidden;
          padding: 2rem 1rem;
        }

        .mystical-laboratory::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(75, 0, 130, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(147, 0, 211, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .magical-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #9d4edd 0%, #7209b7 50%, transparent 100%);
          border-radius: 50%;
          animation: float infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
        }

        .lab-header {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          padding: 3rem 0 4rem;
          position: relative;
          z-index: 3;
        }

        .mystical-symbol {
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 20px #9d4edd);
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px #9d4edd);
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 40px #c77dff);
            transform: scale(1.1);
          }
        }

        .arcane-title {
          font-size: 3rem;
          background: linear-gradient(45deg, #9d4edd, #c77dff, #e0aaff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2rem;
          font-weight: 700;
          text-shadow: 0 0 30px rgba(157, 78, 221, 0.5);
          font-family: 'Cinzel', serif;
        }

        .enchanted-intro {
          max-width: 800px;
          margin: 0 auto 2rem;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #e0aaff;
          text-align: center;
          text-shadow: 0 0 10px rgba(224, 170, 255, 0.3);
        }

        .energy-orb {
          width: 60px;
          height: 60px;
          margin: 2rem auto;
          border-radius: 50%;
          background: radial-gradient(circle, #9d4edd 0%, #7209b7 50%, transparent 100%);
          animation: energy-pulse 2s ease-in-out infinite;
          position: relative;
        }

        .energy-orb::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, transparent 60%, #9d4edd 70%, transparent 80%);
          animation: energy-ring 3s linear infinite;
        }

        @keyframes energy-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes energy-ring {
          0% {
            transform: rotate(0deg) scale(1);
          }
          100% {
            transform: rotate(360deg) scale(1.1);
          }
        }

        .artifacts-cauldron {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem;
          padding: 2rem 0 4rem;
          position: relative;
          z-index: 3;
        }

        .artifact-vessel {
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.8), rgba(26, 26, 62, 0.8));
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(157, 78, 221, 0.3);
          transition: all 0.5s ease;
        }

        .artifact-vessel:hover {
          transform: translateY(-10px);
          border-color: rgba(157, 78, 221, 0.8);
        }

        .artifact-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          border-radius: 50%;
          opacity: 0.3;
        }

        .legendary-glow {
          background: radial-gradient(circle, #ffd700 0%, #ff8c00 30%, transparent 70%);
        }

        .rare-glow {
          background: radial-gradient(circle, #9d4edd 0%, #7209b7 30%, transparent 70%);
        }

        .common-glow {
          background: radial-gradient(circle, #4cc9f0 0%, #7209b7 30%, transparent 70%);
        }

        .artifact-container {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          margin-bottom: 2rem;
        }

        .rune-circle {
          width: 150px;
          height: 150px;
          border: 2px solid rgba(157, 78, 221, 0.5);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .mystical-artifact {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .artifact-essence {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
        }

        .legendary-essence {
          background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 140, 0, 0.2) 50%, transparent 80%);
        }

        .rare-essence {
          background: radial-gradient(circle, rgba(157, 78, 221, 0.3) 0%, rgba(114, 9, 183, 0.2) 50%, transparent 80%);
        }

        .common-essence {
          background: radial-gradient(circle, rgba(76, 201, 240, 0.3) 0%, rgba(114, 9, 183, 0.2) 50%, transparent 80%);
        }

        .artifact-core {
          font-size: 3rem;
          z-index: 2;
          position: relative;
          filter: drop-shadow(0 0 15px currentColor);
          animation: core-levitate 3s ease-in-out infinite;
        }

        .artifact-image {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          transition: all 0.3s ease;
          border-radius: 10px;
        }

        .legendary .artifact-image {
          filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.9)) 
                  drop-shadow(0 0 40px rgba(255, 140, 0, 0.6));
        }

        .rare .artifact-image {
          filter: drop-shadow(0 0 25px rgba(157, 78, 221, 0.9)) 
                  drop-shadow(0 0 40px rgba(199, 125, 255, 0.6));
        }

        .common .artifact-image {
          filter: drop-shadow(0 0 25px rgba(76, 201, 240, 0.9)) 
                  drop-shadow(0 0 40px rgba(114, 9, 183, 0.6));
        }

        .artifact-vessel:hover .artifact-image {
          transform: scale(1.1);
          filter: drop-shadow(0 0 30px currentColor) 
                  drop-shadow(0 0 50px currentColor) 
                  brightness(1.2);
        }

        @keyframes core-levitate {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .artifact-grimoire {
          position: relative;
          z-index: 2;
        }

        .spell-name {
          font-size: 1.4rem;
          text-align: center;
          margin-bottom: 1.5rem;
          font-family: 'Cinzel', serif;
          font-weight: 600;
        }

        .legendary .spell-name {
          color: #ffd700;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .rare .spell-name {
          color: #c77dff;
          text-shadow: 0 0 15px rgba(199, 125, 255, 0.5);
        }

        .common .spell-name {
          color: #4cc9f0;
          text-shadow: 0 0 15px rgba(76, 201, 240, 0.5);
        }

        .magic-properties {
          margin-bottom: 2rem;
        }

        .enchantment {
          padding: 0.8rem 0;
          font-size: 0.95rem;
          color: #e0aaff;
          border-bottom: 1px solid rgba(157, 78, 221, 0.2);
          position: relative;
          padding-left: 1.5rem;
        }

        .enchantment:last-child {
          border-bottom: none;
        }

        .enchantment::before {
          content: '✨';
          position: absolute;
          left: 0;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .transmutation-portal {
          width: 100%;
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.2), rgba(114, 9, 183, 0.2));
          border: 2px solid rgba(157, 78, 221, 0.5);
          border-radius: 15px;
          padding: 1rem;
          color: #e0aaff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .transmutation-portal:hover {
          background: linear-gradient(45deg, rgba(157, 78, 221, 0.4), rgba(114, 9, 183, 0.4));
          border-color: rgba(157, 78, 221, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(157, 78, 221, 0.3);
        }

        .portal-text {
          position: relative;
          z-index: 2;
        }

        .portal-energy {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .transmutation-portal:hover .portal-energy {
          left: 100%;
        }

        .alchemy-tome,
        .acquisition-grimoire {
          max-width: 1200px;
          margin: 0 auto 4rem;
          background: linear-gradient(135deg, rgba(16, 18, 56, 0.9), rgba(26, 26, 62, 0.9));
          border-radius: 20px;
          padding: 3rem;
          position: relative;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(157, 78, 221, 0.3);
          z-index: 3;
          overflow: hidden;
        }

        .laboratory-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/lab.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.15;
          z-index: 1;
          border-radius: 20px;
          transition: opacity 0.3s ease;
          animation: subtle-shift 20s ease-in-out infinite;
        }

        @keyframes subtle-shift {
          0%, 100% {
            background-position: center center;
            opacity: 0.15;
          }
          25% {
            background-position: 51% 49%;
            opacity: 0.18;
          }
          50% {
            background-position: 49% 51%;
            opacity: 0.15;
          }
          75% {
            background-position: 51% 51%;
            opacity: 0.18;
          }
        }

        .alchemy-tome:hover .laboratory-background {
          opacity: 0.25;
          background-size: 110%;
        }

        .laboratory-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg, 
            rgba(16, 18, 56, 0.2) 0%, 
            rgba(26, 26, 62, 0.1) 50%, 
            rgba(16, 18, 56, 0.2) 100%
          );
          z-index: 2;
          border-radius: 20px;
        }

        .tome-header,
        .magical-formula {
          position: relative;
          z-index: 3;
        }

        .tome-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .chapter-title {
          font-size: 2rem;
          color: #c77dff;
          margin-bottom: 1rem;
          font-family: 'Cinzel', serif;
          text-shadow: 0 0 20px rgba(199, 125, 255, 0.5);
        }

        .magical-formula {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(157, 78, 221, 0.3);
          backdrop-filter: blur(5px);
        }

        .formula-title {
          color: #ffd700;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .arcane-knowledge {
          color: #e0aaff;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .spell-components {
          margin-bottom: 2rem;
        }

        .component {
          padding: 0.8rem 0;
          color: #c77dff;
          font-size: 0.95rem;
          border-left: 3px solid rgba(157, 78, 221, 0.5);
          padding-left: 1rem;
          margin-bottom: 0.5rem;
        }

        .distribution-spell {
          color: #ffd700;
          font-size: 1.1rem;
          text-align: center;
          margin: 2rem 0 1rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .enchantment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .artifact-power {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid;
          position: relative;
          overflow: hidden;
        }

        .artifact-power::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: power-sweep 4s ease-in-out infinite;
        }

        @keyframes power-sweep {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        .artifact-power.legendary {
          border-color: #ffd700;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.05));
        }

        .artifact-power.rare {
          border-color: #c77dff;
          background: linear-gradient(135deg, rgba(199, 125, 255, 0.1), rgba(157, 78, 221, 0.05));
        }

        .artifact-power.common {
          border-color: #4cc9f0;
          background: linear-gradient(135deg, rgba(76, 201, 240, 0.1), rgba(114, 9, 183, 0.05));
        }

        .power-level {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .artifact-power.legendary .power-level {
          color: #ffd700;
        }

        .artifact-power.rare .power-level {
          color: #c77dff;
        }

        .artifact-power.common .power-level {
          color: #4cc9f0;
        }

        .sats-manifestation {
          font-size: 0.9rem;
          color: #e0aaff;
          opacity: 0.8;
          position: relative;
          z-index: 2;
        }

        .acquisition-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .ancient-method,
        .future-prophecy {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(157, 78, 221, 0.2);
        }

        .method-title {
          color: #ffd700;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .method-description,
        .prophecy-text {
          color: #e0aaff;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .ritual-list {
          display: grid;
          gap: 0.8rem;
        }

        .ritual {
          padding: 0.8rem;
          background: rgba(157, 78, 221, 0.1);
          border-radius: 8px;
          color: #c77dff;
          border-left: 3px solid rgba(157, 78, 221, 0.5);
        }

        .mystical-footer {
          text-align: center;
          padding: 3rem 0;
          border-top: 1px solid rgba(157, 78, 221, 0.3);
          position: relative;
          z-index: 3;
        }

        .footer-runes {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .rune {
          font-size: 2rem;
          filter: drop-shadow(0 0 15px #9d4edd);
          animation: rune-glow 3s ease-in-out infinite;
        }

        .rune:nth-child(2) {
          animation-delay: 1s;
        }

        .rune:nth-child(3) {
          animation-delay: 2s;
        }

        @keyframes rune-glow {
          0%, 100% {
            filter: drop-shadow(0 0 15px #9d4edd);
          }
          50% {
            filter: drop-shadow(0 0 30px #c77dff);
          }
        }

        .footer-incantation {
          color: #c77dff;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(199, 125, 255, 0.5);
        }

        .footer-signature {
          color: #e0aaff;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .arcane-title {
            font-size: 2rem;
          }
          
          .artifacts-cauldron {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .enchantment-grid {
            grid-template-columns: 1fr;
          }
          
          .acquisition-methods {
            grid-template-columns: 1fr;
          }

          .alchemy-tome,
          .acquisition-grimoire {
            padding: 1.5rem;
            margin: 0 auto 2rem;
          }

          .tome-header {
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .chapter-title {
            font-size: 1.5rem;
            text-align: center;
            line-height: 1.3;
            margin-bottom: 1rem;
          }

          .magical-formula {
            padding: 1.5rem;
            text-align: left;
          }

          .formula-title {
            font-size: 1.1rem;
            text-align: center;
            margin-bottom: 1rem;
          }

          .arcane-knowledge {
            font-size: 0.9rem;
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .component {
            font-size: 0.85rem;
            padding: 0.6rem 0;
            padding-left: 0.8rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .distribution-spell {
            font-size: 1rem;
            text-align: center;
            margin: 1.5rem 0 1rem;
          }

          .power-level {
            font-size: 0.9rem;
            text-align: center;
          }

          .sats-manifestation {
            font-size: 0.8rem;
            text-align: center;
          }

          .method-title {
            font-size: 1.1rem;
            text-align: center;
            margin-bottom: 1rem;
          }

          .method-description,
          .prophecy-text {
            font-size: 0.9rem;
            text-align: center;
            line-height: 1.5;
          }

          .ritual {
            font-size: 0.85rem;
            text-align: center;
            padding: 0.6rem;
          }
        }
      `}</style>
    </div>
  )
} 