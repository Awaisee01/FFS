
import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated and session is still valid
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const authTime = localStorage.getItem('adminAuthTime');
    
    if (adminAuth === 'true' && authTime) {
      const sessionDuration = Date.now() - parseInt(authTime);
      const maxSessionDuration = 4 * 60 * 60 * 1000; // 4 hours
      
      if (sessionDuration < maxSessionDuration) {
        setIsAuthenticated(true);
      } else {
        // Session expired, clear auth
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTime');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
};

export default Admin;
