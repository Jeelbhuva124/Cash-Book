import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowUp, ArrowDown, TrendingUp, Info, 
  Plus, X, Zap, CheckCircle2, Trash2, Calendar
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Dropdown from '../components/Dropdown';

// Standard categories matching Landing Page trackers
const DEFAULT_CATEGORIES = [
  { id: '1', name: "Grocery", color: "#3b82f6" },
  { id: '2', name: "Fuel & Transport", color: "#10b981" },
  { id: '3', name: "Travel", color: "#f59e0b" },
  { id: '4', name: "Shopping", color: "#ec4899" },
  { id: '5', name: "Electricity & Utilities", color: "#8b5cf6" },
  { id: '6', name: "Medical & Healthcare", color: "#ef4444" },
  { id: '7', name: "Home Maintenance", color: "#6b7280" },
  { id: '8', name: "Business & Work", color: "#06b6d4" },
  { id: '9', name: "Savings & Invests", color: "#10b981" }
];

const DEFAULT_PAYMENT_MODES = [
  { id: '1', name: "Cash", type: "Cash" },
  { id: '2', name: "Bank Transfer", type: "Bank" },
  { id: '3', name: "GPay / UPI", type: "UPI" },
  { id: '4', name: "Credit Card", type: "Card" }
];

export default function Home() {
  const { addToast } = useToast();
  const location = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [chalans, setChalans] = useState([]);
  const [activeChalanId, setActiveChalanId] = useState('1');

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense'); // income, expense
  const [category, setCategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChalanId, setSelectedChalanId] = useState('1');

  // Load user session
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // Storage keys specific to the user
  const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
  const categoriesStorageKey = `cashbook_categories_${user?.email_id || 'guest'}`;
  const modesStorageKey = `cashbook_payment_modes_${user?.email_id || 'guest'}`;
  const chalansStorageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;
  const activeChalanKey = `cashbook_active_id_${user?.email_id || 'guest'}`;

  useEffect(() => {
    // 1. Determine active chalan ID (from router state, then fallback to placeholder '')
    const stateId = location.state?.selectedCashbookId;
    let initialId = '';
    
    if (stateId) {
      initialId = stateId;
      localStorage.setItem(activeChalanKey, stateId); // Keep local storage in sync for other components if needed
    } else {
      // If we didn't arrive here by clicking a cashbook, FORCE the default placeholder
      // by clearing it.
      localStorage.removeItem(activeChalanKey);
    }
    
    setActiveChalanId(initialId);
    setSelectedChalanId(initialId);

    // 2. Load categories
    const savedCats = localStorage.getItem(categoriesStorageKey);
    let loadedCats = DEFAULT_CATEGORIES;
    if (savedCats) {
      try { loadedCats = JSON.parse(savedCats); } catch (e) {}
    } else {
      localStorage.setItem(categoriesStorageKey, JSON.stringify(DEFAULT_CATEGORIES));
    }
    setCategories(loadedCats);
    if (loadedCats.length > 0) setCategory(loadedCats[0].name);

    // 3. Load payment modes
    const savedModes = localStorage.getItem(modesStorageKey);
    let loadedModes = DEFAULT_PAYMENT_MODES;
    if (savedModes) {
      try { loadedModes = JSON.parse(savedModes); } catch (e) {}
    } else {
      localStorage.setItem(modesStorageKey, JSON.stringify(DEFAULT_PAYMENT_MODES));
    }
    setPaymentModes(loadedModes);
    if (loadedModes.length > 0) setPaymentMode(loadedModes[0].name);

    // 4. Load chalans
    const savedChalans = localStorage.getItem(chalansStorageKey);
    let loadedChalans = [];
    if (savedChalans) {
      try { loadedChalans = JSON.parse(savedChalans); } catch (e) {}
    }
    setChalans(loadedChalans);

    // 5. Load transactions
    const savedTxs = localStorage.getItem(txsStorageKey);
    if (savedTxs) {
      try {
        setTransactions(JSON.parse(savedTxs));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed default transactions
      const initialSeed = [
        { id: '1', title: 'Salary Credit', type: 'income', category: 'Business & Work', paymentMode: 'Bank Transfer', amount: 45000, date: new Date().toISOString().split('T')[0], chalanId: '1' },
        { id: '2', title: 'Supermarket Groceries', type: 'expense', category: 'Grocery', paymentMode: 'Cash', amount: 2340, date: new Date().toISOString().split('T')[0], chalanId: '1' },
        { id: '3', title: 'Petrol refuel', type: 'expense', category: 'Fuel & Transport', paymentMode: 'GPay / UPI', amount: 1200, date: new Date().toISOString().split('T')[0], chalanId: '1' },
        { id: '4', title: 'Freelance Design Payment', type: 'income', category: 'Business & Work', paymentMode: 'GPay / UPI', amount: 12500, date: new Date().toISOString().split('T')[0], chalanId: '1' }
      ];
      setTransactions(initialSeed);
      localStorage.setItem(txsStorageKey, JSON.stringify(initialSeed));
    }
  }, [txsStorageKey, categoriesStorageKey, modesStorageKey, chalansStorageKey, activeChalanKey]);

  // Save transactions helper
  const saveTransactions = (newTxs) => {
    setTransactions(newTxs);
    localStorage.setItem(txsStorageKey, JSON.stringify(newTxs));
  };

  // Add transaction
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
      paymentMode,
      amount: parseFloat(amount),
      date,
      chalanId: selectedChalanId
    };

    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    
    // Automatically switch dashboard view to the cashbook where entry was added
    if (selectedChalanId !== activeChalanId) {
      setActiveChalanId(selectedChalanId);
      localStorage.setItem(activeChalanKey, selectedChalanId);
    }
    
    addToast("Transaction recorded successfully!", "success");

    // Reset Form
    setTitle('');
    setAmount('');
    if (categories.length > 0) setCategory(categories[0].name);
    if (paymentModes.length > 0) setPaymentMode(paymentModes[0].name);
    setShowAddForm(false);
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    saveTransactions(updated);
    addToast("Transaction deleted.", "info");
  };

  // ── Metrics calculations scoped to active chalan ──
  const activeTxs = activeChalanId === ''
    ? transactions
    : transactions.filter(tx => 
        tx.chalanId === activeChalanId || (activeChalanId === '1' && !tx.chalanId)
      );

  const totalCashIn = activeTxs
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCashOut = activeTxs
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalCashIn - totalCashOut;

  // Active cash books count (fallback to default seed of 4)
  const cashbooksCount = chalans.length || 4;

  // Today metrics
  const todayStr = new Date().toISOString().split('T')[0];
  
  const cashInToday = activeTxs
    .filter(t => t.type === 'income' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const cashOutToday = activeTxs
    .filter(t => t.type === 'expense' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const txsTodayCount = activeTxs.filter(t => t.date === todayStr).length;

  // Top spending categories grouping
  const expenses = activeTxs.filter(t => t.type === 'expense');
  const catTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const sortedCategories = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  // Payment mode usage grouping
  const pmTotals = activeTxs.reduce((acc, curr) => {
    acc[curr.paymentMode || 'Cash'] = (acc[curr.paymentMode || 'Cash'] || 0) + 1;
    return acc;
  }, {});
  const sortedPaymentModes = Object.entries(pmTotals).sort((a, b) => b[1] - a[1]);

  // Get Active Chalan Name
  const activeChalanName = chalans.find(c => c.id === activeChalanId)?.name || "General Cashbook";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-foreground bg-[#f4f6fc] dark:bg-background min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e293b] dark:text-foreground">
              Dashboard
            </h1>
            <Dropdown
              value={activeChalanId}
              onChange={(e) => {
                setActiveChalanId(e.target.value);
                localStorage.setItem(activeChalanKey, e.target.value);
              }}
              className="w-48"
              selectClassName="text-[13px] bg-primary/5 text-primary border-primary/20 font-semibold"
            >
              <option value="" disabled>Select Your Cashbook</option>
              <option value="1">General Cashbook</option>
              {chalans.filter(c => c.id !== '1').map(ch => (
                <option key={ch.id} value={ch.id}>{ch.name}</option>
              ))}
            </Dropdown>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of your financial activity</p>
        </div>
      </div>

      {/* Row of 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Balance */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Cash In */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Cash In</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{totalCashIn.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Cash Out */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Cash Out</p>
            <p className="text-2xl font-bold text-expense">
              ₹{totalCashOut.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-expense flex items-center justify-center">
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Cashbooks */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cashbooks</p>
            <p className="text-2xl font-bold text-foreground">
              {cashbooksCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Today's Summary Card */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-foreground font-bold text-base">
          <Info className="w-5 h-5 text-muted-foreground" />
          <span>Today's Summary</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Subcard 1: Cash In Today */}
          <div className="bg-[#f8fafc] dark:bg-[#15181f] border border-border/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold">Cash In Today</p>
            <p className="text-lg font-bold text-foreground mt-1">
              ₹{cashInToday.toLocaleString()}
            </p>
          </div>

          {/* Subcard 2: Cash Out Today */}
          <div className="bg-[#f8fafc] dark:bg-[#15181f] border border-border/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold">Cash Out Today</p>
            <p className="text-lg font-bold text-expense mt-1">
              ₹{cashOutToday.toLocaleString()}
            </p>
          </div>

          {/* Subcard 3: Transactions Today */}
          <div className="bg-[#f8fafc] dark:bg-[#15181f] border border-border/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold">Transactions Today</p>
            <p className="text-lg font-bold text-foreground mt-1">
              {txsTodayCount}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Spending Categories & Payment Mode Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Spending Categories Card */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#1e293b] dark:text-foreground">
            Top Spending Categories
          </h3>

          {sortedCategories.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-center text-muted-foreground text-sm font-medium">
              No expenses recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.slice(0, 5).map(([catName, amt]) => {
                const pct = totalCashOut > 0 ? ((amt / totalCashOut) * 100).toFixed(0) : 0;
                return (
                  <div key={catName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{catName}</span>
                      <span className="text-muted-foreground">₹{amt.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Mode Usage Card */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#1e293b] dark:text-foreground">
            Payment Mode Usage
          </h3>

          {sortedPaymentModes.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-center text-muted-foreground text-sm font-medium">
              No transactions recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPaymentModes.slice(0, 5).map(([modeName, count]) => {
                const totalTxsCount = activeTxs.length;
                const pct = totalTxsCount > 0 ? ((count / totalTxsCount) * 100).toFixed(0) : 0;
                return (
                  <div key={modeName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{modeName}</span>
                      <span className="text-muted-foreground">{count} logs ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Ledger for high functionality */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-[#1e293b] dark:text-foreground">
            Recent Transactions
          </h3>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:opacity-95 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </button>
        </div>

        {activeTxs.length === 0 ? (
          <p className="text-center py-8 text-sm text-muted-foreground">No recent transaction records in this cashbook.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Payment Mode</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {activeTxs.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="text-sm">
                    <td className="py-3 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-expense'}`} />
                        {tx.title}
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{tx.category}</td>
                    <td className="py-3 text-muted-foreground text-xs">{tx.paymentMode || 'Cash'}</td>
                    <td className="py-3 text-muted-foreground text-xs">
                      <div className="flex flex-col">
                        <span>{tx.date}</span>
                        <span className="opacity-70 text-[10px]">
                          {new Date(parseInt(tx.id)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="p-1 rounded text-muted-foreground hover:text-expense hover:bg-expense-bg/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-all z-40 active:scale-95"
        title="Quick Transaction Entry"
      >
        <Zap className="w-6 h-6 fill-current" />
      </button>

      {/* ── QUICK TRANSACTION ENTRY MODAL ── */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-sm p-6 w-full max-w-[460px] z-10 space-y-6 text-foreground"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Quick Entry
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted border border-border/50">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      type === 'expense'
                        ? 'bg-white dark:bg-[#1a2475] text-expense dark:text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    Outflow (Expense)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      type === 'income'
                        ? 'bg-white dark:bg-[#1a2475] text-emerald-600 dark:text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    Inflow (Income)
                  </button>
                </div>

                {/* Cashbook Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Select Cashbook</label>
                  <Dropdown
                    value={selectedChalanId}
                    onChange={(e) => setSelectedChalanId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Your Cashbook</option>
                    {chalans.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </Dropdown>
                </div>

                {/* Entry Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Title / Description</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chai & Snacks, Customer Inflow"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                  />
                </div>

                {/* Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="150"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-bold text-foreground bg-white dark:bg-card"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                    />
                  </div>
                </div>

                {/* Category & Payment Mode */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Category</label>
                    <Dropdown
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </Dropdown>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Payment Mode</label>
                    <Dropdown
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      {paymentModes.map(pm => (
                        <option key={pm.id} value={pm.name}>{pm.name}</option>
                      ))}
                    </Dropdown>
                  </div>
                </div>

                {/* Submit Entry */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
