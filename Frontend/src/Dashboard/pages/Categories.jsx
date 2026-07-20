import React, { useState } from 'react';
import { 
  Plus, Tag, ArrowUpRight, ArrowDownRight, 
  MoreVertical, Search, Check, X, Edit2, Trash2, Save 
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import { useToast } from '../../context/ToastContext';

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Salary', type: 'income', active: true },
  { id: '2', name: 'Food & Dining', type: 'expense', active: true },
  { id: '3', name: 'Transportation', type: 'expense', active: true },
  { id: '4', name: 'Rent & Utilities', type: 'expense', active: true },
  { id: '5', name: 'Entertainment', type: 'expense', active: true },
  { id: '6', name: 'Freelance', type: 'income', active: true },
];

const getCategoryIcon = (type) => {
  return type === 'income' 
    ? <ArrowUpRight className="w-4 h-4 text-income" />
    : <ArrowDownRight className="w-4 h-4 text-expense" />;
};

export default function Categories() {
  const { addToast } = useToast();
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('cashbook_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [formData, setFormData] = useState({ name: '', type: 'expense', active: true });

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category.id);
      setFormData({ name: category.name, type: category.type, active: category.active });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', type: 'expense', active: true });
    }
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedCategories = [...categories];

    if (editingCategory) {
      updatedCategories = updatedCategories.map(c => c.id === editingCategory ? { ...c, ...formData } : c);
    } else {
      updatedCategories.push({ ...formData, id: Date.now().toString() });
    }

    setCategories(updatedCategories);
    handleCloseModal();
  };

  const handleToggleActive = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    setActiveDropdown(null);
  };

  const handleSaveAll = () => {
    localStorage.setItem('cashbook_categories', JSON.stringify(categories));
    addToast("Categories saved successfully!", "success");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-foreground relative pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage your income and expense categories.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-transparent border-b border-border focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors cursor-pointer px-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Simple List Layout */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {filteredCategories.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground text-sm">No categories found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors ${!category.active ? 'opacity-60' : ''}`}
              >
                {/* Left Side: Icon & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${category.type === 'income' ? 'bg-income-bg/50' : 'bg-expense-bg/50'}`}>
                    {getCategoryIcon(category.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{category.type}</p>
                  </div>
                </div>

                {/* Right Side: Status & Actions */}
                <div className="flex items-center gap-6">
                  {/* Active Toggle Switch */}
                  <button 
                    onClick={() => handleToggleActive(category.id)}
                    className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${category.active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${category.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === category.id ? null : category.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdown === category.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-0 top-8 w-32 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1">
                          <button 
                            onClick={() => handleOpenModal(category)}
                            className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted/50 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="w-full px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Minimal Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={handleCloseModal} />
          
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-foreground">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Category Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Utilities"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-transparent border-b border-border focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Type (Income / Expense)</label>
                <Dropdown
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Dropdown>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="active-status"
                  checked={formData.active}
                  onChange={() => setFormData({...formData, active: !formData.active})}
                  className="cursor-pointer"
                />
                <label htmlFor="active-status" className="text-sm text-foreground cursor-pointer select-none">
                  Set as Active
                </label>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {editingCategory ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
         <button 
           onClick={handleSaveAll}
           className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
         >
           <Save className="w-4 h-4" />
           Save Categories
         </button>
      </div>
    </div>
  );
}
