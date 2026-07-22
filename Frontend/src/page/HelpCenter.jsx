import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Book,
  Shield,
  Zap,
  CreditCard,
  Settings,
  Users,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Getting Started",
    description:
      "Learn the basics and set up your Cash Book account in minutes.",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    articles: 12,
  },
  {
    title: "Account & Security",
    description: "Manage your profile, password, and security settings.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    articles: 8,
  },
  {
    title: "Billing & Plans",
    description:
      "Understand our pricing, premium features, and payment methods.",
    icon: CreditCard,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    articles: 5,
  },
  {
    title: "Transactions",
    description:
      "Everything you need to know about recording and managing entries.",
    icon: Book,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    articles: 15,
  },
  {
    title: "Reports & Analytics",
    description:
      "How to generate, download, and interpret your financial reports.",
    icon: FileText,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    articles: 9,
  },
  {
    title: "Team & Multi-User",
    description:
      "Collaborate with your team, assign roles, and manage permissions.",
    icon: Users,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    articles: 6,
  },
];

export const HelpCenter = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      {/* Hero Section with Search */}
      <section className="py-16 px-4 text-center bg-card border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-3xl font-black tracking-tight text-foreground mb-6"
          >
            How can we <span className="text-primary">help you?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed mb-10"
          >
            Search our knowledge base or browse categories below to find exactly
            what you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search for articles, guides, and tutorials..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-lg shadow-black/5 transition-all text-base"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-4 flex-grow">
        <div className="w-full sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">
              Browse Topics
            </h2>
            <p className="text-muted-foreground mt-4">
              Explore our comprehensive guides to master Cash Book.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                <div
                  className={`w-14 h-14 rounded-2xl ${category.bg} ${category.color} flex items-center justify-center mb-6`}
                >
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {category.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-muted-foreground bg-background px-3 py-1 rounded-full border border-border">
                    {category.articles} articles
                  </span>
                  <span className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View All →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-16 bg-card border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-8">
            Our support team is always ready to help you with any issues.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-background border border-border text-foreground font-bold hover:bg-muted transition-colors"
            >
              Read FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

