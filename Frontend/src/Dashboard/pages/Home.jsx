import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Trash2, Download, TrendingUp, PiggyBank,
  Receipt, Wallet, BarChart3, ArrowUpRight, ArrowDownRight,
  Filter, Calendar, DollarSign, CreditCard, Sparkles, CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Standard categories matching Landing Page trackers
const CATEGORIES = [
  "Grocery",
  "Fuel & Transport",
  "Travel",
  "Shopping",
  "Electricity & Utilities",
  "Medical & Healthcare",
  "Home Maintenance",
  "Business & Work",
  "Savings & Invests"
];

export default function Home() {
  const { addToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense'); // income, expense
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Load user session
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const username = user?.username || "Guest User";
  const firstName = username.split(' ')[0];

  // Local storage transactions storage key specific to the logged-in user email
  const storageKey = `cashbook_txs_${user?.email_id || 'guest'}`;

  // Transactions State
  const [transactions, setTransactions] = useState([]);

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed default transactions for a premium first impression
      const initialSeed = [
        { id: '1', title: 'Salary Credit', type: 'income', category: 'Business & Work', amount: 45000, date: '2026-07-01' },
        { id: '2', title: 'Supermarket Groceries', type: 'expense', category: 'Grocery', amount: 2340, date: '2026-07-10' },
        { id: '3', title: 'Petrol refuel', type: 'expense', category: 'Fuel & Transport', amount: 1200, date: '2026-07-12' },
        { id: '4', title: 'Freelance Design Payment', type: 'income', category: 'Business & Work', amount: 12500, date: '2026-07-13' }
      ];
      setTransactions(initialSeed);
      localStorage.setItem(storageKey, JSON.stringify(initialSeed));
    }
  }, [storageKey]);

  // Save transactions helper
  const saveTransactions = (newTxs) => {
    setTransactions(newTxs);
    localStorage.setItem(storageKey, JSON.stringify(newTxs));
  };

  // Add transaction submit
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      addToast("Please fill valid fields", "warning");
      return;
    }

    const newTx = {
      id: Date.now().toString(),
      title: title.trim(),
      type,
      category,
      amount: parseFloat(amount),
      date
    };

    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    addToast("Transaction added successfully!", "success");

    // Reset Form
    setTitle('');
    setAmount('');
    setCategory(CATEGORIES[0]);
    setShowAddForm(false);
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    saveTransactions(updated);
    addToast("Transaction deleted.", "info");
  };

  // Compute metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCat = filterCategory === 'all' || t.category === filterCategory;
    return matchesType && matchesCat;
  });

  // Export report to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      addToast("No transactions to export", "warning");
      return;
    }
    const headers = ["Title,Type,Category,Amount,Date\n"];
    const rows = transactions.map(t => 
      `"${t.title.replace(/"/g, '""')}",${t.type},"${t.category}",${t.amount},${t.date}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CashBook_Report_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Report exported successfully as CSV!", "success");
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 bg-slate-50 min-h-screen text-slate-800">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, <span className="text-primary">{firstName}</span>! 👋
          </h1>
          <p className="text-sm text-slate-500">
            Here is your financial status overview for today.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Cash Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Cash Book Balance</p>
            <p className={`text-3xl font-black ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              ₹{netBalance.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 font-medium">Safe to spend balance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inflow (Income)</p>
            <p className="text-3xl font-black text-emerald-600">
              ₹{totalIncome.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>Earnings this month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Outflow (Expenses)</p>
            <p className="text-3xl font-black text-rose-600">
              ₹{totalExpense.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-rose-500 text-xs font-bold">
              <ArrowDownRight className="w-4 h-4" />
              <span>Spent this month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Ledger Table Section */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Filters Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Transaction Ledger
          </h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter by Type */}
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-bold">
              {[
                { label: 'All', value: 'all' },
                { label: 'Income', value: 'income' },
                { label: 'Expenses', value: 'expense' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    filterType === opt.value
                      ? 'bg-white text-primary shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Filter by Category */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 appearance-none focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto w-full">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-700 font-bold mb-1">No transaction records found</p>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">
                Try changing your filters or add a new transaction to start tracking.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 select-none uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors text-sm">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {tx.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {tx.date}
                    </td>
                    <td className={`px-6 py-4 text-right font-black ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── ADD ENTRY MODAL POPUP ── */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-[460px] z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  New Cash Entry
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Income / Expense Toggle Selection */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      type === 'expense'
                        ? 'bg-white text-rose-600 shadow-sm border border-slate-200/20'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ArrowDownRight className="w-4.5 h-4.5" />
                    Outflow (Expense)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      type === 'income'
                        ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/20'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ArrowUpRight className="w-4.5 h-4.5" />
                    Inflow (Income)
                  </button>
                </div>

                {/* Entry Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Title / Description</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Milk & Vegetables, Office Rent"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                {/* Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="500"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm font-bold text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary bg-white text-sm font-medium text-slate-800"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Entry */}
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  Save Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
