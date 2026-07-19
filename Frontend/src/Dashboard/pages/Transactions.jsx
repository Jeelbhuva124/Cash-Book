import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, Search, Filter, ArrowLeft, Wallet, ArrowUp, ArrowDown, Plus, Trash2, X, CheckCircle2, Pencil } from 'lucide-react';
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

export default function Transactions() {
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [cashbookName, setCashbookName] = useState('');
  
  // Add Entry Modal States
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChalanId, setSelectedChalanId] = useState('1');
  const [chalans, setChalans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [editTxId, setEditTxId] = useState(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
    const chalansStorageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;

    const modesStorageKey = `cashbook_payment_modes_${user?.email_id || 'guest'}`;
    const categoriesStorageKey = `cashbook_categories_${user?.email_id || 'guest'}`;

    // Load categories
    const savedCats = localStorage.getItem(categoriesStorageKey);
    let loadedCats = DEFAULT_CATEGORIES;
    if (savedCats) {
      try { loadedCats = JSON.parse(savedCats); } catch (e) {}
    } else {
      localStorage.setItem(categoriesStorageKey, JSON.stringify(DEFAULT_CATEGORIES));
    }
    setCategories(loadedCats);
    if (loadedCats.length > 0) setCategory(loadedCats[0].name);

    // Load payment modes
    const savedModes = localStorage.getItem(modesStorageKey);
    let loadedModes = DEFAULT_PAYMENT_MODES;
    if (savedModes) {
      try { loadedModes = JSON.parse(savedModes); } catch (e) {}
    } else {
      localStorage.setItem(modesStorageKey, JSON.stringify(DEFAULT_PAYMENT_MODES));
    }
    setPaymentModes(loadedModes);
    if (loadedModes.length > 0) setPaymentMode(loadedModes[0].name);

    // Load chalans to find name
    let loadedChalans = [];
    const savedChalans = localStorage.getItem(chalansStorageKey);
    if (savedChalans) {
      try { loadedChalans = JSON.parse(savedChalans); } catch (e) { }
    }
    setChalans(loadedChalans);

    const stateId = location.state?.selectedCashbookId;
    if (stateId) {
      const found = loadedChalans.find(c => c.id === stateId);
      if (found) setCashbookName(found.name);
      else if (stateId === '1') setCashbookName("General Cashbook");
      setSelectedChalanId(stateId);
    }

    const saved = localStorage.getItem(txsStorageKey);
    if (saved) {
      let loadedTxs = JSON.parse(saved);
      if (stateId) {
        loadedTxs = loadedTxs.filter(tx => tx.chalanId === stateId || (stateId === '1' && !tx.chalanId));
      }
      setTransactions(loadedTxs);
    }
  }, [location.state]);

  const handleDelete = (txId) => {
    if(!window.confirm("Are you sure you want to delete this transaction?")) return;
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
    const saved = localStorage.getItem(txsStorageKey);
    if (saved) {
      let loadedTxs = JSON.parse(saved);
      loadedTxs = loadedTxs.filter(t => t.id !== txId);
      localStorage.setItem(txsStorageKey, JSON.stringify(loadedTxs));
      setTransactions(transactions.filter(t => t.id !== txId));
      addToast("Transaction deleted", "success");
    }
  };

  const handleOpenAddForm = () => {
    setEditTxId(null);
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setShowAddForm(true);
  };

  const handleEditClick = (tx) => {
    setEditTxId(tx.id);
    setTitle(tx.title);
    setType(tx.type);
    setCategory(tx.category);
    setPaymentMode(tx.paymentMode);
    setAmount(tx.amount.toString());
    setDate(tx.date);
    setSelectedChalanId(tx.chalanId || '1');
    setShowAddForm(true);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      addToast("Please fill valid fields", "warning");
      return;
    }
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
    
    const newTx = {
      id: editTxId ? editTxId : Date.now().toString(),
      title: title.trim(),
      type,
      category,
      paymentMode,
      amount: parseFloat(amount),
      date,
      chalanId: selectedChalanId
    };

    let allTxs = [];
    const saved = localStorage.getItem(txsStorageKey);
    if (saved) {
      allTxs = JSON.parse(saved);
    }
    
    if (editTxId) {
      const updatedTxs = allTxs.map(t => t.id === editTxId ? newTx : t);
      localStorage.setItem(txsStorageKey, JSON.stringify(updatedTxs));
      setTransactions(transactions.map(t => t.id === editTxId ? newTx : t));
      addToast("Transaction updated successfully", "success");
    } else {
      const updatedTxs = [newTx, ...allTxs];
      localStorage.setItem(txsStorageKey, JSON.stringify(updatedTxs));
      
      const stateId = location.state?.selectedCashbookId;
      if (!stateId || newTx.chalanId === stateId || (stateId === '1' && !newTx.chalanId)) {
        setTransactions([newTx, ...transactions]);
      }
      addToast("Transaction added successfully", "success");
    }
    
    setShowAddForm(false);
    setTitle('');
    setAmount('');
    setEditTxId(null);
  };

  const filtered = transactions.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalCashIn = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCashOut = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalBalance = totalCashIn - totalCashOut;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 bg-background min-h-screen text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <button 
            onClick={() => navigate('/dashboard/cashbooks')}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors w-fit mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Cashbooks
          </button>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Receipt className="w-8 h-8 text-primary" />
            {cashbookName ? `${cashbookName} Logs` : 'All Logs'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed history of all your transactions.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary shadow-sm"
            />
          </div>
          <button 
            onClick={handleOpenAddForm}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/90 transition-colors shrink-0"
            title="Add New Entry"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Balance */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalBalance )}
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
              {formatCurrency(totalCashIn)}
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
              {formatCurrency(totalCashOut)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-expense flex items-center justify-center">
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/70 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/40 transition-colors text-sm">
                  <td className="px-6 py-4 font-bold">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-income' : 'bg-expense'}`} />
                      {tx.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {tx.paymentMode || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    <div className="flex flex-col">
                      <span>{tx.date}</span>
                      <span className="text-xs opacity-70">
                        {new Date(parseInt(tx.id)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-black ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type  === 'income' ? '+' : ''}{formatCurrency(tx.type  === 'income' ? tx.amount : -tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEditClick(tx)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex"
                        title="Edit Entry"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        className="p-1.5 text-muted-foreground hover:text-expense hover:bg-expense-bg/30 rounded-lg transition-colors inline-flex"
                        title="Remove Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No logs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── QUICK TRANSACTION ENTRY MODAL ── */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-sm p-6 w-full max-w-[460px] z-10 space-y-6 text-foreground"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  {editTxId ? 'Edit Entry' : 'Quick Entry'}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
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
