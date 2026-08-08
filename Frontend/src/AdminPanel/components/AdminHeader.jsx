import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Shield, Menu, User, Settings, LogOut, CheckCircle2, PanelLeft, Maximize2, Minimize2, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

export const AdminHeader = ({ setMobileOpen, isCollapsed, setIsCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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
    <header className="sticky top-0 z-40 h-[64px] bg-transparent dark:bg-card px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="relative hidden md:block w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, cashbooks..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-[#f8fafc] dark:bg-[#1f2229] border border-border/80 rounded-xl focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors hidden sm:block cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Admin Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors relative flex items-center justify-center cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted/30 transition-all font-medium text-sm text-foreground select-none"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Shield className="w-4 h-4" />
            </div>
            <span className="max-w-[150px] truncate hidden md:inline font-semibold">
              {adminUser.username || 'Admin Root'}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
