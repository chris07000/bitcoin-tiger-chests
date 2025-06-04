import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(1);
  const router = useRouter();
  
  // Controleer bij laden of admin is ingelogd
  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdmin) {
      router.push('/admin');
    } else {
      // Laad gebruikersdata
      loadUsers();
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
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }
        
        .users-list, .user-detail {
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
      `}</style>
    </div>
  );
};

export default AdminDashboard; 