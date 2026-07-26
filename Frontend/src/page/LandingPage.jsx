import React, { useState, useEffect, useRef } from "react";
import { ScrambleText } from "../components/ScrambleText";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  TrendingUp,
  Users,
  Shield,
  Smartphone,
  BarChart3,
  ChevronRight,
  Star,
  Check,
  ArrowRight,
  Wallet,
  PiggyBank,
  Receipt,
  Bell,
  Share2,
  Download,
  Zap,
  Globe,
  Play,
  CheckCircle,
  SmartphoneIcon,
  Lock,
  Landmark,
  FileSpreadsheet,
  PlusCircle,
  CheckSquare,
  Sparkles,
  Fuel,
  ShoppingCart,
  Lightbulb,
  HeartPulse,
  Plane,
  Home as HomeIcon,
  Briefcase,
  ShoppingBag,
  RotateCcw,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Testimonials } from "../components/Testimonials";
import { ContactSection } from "../components/ContactSection";
import { EarthSection } from "../components/EarthSection";
import { SecuritySection } from "../components/SecuritySection";

const FeatureCard = ({ icon: Icon, title, description, borderAccent, points }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
    className={`bg-card/80 backdrop-blur-md rounded-2xl p-6 border shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ${
      borderAccent ? "border-expense border-2" : "border-border/50"
    }`}
  >
    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
      {description}
    </p>
    {points && points.length > 0 && (
      <ul className="space-y-3">
        {points.map((point, idx) => (
          <motion.li 
            key={idx} 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 + (idx * 0.1) }}
            className="flex items-start gap-3 text-sm text-foreground/90 font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
            </div>
            {point}
          </motion.li>
        ))}
      </ul>
    )}
  </motion.div>
);

const TrackerCard = ({ icon: Icon, title, desc, tag, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.15 }}
    transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.1 }}
    whileHover={{ y: -4 }}
    className="group relative bg-card/80 backdrop-blur-md border border-border/50 hover:border-primary/40 rounded-2xl p-5 shadow-md hover:shadow-xl hover:shadow-primary/10 active:scale-[0.98] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
  >
    {/* Subtle Background Glow on Hover */}
    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-all duration-500 pointer-events-none" />

    <div className="flex items-center justify-between gap-3 mb-3">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 border shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
        <Icon className="w-5 h-5" />
      </div>
      {tag && (
        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/60 group-hover:border-primary/30 group-hover:text-primary transition-colors">
          {tag}
        </span>
      )}
    </div>

    <div>
      <h4 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  </motion.div>
);

const HeroMockupAnimation = ({ baseDelay = 0 }) => {
  const [activeTxIndex, setActiveTxIndex] = useState(0);

  const transactions = [
    { title: "Supermarket Purchase", category: "Grocery", amt: "-₹2,340", type: "expense", time: "Just now", icon: ShoppingCart },
    { title: "Freelance Project Deposit", category: "Income", amt: "+₹12,500", type: "income", time: "2m ago", icon: Briefcase },
    { title: "Petrol & Travel Commute", category: "Fuel & Travel", amt: "-₹1,200", type: "expense", time: "15m ago", icon: Fuel },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTxIndex((prev) => (prev + 1) % transactions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [transactions.length]);

  // Smooth Organic Liquid SVG Wave Path Coordinates
  const waveLineA = "M 0,46 Q 60,30 120,40 T 240,32 T 360,44 T 400,34";
  const waveLineB = "M 0,36 Q 60,44 120,28 T 240,40 T 360,28 T 400,42";
  const waveFillA = "M 0,46 Q 60,30 120,40 T 240,32 T 360,44 T 400,34 L 400,60 L 0,60 Z";
  const waveFillB = "M 0,36 Q 60,44 120,28 T 240,40 T 360,28 T 400,42 L 400,60 L 0,60 Z";

  return (
    <div className="relative w-full max-w-xl mx-auto py-2">
      {/* Background Multi-Layer Ambient Glow Aura */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 via-indigo-500/20 to-purple-500/30 rounded-3xl blur-3xl opacity-75 animate-pulse pointer-events-none" />

      {/* Dribbble Glass Studio Box Container */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-900/95 border border-slate-800/80 shadow-[0_25px_70px_-15px_rgba(99,102,241,0.2)] p-5 sm:p-7 md:p-8 overflow-hidden group">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Studio Background Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border-slate-800/40 pointer-events-none">
          <div className="border-r border-b border-slate-800/30" />
          <div className="border-r border-b border-slate-800/30" />
          <div className="border-b border-slate-800/30" />
          <div className="border-r border-b border-slate-800/30" />
          <div className="border-r border-b border-slate-800/30" />
          <div className="border-b border-slate-800/30" />
        </div>

        {/* Ambient Floating Light Orb 1 - Bottom Left */}
        <motion.div
          animate={{
            x: [10, 140, 200, 40, 10],
            y: [240, 200, 260, 290, 240],
            scale: [1, 1.25, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 blur-2xl opacity-60 z-10 pointer-events-none"
        />

        {/* Ambient Floating Light Orb 2 - Top Right */}
        <motion.div
          animate={{
            x: [200, 100, 220, 180, 200],
            y: [20, 60, 10, 40, 20],
            scale: [1, 1.1, 0.95, 1.2, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 blur-2xl opacity-40 z-10 pointer-events-none"
        />

        {/* Studio Top & Bottom Minimal Metadata Bar */}
        <div className="flex items-center justify-between mb-4 relative z-20">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
              <ScrambleText text="Total Inbound ₹45,500" delay={baseDelay + 200} />
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
              <ScrambleText text="Live Sync Active" delay={baseDelay + 400} />
            </span>
          </div>
        </div>

        {/* Inner Glass Card (Cleanly Spaced, No Overlap) */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-20 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 my-1"
        >
          {/* Glass reflection beam effect */}
          <div className="absolute -top-24 -left-24 w-64 h-96 bg-gradient-to-br from-white/15 to-transparent rotate-45 pointer-events-none blur-sm" />

          {/* Mockup Window Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60">
              <img src="/logo.png" alt="Cash Book" className="w-4 h-4 object-contain" />
              <span className="text-[10px] font-bold text-slate-200 tracking-widest uppercase">
                <ScrambleText text="CASH BOOK" delay={baseDelay + 600} />
              </span>
            </div>
          </div>

          {/* Balance Stats Row */}
          <div className="grid grid-cols-3 gap-2.5 py-1 relative z-10">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider"><ScrambleText text="Income" delay={baseDelay + 800} flipboard={true} /></span>
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-400 mt-1"><ScrambleText text="₹45,500" delay={baseDelay + 1000} flipboard={true} /></p>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider"><ScrambleText text="Expense" delay={baseDelay + 1200} flipboard={true} /></span>
                <ArrowDownLeft className="w-3 h-3 text-rose-400" />
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-rose-400 mt-1"><ScrambleText text="₹18,240" delay={baseDelay + 1400} flipboard={true} /></p>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider"><ScrambleText text="Net Cash" delay={baseDelay + 1600} flipboard={true} /></span>
                <Wallet className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-sky-400 mt-1"><ScrambleText text="₹27,260" delay={baseDelay + 1800} flipboard={true} /></p>
            </div>
          </div>

          {/* Animated Analytics Wave Chart (Ultra Smooth Liquid Wave) */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 relative z-10 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-400"><ScrambleText text="Real-time Analytics Feed" delay={2000} /></span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm"><ScrambleText text="+14.2% Growth" delay={2200} /></span>
            </div>
            <div className="h-10 w-full relative">
              <svg className="w-full h-full overflow-hidden" viewBox="0 0 400 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="payiusWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  animate={{ d: [waveFillA, waveFillB, waveFillA] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  fill="url(#payiusWaveGradient)"
                />
                <motion.path
                  animate={{ d: [waveLineA, waveLineB, waveLineA] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  fill="none"
                  stroke="rgb(99, 102, 241)"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Live Transaction Stream */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-primary" />
                <ScrambleText text="Recent Activity" delay={2400} />
              </p>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <ScrambleText text="Live Sync" delay={2600} />
              </span>
            </div>

            <div className="space-y-1.5">
              {transactions.map((row, i) => {
                const IconComponent = row.icon;
                const isActive = i === activeTxIndex;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      scale: isActive ? 1.02 : 1,
                      x: isActive ? 4 : 0,
                      borderColor: isActive ? "rgba(99, 102, 241, 0.6)" : "rgba(51, 65, 85, 0.5)",
                    }}
                    transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.8 }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                      isActive ? "bg-primary/20 border-primary/60 shadow-[0_0_20px_rgba(99,102,241,0.25)]" : "bg-slate-800/50 border-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        row.type === "income" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                      }`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1">
                          <ScrambleText text={row.title} delay={2800 + baseDelay + (i * 200)} />
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                        </p>
                        <p className="text-[9px] text-slate-400"><ScrambleText text={`${row.category} • ${row.time}`} delay={2900 + baseDelay + (i * 200)} /></p>
                      </div>
                    </div>
                    <span className={`text-xs font-extrabold ${row.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                      <ScrambleText text={row.amt} delay={3000 + (i * 200)} />
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Only show intro loader on initial website open
  const [showIntroLoader, setShowIntroLoader] = useState(() => {
    return !sessionStorage.getItem("hasSeenIntroAnimation");
  });

  const baseDelay = showIntroLoader ? 2500 : 0;

  useEffect(() => {
    if (showIntroLoader) {
      sessionStorage.setItem("hasSeenIntroAnimation", "true");
      const timer = setTimeout(() => {
        setShowIntroLoader(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showIntroLoader]);

  const features = [
    {
      icon: BookOpen,
      title: "Digital Khata Book",
      description:
        "Replace your traditional paper logbooks with a robust, searchable digital ledger. Access your accounts instantly from anywhere.",
      borderAccent: false,
      points: ["Cloud-based auto backup", "No more paper clutter", "Secure anywhere access"],
    },
    {
      icon: BarChart3,
      title: "Customizable Layouts",
      description:
        "Customize entry tables, categories, and tags to fit your specific needs. Personalize headers to match your business workflows.",
      borderAccent: false,
      points: ["Custom categories & tags", "Personalized table headers", "Flexible data fields"],
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description:
        "Invite family members, business partners, or accountants to view, edit, and contribute to your books in real time.",
      borderAccent: true,
      points: ["Multi-user access control", "Real-time data sync", "Role-based permissions"],
    },
    {
      icon: Receipt,
      title: "Quick & Bulk Entry",
      description:
        "Record single expenses or bulk transactions in seconds. Speed up your accounting with autocomplete fields.",
      borderAccent: false,
      points: ["Batch transaction uploads", "Smart autocomplete fields", "One-tap quick entry"],
    },
    {
      icon: TrendingUp,
      title: "Interactive Reports",
      description:
        "Auto-generate beautiful visual reports, credit summaries, and tax charts. Export data as clean PDF or Excel files.",
      borderAccent: false,
      points: ["Visual spending charts", "1-click PDF generation", "Clean Excel exporting"],
    },
    {
      icon: PiggyBank,
      title: "Smart Budgeting",
      description:
        "Set monthly budget goals for different categories. Get alerts when you are close to reaching your limits.",
      borderAccent: false,
      points: ["Monthly spending limits", "Automated budget alerts", "Category-wise tracking"],
    },
  ];

  const trackCategories = [
    {
      icon: ShoppingCart,
      title: "Grocery Tracker",
      desc: "Log daily kitchen expenses, milk bills, and superstore purchases.",
      tag: "Daily Life",
      color: "from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      icon: Fuel,
      title: "Fuel & Transport",
      desc: "Track petrol, diesel, toll tax, and daily commute charges.",
      tag: "Commute",
      color: "from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      icon: Plane,
      title: "Travel Expenses",
      desc: "Manage budget, flights, hotel stays, and food during tours.",
      tag: "Vacation",
      color: "from-sky-500/15 to-blue-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
    },
    {
      icon: ShoppingBag,
      title: "Shopping Ledger",
      desc: "Monitor clothing, electronics, gifts, and personal luxury spends.",
      tag: "Lifestyle",
      color: "from-purple-500/15 to-pink-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      icon: Lightbulb,
      title: "Electricity & Utilities",
      desc: "Keep history of power bills, water bills, gas cylinders, and Wi-Fi.",
      tag: "Utilities",
      color: "from-yellow-500/15 to-amber-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    },
    {
      icon: HeartPulse,
      title: "Medical Log",
      desc: "Track pharmacy purchases, doctor fees, hospital bills, and insurance.",
      tag: "Health",
      color: "from-rose-500/15 to-red-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
    {
      icon: HomeIcon,
      title: "Home Maintenance",
      desc: "Record rent payments, society maintenance, repairs, and maid salaries.",
      tag: "Housing",
      color: "from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    },
    {
      icon: Briefcase,
      title: "Business Ledger",
      desc: "Manage vendor credits, customer dues, office supplies, and petty cash.",
      tag: "Work",
      color: "from-blue-600/15 to-indigo-600/15 text-blue-600 dark:text-blue-400 border-blue-600/20",
    },
    {
      icon: PiggyBank,
      title: "Savings & Invests",
      desc: "Log SIPs, gold purchases, recurring deposits, and mutual funds.",
      tag: "Finance",
      color: "from-emerald-600/15 to-green-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-600/20",
    },
  ];

  return (
    <div className="w-full bg-background min-h-screen text-foreground overflow-x-hidden">

      {/* ── INTRO REVEAL LOADER WITH CASH BOOK LOGO ── */}
      <AnimatePresence>
        {showIntroLoader && (
          <motion.div
            key="cashbook-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden"
          >
            {/* Crisp Background Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 1.1], opacity: 0.15 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src="/logo.png"
                alt="Cash Book Background Logo"
                loading="lazy"
                className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] object-contain blur-[3px] filter select-none pointer-events-none"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center gap-4 text-center px-4"
            >
              <motion.img 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                src="/logo.png" 
                alt="Cash Book Logo" 
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain filter drop-shadow-xl" 
              />
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Cash Book
                </h2>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Smart Finance Management
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION (RESTORED CASH BOOK HERO) ── */}
      <section className="relative pt-10 pb-20 px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Cash Management</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.12] tracking-tight">
            Modern finances for{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              forward-thinking
            </span>{" "}
            teams
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Streamline your bookkeeping, track every cash transaction in real-time, and gain instant financial clarity with our all-in-one ledger ecosystem.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              to="/signup"
              aria-label="Get Started Free"
              className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-95 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-sm md:text-base flex items-center gap-2 group min-h-[44px]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Free forever plan • No credit card required
            </span>
          </div>
        </div>

        {/* Right Animated Dashboard Mockup */}
        <HeroMockupAnimation />
      </section>

      {/* ── FEATURES SECTION ("What We Do") ── */}
      <section className="py-16 px-4 md:px-8 bg-background border-y border-border" ref={containerRef}>
        <div className="w-full max-w-5xl mx-auto relative">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              What We Do
            </span>
            <h2 className="text-3xl md:text-3xl font-extrabold text-foreground">
              Smart tools for absolute financial clarity.
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              No spreadsheets, no complicated accounting language. Just speed,
              security, and absolute coordination.
            </p>
          </div>

          <div className="relative">
            {/* Central Axis (Static Grey Line) */}
            <div className="absolute left-1/2 top-8 bottom-8 w-px bg-border hidden md:block transform -translate-x-1/2 rounded-full" />

            {/* Active Progress Line (Green/Primary) */}
            <motion.div
              className="absolute left-1/2 top-8 bottom-8 w-px bg-primary hidden md:block transform -translate-x-1/2 origin-top rounded-full z-10 shadow-[0_0_6px_var(--color-primary)]"
              style={{ scaleY }}
            />

            <div className="space-y-12 relative z-20">
              {features.map((feature, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className="relative flex flex-col md:flex-row items-center justify-between group"
                  >
                    {/* Content Container (Card) */}
                    <div className={`w-full md:w-[48%] relative z-20 ${isEven ? "md:order-1" : "md:order-3"}`}>
                      <FeatureCard {...feature} />
                    </div>

                    {/* Empty space for zig-zag alignment */}
                    <div className={`hidden md:block w-[48%] ${isEven ? "order-3" : "order-1"}`} />

                    {/* Center Node (Dot Effect) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center z-30">
                      <div className="w-4 h-4 rounded-full bg-muted border-2 border-background ring-[4px] ring-background flex items-center justify-center overflow-hidden">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: false, amount: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT US STORY ── */}
      <section className="py-16 px-4 md:px-8 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl p-8 border border-border shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 relative"
        >
          <div className="bg-background p-5 rounded-xl border border-border max-w-sm mx-auto shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Auto Backup Completed
                </p>
                <p className="text-xs text-muted-foreground">
                  Sync status: Active
                </p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: false }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Who We Are
          </span>
          <h2 className="text-3xl md:text-3xl font-extrabold text-foreground">
            About Us – Our Story
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Cash Book started with a simple belief: tracking where your money
            goes shouldn't require complex spreadsheet skills or a finance
            degree. We designed this platform to offer Kirana stores,
            freelancers, families, and growing businesses a frictionless way to
            manage ledger logs digital accounts.
          </p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.4,
                  staggerChildren: 0.5,
                },
              },
            }}
            className="space-y-3 pt-2"
          >
            {[
              "Highly optimized for speed & fast entries",
              "Works natively offline with offline persistence storage",
              "Secured with advanced industry-grade ledger encryption",
            ].map((text, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground text-sm font-medium">
                  {text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="pt-2">
            <Link
              to="/about"
              aria-label="Read more about us"
              className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md px-2 py-2 min-h-[44px]"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── CATEGORY TRACKERS ── */}
      <section className="py-20 px-4 md:px-8 bg-muted/40 relative overflow-hidden border-t border-border">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Track Anything, Easily
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              One Cash Book, <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">Multiple Uses.</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Track business logs, domestic budgets, or temporary trip plans. Categorize your cash flow with complete clarity and ease.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {trackCategories.map((item, i) => (
              <TrackerCard key={i} index={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY SECTION ── */}
      <SecuritySection />

      {/* ── EARTH SECTION ── */}
      <EarthSection />

      {/* ── CLIENT TESTIMONIALS ── */}
      <Testimonials />

      {/* ── CONTACT SECTION ── */}
      <ContactSection />
    </div>
  );
}
