import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, X, Pencil, Trash2, Check, HelpCircle, 
  ChevronsUpDown, ArrowUp, ArrowDown 
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const formatDateTime = (isoString) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  } catch (e) {
    return isoString;
  }
};

export default function PaymentModes() {
  const { addToast } = useToast();

  // Data States
  const [paymentModes, setPaymentModes] = useState([]);
  const [chalans, setChalans] = useState([]);
  const [selectedChalanId, setSelectedChalanId] = useState('');

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentModeId, setEditingPaymentModeId] = useState(null);
  const [formData, setFormData] = useState({ payment_mode: '', active: true });

  // Column Filters State
  const [filters, setFilters] = useState({
    no: '',
    payment_mode: '',
    active: '',
    created_by: '',
    created_on: '',
    updated_by: '',
    updated_on: ''
  });

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  
  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // User Info
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const username = user?.username || 'Guest';
  const userEmail = user?.email_id || '';

  useEffect(() => {
    // Load cashbooks
    const storageKey = `cashbook_chalans_${userEmail || 'guest'}`;
    const savedChalans = localStorage.getItem(storageKey);
    if (savedChalans) {
      try {
        setChalans(JSON.parse(savedChalans));
      } catch (e) {}
    }
  }, [userEmail]);

  useEffect(() => {
    if (selectedChalanId) {
      loadPaymentModes();
    } else {
      setPaymentModes([]);
    }
  }, [selectedChalanId]);

  const loadPaymentModes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/payment-mode/select');
      const data = await response.json();
      if (data.success && data.data) {
        // Filter by user and active chalan_id
        const userModes = data.data.filter(pm => 
          pm.user_email?.toLowerCase() === userEmail.toLowerCase() &&
          pm.chalan_id === selectedChalanId
        );
        setPaymentModes(userModes);
      }
    } catch (err) {
      console.error("Failed to load payment modes:", err);
      addToast("Failed to fetch payment options from database", "error");
    }
  };

  const handleOpenModal = (pm = null) => {
    if (!selectedChalanId) {
      addToast("Please select a cashbook first", "warning");
      return;
    }
    if (pm) {
      setEditingPaymentModeId(pm.id);
      setFormData({ payment_mode: pm.payment_mode, active: pm.active });
    } else {
      setEditingPaymentModeId(null);
      setFormData({ payment_mode: '', active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPaymentModeId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.payment_mode.trim()) {
      addToast("Payment mode name is required", "warning");
      return;
    }

    const isEdit = !!editingPaymentModeId;
    const url = isEdit
      ? 'http://localhost:5001/api/payment-mode/update'
      : 'http://localhost:5001/api/payment-mode/insert';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      payment_mode: formData.payment_mode.trim(),
      active: formData.active,
      updated_by: username
    };

    if (!isEdit) {
      payload.chalan_id = selectedChalanId;
      payload.created_by = username;
      payload.user_email = userEmail;
    } else {
      payload.id = editingPaymentModeId;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        addToast(isEdit ? "Payment option updated" : "Payment option added", "success");
        handleCloseModal();
        loadPaymentModes();
      } else {
        addToast(data.message || "Failed to save payment option", "error");
      }
    } catch (err) {
      console.error("Save Payment Option Error:", err);
      addToast("Network error: failed to save payment option", "error");
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Payment Option",
      message: "Are you sure you want to delete this payment option? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch('http://localhost:5001/api/payment-mode/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const data = await response.json();

          if (data.success) {
            addToast("Payment option deleted successfully", "success");
            loadPaymentModes();
          } else {
            addToast(data.message || "Failed to delete payment option", "error");
          }
        } catch (err) {
          console.error("Delete Payment Option Error:", err);
          addToast("Failed to delete option from database", "error");
        }
      }
    });
  };

  // Filter columns
  const filteredPaymentModes = paymentModes.filter((pm, idx) => {
    const rowNo = (idx + 1).toString();
    if (filters.no && !rowNo.includes(filters.no)) return false;

    if (filters.payment_mode && !pm.payment_mode.toLowerCase().includes(filters.payment_mode.toLowerCase())) return false;

    const activeLabel = pm.active ? 'yes' : 'no';
    if (filters.active && !activeLabel.includes(filters.active.toLowerCase())) return false;

    const createdBy = pm.created_by || 'Guest';
    if (filters.created_by && !createdBy.toLowerCase().includes(filters.created_by.toLowerCase())) return false;

    const createdOn = formatDateTime(pm.createdAt);
    if (filters.created_on && !createdOn.toLowerCase().includes(filters.created_on.toLowerCase())) return false;

    const updatedBy = pm.updated_by || 'Guest';
    if (filters.updated_by && !updatedBy.toLowerCase().includes(filters.updated_by.toLowerCase())) return false;

    const updatedOn = formatDateTime(pm.updatedAt);
    if (filters.updated_on && !updatedOn.toLowerCase().includes(filters.updated_on.toLowerCase())) return false;

    return true;
  });

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

  const sortedPaymentModes = [...filteredPaymentModes];
  if (sortConfig.key) {
    sortedPaymentModes.sort((a, b) => {
      let valA, valB;
      if (sortConfig.key === 'no') {
        valA = paymentModes.indexOf(a) + 1;
        valB = paymentModes.indexOf(b) + 1;
      } else {
        valA = a[sortConfig.key] || '';
        valB = b[sortConfig.key] || '';
      }

      if (typeof valA === 'string') {
        return sortConfig.direction === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
    });
  }

  return (
    <div className="p-6 md:p-8 w-full space-y-6 bg-transparent dark:bg-transparent min-h-screen text-foreground relative">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1e293b] dark:text-foreground">
          Payment Mode Manager
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Manage payment modes for each daily chalan
        </p>
      </div>

      {/* Select Cashbook Card */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1e293b] dark:text-foreground">
          <Check className="w-4 h-4 text-primary" />
          <span>Cashbook-wise Payment Modes</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Each cashbook maintains its own payment mode list
        </p>

        <div className="space-y-1 max-w-sm">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Select Cashbook</label>
          <Dropdown
            value={selectedChalanId}
            onChange={(e) => setSelectedChalanId(e.target.value)}
          >
            <option value="">Choose a Cashbook</option>
            {chalans.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </Dropdown>
        </div>
      </div>

      {/* Payment Modes Table Card */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
          Payment Modes 
          <span className="text-muted-foreground font-normal">• {sortedPaymentModes.length} Records</span>
        </h2>

        {/* Table Container */}
        <div className="overflow-x-auto w-full border border-border/60 rounded-xl bg-card">
          <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
            <thead>
              {/* Column titles */}
              <tr className="bg-muted/30 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3 w-[70px] cursor-pointer" onClick={() => handleSort('no')}>
                  No {getSortIcon('no')}
                </th>
                <th className="px-4 py-3 w-[220px] cursor-pointer" onClick={() => handleSort('payment_mode')}>
                  Payment Mode {getSortIcon('payment_mode')}
                </th>
                <th className="px-4 py-3 w-[120px] cursor-pointer" onClick={() => handleSort('active')}>
                  Active {getSortIcon('active')}
                </th>
                <th className="px-4 py-3 w-[160px] cursor-pointer" onClick={() => handleSort('created_by')}>
                  Created By {getSortIcon('created_by')}
                </th>
                <th className="px-4 py-3 w-[180px] cursor-pointer" onClick={() => handleSort('createdAt')}>
                  Created On {getSortIcon('createdAt')}
                </th>
                <th className="px-4 py-3 w-[160px] cursor-pointer" onClick={() => handleSort('updated_by')}>
                  Updated By {getSortIcon('updated_by')}
                </th>
                <th className="px-4 py-3 w-[180px] cursor-pointer" onClick={() => handleSort('updatedAt')}>
                  Updated On {getSortIcon('updatedAt')}
                </th>
                <th className="px-4 py-3 w-[100px] text-center">Actions</th>
              </tr>

              {/* Column Filter Row */}
              <tr className="bg-muted/10 border-b border-border/40">
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.no}
                    onChange={(e) => setFilters(prev => ({ ...prev, no: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.payment_mode}
                    onChange={(e) => setFilters(prev => ({ ...prev, payment_mode: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.active}
                    onChange={(e) => setFilters(prev => ({ ...prev, active: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.created_by}
                    onChange={(e) => setFilters(prev => ({ ...prev, created_by: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.created_on}
                    onChange={(e) => setFilters(prev => ({ ...prev, created_on: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.updated_by}
                    onChange={(e) => setFilters(prev => ({ ...prev, updated_by: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.updated_on}
                    onChange={(e) => setFilters(prev => ({ ...prev, updated_on: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal"
                  />
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {sortedPaymentModes.map((pm, index) => (
                <tr key={pm.id} className="hover:bg-muted/30 transition-colors text-xs font-semibold text-foreground">
                  <td className="px-4 py-3.5 text-muted-foreground">{paymentModes.indexOf(pm) + 1}</td>
                  <td className="px-4 py-3.5 text-foreground">{pm.payment_mode}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                      pm.active 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-50 dark:bg-rose-950/20 text-[#ef4444] border border-[#ef4444]/20'
                    }`}>
                      {pm.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground truncate">{pm.created_by || 'Guest'}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{formatDateTime(pm.createdAt)}</td>
                  <td className="px-4 py-3.5 text-muted-foreground truncate">{pm.updated_by || 'Guest'}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{formatDateTime(pm.updatedAt)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => handleOpenModal(pm)}
                        className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit Option"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pm.id)}
                        className="p-1 text-muted-foreground hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition-colors"
                        title="Delete Option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {sortedPaymentModes.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl active:scale-95 hover:opacity-95 transition-all cursor-pointer"
          title="Add Payment Option"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseModal} />
          
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xl w-full max-w-[380px] relative z-10 animate-in fade-in zoom-in-95 duration-100 p-6 space-y-4 text-foreground">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                {editingPaymentModeId ? 'Edit Payment Option' : 'Add Payment Option'}
              </h3>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Bank / Option Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Google Pay, Bank Transfer"
                  value={formData.payment_mode}
                  onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="payment-mode-active-status"
                  checked={formData.active}
                  onChange={() => setFormData({ ...formData, active: !formData.active })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
                />
                <label htmlFor="payment-mode-active-status" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                  Set as Active
                </label>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  {editingPaymentModeId ? 'Save Changes' : 'Create Option'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
