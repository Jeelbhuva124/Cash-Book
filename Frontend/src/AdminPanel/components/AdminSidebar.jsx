import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminSidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    sessionStorage.removeItem('cashbook_admin_authenticated');
    sessionStorage.removeItem('cashbook_admin_user');
    localStorage.removeItem('cashbook_admin_authenticated');
    localStorage.removeItem('cashbook_admin_user');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Cashbook Registry', path: '/admin/cashbooks', icon: BookOpen },
    { label: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Admin Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* Sidebar Header */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-border">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-lg shrink-0 shadow-md shadow-primary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-foreground text-base tracking-tight whitespace-nowrap">
                  Admin Portal
                </span>
                <span className="text-[10px] text-primary font-bold tracking-widest uppercase">
                  Control Center
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* System Health Badge */}
        {!isCollapsed && (
          <div className="mx-4 my-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              System Operational (99.9%)
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive 
                    ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {isActive && (
                  <motion.div 
                    layoutId="admin-active-pill"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>User Dashboard</span>}
          </Link>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Exit Admin</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
