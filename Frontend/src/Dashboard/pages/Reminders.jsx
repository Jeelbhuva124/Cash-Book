import React, { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reminders() {
  const { addToast } = useToast();
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', amount: '' });

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const storageKey = `cashbook_reminders_${user?.email_id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      const defaultReminders = [
        { id: '1', title: 'Pay Electricity Bill', date: '2026-07-20', amount: 1500, completed: false }
      ];
      setReminders(defaultReminders);
      localStorage.setItem(storageKey, JSON.stringify(defaultReminders));
    }
  }, []);

  const saveReminders = (newReminders) => {
    setReminders(newReminders);
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    localStorage.setItem(`cashbook_reminders_${user?.email_id || 'guest'}`, JSON.stringify(newReminders));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    const newReminder = {
      id: Date.now().toString(),
      title: form.title,
      date: form.date,
      amount: parseFloat(form.amount) || 0,
      completed: false
    };
    saveReminders([...reminders, newReminder]);
    setShowModal(false);
    setForm({ title: '', date: '', amount: '' });
    addToast("Reminder added!", "success");
  };

  const toggleComplete = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    saveReminders(updated);
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    saveReminders(updated);
    addToast("Reminder deleted", "info");
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 bg-background min-h-screen text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" />
            Financial Reminders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Never miss a payment or subscription.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mt-6">
        <ul className="divide-y divide-border/50">
          {reminders.sort((a,b) => new Date(a.date) - new Date(b.date)).map(reminder => (
            <li key={reminder.id} className={`p-4 md:p-6 flex items-center justify-between transition-colors hover:bg-muted/30 ${reminder.completed ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleComplete(reminder.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${reminder.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 hover:border-primary'}`}
                >
                  {reminder.completed && <CheckCircle className="w-4 h-4" />}
                </button>
                <div>
                  <h3 className={`font-bold text-lg ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>{reminder.title}</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {reminder.date}</span>
                    {reminder.amount > 0 && <span className="flex items-center gap-1 text-expense font-bold">₹{reminder.amount.toLocaleString()}</span>}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteReminder(reminder.id)}
                className="p-2 text-muted-foreground hover:text-expense hover:bg-expense-bg rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
          {reminders.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No upcoming reminders.
            </div>
          )}
        </ul>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-[400px] z-10 space-y-6">
              <h3 className="font-extrabold text-xl flex items-center gap-2">Add Reminder</h3>
              <form onSubmit={handleAddReminder} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
                  <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Netflix Subscription" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Due Date</label>
                  <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹) - Optional</label>
                  <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="649" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 mt-4">Save Reminder</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
