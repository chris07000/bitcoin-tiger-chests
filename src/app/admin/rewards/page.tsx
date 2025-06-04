'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function AdminRewardsPage() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [adminKey, setAdminKey] = useState<string>('')
  const [result, setResult] = useState<string | null>(null)
  
  const generateRewards = async (type: 'monthly' | 'weekly') => {
    if (isGenerating) return
    if (!adminKey) {
      toast.error('Please enter the admin API key')
      return
    }
    
    setIsGenerating(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/admin/generate-rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': adminKey
        },
        body: JSON.stringify({ type })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} rewards generated successfully`)
        setResult(JSON.stringify(data, null, 2))
      } else {
        toast.error(data.error || `Failed to generate ${type} rewards`)
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (error) {
      console.error(`Error generating ${type} rewards:`, error)
      toast.error(`Failed to generate ${type} rewards`)
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <div className="admin-page">
      <style jsx>{`
        .admin-page {
          padding: 2rem;
          color: #fff;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .admin-title {
          font-size: 2rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .admin-description {
          margin-bottom: 2rem;
          text-align: center;
          color: #ccc;
        }
        
        .api-key-input {
          margin-bottom: 2rem;
          background: #1a1a1a;
          padding: 1rem;
          border-radius: 8px;
        }
        
        .admin-section {
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
        }
        
        .section-title {
          font-size: 1.2rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1rem;
        }
        
        .section-description {
          margin-bottom: 1.5rem;
          color: #ccc;
          font-size: 0.9rem;
        }
        
        .admin-button {
          background: #ffd700;
          color: #000;
          border: none;
          padding: 0.75rem 1.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 1rem;
          margin-bottom: 1rem;
        }
        
        .admin-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .admin-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .result-container {
          background: #1a1a1a;
          padding: 1rem;
          border-radius: 8px;
          font-family: monospace;
          white-space: pre-wrap;
          overflow-x: auto;
          margin-top: 1.5rem;
          max-height: 300px;
          overflow-y: auto;
        }
        
        input {
          width: 100%;
          background: #2a2a2a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem;
          border-radius: 4px;
          color: #fff;
          margin-top: 0.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #ffd700;
        }
      `}</style>
      
      <h1 className="admin-title">Rewards Admin</h1>
      <p className="admin-description">
        Generate rewards for users based on their ranks, wagering activity, and losses.
      </p>
      
      <div className="api-key-input">
        <label>Admin API Key</label>
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Enter admin API key"
        />
      </div>
      
      <div className="admin-section">
        <h2 className="section-title">Monthly Rewards</h2>
        <p className="section-description">
          Generate rakeback, monthly bonuses, and monthly loss compensation for all eligible users.
          This should typically be run once per month.
        </p>
        
        <button 
          className="admin-button"
          onClick={() => generateRewards('monthly')}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Monthly Rewards'}
        </button>
      </div>
      
      <div className="admin-section">
        <h2 className="section-title">Weekly Rewards</h2>
        <p className="section-description">
          Generate weekly loss compensation for Diamond rank users.
          This should typically be run once per week.
        </p>
        
        <button 
          className="admin-button"
          onClick={() => generateRewards('weekly')}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Weekly Rewards'}
        </button>
      </div>
      
      {result && (
        <div className="result-container">
          {result}
        </div>
      )}
    </div>
  )
} 