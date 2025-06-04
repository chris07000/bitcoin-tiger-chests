'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Verwijder de admin session cookie
    Cookies.remove('admin_session')
    
    // Redirect naar login pagina
    router.push('/admin/login')
  }, [router])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0d1320',
      color: '#fff',
      fontFamily: "'Press Start 2P', monospace"
    }}>
      Logging out...
    </div>
  )
} 