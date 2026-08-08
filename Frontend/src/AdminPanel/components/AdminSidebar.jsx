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
import { motion, AnimatePresence } from 'framer-motion';

const SidebarContent = ({ isCollapsed, setIsCollapsed, setMobileOpen, location }) => {
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
    { label: 'Admins', path: '/admin/admins', icon: ShieldCheck },
    { label: 'Cashbook Registry', path: '/admin/cashbooks', icon: BookOpen },
    { label: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Admin Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={`flex flex-col h-full bg-sidebar text-foreground overflow-hidden w-full ${!isCollapsed ? 'border-r border-border' : 'border-r border-border'}`}>
      
      {/* Sidebar Header */}
      <div className={`h-[64px] flex items-center flex-shrink-0 border-b border-border ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain shrink-0" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col leading-tight"
              >
                <span className="font-bold text-foreground text-sm tracking-tight whitespace-nowrap">
                  Admin Portal
                </span>
                <span className="text-[9px] text-primary font-bold tracking-wider uppercase leading-none">
                  Control Center
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item, idx) => {
          const isActive = item.exact 
            ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center py-2 rounded-lg text-sm font-medium transition-all group w-full ${
                isCollapsed ? 'justify-center px-0 gap-0' : 'px-2.5 gap-2.5'
              } ${
                isActive 
                  ? 'bg-card text-foreground shadow-sm font-semibold border border-border/40' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-hover'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
              <AnimatePresence mode="popLayout">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.2, delay: idx * 0.04 } }}
                    exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && !isCollapsed && (
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
      <div className="p-2.5 border-t border-border space-y-1 flex-shrink-0">
        <Link
          to="/dashboard"
          className={`flex items-center py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors w-full ${
            isCollapsed ? 'justify-center px-0 gap-0' : 'px-2.5 gap-2.5'
          }`}
          title="User Dashboard"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                User Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={handleAdminLogout}
          className={`w-full flex items-center py-2 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer cursor-pointer ${
            isCollapsed ? 'justify-center px-0 gap-0' : 'px-2.5 gap-2.5'
          }`}
          title="Exit Admin"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Exit Admin
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export const AdminSidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar Container with Framer Motion */}
      <motion.div
        animate={{ width: isCollapsed ? 72 : 224 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden md:flex flex-shrink-0 h-full overflow-hidden"
      >
        <SidebarContent 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          setMobileOpen={setMobileOpen}
          location={location}
        />
      </motion.div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)} 
            />
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
              className="relative w-56 h-full shadow-2xl z-55"
            >
              <SidebarContent 
                isCollapsed={false} 
                setIsCollapsed={setIsCollapsed} 
                setMobileOpen={setMobileOpen}
                location={location}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
