import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <nav className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="Cash Book Logo" className="w-11 h-11 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg sm:text-xl font-black text-foreground tracking-tight">Cash Book</span>
              <span className="text-xs text-muted-foreground font-semibold -mt-0.5">Smart Finance Tracker</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center p-2 border border-border/80 rounded-full bg-background/40 backdrop-blur-md transition-all duration-300">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/home');

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2.5 rounded-full text-base font-semibold transition-colors relative z-10 ${isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {link.label}
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 backdrop-blur-xl border border-primary/30 -z-10"
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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {localStorage.getItem("token") ? (
              <Link
                to="/dashboard"
                className="text-base font-bold bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl hover:opacity-90 transition-all shadow-md shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-base font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-base font-bold bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl hover:opacity-90 transition-all shadow-md shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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

