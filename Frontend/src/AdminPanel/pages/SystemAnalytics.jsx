import React from 'react';
import { BarChart3, TrendingUp, Zap, Globe, Smartphone, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemAnalytics = () => {
  const categoryBreakdown = [
    { label: "Kirana & Grocery", percentage: 38, color: "bg-primary" },
    { label: "Business & Vendor Dues", percentage: 26, color: "bg-emerald-500" },
    { label: "Fuel & Transport", percentage: 18, color: "bg-amber-500" },
    { label: "Travel & Hospitality", percentage: 10, color: "bg-sky-500" },
    { label: "Utilities & Personal", percentage: 8, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">System Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep dive into transaction distribution, API performance, and platform adoption.</p>
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Avg API Latency</p>
            <h3 className="text-2xl font-black text-foreground">42 ms</h3>
            <span className="text-xs font-bold text-emerald-500">+12% faster than last week</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Mobile Web Usage</p>
            <h3 className="text-2xl font-black text-foreground">68.4%</h3>
            <span className="text-xs font-bold text-muted-foreground">Mobile first users</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-500">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Daily DB Writes</p>
            <h3 className="text-2xl font-black text-foreground">1.42 M</h3>
            <span className="text-xs font-bold text-emerald-500">Zero query deadlocks</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Transaction Distribution by Category</h3>
          <p className="text-xs text-muted-foreground">Volume breakdown across all user Khatas</p>
        </div>

        <div className="space-y-4">
          {categoryBreakdown.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">{cat.label}</span>
                <span className="text-muted-foreground">{cat.percentage}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`h-full ${cat.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
