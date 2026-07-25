import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, Search, Filter, ArrowLeft, Wallet, ArrowUp, ArrowDown, 
  Plus, Trash2, X, CheckCircle2, Pencil, ChevronsUpDown, Upload 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Dropdown from '../components/Dropdown';
import ConfirmModal from '../components/ConfirmModal';


const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD to DD-MM-YYYY
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

const formatTime = (txId) => {
  try {
    const timestamp = parseInt(txId);
    if (isNaN(timestamp)) return '';
    const d = new Date(timestamp);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  } catch (e) {
    return '';
  }
};

export default function Transactions() {
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [cashbookName, setCashbookName] = useState('All Logs');
  const [cashbookDesc, setCashbookDesc] = useState('Detailed history of all your transactions.');
  
  // Add Entry Modal States
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [remark, setRemark] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChalanId, setSelectedChalanId] = useState('1');
  const [chalans, setChalans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [editTxId, setEditTxId] = useState(null);

  // Column level filters state
  const [searchFilters, setSearchFilters] = useState({
    no: '',
    type: '',
    date: '',
    time: '',
    amount: '',
    balance: '',
    category: '',
    subcategory: '',
    paymentMode: '',
    remark: '',
    createdBy: ''
  });

  // Sorting configurations state
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Checked Rows Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Import CSV states
  const [showImportForm, setShowImportForm] = useState(false);
  const [importPreview, setImportPreview] = useState([]);

  // Get current logged-in user details
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const username = user?.username || 'Guest';

  const loadCategoriesAndModes = async (chalanId) => {
    if (!chalanId) return;
    const userEmail = user?.email_id?.toLowerCase() || '';

    // Fetch Categories
    try {
      const res = await fetch('http://localhost:5001/api/category/select');
      const data = await res.json();
      if (data.success && data.data) {
        const filtered = data.data.filter(cat => 
          cat.user_email?.toLowerCase() === userEmail &&
          cat.chalan_id === chalanId &&
          cat.active
        );
        const mapped = filtered.map(c => ({
          id: c.id,
          name: c.category_name,
          active: c.active
        }));
        setCategories(mapped);
        if (mapped.length > 0) {
          setCategory(mapped[0].name);
        } else {
          setCategory('');
        }
      }
    } catch (err) {
      console.error("Failed to load categories from API:", err);
    }

    // Fetch Payment Modes
    try {
      const res = await fetch('http://localhost:5001/api/payment-mode/select');
      const data = await res.json();
      if (data.success && data.data) {
        const filtered = data.data.filter(pm => 
          pm.user_email?.toLowerCase() === userEmail &&
          pm.chalan_id === chalanId &&
          pm.active
        );
        const mapped = filtered.map(p => ({
          id: p.id,
          name: p.payment_mode,
          active: p.active
        }));
        setPaymentModes(mapped);
        if (mapped.length > 0) {
          setPaymentMode(mapped[0].name);
        } else {
          setPaymentMode('');
        }
      }
    } catch (err) {
      console.error("Failed to load payment modes from API:", err);
    }
  };

  const handleAddNewCategory = async (catName) => {
    if (!selectedChalanId) {
      addToast("Please select a cashbook first", "warning");
      return;
    }
    const payload = {
      category_name: catName,
      active: true,
      chalan_id: selectedChalanId,
      created_by: username,
      updated_by: username,
      user_email: user?.email_id || ''
    };

    try {
      const response = await fetch('http://localhost:5001/api/category/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.data) {
        addToast(`Category "${catName}" created and selected!`, "success");
        const newCat = {
          id: data.data.id,
          name: data.data.category_name,
          active: data.data.active
        };
        setCategories(prev => [newCat, ...prev]);
        setCategory(data.data.category_name);
      } else {
        addToast(data.message || "Failed to add category", "error");
      }
    } catch (err) {
      console.error("Quick Add Category error:", err);
      addToast("Failed to add category to database", "error");
    }
  };

  const handleAddNewPaymentMode = async (modeName) => {
    if (!selectedChalanId) {
      addToast("Please select a cashbook first", "warning");
      return;
    }
    const payload = {
      payment_mode: modeName,
      active: true,
      chalan_id: selectedChalanId,
      created_by: username,
      updated_by: username,
      user_email: user?.email_id || ''
    };

    try {
      const response = await fetch('http://localhost:5001/api/payment-mode/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.data) {
        addToast(`Payment option "${modeName}" created and selected!`, "success");
        const newPm = {
          id: data.data.id,
          name: data.data.payment_mode,
          active: data.data.active
        };
        setPaymentModes(prev => [newPm, ...prev]);
        setPaymentMode(data.data.payment_mode);
      } else {
        addToast(data.message || "Failed to add payment option", "error");
      }
    } catch (err) {
      console.error("Quick Add Payment Option error:", err);
      addToast("Failed to add payment option to database", "error");
    }
  };

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const chalansStorageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;

    // Load chalans
    let loadedChalans = [];
    const savedChalans = localStorage.getItem(chalansStorageKey);
    if (savedChalans) {
      try { loadedChalans = JSON.parse(savedChalans); } catch (e) {}
    }
    setChalans(loadedChalans);

    const stateId = location.state?.selectedCashbookId;
    let chalanId = '1';
    if (stateId) {
      const found = loadedChalans.find(c => c.id === stateId);
      if (found) {
        setCashbookName(found.name);
        setCashbookDesc(found.description || `Default ${found.name} cashbook`);
      } else if (stateId === '1') {
        setCashbookName("General Cashbook");
        setCashbookDesc("Default General Cashbook");
      }
      setSelectedChalanId(stateId);
      chalanId = stateId;
    } else {
      setCashbookName("General Cashbook");
      setCashbookDesc("Default General Cashbook");
      setSelectedChalanId('1');
      chalanId = '1';
    }

    loadTransactions();
    loadCategoriesAndModes(chalanId);
  }, [location.state]);

  const loadTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/transaction/select');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Map backend properties (snake_case) to frontend (camelCase)
        const mapped = data.data.map(tx => ({
          id: tx.id,
          title: tx.title,
          type: tx.type,
          amount: tx.amount,
          date: tx.date,
          time: tx.time,
          chalanId: tx.chalan_id,
          category: tx.category,
          subcategory: tx.subcategory,
          paymentMode: tx.payment_mode,
          remark: tx.remark,
          createdBy: tx.created_by,
          user_email: tx.user_email
        }));

        // Client side filter by logged-in user's email
        const userEmail = user?.email_id?.toLowerCase() || '';
        const userTxs = mapped.filter(t => t.user_email?.toLowerCase() === userEmail);
        setTransactions(userTxs);
      }
    } catch (err) {
      console.error("Failed to load transactions from backend:", err);
      addToast("Failed to fetch transactions from database", "error");
    }
  };

  const handleDelete = (txId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Transaction",
      message: "Are you sure you want to delete this transaction? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch('http://localhost:5001/api/transaction/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: txId })
          });
          const data = await response.json();
          
          if (data.success) {
            setTransactions(transactions.filter(t => t.id !== txId));
            setSelectedIds(selectedIds.filter(id => id !== txId));
            addToast("Transaction deleted successfully", "success");
          } else {
            addToast(data.message || "Failed to delete transaction", "error");
          }
        } catch (err) {
          console.error("Delete call failed:", err);
          addToast("Failed to delete transaction from database", "error");
        }
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    
    setConfirmModal({
      isOpen: true,
      title: "Delete Selected Transactions",
      message: `Are you sure you want to delete the ${selectedIds.length} selected transaction(s)? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch('http://localhost:5001/api/transaction/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
          });
          const data = await response.json();

          if (data.success) {
            setTransactions(transactions.filter(t => !selectedIds.includes(t.id)));
            setSelectedIds([]);
            addToast(`${selectedIds.length} transactions deleted successfully`, "success");
          } else {
            addToast(data.message || "Failed to delete transactions", "error");
          }
        } catch (err) {
          console.error("Bulk delete call failed:", err);
          addToast("Failed to delete transactions from database", "error");
        }
      }
    });
  };

  const handleOpenAddForm = () => {
    setEditTxId(null);
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setSubcategory('');
    setRemark('');
    if (categories.length > 0) setCategory(categories[0].name);
    if (paymentModes.length > 0) setPaymentMode(paymentModes[0].name);
    setShowAddForm(true);
  };

  const handleEditClick = (tx) => {
    setEditTxId(tx.id);
    setTitle(tx.title);
    setType(tx.type);
    setCategory(tx.category);
    setPaymentMode(tx.paymentMode);
    setAmount(tx.amount.toString());
    setDate(tx.date);
    setSubcategory(tx.subcategory || '');
    setRemark(tx.remark === 'Null' ? '' : (tx.remark || ''));
    setSelectedChalanId(tx.chalanId || '1');
    setShowAddForm(true);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      addToast("Please fill valid fields", "warning");
      return;
    }

    const isEdit = !!editTxId;
    const url = isEdit 
      ? 'http://localhost:5001/api/transaction/update' 
      : 'http://localhost:5001/api/transaction/insert';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      title: title.trim(),
      type,
      amount: parseFloat(amount),
      date,
      time: !isEdit 
        ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
        : (transactions.find(t => t.id === editTxId)?.time || formatTime(editTxId)),
      chalan_id: selectedChalanId,
      category,
      subcategory: subcategory.trim(),
      payment_mode: paymentMode,
      remark: remark.trim() || 'Null',
      created_by: username,
      user_email: user?.email_id || ''
    };

    if (isEdit) {
      payload.id = editTxId;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success && data.data) {
        const savedTx = {
          id: data.data.id,
          title: data.data.title,
          type: data.data.type,
          amount: data.data.amount,
          date: data.data.date,
          time: data.data.time,
          chalanId: data.data.chalan_id,
          category: data.data.category,
          subcategory: data.data.subcategory,
          paymentMode: data.data.payment_mode,
          remark: data.data.remark,
          createdBy: data.data.created_by,
          user_email: data.data.user_email
        };

        if (isEdit) {
          setTransactions(transactions.map(t => t.id === editTxId ? savedTx : t));
          addToast("Transaction updated successfully", "success");
        } else {
          setTransactions([savedTx, ...transactions]);
          addToast("Transaction recorded successfully", "success");
        }
        setShowAddForm(false);
        setTitle('');
        setAmount('');
        setSubcategory('');
        setRemark('');
        setEditTxId(null);
      } else {
        addToast(data.message || "Failed to record transaction", "error");
      }
    } catch (err) {
      console.error("Save transaction error:", err);
      addToast("Failed to save transaction to database", "error");
    }
  };

  const handleFilterChange = (key, val) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = '';
      key = '';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/30 inline ml-0.5" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-3 h-3 text-primary inline ml-0.5" />;
    }
    return <ArrowDown className="w-3 h-3 text-primary inline ml-0.5" />;
  };

  // CSV Importer Logics
  const parseCSV = (text) => {
    const lines = text.split('\n');
    if (lines.length <= 1) return [];
    
    const parsed = [];
    let startIdx = 0;
    
    // Check if line 0 is a header row
    const headerLine = lines[0].toLowerCase();
    if (headerLine.includes('title') || headerLine.includes('type') || headerLine.includes('amount')) {
      startIdx = 1;
    }
    
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
      
      if (cols.length < 3) continue;
      
      const title = cols[0] || 'Imported Entry';
      const type = (cols[1] || 'expense').toLowerCase() === 'income' ? 'income' : 'expense';
      const amount = parseFloat(cols[2]) || 0;
      const date = cols[3] || new Date().toISOString().split('T')[0];
      const category = cols[4] || 'Grocery';
      const subcategory = cols[5] || '';
      const paymentMode = cols[6] || 'Cash';
      const remark = cols[7] || 'Null';
      
      parsed.push({
        title,
        type,
        amount,
        date,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        chalan_id: selectedChalanId || '1',
        category,
        subcategory,
        payment_mode: paymentMode,
        remark,
        created_by: username,
        user_email: user?.email_id || ''
      });
    }
    return parsed;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = parseCSV(text);
      // Map preview properties for preview table before uploading
      const mappedPreview = parsed.map(tx => ({
        ...tx,
        paymentMode: tx.payment_mode,
        createdBy: tx.created_by
      }));
      setImportPreview(mappedPreview);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (importPreview.length === 0) {
      addToast("No transactions found to import", "warning");
      return;
    }

    // Prepare payload in snake_case
    const payload = importPreview.map(tx => ({
      title: tx.title,
      type: tx.type,
      amount: tx.amount,
      date: tx.date,
      time: tx.time,
      chalan_id: selectedChalanId || '1',
      category: tx.category,
      subcategory: tx.subcategory,
      payment_mode: tx.paymentMode,
      remark: tx.remark,
      created_by: username,
      user_email: user?.email_id || ''
    }));

    try {
      const response = await fetch('http://localhost:5001/api/transaction/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success && data.data) {
        const mapped = data.data.map(tx => ({
          id: tx.id,
          title: tx.title,
          type: tx.type,
          amount: tx.amount,
          date: tx.date,
          time: tx.time,
          chalanId: tx.chalan_id,
          category: tx.category,
          subcategory: tx.subcategory,
          paymentMode: tx.payment_mode,
          remark: tx.remark,
          createdBy: tx.created_by,
          user_email: tx.user_email
        }));

        setTransactions([...mapped, ...transactions]);
        setShowImportForm(false);
        setImportPreview([]);
        addToast(`Successfully imported ${mapped.length} transaction(s)!`, "success");
      } else {
        addToast(data.message || "Failed to import transactions", "error");
      }
    } catch (err) {
      console.error("Bulk import failed:", err);
      addToast("Failed to save imported transactions to database", "error");
    }
  };

  // Filter transactions for active cashbook
  const rawActiveTxs = selectedChalanId === ''
    ? transactions
    : transactions.filter(tx => 
        tx.chalanId === selectedChalanId || (selectedChalanId === '1' && !tx.chalanId)
      );

  // Chronological order for calculating running balance
  const chronologicalTxs = [...rawActiveTxs].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    const idA = parseInt(a.id);
    const idB = parseInt(b.id);
    if (!isNaN(idA) && !isNaN(idB)) {
      return idA - idB;
    }
    return a.id.localeCompare(b.id);
  });

  let balanceAccumulator = 0;
  const txsWithBalance = chronologicalTxs.map(tx => {
    if (tx.type === 'income') {
      balanceAccumulator += tx.amount;
    } else {
      balanceAccumulator -= tx.amount;
    }
    return {
      ...tx,
      runningBalance: balanceAccumulator
    };
  });

  const totalCashIn = txsWithBalance
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCashOut = txsWithBalance
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalCashIn - totalCashOut;

  // Reverse list to display newest first
  const displayTxs = [...txsWithBalance].reverse();

  // Apply column-level searching filters
  const filteredTxs = displayTxs.filter((tx, index) => {
    const rowNo = (displayTxs.length - index).toString();
    if (searchFilters.no && !rowNo.includes(searchFilters.no)) return false;

    const typeLabel = tx.type === 'income' ? 'Cash In' : 'Cash Out';
    if (searchFilters.type && !typeLabel.toLowerCase().includes(searchFilters.type.toLowerCase())) return false;

    const dateFormatted = formatDate(tx.date);
    if (searchFilters.date && !dateFormatted.toLowerCase().includes(searchFilters.date.toLowerCase())) return false;

    const timeFormatted = tx.time || formatTime(tx.id);
    if (searchFilters.time && !timeFormatted.toLowerCase().includes(searchFilters.time.toLowerCase())) return false;

    if (searchFilters.amount && !tx.amount.toString().includes(searchFilters.amount)) return false;

    if (searchFilters.balance && !tx.runningBalance.toString().includes(searchFilters.balance)) return false;

    if (searchFilters.category && !tx.category.toLowerCase().includes(searchFilters.category.toLowerCase())) return false;

    const subcat = tx.subcategory || '';
    if (searchFilters.subcategory && !subcat.toLowerCase().includes(searchFilters.subcategory.toLowerCase())) return false;

    const pm = tx.paymentMode || 'Cash';
    if (searchFilters.paymentMode && !pm.toLowerCase().includes(searchFilters.paymentMode.toLowerCase())) return false;

    const remark = tx.remark || 'Null';
    if (searchFilters.remark && !remark.toLowerCase().includes(searchFilters.remark.toLowerCase())) return false;

    const cb = tx.createdBy || 'Guest';
    if (searchFilters.createdBy && !cb.toLowerCase().includes(searchFilters.createdBy.toLowerCase())) return false;

    return true;
  });

  // Apply Sort parameters
  const sortedTxs = [...filteredTxs];
  if (sortConfig.key) {
    sortedTxs.sort((a, b) => {
      let valA, valB;
      
      switch (sortConfig.key) {
        case 'no':
          valA = displayTxs.length - displayTxs.indexOf(a);
          valB = displayTxs.length - displayTxs.indexOf(b);
          break;
        case 'type':
          valA = a.type === 'income' ? 'Cash In' : 'Cash Out';
          valB = b.type === 'income' ? 'Cash In' : 'Cash Out';
          break;
        case 'date':
          valA = a.date;
          valB = b.date;
          break;
        case 'time':
          valA = a.time || formatTime(a.id);
          valB = b.time || formatTime(b.id);
          break;
        case 'amount':
          valA = a.amount;
          valB = b.amount;
          break;
        case 'balance':
          valA = a.runningBalance;
          valB = b.runningBalance;
          break;
        case 'category':
          valA = a.category || '';
          valB = b.category || '';
          break;
        case 'subcategory':
          valA = a.subcategory || '';
          valB = b.subcategory || '';
          break;
        case 'paymentMode':
          valA = a.paymentMode || 'Cash';
          valB = b.paymentMode || 'Cash';
          break;
        case 'remark':
          valA = a.remark || 'Null';
          valB = b.remark || 'Null';
          break;
        case 'createdBy':
          valA = a.createdBy || 'Guest';
          valB = b.createdBy || 'Guest';
          break;
        default:
          valA = a.id;
          valB = b.id;
      }
      
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="p-6 md:p-8 w-full space-y-6 bg-transparent dark:bg-transparent min-h-screen text-foreground">
      
      {/* ── TOP-FIXED HEADER LAYOUT ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/cashbooks')}
            className="p-2.5 bg-[#f8fafc] dark:bg-[#15181f] border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center shrink-0 shadow-sm"
            title="Back to Cashbooks"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1e293b] dark:text-foreground">
              {cashbookName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {cashbookDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button 
            onClick={() => setShowImportForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-border bg-[#f8fafc] dark:bg-[#15181f] text-foreground font-semibold rounded-xl text-xs hover:bg-muted transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-primary" />
            Import Transaction
          </button>
          <button 
            onClick={handleOpenAddForm}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:opacity-95 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* ── DYNAMIC METRICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</p>
            <p className={`text-2xl font-bold tracking-tight ${totalBalance < 0 ? 'text-[#ef4444]' : 'text-foreground'}`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            totalBalance < 0 
              ? 'bg-rose-50 dark:bg-rose-950/30 text-[#ef4444]' 
              : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
          }`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Cash In */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Cash In</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(totalCashIn)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Cash Out */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Cash Out</p>
            <p className="text-2xl font-bold tracking-tight text-[#ef4444]">
              {formatCurrency(totalCashOut)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#ef4444] flex items-center justify-center">
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── TRANSACTION LEDGER ── */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl shadow-sm p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
            Transaction History 
            <span className="text-muted-foreground font-normal">• {sortedTxs.length} Records</span>
          </h2>
          
          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ef4444]/40 text-[#ef4444] rounded-lg text-xs font-bold bg-[#ef4444]/5 hover:bg-[#ef4444]/10 transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
        
        {/* Select All bar */}
        <div className="flex items-center gap-2 select-none py-1">
          <input
            type="checkbox"
            id="selectAllHeader"
            checked={sortedTxs.length > 0 && selectedIds.length === sortedTxs.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedIds(sortedTxs.map(t => t.id));
              } else {
                setSelectedIds([]);
              }
            }}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
          />
          <label htmlFor="selectAllHeader" className="text-xs font-semibold text-muted-foreground cursor-pointer">
            Select All
          </label>
        </div>

        {/* Ledger Table Container */}
        <div className="overflow-x-auto w-full border border-border/60 rounded-xl bg-card">
          <table className="w-full text-left border-collapse table-fixed min-w-[1600px]">
            <thead>
              {/* Header Titles with Sort Toggles */}
              <tr className="bg-muted/30 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3.5 w-[50px] text-center"></th>
                <th className="px-4 py-3.5 w-[70px] cursor-pointer" onClick={() => handleSort('no')}>
                  <div className="flex items-center gap-1">
                    No {getSortIcon('no')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[110px] cursor-pointer" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1">
                    Type {getSortIcon('type')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[130px] cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    Date {getSortIcon('date')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[130px] cursor-pointer" onClick={() => handleSort('time')}>
                  <div className="flex items-center gap-1">
                    Time {getSortIcon('time')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[130px] cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">
                    Amount {getSortIcon('amount')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[130px] cursor-pointer" onClick={() => handleSort('balance')}>
                  <div className="flex items-center gap-1">
                    Balance {getSortIcon('balance')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[160px] cursor-pointer" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">
                    Category {getSortIcon('category')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[160px] cursor-pointer" onClick={() => handleSort('subcategory')}>
                  <div className="flex items-center gap-1">
                    Subcategory {getSortIcon('subcategory')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[160px] cursor-pointer" onClick={() => handleSort('paymentMode')}>
                  <div className="flex items-center gap-1">
                    Payment Mode {getSortIcon('paymentMode')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[160px] cursor-pointer" onClick={() => handleSort('remark')}>
                  <div className="flex items-center gap-1">
                    Remark {getSortIcon('remark')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[200px] cursor-pointer" onClick={() => handleSort('createdBy')}>
                  <div className="flex items-center gap-1">
                    Created By {getSortIcon('createdBy')}
                  </div>
                </th>
                <th className="px-4 py-3.5 w-[100px] text-center">Actions</th>
              </tr>
              
              {/* Header Column Filters Row */}
              <tr className="bg-muted/10 border-b border-border/40">
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.no}
                    onChange={(e) => handleFilterChange('no', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.time}
                    onChange={(e) => handleFilterChange('time', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.amount}
                    onChange={(e) => handleFilterChange('amount', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.balance}
                    onChange={(e) => handleFilterChange('balance', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.subcategory}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.paymentMode}
                    onChange={(e) => handleFilterChange('paymentMode', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.remark}
                    onChange={(e) => handleFilterChange('remark', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search."
                    value={searchFilters.createdBy}
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-border/60">
              {sortedTxs.map((tx, idx) => {
                const rowNo = displayTxs.length - displayTxs.indexOf(tx);
                const isSelected = selectedIds.includes(tx.id);
                
                return (
                  <tr key={tx.id} className={`hover:bg-muted/30 transition-colors text-xs font-semibold text-foreground ${isSelected ? 'bg-primary/5' : ''}`}>
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, tx.id]);
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== tx.id));
                          }
                        }}
                        className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{rowNo}</td>
                    <td className="px-4 py-3.5">
                      <span className={tx.type === 'income' ? 'text-[#10b981]' : 'text-[#ef4444]'}>
                        {tx.type === 'income' ? 'Cash In' : 'Cash Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3.5">{tx.time}</td>
                    <td className={`px-4 py-3.5 font-bold ${tx.type === 'income' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.type === 'income' ? tx.amount : -tx.amount)}
                    </td>
                    <td className={`px-4 py-3.5 font-bold ${tx.runningBalance < 0 ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                      {formatCurrency(tx.runningBalance)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{tx.subcategory || "-"}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded border border-border text-[10px] font-bold text-muted-foreground bg-muted/20">
                        {tx.paymentMode || 'Cash'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{tx.remark || 'Null'}</td>
                    <td className="px-4 py-3.5 text-muted-foreground truncate max-w-[150px]" title={tx.createdBy || 'Guest'}>
                      {tx.createdBy || 'Guest'}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => handleEditClick(tx)}
                          className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit Entry"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="p-1 text-muted-foreground hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition-colors"
                          title="Remove Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {sortedTxs.length === 0 && (
                <tr>
                  <td colSpan="13" className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No logs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TRANSACTION ENTRY MODAL ── */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-xl p-6 w-full max-w-[460px] z-10 space-y-6 text-foreground"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  {editTxId ? 'Edit Entry' : 'Quick Entry'}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted border border-border/50">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      type === 'expense'
                        ? 'bg-white dark:bg-[#1a2475] text-expense dark:text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      type === 'income'
                        ? 'bg-white dark:bg-[#1a2475] text-[#10b981] dark:text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    Income
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Select Cashbook</label>
                  <Dropdown
                    value={selectedChalanId}
                    onChange={(e) => {
                      setSelectedChalanId(e.target.value);
                      loadCategoriesAndModes(e.target.value);
                    }}
                    required
                  >
                    <option value="" disabled>Select Your Cashbook</option>
                    {chalans.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </Dropdown>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Title / Description</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chai & Snacks, Customer Inflow"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="150"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-bold text-foreground bg-white dark:bg-card"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Category</label>
                    <Dropdown
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      onAddNew={handleAddNewCategory}
                    >
                      {categories.map(c => (
                         <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </Dropdown>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Subcategory</label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. rent', dinner"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Payment Mode</label>
                    <Dropdown
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      onAddNew={handleAddNewPaymentMode}
                    >
                      {paymentModes.map(pm => (
                        <option key={pm.id} value={pm.name}>{pm.name}</option>
                      ))}
                    </Dropdown>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Remark</label>
                    <input
                      type="text"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Remarks..."
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CSV TRANSACTIONS IMPORT MODAL ── */}
      <AnimatePresence>
        {showImportForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowImportForm(false);
                setImportPreview([]);
              }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-xl p-6 w-full max-w-[650px] z-10 space-y-6 text-foreground"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Import Transactions from CSV
                </h3>
                <button
                  onClick={() => {
                    setShowImportForm(false);
                    setImportPreview([]);
                  }}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload a CSV file containing transactions. The columns should be formatted in the following order:
                  <br />
                  <code className="block mt-1.5 p-2 bg-muted border border-border rounded-lg font-mono text-[10px] text-foreground">
                    Title, Type (income/expense), Amount, Date (YYYY-MM-DD), Category, Subcategory, Payment Mode, Remark
                  </code>
                </p>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-8 bg-muted/10 hover:bg-muted/20 transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csvFileInput"
                  />
                  <label htmlFor="csvFileInput" className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm font-semibold text-primary">Click to select CSV File</span>
                    <span className="text-xs text-muted-foreground text-center">Only standard .csv files are supported</span>
                  </label>
                </div>

                {importPreview.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-foreground uppercase tracking-wide">
                        Previewing {importPreview.length} Entries
                      </h4>
                    </div>

                    <div className="max-h-[220px] overflow-y-auto border border-border rounded-xl">
                      <table className="w-full text-left border-collapse text-[11px] table-auto">
                        <thead>
                          <tr className="bg-muted border-b border-border text-muted-foreground font-bold uppercase">
                            <th className="px-3 py-2">Title</th>
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2">Amount</th>
                            <th className="px-3 py-2">Category</th>
                            <th className="px-3 py-2">Subcategory</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {importPreview.slice(0, 5).map((tx, idx) => (
                            <tr key={idx} className="hover:bg-muted/30">
                              <td className="px-3 py-2 font-semibold text-foreground truncate max-w-[120px]">{tx.title}</td>
                              <td className="px-3 py-2">
                                <span className={tx.type === 'income' ? 'text-[#10b981]' : 'text-[#ef4444]'}>
                                  {tx.type === 'income' ? 'Cash In' : 'Cash Out'}
                                </span>
                              </td>
                              <td className="px-3 py-2 font-bold">{formatCurrency(tx.amount)}</td>
                              <td className="px-3 py-2">{tx.category}</td>
                              <td className="px-3 py-2 text-muted-foreground">{tx.subcategory || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {importPreview.length > 5 && (
                        <p className="text-[10px] text-muted-foreground text-center py-2 border-t border-border bg-muted/10 font-medium">
                          And {importPreview.length - 5} more transactions...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportForm(false);
                      setImportPreview([]);
                    }}
                    className="px-4 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-muted transition-colors text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={importPreview.length === 0}
                    onClick={handleConfirmImport}
                    className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Confirm Import
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) for Quick Entry */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={handleOpenAddForm}
          className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl active:scale-95 hover:opacity-95 transition-all cursor-pointer"
          title="Quick Entry"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

    </div>
  );
}
