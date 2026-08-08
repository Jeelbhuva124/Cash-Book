import React, { useState, useRef } from "react";
import { Calendar, ArrowRight, Clock, Tag, TrendingUp, BookOpen, Search, ChevronRight, Sparkles, Eye } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "How to Build a Zero-Based Budget That Actually Works",
    category: "Budgeting",
    date: "Jul 20, 2026",
    readTime: "6 min read",
    views: "12.4k",
    excerpt:
      "Zero-based budgeting means every rupee has a purpose. Learn how to allocate income to expenses, savings, and investments so nothing goes unaccounted for at month-end.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
    featured: true,
    tags: ["Budget", "Savings", "Planning"],
  },
  {
    id: 2,
    title: "5 Strategies to Build an Emergency Fund in 2026",
    category: "Personal Finance",
    date: "Jul 10, 2026",
    readTime: "5 min read",
    views: "9.8k",
    excerpt:
      "Learn how to consistently save a portion of your income without drastically changing your lifestyle. A 3-month cushion can change everything during a financial crisis.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
    tags: ["Emergency Fund", "Savings"],
  },
  {
    id: 3,
    title: "How to Digitize Your Khata Book Seamlessly",
    category: "Business",
    date: "Jun 28, 2026",
    readTime: "7 min read",
    views: "15.2k",
    excerpt:
      "Transitioning from physical ledgers to a digital cash book can save hours of accounting. Here is a step-by-step guide for Kirana store owners and small businesses.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["Digital Ledger", "Business", "Khata"],
  },
  {
    id: 4,
    title: "Understanding Tax Deductions for Freelancers in India",
    category: "Taxation",
    date: "Jun 15, 2026",
    readTime: "8 min read",
    views: "7.3k",
    excerpt:
      "Maximize your returns by understanding exactly which expenses you can legally deduct as a freelancer — from home office to internet bills and professional subscriptions.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    tags: ["Tax", "Freelance", "India"],
  },
  {
    id: 5,
    title: "Cash vs. Digital: Why Tracking Both Matters More Than Ever",
    category: "Cash Management",
    date: "Jun 5, 2026",
    readTime: "4 min read",
    views: "6.1k",
    excerpt:
      "India is a cash-first economy — but UPI is changing that. See how mixing both in a single ledger gives you the clearest picture of your real financial position.",
    image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=800",
    tags: ["UPI", "Cash", "Digital India"],
  },
  {
    id: 6,
    title: "The 50/30/20 Rule: A Simple Framework for Indian Households",
    category: "Budgeting",
    date: "May 25, 2026",
    readTime: "5 min read",
    views: "11.5k",
    excerpt:
      "Allocate 50% to needs, 30% to wants, and 20% to savings. This globally proven framework adapts perfectly to Indian family budgets when used with a smart cash book.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    tags: ["Budgeting", "Family Finance"],
  },
  {
    id: 7,
    title: "GST for Small Business Owners: A Practical Guide",
    category: "Taxation",
    date: "May 12, 2026",
    readTime: "10 min read",
    views: "18.9k",
    excerpt:
      "GST compliance can seem overwhelming, but with the right bookkeeping habits, it becomes routine. This guide breaks down input credits, GSTR-1, and how to use your cash book to stay ready.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    tags: ["GST", "SME", "Taxation"],
  },
  {
    id: 8,
    title: "How Real-Time Cash Flow Analytics Predict Business Health",
    category: "Analytics",
    date: "Apr 30, 2026",
    readTime: "6 min read",
    views: "5.7k",
    excerpt:
      "Lagging indicators tell you what happened. Real-time cash flow gives you a live pulse of your business. Learn what metrics matter most for growth-stage businesses.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["Analytics", "Cash Flow", "Business"],
  },
];

const categories = ["All", "Budgeting", "Personal Finance", "Business", "Taxation", "Cash Management", "Analytics"];

const categoryColors = {
  Budgeting: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Personal Finance": "bg-primary/10 text-primary border-primary/20",
  Business: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Taxation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Cash Management": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Analytics: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const FeaturedPost = ({ post }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className="group relative rounded-3xl overflow-hidden cursor-pointer bg-card border border-border/50 shadow-2xl shadow-black/30">
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase backdrop-blur-sm shadow-lg shadow-primary/40">
          <Sparkles className="w-3 h-3" /> Featured
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
              <Eye className="w-3.5 h-3.5" /> {post.views}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-primary/90 transition-colors duration-300">
            {post.title}
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 max-w-2xl line-clamp-2">
            {post.excerpt}
          </p>
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-bold hover:bg-primary hover:border-primary transition-all duration-300 group/btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Read Article
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const PostCard = ({ post, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.article
      ref={ref}
      style={{ scale, opacity, y }}
      className="group flex flex-col bg-card/80 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 active:scale-[0.98] transition-all duration-400 cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${categoryColors[post.category] || "bg-muted/90 text-muted-foreground"}`}>
          {post.category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold mb-3 flex-wrap">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-primary mt-auto group-hover:gap-3 transition-all">
          <BookOpen className="w-4 h-4" />
          Read Article
          <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
};

export const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const featuredPost = posts.find((p) => p.featured);
  const filteredPosts = posts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return !p.featured && matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-28 pb-20 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/8 blur-[120px] rounded-full" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Cash Book Insights
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]"
          >
            Smarter Money,{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Clearer Thinking
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Expert guides on budgeting, taxation, and digital ledger management — written for Indian businesses and households.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border/60 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURED ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full mb-16">
        {featuredPost && <FeaturedPost post={featuredPost} />}
      </section>

      {/* ── CATEGORY FILTERS ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-28">
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {filteredPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 text-muted-foreground"
            >
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold">No articles found</p>
              <p className="text-sm mt-1">Try a different search or category.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">You've seen all articles. More coming soon!</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary hover:text-primary-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
          >
            Suggest a Topic <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
