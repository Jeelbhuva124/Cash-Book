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

export default function Categories() {
  const { addToast } = useToast();
  
  // Data States
  const [categories, setCategories] = useState([]);
  const [chalans, setChalans] = useState([]);
  const [selectedChalanId, setSelectedChalanId] = useState('');
  
  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [formData, setFormData] = useState({ category_name: '', active: true });
  
  // Column Filters State
  const [filters, setFilters] = useState({
    no: '',
    category_name: '',
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

  // Get active user info
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const username = user?.username || 'Guest';
  const userEmail = user?.email_id || '';

  useEffect(() => {
    // Load chalans from localStorage key cashbook_chalans_<userEmail>
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
      loadCategories();
    } else {
      setCategories([]);
    }
  }, [selectedChalanId]);

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/category/select');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter by user email and chosen chalan_id
        const userCats = data.data.filter(cat => 
          cat.user_email?.toLowerCase() === userEmail.toLowerCase() &&
          cat.chalan_id === selectedChalanId
        );
        setCategories(userCats);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      addToast("Failed to fetch categories from database", "error");
    }
  };

  const handleOpenModal = (cat = null) => {
    if (!selectedChalanId) {
      addToast("Please select a cashbook first", "warning");
      return;
    }
    if (cat) {
      setEditingCategoryId(cat.id);
      setFormData({ category_name: cat.category_name, active: cat.active });
    } else {
      setEditingCategoryId(null);
      setFormData({ category_name: '', active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      addToast("Category name is required", "warning");
      return;
    }

    const isEdit = !!editingCategoryId;
    const url = isEdit
      ? 'http://localhost:5001/api/category/update'
      : 'http://localhost:5001/api/category/insert';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      category_name: formData.category_name.trim(),
      active: formData.active,
      updated_by: username
    };

    if (!isEdit) {
      payload.chalan_id = selectedChalanId;
      payload.created_by = username;
      payload.user_email = userEmail;
    } else {
      payload.id = editingCategoryId;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        addToast(isEdit ? "Category updated successfully" : "Category added successfully", "success");
        handleCloseModal();
        loadCategories();
      } else {
        addToast(data.message || "Failed to save category", "error");
      }
    } catch (err) {
      console.error("Save Category Error:", err);
      addToast("Network error: failed to save category", "error");
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Category",
      message: "Are you sure you want to delete this category? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch('http://localhost:5001/api/category/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const data = await response.json();

          if (data.success) {
            addToast("Category deleted successfully", "success");
            loadCategories();
          } else {
            addToast(data.message || "Failed to delete category", "error");
          }
        } catch (err) {
          console.error("Delete Category Error:", err);
          addToast("Failed to delete category from database", "error");
        }
      }
    });
  };

  // Filter column items
  const filteredCategories = categories.filter((cat, idx) => {
    const rowNo = (idx + 1).toString();
    if (filters.no && !rowNo.includes(filters.no)) return false;
    
    if (filters.category_name && !cat.category_name.toLowerCase().includes(filters.category_name.toLowerCase())) return false;
    
    const activeLabel = cat.active ? 'yes' : 'no';
    if (filters.active && !activeLabel.includes(filters.active.toLowerCase())) return false;
    
    const createdBy = cat.created_by || 'Guest';
    if (filters.created_by && !createdBy.toLowerCase().includes(filters.created_by.toLowerCase())) return false;
    
    const createdOn = formatDateTime(cat.createdAt);
    if (filters.created_on && !createdOn.toLowerCase().includes(filters.created_on.toLowerCase())) return false;
    
    const updatedBy = cat.updated_by || 'Guest';
    if (filters.updated_by && !updatedBy.toLowerCase().includes(filters.updated_by.toLowerCase())) return false;
    
    const updatedOn = formatDateTime(cat.updatedAt);
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

  // Sorted list
  const sortedCategories = [...filteredCategories];
  if (sortConfig.key) {
    sortedCategories.sort((a, b) => {
      let valA, valB;
      if (sortConfig.key === 'no') {
        valA = categories.indexOf(a) + 1;
        valB = categories.indexOf(b) + 1;
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
          Category Manager
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Manage categories for each daily chalan
        </p>
      </div>

      {/* Select Cashbook Card */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1e293b] dark:text-foreground">
          <Check className="w-4 h-4 text-primary" />
          <span>Cashbook-wise Categories</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Each cashbook maintains its own category list
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

      {/* Categories Table Card */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
          Category List 
          <span className="text-muted-foreground font-normal">• {sortedCategories.length} Records</span>
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
                <th className="px-4 py-3 w-[220px] cursor-pointer" onClick={() => handleSort('category_name')}>
                  Category Name {getSortIcon('category_name')}
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
                    value={filters.category_name}
                    onChange={(e) => setFilters(prev => ({ ...prev, category_name: e.target.value }))}
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
              {sortedCategories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-muted/30 transition-colors text-xs font-semibold text-foreground">
                  <td className="px-4 py-3.5 text-muted-foreground">{categories.indexOf(cat) + 1}</td>
                  <td className="px-4 py-3.5 text-foreground">{cat.category_name}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                      cat.active 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-50 dark:bg-rose-950/20 text-[#ef4444] border border-[#ef4444]/20'
                    }`}>
                      {cat.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground truncate">{cat.created_by || 'Guest'}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{formatDateTime(cat.createdAt)}</td>
                  <td className="px-4 py-3.5 text-muted-foreground truncate">{cat.updated_by || 'Guest'}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{formatDateTime(cat.updatedAt)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit Category"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-1 text-muted-foreground hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {sortedCategories.length === 0 && (
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

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl active:scale-95 hover:opacity-95 transition-all cursor-pointer"
          title="Add Category"
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
                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Category Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Salary, Utilities"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="category-active-status"
                  checked={formData.active}
                  onChange={() => setFormData({ ...formData, active: !formData.active })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
                />
                <label htmlFor="category-active-status" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                  Set as Active
                </label>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
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
