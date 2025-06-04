'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Cookies from 'js-cookie'

// We hebben geen hardcoded API key meer nodig

// Component that uses useSearchParams - must be wrapped in Suspense
function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get('redirect') || '/admin/raffle'
  
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Authenticate via de API
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Set cookie met de token van de API
        Cookies.set('admin_session', data.token, { 
          expires: 1, // 1 dag
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        })
        
        // Redirect naar de oorspronkelijke bestemming
        router.push(redirectPath)
      } else {
        setError(data.error || 'Authentication failed')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login')
      setLoading(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h1 className="title">Admin Login</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label className="form-label" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #0d1320;
          color: #fff;
          padding: 1rem;
        }
        
        .logo-container {
          margin-bottom: 2rem;
        }
        
        .login-form {
          background: rgba(0, 0, 0, 0.3);
          padding: 2rem;
          border-radius: 8px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          width: 100%;
          max-width: 400px;
        }
        
        .title {
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #ffd700;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.8rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 215, 0, 0.5);
          border-radius: 4px;
          color: #fff;
          font-size: 1rem;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #ffd700;
        }
        
        .login-button {
          width: 100%;
          padding: 0.8rem;
          background: #ffd700;
          color: #000;
          border: none;
          border-radius: 4px;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .login-button:hover:not(:disabled) {
          background: #ffe970;
        }
        
        .login-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #ff5555;
          text-align: center;
          margin-top: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
        }
      `}</style>
      
      <div className="container">
        <div className="logo-container">
          <Image 
            src="/tiger-logo.png" 
            alt="Bitcoin Tiger" 
            width={120} 
            height={120} 
          />
        </div>
        
        <Suspense fallback={<div style={{color: '#ffd700', fontFamily: 'Press Start 2P', fontSize: '0.8rem'}}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  )
} 