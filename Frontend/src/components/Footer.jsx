import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';

export const UserFooter = () => {
  return (
    <footer className="relative bg-background pt-16 pb-0 overflow-hidden border-t border-border/40 mt-auto flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-12">

          {/* Logo and Info */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <img src="/logo.png" alt="Cash Book Logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-foreground">Cash Book</span>
                <span className="text-[10px] text-muted-foreground">Smart Finance Tracker</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Track daily expenses, manage business ledgers, and maintain shared accounts effortlessly. Your ultimate personal finance manager.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/60">
              © 2026 Cash Book · Made with ❤️ in India
            </p>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* PRODUCT */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase mb-2">Product</h4>
              <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mobile App</Link>
            </div>

            {/* COMPANY */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase mb-2">Company</h4>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Login</Link>
              <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sign Up</Link>
            </div>

            {/* RESOURCES */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase mb-2">Resources</h4>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark Text */}
      <div className="w-full flex items-end justify-center pointer-events-none select-none -mt-4 md:-mt-12 overflow-hidden relative z-0">
        <h1 className="text-[18vw] md:text-[22vw] font-bold tracking-tighter leading-none text-center whitespace-nowrap bg-gradient-to-b from-foreground/8 to-background bg-clip-text text-transparent translate-y-[20%]">
          CASH BOOK
        </h1>
      </div>
    </footer>
  );
};
