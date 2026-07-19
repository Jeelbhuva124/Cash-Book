import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, X, Trash2, LayoutGrid, List, Edit, Eye, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

export default function Cashbooks() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [cashbooks, setCashbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCashbookName, setNewCashbookName] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Storage key matching Home.jsx 'chalans'
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const storageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;
  const txsStorageKey = `cashbook_txs_${user?.email_id || 'guest'}`;

  useEffect(() => {
    loadCashbooks();
  }, []);

  const loadCashbooks = () => {
    const saved = localStorage.getItem(storageKey);
    let loaded = [];
    if (saved) {
      try { loaded = JSON.parse(saved); } catch (e) {}
    }
    
    // Add default if empty
    if (loaded.length === 0) {
      loaded = [{ id: '1', name: 'General Cashbook', createdAt: new Date().toISOString() }];
      localStorage.setItem(storageKey, JSON.stringify(loaded));
    }
    
    setCashbooks(loaded);

    const savedTxs = localStorage.getItem(txsStorageKey);
    if (savedTxs) {
      try { setTransactions(JSON.parse(savedTxs)); } catch (e) {}
    }
  };

  const handleAddCashbook = (e) => {
    e.preventDefault();
    if (!newCashbookName.trim()) {
      addToast("Please enter a cashbook name", "warning");
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      name: newCashbookName.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [...cashbooks, newBook];
    setCashbooks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    addToast("Cashbook created successfully!", "success");
    setNewCashbookName('');
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (id === '1') {
      addToast("Cannot delete the default Cashbook", "warning");
      return;
    }
    const updated = cashbooks.filter(b => b.id !== id);
    setCashbooks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    addToast("Cashbook deleted.", "info");
  };

  const handleSelectCashbook = (id) => {
    // Navigate to the transactions page and pass the selected cashbook ID
    navigate('/dashboard/transactions', { state: { selectedCashbookId: id } });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 text-foreground bg-[#f4f6fc] dark:bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e293b] dark:text-foreground">
              Cashbooks
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your individual cashbooks here</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-card border border-border rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Cashbook
          </button>
        </div>
      </div>

      {/* Cashbooks View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {cashbooks.map(book => {
            const entryCount = transactions.filter(tx => tx.chalanId === book.id || (book.id === '1' && !tx.chalanId)).length;
            
            return (
            <div 
              key={book.id} 
              onClick={() => handleSelectCashbook(book.id)}
              className="bg-white dark:bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between p-6 h-full min-h-[160px]"
            >
              <div className="flex items-start justify-between w-full relative z-10">
                <div className="rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform w-12 h-12 mb-4">
                  <Book className="w-6 h-6" />
                </div>

                {book.id !== '1' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(book.id);
                    }}
                    className="p-2 text-muted-foreground hover:text-expense hover:bg-expense-bg/30 rounded-lg transition-colors"
                    title="Delete Cashbook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="relative z-10 flex justify-between items-end w-full">
                <div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{book.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {new Date(book.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center justify-center bg-primary/5 text-primary text-xs font-bold rounded-lg px-2.5 py-1.5 min-w-[2.5rem]">
                  {entryCount}
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl shadow-sm mt-6 overflow-hidden">
          <div className="p-4 border-b border-border/40 bg-muted/20">
            <h2 className="font-bold text-sm text-foreground">Cashbook List • <span className="text-muted-foreground font-normal">{cashbooks.length} Records</span></h2>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border/40 text-[13px] font-semibold text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Cashbook Name</th>
                  <th className="px-6 py-4 font-medium">Total Credit (In)</th>
                  <th className="px-6 py-4 font-medium">Total Debit (Out)</th>
                  <th className="px-6 py-4 font-medium">Current Balance</th>
                  <th className="px-6 py-4 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {cashbooks.map(book => {
                  const bookTxs = transactions.filter(tx => tx.chalanId === book.id || (book.id === '1' && !tx.chalanId));
                  const totalCredit = bookTxs.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
                  const totalDebit = bookTxs.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
                  const currentBalance = totalCredit - totalDebit;

                  return (
                    <tr key={book.id} className="hover:bg-muted/10 transition-colors group bg-white dark:bg-card">
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-[#1e293b] dark:text-foreground">{book.name}</span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 tracking-wide">
                              Updated about {new Date(book.createdAt).toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')} {new Date(book.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Default {book.name} cashbook</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-4 py-1.5 rounded-full border border-border/80 text-[13px] font-semibold text-foreground tracking-wide">
                          ₹{totalCredit.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-4 py-1.5 rounded-full border border-[#ef4444]/60 text-[#ef4444] text-[13px] font-semibold tracking-wide">
                          ₹{totalDebit.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[15px] text-[#10b981] tracking-wide">
                          ₹{currentBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2.5 opacity-100 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg border border-border/80 text-[#64748b] hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg border border-border/80 text-[#64748b] hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          {book.id !== '1' ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(book.id);
                              }}
                              className="p-1.5 rounded-lg border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button disabled className="p-1.5 rounded-lg border border-border/40 text-muted-foreground/30 cursor-not-allowed">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleSelectCashbook(book.id)}
                            className="p-1.5 rounded-lg border border-[#f87171]/40 text-[#f87171] hover:bg-[#f87171] hover:text-white transition-colors"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-sm p-6 w-full max-w-[400px] z-10 space-y-6"
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
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Cashbook Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCashbookName}
                    onChange={(e) => setNewCashbookName(e.target.value)}
                    placeholder="e.g. Personal, Business, Travel"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Cashbook
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
