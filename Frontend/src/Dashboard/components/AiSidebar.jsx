import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, BookOpen, BarChart3, Wallet,
  Settings, Zap, PanelLeftClose, SquarePen,
  Receipt, TrendingUp, PiggyBank, Bell, LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, path, badge, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full ${
        isActive
          ? 'bg-primary/15 text-primary'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
    <div className="flex flex-col h-full bg-white border-r border-slate-100 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded-xl transition-colors -ml-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <span className="text-base font-semibold text-slate-900">Daily Chalan</span>
        </Link>
      </div>

      <div className="h-px bg-slate-100 mx-3 my-1 flex-shrink-0" />

      {/* Main Nav */}
      <nav className="px-3 py-2 space-y-0.5 flex-shrink-0">
        <NavItem icon={Wallet} label="Cash Dashboard" path="/dashboard" onClick={onClose} />
        <NavItem icon={BarChart3} label="Ledger Analytics" path="/dashboard" badge="New" onClick={onClose} />
        <NavItem icon={Receipt} label="Outflow Logs" path="/dashboard" onClick={onClose} />
        <NavItem icon={TrendingUp} label="Tax Reports" path="/dashboard" onClick={onClose} />
      </nav>

      <div className="h-px bg-slate-100 mx-3 my-1 flex-shrink-0" />

      {/* Tools */}
      <div className="px-3 py-2 flex-shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Finance Tools
        </p>
        <NavItem icon={PiggyBank} label="Savings Targets" path="/dashboard" onClick={onClose} />
        <NavItem icon={Bell} label="Reminders" path="/dashboard" onClick={onClose} />
      </div>

      <div className="h-px bg-slate-100 mx-3 my-1 flex-shrink-0" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Upgrade Banner */}
      <div className="px-3 py-2 flex-shrink-0">
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          Upgrade to Premium
        </button>
      </div>

      {/* User Profile */}
      <div className="px-3 py-3 flex-shrink-0 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{username}</p>
              <p className="text-[10px] text-slate-400 truncate">{email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AiSidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-60 flex-shrink-0 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-60 h-full">
            <SidebarContent onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
};
