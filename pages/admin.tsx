import React, { useState } from 'react';
import { useRouter } from 'next/router';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Debug: Console log om te zien welke waarde we krijgen uit de environment variabele
    console.log('Admin password from env:', process.env.NEXT_PUBLIC_ADMIN_PASSWORD);
    console.log('Entered password:', password);
    console.log('Direct comparison tiger2024admin:', password === 'tiger2024admin');
    
    // Voeg het hardcoded wachtwoord toe als fallback
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 
        password === 'tijger123' || 
        password === 'tiger2024admin') {
      // Sla admin sessie op in localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      console.log('Admin authenticated, redirecting to /admin/dashboard');
      
      // Probeer eerst met window.location om routing problemen te omzeilen
      window.location.href = '/admin/dashboard';
      
      // Als fallback proberen we andere routes
      setTimeout(() => {
        try {
          router.push('/admin-dashboard');
        } catch (error) {
          console.error('Redirect error:', error);
          // Als laatste optie, laad de pagina helemaal opnieuw
          window.location.href = '/admin-dashboard';
        }
      }, 100);
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="admin-login">
      <h1>Tiger Upgrade Admin</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Admin Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">Login</button>
      </form>
      
      <style jsx>{`
        .admin-login {
          max-width: 400px;
          margin: 100px auto;
          padding: 2rem;
          background-color: #171a2d;
          border-radius: 10px;
          border: 2px solid #ffd700;
          color: white;
        }
        h1 {
          text-align: center;
          color: #ffd700;
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        .password-input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 5px;
          border: 1px solid #333;
          background-color: #0a0c1d;
          color: white;
        }
        .error-message {
          color: #ff4444;
          margin-bottom: 1rem;
        }
        .login-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #ffd700;
          color: #000;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
        }
        .login-button:hover {
          background-color: #ffea00;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin; 