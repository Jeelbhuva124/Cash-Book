import React, { useState } from "react";
import {
  Target,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Award,
  Heart,
  CheckCircle2,
  ArrowRight,
  Lock,
  Clock,
  Sparkles,
  Layers,
  Smartphone,
  LineChart,
  Building2,
  ChevronRight,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  BarChart3,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export const About = () => {
  const [activeMilestone, setActiveMilestone] = useState(1);

  const stats = [
    { label: "Active Users", value: "50,000+", change: "Verified Accounts", badgeBg: "bg-income-bg", badgeColor: "text-income" },
    { label: "Transactions Logged", value: "10M+", change: "100% Data Integrity", badgeBg: "bg-info-bg", badgeColor: "text-info" },
    { label: "Countries Supported", value: "120+", change: "Global Sync", badgeBg: "bg-primary/10", badgeColor: "text-primary" },
    { label: "Uptime SLA", value: "99.99%", change: "Real-time Availability", badgeBg: "bg-income-bg", badgeColor: "text-income" },
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Genesis",
      badge: "Phase 1 - Foundation",
      description:
        "Founded with a clear mission: eliminating physical paper ledgers and clumsy spreadsheets for small merchants, freelancers, and daily cash flow management.",
      achievements: [
        "First 1,000 active ledger managers onboarded",
        "Encrypted SQLite storage engine & seamless cloud sync",
        "Mobile-first responsive UI built with modern web standards",
        "Instant cash-in and cash-out balance tracking",
      ],
    },
    {
      year: "2025",
      title: "Feature Expansion",
      badge: "Phase 2 - Ecosystem",
      description:
        "Introduced multi-ledger support, shared accounts, and automated expense categorization powered by clean interactive visual dashboards.",
      achievements: [
        "Scaled past 25,000 active monthly ledger users",
        "1-click PDF & Excel report export generation",
        "Multi-currency support with real-time total calculations",
        "Custom category tagging and search filters",
      ],
    },
    {
      year: "2026",
      title: "Zero-Knowledge Security & Beyond",
      badge: "Phase 3 - Scale & Security",
      description:
        "Hardened end-to-end encryption protocols and introduced multi-user role permissions for shop accounts and family finance coordination.",
      achievements: [
        "Crossed 50,000 verified active financial accounts",
        "Sub-100ms real-time sync across web and mobile browsers",
        "Role-based permissions (Owner, Editor, Viewer access)",
        "Audit logging and automated cloud data redundancy",
      ],
    },
  ];

  const pillars = [
    {
      icon: Shield,
      title: "Bank-Grade Encryption",
      accentColor: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      description:
        "Every transaction entry, credit log, and balance summary is protected using AES-256 bit encryption in transit and at rest. Your financial records belong strictly to you.",
      highlights: ["End-to-End Encrypted", "Zero Data Monetization", "Automated Redundant Backups"],
      colSpan: "md:col-span-2",
    },
    {
      icon: Zap,
      title: "Sub-Second Performance",
      accentColor: "text-income",
      bgColor: "bg-income-bg",
      borderColor: "border-income/30",
      description:
        "Optimized for high-speed entries. Record income and expense entries instantly without waiting for page reloads.",
      highlights: ["Instant Auto-Save", "Offline Ledger Support"],
      colSpan: "md:col-span-1",
    },
    {
      icon: Users,
      title: "Multi-User Collaboration",
      accentColor: "text-info",
      bgColor: "bg-info-bg",
      borderColor: "border-info/30",
      description:
        "Share accounts with accountants, business partners, or family members with granular role-based access control.",
      highlights: ["Role-Based Access", "Full Activity Audit Trail"],
      colSpan: "md:col-span-1",
    },
    {
      icon: Target,
      title: "Uncompromising Precision",
      accentColor: "text-warning",
      bgColor: "bg-warning-bg",
      borderColor: "border-warning/30",
      description:
        "Double-entry bookkeeping standards streamlined into a simple, clear interface. Zero math discrepancies, accurate to the last rupee.",
      highlights: ["Calculated Balance Audits", "Custom Category Tagging", "Interactive Analytics"],
      colSpan: "md:col-span-2",
    },
  ];

  const founders = [
    {
      name: "Iron-Man",
      role: "Co-Founder & CEO",
      image: "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&q=80&w=400",
      bio: "Genius, billionaire, playboy, philanthropist. Bringing Stark Industries-level tech to revolutionize digital finance."
    },
    {
      name: "Prime Jash",
      role: "Co-Founder & CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      bio: "The mastermind architect. Forging lightning-fast sync engines and unbreakable backend systems."
    },
    {
      name: "Prime Jeel",
      role: "Co-Founder & Head of Product",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      bio: "The visionary designer. Turning raw, complex financial data into a seamless and beautiful user experience."
    }
  ];

  const featuresOverview = [
    {
      icon: Wallet,
      title: "Digital Khata Management",
      desc: "Track daily sales, customer credit, and vendor payments digitally with instant balance totals.",
    },
    {
      icon: BarChart3,
      title: "Visual Financial Reports",
      desc: "Generate clean visual charts and monthly summaries to analyze spending patterns effortlessly.",
    },
    {
      icon: FileSpreadsheet,
      title: "1-Click PDF & Excel Exports",
      desc: "Export complete account histories into standard spreadsheet and printable PDF formats.",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Privacy",
      desc: "Your data is encrypted before it touches the server, maintaining total privacy for your books.",
    },
  ];

  const principles = [
    {
      icon: Heart,
      title: "User-First Architecture",
      desc: "We build features strictly guided by community user feedback, avoiding bloated UI or aggressive ads.",
    },
    {
      icon: ShieldCheck,
      title: "Transparent & Open",
      desc: "Clear pricing, zero hidden paywalls, and full data exportability whenever you need your data.",
    },
    {
      icon: Cpu,
      title: "Relentless Engineering",
      desc: "Every database query, API route, and UI component is optimized for speed, reliability, and security.",
    },
  ];

  return (
    <main className="flex flex-col min-h-screen pt-16 bg-background text-foreground overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto z-10">
        {/* Ambient background glow using primary color theme variable */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/15 rounded-full blur-[140px] -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-semibold mb-6"
        >
          <Globe className="w-4 h-4" />
          <span>Redefining Financial Ledger Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
        >
          Democratizing Financial <br className="hidden sm:block" />
          <span className="text-primary font-black">
            Clarity & Control
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10"
        >
          Cash Book was engineered to solve a universal problem: traditional accounting software is overwhelmingly complex, while paper logbooks are easily damaged or lost. We bridge that gap with fast, encrypted digital simplicity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm md:text-base flex items-center gap-2 cursor-pointer"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3.5 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-muted/50 hover:-translate-y-0.5 transition-all text-sm md:text-base"
          >
            Contact Support
          </Link>
        </motion.div>
      </section>


      {/* ── STORY / MISSION SECTION ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-income-bg text-income text-xs font-bold uppercase tracking-wider border border-income/20">
              <Sparkles className="w-3.5 h-3.5" />
              Our Mission & Core Vision
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Designed for Speed, <br />
              Built for Security.
            </h2>

            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              Whether you are a retail shop owner tracking customer credit, a freelancer logging client payments, or a household managing monthly budgets, money management should be fast, transparent, and completely private.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Instant real-time sync across mobile & web browsers",
                "Built-in offline mode with auto reconciliation",
                "Clean PDF reports with signature verification fields",
                "Strict zero third-party ad tracking or selling of customer data",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-income-bg text-income flex items-center justify-center shrink-0 border border-income/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      CB
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Cash Book System</h4>
                      <p className="text-xs text-muted-foreground">Encrypted Ledger Engine</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-income-bg text-income border border-income/30">
                    Status: Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-muted border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold">Multiple Ledgers</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">Unlimited</span>
                  </div>

                  <div className="p-4 rounded-xl bg-muted border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold">Cross-Platform Sync</span>
                    </div>
                    <span className="text-xs text-income font-bold">&lt; 100ms</span>
                  </div>

                  <div className="p-4 rounded-xl bg-muted border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold">Data Encryption</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">AES-256</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CORE PILLARS BENTO GRID ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Product Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Our Core Pillars</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            The principles that guide every feature we build and every line of code we write.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className={`${pillar.colSpan} bg-card border border-border p-8 rounded-3xl shadow-lg hover:shadow-xl hover:${pillar.borderColor} transition-all duration-300 relative overflow-hidden group flex flex-col justify-between`}
              >
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${pillar.bgColor} ${pillar.accentColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-2 pt-2">
                  {pillar.highlights.map((h, hIdx) => (
                    <span
                      key={hIdx}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-muted border border-border text-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ── KEY FEATURES OVERVIEW ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              Comprehensive Toolkit
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Built for Everyday Use</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresOverview.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  className="bg-background border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE TIMELINE / MILESTONES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Evolution & Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Our Product Journey</h2>
        </div>

        {/* Milestone Selector Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {milestones.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMilestone(idx)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${activeMilestone === idx
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
            >
              {m.year} — {m.title}
            </button>
          ))}
        </div>

        {/* ── 3D INTERACTIVE CAROUSEL STACK ── */}
        <div className="relative min-h-[460px] sm:min-h-[480px] flex items-center justify-center py-6 px-4 overflow-visible">
          {milestones.map((milestone, idx) => {
            const offset = idx - activeMilestone;
            const isActive = offset === 0;

            // Calculate 3D position, scaling, blur, and opacity relative to active index
            let translateX = "0%";
            let scale = 1;
            let opacity = 1;
            let blurVal = "0px";
            let zIndex = 30;

            if (offset === -1) {
              translateX = "-48%";
              scale = 0.86;
              opacity = 0.65;
              blurVal = "3px";
              zIndex = 20;
            } else if (offset === 1) {
              translateX = "48%";
              scale = 0.86;
              opacity = 0.65;
              blurVal = "3px";
              zIndex = 20;
            } else if (offset < -1) {
              translateX = "-85%";
              scale = 0.74;
              opacity = 0.3;
              blurVal = "5px";
              zIndex = 10;
            } else if (offset > 1) {
              translateX = "85%";
              scale = 0.74;
              opacity = 0.3;
              blurVal = "5px";
              zIndex = 10;
            }

            return (
              <motion.div
                key={idx}
                onClick={() => setActiveMilestone(idx)}
                animate={{
                  x: translateX,
                  scale: scale,
                  opacity: opacity,
                  filter: `blur(${blurVal})`,
                  zIndex: zIndex,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute w-[92%] sm:w-[480px] lg:w-[520px] bg-card border ${isActive
                  ? "border-primary shadow-2xl shadow-primary/25"
                  : "border-border shadow-lg hover:border-primary/40"
                  } p-6 sm:p-8 rounded-3xl cursor-pointer select-none transition-colors duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {milestone.year}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${isActive
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground border-border"
                      }`}
                  >
                    {milestone.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {milestone.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-6">
                  {milestone.description}
                </p>

                <div className="space-y-2.5 border-t border-border/60 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Key Accomplishments
                  </h4>
                  {milestone.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${isActive
                          ? "bg-income-bg text-income border-income/30"
                          : "bg-muted text-muted-foreground border-border"
                          }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FOUNDERS SECTION ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            The Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Meet the Founders</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((founder, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="bg-card/80 backdrop-blur-md border border-border rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden">
                <img src={founder.image} alt={founder.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
              <div className="relative p-8 text-center -mt-20">
                <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-black text-foreground mb-1">{founder.name}</h3>
                  <p className="text-sm font-bold text-primary tracking-wide uppercase mb-4">{founder.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {founder.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRINCIPLES SECTION ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CONVERSION CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-primary text-primary-foreground rounded-[2.5rem] p-10 sm:p-16 text-center relative shadow-2xl shadow-primary/25 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 space-y-6"
          >
            <h2 className="text-3xl sm:text-5xl font-black leading-tight">
              Ready to simplify your financial ledgers?
            </h2>
            <p className="text-primary-foreground/90 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
              Join tens of thousands of users managing their daily accounts with speed and zero hassle.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
