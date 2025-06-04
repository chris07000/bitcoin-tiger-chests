'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'
import { useWallet } from '@/context/WalletContext'
import { ranks, calculateRank as calculateUserRank } from '@/lib/ranking'
import Link from 'next/link'

// Voeg badges toe voor ranks
const rankBadges: Record<string, string> = {
  'No Rank': '/badges/no-rank.png',
  'Initiate I': '/badges/initiate.png',
  'Initiate II': '/badges/initiate.png',
  'Initiate III': '/badges/initiate.png',
  'Initiate IV': '/badges/initiate.png',
  'Initiate V': '/badges/initiate.png',
  'Hunter I': '/badges/hunter.png',
  'Hunter II': '/badges/hunter.png',
  'Hunter III': '/badges/hunter.png',
  'Hunter IV': '/badges/hunter.png',
  'Hunter V': '/badges/hunter.png',
  'Elite I': '/badges/elite.png',
  'Elite II': '/badges/elite.png',
  'Elite III': '/badges/elite.png',
  'Elite IV': '/badges/elite.png',
  'Elite V': '/badges/elite.png',
  'Master I': '/badges/master.png',
  'Master II': '/badges/master.png',
  'Master III': '/badges/master.png',
  'Master IV': '/badges/master.png',
  'Master V': '/badges/master.png',
  'Grandmaster I': '/badges/grandmaster.png',
  'Grandmaster II': '/badges/grandmaster.png',
  'Grandmaster III': '/badges/grandmaster.png',
  'Grandmaster IV': '/badges/grandmaster.png',
  'Grandmaster V': '/badges/grandmaster.png',
  'Legend I': '/badges/legend.png',
  'Legend II': '/badges/legend.png',
  'Legend III': '/badges/legend.png',
  'Legend IV': '/badges/legend.png',
  'Legend V': '/badges/legend.png'
}

export default function RankingPage() {
  const [totalWagered, setTotalWagered] = useState<number>(0)
  const [userRank, setUserRank] = useState<string>('No Rank')
  const [nextRank, setNextRank] = useState<string>('Bronze')
  const [progressToNextRank, setProgressToNextRank] = useState<number>(0)
  const [showRankUpModal, setShowRankUpModal] = useState<boolean>(false)
  const [achievedRank, setAchievedRank] = useState<string>('')
  const [previousRank, setPreviousRank] = useState<string>('No Rank')
  const [dailyWager, setDailyWager] = useState<number>(0)
  const [weeklyWager, setWeeklyWager] = useState<number>(0)
  const [monthlyWager, setMonthlyWager] = useState<number>(0)
  const [gameStats, setGameStats] = useState<{
    chests: { played: number, won: number, wagered: number },
    coinflip: { played: number, won: number, wagered: number },
    raffles: { entered: number, won: number, wagered: number }
  }>({
    chests: { played: 0, won: 0, wagered: 0 },
    coinflip: { played: 0, won: 0, wagered: 0 },
    raffles: { entered: 0, won: 0, wagered: 0 }
  })
  const { connectXverse, connectMagicEden, walletAddress } = useWallet()

  useEffect(() => {
    // Haal gebruikersgegevens op van de API als er een wallet adres is
    if (walletAddress) {
      // Haal gebruikersgegevens op van de API
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user/stats?address=${walletAddress}`)
          
          if (!response.ok) {
            throw new Error('Fout bij het ophalen van gebruikersgegevens')
          }
          
          const userData = await response.json()
          
          // Sla de vorige rank op voordat we de nieuwe instellen
          setPreviousRank(userRank)
          
          // Update state met data van API
          setTotalWagered(userData.totalWagered)
          setUserRank(userData.rank)
          setNextRank(userData.nextRank)
          setProgressToNextRank(userData.rankProgress)
          setDailyWager(userData.dailyWager || 0)
          setWeeklyWager(userData.weeklyWager || 0)
          setMonthlyWager(userData.monthlyWager || 0)
          setGameStats(userData.gameStats || {
            chests: { played: 0, won: 0, wagered: 0 },
            coinflip: { played: 0, won: 0, wagered: 0 },
            raffles: { entered: 0, won: 0, wagered: 0 }
          })
          
          // Sla rank op voor navbar
          localStorage.setItem('userRank', userData.rank)
          
          // Check of de gebruiker een nieuwe rank heeft behaald
          if (previousRank !== 'No Rank' && userData.rank !== previousRank && userData.rank !== 'No Rank') {
            // Toon de rank-up notificatie
            setAchievedRank(userData.rank)
            setShowRankUpModal(true)
          }
        } catch (error) {
          console.error('Fout bij het ophalen van gebruikersgegevens:', error)
          
          // Gebruik fallback naar lokale berekening indien API faalt
          const mockWagered = Math.floor(Math.random() * 1200000)
          setTotalWagered(mockWagered)
          
          // Bepaal de huidige rank en volgende rank
          calculateRank(mockWagered)
        }
      }
      
      fetchUserData()
    }
  }, [walletAddress, userRank, previousRank])
  
  // Functie om de rank en voortgang te berekenen
  const calculateRank = (wagered: number) => {
    const { currentRank, nextRank, progress } = calculateUserRank(wagered)
    
    setUserRank(currentRank)
    setNextRank(nextRank)
    setProgressToNextRank(progress)
  }
  
  // Helper functie om de kleur van de huidige rank te krijgen
  const getCurrentRankColor = () => {
    // Extraheer de basis rank naam (zonder het level nummer) uit de userRank string
    const baseName = userRank.split(' ')[0];
    const rank = ranks.find(r => r.name === baseName);
    return rank ? rank.color : '#888888';
  }
  
  // Helper functie om de kleur van de volgende rank te krijgen
  const getNextRankColor = () => {
    // Extraheer de basis rank naam (zonder het level nummer) uit de nextRank string
    const baseName = nextRank.split(' ')[0];
    const rank = ranks.find(r => r.name === baseName);
    return rank ? rank.color : '#888888';
  }
  
  // Helper functie om de voordelen van de huidige rank weer te geven
  const getCurrentRankBenefits = () => {
    if (userRank === 'No Rank') return [];
    
    // Extraheer de basis rank naam en level uit de userRank string
    const [baseName, levelRoman] = userRank.split(' ');
    
    // Converteer Romeinse cijfers naar Arabische cijfers
    let level = 1;
    if (levelRoman === 'II') level = 2;
    else if (levelRoman === 'III') level = 3;
    else if (levelRoman === 'IV') level = 4;
    else if (levelRoman === 'V') level = 5;
    
    // Zoek het rank object met de juiste naam en level
    const rank = ranks.find(r => r.name === baseName && r.level === level);
    return rank ? rank.benefits : [];
  }
  
  // Helper functie om het resterende bedrag tot de volgende rank te berekenen
  const getRemainingToNextRank = () => {
    if (nextRank === 'Max Rank') return 0;
    
    // Extraheer de basis rank naam en level uit de nextRank string
    const [baseName, levelRoman] = nextRank.split(' ');
    
    // Converteer Romeinse cijfers naar Arabische cijfers
    let level = 1;
    if (levelRoman === 'II') level = 2;
    else if (levelRoman === 'III') level = 3;
    else if (levelRoman === 'IV') level = 4;
    else if (levelRoman === 'V') level = 5;
    
    // Zoek het rank object met de juiste naam en level
    const nextRankObj = ranks.find(r => r.name === baseName && r.level === level);
    if (!nextRankObj) return 0;
    
    return nextRankObj.minWager - totalWagered;
  }

  return (
    <>
      <style jsx>{`
        .page-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5rem 1rem 2rem;
          min-height: 100vh;
          color: #fff;
          background: #0d1320;
        }
        
        .title {
          font-size: 2.5rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 0.5rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }
        
        .subtitle {
          font-size: 1rem;
          font-family: 'Press Start 2P', monospace;
          color: #ccc;
          margin-bottom: 3rem;
          text-align: center;
          max-width: 800px;
        }
        
        .dashboard {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1200px;
          gap: 2rem;
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }
        
        .stat-card {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .stat-title {
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 0.75rem;
          font-family: Arial, sans-serif;
        }
        
        .stat-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 0.5rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .stat-description {
          font-size: 0.8rem;
          color: #bbb;
        }
        
        .rank-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          gap: 1.5rem;
        }
        
        .rank-title {
          font-size: 1.5rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 0.5rem;
        }
        
        .current-rank {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .rank-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 215, 0, 0.3);
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          max-width: fit-content;
        }
        
        .rank-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        
        .rank-progress-container {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          height: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
          margin: 1rem 0;
          position: relative;
        }
        
        .rank-progress-bar {
          height: 100%;
          transition: width 1s ease-in-out;
          border-radius: 8px;
        }
        
        .rank-progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .rank-description {
          font-size: 0.9rem;
          color: #bbb;
          margin-bottom: 1rem;
        }
        
        .rank-benefits {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .rank-benefit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .benefit-icon {
          color: #4afc4a;
        }
        
        .rank-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        
        .rank-table th,
        .rank-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .rank-table th {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #aaa;
          font-weight: normal;
        }
        
        .rank-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
        }
        
        .rank-color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        
        .rank-requirement {
          font-family: Arial, sans-serif;
          color: #bbb;
        }
        
        .benefit-list {
          font-family: Arial, sans-serif;
          color: #bbb;
          font-size: 0.8rem;
        }
        
        .benefit-list ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .rank-mark {
          color: #4afc4a;
          font-size: 1.2rem;
        }
        
        .connect-wallet {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          text-align: center;
          width: 100%;
          max-width: 600px;
          border: 1px dashed rgba(255, 215, 0, 0.3);
        }
        
        .connect-wallet-title {
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1rem;
        }
        
        .connect-wallet-text {
          color: #bbb;
          margin-bottom: 1.5rem;
        }
        
        .connect-button {
          background: #ffd700;
          color: #000;
          border: none;
          padding: 0.8rem 1.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .connect-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .connect-button:active {
          box-shadow: 0 1px 0 #4b0082;
          transform: translateY(3px);
        }
        
        .connect-button-text {
          display: inline-block;
          position: relative;
          z-index: 1;
        }
        
        .rank-up-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .rank-up-content {
          background: rgba(13, 19, 32, 0.95);
          border: 2px solid #ffd700;
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
          animation: scaleIn 0.4s ease-in-out;
        }
        
        .rank-up-header {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.8rem;
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .rank-up-badge {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 1.3rem;
          color: #000;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 20px currentColor;
          animation: pulse 2s infinite alternate;
        }
        
        .rank-up-message {
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        
        .rank-up-benefits {
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          width: 100%;
          text-align: left;
        }
        
        .rank-up-benefits-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ffd700;
          margin-bottom: 0.75rem;
        }
        
        .rank-up-benefits ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #fff;
        }
        
        .rank-up-benefits li {
          margin-bottom: 0.5rem;
        }
        
        .rank-up-button {
          background: #ffd700;
          color: #000;
          border: none;
          padding: 0.8rem 2rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .rank-up-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .stats-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .wager-stats {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .wager-period {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        
        .wager-period-title {
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 0.5rem;
        }
        
        .wager-period-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ffd700;
        }
        
        .game-stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .game-stat-card {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .game-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .game-stat-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ffd700;
        }
        
        .game-stat-icon {
          font-size: 1.5rem;
        }
        
        .game-stat-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .game-stat-metric {
          display: flex;
          justify-content: space-between;
        }
        
        .metric-label {
          color: #aaa;
        }
        
        .metric-value {
          font-weight: bold;
          color: #fff;
        }
        
        .win-value {
          color: #4afc4a;
        }
        
        /* Voeg nieuwe stijlen toe voor de badges */
        .rank-badge-img {
          width: 60px;
          height: 60px;
          margin-right: 10px;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
        }
        
        /* Maak de rank-naam groter en in juiste kleur */
        .rank-name-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-left: 10px;
        }
        
        /* Stijl voor de rank naam in het Current Rank kaartje */
        .rank-name-display {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.4rem;
          text-shadow: 0 0 8px currentColor, 1px 1px 0 rgba(0,0,0,0.7);
          letter-spacing: 1px;
        }
        
        /* Stijl voor rank-up modal badge */
        .rank-up-badge-img {
          width: 120px;
          height: 120px;
          margin: 20px 0;
          filter: drop-shadow(0 0 15px rgba(255,255,255,0.5));
          animation: pulse 2s infinite alternate;
        }
        
        @keyframes pulse {
          from { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
          to { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(255,255,255,0.6)); }
        }
        
        /* Styles for the rewards button */
        .rewards-button-container {
          margin-top: 1.5rem;
          text-align: center;
        }
        
        .rewards-button {
          background: #8a2be2;
          border: 3px solid #ffd700;
          color: white;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 0 #4b0082, 0 6px 10px rgba(0, 0, 0, 0.3);
          position: relative;
          top: 0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .rewards-button:hover {
          background: #9932cc;
          box-shadow: 0 6px 0 #4b0082, 0 8px 15px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
        
        .rewards-button:active {
          box-shadow: 0 1px 0 #4b0082;
          transform: translateY(3px);
        }
        
        .rewards-button-text {
          display: inline-block;
          position: relative;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .title {
            font-size: 1.8rem;
          }
          
          .subtitle {
            font-size: 0.8rem;
          }
          
          .rank-table th,
          .rank-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.8rem;
          }
          
          .stat-value {
            font-size: 1.4rem;
          }
        }
        
        /* Wallet buttons styling */
        .wallet-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 1rem;
        }
        
        .pixel-button {
          padding: 0.75rem 1.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
          text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        
        .pixel-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
        }
        
        .pixel-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
        }
        
        .pixel-button.xverse {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }
        
        .pixel-button.xverse:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        }
        
        .pixel-button.magiceden {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
        }
        
        .pixel-button.magiceden:hover {
          background: linear-gradient(135deg, #ea580c 0%, #9a3412 100%);
        }
      `}</style>

      <div className="page-content">
        <h1 className="title">Bitcoin Tiger Ranking System</h1>
        <p className="subtitle">Play, wager and rise in rank to unlock exclusive rewards!</p>
        
        {walletAddress ? (
          <div className="dashboard">
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-title">Current Rank</div>
                <div className="stat-value" style={{ color: getCurrentRankColor(), display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                  <Image 
                    src={rankBadges[userRank] || rankBadges['No Rank']}
                    alt={userRank}
                    width={38}
                    height={38}
                    className="rank-badge-img"
                    style={{ marginRight: '10px', filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' }}
                  />
                  <span className="rank-name-display">{userRank}</span>
                </div>
                <div className="stat-description">
                  {nextRank === 'Max Rank' ? 'You have reached the highest rank!' : `Need ${getRemainingToNextRank().toLocaleString()} more sats for ${nextRank}`}
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Total Wagered</div>
                <div className="stat-value">{totalWagered.toLocaleString()} sats</div>
                <div className="stat-description">Lifetime wager across all games</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Rank Benefits</div>
                <div className="stat-description">
                  {userRank === 'No Rank' ? (
                    'You have no rank yet. Start playing to unlock benefits!'
                  ) : (
                    <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                      {getCurrentRankBenefits().map((benefit, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>{benefit}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {userRank !== 'No Rank' && (
                  <div className="rewards-button-container">
                    <Link href="/rewards">
                      <button className="rewards-button">
                        <span className="rewards-button-text">Claim Your Rewards</span>
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <div className="rank-section">
              <div>
                <h2 className="rank-title">Your Ranking Progress</h2>
                <div className="current-rank">
                  <div className="rank-badge" style={{ display: 'flex', alignItems: 'center' }}>
                    <Image 
                      src={rankBadges[userRank] || rankBadges['No Rank']}
                      alt={userRank}
                      width={50}
                      height={50}
                      className="rank-badge-img"
                      style={{ marginRight: '12px', filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' }}
                    />
                    <span className="rank-name-display">{userRank}</span>
                  </div>
                  
                  <div className="rank-progress-container">
                    <div 
                      className="rank-progress-bar" 
                      style={{ 
                        width: `${progressToNextRank}%`,
                        background: `linear-gradient(90deg, ${getCurrentRankColor()}, ${getNextRankColor()})`
                      }}
                    ></div>
                    <div className="rank-progress-text">{progressToNextRank}%</div>
                  </div>
                  
                  <div className="rank-description">
                    {nextRank === 'Max Rank' 
                      ? 'Congratulations! You have reached the maximum Grandmaster rank!' 
                      : `You need to wager ${getRemainingToNextRank().toLocaleString()} more sats to reach ${nextRank} rank.`}
                  </div>
                </div>
              </div>
              
              <h2 className="rank-title">Rank Overview</h2>
              <table className="rank-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Required Wager</th>
                    <th>Benefits</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((rank, index) => {
                    // Converteer niveau naar Romeins cijfer
                    const levelRoman = rank.level === 1 ? 'I' : 
                                       rank.level === 2 ? 'II' : 
                                       rank.level === 3 ? 'III' : 
                                       rank.level === 4 ? 'IV' : 'V';
                    
                    // Volledige rank naam met niveau
                    const fullRankName = `${rank.name} ${levelRoman}`;
                    
                    return (
                      <tr key={index}>
                        <td>
                          <div className="rank-name">
                            <span 
                              className="rank-color-dot" 
                              style={{ backgroundColor: rank.color }}
                            ></span>
                            <Image 
                              src={rankBadges[fullRankName] || rankBadges['No Rank']}
                              alt={fullRankName}
                              width={24} 
                              height={24}
                              className="rank-badge-img"
                              style={{ margin: '0 8px 0 0' }}
                            />
                            {fullRankName}
                          </div>
                        </td>
                        <td className="rank-requirement">{rank.minWager.toLocaleString()} sats</td>
                        <td className="benefit-list">
                          <ul>
                            {rank.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          {totalWagered >= rank.minWager ? (
                            <span className="rank-mark">✓</span>
                          ) : (
                            <span></span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="stats-section">
              <h2 className="rank-title">Statistics Details</h2>
              
              <div className="wager-stats">
                <div className="wager-period">
                  <div className="wager-period-title">Today</div>
                  <div className="wager-period-value">{dailyWager.toLocaleString()} sats</div>
                </div>
                <div className="wager-period">
                  <div className="wager-period-title">This Week</div>
                  <div className="wager-period-value">{weeklyWager.toLocaleString()} sats</div>
                </div>
                <div className="wager-period">
                  <div className="wager-period-title">This Month</div>
                  <div className="wager-period-value">{monthlyWager.toLocaleString()} sats</div>
                </div>
              </div>
              
              <div className="game-stats-container">
                <div className="game-stat-card">
                  <div className="game-stat-header">
                    <div className="game-stat-title">Chests</div>
                    <div className="game-stat-icon">🎁</div>
                  </div>
                  <div className="game-stat-metrics">
                    <div className="game-stat-metric">
                      <span className="metric-label">Played:</span>
                      <span className="metric-value">{gameStats.chests.played}</span>
                    </div>
                    <div className="game-stat-metric">
                      <span className="metric-label">Won:</span>
                      <span className="metric-value win-value">{gameStats.chests.won}</span>
                    </div>
                    <div className="game-stat-metric">
                      <span className="metric-label">Wagered:</span>
                      <span className="metric-value">{gameStats.chests.wagered.toLocaleString()} sats</span>
                    </div>
                  </div>
                </div>
                
                <div className="game-stat-card">
                  <div className="game-stat-header">
                    <div className="game-stat-title">Coinflip</div>
                    <div className="game-stat-icon">🪙</div>
                  </div>
                  <div className="game-stat-metrics">
                    <div className="game-stat-metric">
                      <span className="metric-label">Played:</span>
                      <span className="metric-value">{gameStats.coinflip.played}</span>
                    </div>
                    <div className="game-stat-metric">
                      <span className="metric-label">Won:</span>
                      <span className="metric-value win-value">{gameStats.coinflip.won}</span>
                    </div>
                    <div className="game-stat-metric">
                      <span className="metric-label">Wagered:</span>
                      <span className="metric-value">{gameStats.coinflip.wagered.toLocaleString()} sats</span>
                    </div>
                  </div>
                </div>
                
                <div className="game-stat-card">
                  <div className="game-stat-header">
                    <div className="game-stat-title">Raffles</div>
                    <div className="game-stat-icon">🎟️</div>
                  </div>
                  <div className="game-stat-metrics">
                    <div className="game-stat-metric">
                      <span className="metric-label">Entered:</span>
                      <span className="metric-value">{gameStats.raffles.entered}</span>
                    </div>
                    <div className="game-stat-metric">
                      <span className="metric-label">Won:</span>
                      <span className="metric-value win-value">{gameStats.raffles.won}</span>
                    </div>
                    <div className="game-stat-metric">
                      <span className="metric-label">Wagered:</span>
                      <span className="metric-value">{gameStats.raffles.wagered.toLocaleString()} sats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="connect-wallet">
            <h2 className="connect-wallet-title">Connect Your Wallet</h2>
            <p className="connect-wallet-text">
              Connect your Bitcoin wallet to view your rank and progress. 
              You can earn exclusive rewards as you play more!
            </p>
            <div className="wallet-buttons">
              <button 
                className="pixel-button xverse"
                onClick={connectXverse}
              >
                Connect Xverse
              </button>
              <button 
                className="pixel-button magiceden"
                onClick={connectMagicEden}
              >
                Connect Magic Eden
              </button>
            </div>
          </div>
        )}
      </div>

      {showRankUpModal && (
        <div className="rank-up-modal">
          <div className="rank-up-content">
            <div className="rank-up-header">Congratulations!</div>
            <div>
              <Image 
                src={rankBadges[achievedRank] || rankBadges['Bronze I']}
                alt={achievedRank}
                width={120}
                height={120}
                className="rank-up-badge-img"
              />
            </div>
            <div className="rank-up-message">
              You have reached the {achievedRank} rank!
            </div>
            <div className="rank-up-benefits">
              <div className="rank-up-benefits-title">New benefits:</div>
              <ul>
                {(() => {
                  // Extraheer de basis rank naam en level uit de achievedRank string
                  const [baseName, levelRoman] = achievedRank.split(' ');
                  
                  // Converteer Romeinse cijfers naar Arabische cijfers
                  let level = 1;
                  if (levelRoman === 'II') level = 2;
                  else if (levelRoman === 'III') level = 3;
                  else if (levelRoman === 'IV') level = 4;
                  else if (levelRoman === 'V') level = 5;
                  
                  // Zoek het rank object met de juiste naam en level
                  const rank = ranks.find(r => r.name === baseName && r.level === level);
                  return rank?.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ));
                })()}
              </ul>
            </div>
            <button 
              className="rank-up-button" 
              onClick={() => setShowRankUpModal(false)}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </>
  )
} 