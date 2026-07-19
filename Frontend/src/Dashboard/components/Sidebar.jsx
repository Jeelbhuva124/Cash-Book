import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Tag, Layers, CreditCard,
  Users, BarChart3, User, Settings, LogOut, ChevronDown, ChevronRight, Book
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle';

const NavItem = ({ icon: Icon, label, path, badge, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors w-full ${isActive
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
    </Link>
  );
};

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Get user from localStorage
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const username = user?.username || "Guest User";
  const email = user?.email_id || "";
  const initials = username.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-card border-r border-border text-foreground">
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 px-2 py-1.5 rounded-xl transition-colors">
          <img src="/logo.png" alt="Cash Book Logo" className="w-8 h-8 object-contain" />
          <span className="text-base font-bold text-foreground">Cash Book</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="h-px bg-border/60 mx-4 flex-shrink-0" />

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" onClick={onClose} />
        <NavItem icon={Book} label="Cashbooks" path="/dashboard/cashbooks" onClick={onClose} />
        <NavItem icon={BookOpen} label="All Cash Books" path="/dashboard/chalans" onClick={onClose} />
        <NavItem icon={Tag} label="Category" path="/dashboard/categories" onClick={onClose} />
        <NavItem icon={Layers} label="Subcategory" path="/dashboard/subcategories" onClick={onClose} />
        <NavItem icon={CreditCard} label="Payment Mode" path="/dashboard/payment-modes" onClick={onClose} />
        <NavItem icon={Users} label="Cash Book Invitations" path="/dashboard/invitations" badge="2" onClick={onClose} />
        <NavItem icon={BarChart3} label="Reports" path="/dashboard/reports" onClick={onClose} />
        <NavItem icon={User} label="Profile" path="/dashboard/profile" onClick={onClose} />

        {/* Collapsible Settings */}
        <div className="space-y-1">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-muted-foreground hover:bg-muted/40 hover:text-foreground`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Settings</span>
            {settingsOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pl-7 space-y-1"
              >
                <Link
                  to="/dashboard/settings"
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-lg text-xs font-semibold ${location.pathname === '/dashboard/settings'
                      ? 'text-primary font-bold bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                    }`}
                >
                  Account Settings
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-px bg-border/60 mx-4 flex-shrink-0" />

      {/* User Footer Profile */}
      <div className="p-4 flex-shrink-0 bg-muted/20">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{username}</p>
              <p className="text-[10px] text-muted-foreground truncate">{email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-expense hover:bg-expense-bg transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-64 h-full">
            <SidebarContent onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
};
