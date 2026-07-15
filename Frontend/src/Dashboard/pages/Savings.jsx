import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, Target, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Savings() {
  const { addToast } = useToast();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', target: '', current: '' });

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const storageKey = `cashbook_savings_${user?.email_id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      const defaultGoals = [
        { id: '1', title: 'Emergency Fund', target: 500000, current: 150000 }
      ];
      setGoals(defaultGoals);
      localStorage.setItem(storageKey, JSON.stringify(defaultGoals));
    }
  }, []);

  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    localStorage.setItem(`cashbook_savings_${user?.email_id || 'guest'}`, JSON.stringify(newGoals));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!form.title || !form.target) return;
    const newGoal = {
      id: Date.now().toString(),
      title: form.title,
      target: parseFloat(form.target),
      current: parseFloat(form.current) || 0
    };
    saveGoals([...goals, newGoal]);
    setShowModal(false);
    setForm({ title: '', target: '', current: '' });
    addToast("Savings goal created!", "success");
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 bg-background min-h-screen text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <PiggyBank className="w-8 h-8 text-primary" />
            Savings Targets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Set goals and track your progress.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {goals.map(goal => {
          const percentage = Math.min(100, ((goal.current / goal.target) * 100)).toFixed(1);
          return (
            <div key={goal.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{goal.title}</h3>
                  <p className="text-xs font-semibold text-primary mt-1">Target: ₹{goal.target.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm font-bold text-muted-foreground">
                  <span>Saved: ₹{goal.current.toLocaleString()}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-income rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No savings goals set. Create one to get started!
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-[400px] z-10 space-y-6">
              <h3 className="font-extrabold text-xl flex items-center gap-2">New Savings Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Goal Title</label>
                  <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Dream Car" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Target Amount (₹)</label>
                  <input type="number" required value={form.target} onChange={e => setForm({...form, target: e.target.value})} placeholder="1000000" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Current Saved (₹)</label>
                  <input type="number" value={form.current} onChange={e => setForm({...form, current: e.target.value})} placeholder="50000" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 mt-4">Create Goal</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
