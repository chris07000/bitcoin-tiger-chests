import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(1);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueDays, setRevenueDays] = useState(7);
  const router = useRouter();
  
  // Controleer bij laden of admin is ingelogd
  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdmin) {
      router.push('/admin');
    } else {
      // Laad gebruikersdata en revenue data
      loadUsers();
      loadRevenueData();
    }
  }, [router]);
  
  // Laad alle gebruikers met tigers
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // In een echte implementatie zou je hier API calls gebruiken
      // Nu simuleren we dit met localStorage data
      const users: any[] = [];
      
      // Doorzoek localStorage op items met 'tigerLevel_' prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tigerLevel_')) {
          const walletAddress = key.replace('tigerLevel_', '');
          const level = parseInt(localStorage.getItem(key) || '1');
          
          // Voeg gebruiker toe aan lijst
          users.push({
            walletAddress,
            tigerLevel: level,
            // In een echte implementatie zou je meer data ophalen
            pendingUpgrade: false,
            lastUpgrade: 'Unknown'
          });
        }
      }
      
      setUsers(users);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };
  
  // Load revenue data
  const loadRevenueData = async () => {
    try {
      setRevenueLoading(true);
      const response = await fetch(`/api/revenue/dashboard?days=${revenueDays}`);
      
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data.summary);
      } else {
        console.error('Failed to load revenue data');
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setRevenueLoading(false);
    }
  };

  // Trigger daily payouts manually
  const triggerDailyPayouts = async () => {
    try {
      const response = await fetch('/api/mining/process-payouts', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`✅ Payouts processed successfully!\n💰 House revenue: ${data.summary.totalHouseRevenue} sats\n💎 Member payouts: ${data.summary.totalPayouts} sats`);
        // Reload revenue data after payouts
        loadRevenueData();
      } else {
        alert('❌ Failed to process payouts');
      }
    } catch (error) {
      console.error('Error processing payouts:', error);
      alert('❌ Error processing payouts');
    }
  };

  // Format sats with commas
  const formatSats = (amount: number) => {
    return amount.toLocaleString() + ' sats';
  };

  // Format USD value (rough estimate)
  const formatUSD = (sats: number) => {
    const usdValue = (sats / 100000000) * 100000; // Rough BTC price estimate
    return '$' + usdValue.toFixed(2);
  };
  
  // Upgrade tiger level van een gebruiker
  const upgradeTigerLevel = (walletAddress: string, newLevel: number) => {
    try {
      // Update in localStorage
      localStorage.setItem(`tigerLevel_${walletAddress}`, newLevel.toString());
      
      // Update gebruikerslijst
      setUsers(users.map(user => 
        user.walletAddress === walletAddress 
          ? {...user, tigerLevel: newLevel, pendingUpgrade: false, lastUpgrade: new Date().toLocaleString()} 
          : user
      ));
      
      alert(`Tiger level for ${walletAddress.substring(0, 8)}... has been upgraded to Level ${newLevel}`);
    } catch (error) {
      console.error('Error upgrading tiger level:', error);
      alert('Error upgrading tiger level');
    }
  };
  
  // Selecteer een gebruiker om te bekijken/wijzigen
  const handleSelectUser = (walletAddress: string) => {
    setSelectedUser(walletAddress);
    const user = users.find(u => u.walletAddress === walletAddress);
    if (user) {
      setCurrentLevel(user.tigerLevel);
      setTargetLevel(Math.min(user.tigerLevel + 1, 5));
    }
  };
  
  // Uitloggen als admin
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Tiger Upgrade Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      
      <div className="dashboard-content">
        <div className="users-list">
          <h2>Users with Tigers</h2>
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <>
              {users.length === 0 ? (
                <div className="no-users">No users found</div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Wallet</th>
                        <th>Level</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.walletAddress} className={selectedUser === user.walletAddress ? 'selected' : ''}>
                          <td>{`${user.walletAddress.substring(0, 8)}...${user.walletAddress.substring(user.walletAddress.length - 6)}`}</td>
                          <td>{user.tigerLevel}</td>
                          <td>
                            <button 
                              onClick={() => handleSelectUser(user.walletAddress)}
                              className="view-button"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Revenue Tracking Section */}
        <div className="revenue-section">
          <div className="section-header">
            <h2>💰 House Revenue</h2>
            <div className="revenue-controls">
              <select 
                value={revenueDays} 
                onChange={(e) => {
                  setRevenueDays(parseInt(e.target.value));
                  setTimeout(loadRevenueData, 100);
                }}
              >
                <option value={1}>Last 24h</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <button onClick={triggerDailyPayouts} className="payout-button">
                🔄 Process Daily Payouts
              </button>
            </div>
          </div>
          
          {revenueLoading ? (
            <div className="loading">Loading revenue...</div>
          ) : revenueData ? (
            <div className="revenue-content">
              <div className="revenue-summary">
                <div className="revenue-card total">
                  <h3>Total Revenue ({revenueData.period})</h3>
                  <div className="amount">
                    <span className="sats">{formatSats(revenueData.totalRevenue)}</span>
                    <span className="usd">{formatUSD(revenueData.totalRevenue)}</span>
                  </div>
                  <div className="stats">
                    <span>Avg/day: {formatSats(Math.round(revenueData.averagePerDay))}</span>
                    <span>Transactions: {revenueData.totalTransactions}</span>
                  </div>
                </div>
                
                <div className="revenue-card lifetime">
                  <h3>🏆 All-Time Revenue</h3>
                  <div className="amount">
                    <span className="sats">{formatSats(revenueData.allTimeRevenue)}</span>
                    <span className="usd">{formatUSD(revenueData.allTimeRevenue)}</span>
                  </div>
                  <div className="stats">
                    <span>Total transactions: {revenueData.allTimeTransactions}</span>
                  </div>
                </div>
              </div>
              
              <div className="revenue-sources">
                <h3>Revenue by Source</h3>
                {revenueData.revenueBySource.map((source: any) => (
                  <div key={source.source} className="source-row">
                    <span className="source-name">
                      {source.source === 'MINING_ENTRY_FEE' ? '⛏️ Pool Entry Fees' :
                       source.source === 'MINING_HOUSE_EDGE' ? '💎 Pool House Edge' :
                       source.source === 'RAFFLE_TICKET_SALES' ? '🎟️ Raffle Sales' :
                       source.source === 'CHEST_PLAYS' ? '📦 Chest Plays' :
                       source.source === 'COINFLIP_HOUSE_EDGE' ? '🪙 Coinflip Edge' :
                       source.source}
                    </span>
                    <div className="source-amounts">
                      <span className="amount">{formatSats(source.amount)}</span>
                      <span className="count">({source.transactions}x)</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="recent-transactions">
                <h3>Recent Revenue</h3>
                <div className="transactions-list">
                  {revenueData.recentTransactions.slice(0, 5).map((tx: any) => (
                    <div key={tx.id} className="transaction-row">
                      <div className="tx-info">
                        <span className="tx-amount">+{formatSats(tx.amount)}</span>
                        <span className="tx-source">{tx.source}</span>
                      </div>
                      <div className="tx-details">
                        <span className="tx-description">{tx.description}</span>
                        <span className="tx-date">{new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-revenue">No revenue data available</div>
          )}
        </div>
        
        {selectedUser && (
          <div className="user-detail">
            <h2>User Details</h2>
            <div className="detail-card">
              <div className="wallet-address">
                <strong>Wallet:</strong> {selectedUser}
              </div>
              <div className="current-level">
                <strong>Current Level:</strong> {currentLevel}
              </div>
              
              <div className="upgrade-controls">
                <h3>Upgrade Tiger</h3>
                <div className="level-selector">
                  <label>New Level:</label>
                  <select 
                    value={targetLevel} 
                    onChange={(e) => setTargetLevel(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <option 
                        key={level} 
                        value={level}
                        disabled={level <= currentLevel}
                      >
                        Level {level}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={() => upgradeTigerLevel(selectedUser, targetLevel)}
                  className="upgrade-button"
                  disabled={targetLevel <= currentLevel}
                >
                  Confirm Upgrade to Level {targetLevel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .admin-dashboard {
          padding: 2rem;
          color: white;
          background-color: #0a0c1d;
          min-height: 100vh;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #333;
        }
        
        h1 {
          color: #ffd700;
          margin: 0;
        }
        
        .logout-button {
          background-color: #ff4500;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        
        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 1.5rem;
        }
        
        @media (max-width: 1400px) {
          .dashboard-content {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }
        
        .users-list, .user-detail, .revenue-section {
          background-color: #171a2d;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #333;
        }
        
        h2 {
          color: #ffd700;
          margin-top: 0;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #333;
          padding-bottom: 0.5rem;
        }
        
        .loading, .no-users {
          padding: 2rem;
          text-align: center;
          color: #999;
        }
        
        .users-table {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #333;
        }
        
        th {
          background-color: #0a0c1d;
          color: #ffd700;
        }
        
        tr:hover {
          background-color: #1a1f3d;
        }
        
        tr.selected {
          background-color: #2a2f5d;
        }
        
        .view-button {
          background-color: #3a86ff;
          color: white;
          border: none;
          border-radius: 3px;
          padding: 0.3rem 0.6rem;
          cursor: pointer;
        }
        
        .detail-card {
          background-color: #1a1f3d;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #333;
        }
        
        .wallet-address, .current-level {
          margin-bottom: 1rem;
          word-break: break-all;
        }
        
        .upgrade-controls {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #333;
        }
        
        .upgrade-controls h3 {
          color: #ffd700;
          margin-top: 0;
        }
        
        .level-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        select {
          padding: 0.5rem;
          border-radius: 5px;
          background-color: #0a0c1d;
          color: white;
          border: 1px solid #444;
        }
        
        .upgrade-button {
          background-color: #4afc4a;
          color: #000;
          border: none;
          border-radius: 5px;
          padding: 0.75rem 1.5rem;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
        }
        
        .upgrade-button:disabled {
          background-color: #555;
          color: #999;
          cursor: not-allowed;
        }

        /* Revenue Section Styling */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .revenue-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .revenue-controls select {
          padding: 0.4rem;
          border-radius: 4px;
          background-color: #0a0c1d;
          color: white;
          border: 1px solid #444;
          font-size: 0.9rem;
        }

        .payout-button {
          background-color: #4afc4a;
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 0.4rem 0.8rem;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .payout-button:hover {
          background-color: #3ae83a;
        }

        .revenue-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .revenue-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .revenue-card {
          background-color: #1a1f3d;
          border-radius: 6px;
          padding: 1rem;
          border: 1px solid #333;
        }

        .revenue-card.total {
          border-left: 3px solid #4afc4a;
        }

        .revenue-card.lifetime {
          border-left: 3px solid #ffd700;
        }

        .revenue-card h3 {
          margin: 0 0 0.8rem 0;
          font-size: 0.9rem;
          color: #ccc;
        }

        .amount {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin-bottom: 0.8rem;
        }

        .amount .sats {
          font-size: 1.1rem;
          font-weight: bold;
          color: #4afc4a;
        }

        .amount .usd {
          font-size: 0.9rem;
          color: #ffd700;
        }

        .stats {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: #999;
        }

        .revenue-sources h3,
        .recent-transactions h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #ffd700;
          border-bottom: 1px solid #333;
          padding-bottom: 0.5rem;
        }

        .source-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0;
          border-bottom: 1px solid #222;
        }

        .source-row:last-child {
          border-bottom: none;
        }

        .source-name {
          font-size: 0.9rem;
          color: #ccc;
        }

        .source-amounts {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.1rem;
        }

        .source-amounts .amount {
          font-weight: bold;
          color: #4afc4a;
          font-size: 0.9rem;
        }

        .source-amounts .count {
          font-size: 0.7rem;
          color: #999;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .transaction-row {
          background-color: #0a0c1d;
          border-radius: 4px;
          padding: 0.8rem;
          border: 1px solid #222;
        }

        .tx-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }

        .tx-amount {
          font-weight: bold;
          color: #4afc4a;
          font-size: 0.9rem;
        }

        .tx-source {
          font-size: 0.8rem;
          color: #999;
          background-color: #171a2d;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
        }

        .tx-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .tx-description {
          color: #ccc;
          flex: 1;
          margin-right: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tx-date {
          color: #888;
          white-space: nowrap;
        }

        .no-revenue {
          padding: 2rem;
          text-align: center;
          color: #999;
        }

        /* Mobile responsive for revenue section */
        @media (max-width: 768px) {
          .revenue-summary {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .revenue-controls {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard; 