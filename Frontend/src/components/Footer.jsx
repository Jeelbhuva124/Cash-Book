import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send, FileText, Scale } from 'lucide-react';

export const UserFooter = () => {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-border/50">
          
          {/* Column 1: Brand & About (Takes 4 cols on md) */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <div className="bg-white p-1.5 rounded-xl">
                 <img src="/logo.png" alt="Cash Book Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-bold text-foreground">Cash Book</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mt-2">
              Cash Book is India's leading smart finance management and money management app. Simplify your daily budget entry and digitize your khata book effortlessly.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (Takes 2 cols) */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-expense animate-pulse"></span>
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase">Quick Links</h4>
            </div>
            <ul className="space-y-3">
              {['Home', 'Why Us?', 'Services', 'Blog', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '').replace('?', '')}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                     <span className="text-xs">›</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources (Takes 2 cols) */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
             <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase">Resources</h4>
            </div>
            <ul className="space-y-3">
              {['FAQ', 'Help Center', 'Legal', 'Roadmap'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <span className="text-xs">›</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect & Newsletter (Takes 4 cols) */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
             <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-income"></span>
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase">Connect</h4>
            </div>
            <ul className="space-y-3 mb-4">
               <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Terms of Service
                  </Link>
                </li>
            </ul>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Subscribe to our newsletter</p>
              <div className="flex items-center gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                />
                <button className="bg-expense hover:opacity-90 transition-opacity p-2.5 rounded-xl text-white flex-shrink-0">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Cash Book. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-income"></span>
             <span className="text-xs text-muted-foreground">System Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
