import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Testimonials } from "../components/Testimonials";
import { ContactSection } from "../components/ContactSection";
import { EarthSection } from "../components/EarthSection";
import { SecuritySection } from "../components/SecuritySection";

const FeatureCard = ({ icon: Icon, title, description, borderAccent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-card rounded-2xl p-6 border shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 ${
      borderAccent ? "border-expense border-2" : "border-border"
    }`}
  >
    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const TestimonialCard = ({ name, role, avatar, rating, text }) => (
  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-4">
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-warning fill-warning" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
    <p className="text-sm text-muted-foreground italic leading-relaxed flex-1">
      "{text}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
        {avatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

const TrackerCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 flex gap-4">
    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-foreground mb-0.5">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
);

export function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: BookOpen,
      title: "Digital Khata Book",
      description:
        "Replace your traditional paper logbooks with a robust, searchable digital ledger. Access your accounts instantly from anywhere.",
      borderAccent: false,
    },
    {
      icon: BarChart3,
      title: "Customizable Layouts",
      description:
        "Customize entry tables, categories, and tags to fit your specific needs. Personalize headers to match your business workflows.",
      borderAccent: false,
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description:
        "Invite family members, business partners, or accountants to view, edit, and contribute to your books in real time.",
      borderAccent: true, // Red accent highlight
    },
    {
      icon: Receipt,
      title: "Quick & Bulk Entry",
      description:
        "Record single expenses or bulk transactions in seconds. Speed up your accounting with autocomplete fields.",
      borderAccent: false,
    },
    {
      icon: TrendingUp,
      title: "Interactive Reports",
      description:
        "Auto-generate beautiful visual reports, credit summaries, and tax charts. Export data as clean PDF or Excel files.",
      borderAccent: false,
    },
    {
      icon: PiggyBank,
      title: "Smart Budgeting",
      description:
        "Set monthly budget goals for different categories. Get alerts when you are close to reaching your limits.",
      borderAccent: false,
    },
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Retail Shop Owner, Delhi",
      avatar: "RS",
      rating: 5,
      text: "Cash Book has completely replaced my old notebook. Tracking customer credit and daily shop expenses is now a breeze. Extremely simple and clean UI.",
    },
    {
      name: "Priya Patel",
      role: "Freelance Developer, Bangalore",
      avatar: "PP",
      rating: 5,
      text: "I love the multi-platform sync. I track small business expenses on the web and household bills on my phone. The Excel export option is perfect for my accountant.",
    },
    {
      name: "Arjun Verma",
      role: "Agency Founder, Mumbai",
      avatar: "AV",
      rating: 5,
      text: "The collaboration feature is phenomenal. My team enters office expense requests, and I approve them in real-time. Absolute game changer.",
    },
  ];

  const trackCategories = [
    {
      icon: ShoppingCart,
      title: "Grocery Tracker",
      desc: "Log daily kitchen expenses, milk bills, and superstore purchases.",
    },
    {
      icon: Fuel,
      title: "Fuel & Transport",
      desc: "Track petrol, diesel, toll tax, and daily commute charges.",
    },
    {
      icon: Plane,
      title: "Travel Expenses",
      desc: "Manage budget, flights, hotel stays, and food during tours.",
    },
    {
      icon: Sparkles,
      title: "Shopping Ledger",
      desc: "Monitor clothing, electronics, gifts, and personal luxury spends.",
    },
    {
      icon: Lightbulb,
      title: "Electricity & Utilities",
      desc: "Keep history of power bills, water bills, gas cylinders, and Wi-Fi.",
    },
    {
      icon: HeartPulse,
      title: "Medical Log",
      desc: "Track pharmacy purchases, doctor fees, hospital bills, and insurance.",
    },
    {
      icon: HomeIcon,
      title: "Home Maintenance",
      desc: "Record rent payments, society maintenance, repairs, and maid salaries.",
    },
    {
      icon: Briefcase,
      title: "Business Ledger",
      desc: "Manage vendor credits, customer dues, office supplies, and petty cash.",
    },
    {
      icon: PiggyBank,
      title: "Savings & Invests",
      desc: "Log SIPs, gold purchases, recurring deposits, and mutual funds.",
    },
  ];

  return (
    <div className="w-full bg-background min-h-screen text-foreground">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Finance Management</span>
          </div>

          <h1 className="text-3xl md:text-3xl lg:text-3xl font-extrabold text-foreground leading-tight">
            Track and manage your finances with{" "}
            <span className="text-primary font-black">Cash Book</span>.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Eliminate paperwork and digital clutter. Cash Book offers a
            simplified digital ledger book to record, analyze, and coordinate
            your personal and business cash flows in real-time.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all text-sm md:text-base flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-muted hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all text-sm md:text-base"
            >
              Web Login
            </Link>
          </div>
        </div>

        {/* Right Dashboard Mockup */}
        <div className="relative">
          <div className="relative bg-card border border-border rounded-2xl shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden p-5 md:p-6">
            {/* Mockup Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-expense" />
                <span className="w-3 h-3 rounded-full bg-warning" />
                <span className="w-3 h-3 rounded-full bg-income" />
              </div>
              <div className="h-6 px-4 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                Cash Book
              </div>
            </div>

            {/* Mockup Balance row */}
            <div className="grid grid-cols-3 gap-3 py-6">
              {[
                {
                  title: "Total Income",
                  amount: "₹45,500",
                  color: "text-income",
                  bg: "bg-income-bg",
                },
                {
                  title: "Total Expense",
                  amount: "₹18,240",
                  color: "text-expense",
                  bg: "bg-expense-bg",
                },
                {
                  title: "Net Cash",
                  amount: "₹27,260",
                  color: "text-info",
                  bg: "bg-info-bg",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl ${card.bg} border border-border/50 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <p className="text-[10px] text-slate-700 dark:text-white/80 font-medium mb-1">
                    {card.title}
                  </p>
                  <p
                    className={`text-xs md:text-sm font-bold ${card.color} dark:text-white`}
                  >
                    {card.amount}
                  </p>
                </div>
              ))}
            </div>

            {/* Mockup Table */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Transactions
              </p>
              {[
                {
                  title: "Supermarket Purchase",
                  desc: "Grocery",
                  amt: "-₹2,340",
                  type: "expense",
                },
                {
                  title: "Freelance Project Deposit",
                  desc: "Income",
                  amt: "+₹12,500",
                  type: "income",
                },
                {
                  title: "Petrol Station",
                  desc: "Fuel & Travel",
                  amt: "-₹1,200",
                  type: "expense",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted rounded-xl hover:bg-card hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-primary/20 cursor-default"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {row.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {row.desc}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold ${row.type === "income" ? "text-income" : "text-expense"}`}
                  >
                    {row.amt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ("What We Do") ── */}
      <section className="py-12 px-4 md:px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US STORY ── */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
            degree. We designed this platform to offerKirana stores,
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
              className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── MULTIPLATFORM CARD ── */}
      <section className="py-10 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-8 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left side download options */}
            <div className="space-y-6">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                Multiplatform
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Manage Money Anytime, Anywhere.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Log entries via mobile apps on the go, or use the desktop web
                version to manage larger books at your desk. Everything stays
                synced instantly.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-muted text-foreground border border-border font-semibold rounded-xl text-xs flex items-center gap-2 hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                  <Download className="w-4 h-4 text-primary" />
                  Google Play Store
                </button>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-2 hover:opacity-95 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  Web Login
                </Link>
              </div>
            </div>

            {/* Right side bullet items */}
            <div className="space-y-5">
              {[
                {
                  title: "Real-Time Sync",
                  desc: "No manual backup required. All logs synchronize instantly to the secure cloud.",
                },
                {
                  title: "Smart PDF & Excel Exports",
                  desc: "Send complete transaction records directly to your CA or accountant.",
                },
                {
                  title: "Bank-Grade Encryption",
                  desc: "Data protection is our priority. Financial sheets stay private, encrypted, and isolated.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TRACKERS ── */}
      <section className="py-16 px-4 md:px-8 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              Track Anything, Easily
            </span>
            <h2 className="text-3xl md:text-3xl font-extrabold text-foreground">
              One Cash Book, Multiple Uses.
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Track business logs, domestic budgets, or temporary trip plans.
              Categorize your cash flow with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackCategories.map((item, i) => (
              <TrackerCard key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY SECTION (SNEPITECH CLONE) ── */}
      <SecuritySection />

      {/* ── EARTH SECTION (SNEPITECH CLONE) ── */}
      <EarthSection />

      {/* ── CLIENT TESTIMONIALS ── */}
      <Testimonials />

      {/* ── CONTACT SECTION ── */}
      <ContactSection />
    </div>
  );
}
