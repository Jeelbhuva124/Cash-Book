import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Tag, Layers, CreditCard,
  Users, BarChart3, User, Settings, LogOut, Book,
  Palette, UserCog, ChevronDown, History
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Cashbooks', icon: Book, path: '/dashboard/cashbooks' },
  { label: 'Category', icon: Tag, path: '/dashboard/categories' },
  { label: 'Subcategory', icon: Layers, path: '/dashboard/subcategories' },
  { label: 'Payment Mode', icon: CreditCard, path: '/dashboard/payment-modes' },
  { label: 'Invitations', icon: Users, path: '/dashboard/invitations' },
  { label: 'Reports', icon: BarChart3, path: '/dashboard/reports' },
  { label: 'History', icon: History, path: '/dashboard/history' },
  { label: 'Profile', icon: User, path: '/dashboard/profile' },
  { 
    label: 'Settings', 
    icon: Settings, 
    path: '/dashboard/settings',
    subItems: [
      { label: 'Preferences', icon: Palette, path: '/dashboard/settings/preferences' },
      { label: 'Active Session', icon: UserCog, path: '/dashboard/settings/sessions' }
    ]
  },
];

const NavItem = ({ item, location, onClose, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  const isActive = location.pathname === item.path || (hasSubItems && item.subItems.some(sub => location.pathname === sub.path));

  const content = (
    <>
      <item.icon className={`w-[20px] h-[20px] flex-shrink-0 transition-colors ${isActive ? 'text-primary' : ''}`} />

      <AnimatePresence mode="popLayout">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 text-left whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {!isCollapsed && item.badge && !hasSubItems && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none bg-primary text-primary-foreground ml-auto"
          >
            {item.badge}
          </motion.span>
        )}
      </AnimatePresence>
      
      {!isCollapsed && hasSubItems && (
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''} text-muted-foreground`} />
      )}
    </>
  );

  const baseClasses = `flex items-center py-2 rounded-lg text-sm font-medium transition-colors relative group w-full ${
    isCollapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
  } ${
    isActive
      ? 'bg-card text-foreground shadow-sm font-semibold'
      : 'text-muted-foreground hover:bg-sidebar-hover hover:text-foreground'
  }`;

  if (hasSubItems) {
    return (
      <div className="flex flex-col w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={baseClasses}
          title={isCollapsed ? item.label : undefined}
        >
          {content}
        </button>
        
        <AnimatePresence>
          {isOpen && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col mt-1 space-y-0.5 overflow-hidden"
            >
              {item.subItems.map((sub, i) => (
                <Link
                  key={i}
                  to={sub.path}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 py-2 pl-9 pr-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === sub.path
                      ? 'bg-card text-foreground shadow-sm font-semibold'
                      : 'text-muted-foreground hover:bg-sidebar-hover hover:text-foreground'
                  }`}
                >
                  <sub.icon className={`w-[18px] h-[18px] ${location.pathname === sub.path ? 'text-primary' : ''}`} />
                  <span className="truncate">{sub.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      onClick={onClose}
      className={baseClasses}
      title={isCollapsed ? item.label : undefined}
    >
      {content}
    </Link>
  );
};

const SidebarContent = ({ onClose, isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`flex flex-col h-full bg-sidebar text-foreground overflow-hidden w-full ${!isCollapsed ? 'border-r border-border' : ''}`}>

      <div className={`flex items-center px-4 py-4 flex-shrink-0 h-[64px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer rounded-lg transition-colors overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain flex-shrink-0" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-base font-bold text-foreground whitespace-nowrap"
              >
                Cash Book
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1">
        {SIDEBAR_ITEMS.map((item, idx) => (
          <NavItem key={idx} item={item} location={location} onClose={onClose} isCollapsed={isCollapsed} />
        ))}
      </div>

      <div className="p-3 flex-shrink-0 border-t border-border/50 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer w-full ${
            isCollapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
          }`}
          title="Log Out"
        >
          <LogOut className="w-[20px] h-[20px] flex-shrink-0" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium text-sm whitespace-nowrap"
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export const Sidebar = ({ mobileOpen, onClose, isCollapsed }) => {
  return (
    <>
      <motion.div
        animate={{ width: isCollapsed ? 72 : 224 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden lg:flex flex-shrink-0 h-full overflow-hidden bg-sidebar"
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={onClose} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="relative w-56 h-full shadow-2xl"
            >
              <SidebarContent onClose={onClose} isCollapsed={false} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
