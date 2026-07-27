import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Shield, Menu, User, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

export const AdminHeader = ({ setMobileOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('cashbook_admin_notifications');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sys-1', title: 'Admin System Online', message: 'Cashbook admin panel initialized successfully.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), unread: true }
    ];
  });
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
    localStorage.setItem('cashbook_admin_notifications', JSON.stringify(updated));
  };

  const adminUser = (() => {
    try {
      const raw = sessionStorage.getItem('cashbook_admin_user') || localStorage.getItem('cashbook_admin_user');
      return raw ? JSON.parse(raw) : { username: 'Admin Root', email_id: 'superadmin@cashbook.io' };
    } catch {
      return { username: 'Admin Root', email_id: 'superadmin@cashbook.io' };
    }
  })();

  const handleAdminLogout = () => {
    sessionStorage.removeItem('cashbook_admin_authenticated');
    sessionStorage.removeItem('cashbook_admin_user');
    localStorage.removeItem('cashbook_admin_authenticated');
    localStorage.removeItem('cashbook_admin_user');
    navigate('/admin/login');
  };


  return (
    <header className="sticky top-0 z-40 h-20 bg-background/90 backdrop-blur-2xl border-b border-border/50 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2.5 rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, cashbooks, audit logs..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>v2.4 Production Live</span>
        </div>

        <ThemeToggle />

        {/* Admin Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors relative flex items-center justify-center min-w-[44px] min-h-[44px]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-sm z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                <h3 className="font-bold text-foreground text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="px-2.5 py-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1 border border-primary/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <Bell className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {notifications.map((alert) => (
                      <div
                        key={alert.id}
                        className={`px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors relative group ${alert.unread ? 'bg-muted/20' : ''}`}
                        onClick={() => {
                          const updated = notifications.map(n => n.id === alert.id ? { ...n, unread: false } : n);
                          setNotifications(updated);
                          localStorage.setItem('cashbook_admin_notifications', JSON.stringify(updated));
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-semibold text-foreground group-hover:text-primary transition-colors pr-4 leading-tight`}>
                            {alert.title}
                          </p>
                          {alert.unread && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1 leading-snug">{alert.message}</p>
                        <p className="text-[10px] text-muted-foreground/80 font-medium">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-border/50 hidden sm:block mx-1"></div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1 pr-4 rounded-full bg-card hover:bg-muted/50 border border-border/50 hover:border-primary/30 transition-all cursor-pointer shadow-sm group"
          >
            <div className="w-10 h-10 rounded-full bg-card border border-border/50 overflow-hidden flex items-center justify-center p-1 shadow-inner group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Admin" className="w-full h-full object-contain" />
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{adminUser.username || 'Admin Root'}</span>
              <span className="text-[11px] font-medium text-muted-foreground">{adminUser.email_id || 'superadmin@cashbook.io'}</span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-card border border-border rounded-2xl shadow-xl z-50 p-2 space-y-1">
              <button 
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Admin Settings</span>
              </button>
              <button 
                onClick={handleAdminLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
