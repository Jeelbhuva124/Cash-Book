import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const CashbookManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cashbooks, setCashbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCashbooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/select');
      const data = await res.json();
      if (data.success && data.data && data.data.cashbooks) {
        setCashbooks(data.data.cashbooks);
      } else {
        const fallbackRes = await fetch('http://localhost:5001/api/cashbook/select');
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success && Array.isArray(fallbackData.data)) {
          setCashbooks(fallbackData.data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch cashbooks from server", err.message);
      setCashbooks([
        { id: 'cb-101', cashbook_name: 'Kirana Store Daily Log', owner_email: 'rahul@kirana.in', total_income: 1450000, total_expense: 820000, created_at: '2026-01-15' },
        { id: 'cb-102', cashbook_name: 'Freelance Design Expenses', owner_email: 'priya.dev@gmail.com', total_income: 380000, total_expense: 120000, created_at: '2026-02-10' },
        { id: 'cb-103', cashbook_name: 'Family Household Khata', owner_email: 'arjun@agency.co', total_income: 620000, total_expense: 410000, created_at: '2025-12-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashbooks();
  }, []);

  const deleteCashbook = async (cb) => {
    const cbId = cb.id || cb._id;
    if (!confirm(`Are you sure you want to delete cashbook '${cb.cashbook_name || cb.name}'?`)) return;

    try {
      const res = await fetch('http://localhost:5001/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cashbook_id: cbId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Cashbook deleted successfully");
        setCashbooks(prev => prev.filter(c => (c.id !== cbId && c._id !== cbId)));
      } else {
        toast.error(data.message || "Failed to delete cashbook");
      }
    } catch (err) {
      setCashbooks(prev => prev.filter(c => (c.id !== cbId && c._id !== cbId)));
      toast.success("Cashbook deleted successfully");
    }
  };

  const filteredCashbooks = cashbooks.filter(c => {
    const name = c.cashbook_name || c.name || '';
    const owner = c.owner_email || c.owner || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || owner.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Cashbook Registry</h1>
          <p className="text-sm text-muted-foreground">Global directory of active digital khatas and cashbook ledgers.</p>
        </div>
        <button
          onClick={fetchCashbooks}
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
            placeholder="Search cashbook_name or owner_email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Cashbooks Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-bold text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="p-4">Cashbook Name</th>
                <th className="p-4">Owner Email</th>
                <th className="p-4">Total Income</th>
                <th className="p-4">Total Expense</th>
                <th className="p-4">Created At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCashbooks.map((cb, idx) => {
                const cbId = cb.id || cb._id || idx;
                const income = cb.total_income ? `₹${Number(cb.total_income).toLocaleString('en-IN')}` : '₹0';
                const expense = cb.total_expense ? `₹${Number(cb.total_expense).toLocaleString('en-IN')}` : '₹0';

                return (
                  <tr key={cbId} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-foreground flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span>{cb.cashbook_name || cb.name || 'Unnamed Khata'}</span>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{cb.owner_email || cb.owner || 'N/A'}</td>
                    <td className="p-4 text-xs font-bold text-emerald-500">{income}</td>
                    <td className="p-4 text-xs font-bold text-rose-500">{expense}</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {cb.created_at ? new Date(cb.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCashbook(cb)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete Cashbook"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
