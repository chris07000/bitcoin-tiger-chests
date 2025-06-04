'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Admin API key - normaal gesproken zou je dit uit een .env of beveiligde storage halen
const ADMIN_API_KEY = 'Bitcoin-Tiger-Admin-Secret-Key'

type Raffle = {
  id: number,
  name: string,
  description: string,
  image: string,
  ticketPrice: number,
  totalTickets: number,
  soldTickets: number,
  endsAt: Date,
  winner: string | null,
  winnerPickedAt?: Date | null
}

export default function ManageRafflesPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(null)
  const [isDrawingWinner, setIsDrawingWinner] = useState(false)
  const [autoDraw, setAutoDraw] = useState(false)
  const [autoDrawInterval, setAutoDrawInterval] = useState(5)
  const [isSettingAutoDraw, setIsSettingAutoDraw] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  useEffect(() => {
    fetchRaffles()
  }, [])

  const fetchRaffles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/raffle/list?status=all')
      if (response.ok) {
        const data = await response.json()
        if (data.raffles) {
          setRaffles(data.raffles)
        }
      } else {
        setMessage({ 
          text: 'Failed to load raffles', 
          type: 'error' 
        })
      }
    } catch (error) {
      setMessage({ 
        text: 'Error fetching raffles', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const drawWinner = async (raffleId: number) => {
    if (!confirm('Are you sure you want to draw a winner for this raffle? This action cannot be undone.')) {
      return
    }

    setIsDrawingWinner(true)
    setSelectedRaffle(raffleId)
    setMessage({ text: '', type: '' })

    try {
      const response = await fetch('/api/admin/raffle/draw-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_API_KEY}`
        },
        body: JSON.stringify({ raffleId })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          text: 'Winner successfully drawn!', 
          type: 'success' 
        })
        
        // Update local state with new winner
        setRaffles(prev => 
          prev.map(raffle => 
            raffle.id === raffleId 
              ? { ...raffle, winner: data.raffle.winner } 
              : raffle
          )
        )
      } else {
        setMessage({ 
          text: `Error: ${data.error || 'Failed to draw winner'}`, 
          type: 'error' 
        })
      }
    } catch (error) {
      setMessage({ 
        text: 'An error occurred while drawing the winner', 
        type: 'error' 
      })
    } finally {
      setIsDrawingWinner(false)
      setSelectedRaffle(null)
    }
  }

  const toggleAutoDraw = async () => {
    setIsSettingAutoDraw(true);
    setMessage({ text: '', type: '' });
    
    try {
      if (autoDraw) {
        // Stop auto-draw
        const response = await fetch('/api/admin/setup-auto-draw', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${ADMIN_API_KEY}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setAutoDraw(false);
          setMessage({ 
            text: 'Automatic winner drawing stopped', 
            type: 'success' 
          });
        } else {
          setMessage({ 
            text: `Error: ${data.error || 'Failed to stop automatic drawing'}`, 
            type: 'error' 
          });
        }
      } else {
        // Start auto-draw
        const response = await fetch('/api/admin/setup-auto-draw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_API_KEY}`
          },
          body: JSON.stringify({ intervalMinutes: autoDrawInterval })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setAutoDraw(true);
          setMessage({ 
            text: `Automatic winner drawing started (interval: ${autoDrawInterval} minute(s))`, 
            type: 'success' 
          });
        } else {
          setMessage({ 
            text: `Error: ${data.error || 'Failed to start automatic drawing'}`, 
            type: 'error' 
          });
        }
      }
    } catch (error) {
      setMessage({ 
        text: 'An error occurred while setting up automatic drawing', 
        type: 'error' 
      });
      console.error(error);
    } finally {
      setIsSettingAutoDraw(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeLeft = (endDate: Date) => {
    const now = new Date()
    const diff = new Date(endDate).getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}d ${hours}h ${minutes}m`
  }

  const copyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    }).catch(err => {
      console.error('Failed to copy address:', err);
    });
  };

  return (
    <>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5rem 2rem;
          min-height: 100vh;
          background: #0d1320;
          color: #fff;
        }
        
        .title {
          font-size: 2rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }
        
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 2rem;
        }
        
        .create-button {
          background: #ffd700;
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 0.8rem 1.2rem;
          font-size: 0.9rem;
          font-family: 'Press Start 2P', monospace;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        
        .create-button:hover {
          transform: translateY(-2px);
          background: #ffe970;
        }
        
        .refresh-button {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 0.6rem 1rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .refresh-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .message {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 4px;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          max-width: 800px;
          width: 100%;
        }
        
        .message.success {
          background: rgba(74, 252, 74, 0.1);
          color: #4afc4a;
          border: 1px solid #4afc4a;
        }
        
        .message.error {
          background: rgba(255, 0, 0, 0.1);
          color: #ff5555;
          border: 1px solid #ff5555;
        }
        
        .raffles-container {
          width: 100%;
          max-width: 1200px;
        }
        
        .raffle-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .raffle-table thead {
          background: rgba(0, 0, 0, 0.5);
        }
        
        .raffle-table th {
          padding: 1rem;
          text-align: left;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #ffd700;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .raffle-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
        }
        
        .raffle-table tr:last-child td {
          border-bottom: none;
        }
        
        .raffle-table tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .raffle-table tr:hover {
          background: rgba(255, 215, 0, 0.05);
        }
        
        .raffle-image {
          border-radius: 4px;
        }
        
        .ticket-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .ticket-sold {
          color: #ffd700;
          font-weight: bold;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .draw-winner-button {
          background: #4afc4a;
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 0.8rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .draw-winner-button:hover:not(:disabled) {
          background: #5aff5a;
        }
        
        .draw-winner-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .status-tag {
          display: inline-block;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .status-active {
          background: rgba(74, 252, 74, 0.1);
          color: #4afc4a;
          border: 1px solid #4afc4a;
        }
        
        .status-ended {
          background: rgba(255, 0, 0, 0.1);
          color: #ff5555;
          border: 1px solid #ff5555;
        }
        
        .status-completed {
          background: rgba(255, 215, 0, 0.1);
          color: #ffd700;
          border: 1px solid #ffd700;
        }
        
        .winner-address {
          font-size: 0.8rem;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .winner-cell {
          max-width: 150px;
        }
        
        .loading-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 2rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
        }
        
        .empty-state {
          padding: 2rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
        }
        
        .auto-draw-container {
          background: rgba(0, 0, 0, 0.3);
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          margin-bottom: 2rem;
          width: 100%;
          max-width: 1200px;
        }
        
        .auto-draw-title {
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        
        .auto-draw-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
        }
        
        .interval-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .interval-label {
          font-size: 0.9rem;
          color: #ccc;
        }
        
        .interval-input {
          width: 60px;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 215, 0, 0.5);
          border-radius: 4px;
          color: #fff;
          font-size: 0.9rem;
          text-align: center;
        }
        
        .auto-draw-button {
          background: #4afc4a;
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .auto-draw-button.stop {
          background: #ff5555;
        }
        
        .auto-draw-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .auto-draw-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .auto-draw-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }
        
        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .status-indicator.active {
          background: #4afc4a;
          box-shadow: 0 0 10px rgba(74, 252, 74, 0.5);
        }
        
        .status-indicator.inactive {
          background: #888;
        }
        
        .status-text {
          font-size: 0.9rem;
          color: #ccc;
        }
        
        .copy-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 4px;
          color: #ffd700;
          padding: 0.2rem 0.5rem;
          font-size: 0.8rem;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: all 0.2s;
        }
        
        .copy-button:hover {
          background: rgba(255, 215, 0, 0.2);
        }
        
        .full-address {
          font-size: 0.9rem;
          color: #ffd700;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.5rem;
          border-radius: 4px;
          max-width: 260px;
          position: relative;
        }
        
        .address-display {
          margin-bottom: 0.3rem;
          font-family: monospace;
          word-break: break-all;
        }
        
        .addr-prefix {
          color: #4afc4a;
          font-weight: bold;
        }
        
        .addr-part {
          color: #ffd700;
        }
        
        .address-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-start;
        }
        
        .mempool-link {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #fff;
          padding: 0.2rem 0.5rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .mempool-link:hover {
          background: rgba(0, 0, 0, 0.5);
          border-color: #ffd700;
        }
        
        .copied-indicator {
          position: relative;
          display: inline-block;
        }
        
        .copied-message {
          position: absolute;
          top: -25px;
          right: 0;
          background: rgba(74, 252, 74, 0.9);
          color: #000;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.7rem;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .raffle-table {
            display: block;
            overflow-x: auto;
          }
          
          .auto-draw-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .auto-draw-status {
            margin-left: 0;
            margin-top: 1rem;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="title">Manage Raffles</h1>
        
        <div className="auto-draw-container">
          <h2 className="auto-draw-title">Auto-Draw Settings</h2>
          <div className="auto-draw-controls">
            <div className="interval-control">
              <span className="interval-label">Check Interval (minutes):</span>
              <input
                type="number"
                className="interval-input"
                value={autoDrawInterval}
                onChange={(e) => setAutoDrawInterval(parseInt(e.target.value) || 1)}
                min="1"
                max="60"
                disabled={autoDraw || isSettingAutoDraw}
              />
            </div>
            
            <button
              className={`auto-draw-button ${autoDraw ? 'stop' : ''}`}
              onClick={toggleAutoDraw}
              disabled={isSettingAutoDraw}
            >
              {isSettingAutoDraw
                ? 'Processing...'
                : autoDraw
                  ? 'Stop Auto-Draw'
                  : 'Start Auto-Draw'
              }
            </button>
            
            <div className="auto-draw-status">
              <div className={`status-indicator ${autoDraw ? 'active' : 'inactive'}`}></div>
              <span className="status-text">
                {autoDraw ? 'Auto-draw active' : 'Auto-draw inactive'}
              </span>
            </div>
          </div>
        </div>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="controls">
          <Link href="/admin/raffle" className="create-button">
            Create New Raffle
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="refresh-button"
              onClick={fetchRaffles}
            >
              Refresh List
            </button>
            
            <Link 
              href="/admin/logout" 
              style={{
                background: 'rgba(255, 0, 0, 0.2)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem 1rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              Logout
            </Link>
          </div>
        </div>
        
        <div className="raffles-container">
          {loading ? (
            <div className="loading-indicator">Loading raffles...</div>
          ) : raffles.length === 0 ? (
            <div className="empty-state">
              <p>No raffles found</p>
              <p>Create a new raffle to get started</p>
            </div>
          ) : (
            <table className="raffle-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Tickets</th>
                  <th>Status</th>
                  <th>End Date</th>
                  <th>Winner</th>
                  <th>Drawn At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {raffles.map(raffle => {
                  const isActive = new Date(raffle.endsAt) > new Date() && !raffle.winner;
                  const isEnded = new Date(raffle.endsAt) <= new Date() && !raffle.winner;
                  const isCompleted = !!raffle.winner;
                  
                  return (
                    <tr key={raffle.id}>
                      <td>
                        <Image
                          src={raffle.image}
                          alt={raffle.name}
                          width={50}
                          height={50}
                          className="raffle-image"
                          style={{ 
                            imageRendering: 'pixelated',  // Houdt pixel art scherp
                            objectFit: 'contain'          // Behoudt de aspectratio
                          }}
                        />
                      </td>
                      <td>{raffle.name}</td>
                      <td>{raffle.ticketPrice.toLocaleString()} sats</td>
                      <td>
                        <div className="ticket-info">
                          <span className="ticket-sold">{raffle.soldTickets}</span>
                          <span>/ {raffle.totalTickets}</span>
                        </div>
                      </td>
                      <td>
                        {isActive && (
                          <span className="status-tag status-active">Active</span>
                        )}
                        {isEnded && (
                          <span className="status-tag status-ended">Ended</span>
                        )}
                        {isCompleted && (
                          <span className="status-tag status-completed">Completed</span>
                        )}
                      </td>
                      <td>
                        <div>{formatDate(raffle.endsAt)}</div>
                        {isActive && (
                          <small>{formatTimeLeft(raffle.endsAt)}</small>
                        )}
                      </td>
                      <td className="winner-cell">
                        {raffle.winner ? (
                          <div className="full-address">
                            <div className="address-display">
                              {raffle.winner.startsWith('bc1') ? (
                                <>
                                  <span className="addr-prefix">bc1</span>
                                  <span className="addr-part">{raffle.winner.slice(3, 9)}</span>
                                  ...
                                  <span className="addr-part">{raffle.winner.slice(-8)}</span>
                                </>
                              ) : (
                                raffle.winner
                              )}
                            </div>
                            <div className="address-actions">
                              <button 
                                className="copy-button"
                                onClick={() => copyWalletAddress(raffle.winner!)}
                                title="Copy full wallet address"
                              >
                                {copiedAddress === raffle.winner ? 'Copied!' : 'Copy'}
                              </button>
                              <a 
                                href={`https://mempool.space/address/${raffle.winner}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mempool-link"
                                title="View on Mempool.space"
                              >
                                🔍
                              </a>
                            </div>
                            {copiedAddress === raffle.winner && (
                              <div className="copied-message">Copied!</div>
                            )}
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td>
                        {raffle.winnerPickedAt ? (
                          <span className="winner-date">
                            {formatDate(raffle.winnerPickedAt)}
                          </span>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {isEnded && raffle.soldTickets > 0 && !raffle.winner ? (
                            <button
                              className="draw-winner-button"
                              onClick={() => drawWinner(raffle.id)}
                              disabled={
                                isDrawingWinner || 
                                selectedRaffle === raffle.id
                              }
                            >
                              {selectedRaffle === raffle.id ? 'Drawing...' : 'Draw Winner'}
                            </button>
                          ) : isActive ? (
                            <span className="status-note">Active</span>
                          ) : raffle.winner ? (
                            <span className="status-note" title="Winner has been selected">Winner drawn</span>
                          ) : raffle.soldTickets === 0 ? (
                            <span className="status-note">No tickets sold</span>
                          ) : (
                            <span className="status-note">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
} 