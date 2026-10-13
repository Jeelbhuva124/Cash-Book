import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, CreditCard,
  Users, BarChart3, User, Settings, LogOut, Book,
  Palette, UserCog, ChevronDown, History, RefreshCw, FileText, Bell
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SIDEBAR_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Cashbooks', icon: Book, path: '/dashboard/cashbooks' },
      { label: 'Party Ledger', icon: BookOpen, path: '/dashboard/party-ledger' },
    ]
  },
  {
    title: 'Finance & Tools',
    items: [
      { label: 'Reports', icon: BarChart3, path: '/dashboard/reports' },
      { label: 'EMI & Subs', icon: RefreshCw, path: '/dashboard/tracker' },
      { label: 'Receipts Vault', icon: FileText, path: '/dashboard/receipts-vault' },
      { label: 'History', icon: History, path: '/dashboard/history' },
    ]
  },
  {
    title: 'Manage',
    items: [
      { label: 'Reminders', icon: Bell, path: '/dashboard/reminders' },
      { label: 'Payment Mode', icon: CreditCard, path: '/dashboard/payment-modes' },
      { label: 'Invitations', icon: Users, path: '/dashboard/invitations' },
      { 
        label: 'Settings', 
        icon: Settings, 
        path: '/dashboard/settings',
        subItems: [
          { label: 'Profile', icon: User, path: '/dashboard/settings/profile' },
          { label: 'Active Session', icon: UserCog, path: '/dashboard/settings/sessions' },
          { label: 'Preferences', icon: Palette, path: '/dashboard/settings/preferences' }
        ]
      },
    ]
  }
];

const NavItem = ({ item, location, onClose, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  const isActive = location.pathname === item.path || (hasSubItems && item.subItems.some(sub => location.pathname === sub.path));

  const content = (
    <>
      <item.icon className={`w-[17px] h-[17px] flex-shrink-0 stroke-[1.8] transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />

      <AnimatePresence mode="popLayout">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="flex-1 text-left whitespace-nowrap overflow-hidden text-[13px] tracking-tight"
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
            className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full leading-none bg-primary text-primary-foreground ml-auto"
          >
            {item.badge}
          </motion.span>
        )}
      </AnimatePresence>
      
      {!isCollapsed && hasSubItems && (
        <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''} text-muted-foreground/70`} />
      )}

      {isActive && !isCollapsed && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full"
        />
      )}
    </>
  );

  const baseClasses = `relative flex items-center py-1.5 rounded-lg text-[13px] font-medium transition-all group w-full ${
    isCollapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
  } ${
    isActive
      ? 'bg-primary/10 text-primary font-semibold dark:bg-primary/20'
      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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
              transition={{ duration: 0.18 }}
              className="flex flex-col mt-0.5 space-y-0.5 overflow-hidden pl-7"
            >
              {item.subItems.map((sub, i) => (
                <Link
                  key={i}
                  to={sub.path}
                  onClick={onClose}
                  className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-[12px] font-medium transition-colors ${
                    location.pathname === sub.path
                      ? 'text-primary font-semibold bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <sub.icon className="w-3.5 h-3.5 shrink-0 stroke-[1.8]" />
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
    localStorage.removeItem("profile_data");
    window.dispatchEvent(new Event("profileUpdated"));
    navigate("/login");
  };

  return (
    <div className={`flex flex-col h-full bg-sidebar text-foreground overflow-hidden w-full ${!isCollapsed ? 'border-r border-border/50' : 'border-r border-border/50'}`}>

      {/* Sleek Minimal Header */}
      <div className={`flex items-center px-3.5 flex-shrink-0 h-[56px] border-b border-border/40 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer rounded-lg transition-colors overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain flex-shrink-0" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="text-sm font-bold text-foreground whitespace-nowrap tracking-tight"
              >
                Cash Book
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Minimal Grouped Navigation Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 space-y-3 custom-scrollbar">
        {SIDEBAR_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2.5 pt-1 pb-1 select-none">
                {section.title}
              </div>
            )}
            {section.items.map((item, idx) => (
              <NavItem 
                key={idx} 
                item={item} 
                location={location} 
                onClose={onClose} 
                isCollapsed={isCollapsed} 
              />
            ))}
          </div>
        ))}
      </div>

      {/* Sleek Minimal Footer */}
      <div className="p-2.5 flex-shrink-0 border-t border-border/40 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center py-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer w-full text-[13px] font-medium ${
            isCollapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
          }`}
          title="Log Out"
        >
          <LogOut className="w-[17px] h-[17px] flex-shrink-0 stroke-[1.8]" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="whitespace-nowrap"
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
        animate={{ width: isCollapsed ? 64 : 216 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
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
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="relative w-52 h-full shadow-2xl"
            >
              <SidebarContent onClose={onClose} isCollapsed={false} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
