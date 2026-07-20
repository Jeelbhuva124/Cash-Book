import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Blog = () => {
  const posts = [
    {
      title: "5 Strategies to Build an Emergency Fund in 2026",
      category: "Personal Finance",
      date: "Jul 10, 2026",
      excerpt:
        "Learn how to consistently save a portion of your income without drastically changing your lifestyle...",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "How to Digitize Your Khata Book Seamlessly",
      category: "Business",
      date: "Jun 28, 2026",
      excerpt:
        "Transitioning from physical ledgers to a digital cash book can save hours of accounting. Here is a step-by-step guide...",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Understanding Tax Deductions for Freelancers",
      category: "Taxation",
      date: "Jun 15, 2026",
      excerpt:
        "Maximize your returns by understanding exactly which expenses you can legally deduct as a freelancer...",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      <section className="py-12 px-4 text-center max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-3xl font-black tracking-tight text-foreground mb-6"
        >
          Insights for <span className="text-primary">Financial Growth</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          Read the latest articles, guides, and tips from our team of finance
          experts to stay ahead of your money.
        </motion.p>
      </section>

      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-lg shadow-background hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-3">
                    <Calendar className="w-3.5 h-3.5" /> {post.date}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-primary">
                    Read Article{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
