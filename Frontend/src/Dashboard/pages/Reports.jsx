import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { TrendingUp, Download, FileText, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import InvoiceTemplate from '../../components/InvoiceTemplate';

export default function Reports() {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const pdfRef = React.useRef(null);
  
  useEffect(() => {
    // Try to get updated profile first, otherwise fallback to login user
    const savedProfile = localStorage.getItem('profile_data');
    const userRaw = localStorage.getItem("user");
    
    let loadedUser = null;
    if (savedProfile) {
      loadedUser = JSON.parse(savedProfile);
    } else if (userRaw) {
      loadedUser = JSON.parse(userRaw);
    }
    setUser(loadedUser);

    const sessionUser = userRaw ? JSON.parse(userRaw) : null;
    const storageKey = `cashbook_txs_${sessionUser?.email_id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    addToast("Generating Tax Report PDF...", "info");
    
    try {
      const element = pdfRef.current;
      
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.85); // 85% quality JPEG drastically shrinks file size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, 1123] // A4 dimensions
      });
      
      // The 'FAST' alias compresses the image stream for buttery smooth PDF viewer scrolling
      pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123, undefined, 'FAST');
      pdf.save('CashBook_Tax_Report.pdf');
      
      addToast("Tax Report downloaded successfully!", "success");
    } catch (error) {
      console.error("PDF Error:", error);
      addToast(`Failed to generate PDF: ${error.message}`, "error");
    }
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
              <span className="font-bold text-income">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Total Deductible Expenses</span>
              <span className="font-bold text-expense">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold">Net Taxable Estimate</span>
              <span className="font-black text-xl text-primary">{formatCurrency(Math.max(0, totalIncome - totalExpense))}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden PDF Template Container */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={pdfRef}>
           <InvoiceTemplate user={user} transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
