import React, { useState, useEffect } from 'react';
import { Receipt, Search, Filter } from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const storageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  const filtered = transactions.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 bg-background min-h-screen text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Receipt className="w-8 h-8 text-primary" />
            Outflow Logs
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
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/70 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
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
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {tx.date}
                    </td>
                    <td className={`px-6 py-4 text-right font-black ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground font-medium">
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
