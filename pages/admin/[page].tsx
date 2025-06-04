import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminDashboard from './dashboard';

const AdminPage = () => {
  const router = useRouter();
  const { page } = router.query;

  useEffect(() => {
    // Controleer of admin is ingelogd
    const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdmin) {
      router.push('/admin');
    }
  }, [router]);

  // Render de juiste pagina op basis van de slug
  if (page === 'dashboard') {
    return <AdminDashboard />;
  }

  // Fallback voor andere pagina's
  return (
    <div style={{ 
      padding: '2rem',
      color: 'white',
      backgroundColor: '#0a0c1d',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#ffd700' }}>Admin Page Not Found</h1>
      <p>The requested admin page could not be found.</p>
      <button 
        onClick={() => router.push('/admin/dashboard')}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#ffd700',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default AdminPage; 