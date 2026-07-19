import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Receipt, Search, Filter, ArrowLeft, Wallet, ArrowUp, ArrowDown } from 'lucide-react';

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [cashbookName, setCashbookName] = useState('');

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
    const chalansStorageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;

    // Load chalans to find name
    let loadedChalans = [];
    const savedChalans = localStorage.getItem(chalansStorageKey);
    if (savedChalans) {
      try { loadedChalans = JSON.parse(savedChalans); } catch (e) { }
    }

    const stateId = location.state?.selectedCashbookId;
    if (stateId) {
      const found = loadedChalans.find(c => c.id === stateId);
      if (found) setCashbookName(found.name);
      else if (stateId === '1') setCashbookName("General Cashbook");
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

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Balance */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</p>
            <p className="text-2xl font-bold text-foreground">
              {totalBalance < 0 ? '-' : ''}₹{Math.abs(totalBalance).toLocaleString()}
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
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No logs found matching your search.
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
