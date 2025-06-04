import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminDashboard from './admin/dashboard';

const AdminDashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Controleer of admin is ingelogd
    const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdmin) {
      router.push('/admin');
    }
  }, [router]);

  return <AdminDashboard />;
};

export default AdminDashboardPage; 