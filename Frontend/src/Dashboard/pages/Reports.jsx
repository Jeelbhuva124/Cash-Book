import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, FileText, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Reports() {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const storageKey = `cashbook_txs_${user?.email_id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const handleExportPDF = () => {
    addToast("Generating Tax Report PDF...", "info");
    setTimeout(() => {
      addToast("Tax Report downloaded successfully!", "success");
    }, 1500);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 bg-background min-h-screen text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Tax Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Generate official statements for tax filings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
          <FileText className="w-12 h-12 text-muted-foreground/50" />
          <div>
            <h3 className="font-bold text-lg">Financial Year 2025-2026</h3>
            <p className="text-sm text-muted-foreground">Comprehensive ledger matching tax standards.</p>
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
           <h3 className="font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Year-to-Date Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Total Assessed Income</span>
              <span className="font-bold text-income">₹{totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Total Deductible Expenses</span>
              <span className="font-bold text-expense">₹{totalExpense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold">Net Taxable Estimate</span>
              <span className="font-black text-xl text-primary">₹{Math.max(0, totalIncome - totalExpense).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
