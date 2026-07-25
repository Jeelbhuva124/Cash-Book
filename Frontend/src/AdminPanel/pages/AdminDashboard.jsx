import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  UserCheck, 
  AlertCircle,
  Database,
  Cpu
} from 'lucide-react';
import { AdminStatCard } from '../components/AdminStatCard';

export const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "24,890", change: "+14.2%", isIncrease: true, icon: Users, colorAccent: "primary", description: "vs last month" },
    { title: "Active Cashbooks", value: "18,420", change: "+8.7%", isIncrease: true, icon: BookOpen, colorAccent: "success", description: "across all accounts" },
    { title: "Transaction Volume", value: "₹4.82 Cr", change: "+22.4%", isIncrease: true, icon: TrendingUp, colorAccent: "warning", description: "processed this month" },
    { title: "System Uptime", value: "99.98%", change: "Stable", isIncrease: true, icon: ShieldCheck, colorAccent: "info", description: "0 critical incidents" },
  ];

  const recentLogs = [
    { id: 1, user: "Rahul Sharma", action: "Created Cashbook 'Kirana Store Log'", ip: "103.24.12.89", status: "success", time: "2 mins ago" },
    { id: 2, user: "Priya Patel", action: "Exported PDF Ledger Report", ip: "49.207.54.12", status: "success", time: "10 mins ago" },
    { id: 3, user: "Admin Root", action: "Updated SMTP Configuration", ip: "182.73.4.10", status: "warning", time: "24 mins ago" },
    { id: 4, user: "Arjun Verma", action: "Added Member 'arjun@team.com'", ip: "103.50.160.4", status: "success", time: "45 mins ago" },
    { id: 5, user: "System Auto", action: "Database Indexing Completed", ip: "Internal", status: "info", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Admin Overview</h1>
          <p className="text-sm text-muted-foreground">Monitor system activity, user growth, and core performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Metrics Active
          </span>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <AdminStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts & System Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Chart Placeholder Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">User Registration & Activity Growth</h3>
              <p className="text-xs text-muted-foreground">Daily user onboardings over the last 30 days</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              +1,240 New Users
            </span>
          </div>

          <div className="h-56 w-full bg-muted/40 rounded-xl border border-dashed border-border flex items-end justify-between p-4 gap-2">
            {[40, 65, 55, 80, 95, 70, 85, 100, 90, 110, 125, 140, 130, 150].map((h, idx) => (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${h / 1.6}%` }}
                transition={{ duration: 0.6, delay: idx * 0.04 }}
                className="flex-1 bg-gradient-to-t from-primary/40 to-primary rounded-t-md hover:opacity-80 transition-opacity"
                title={`Day ${idx + 1}: ${h * 10} active entries`}
              />
            ))}
          </div>
        </div>

        {/* Server & DB Diagnostics Widget */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-lg font-bold text-foreground">Server Diagnostics</h3>
            <Activity className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-500" /> CPU Load
                </span>
                <span className="text-foreground">24.5%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 w-[24.5%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> RAM Memory
                </span>
                <span className="text-foreground">4.2 GB / 8.0 GB (52.5%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[52.5%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-500" /> Database Storage
                </span>
                <span className="text-foreground">18.4 GB / 100 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[18.4%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Audit Logs Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Audit Trail</h3>
            <p className="text-xs text-muted-foreground">Real-time administrator & system audit event log</p>
          </div>
          <span className="text-xs font-bold text-primary cursor-pointer hover:underline">
            View Full Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-bold text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Action Activity</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-bold text-foreground">{log.user}</td>
                  <td className="p-4 text-muted-foreground">{log.action}</td>
                  <td className="p-4 text-xs font-mono text-muted-foreground">{log.ip}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
