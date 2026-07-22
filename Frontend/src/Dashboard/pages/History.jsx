import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load user session
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;

  useEffect(() => {
    const savedTxs = localStorage.getItem(txsStorageKey);
    if (savedTxs) {
      try {
        setTransactions(JSON.parse(savedTxs));
      } catch (e) {
        console.error(e);
      }
    }
  }, [txsStorageKey]);

  // Filter transactions
  const filteredTxs = transactions.filter(tx => 
    tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 w-full space-y-6 text-foreground bg-transparent dark:bg-transparent min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e293b] dark:text-foreground">
              Transaction History
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">View and search your complete transaction ledger</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </span>
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-card border border-border/80 rounded-xl focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground shadow-sm"
          />
        </div>
      </div>

      {/* Content area - Ledger */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
        {filteredTxs.length === 0 ? (
          <div className="flex items-center justify-center flex-col py-16 text-center text-muted-foreground">
            <HistoryIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No history records found.</p>
            <p className="text-xs opacity-70 mt-1">Try adjusting your search or add a new transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 px-2">Title</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Payment Mode</th>
                  <th className="pb-3 px-2">Date & Time</th>
                  <th className="pb-3 px-2">IP Location</th>
                  <th className="pb-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTxs.map((tx) => (
                  <tr key={tx.id} className="text-sm hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-expense'}`} />
                        {tx.title}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{tx.category}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{tx.paymentMode || 'Cash'}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">
                      <div className="flex flex-col">
                        <span>{tx.date}</span>
                        <span className="opacity-70 text-[10px]">
                          {/* Fallback in case ID is not a timestamp */}
                          {!isNaN(parseInt(tx.id)) && tx.id.length > 10 
                            ? new Date(parseInt(tx.id)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs font-mono">{tx.location || 'Unknown'}</td>
                    <td className={`py-3 px-2 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.type === 'income' ? tx.amount : -tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

