import React, { useRef } from "react";
import {
  Wallet, PieChart, Bell, FileText, ArrowRight, Shield,
  CloudUpload, Download, Repeat, Zap, Lock, Users, CheckCircle,
  BarChart3, Receipt, ScanLine, BellRing, Layers, Star, Sparkles
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Wallet,
    title: "Expense Tracking",
    desc: "Log daily expenses in seconds with smart category tagging. Get an instant breakdown of where every rupee goes — groceries, travel, bills, and more.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20 hover:border-rose-500/50",
    glow: "hover:shadow-rose-500/15",
    points: ["Instant entry with voice & keyboard input", "50+ smart categories", "Daily/weekly/monthly summaries"],
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Visualize your financial health with interactive charts and live dashboards. Spot trends, predict shortfalls, and make smarter decisions before problems arise.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20 hover:border-primary/50",
    glow: "hover:shadow-primary/15",
    points: ["Income vs. expense trends", "Cash flow forecasting", "Profit/loss at a glance"],
  },
  {
    icon: Receipt,
    title: "Digital Khata Book",
    desc: "Replace your physical ledger with a smarter digital version. Designed specifically for Kirana stores, freelancers, and small businesses across India.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    glow: "hover:shadow-emerald-500/15",
    points: ["Party-wise ledger management", "Debit & credit entries", "Balance due alerts"],
  },
  {
    icon: CloudUpload,
    title: "Cloud Sync & Backup",
    desc: "Your data is automatically backed up to the cloud in real-time. Access your books from any device, anywhere — even when switching phones.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20 hover:border-sky-500/50",
    glow: "hover:shadow-sky-500/15",
    points: ["Automatic real-time sync", "Multi-device access", "Never lose a single entry"],
  },
  {
    icon: FileText,
    title: "PDF Report Generation",
    desc: "Generate clean, professional financial reports in one click. Ready for CA review, client sharing, or tax filing — with your branding and logo.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20 hover:border-amber-500/50",
    glow: "hover:shadow-amber-500/15",
    points: ["Fully branded PDF exports", "GST-ready summaries", "Date-range filtering"],
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Never miss a due date again. Set recurring reminders for bill payments, loan EMIs, subscription renewals, and custom financial goals.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20 hover:border-purple-500/50",
    glow: "hover:shadow-purple-500/15",
    points: ["Bill & EMI due alerts", "Goal milestone nudges", "Weekly spending digest"],
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    desc: "Your financial data is protected with AES-256 encryption, secure HTTPS connections, and optional biometric lock on the app.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20 hover:border-indigo-500/50",
    glow: "hover:shadow-indigo-500/15",
    points: ["AES-256 encryption at rest", "Zero knowledge architecture", "Biometric app lock"],
  },
  {
    icon: Users,
    title: "Multi-User Collaboration",
    desc: "Invite partners, accountants, or family members to view or co-manage your cash books. Control who can view, edit, or export with role-based permissions.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20 hover:border-teal-500/50",
    glow: "hover:shadow-teal-500/15",
    points: ["Invite up to 5 collaborators", "Granular permission controls", "Real-time co-editing"],
  },
];

const stats = [
  { value: "2M+", label: "Transactions Logged" },
  { value: "50k+", label: "Active Users" },
  { value: "₹500Cr+", label: "Money Tracked" },
  { value: "4.9★", label: "Average Rating" },
];

const ServiceCard = ({ service, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y }}
      className={`group relative p-7 bg-card/80 backdrop-blur-md border rounded-3xl shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all duration-400 overflow-hidden ${service.border} ${service.glow}`}
    >
      {/* Gradient corner glow */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${service.bg}`} />

      {/* Icon */}
      <motion.div
        className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center ${service.color} mb-6 relative z-10`}
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <service.icon className="w-7 h-7" />
      </motion.div>

      <h3 className="text-xl font-extrabold text-foreground mb-3 relative z-10">{service.title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-6 text-sm relative z-10">{service.desc}</p>

      <ul className="space-y-2.5 mb-7 relative z-10">
        {service.points.map((pt, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 100 }}
            className="flex items-start gap-2.5 text-sm text-foreground/80 font-medium"
          >
            <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${service.color}`} />
            {pt}
          </motion.li>
        ))}
      </ul>

      <Link
        to="/signup"
        className={`inline-flex items-center gap-2 text-sm font-bold ${service.color} hover:gap-3 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all relative z-10`}
      >
        Get Started <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
};

export const Services = () => {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-28 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/8 blur-[120px] rounded-full" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/5 blur-[80px] rounded-full" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" /> Everything You Need
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]"
          >
            Powerful Tools to{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Manage Wealth
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Cash Book gives you a complete financial operating system. From digital khata books to PDF reports — one app, total control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="px-7 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-95 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all flex items-center gap-2 group"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 border border-border bg-card/80 backdrop-blur-md text-foreground font-bold rounded-xl hover:border-primary/40 hover:-translate-y-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-sm"
            >
              Talk to Sales
            </Link>
          </motion.div>
        </motion.div>
      </section>


      {/* ── SERVICES GRID ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14 space-y-3"
        >
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Our Suite</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            8 tools. One cashbook. <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Total control.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every feature is purpose-built for the Indian market — from Kirana owners to corporate accountants.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full pb-28 mt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-indigo-500/5 to-purple-500/10 backdrop-blur-md p-10 md:p-16 text-center"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase">
              <Star className="w-3.5 h-3.5 fill-primary" /> Free Forever Plan Available
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-foreground">
              Ready to take control of your finances?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Join 50,000+ users who trust Cash Book for their daily financial management. No credit card required.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-95 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-base"
            >
              Get Started — It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
