import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { PieChart, TrendingUp, TrendingDown, Activity, Wallet } from 'lucide-react';

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const storageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTransactions(parsed.filter(t => !t.is_deleted && !t.deleted));
    }
  }, []);

  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 bg-background min-h-screen text-foreground">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <PieChart className="w-8 h-8 text-primary" />
          Ledger Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Visualize your spending patterns and category breakdowns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Spending by Category
          </h3>
          
          {sortedCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map(([cat, amount]) => {
                const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{cat}</span>
                      <span>{formatCurrency(amount)} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Top Expenses
          </h3>
          <div className="space-y-3">
             {expenses.sort((a, b) => b.amount - a.amount).slice(0, 5).map(tx => (
               <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50">
                 <div>
                   <p className="font-semibold text-sm">{tx.title}</p>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase">{tx.category}</p>
                 </div>
                 <span className="font-black text-expense">{formatCurrency(-tx.amount)}</span>
               </div>
             ))}
             {expenses.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No expenses recorded yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
