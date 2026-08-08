import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const AdminProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      // Check session storage or localStorage for active admin flag
      const storedAdmin = sessionStorage.getItem('cashbook_admin_authenticated') || localStorage.getItem('cashbook_admin_authenticated');
      const adminUserData = sessionStorage.getItem('cashbook_admin_user') || localStorage.getItem('cashbook_admin_user');
      
      if (storedAdmin === 'true' && adminUserData) {
        try {
          const userObj = JSON.parse(adminUserData);
          if (userObj && (userObj.is_admin || userObj.user_role === 'admin' || userObj.email_id?.includes('admin'))) {
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse admin user payload", e);
        }
      }

      // Also attempt backend API verification if available
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const response = await fetch('http://localhost:5001/api/user/verify-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email_id: parsed.email_id, user_id: parsed.id })
          });
          const data = await response.json();
          if (data.success && (data.is_admin || data.user_role === 'admin')) {
            sessionStorage.setItem('cashbook_admin_authenticated', 'true');
            sessionStorage.setItem('cashbook_admin_user', JSON.stringify(data.user || parsed));
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Backend admin verification failed, relying on local session check", err.message);
      }

      // If no valid admin session found, allow demo fallback or prompt login
      if (storedAdmin === 'true') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-foreground">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-bold tracking-wide">Verifying Admin Privileges...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
