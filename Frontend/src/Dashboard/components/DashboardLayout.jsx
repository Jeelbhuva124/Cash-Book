import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { 
  Menu, Search, Play, Moon, Sun, Maximize2, Minimize2, 
  Bell, User, ChevronDown, LogOut, PanelLeft 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('cashbook_notifications');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'welcome-1', title: 'Welcome to Cashbook!', message: 'Start tracking your daily expenses and income effortlessly.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), unread: true }
    ];
  });
  const unreadCount = notifications.filter(n => n.unread).length;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Load user profile from state to allow reactivity
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('profile_data');
    if (saved) return JSON.parse(saved);
    const userRaw = localStorage.getItem("user");
    return userRaw ? JSON.parse(userRaw) : null;
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      const saved = localStorage.getItem('profile_data');
      if (saved) setProfileData(JSON.parse(saved));
    };
    const handleNotificationsUpdate = (e) => {
      if (e.detail) setNotifications(e.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('notificationsUpdated', handleNotificationsUpdate);
    
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
    localStorage.setItem('cashbook_notifications', JSON.stringify(updated));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('cashbook_notifications', JSON.stringify([]));
  };

  const username = profileData?.firstName 
    ? `${profileData.firstName} ${profileData.lastName || ''}`.trim() 
    : (profileData?.username || "Guest User");
  const email = profileData?.email || profileData?.email_id || "";
  const uppercaseName = username.toUpperCase();
  const avatar = profileData?.avatar;

  // Fullscreen toggle handler
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

  useEffect(() => {
    if (token) {
      const pendingAcceptId = sessionStorage.getItem('pending_accept_id');
      if (pendingAcceptId) {
        sessionStorage.removeItem('pending_accept_id');
        navigate(`/dashboard/invitations?accept_id=${pendingAcceptId}`);
      }
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token) {
    const queryParams = new URLSearchParams(window.location.search);
    const acceptId = queryParams.get('accept_id');
    if (acceptId) {
      sessionStorage.setItem('pending_accept_id', acceptId);
    }
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-transparent dark:bg-transparent overflow-hidden text-foreground">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} isCollapsed={isCollapsed} />

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative bg-transparent dark:bg-transparent">
        
        {/* Unified Top Navbar Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-transparent dark:bg-card sticky top-0 z-20 h-[64px]">
          
          {/* Left Area: Sidebar toggle and Brand logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 hidden lg:flex">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                aria-label="Toggle sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative hidden md:block w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground" />
              </span>
              <input
                type="text"
                placeholder="Search for pages..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-[#f8fafc] dark:bg-[#1f2229] border border-border/80 rounded-xl focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Right Area: Utility Shortcuts & Profile Dropdown */}
          <div className="flex items-center gap-3">


            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors hidden sm:block"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (userDropdownOpen) setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors relative"
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
                        className="text-xs text-primary hover:underline font-semibold"
                      >
                        Mark all as read
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
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm ${n.unread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>{n.title}</p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2 mt-0.5">{n.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 text-center border-t border-border bg-muted/10">
                      <button 
                        onClick={handleClearNotifications}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-2"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Vertical Separator */}
            <div className="h-5 w-px bg-border/80 mx-1 hidden sm:block" />

            {/* User Profile dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  if (notificationsOpen) setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted/30 transition-all font-medium text-sm text-foreground select-none"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <span className="max-w-[150px] truncate hidden md:inline font-semibold">{uppercaseName}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-sm py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                  <div className="px-4 py-3 border-b border-border/60 mb-2">
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Account</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {avatar ? (
                          <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate text-foreground">{username}</p>
                        <p className="text-xs text-muted-foreground truncate">{email}</p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-expense hover:bg-expense-bg/30 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto relative h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
