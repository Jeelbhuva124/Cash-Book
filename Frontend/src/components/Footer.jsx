import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Facebook, Twitter, Instagram, Linkedin, Send, FileText, Scale, Mail, ArrowUp, MapPin, Phone } from 'lucide-react';
import footerLogo from '../Assets/logo.png';

export const UserFooter = () => {
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    addToast('Subscribed successfully!', 'success');
    e.target.reset();
  };

  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-border/50">

          {/* Column 1: Brand & About (Takes 4 cols on md) */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <div className="bg-white p-2 rounded-xl">
                <img src={footerLogo} alt="Cash Book Logo" className="h-10 w-auto object-contain" />
              </div>
              <span className="text-2xl font-bold text-foreground">Cash Book</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mt-2 mb-2">
              India's leading smart finance app. Digitize your khata book and manage daily budgets effortlessly.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">Mota varachha, Surat, Gujarat.</span>
              </div>
              <a href="mailto:cashbook1204@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5 shrink-0" />
                <span className="text-sm">cashbook1204@gmail.com</span>
              </a>
              <a href="tel:+917861908799" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-5 h-5 shrink-0" />
                <span className="text-sm">+91 78619 08799</span>
              </a>
            </div>

            <div className="flex items-center gap-3 mt-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
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
              {['Home', 'Why Us?', 'Services', 'Blog', 'Contact Us'].map((item) => {
                let linkPath = '/';
                if (item === 'Home') linkPath = '/';
                else if (item === 'Why Us?') linkPath = '/about';
                else if (item === 'Services') linkPath = '/services';
                else if (item === 'Blog') linkPath = '/blog';
                else if (item === 'Contact Us') linkPath = '/contact';

                return (
                  <li key={item}>
                    <Link to={linkPath} className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2">
                      <span className="text-xs group-hover:translate-x-1 transition-transform duration-300">›</span> {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Resources (Takes 2 cols) */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase">Resources</h4>
            </div>
            <ul className="space-y-3">
              {['FAQ', 'Help Center', 'Legal', 'Roadmap'].map((item) => {
                let linkPath = '/';
                if (item === 'FAQ') linkPath = '/faq';
                else if (item === 'Help Center') linkPath = '/helpcenter';
                else if (item === 'Legal') linkPath = '/legal';
                else if (item === 'Roadmap') linkPath = '/roadmap';

                return (
                  <li key={item}>
                    <Link to={linkPath} className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2">
                      <span className="text-xs group-hover:translate-x-1 transition-transform duration-300">›</span> {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Connect & Newsletter (Takes 4 cols) */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-income"></span>
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase">Connect</h4>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2">
                  <Scale className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
            © 2026 CASH BOOK. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 shadow-sm hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] flex items-center">
              PROUDLY ENGINEERED IN INDIA <img src="https://flagcdn.com/w40/in.png" alt="India" className="ml-2.5 w-5 h-auto rounded-[2px]" />
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6 text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/security" className="hover:text-primary transition-colors">Security</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
