import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, Globe, Smartphone, Server, Users, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/admin/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch system analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallbacks if data is missing
  const categoryBreakdown = stats?.categoryBreakdown || [
    { label: "No Data", percentage: 0, color: "bg-muted" }
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
            <h3 className="text-2xl font-black text-foreground">{stats?.api_latency_ms || 42} ms</h3>
            <span className="text-xs font-bold text-emerald-500">System Uptime: {stats?.system_uptime || '99.9%'}</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Trx Volume</p>
            <h3 className="text-2xl font-black text-foreground">{formatCurrency(stats?.total_volume)}</h3>
            <span className="text-xs font-bold text-muted-foreground">Across {stats?.total_cashbooks || 0} cashbooks</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Users</p>
            <h3 className="text-2xl font-black text-foreground">{stats?.total_users || 0}</h3>
            <span className="text-xs font-bold text-emerald-500">{stats?.active_users || 0} Active Accounts</span>
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
