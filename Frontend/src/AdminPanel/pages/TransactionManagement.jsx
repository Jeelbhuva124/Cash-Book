import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, TrendingUp, TrendingDown, Clock, Tag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/transactions');
      const data = await res.json();
      if (data.success && data.data) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch transactions from server", err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const title = t.title || '';
    const user = t.user_email || t.created_by || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) || user.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Transaction History</h1>
          <p className="text-sm text-muted-foreground">Global directory of all transactions across all cashbooks.</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 text-xs font-bold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search Header */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transaction title or user email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-6 py-4 font-bold">Transaction Details</th>
                <th className="px-6 py-4 font-bold">User / Owner</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                    <p className="font-semibold mb-1">No transactions found</p>
                    <p className="text-xs">Try adjusting your search query.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn, idx) => (
                  <tr key={txn.id || txn._id || idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0">
                          {txn.type?.toLowerCase() === 'income' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-rose-500" />}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-[14px]">{txn.title || "Untitled"}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Tag className="w-3 h-3" /> {txn.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold text-foreground">{txn.user_email || "Unknown"}</p>
                      <p className="text-[11px] text-muted-foreground">By {txn.created_by}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                        txn.type?.toLowerCase() === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-black text-[15px] ${txn.type?.toLowerCase() === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {txn.type?.toLowerCase() === 'income' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">{txn.payment_mode}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <div className="text-[12px] font-medium leading-tight">
                          <p className="text-foreground/90">{txn.date}</p>
                          <p className="text-[10px]">{txn.time}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
