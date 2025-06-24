'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLightning } from '@/context/LightningContext'
import { WalletProvider, useWallet } from '@/context/WalletContext'

interface UserProfile {
  id: string
  displayName?: string
  avatar?: string
  bio?: string
  joinedAt: string
  lastSeen: string
  totalWins: number
  totalLosses: number
  favoriteGame?: string
}

interface CryptoAddress {
  id: string
  addressType: string
  address: string
  label?: string
  isVerified: boolean
  isPrimary: boolean
}

interface GameStats {
  chestsPlayed: number
  chestsWon: number
  chestsWagered: number
  coinflipPlayed: number
  coinflipWon: number
  coinflipWagered: number
  rafflesEntered: number
  rafflesWon: number
  rafflesWagered: number
}

function ProfileContent() {
  const { walletAddress } = useWallet()
  const { balance } = useLightning()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [cryptoAddresses, setCryptoAddresses] = useState<CryptoAddress[]>([])
  const [gameStats, setGameStats] = useState<GameStats | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  // Form states
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newAddressType, setNewAddressType] = useState('ETH')
  const [newAddressLabel, setNewAddressLabel] = useState('')

  useEffect(() => {
    if (walletAddress) {
      fetchProfile()
      fetchCryptoAddresses()
      fetchGameStats()
    }
  }, [walletAddress])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile?wallet=${walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setDisplayName(data.displayName || '')
        setBio(data.bio || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCryptoAddresses = async () => {
    try {
      const response = await fetch(`/api/profile/addresses?wallet=${walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setCryptoAddresses(data)
      }
    } catch (error) {
      console.error('Error fetching crypto addresses:', error)
    }
  }

  const fetchGameStats = async () => {
    try {
      const response = await fetch(`/api/profile/stats?wallet=${walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setGameStats(data)
      }
    } catch (error) {
      console.error('Error fetching game stats:', error)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB')
      return
    }

    setUploadingAvatar(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        
        // Save avatar to profile
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            displayName,
            bio,
            avatar: base64
          })
        })
        
        if (response.ok) {
          fetchProfile() // Refresh profile data
        } else {
          alert('Failed to upload avatar')
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const saveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          displayName,
          bio,
          avatar: profile?.avatar // Keep existing avatar
        })
      })
      
      if (response.ok) {
        setIsEditing(false)
        fetchProfile()
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const addCryptoAddress = async () => {
    if (!newAddress.trim()) return
    
    try {
      const response = await fetch('/api/profile/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          addressType: newAddressType,
          address: newAddress,
          label: newAddressLabel
        })
      })
      
      if (response.ok) {
        setNewAddress('')
        setNewAddressLabel('')
        fetchCryptoAddresses()
      }
    } catch (error) {
      console.error('Error adding crypto address:', error)
    }
  }

  const removeCryptoAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/profile/addresses/${addressId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchCryptoAddresses()
      }
    } catch (error) {
      console.error('Error removing crypto address:', error)
    }
  }

  const calculateWinRate = () => {
    if (!gameStats) return 0
    const totalGames = gameStats.chestsPlayed + gameStats.coinflipPlayed + gameStats.rafflesEntered
    const totalWins = gameStats.chestsWon + gameStats.coinflipWon + gameStats.rafflesWon
    return totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : '0'
  }

  const getTotalWagered = () => {
    if (!gameStats) return 0
    return Math.round(gameStats.chestsWagered + gameStats.coinflipWagered + gameStats.rafflesWagered)
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <main className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="avatar-container">
            {profile?.avatar ? (
              <Image 
                src={profile.avatar} 
                alt="Avatar" 
                width={120} 
                height={120} 
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <span>🐅</span>
              </div>
            )}
            <button className="avatar-upload-btn" disabled={uploadingAvatar}>
              {uploadingAvatar ? '⏳' : '📷'}
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
              ref={(input) => {
                if (input) {
                  const button = input.previousElementSibling as HTMLButtonElement
                  button.onclick = () => input.click()
                }
              }}
            />
          </div>
          
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                  className="name-input"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="bio-input"
                  rows={3}
                />
                <div className="edit-buttons">
                  <button onClick={saveProfile} className="save-btn">Save</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <h1 className="display-name">
                  {profile?.displayName || 'Anonymous Tiger'}
                </h1>
                <p className="bio">{profile?.bio || 'No bio yet'}</p>
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats-quick">
          <div className="stat-item">
            <span className="stat-value">{balance?.toLocaleString() || '0'}</span>
            <span className="stat-label">Balance (sats)</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{calculateWinRate()}%</span>
            <span className="stat-label">Win Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{getTotalWagered().toLocaleString()}</span>
            <span className="stat-label">Total Wagered</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2 className="section-title">🎮 Game Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Mystery Chests</h3>
              <div className="stat-details">
                <p>Played: <span>{gameStats?.chestsPlayed || 0}</span></p>
                <p>Won: <span>{gameStats?.chestsWon || 0}</span></p>
                <p>Wagered: <span>{Math.round(gameStats?.chestsWagered || 0).toLocaleString()} sats</span></p>
              </div>
            </div>
            
            <div className="stat-card">
              <h3>Coinflip</h3>
              <div className="stat-details">
                <p>Played: <span>{gameStats?.coinflipPlayed || 0}</span></p>
                <p>Won: <span>{gameStats?.coinflipWon || 0}</span></p>
                <p>Wagered: <span>{Math.round(gameStats?.coinflipWagered || 0).toLocaleString()} sats</span></p>
              </div>
            </div>
            
            <div className="stat-card">
              <h3>Raffles</h3>
              <div className="stat-details">
                <p>Entered: <span>{gameStats?.rafflesEntered || 0}</span></p>
                <p>Won: <span>{gameStats?.rafflesWon || 0}</span></p>
                <p>Wagered: <span>{Math.round(gameStats?.rafflesWagered || 0).toLocaleString()} sats</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">💰 Crypto Addresses</h2>
          <div className="addresses-container">
            <div className="add-address-form">
              <select 
                value={newAddressType} 
                onChange={(e) => setNewAddressType(e.target.value)}
                className="address-type-select"
              >
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="BC1P">Bitcoin Taproot (bc1p)</option>
                <option value="BC1Q">Bitcoin SegWit (bc1q)</option>
                <option value="SUI">Sui Network (SUI)</option>
                <option value="LEGACY">Bitcoin Legacy (1xxx)</option>
                <option value="LTC">Litecoin (LTC)</option>
                <option value="DOGE">Dogecoin (DOGE)</option>
              </select>
              
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter crypto address..."
                className="address-input"
              />
              
              <input
                type="text"
                value={newAddressLabel}
                onChange={(e) => setNewAddressLabel(e.target.value)}
                placeholder="Label (optional)"
                className="label-input"
              />
              
              <button onClick={addCryptoAddress} className="add-address-btn">
                Add Address
              </button>
            </div>

            <div className="addresses-list">
              {cryptoAddresses.map((addr) => (
                <div key={addr.id} className="address-item">
                  <div className="address-info">
                    <span className="address-type">{addr.addressType}</span>
                    <span className="address-value">{addr.address}</span>
                    {addr.label && <span className="address-label">{addr.label}</span>}
                    {addr.isVerified && <span className="verified-badge">✓</span>}
                  </div>
                  <button 
                    onClick={() => removeCryptoAddress(addr.id)}
                    className="remove-address-btn"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">📊 Account Details</h2>
          <div className="account-details">
            <div className="detail-item">
              <span className="detail-label">Primary Wallet:</span>
              <span className="detail-value">{walletAddress}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member Since:</span>
              <span className="detail-value">
                {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Active:</span>
              <span className="detail-value">
                {profile?.lastSeen ? new Date(profile.lastSeen).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Favorite Game:</span>
              <span className="detail-value">{profile?.favoriteGame || 'None yet'}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          color: #fff;
          padding: 2rem 1rem;
          padding-top: 80px;
        }
        
        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 107, 0, 0.3);
          border-top: 3px solid #FF6B00;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .profile-header {
          max-width: 1200px;
          margin: 0 auto 3rem;
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .profile-avatar-section {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          align-items: flex-start;
        }
        
        .avatar-container {
          position: relative;
          flex-shrink: 0;
        }
        
        .avatar-image,
        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid rgba(255, 107, 0, 0.5);
          object-fit: cover;
        }
        
        .avatar-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 107, 0, 0.1);
          font-size: 3rem;
        }
        
        .avatar-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .avatar-upload-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4);
        }
        
        .avatar-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .avatar-upload-btn:disabled:hover {
          transform: none;
          box-shadow: none;
        }
        
        .profile-info {
          flex: 1;
        }
        
        .display-name {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        
        .bio {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .edit-btn {
          background: rgba(255, 107, 0, 0.2);
          border: 1px solid rgba(255, 107, 0, 0.5);
          color: #FF6B00;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .edit-btn:hover {
          background: rgba(255, 107, 0, 0.3);
          transform: translateY(-2px);
        }
        
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .name-input,
        .bio-input {
          background: rgba(26, 26, 27, 0.8);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          padding: 0.8rem;
          color: #fff;
          font-size: 1rem;
        }
        
        .name-input {
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .bio-input {
          resize: vertical;
          min-height: 80px;
        }
        
        .edit-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .save-btn,
        .cancel-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .save-btn {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          border: none;
          color: white;
        }
        
        .cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.8);
        }
        
        .save-btn:hover,
        .cancel-btn:hover {
          transform: translateY(-2px);
        }
        
        .profile-stats-quick {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          border-top: 1px solid rgba(255, 107, 0, 0.2);
          padding-top: 2rem;
        }
        
        .stat-item {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 107, 0, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 107, 0, 0.2);
        }
        
        .stat-value {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          color: #FF6B00;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .profile-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .profile-section {
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .stat-card {
          background: rgba(255, 107, 0, 0.05);
          border: 1px solid rgba(255, 107, 0, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 107, 0, 0.4);
          box-shadow: 0 8px 25px rgba(255, 107, 0, 0.15);
        }
        
        .stat-card h3 {
          color: #FF6B00;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .stat-details p {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .stat-details span {
          color: #FFB800;
          font-weight: 600;
        }
        
        .addresses-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .add-address-form {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr auto;
          gap: 1rem;
          align-items: center;
        }
        
        .address-type-select,
        .address-input,
        .label-input {
          background: rgba(26, 26, 27, 0.8);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          padding: 0.8rem;
          color: #fff;
          font-size: 1rem;
        }
        
        .add-address-btn {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          border: none;
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .add-address-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4);
        }
        
        .addresses-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .address-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 107, 0, 0.05);
          border: 1px solid rgba(255, 107, 0, 0.2);
          border-radius: 12px;
          padding: 1rem;
        }
        
        .address-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }
        
        .address-type {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 60px;
          text-align: center;
        }
        
        .address-value {
          font-family: monospace;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          word-break: break-all;
        }
        
        .address-label {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          font-size: 0.9rem;
        }
        
        .verified-badge {
          background: #10B981;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        
        .remove-address-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #EF4444;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .remove-address-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: scale(1.1);
        }
        
        .account-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 107, 0, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 107, 0, 0.1);
        }
        
        .detail-label {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }
        
        .detail-value {
          color: #FFB800;
          font-weight: 600;
          font-family: monospace;
          word-break: break-all;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .profile-container {
            padding: 1rem 0.5rem;
            padding-top: 70px;
          }
          
          .profile-header {
            padding: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .profile-avatar-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.5rem;
          }
          
          .avatar-image,
          .avatar-placeholder {
            width: 100px;
            height: 100px;
          }
          
          .avatar-upload-btn {
            width: 35px;
            height: 35px;
            font-size: 1rem;
          }
          
          .display-name {
            font-size: 2rem;
          }
          
          .bio {
            font-size: 1rem;
            text-align: center;
          }
          
          .profile-stats-quick {
            grid-template-columns: 1fr;
            gap: 0.8rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
          }
          
          .stat-item {
            padding: 0.8rem;
          }
          
          .stat-value {
            font-size: 1.5rem;
          }
          
          .profile-section {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .stat-card {
            padding: 1.2rem;
          }
          
          .add-address-form {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
          
          .address-type-select,
          .address-input,
          .label-input,
          .add-address-btn {
            width: 100%;
            font-size: 1rem;
            padding: 0.9rem;
          }
          
          .address-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
          }
          
          .address-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            width: 100%;
          }
          
          .address-value {
            word-break: break-all;
            font-size: 0.85rem;
          }
          
          .remove-address-btn {
            align-self: flex-end;
            margin-top: 0.5rem;
          }
          
          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            padding: 1rem;
          }
          
          .detail-value {
            word-break: break-all;
            font-size: 0.9rem;
          }
          
          .edit-form {
            gap: 1rem;
          }
          
          .name-input {
            font-size: 1.2rem;
            padding: 1rem;
          }
          
          .bio-input {
            padding: 1rem;
            font-size: 1rem;
          }
          
          .edit-buttons {
            flex-direction: column;
            gap: 0.8rem;
          }
          
          .save-btn,
          .cancel-btn {
            width: 100%;
            padding: 1rem;
            font-size: 1rem;
          }
        }
        
        /* Extra small mobile devices */
        @media (max-width: 480px) {
          .profile-container {
            padding: 0.5rem 0.25rem;
            padding-top: 65px;
          }
          
          .profile-header {
            padding: 1rem;
            border-radius: 15px;
          }
          
          .avatar-image,
          .avatar-placeholder {
            width: 80px;
            height: 80px;
          }
          
          .avatar-upload-btn {
            width: 28px;
            height: 28px;
            font-size: 0.9rem;
          }
          
          .display-name {
            font-size: 1.8rem;
          }
          
          .profile-section {
            padding: 1rem;
            border-radius: 15px;
          }
          
          .section-title {
            font-size: 1.3rem;
          }
          
          .stat-card {
            padding: 1rem;
          }
          
          .stat-card h3 {
            font-size: 1rem;
          }
          
          .address-type-select,
          .address-input,
          .label-input,
          .add-address-btn {
            padding: 0.8rem;
            font-size: 0.9rem;
          }
        }
        
        /* Global image sharpening */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
          -ms-interpolation-mode: nearest-neighbor;
          image-rendering: optimizeQuality;
        }
      `}</style>
    </main>
  )
}

export default function ProfilePage() {
  return (
    <WalletProvider>
      <ProfileContent />
    </WalletProvider>
  )
} 