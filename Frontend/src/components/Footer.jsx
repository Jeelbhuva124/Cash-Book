import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Facebook, Twitter, Instagram, Linkedin, Send, FileText, Scale, Mail, ArrowUp, MapPin, Phone, Home, HelpCircle, Briefcase, BookOpen, MessageSquare, LifeBuoy, Map, ShieldCheck } from 'lucide-react';
import footerLogo from '../Assets/logo.png';
import { WeightHover } from './WeightHover';

export const UserFooter = () => {
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    addToast('Subscribed successfully!', 'success');
    e.target.reset();
  };

  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border mt-auto relative z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-border/50">

          {/* Column 1: Brand & About (Takes 4 cols on md) */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <img src={footerLogo} alt="Cash Book Logo" className="h-10 w-auto object-contain" />
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
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" }
              ].map(({ Icon, href, label }, i) => (
                <a key={i} href={href} aria-label={label} className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300">
                  <Icon className="w-5 h-5" />
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
              {[
                { label: 'Home', linkPath: '/', Icon: Home },
                { label: 'About Us', linkPath: '/about', Icon: HelpCircle },
                { label: 'Services', linkPath: '/services', Icon: Briefcase },
                { label: 'Blog', linkPath: '/blog', Icon: BookOpen },
                { label: 'Contact Us', linkPath: '/contact', Icon: MessageSquare }
              ].map(({ label, linkPath, Icon }) => (
                <li key={label}>
                  <Link to={linkPath} className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md py-1">
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <WeightHover text={label} defaultWeight={500} hoverWeight={700} />
                  </Link>
                </li>
              )
              )}
            </ul>
          </div>

          {/* Column 3: Resources (Takes 2 cols) */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <h4 className="text-xs font-bold text-foreground tracking-widest uppercase">Resources</h4>
            </div>
            <ul className="space-y-3">
              {[
                { label: 'FAQ', linkPath: '/faq', Icon: HelpCircle },
                { label: 'Help Center', linkPath: '/helpcenter', Icon: LifeBuoy },
                { label: 'Legal', linkPath: '/legal', Icon: ShieldCheck },
                { label: 'Roadmap', linkPath: '/roadmap', Icon: Map }
              ].map(({ label, linkPath, Icon }) => (
                <li key={label}>
                  <Link to={linkPath} className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md py-1">
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> 
                    <WeightHover text={label} defaultWeight={500} hoverWeight={700} />
                  </Link>
                </li>
              )
              )}
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
                <Link to="/privacy" className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md py-1">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="group text-sm text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md py-1">
                  <Scale className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6 text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/security" className="hover:text-primary transition-colors">Security</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 shadow-sm hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] flex items-center">
              PROUDLY ENGINEERED IN INDIA <img src="https://flagcdn.com/w40/in.png" alt="India" className="ml-2.5 w-5 h-auto rounded-[2px]" />
            </span>
          </div>

          <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-widest text-center md:text-right">
            © 2026 CASH BOOK. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
};

