import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CreditCard, RefreshCw, CheckCircle2, Package, Plus, X, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useToast } from '../../context/ToastContext';

export default function Tracker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', amount: '', due_date: '', start_date: '', end_date: '', type: 'EMI' });
  const { addToast } = useToast();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/emi-subscription/select');
      const data = await res.json();
      
      if (data.success) {
        if (data.data.length === 0) {
          await seedInitialData();
        } else {
          setItems(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch EMIs/Subscriptions:', error);
      addToast("Failed to load Tracker data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const seedInitialData = async () => {
    const seedData = [
      {
        title: "Google AI Pro",
        amount: 1950,
        due_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        type: "Subscription",
        status: "Active",
        user_email: user?.email_id || "",
        chalan_id: "1"
      },
      {
        title: "Free Fire MAX Pass",
        amount: 399,
        due_date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
        type: "Subscription",
        status: "Active",
        user_email: user?.email_id || "",
        chalan_id: "1"
      },
      {
        title: "Dell Laptop EMI",
        amount: 4500,
        due_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
        type: "EMI",
        status: "Active",
        user_email: user?.email_id || "",
        chalan_id: "1"
      }
    ];

    try {
      const res = await fetch('http://localhost:5001/api/emi-subscription/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seedData)
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (e) {
      console.error('Seed Data Error:', e);
    }
  };

  const handleMarkAsPaid = async (id) => {
    setAnimatingId(id);
    
    try {
      const res = await fetch('http://localhost:5001/api/emi-subscription/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      
      if (data.success) {
        setTimeout(() => {
          setItems(prevItems => 
            prevItems.map(item => item.id === id ? data.data : item)
          );
          setAnimatingId(null);
          addToast("Marked as paid! Transaction created.", "success");
        }, 1500); // Wait for the checkmark animation to finish
      } else {
        setAnimatingId(null);
        addToast(data.message || "Failed to mark as paid.", "error");
      }
    } catch (error) {
      console.error("Payment API Error:", error);
      setAnimatingId(null);
      addToast("Network error. Could not mark as paid.", "error");
    }
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.amount || !newItem.due_date) {
      addToast("Please fill all fields", "warning");
      return;
    }

    const payload = {
      title: newItem.title.trim(),
      amount: parseFloat(newItem.amount),
      due_date: newItem.due_date,
      start_date: newItem.start_date,
      end_date: newItem.end_date,
      type: newItem.type,
      status: 'Active',
      user_email: user?.email_id || '',
      chalan_id: '1'
    };

    try {
      const res = await fetch('http://localhost:5001/api/emi-subscription/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setItems(prev => [...prev, data.data].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
        setShowAddForm(false);
        setNewItem({ title: '', amount: '', due_date: '', start_date: '', end_date: '', type: 'EMI' });
        addToast("Added successfully!", "success");
      } else {
        addToast(data.message || "Failed to add item.", "error");
      }
    } catch (error) {
      console.error("Add Item Error:", error);
      addToast("Network error. Could not save item.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this entry?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/emi-subscription/delete/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(item => item.id !== id));
        addToast("Deleted successfully", "success");
      } else {
        addToast("Failed to delete", "error");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      addToast("Network error during delete.", "error");
    }
  };

  const calculateDaysLeft = (dueDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft < 0) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
    if (daysLeft <= 7) return 'text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
    return 'text-green-600 dark:text-emerald-400 bg-green-100 dark:bg-emerald-500/10 border-green-200 dark:border-emerald-500/20';
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();

  const isPaidThisMonth = (item) => {
    if (!item.last_paid_date) return false;
    const lastPaid = new Date(item.last_paid_date);
    return lastPaid.getMonth() === currentMonth && lastPaid.getFullYear() === currentYear;
  };

  const activeItems = items.filter(i => i.status !== 'Completed' && !isPaidThisMonth(i)).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const paidThisMonthItems = items.filter(i => i.status !== 'Completed' && isPaidThisMonth(i)).sort((a, b) => new Date(b.last_paid_date) - new Date(a.last_paid_date));
  const completedItems = items.filter(i => i.status === 'Completed');

  return (
    <div className="p-6 md:p-8 w-full min-h-screen text-foreground space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111827]/90 border border-border/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e293b] dark:text-slate-100 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary" />
            EMI & Subscriptions Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Manage your recurring payments. Click 'Mark as Paid' to automatically log the expense and shift the due date.
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary dark:bg-indigo-600 text-primary-foreground font-bold rounded-xl text-sm hover:opacity-95 dark:hover:bg-indigo-500 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* ITEMS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {activeItems.map((item) => {
            const daysLeft = calculateDaysLeft(item.due_date);
            const urgencyClasses = getUrgencyColor(daysLeft);
            const isAnimating = animatingId === item.id;

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="p-6">
                  {/* Type Badge & Delete */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${item.type === 'EMI' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' : 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'}`}>
                        {item.type === 'EMI' ? <CreditCard className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                        {item.type}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${urgencyClasses}`}>
                        <Calendar className="w-3 h-3" />
                        {daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} days` : daysLeft === 0 ? 'Due Today' : `Due in ${daysLeft} days`}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Amount */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-3xl font-black text-foreground">
                      {formatCurrency(item.amount)}
                      <span className="text-sm font-medium text-muted-foreground ml-1">/ month</span>
                    </p>
                  </div>

                  {/* Date info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 font-medium">
                    Next Due: <span className="text-foreground">{new Date(item.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {/* Action Button */}
                  <div className="relative h-12">
                    <AnimatePresence mode="wait">
                      {isAnimating ? (
                        <motion.div
                          key="animating"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20"
                        >
                          <CheckCircle2 className="w-6 h-6 mr-2" />
                          Paid Successfully!
                        </motion.div>
                      ) : (
                        <motion.button
                          key="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => handleMarkAsPaid(item.id)}
                          className="absolute inset-0 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Mark as Paid
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeItems.length === 0 && (
          <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-border shadow-sm">
            <p className="text-muted-foreground font-medium mb-4">No Upcoming EMIs or Subscriptions.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Entry
            </button>
          </div>
        )}
      </div>

      {/* COMPLETED SECTION */}
      {completedItems.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold tracking-tight text-[#1e293b] dark:text-slate-100 flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-indigo-500" />
            Completed EMIs
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedItems.map((item) => (
              <div
                key={`completed-${item.id}`}
                className="bg-card/50 rounded-2xl border border-border overflow-hidden shadow-sm opacity-80"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-indigo-100 text-indigo-700 border-indigo-200">
                      Completed
                    </span>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-foreground line-through decoration-indigo-500/30 mb-1">{item.title}</h3>
                    <p className="text-2xl font-black text-foreground">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Started: {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'} <br/>
                    Ended: {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* RECENTLY PAID SECTION */}
      {paidThisMonthItems.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold tracking-tight text-[#1e293b] dark:text-slate-100 flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Paid This Month
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {paidThisMonthItems.map((item) => (
                <motion.div
                  layout
                  key={`paid-${item.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800/30 overflow-hidden shadow-sm relative opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Paid
                      </span>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-foreground line-through decoration-green-500/50 mb-1">{item.title}</h3>
                      <p className="text-2xl font-black text-foreground">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>

                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Paid on: {new Date(item.last_paid_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ADD NEW MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-[#111827] border border-border dark:border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2 dark:text-slate-100">
                  <Plus className="w-5 h-5 text-primary dark:text-indigo-400" />
                  Add New Entry
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full hover:bg-muted dark:hover:bg-slate-800 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted dark:bg-slate-900 border border-border/50 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setNewItem({ ...newItem, type: 'EMI' })}
                      className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        newItem.type === 'EMI'
                          ? 'bg-white dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-500/30'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> EMI
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewItem({ ...newItem, type: 'Subscription' })}
                      className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        newItem.type === 'Subscription'
                          ? 'bg-white dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 shadow-sm border border-purple-200 dark:border-purple-500/30'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" /> Subscription
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Title (e.g. Netflix, Car Loan)</label>
                  <input
                    type="text"
                    required
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium bg-white dark:bg-card"
                  />
                </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Start Date</label>
                      <input
                        type="date"
                        value={newItem.start_date}
                        onChange={(e) => setNewItem({ ...newItem, start_date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium bg-white dark:bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">End Date {newItem.type === 'Subscription' && '(Optional)'}</label>
                      <input
                        type="date"
                        required={newItem.type === 'EMI'}
                        min={new Date().toISOString().split('T')[0]}
                        value={newItem.end_date}
                        onChange={(e) => setNewItem({ ...newItem, end_date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium bg-white dark:bg-card"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Amount (₹)</label>
                      <input
                        type="number"
                        required
                        value={newItem.amount}
                        onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-bold bg-white dark:bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Next Due Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={newItem.due_date}
                        onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium bg-white dark:bg-card"
                      />
                    </div>
                  </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl py-3 mt-4 transition-colors"
                >
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
