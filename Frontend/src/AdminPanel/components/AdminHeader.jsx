import React, { useState } from 'react';
import { Search, Bell, Shield, Menu, User, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

export const AdminHeader = ({ setMobileOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

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

  const dummyAlerts = [
    { id: 1, text: "High server memory utilization detected (78%)", time: "5m ago", type: "warning" },
    { id: 2, text: "New Super Admin logged in from Delhi, IN", time: "12m ago", type: "info" },
    { id: 3, text: "Automated database backup created successfully", time: "1h ago", type: "success" },
  ];

  return (
    <header className="sticky top-0 z-40 h-20 bg-background/80 backdrop-blur-xl border-b border-border px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, cashbooks, audit logs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>v2.4 Production Live</span>
        </div>

        <ThemeToggle />

        {/* Admin Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="text-sm font-bold text-foreground">System Alerts</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">3 New</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dummyAlerts.map(alert => (
                  <div key={alert.id} className="p-2.5 rounded-xl bg-muted/50 text-xs space-y-1">
                    <p className="font-semibold text-foreground leading-snug">{alert.text}</p>
                    <span className="text-[10px] text-muted-foreground block">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-extrabold text-sm uppercase">
              {adminUser.username ? adminUser.username.substring(0, 2) : 'AD'}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-foreground">{adminUser.username || 'Admin Root'}</span>
              <span className="text-[10px] text-muted-foreground">{adminUser.email_id || 'superadmin@cashbook.io'}</span>
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
