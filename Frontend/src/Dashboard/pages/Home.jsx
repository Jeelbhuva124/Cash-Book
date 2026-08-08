import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useLocation } from 'react-router-dom';
import { socket } from '../../utils/socket';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowUp, ArrowDown, TrendingUp, Info, 
  Plus, X, Zap, CheckCircle2, Trash2, Calendar
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Dropdown from '../components/Dropdown';
import ConfirmModal from '../components/ConfirmModal';

const formatPaymentMode = (name) => {
  if (!name) return '';
  if (name.includes(' ** ')) {
    return name.split(' ** ')[0];
  }
  return name;
};

export default function Home() {
  const { addToast } = useToast();
  const location = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [chalans, setChalans] = useState([]);
  const [activeChalanId, setActiveChalanId] = useState('1');

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense'); // income, expense
  const [category, setCategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChalanId, setSelectedChalanId] = useState('1');
  const [clientIp, setClientIp] = useState('Fetching IP...');

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
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setClientIp(data.ip))
      .catch(() => setClientIp('Unknown IP'));
  }, []);

  const loadCategoriesAndModes = async (chalanId) => {
    if (!chalanId) return;
    const userEmail = user?.email_id?.toLowerCase() || '';

    // Fetch Categories
    try {
      const res = await fetch('http://localhost:5001/api/category/select');
      const data = await res.json();
      if (data.success && data.data) {
        const filtered = data.data.filter(cat => 
          cat.chalan_id === chalanId &&
          cat.active
        );
        const mapped = filtered.map(c => ({
          id: c.id,
          name: c.category_name,
          active: c.active
        }));
        setCategories(mapped);
        if (mapped.length > 0) {
          setCategory(mapped[0].name);
        } else {
          setCategory('');
        }
      }
    } catch (err) {
      console.error("Failed to load categories from API:", err);
    }

    // Fetch Payment Modes
    try {
      const res = await fetch('http://localhost:5001/api/payment-mode/select');
      const data = await res.json();
      if (data.success && data.data) {
        const filtered = data.data.filter(pm => 
          pm.chalan_id === chalanId &&
          pm.active
        );
        const mapped = filtered.map(p => ({
          id: p.id,
          name: p.payment_mode,
          active: p.active
        }));
        setPaymentModes(mapped);
        if (mapped.length > 0) {
          setPaymentMode(mapped[0].name);
        } else {
          setPaymentMode('');
        }
      }
    } catch (err) {
      console.error("Failed to load payment modes from API:", err);
    }
  };

  const handleAddNewCategory = async (catName) => {
    if (!selectedChalanId) {
      addToast("Please select a cashbook first", "warning");
      return;
    }
    const payload = {
      category_name: catName,
      active: true,
      chalan_id: selectedChalanId,
      created_by: user?.username || 'Guest',
      updated_by: user?.username || 'Guest',
      user_email: user?.email_id || ''
    };

    try {
      const response = await fetch('http://localhost:5001/api/category/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.data) {
        addToast(`Category "${catName}" created and selected!`, "success");
        const newCat = {
          id: data.data.id,
          name: data.data.category_name,
          active: data.data.active
        };
        setCategories(prev => [newCat, ...prev]);
        setCategory(data.data.category_name);
      } else {
        addToast(data.message || "Failed to add category", "error");
      }
    } catch (err) {
      console.error("Quick Add Category error:", err);
      addToast("Failed to add category to database", "error");
    }
  };

  const handleAddNewPaymentMode = async (modeName) => {
    if (!selectedChalanId) {
      addToast("Please select a cashbook first", "warning");
      return;
    }
    const payload = {
      payment_mode: modeName,
      active: true,
      chalan_id: selectedChalanId,
      created_by: user?.username || 'Guest',
      updated_by: user?.username || 'Guest',
      user_email: user?.email_id || ''
    };

    try {
      const response = await fetch('http://localhost:5001/api/payment-mode/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.data) {
        addToast(`Payment option "${modeName}" created and selected!`, "success");
        const newPm = {
          id: data.data.id,
          name: data.data.payment_mode,
          active: data.data.active
        };
        setPaymentModes(prev => [newPm, ...prev]);
        setPaymentMode(data.data.payment_mode);
      } else {
        addToast(data.message || "Failed to add payment option", "error");
      }
    } catch (err) {
      console.error("Quick Add Payment Option error:", err);
      addToast("Failed to add payment option to database", "error");
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/transaction/select');
      const data = await response.json();
      if (data.success && data.data) {
        const mapped = data.data.map(tx => ({
          id: tx.id,
          title: tx.title,
          type: tx.type,
          amount: tx.amount,
          date: tx.date,
          time: tx.time,
          chalanId: tx.chalan_id,
          category: tx.category,
          subcategory: tx.subcategory,
          paymentMode: tx.payment_mode,
          remark: tx.remark,
          createdBy: tx.created_by,
          user_email: tx.user_email,
          is_deleted: !!tx.is_deleted || !!tx.deleted
        }));
        const userEmail = user?.email_id?.toLowerCase() || '';
        const userTxs = mapped.filter(t => true);
        setTransactions(userTxs);
      }
    } catch (err) {
      console.error("Failed to load transactions on Home:", err);
    }
  };

  useEffect(() => {
    // 1. Determine active chalan ID
    const stateId = location.state?.selectedCashbookId;
    let initialId = '';
    
    if (stateId) {
      initialId = stateId;
      localStorage.setItem(activeChalanKey, stateId);
    } else {
      localStorage.removeItem(activeChalanKey);
    }
    
    setActiveChalanId(initialId);
    setSelectedChalanId(initialId);

    // 2. Load chalans
    const savedChalans = localStorage.getItem(chalansStorageKey);
    let loadedChalans = [];
    if (savedChalans) {
      try { loadedChalans = JSON.parse(savedChalans); } catch (e) {}
    }
    setChalans(loadedChalans);

    // 3. Load transactions and categories/modes from database
    loadTransactions();
    loadCategoriesAndModes(initialId || '1');
  }, [location.state]);

  useEffect(() => {
    const handleTxChange = () => {
      loadTransactions();
    };

    socket.on('transaction_created', handleTxChange);
    socket.on('transaction_updated', handleTxChange);
    socket.on('transaction_deleted', handleTxChange);

    return () => {
      socket.off('transaction_created', handleTxChange);
      socket.off('transaction_updated', handleTxChange);
      socket.off('transaction_deleted', handleTxChange);
    };
  }, []);

  // Add transaction to backend database
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      addToast("Please fill valid fields", "warning");
      return;
    }

    const payload = {
      title: title.trim(),
      type,
      amount: parseFloat(amount),
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      chalan_id: selectedChalanId || '1',
      category,
      subcategory: '',
      payment_mode: paymentMode,
      remark: 'Null',
      created_by: user?.username || 'Guest',
      user_email: user?.email_id || ''
    };

    try {
      const response = await fetch('http://localhost:5001/api/transaction/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success && data.data) {
        const savedTx = {
          id: data.data.id,
          title: data.data.title,
          type: data.data.type,
          amount: data.data.amount,
          date: data.data.date,
          time: data.data.time,
          chalanId: data.data.chalan_id,
          category: data.data.category,
          subcategory: data.data.subcategory,
          paymentMode: data.data.payment_mode,
          remark: data.data.remark,
          createdBy: data.data.created_by,
          user_email: data.data.user_email
        };

        setTransactions([savedTx, ...transactions]);
        addToast("Transaction recorded successfully!", "success");
        
        // Reset Form
        setTitle('');
        setAmount('');
        setShowAddForm(false);
        
        // Automatically switch dashboard view to the cashbook where entry was added
        if (selectedChalanId !== activeChalanId) {
          setActiveChalanId(selectedChalanId);
          localStorage.setItem(activeChalanKey, selectedChalanId);
        }
      } else {
        addToast(data.message || "Failed to record transaction", "error");
      }
    } catch (err) {
      console.error("Save transaction error:", err);
      addToast("Failed to save transaction to database", "error");
    }
  };

  // Delete transaction from backend database
  const handleDeleteTransaction = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Transaction",
      message: "Are you sure you want to delete this transaction? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch('http://localhost:5001/api/transaction/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const data = await response.json();
          if (data.success) {
            setTransactions(transactions.filter(t => t.id !== id));
            addToast("Transaction deleted successfully", "success");
          } else {
            addToast(data.message || "Failed to delete transaction", "error");
          }
        } catch (err) {
          console.error("Delete transaction error:", err);
          addToast("Failed to delete transaction from database", "error");
        }
      }
    });
  };

  // ── Metrics calculations scoped to active chalan ──
  const activeTxs = (activeChalanId === ''
    ? transactions
    : transactions.filter(tx => 
        tx.chalanId === activeChalanId || (activeChalanId === '1' && !tx.chalanId)
      )).filter(t => !t.is_deleted && !t.deleted);

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
    const formatted = formatPaymentMode(curr.paymentMode || 'Cash');
    acc[formatted] = (acc[formatted] || 0) + 1;
    return acc;
  }, {});
  const sortedPaymentModes = Object.entries(pmTotals).sort((a, b) => b[1] - a[1]);

  // Get Active Chalan Name
  const activeChalanName = chalans.find(c => c.id === activeChalanId)?.name || "General Cashbook";

  return (
    <div className="p-6 md:p-8 w-full space-y-6 text-foreground bg-transparent dark:bg-transparent min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e293b] dark:text-foreground">
              Dashboard
            </h1>

          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of your financial activity</p>
        </div>
      </div>

      {/* Row of 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Balance */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wider truncate">Total Balance</p>
            <p className="text-xl 2xl:text-2xl font-bold text-foreground dark:text-slate-100 whitespace-nowrap tracking-tight">
              {formatCurrency(totalBalance)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Cash In */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wider truncate">Total Cash In</p>
            <p className="text-xl 2xl:text-2xl font-bold text-[#10b981] dark:text-emerald-400 whitespace-nowrap tracking-tight">
              {formatCurrency(totalCashIn)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Cash Out */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wider truncate">Total Cash Out</p>
            <p className="text-xl 2xl:text-2xl font-bold text-[#ef4444] dark:text-rose-400 whitespace-nowrap tracking-tight">
              {formatCurrency(totalCashOut)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Cashbooks */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wider truncate">Cashbooks</p>
            <p className="text-xl 2xl:text-2xl font-bold text-foreground dark:text-slate-100 whitespace-nowrap tracking-tight">
              {cashbooksCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Today's Summary Card */}
      <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-foreground dark:text-slate-100 font-bold text-base">
          <Info className="w-5 h-5 text-muted-foreground dark:text-slate-400" />
          <span>Today's Summary</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Subcard 1: Cash In Today */}
          <div className="bg-[#f8fafc] dark:bg-[#0b0f19] border border-border/40 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground dark:text-slate-400 font-semibold">Cash In Today</p>
              <p className="text-lg font-bold text-[#10b981] dark:text-emerald-400">
                {formatCurrency(cashInToday)}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </div>
          </div>

          {/* Subcard 2: Cash Out Today */}
          <div className="bg-[#f8fafc] dark:bg-[#0b0f19] border border-border/40 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground dark:text-slate-400 font-semibold">Cash Out Today</p>
              <p className="text-lg font-bold text-[#ef4444] dark:text-rose-400">
                {formatCurrency(cashOutToday)}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Subcard 3: Transactions Today */}
          <div className="bg-[#f8fafc] dark:bg-[#0b0f19] border border-border/40 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground dark:text-slate-400 font-semibold">Transactions Today</p>
              <p className="text-lg font-bold text-foreground dark:text-slate-100">
                {txsTodayCount}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Spending Categories & Payment Mode Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Spending Categories Card */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-[#1e293b] dark:text-slate-100">
            Top Spending Categories
          </h3>

          {sortedCategories.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-center text-muted-foreground dark:text-slate-400 text-sm font-medium">
              No expenses recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.slice(0, 5).map(([catName, amt]) => {
                const pct = totalCashOut > 0 ? ((amt / totalCashOut) * 100).toFixed(0) : 0;
                return (
                  <div key={catName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground dark:text-slate-200">{catName}</span>
                      <span className="text-muted-foreground dark:text-slate-400">{formatCurrency(amt)} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted/60 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
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
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-[#1e293b] dark:text-slate-100">
            Payment Mode Usage
          </h3>

          {sortedPaymentModes.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-center text-muted-foreground dark:text-slate-400 text-sm font-medium">
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
                      <span className="text-foreground dark:text-slate-200">{modeName}</span>
                      <span className="text-muted-foreground dark:text-slate-400">{count} logs ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted/60 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
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
      <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-[#1e293b] dark:text-slate-100">
            Recent Transactions
          </h3>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary dark:bg-indigo-600 text-primary-foreground font-semibold rounded-xl text-xs hover:opacity-95 dark:hover:bg-indigo-500 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </button>
        </div>

        {activeTxs.length === 0 ? (
          <p className="text-center py-8 text-sm text-muted-foreground dark:text-slate-400">No recent transaction records in this cashbook.</p>
        ) : (
          <div className="overflow-x-auto w-full border border-border/60 dark:border-slate-800/80 rounded-xl bg-card dark:bg-[#0b0f19]">
            <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
              <thead>
                <tr className="bg-muted/30 dark:bg-slate-900/80 border-b border-border dark:border-slate-800 text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5 w-[25%]">Title</th>
                  <th className="px-4 py-3.5 w-[18%]">Category</th>
                  <th className="px-4 py-3.5 w-[18%]">Payment Mode</th>
                  <th className="px-4 py-3.5 w-[20%]">Date & Time</th>
                  <th className="px-4 py-3.5 w-[14%] text-right">Amount</th>
                  <th className="px-4 py-3.5 w-[5%] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-800/80">
                {activeTxs.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 dark:hover:bg-slate-800/40 transition-colors text-xs font-semibold text-foreground dark:text-slate-200">
                    <td className="px-4 py-3.5 font-semibold text-foreground dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-[#10b981] dark:bg-emerald-400' : 'bg-[#ef4444] dark:bg-rose-400'}`} />
                        {tx.title}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-300 dark:border dark:border-slate-700/60 text-[10px] font-bold">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded border border-border dark:border-slate-700/60 text-[10px] font-bold text-muted-foreground dark:text-slate-400 bg-muted/20 dark:bg-slate-800/60">
                        {formatPaymentMode(tx.paymentMode || 'Cash')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground dark:text-slate-400">
                      <div className="flex flex-col">
                        <span>{tx.date}</span>
                        <span className="opacity-70 text-[10px] font-mono">
                          {new Date(parseInt(tx.id)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3.5 text-right font-bold ${tx.type === 'income' ? 'text-[#10b981] dark:text-emerald-400' : 'text-[#ef4444] dark:text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.type === 'income' ? tx.amount : -tx.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="p-1.5 text-muted-foreground dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
        <Plus className="w-6 h-6" />
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
                    Expense
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
                    Income
                  </button>
                </div>

                {/* Cashbook Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Select Cashbook</label>
                  <Dropdown
                    value={selectedChalanId}
                    onChange={(e) => {
                      setSelectedChalanId(e.target.value);
                      loadCategoriesAndModes(e.target.value);
                    }}
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
                      onAddNew={handleAddNewCategory}
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
                      onAddNew={handleAddNewPaymentMode}
                    >
                      {paymentModes.map(pm => (
                        <option key={pm.id} value={pm.name}>{formatPaymentMode(pm.name)}</option>
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
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

    </div>
  );
}

