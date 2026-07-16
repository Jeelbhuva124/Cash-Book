import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { AiSidebar } from './AiSidebar';
import { 
  Menu, Search, Play, Moon, Sun, Maximize2, Minimize2, 
  Bell, User, ChevronDown, LogOut 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AiLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Load user
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const username = user?.username || "Guest User";
  const email = user?.email_id || "";
  const uppercaseName = username.toUpperCase();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar Navigation */}
      <AiSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative bg-[#f4f6fc] dark:bg-background">
        
        {/* Unified Top Navbar Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-white dark:bg-card sticky top-0 z-20 shadow-sm h-[64px]">
          
          {/* Left Area: Sidebar toggle and Brand logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground hidden lg:block"
                aria-label="Toggle menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <span className="font-semibold text-lg text-foreground tracking-tight select-none">Daily Chalan</span>
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
            {/* Play Button Icon */}
            <button 
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors hidden sm:block"
              title="Play Video"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
            <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* Vertical Separator */}
            <div className="h-5 w-px bg-border/80 mx-1 hidden sm:block" />

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted/30 transition-all font-medium text-sm text-foreground select-none"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <span className="max-w-[150px] truncate hidden md:inline font-semibold">{uppercaseName}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                  <div className="px-4 py-2 border-b border-border/60">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Account</p>
                    <p className="text-sm font-semibold text-foreground truncate mt-0.5">{username}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{email}</p>
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
