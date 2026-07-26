import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DirectionHover } from './DirectionHover';

export const UserNavbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="Cash Book Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-105 transition-transform" />
            <span className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
              Cash Book
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center p-1 border border-border/60 rounded-full bg-background/60 backdrop-blur-xl shadow-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/home');

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors relative z-10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <DirectionHover text={link.label} hoverText={link.label} className="px-1" />
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20 -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            {localStorage.getItem("token") ? (
              <Link
                to="/dashboard"
                className="text-xs sm:text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-95 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all shadow-sm hover:shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-xs sm:text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-95 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${(location.pathname === link.path || (link.path === '/' && location.pathname === '/home'))
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border flex gap-2">
                {localStorage.getItem("token") ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors">
                      Login
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

