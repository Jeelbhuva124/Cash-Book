import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, TrendingUp, Users, Shield, Smartphone, BarChart3,
  ChevronRight, Star, Check, ArrowRight, Wallet, PiggyBank,
  Receipt, Bell, Share2, Download, Zap, Globe, Play, CheckCircle,
  SmartphoneIcon, Lock, Landmark, FileSpreadsheet, PlusCircle, CheckSquare,
  Sparkles, Fuel, ShoppingCart, Lightbulb, HeartPulse, Plane, Home as HomeIcon, Briefcase
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, borderAccent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
      borderAccent ? 'border-rose-500 border-2' : 'border-slate-100'
    }`}
  >
    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, avatar, rating, text }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
    <p className="text-sm text-slate-600 italic leading-relaxed flex-1">"{text}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
        {avatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{name}</p>
        <p className="text-xs text-slate-500">{role}</p>
      </div>
    </div>
  </div>
);

const TrackerCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex gap-4">
    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-primary flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-800 mb-0.5">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: BookOpen,
      title: "Digital Khata Book",
      description: "Replace your traditional paper logbooks with a robust, searchable digital ledger. Access your accounts instantly from anywhere.",
      borderAccent: false
    },
    {
      icon: BarChart3,
      title: "Customizable Layouts",
      description: "Customize entry tables, categories, and tags to fit your specific needs. Personalize headers to match your business workflows.",
      borderAccent: false
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description: "Invite family members, business partners, or accountants to view, edit, and contribute to your books in real time.",
      borderAccent: true // Red accent highlight
    },
    {
      icon: Receipt,
      title: "Quick & Bulk Entry",
      description: "Record single expenses or bulk transactions in seconds. Speed up your accounting with autocomplete fields.",
      borderAccent: false
    },
    {
      icon: TrendingUp,
      title: "Interactive Reports",
      description: "Auto-generate beautiful visual reports, credit summaries, and tax charts. Export data as clean PDF or Excel files.",
      borderAccent: false
    },
    {
      icon: PiggyBank,
      title: "Smart Budgeting",
      description: "Set monthly budget goals for different categories. Get alerts when you are close to reaching your limits.",
      borderAccent: false
    }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Retail Shop Owner, Delhi",
      avatar: "RS",
      rating: 5,
      text: "Daily Chalan has completely replaced my old notebook. Tracking customer credit and daily shop expenses is now a breeze. Extremely simple and clean UI."
    },
    {
      name: "Priya Patel",
      role: "Freelance Developer, Bangalore",
      avatar: "PP",
      rating: 5,
      text: "I love the multi-platform sync. I track small business expenses on the web and household bills on my phone. The Excel export option is perfect for my accountant."
    },
    {
      name: "Arjun Verma",
      role: "Agency Founder, Mumbai",
      avatar: "AV",
      rating: 5,
      text: "The collaboration feature is phenomenal. My team enters office expense requests, and I approve them in real-time. Absolute game changer."
    }
  ];

  const trackCategories = [
    { icon: ShoppingCart, title: "Grocery Tracker", desc: "Log daily kitchen expenses, milk bills, and superstore purchases." },
    { icon: Fuel, title: "Fuel & Transport", desc: "Track petrol, diesel, toll tax, and daily commute charges." },
    { icon: Plane, title: "Travel Expenses", desc: "Manage budget, flights, hotel stays, and food during tours." },
    { icon: Sparkles, title: "Shopping Ledger", desc: "Monitor clothing, electronics, gifts, and personal luxury spends." },
    { icon: Lightbulb, title: "Electricity & Utilities", desc: "Keep history of power bills, water bills, gas cylinders, and Wi-Fi." },
    { icon: HeartPulse, title: "Medical Log", desc: "Track pharmacy purchases, doctor fees, hospital bills, and insurance." },
    { icon: HomeIcon, title: "Home Maintenance", desc: "Record rent payments, society maintenance, repairs, and maid salaries." },
    { icon: Briefcase, title: "Business Ledger", desc: "Manage vendor credits, customer dues, office supplies, and petty cash." },
    { icon: PiggyBank, title: "Savings & Invests", desc: "Log SIPs, gold purchases, recurring deposits, and mutual funds." }
  ];

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen text-slate-800">

      {/* ── HERO SECTION ── */}
      <section className="relative pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Finance Management</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Track and manage your finances with <span className="text-primary font-black">Daily Chalan</span>.
          </h1>

          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Eliminate paperwork and digital clutter. Daily Chalan offers a simplified digital ledger book to record, analyze, and coordinate your personal and business cash flows in real-time.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 shadow-lg shadow-primary/20 transition-all text-sm md:text-base flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm md:text-base"
            >
              Web Login
            </Link>
          </div>
        </div>

        {/* Right Dashboard Mockup */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-[32px] transform rotate-3 blur-sm" />
          <div className="relative bg-white border border-slate-100 rounded-[24px] shadow-2xl overflow-hidden p-5 md:p-6">
            
            {/* Mockup Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="h-6 w-32 bg-slate-100 rounded-full" />
            </div>

            {/* Mockup Balance row */}
            <div className="grid grid-cols-3 gap-3 py-6">
              {[
                { title: "Total Income", amount: "₹45,500", color: "text-emerald-600", bg: "bg-emerald-50" },
                { title: "Total Expense", amount: "₹18,240", color: "text-rose-600", bg: "bg-rose-50" },
                { title: "Net Cash", amount: "₹27,260", color: "text-blue-600", bg: "bg-blue-50" }
              ].map((card, i) => (
                <div key={i} className={`p-3 rounded-xl ${card.bg} border border-slate-50`}>
                  <p className="text-[10px] text-slate-500 font-medium mb-1">{card.title}</p>
                  <p className={`text-xs md:text-sm font-bold ${card.color}`}>{card.amount}</p>
                </div>
              ))}
            </div>

            {/* Mockup Table */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Transactions</p>
              {[
                { title: "Supermarket Purchase", desc: "Grocery", amt: "-₹2,340", type: "expense" },
                { title: "Freelance Project Deposit", desc: "Income", amt: "+₹12,500", type: "income" },
                { title: "Petrol Station", desc: "Fuel & Travel", amt: "-₹1,200", type: "expense" }
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{row.title}</p>
                    <p className="text-[10px] text-slate-400">{row.desc}</p>
                  </div>
                  <span className={`text-xs font-bold ${row.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {row.amt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ("What We Do") ── */}
      <section className="py-20 px-4 md:px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Smart tools for absolute financial clarity.
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              No spreadsheets, no complicated accounting language. Just speed, security, and absolute coordination.
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
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side Illustration */}
        <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200/40 relative">
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Auto Backup Completed</p>
                <p className="text-xs text-slate-400">Sync status: Active</p>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary" />
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-6">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Who We Are</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            About Us – Our Story
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Daily Chalan started with a simple belief: tracking where your money goes shouldn't require complex spreadsheet skills or a finance degree. We designed this platform to offerKirana stores, freelancers, families, and growing businesses a frictionless way to manage ledger logs digital accounts.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Highly optimized for speed & fast entries",
              "Works natively offline with offline persistence storage",
              "Secured with advanced industry-grade ledger encryption",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-700 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link to="/about" className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline">
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MULTIPLATFORM CARD ── */}
      <section className="py-10 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#0c2a1a] to-[#123e27] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left side download options */}
            <div className="space-y-6">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">Multiplatform</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Manage Money Anytime, Anywhere.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Log entries via mobile apps on the go, or use the desktop web version to manage larger books at your desk. Everything stays synced instantly.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors">
                  <Download className="w-4 h-4 text-primary" />
                  Google Play Store
                </button>
                <Link to="/login" className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-xs flex items-center gap-2 hover:opacity-95 transition-opacity">
                  <Globe className="w-4 h-4" />
                  Web Login
                </Link>
              </div>
            </div>

            {/* Right side bullet items */}
            <div className="space-y-5">
              {[
                { title: "Real-Time Sync", desc: "No manual backup required. All logs synchronize instantly to the secure cloud." },
                { title: "Smart PDF & Excel Exports", desc: "Send complete transaction records directly to your CA or accountant." },
                { title: "Bank-Grade Encryption", desc: "Data protection is our priority. Financial sheets stay private, encrypted, and isolated." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-white/60 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TRACKERS ── */}
      <section className="py-24 px-4 md:px-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Track Anything, Easily</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              One Cash Book, Multiple Uses.
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Track business logs, domestic budgets, or temporary trip plans. Categorize your cash flow with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackCategories.map((item, i) => (
              <TrackerCard key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT TESTIMONIALS ── */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Loved by Users</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            What Our Clients Say
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Discover how thousands of business owners and individuals use Daily Chalan to stay financially disciplined.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </section>

    </div>
  );
}
