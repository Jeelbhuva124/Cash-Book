import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { 
  TrendingUp, Download, FileText, Calendar, Printer, 
  CheckCircle2, ArrowUpRight, ArrowDownRight, Wallet, 
  FileSpreadsheet, Sparkles, Loader2 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import InvoiceTemplate from '../../components/InvoiceTemplate';
import Dropdown from '../components/Dropdown';

export default function Reports() {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    // 1. Load user profile (from profile_data or user in localStorage)
    const savedProfile = localStorage.getItem('profile_data');
    const userRaw = localStorage.getItem("user");
    
    let loadedUser = null;
    if (savedProfile) {
      try { loadedUser = JSON.parse(savedProfile); } catch (e) {}
    } else if (userRaw) {
      try { loadedUser = JSON.parse(userRaw); } catch (e) {}
    }
    
    // Fallback default user if needed
    if (!loadedUser) {
      loadedUser = { username: 'Jash Narola', email_id: 'jash.narola567@gmail.com' };
    }
    setUser(loadedUser);

    // 2. Load cached transactions immediately
    const sessionUser = userRaw ? JSON.parse(userRaw) : null;
    const userEmail = (sessionUser?.email_id || sessionUser?.email || '').toLowerCase().trim();
    const userId = (sessionUser?.id || sessionUser?._id || sessionUser?.user_id || sessionUser?.uid || '').toString().trim();
    const storageKey = `cashbook_txs_${userEmail || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTransactions(parsed.filter(t => !t.is_deleted && !t.deleted));
      } catch (e) {}
    }

<<<<<<< HEAD
    // 3. Fetch latest transactions from API
    fetch('http://localhost:5001/api/transaction/select')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const validTxs = data.data.filter(t => !t.is_deleted && !t.deleted);
          setTransactions(validTxs);
        }
      })
      .catch(err => {
        console.warn("Could not fetch remote transactions, using cached data:", err);
      });
=======
    // Fetch fresh user transactions from API
    fetch('http://localhost:5001/api/transaction/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, user_email: userEmail })
    })
      .then(res => {
        if (!res.ok) {
          return fetch('http://localhost:5001/api/transaction/select');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const userFiltered = data.data.filter(t => {
            if (t.is_deleted || t.deleted) return false;
            const txUserId = (t.user_id || '').trim();
            const txEmail = (t.user_email || '').toLowerCase().trim();
            if (userId && txUserId) return txUserId === userId;
            if (!txUserId && userEmail && txEmail) return txEmail === userEmail;
            if (!userId && userEmail && txEmail) return txEmail === userEmail;
            return false;
          });
          setTransactions(userFiltered);
        }
      })
      .catch(e => console.error("Reports fetch error:", e));
>>>>>>> 6f294b21f25fb66fb881a867cc6bee2b2d774196
  }, []);

  // Filter transactions according to selected period
  const filteredTransactions = transactions.filter(t => {
    if (periodFilter === 'all') return true;
    if (!t.date) return false;
    
    const txDate = new Date(t.date);
    if (isNaN(txDate.getTime())) return false;

    const now = new Date();
    if (periodFilter === 'this_month') {
      return txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth();
    }
    if (periodFilter === 'last_30') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return txDate >= thirtyDaysAgo;
    }
    if (periodFilter === 'fy_2025_2026') {
      const fyStart = new Date('2025-04-01T00:00:00Z');
      const fyEnd = new Date('2026-03-31T23:59:59Z');
      return txDate >= fyStart && txDate <= fyEnd;
    }
    return true;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  // Compute period label for document header
  const getPeriodLabel = () => {
    const today = new Date();
    if (periodFilter === 'this_month') {
      return today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    if (periodFilter === 'last_30') {
      return 'Last 30 Days';
    }
    if (periodFilter === 'fy_2025_2026') {
      return 'FY 2025–2026';
    }
    return `As of ${today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    setIsExporting(true);
    addToast("Generating A4 Accounting Ledger PDF...", "info");
    
    try {
      const container = pdfRef.current;
      const pageSheets = container.querySelectorAll('.a4-page-sheet');
      
      if (!pageSheets || pageSheets.length === 0) {
        throw new Error("Report page element not found.");
      }

      // Initialize standard ISO A4 Document in Millimeters
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      for (let i = 0; i < pageSheets.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(pageSheets[i], {
          scale: 2, // Crisp 2x retina definition
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        // Place precisely on standard 210mm x 297mm A4 Page
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      const dateStamp = new Date().toISOString().slice(0, 10);
      const fileName = `CashBook_Accounting_Ledger_${dateStamp}.pdf`;
      pdf.save(fileName);
      
      addToast("A4 Accounting Ledger downloaded successfully!", "success");
    } catch (error) {
      console.error("PDF Export Error:", error);
      addToast(`Failed to generate PDF: ${error.message}`, "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen text-foreground">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Accounting Reports & Ledgers
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Generate official standard A4 certified financial statements and tax ledgers.
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Period Selection Custom Dropdown */}
          <div className="w-48">
            <Dropdown
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="this_month">Current Month</option>
              <option value="last_30">Last 30 Days</option>
              <option value="fy_2025_2026">FY 2025–2026</option>
            </Dropdown>
          </div>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-sm font-semibold transition-all shadow-sm"
            title="Print Ledger"
          >
            <Printer className="w-4 h-4 text-muted-foreground" />
            Print
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download A4 PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Income</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-income tracking-tight">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-xs text-muted-foreground">
            {filteredTransactions.filter(t => t.type === 'income').length} credit transactions
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Expense</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-expense tracking-tight">
            {formatCurrency(totalExpense)}
          </p>
          <p className="text-xs text-muted-foreground">
            {filteredTransactions.filter(t => t.type === 'expense').length} debit transactions
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Net Balance</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black tracking-tight ${netBalance >= 0 ? 'text-primary' : 'text-expense'}`}>
            {formatCurrency(netBalance)}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {netBalance >= 0 ? 'Surplus Financial Position' : 'Deficit Financial Position'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Ledger Records</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black tracking-tight">
            {filteredTransactions.length}
          </p>
          <p className="text-xs text-muted-foreground">
            Period: {getPeriodLabel()}
          </p>
        </div>
      </div>

      {/* Live Interactive A4 Document Preview */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              Official Document Live Preview
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Standard ISO A4 (210 × 297 mm) format matching official government and tax ledger standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              A4 Certified Format
            </span>
          </div>
        </div>

        {/* Scrollable and scaled preview viewport */}
        <div className="w-full overflow-x-auto bg-[#e5ebf8] dark:bg-muted/30 p-4 sm:p-8 rounded-2xl flex justify-center items-start shadow-inner border border-border/60">
          <div className="scale-[0.52] xs:scale-[0.62] sm:scale-[0.75] md:scale-[0.88] lg:scale-100 origin-top transition-transform duration-200">
            <InvoiceTemplate
              user={user}
              transactions={filteredTransactions}
              timePeriod={getPeriodLabel()}
            />
          </div>
        </div>
      </div>

      {/* Dedicated Unscaled Container for High-Resolution PDF Capture */}
      <div
        style={{
          position: 'fixed',
          left: '-99999px',
          top: '0',
          width: '794px',
          zIndex: -9999,
          pointerEvents: 'none'
        }}
      >
        <div ref={pdfRef}>
          <InvoiceTemplate
            user={user}
            transactions={filteredTransactions}
            timePeriod={getPeriodLabel()}
          />
        </div>
      </div>
    </div>
  );
}
