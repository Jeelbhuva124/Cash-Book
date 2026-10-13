import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_SECTIONS = [
  {
    title: 'Core',
    items: [
      { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
      { label: 'User Management', path: '/admin/users', icon: Users },
      { label: 'Admins', path: '/admin/admins', icon: ShieldCheck },
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Cashbook Registry', path: '/admin/cashbooks', icon: BookOpen },
      { label: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Admin Settings', path: '/admin/settings', icon: Settings },
    ]
  }
];

const SidebarContent = ({ isCollapsed, setMobileOpen, location }) => {
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    sessionStorage.removeItem('cashbook_admin_authenticated');
    sessionStorage.removeItem('cashbook_admin_user');
    localStorage.removeItem('cashbook_admin_authenticated');
    localStorage.removeItem('cashbook_admin_user');
    navigate('/admin/login');
  };

  return (
    <div className={`flex flex-col h-full bg-sidebar text-foreground overflow-hidden w-full border-r border-border/50`}>
      
      {/* Sleek Minimal Header */}
      <div className={`h-[56px] flex items-center flex-shrink-0 border-b border-border/40 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'}`}>
        <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain shrink-0" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
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

      {/* Minimal Navigation Sections */}
      <nav className="flex-1 px-2.5 py-3 space-y-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {ADMIN_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2.5 pt-1 pb-1 select-none">
                {section.title}
              </div>
            )}

            {section.items.map((item) => {
              const isActive = item.exact 
                ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center py-1.5 rounded-lg text-[13px] font-medium transition-all group w-full ${
                    isCollapsed ? 'justify-center px-0 gap-0' : 'px-2.5 gap-2.5'
                  } ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-semibold dark:bg-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={`w-[17px] h-[17px] shrink-0 stroke-[1.8] ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <AnimatePresence mode="popLayout">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="truncate text-[13px] tracking-tight"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive && !isCollapsed && (
                    <motion.div 
                      layoutId="admin-active-pill"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sleek Minimal Footer */}
      <div className="p-2.5 border-t border-border/40 space-y-1 flex-shrink-0 mt-auto">
        <Link
          to="/dashboard"
          className={`flex items-center py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors w-full ${
            isCollapsed ? 'justify-center px-0 gap-0' : 'px-2.5 gap-2.5'
          }`}
          title="User Dashboard"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0 stroke-[1.8]" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
              >
                User Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={handleAdminLogout}
          className={`w-full flex items-center py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0 gap-0' : 'px-2.5 gap-2.5'
          }`}
          title="Exit Admin"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 stroke-[1.8]" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
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
        animate={{ width: isCollapsed ? 64 : 216 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden md:flex flex-shrink-0 h-full overflow-hidden bg-sidebar"
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
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="relative w-52 h-full shadow-2xl z-55"
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
