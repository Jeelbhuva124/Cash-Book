import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, Search, ArrowUp, ArrowDown, 
  Wallet, RefreshCw, Book, Calendar, Tag, CreditCard, X
} from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { socket } from '../../utils/socket';

const formatPaymentMode = (name) => {
  if (!name) return '';
  if (name.includes(' ** ')) {
    return name.split(' ** ')[0];
  }
  return name;
};

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [chalans, setChalans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChalanFilter, setSelectedChalanFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, income, expense
  const [sortField, setSortField] = useState('time');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);

  // Load user session
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const userEmail = user?.email_id?.toLowerCase() || '';

  const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
  const chalansStorageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;

  // Helper to parse date/time for sorting
  const parseTxTime = (tx) => {
    if (tx.id && !isNaN(parseInt(tx.id)) && parseInt(tx.id) > 1000000000000) {
      return parseInt(tx.id);
    }
    if (tx.createdAt && !isNaN(new Date(tx.createdAt).getTime())) {
      return new Date(tx.createdAt).getTime();
    }
    if (tx.date) {
      const parts = tx.date.split('-');
      if (parts.length === 3) {
        let year = parseInt(parts[0]);
        let month = parseInt(parts[1]) - 1;
        let day = parseInt(parts[2]);
        if (parts[0].length === 2 || parseInt(parts[0]) < 100) {
          day = parseInt(parts[0]);
          month = parseInt(parts[1]) - 1;
          year = parseInt(parts[2]);
        }
        let dateObj = new Date(year, month, day);
        if (tx.time) {
          const timeMatch = tx.time.match(/(\d+):(\d+):?(\d+)?\s*(AM|PM)?/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            const ampm = timeMatch[4];
            if (ampm) {
              if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
              if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
            }
            dateObj.setHours(hours, minutes, 0, 0);
          }
        }
        return dateObj.getTime();
      }
    }
    return 0;
  };

  const loadData = async () => {
    setLoading(true);
    let loadedTxs = [];
    let loadedChalans = [];
    const sharedEmails = new Set([userEmail]);

    // Fetch accepted invitations for shared cashbook access
    try {
      const invRes = await fetch('http://localhost:5001/api/invitation/select');
      const invData = await invRes.json();
      if (invData.success && Array.isArray(invData.data)) {
        const accepted = invData.data.filter(i => 
          (i.email?.toLowerCase() === userEmail || i.inviter_email?.toLowerCase() === userEmail) && 
          i.status === 'Accepted'
        );
        accepted.forEach(a => {
          if (a.email) sharedEmails.add(a.email.toLowerCase());
          if (a.inviter_email) sharedEmails.add(a.inviter_email.toLowerCase());
        });
      }
    } catch (e) {
      console.error("Failed to fetch invitations for history:", e);
    }

    // 1. Fetch Cashbooks / Chalans
    try {
      const res = await fetch('http://localhost:5001/api/cashbook/select');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        loadedChalans = data.data.map(c => ({
          id: c.id,
          name: c.cashbook_name,
          hex_code: c.hex_code || '#6366F1'
        }));
      }
    } catch (e) {
      console.error("Failed to fetch cashbooks from API:", e);
    }

    if (loadedChalans.length === 0) {
      const savedChalans = localStorage.getItem(chalansStorageKey);
      if (savedChalans) {
        try { loadedChalans = JSON.parse(savedChalans); } catch (e) {}
      }
    }
    if (loadedChalans.length === 0) {
      loadedChalans = [{ id: '1', name: 'Default Cashbook', hex_code: '#6366F1' }];
    }
    setChalans(loadedChalans);

    // 2. Fetch Transactions from API
    try {
      const res = await fetch('http://localhost:5001/api/transaction/select');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        loadedTxs = data.data.map(t => ({
          id: t.id,
          chalanId: t.chalan_id || '1',
          title: t.title || (t.type === 'income' ? 'Cash In Entry' : 'Cash Out Entry'),
          type: t.type || 'expense',
          category: t.category || 'Other',
          subcategory: t.subcategory || '',
          paymentMode: t.payment_mode || 'Cash',
          amount: parseFloat(t.amount) || 0,
          date: t.date || new Date().toISOString().split('T')[0],
          time: t.time || '12:00 PM',
          location: t.location || 'Local Session',
          createdBy: t.created_by || t.user_email || user?.full_name || 'Guest',
          user_email: t.user_email || '',
          is_deleted: !!t.is_deleted || !!t.deleted
        }));
      }
    } catch (e) {
      console.error("Failed to fetch transactions from API:", e);
    }

    // Filter out transactions belonging to deleted cashbooks
    const activeChalanIds = new Set(loadedChalans.map(c => c.id));
    activeChalanIds.add('1'); // Always allow default chalan ID '1'
    let validTxs = loadedTxs.filter(t => activeChalanIds.has(t.chalanId));

    // Merge with Local Storage fallback
    const savedTxs = localStorage.getItem(txsStorageKey);
    if (savedTxs) {
      try {
        const localTxs = JSON.parse(savedTxs);
        localTxs.forEach(ltx => {
          const existingIdx = validTxs.findIndex(t => t.id === ltx.id);
          if (existingIdx === -1) {
            if (activeChalanIds.has(ltx.chalanId || '1')) {
              validTxs.push(ltx);
            }
          } else {
            if (ltx.is_deleted || ltx.deleted) {
              validTxs[existingIdx].is_deleted = true;
            }
          }
        });
      } catch (e) {}
    }

    setTransactions(validTxs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [userEmail]);

  useEffect(() => {
    const handleTxChange = () => {
      loadData();
    };

    socket.on('transaction_created', handleTxChange);
    socket.on('transaction_updated', handleTxChange);
    socket.on('transaction_deleted', handleTxChange);

    return () => {
      socket.off('transaction_created', handleTxChange);
      socket.off('transaction_updated', handleTxChange);
      socket.off('transaction_deleted', handleTxChange);
    };
  }, [userEmail]);

  // Cashbook name helper
  const getCashbookName = (chalanId) => {
    const found = chalans.find(c => c.id === chalanId);
    return found ? found.name : 'Default Cashbook';
  };

  // Filtered Transactions
  const filteredTxs = transactions.filter(tx => {
    // Search filter
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      tx.title.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query) ||
      (tx.subcategory && tx.subcategory.toLowerCase().includes(query)) ||
      (tx.paymentMode && tx.paymentMode.toLowerCase().includes(query)) ||
      (tx.createdBy && tx.createdBy.toLowerCase().includes(query)) ||
      tx.amount.toString().includes(query);

    // Cashbook filter
    const matchesChalan = selectedChalanFilter === 'all' || tx.chalanId === selectedChalanFilter;

    // Type filter
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;

    return matchesSearch && matchesChalan && matchesType;
  });

  // Sorting
  const sortedTxs = [...filteredTxs].sort((a, b) => {
    let valA, valB;
    if (sortField === 'time') {
      valA = parseTxTime(a);
      valB = parseTxTime(b);
    } else if (sortField === 'amount') {
      valA = a.amount;
      valB = b.amount;
    } else if (sortField === 'title') {
      valA = a.title.toLowerCase();
      valB = b.title.toLowerCase();
    } else if (sortField === 'category') {
      valA = a.category.toLowerCase();
      valB = b.category.toLowerCase();
    } else {
      valA = parseTxTime(a);
      valB = parseTxTime(b);
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // ── CASH TOTALS CALCULATIONS (EXCLUDE DELETED RECORDS FROM CASH SUMS) ──
  const activeFilteredTxs = filteredTxs.filter(t => !t.is_deleted && !t.deleted);
  const totalInflow = activeFilteredTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = activeFilteredTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalInflow - totalOutflow;

  return (
    <div className="p-6 md:p-8 w-full space-y-6 text-foreground bg-transparent dark:bg-transparent min-h-screen">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1e293b] dark:text-slate-100 flex items-center gap-2.5">
            <HistoryIcon className="w-6 h-6 text-primary dark:text-indigo-400" />
            Transaction History
          </h1>
          <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5 font-medium">
            View and search your complete transaction ledger across all cashbooks
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-border/80 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-800 text-foreground dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-muted dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-primary dark:text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── OVERVIEW SUMMARY CARDS (EXCLUDES DELETED RECORDS FROM CASH SUMS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Records */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">Total Records</p>
            <p className="text-xl font-bold text-foreground dark:text-slate-100">
              {filteredTxs.length} Logs
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <HistoryIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Total Cash In */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">Total Cash In</p>
            <p className="text-xl font-bold text-[#10b981] dark:text-emerald-400">
              {formatCurrency(totalInflow)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ArrowUp className="w-4 h-4" />
          </div>
        </div>

        {/* Total Cash Out */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">Total Cash Out</p>
            <p className="text-xl font-bold text-[#ef4444] dark:text-rose-400">
              {formatCurrency(totalOutflow)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">Net Balance</p>
            <p className={`text-xl font-bold ${netBalance < 0 ? 'text-[#ef4444] dark:text-rose-400' : 'text-foreground dark:text-slate-100'}`}>
              {formatCurrency(netBalance)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTERS BAR ── */}
      <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by title, category, payment mode, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#f8fafc] dark:bg-slate-900/90 border border-border dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 text-foreground dark:text-slate-200 placeholder:text-muted-foreground dark:placeholder:text-slate-500 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cashbook Filter */}
          <div className="w-full lg:w-52">
            <select
              value={selectedChalanFilter}
              onChange={(e) => setSelectedChalanFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-[#f8fafc] dark:bg-slate-900/90 border border-border dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 text-foreground dark:text-slate-200 font-semibold cursor-pointer"
            >
              <option value="all">All Cashbooks ({chalans.length})</option>
              {chalans.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.name}</option>
              ))}
            </select>
          </div>

          {/* Type Segmented Filter */}
          <div className="flex items-center p-1 bg-muted/40 dark:bg-slate-900 border border-border/50 dark:border-slate-800 rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                typeFilter === 'all' 
                  ? 'bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 border border-border/60 dark:border-slate-700' 
                  : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                typeFilter === 'income' 
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-[#10b981] dark:text-emerald-400 border border-emerald-500/30' 
                  : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200'
              }`}
            >
              Cash In
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                typeFilter === 'expense' 
                  ? 'bg-rose-500/10 dark:bg-rose-500/20 text-[#ef4444] dark:text-rose-400 border border-rose-500/30' 
                  : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200'
              }`}
            >
              Cash Out
            </button>
          </div>

        </div>
      </div>

      {/* ── TRANSACTION LEDGER TABLE (CLEAN, NO ACTION / NO STATUS COLUMN) ── */}
      <div className="bg-white dark:bg-[#121827] border border-border/80 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-foreground dark:text-slate-100 flex items-center gap-2">
            Transaction Ledger
            <span className="text-muted-foreground dark:text-slate-400 font-normal">• Showing {sortedTxs.length} Records</span>
          </h2>

          {(searchTerm || selectedChalanFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedChalanFilter('all');
                setTypeFilter('all');
              }}
              className="text-xs font-semibold text-primary dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full border border-border/60 dark:border-slate-800/80 rounded-xl bg-card dark:bg-[#0b0f19]">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <thead>
              <tr className="bg-muted/30 dark:bg-slate-900/80 border-b border-border dark:border-slate-800 text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-4 w-[26%] cursor-pointer hover:text-foreground dark:hover:text-slate-200" onClick={() => handleSort('title')}>
                  Title {sortField === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-5 py-4 w-[18%] cursor-pointer hover:text-foreground dark:hover:text-slate-200" onClick={() => handleSort('category')}>
                  Category {sortField === 'category' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-5 py-4 w-[16%]">Payment Mode</th>
                <th className="px-5 py-4 w-[16%]">Cashbook</th>
                <th className="px-5 py-4 w-[16%]">Logged By</th>
                <th className="px-5 py-4 w-[18%] cursor-pointer hover:text-foreground dark:hover:text-slate-200" onClick={() => handleSort('time')}>
                  Date & Time {sortField === 'time' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-5 py-4 w-[16%] text-right cursor-pointer hover:text-foreground dark:hover:text-slate-200" onClick={() => handleSort('amount')}>
                  Amount {sortField === 'amount' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60 dark:divide-slate-800/80">
              {sortedTxs.map((tx) => {
                const isDeleted = tx.is_deleted || tx.deleted;

                return (
                  <tr key={tx.id} className={`hover:bg-muted/30 dark:hover:bg-slate-800/40 transition-colors text-xs font-semibold ${isDeleted ? 'bg-rose-500/5 dark:bg-rose-950/20' : 'text-foreground dark:text-slate-200'}`}>
                    
                    {/* Title */}
                    <td className="px-5 py-4 font-bold">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isDeleted ? 'bg-slate-400 dark:bg-slate-600' : (tx.type === 'income' ? 'bg-[#10b981] dark:bg-emerald-400' : 'bg-[#ef4444] dark:bg-rose-400')}`} />
                        <span className={`truncate ${isDeleted ? 'line-through text-muted-foreground dark:text-slate-500 font-normal' : 'text-foreground dark:text-slate-100'}`}>
                          {tx.title}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold truncate max-w-[140px] ${isDeleted ? 'bg-muted/50 dark:bg-slate-900 text-muted-foreground dark:text-slate-500 border border-border/50' : 'bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-300 dark:border dark:border-slate-700/60'}`} title={tx.category}>
                        {tx.category}
                      </span>
                    </td>

                    {/* Payment Mode */}
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 rounded border border-border dark:border-slate-700/60 text-[10px] font-bold text-muted-foreground dark:text-slate-400 bg-muted/20 dark:bg-slate-800/60">
                        {formatPaymentMode(tx.paymentMode || 'Cash')}
                      </span>
                    </td>

                    {/* Cashbook Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground dark:text-slate-400 font-medium">
                        <Book className="w-3.5 h-3.5 text-primary dark:text-indigo-400 shrink-0" />
                        <span className="truncate max-w-[140px]" title={getCashbookName(tx.chalanId)}>
                          {getCashbookName(tx.chalanId)}
                        </span>
                      </div>
                    </td>

                    {/* Logged By User */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-indigo-500/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 truncate max-w-[130px]" title={tx.user_email || tx.createdBy}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        {tx.createdBy || (tx.user_email ? tx.user_email.split('@')[0] : 'User')}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4 text-muted-foreground dark:text-slate-400">
                      <div className="flex flex-col">
                        <span>{tx.date}</span>
                        <span className="opacity-70 text-[10px] font-mono">{tx.time}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 text-right font-bold">
                      {isDeleted ? (
                        <div className="flex flex-col items-end">
                          <span className="line-through text-muted-foreground dark:text-slate-500 opacity-60 font-semibold">
                            {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.type === 'income' ? tx.amount : -tx.amount)}
                          </span>
                          <span className="text-[9px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-tighter">(Excluded)</span>
                        </div>
                      ) : (
                        <span className={tx.type === 'income' ? 'text-[#10b981] dark:text-emerald-400' : 'text-[#ef4444] dark:text-rose-400'}>
                          {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.type === 'income' ? tx.amount : -tx.amount)}
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}

              {sortedTxs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground dark:text-slate-400 font-medium">
                    <HistoryIcon className="w-10 h-10 mx-auto mb-3 opacity-30 text-muted-foreground" />
                    No transaction history matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
