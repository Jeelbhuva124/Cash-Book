import React, { useState } from 'react';
import { 
  Plus, Wallet, Landmark, Smartphone, CreditCard, 
  MoreVertical, Search, Check, X, Edit2, Trash2, Save 
} from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';
import Dropdown from '../components/Dropdown';
import { useToast } from '../../context/ToastContext';

const INITIAL_MODES = [
  { id: '1', name: 'Cash in Hand', type: 'cash', active: true, balance: 25000, isDefault: true },
  { id: '2', name: 'HDFC Current A/c', type: 'bank', active: true, balance: 154200, isDefault: false },
  { id: '3', name: 'Google Pay / UPI', type: 'upi', active: true, balance: 5200, isDefault: false },
  { id: '4', name: 'Company Credit Card', type: 'credit', active: false, balance: -12500, isDefault: false },
];

const getIconForType = (type) => {
  switch (type) {
    case 'cash': return <Wallet className="w-4 h-4 text-muted-foreground" />;
    case 'bank': return <Landmark className="w-4 h-4 text-muted-foreground" />;
    case 'upi': return <Smartphone className="w-4 h-4 text-muted-foreground" />;
    case 'credit': return <CreditCard className="w-4 h-4 text-muted-foreground" />;
    default: return <Wallet className="w-4 h-4 text-muted-foreground" />;
  }
};

export default function PaymentModes() {
  const { addToast } = useToast();
  
  const [modes, setModes] = useState(() => {
    const saved = localStorage.getItem('cashbook_payment_modes');
    return saved ? JSON.parse(saved) : INITIAL_MODES;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMode, setEditingMode] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [formData, setFormData] = useState({ name: '', type: 'bank', balance: 0, active: true, isDefault: false });

  const filteredModes = modes.filter(mode => 
    mode.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (mode = null) => {
    if (mode) {
      setEditingMode(mode.id);
      setFormData({ name: mode.name, type: mode.type, balance: mode.balance, active: mode.active, isDefault: mode.isDefault || false });
    } else {
      setEditingMode(null);
      setFormData({ name: '', type: 'bank', balance: 0, active: true, isDefault: false });
    }
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMode(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedModes = [...modes];
    
    // If setting as default, clear default from others
    if (formData.isDefault) {
      updatedModes = updatedModes.map(m => ({ ...m, isDefault: false }));
    }

    if (editingMode) {
      updatedModes = updatedModes.map(m => m.id === editingMode ? { ...m, ...formData } : m);
    } else {
      // If it's the first mode being added, make it default automatically
      if (updatedModes.length === 0) formData.isDefault = true;
      updatedModes.push({ ...formData, id: Date.now().toString() });
    }
    
    // Ensure there is always exactly one default if any active modes exist
    if (!updatedModes.some(m => m.isDefault) && updatedModes.length > 0) {
      updatedModes[0].isDefault = true;
    }

    setModes(updatedModes);
    handleCloseModal();
  };

  const handleToggleActive = (id) => {
    setModes(modes.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const handleSetDefault = (id) => {
    setModes(modes.map(m => ({
      ...m,
      isDefault: m.id === id
    })));
    setActiveDropdown(null);
  };

  const handleDelete = (id) => {
    let updatedModes = modes.filter(m => m.id !== id);
    // If we deleted the default mode, assign default to the first available mode
    if (modes.find(m => m.id === id)?.isDefault && updatedModes.length > 0) {
      updatedModes[0].isDefault = true;
    }
    setModes(updatedModes);
    setActiveDropdown(null);
  };

  const handleSaveAll = () => {
    localStorage.setItem('cashbook_payment_modes', JSON.stringify(modes));
    addToast("Payment options saved successfully!", "success");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-foreground">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Payment Options</h1>
          <p className="text-sm text-muted-foreground">Manage your bank accounts and payment options.</p>
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
            Add Option
          </button>
        </div>
      </div>

      {/* Simple List Layout */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {filteredModes.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground text-sm">No payment options found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredModes.map((mode) => (
              <div 
                key={mode.id} 
                className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors ${!mode.active ? 'opacity-60' : ''}`}
              >
                {/* Left Side: Icon & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    {getIconForType(mode.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-foreground">{mode.name}</h3>
                      {mode.isDefault && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary/15 text-primary rounded uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{mode.type}</p>
                  </div>
                </div>

                {/* Right Side: Balance, Status & Actions */}
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block min-w-[100px]">
                    <p className={`text-sm font-semibold ${mode.balance < 0 ? 'text-destructive' : 'text-foreground'}`}>
                      {formatCurrency(mode.balance, 'indian')}
                    </p>
                  </div>

                  {/* Active Toggle Switch */}
                  <button 
                    onClick={() => handleToggleActive(mode.id)}
                    className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${mode.active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${mode.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === mode.id ? null : mode.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdown === mode.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-0 top-8 w-32 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1">
                          {!mode.isDefault && mode.active && (
                            <button 
                              onClick={() => handleSetDefault(mode.id)}
                              className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted/50 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Check className="w-3 h-3" /> Set Default
                            </button>
                          )}
                          <button 
                            onClick={() => handleOpenModal(mode)}
                            className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted/50 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(mode.id)}
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
              <h2 className="text-base font-bold text-foreground">{editingMode ? 'Edit Option' : 'Add New Option'}</h2>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Bank / Option Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Office Cash"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-transparent border-b border-border focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Type</label>
                <Dropdown
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Account</option>
                  <option value="upi">UPI / Wallet</option>
                  <option value="credit">Credit Card</option>
                </Dropdown>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Opening Balance (₹)</label>
                <input 
                  type="number"
                  required
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})}
                  className="w-full px-3 py-2 text-sm bg-transparent border-b border-border focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
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
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="default-status"
                    checked={formData.isDefault}
                    onChange={() => setFormData({...formData, isDefault: !formData.isDefault})}
                    className="cursor-pointer"
                  />
                  <label htmlFor="default-status" className="text-sm text-foreground cursor-pointer select-none">
                    Set as Default
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {editingMode ? 'Save' : 'Add'}
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
           Save Options
         </button>
      </div>
    </div>
  );
}
