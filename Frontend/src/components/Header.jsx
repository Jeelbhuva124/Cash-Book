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
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-foreground tracking-tight">Cash Book</span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">Smart Finance Tracker</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/25 hover:shadow-primary/40"
            >
              Get Started
            </Link>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
