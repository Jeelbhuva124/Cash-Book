import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Database,
  Cpu,
  UserPlus,
  Zap,
  Wallet
} from 'lucide-react';
import { AdminStatCard } from '../components/AdminStatCard';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [realStats, setRealStats] = useState({
    total_users: 0,
    active_cashbooks: 0,
    total_volume: 0,
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    total_transactions: 0,
    today_income: 0,
    today_expense: 0,
    today_volume: 0,
    today_transactions: 0,
    system_uptime: "99.98%",
    uptime_formatted: "Online",
    growthChartData: [],
    newUsersLast14Days: 0,
    serverDiagnostics: {
      ram: { used: '4.2', total: '8.0', percent: '52.5' },
      cpu: '24.5',
      dbStorageGB: '18.4'
    }
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [chartDays, setChartDays] = useState([]);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return 'Recently';
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let adminId = '';
        try {
          const raw = localStorage.getItem('cashbook_admin_user') || sessionStorage.getItem('cashbook_admin_user');
          if (raw) {
            const parsed = JSON.parse(raw);
            const adminObj = Array.isArray(parsed) ? parsed[0] : parsed;
            adminId = (adminObj?.id || adminObj?._id || adminObj?.admin_id || '').toString().trim();
          }
        } catch (e) { }

        let res;
        try {
          res = await fetch('http://localhost:5001/api/admin/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_id: adminId })
          });
        } catch (e) { }

        if (!res || !res.ok) {
          res = await fetch('http://localhost:5001/api/admin/stats');
        }

        if (res && res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const d = data.data;

            // Generate 14 days chart data
            const growth = Array.isArray(d.growthChartData) ? d.growthChartData : [];
            const chartDaysArr = [];
            for (let i = 13; i >= 0; i--) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const shortDate = date.toLocaleDateString('en-US', { day: 'numeric' });
              const idx = 13 - i;
              chartDaysArr.push({
                label,
                shortDate,
                count: growth[idx] !== undefined ? growth[idx] : 0
              });
            }
            setChartDays(chartDaysArr);

            setRealStats({
              total_users: d.total_users || 0,
              active_cashbooks: d.total_cashbooks || 0,
              total_volume: d.total_volume || 0,
              total_income: d.total_income || 0,
              total_expense: d.total_expense || 0,
              net_balance: d.net_balance || 0,
              total_transactions: d.total_transactions || 0,
              today_income: d.today_income || 0,
              today_expense: d.today_expense || 0,
              today_volume: d.today_volume || 0,
              today_transactions: d.today_transactions || 0,
              system_uptime: d.system_uptime || "99.98%",
              uptime_formatted: d.uptime_formatted || "Online",
              growthChartData: growth,
              newUsersLast14Days: d.newUsersLast14Days || 0,
              serverDiagnostics: d.serverDiagnostics || {
                ram: { used: '4.2', total: '8.0', percent: '52.5' },
                cpu: '24.5',
                dbStorageGB: '18.4'
              }
            });

            if (Array.isArray(d.recentLogs)) {
              setRecentLogs(d.recentLogs);
            }
            if (Array.isArray(d.recent_users)) {
              setRecentUsers(d.recent_users);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    fetchStats();
    // Refresh periodically
    const intervalId = setInterval(fetchStats, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)} K`;
    return `${sign}₹${abs.toLocaleString('en-IN')}`;
  };

  const formatFullRupees = (amount) => {
    const num = Number(amount) || 0;
    const sign = num < 0 ? '-' : '';
    return `${sign}₹${Math.abs(num).toLocaleString('en-IN')}`;
  };

  const stats = [
    {
      title: "Total Users",
      value: realStats.total_users.toLocaleString(),
      change: `+${realStats.newUsersLast14Days} new`,
      isIncrease: true,
      icon: Users,
      colorAccent: "primary",
      description: "registered accounts",
      path: "/admin/users"
    },
    {
      title: "Active Cashbooks",
      value: realStats.active_cashbooks.toLocaleString(),
      change: "Active",
      isIncrease: true,
      icon: BookOpen,
      colorAccent: "info",
      description: "across all accounts",
      path: "/admin/cashbooks"
    },
    {
      title: "Transaction Volume",
      value: formatCurrency(realStats.total_volume),
      change: `${realStats.total_transactions} txs`,
      isIncrease: true,
      icon: TrendingUp,
      colorAccent: "warning",
      description: formatFullRupees(realStats.total_volume),
      path: "/admin/transactions"
    },
    {
      title: "System Net Balance",
      value: formatCurrency(realStats.net_balance),
      change: realStats.net_balance >= 0 ? "Surplus" : "Deficit",
      isIncrease: realStats.net_balance >= 0,
      icon: ShieldCheck,
      colorAccent: realStats.net_balance >= 0 ? "success" : "danger",
      description: formatFullRupees(realStats.net_balance),
      path: "/admin/analytics"
    },
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
          <AdminStatCard
            key={i}
            {...stat}
            onClick={() => {
              if (stat.path) navigate(stat.path);
            }}
          />
        ))}
      </div>

      {/* Executive Financial Inflow & Outflow Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cash In */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Cash In (Inflow)</span>
            <p className="text-lg font-black text-emerald-500 tracking-tight">
              +{formatFullRupees(realStats.total_income)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {formatCurrency(realStats.total_income)} total credited
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Total Cash Out */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Cash Out (Outflow)</span>
            <p className="text-lg font-black text-rose-500 tracking-tight">
              -{formatFullRupees(realStats.total_expense)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {formatCurrency(realStats.total_expense)} total debited
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Activity */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Today's Turnover</span>
            <p className="text-lg font-black text-amber-500 tracking-tight">
              {formatFullRupees(realStats.today_volume)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {realStats.today_transactions} transactions logged today
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* System Diagnostics Uptime */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Server Health</span>
            <p className="text-lg font-black text-sky-500 tracking-tight">
              {realStats.system_uptime}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Uptime: {realStats.uptime_formatted} • 0 Incidents
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts & System Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Chart Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">User Registration & Activity Growth</h3>
              <p className="text-xs text-muted-foreground">Daily user onboardings over the last 14 days</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              +{realStats.newUsersLast14Days.toLocaleString()} New Users
            </span>
          </div>

          <div className="h-56 w-full bg-muted/20 rounded-xl border border-border flex items-end justify-between p-4 gap-2">
            {chartDays.map((item, idx) => {
              const maxH = Math.max(...chartDays.map(d => d.count), 5);
              const heightPercent = item.count > 0 ? Math.max((item.count / maxH) * 100, 16) : 5;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 bg-foreground text-background text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                    {item.label}: {item.count} {item.count === 1 ? 'user' : 'users'}
                  </div>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.025 }}
                    className={`w-full rounded-t-md transition-all ${item.count > 0
                        ? 'bg-gradient-to-t from-primary to-primary/80 shadow-sm shadow-primary/30 group-hover:brightness-110 ring-2 ring-primary/20'
                        : 'bg-muted/40 hover:bg-muted/70'
                      }`}
                  />
                  <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">
                    {idx === chartDays.length - 1 ? 'Today' : idx === 0 ? '14d' : idx % 3 === 0 ? item.shortDate : ''}
                  </span>
                </div>
              );
            })}
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
                <span className="text-foreground">{realStats.serverDiagnostics.cpu}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${realStats.serverDiagnostics.cpu}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> RAM Memory
                </span>
                <span className="text-foreground">{realStats.serverDiagnostics.ram.used} GB / {realStats.serverDiagnostics.ram.total} GB ({realStats.serverDiagnostics.ram.percent}%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${realStats.serverDiagnostics.ram.percent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-500" /> Database Storage
                </span>
                <span className="text-foreground">{realStats.serverDiagnostics.dbStorageGB} GB / 100 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min((realStats.serverDiagnostics.dbStorageGB / 100) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Registered Users (New Onboardings) */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Recently Registered Users</h3>
              <p className="text-xs text-muted-foreground">Latest user accounts onboarded into Cash-Book</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-xs font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20"
          >
            <span>Manage All Users</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {recentUsers.map((u) => {
              const uRole = u.user_role || (u.is_admin ? 'admin' : 'user');
              const uStatus = u.account_status || 'active';
              return (
                <div
                  key={u.id || u._id}
                  onClick={() => navigate('/admin/users')}
                  className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-border shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center uppercase shrink-0 border border-primary/20 shadow-xs">
                        {(u.username || u.email_id || 'U').substring(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                        {u.username || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{u.email_id || u.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {formatTimeAgo(u.created_at || u.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${uStatus === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                      {uStatus}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-0.5 bg-muted rounded-md border border-border">
                      {uRole}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No recently registered users found.
          </div>
        )}
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
