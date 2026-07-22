import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, X, Trash2, Edit, Eye, ArrowRight, Palette, AlignLeft, ChevronsUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const COLOR_OPTIONS = [
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Indigo', hex: '#6366F1' },
];

const formatUpdatedDate = (dateString) => {
  if (!dateString) return 'about just now';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'about just now';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  } catch (e) {
    return 'about just now';
  }
};

export default function Cashbooks() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [cashbooks, setCashbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cashbookName, setCashbookName] = useState('');
  const [description, setDescription] = useState('');
  const [hexCode, setHexCode] = useState('#8B5CF6');
  const [loading, setLoading] = useState(false);

  // Storage key matching Home.jsx 'chalans'
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const storageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;
  const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;

  useEffect(() => {
    const controller = new AbortController();
    loadCashbooks(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const loadCashbooks = async (signal) => {
    try {
      const response = await fetch('http://localhost:5001/api/cashbook/select', { signal });
      const data = await response.json();
      
      if (data.success && data.data) {
        const userEmail = user?.email_id?.toLowerCase() || '';
        
        // Filter records on client-side as per project rules (no GET query params)
        const filteredData = data.data.filter(cb => cb.user_email?.toLowerCase() === userEmail);
        
        const mapped = filteredData.map(cb => ({
          id: cb.id,
          name: cb.cashbook_name,
          description: cb.description || '',
          hex_code: cb.hex_code || '#8B5CF6',
          createdAt: cb.createdAt || new Date().toISOString()
        }));
        setCashbooks(mapped);
        localStorage.setItem(storageKey, JSON.stringify(mapped));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Backend API select failed:", err);
        setCashbooks([]);
      }
    }

    const savedTxs = localStorage.getItem(txsStorageKey);
    if (savedTxs) {
      try { setTransactions(JSON.parse(savedTxs)); } catch (e) {}
    }
  };

  const handleAddCashbook = async (e) => {
    e.preventDefault();
    if (!cashbookName.trim()) {
      addToast("Please enter a cashbook name", "warning");
      return;
    }

    setLoading(true);

    const payload = {
      cashbook_name: cashbookName.trim(),
      description: description.trim(),
      hex_code: hexCode,
      user_email: user?.email_id || '',
      user_id: user?.id || ''
    };

    try {
      const response = await fetch('http://localhost:5001/api/cashbook/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success && data.data) {
        const created = {
          id: data.data.id,
          name: data.data.cashbook_name,
          description: data.data.description,
          hex_code: data.data.hex_code,
          createdAt: data.data.createdAt || new Date().toISOString()
        };

        const updated = [created, ...cashbooks];
        setCashbooks(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        addToast("Cashbook created successfully!", "success");
      } else {
        createLocalBook();
      }
    } catch (err) {
      console.warn("Backend save failed, keeping local copy:", err);
      createLocalBook();
    } finally {
      setLoading(false);
      setCashbookName('');
      setDescription('');
      setHexCode('#8B5CF6');
      setShowAddModal(false);
    }
  };

  const createLocalBook = () => {
    const newBook = {
      id: Date.now().toString(),
      name: cashbookName.trim(),
      description: description.trim(),
      hex_code: hexCode,
      createdAt: new Date().toISOString()
    };

    const updated = [newBook, ...cashbooks];
    setCashbooks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    addToast("Cashbook created locally!", "success");
  };

  const handleDelete = async (id) => {
    if (id === '1') {
      addToast("Cannot delete the default Cashbook", "warning");
      return;
    }

    try {
      await fetch('http://localhost:5001/api/cashbook/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.warn("API delete warning:", err);
    }

    const updated = cashbooks.filter(b => b.id !== id);
    setCashbooks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    addToast("Cashbook deleted.", "info");
  };

  const handleSelectCashbook = (id) => {
    navigate('/dashboard/transactions', { state: { selectedCashbookId: id } });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-foreground bg-[#f4f6fc] dark:bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e293b] dark:text-foreground">
              All Daily Chalans
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your daily chalans and transactions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Cashbook
          </button>
        </div>
      </div>

      {/* Cashbooks View (List only - Styled matching target layout) */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl shadow-sm mt-6 overflow-hidden">
        <div className="p-4 border-b border-border/40 bg-muted/20">
          <h2 className="font-bold text-sm text-foreground">Cashbook List • <span className="text-muted-foreground font-normal">{cashbooks.length} Records</span></h2>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-border/40 text-[13px] font-semibold text-muted-foreground bg-muted/10">
                <th className="px-6 py-4 font-medium w-[45%]">
                  <div className="flex items-center gap-1 select-none">
                    Cashbook Name
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium w-[15%]">
                  <div className="flex items-center gap-1 select-none">
                    Total Credit (In)
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium w-[15%]">
                  <div className="flex items-center gap-1 select-none">
                    Total Debit (Out)
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium w-[12%]">
                  <div className="flex items-center gap-1 select-none">
                    Current Balance
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-medium w-[13%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {cashbooks.map(book => {
                const bookTxs = transactions.filter(tx => tx.chalanId === book.id || (book.id === '1' && !tx.chalanId));
                const totalCredit = bookTxs.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
                const totalDebit = bookTxs.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
                const currentBalance = totalCredit - totalDebit;
                const rowHex = book.hex_code || '#8B5CF6';
                const formattedDate = formatUpdatedDate(book.createdAt);

                return (
                  <tr key={book.id} className="hover:bg-muted/10 transition-colors group bg-white dark:bg-card">
                    <td className="px-6 py-4 w-[45%] align-middle">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: rowHex }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-[#1e293b] dark:text-foreground">
                              {book.name}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                              Updated about {formattedDate}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[400px]">
                            {book.description || `Default ${book.name} cashbook`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[15%] align-middle">
                      <span className="inline-flex px-4 py-1.5 rounded-full border border-border/80 text-[13px] font-semibold text-foreground tracking-wide whitespace-nowrap">
                        {formatCurrency(totalCredit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-[15%] align-middle">
                      <span className="inline-flex px-4 py-1.5 rounded-full border border-[#ef4444]/60 text-[#ef4444] text-[13px] font-semibold tracking-wide whitespace-nowrap">
                        {formatCurrency(totalDebit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-[12%] align-middle">
                      <span className="font-bold text-[15px] text-[#10b981] tracking-wide whitespace-nowrap">
                        {formatCurrency(currentBalance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-[13%] text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleSelectCashbook(book.id)}
                          className="p-1.5 rounded-lg border border-border/80 bg-[#f8fafc] text-muted-foreground hover:text-primary hover:bg-[#2563eb]/10 transition-colors"
                          title="View Log"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg border border-border/80 bg-[#f8fafc] text-muted-foreground hover:text-primary hover:bg-[#4f46e5]/10 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {book.id !== '1' ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(book.id);
                            }}
                            className="p-1.5 rounded-lg border border-border/80 bg-[#f8fafc] text-muted-foreground hover:text-expense hover:bg-expense-bg/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-expense" />
                          </button>
                        ) : (
                          <button disabled className="p-1.5 rounded-lg border border-border/40 text-muted-foreground/30 cursor-not-allowed bg-muted/10">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleSelectCashbook(book.id)}
                          className="p-1.5 rounded-lg border border-border/80 bg-[#f8fafc] text-muted-foreground hover:bg-[#f97316]/10 hover:text-[#f97316] transition-colors"
                          title="Enter Cashbook"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-xl p-6 w-full max-w-[440px] z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <Book className="w-5 h-5 text-primary" />
                  Create Cashbook
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCashbook} className="space-y-4">
                {/* Cashbook Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                    Cashbook Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={cashbookName}
                    onChange={(e) => setCashbookName(e.target.value)}
                    placeholder="e.g. Personal, Business, Travel"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <AlignLeft className="w-3.5 h-3.5" />
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary of what this cashbook is for..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card resize-none"
                  />
                </div>

                {/* Hex Code / Color Theme */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5" />
                      Color Theme (Hex Code)
                    </span>
                    <span className="font-mono text-xs font-semibold" style={{ color: hexCode }}>
                      {hexCode}
                    </span>
                  </label>

                  <div className="flex items-center gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setHexCode(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          hexCode === c.hex ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  {loading ? 'Creating...' : 'Create Cashbook'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
