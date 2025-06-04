'use client'

import { useState, useEffect } from 'react'
import { useLightning } from '@/context/LightningContext'
import { toast } from 'react-hot-toast'

interface Reward {
  id: string
  rewardType: string
  amount: number
  period: string
  description: string
  status: string
  createdAt: string
  claimedAt?: string
}

export default function RewardsPage() {
  const { walletAddress, balance, setBalance } = useLightning()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [totalClaimable, setTotalClaimable] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isClaiming, setIsClaiming] = useState<boolean>(false)

  useEffect(() => {
    if (walletAddress) {
      fetchRewards()
    } else {
      setIsLoading(false)
    }
  }, [walletAddress])

  const fetchRewards = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/rewards?address=${walletAddress}`)
      const data = await response.json()

      if (data.success) {
        setRewards(data.rewards || [])
        setTotalClaimable(data.totalClaimable || 0)
      } else {
        toast.error(data.error || 'Failed to load rewards')
      }
    } catch (error) {
      console.error('Error fetching rewards:', error)
      toast.error('Failed to load rewards')
    } finally {
      setIsLoading(false)
    }
  }

  const claimReward = async (rewardId: string) => {
    if (isClaiming) return

    setIsClaiming(true)
    try {
      const response = await fetch('/api/user/rewards/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          rewardId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || 'Reward claimed successfully')
        setBalance(data.balance || balance)
        fetchRewards() // Refresh the rewards list
      } else {
        toast.error(data.error || 'Failed to claim reward')
      }
    } catch (error) {
      console.error('Error claiming reward:', error)
      toast.error('Failed to claim reward')
    } finally {
      setIsClaiming(false)
    }
  }

  const claimAllRewards = async () => {
    if (isClaiming) return

    setIsClaiming(true)
    try {
      const response = await fetch('/api/user/rewards/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          claimAll: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || 'All rewards claimed successfully')
        setBalance(data.balance || balance)
        fetchRewards() // Refresh the rewards list
      } else {
        toast.error(data.error || 'Failed to claim rewards')
      }
    } catch (error) {
      console.error('Error claiming all rewards:', error)
      toast.error('Failed to claim rewards')
    } finally {
      setIsClaiming(false)
    }
  }

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'RAKEBACK':
        return '💰'
      case 'MONTHLY_BONUS':
        return '🎁'
      case 'LOSS_COMPENSATION':
        return '🛡️'
      case 'WEEKLY_LOSS_COMPENSATION':
        return '⚡'
      default:
        return '🪙'
    }
  }

  const formatRewardType = (type: string) => {
    switch (type) {
      case 'RAKEBACK':
        return 'Rakeback'
      case 'MONTHLY_BONUS':
        return 'Monthly Bonus'
      case 'LOSS_COMPENSATION':
        return 'Loss Compensation'
      case 'WEEKLY_LOSS_COMPENSATION':
        return 'Weekly Loss Compensation'
      default:
        return type
    }
  }

  return (
    <>
      <style jsx>{`
        .rewards-page {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
          color: #fff;
        }

        .page-title {
          font-size: 2.5rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 1rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }

        .page-description {
          text-align: center;
          margin-bottom: 2rem;
          color: #ccc;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .connect-wallet {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
          border: 1px dashed rgba(255, 215, 0, 0.3);
        }

        .loading {
          text-align: center;
          font-size: 1.2rem;
          margin: 2rem 0;
          color: #ccc;
        }

        .summary-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #ffd700;
          margin-bottom: 0.5rem;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: bold;
          color: #ffd700;
          margin: 0.5rem 0;
        }

        .claim-all-button {
          background: #ffd700;
          color: #000;
          border: none;
          padding: 0.8rem 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.2s;
        }

        .claim-all-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }

        .claim-all-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rewards-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .reward-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          transition: transform 0.2s;
        }

        .reward-card:hover {
          transform: translateY(-3px);
        }

        .reward-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #ffd700;
          margin-bottom: 0.75rem;
        }

        .reward-amount {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          margin: 0.5rem 0;
        }

        .reward-description {
          font-size: 0.9rem;
          color: #ccc;
          margin-bottom: 1rem;
        }

        .reward-period {
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 0.5rem;
        }

        .reward-created {
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 1rem;
        }

        .claim-button {
          background: #ffd700;
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
        }

        .claim-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }

        .claim-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .claimed-badge {
          background: #4afc4a;
          color: #000;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          text-align: center;
          font-weight: bold;
        }

        .no-rewards {
          text-align: center;
          padding: 2rem;
          color: #ccc;
          font-size: 1.1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        
        .info-card h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #ffd700;
          margin-bottom: 1rem;
        }
        
        .info-card ul {
          list-style-type: none;
          padding-left: 0.5rem;
        }
        
        .info-card li {
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          color: #ddd;
        }
        
        .reward-type-label {
          color: #ffd700;
          font-weight: bold;
          margin-right: 0.5rem;
        }
        
        .info-card p {
          font-style: italic;
          margin-top: 1rem;
          color: #aaa;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.8rem;
          }

          .rewards-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="rewards-page">
        <h1 className="page-title">My Rewards</h1>
        <p className="page-description">
          View and claim your rewards from playing Bitcoin Tiger games.
          Your rewards include rakeback, bonuses, and loss compensation based on your rank.
        </p>

        <div className="info-card">
          <h3>How rewards work:</h3>
          <ul>
            <li><span className="reward-type-label">Rakeback:</span> Automatically calculated at the end of each month based on your total wagers and rank percentage.</li>
            <li><span className="reward-type-label">Monthly Bonus:</span> Fixed bonus amount awarded each month based on your rank level.</li>
            <li><span className="reward-type-label">Loss Compensation:</span> Percentage of your net losses returned monthly based on your rank.</li>
            <li><span className="reward-type-label">Weekly Loss Compensation:</span> Special benefit for Grandmaster rank - returns a percentage of weekly losses.</li>
          </ul>
          <p>All rewards must be claimed manually on this page.</p>
        </div>

        {!walletAddress ? (
          <div className="connect-wallet">
            <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>Connect Your Wallet</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Connect your Bitcoin wallet to view and claim your rewards.
            </p>
            <button
              style={{
                background: '#ffd700',
                color: '#000',
                border: 'none',
                padding: '0.8rem 1.5rem',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.9rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Connect Wallet
            </button>
          </div>
        ) : isLoading ? (
          <div className="loading">Loading rewards...</div>
        ) : (
          <>
            <div className="summary-card">
              <div className="summary-title">Total Claimable Rewards</div>
              <div className="summary-value">{totalClaimable.toLocaleString()} sats</div>
              {rewards.length > 0 && (
                <button
                  className="claim-all-button"
                  onClick={claimAllRewards}
                  disabled={totalClaimable === 0 || isClaiming}
                >
                  {isClaiming ? 'Claiming...' : 'Claim All Rewards'}
                </button>
              )}
            </div>

            {rewards.length > 0 ? (
              <div className="rewards-list">
                {rewards.map((reward) => (
                  <div key={reward.id} className="reward-card">
                    <div className="reward-type">
                      <span>{getRewardTypeIcon(reward.rewardType)}</span>
                      <span>{formatRewardType(reward.rewardType)}</span>
                    </div>
                    <div className="reward-amount">+{reward.amount.toLocaleString()} sats</div>
                    <div className="reward-description">{reward.description}</div>
                    <div className="reward-period">Period: {reward.period}</div>
                    <div className="reward-created">
                      Created: {new Date(reward.createdAt).toLocaleDateString()}
                    </div>
                    {reward.status === 'PENDING' ? (
                      <button
                        className="claim-button"
                        onClick={() => claimReward(reward.id)}
                        disabled={isClaiming}
                      >
                        {isClaiming ? 'Claiming...' : 'Claim Reward'}
                      </button>
                    ) : (
                      <div className="claimed-badge">Claimed</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-rewards">
                You don't have any claimable rewards at the moment.
                Start playing and rank up to earn rewards!
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
} 