import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, MessageCircle, ChevronDown, ChevronUp, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';

export default function PartyLedger() {
  const [partyData, setPartyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedParty, setExpandedParty] = useState(null);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [formData, setFormData] = useState({
    party_name: '',
    entry_type: 'gave', // 'gave' or 'got'
    amount: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
  });

  const { addToast } = useToast();
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const user_email = user?.email_id || 'guest';

  useEffect(() => {
    fetchPartyLedger();
  }, []);

  const fetchPartyLedger = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/transaction/party-ledger');
      const data = await res.json();
      if (data.success) {
        setPartyData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch party ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (partyName) => {
    if (expandedParty === partyName) {
      setExpandedParty(null);
    } else {
      setExpandedParty(partyName);
    }
  };

  const handleWhatsAppReminder = (partyName, balance) => {
    const message = `Hello ${partyName}, aapka ₹${Math.abs(balance)} baaki hai Cash-Book ke hisaab se.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!formData.party_name || !formData.amount || !formData.title || !formData.date) {
      addToast('Please fill all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        type: 'party',
        amount: Number(formData.amount),
        date: formData.date,
        time: new Date().toLocaleTimeString([], { hour12: false }),
        chalan_id: `PTY-${Date.now()}`,
        party_name: formData.party_name,
        party_type: formData.entry_type === 'gave' ? 'debtor' : 'creditor',
        user_email
      };

      const res = await fetch('http://localhost:5001/api/transaction/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success) {
        setIsSuccessAnim(true);
        fetchPartyLedger(); // Refresh data
        setTimeout(() => {
          setIsSuccessAnim(false);
          setIsModalOpen(false);
          setFormData({
            ...formData,
            party_name: '',
            amount: '',
            title: ''
          });
        }, 1500);
      } else {
        addToast(result.message || 'Failed to save', 'error');
      }
    } catch (error) {
      addToast('Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Party Ledger (Udhaar Book)</h1>
          <p className="text-muted-foreground mt-2">Track who owes you and whom you owe</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>

      {partyData.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
          <p className="text-muted-foreground">No party transactions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {partyData.map((party, index) => {
            const isOweMe = party.net_balance > 0;
            const isIOwe = party.net_balance < 0;
            const balanceColor = isOweMe ? 'text-green-500' : isIOwe ? 'text-red-500' : 'text-gray-500';
            const balanceBg = isOweMe ? 'bg-green-500/10' : isIOwe ? 'bg-red-500/10' : 'bg-gray-500/10';
            const balanceIcon = isOweMe ? <TrendingUp className="w-5 h-5" /> : isIOwe ? <TrendingDown className="w-5 h-5" /> : null;
            const isExpanded = expandedParty === party.party_name;

            return (
              <motion.div
                key={party.party_name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{party.party_name}</h3>
                    <div className={`p-2 rounded-full ${balanceBg} ${balanceColor}`}>
                      {balanceIcon}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
                    <p className={`text-3xl font-bold ${balanceColor}`}>
                      ₹{Math.abs(party.net_balance).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isOweMe ? 'They owe you' : isIOwe ? 'You owe them' : 'Settled'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {party.net_balance !== 0 && (
                      <button
                        onClick={() => handleWhatsAppReminder(party.party_name, party.net_balance)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reminder
                      </button>
                    )}
                    <button
                      onClick={() => toggleExpand(party.party_name)}
                      className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                    >
                      History
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border bg-muted/30"
                    >
                      <div className="p-4 max-h-60 overflow-y-auto space-y-3">
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Transaction History</h4>
                        {party.transactions.map((tx) => (
                          <div key={tx.id} className="flex justify-between items-center p-3 bg-card rounded-lg border border-border shadow-sm text-sm">
                            <div>
                              <p className="font-medium">{tx.title}</p>
                              <p className="text-xs text-muted-foreground">{tx.date} • {tx.payment_mode}</p>
                            </div>
                            <div className={`font-semibold ${tx.party_type === 'debtor' ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.party_type === 'debtor' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Add Party Entry
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, entry_type: 'gave'})}
                    className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                      formData.entry_type === 'gave' 
                        ? 'border-red-500 bg-red-500/10 text-red-500' 
                        : 'border-border bg-card hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <TrendingDown className="w-5 h-5" />
                    I Gave (Diyee)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, entry_type: 'got'})}
                    className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                      formData.entry_type === 'got' 
                        ? 'border-green-500 bg-green-500/10 text-green-500' 
                        : 'border-border bg-card hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    I Got (Milee)
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Party Name <span className="text-destructive">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rahul, Office, or Amit"
                      value={formData.party_name}
                      onChange={(e) => setFormData({...formData, party_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Amount (₹) <span className="text-destructive">*</span></label>
                    <input 
                      type="number" 
                      required
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Title / Note <span className="text-destructive">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. For dinner, Project advance"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2 relative h-12">
                  <AnimatePresence mode="wait">
                    {isSuccessAnim ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 flex items-center justify-center bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Saved Successfully!
                      </motion.div>
                    ) : (
                      <motion.button 
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="absolute inset-0 w-full flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          'Save Entry'
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
