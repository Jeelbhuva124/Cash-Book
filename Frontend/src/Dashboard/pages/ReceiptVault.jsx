import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Plus, X, Calendar, Search, 
  Trash2, ShieldCheck, Image as ImageIcon, Loader2, Edit, CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ReceiptVault() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editReceiptId, setEditReceiptId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For fullscreen preview
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [formData, setFormData] = useState({
    item_title: '',
    purchase_date: '',
    warranty_expiry_date: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fileInputRef = useRef(null);
  const { addToast } = useToast();
  
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const user_email = user?.email_id || '';

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/receipts?user_email=${encodeURIComponent(user_email)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReceipts(data.data);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
      addToast('Failed to load receipts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        addToast('File size must be less than 5MB', 'error');
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      if (!formData.item_title || !formData.purchase_date) {
        addToast('Please fill all required fields.', 'error');
        return;
      }
      setIsSubmitting(true);
      try {
        const response = await fetch(`http://localhost:5001/api/receipts/${editReceiptId}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item_title: formData.item_title,
            purchase_date: formData.purchase_date,
            warranty_expiry_date: formData.warranty_expiry_date || null,
            user_email
          })
        });
        
        const result = await response.json();
        if (result.success) {
          addToast('Receipt updated successfully!', 'success');
          setIsSuccessAnim(true);
          setReceipts(receipts.map(r => r._id === editReceiptId ? result.data : r));
          setTimeout(() => {
            setIsSuccessAnim(false);
            closeUploadModal();
          }, 1500);
        } else {
          addToast(result.message || 'Update failed', 'error');
        }
      } catch (error) {
        addToast('Something went wrong during update.', 'error');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!file || !formData.item_title || !formData.purchase_date) {
      addToast('Please fill all required fields and select an image.', 'error');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('image', file);
    data.append('item_title', formData.item_title);
    data.append('purchase_date', formData.purchase_date);
    if (formData.warranty_expiry_date) {
      data.append('warranty_expiry_date', formData.warranty_expiry_date);
    }
    data.append('user_email', user_email);

    try {
      const response = await fetch('http://localhost:5001/api/receipts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      
      const result = await response.json();
      if (result.success) {
        addToast('Receipt uploaded successfully!', 'success');
        setIsSuccessAnim(true);
        setReceipts([result.data, ...receipts]);
        setTimeout(() => {
          setIsSuccessAnim(false);
          closeUploadModal();
        }, 1500);
      } else {
        addToast(result.message || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      addToast('Something went wrong during upload.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id, e) => {
    e.stopPropagation();
    setReceiptToDelete(id);
  };

  const handleDelete = async () => {
    if (!receiptToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/receipts/${receiptToDelete}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_email })
      });
      const result = await response.json();
      if (result.success) {
        setReceipts(receipts.filter(r => r._id !== receiptToDelete));
        addToast('Receipt deleted successfully', 'success');
      }
    } catch (error) {
      addToast('Failed to delete receipt', 'error');
    } finally {
      setReceiptToDelete(null);
    }
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setIsEditMode(false);
    setEditReceiptId(null);
    setFormData({ item_title: '', purchase_date: '', warranty_expiry_date: '' });
    setFile(null);
    setPreviewUrl(null);
  };

  const openEditModal = (receipt, e) => {
    e.stopPropagation();
    setIsEditMode(true);
    setEditReceiptId(receipt._id);
    setFormData({
      item_title: receipt.item_title,
      purchase_date: receipt.purchase_date ? new Date(receipt.purchase_date).toISOString().split('T')[0] : '',
      warranty_expiry_date: receipt.warranty_expiry_date ? new Date(receipt.warranty_expiry_date).toISOString().split('T')[0] : ''
    });
    setPreviewUrl(`http://localhost:5001${receipt.image_url}`);
    setIsUploadModalOpen(true);
  };

  const displayReceipts = receipts;

  const filteredReceipts = displayReceipts.filter(r => 
    r.item_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Receipts Vault
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Store and manage your important bills, invoices, and warranties securely.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search receipts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Grid Gallery */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredReceipts.map((receipt, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={receipt._id}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedImage(receipt)}
              >
                {/* Image Area */}
                <div className="h-48 w-full bg-muted/30 overflow-hidden relative">
                  <img 
                    src={`http://localhost:5001${receipt.image_url}`} 
                    alt={receipt.item_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MaximizeIcon className="text-white w-8 h-8" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground truncate" title={receipt.item_title}>
                    {receipt.item_title}
                  </h3>
                  
                  <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Purchased: {new Date(receipt.purchase_date).toLocaleDateString()}</span>
                    </div>
                    {receipt.warranty_expiry_date && (
                      <div className="flex items-center gap-2 text-emerald-500 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Warranty: {new Date(receipt.warranty_expiry_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons (Hover) */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => openEditModal(receipt, e)}
                    className="p-2 bg-blue-500/90 text-white rounded-full hover:scale-110"
                    title="Edit Receipt"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => confirmDelete(receipt._id, e)}
                    className="p-2 bg-destructive/90 text-destructive-foreground rounded-full hover:scale-110"
                    title="Delete Receipt"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Empty State */}
          {filteredReceipts.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-card/50">
              <FileText className="w-12 h-12 text-muted-foreground mb-3 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground">No receipts found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't uploaded any receipts yet.</p>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
              >
                Upload your first receipt
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-card/50 hover:bg-card rounded-full text-foreground backdrop-blur-md border border-border"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div 
              layoutId={selectedImage._id}
              className="relative max-w-5xl max-h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={`http://localhost:5001${selectedImage.image_url}`} 
                alt={selectedImage.item_title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-border"
              />
              <div className="mt-6 text-center bg-card/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-border">
                <h2 className="text-xl font-bold text-foreground">{selectedImage.item_title}</h2>
                <div className="flex gap-4 mt-2 justify-center text-sm">
                  <span className="text-muted-foreground">
                    Purchased: {new Date(selectedImage.purchase_date).toLocaleDateString()}
                  </span>
                  {selectedImage.warranty_expiry_date && (
                    <span className="text-emerald-500 font-medium">
                      Warranty Expires: {new Date(selectedImage.warranty_expiry_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={closeUploadModal}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold text-foreground">{isEditMode ? 'Edit Receipt' : 'Upload Receipt'}</h2>
                <button 
                  onClick={closeUploadModal}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-5">
                {/* File Upload Area */}
                {!isEditMode && (
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer relative ${
                      file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary hover:bg-muted/30'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative h-40 w-full rounded-xl overflow-hidden group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <p className="font-medium text-foreground">Click to upload image</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 5MB</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileSelect}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Item Title <span className="text-destructive">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Dell Laptop Invoice"
                      value={formData.item_title}
                      onChange={(e) => setFormData({...formData, item_title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Purchase Date <span className="text-destructive">*</span></label>
                      <input 
                        type="date" 
                        required
                        value={formData.purchase_date}
                        onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Warranty Expiry</label>
                      <input 
                        type="date" 
                        value={formData.warranty_expiry_date}
                        onChange={(e) => setFormData({...formData, warranty_expiry_date: e.target.value})}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
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
                          isEditMode ? 'Save Changes' : 'Save Receipt'
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
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {receiptToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setReceiptToDelete(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-3xl shadow-xl overflow-hidden p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Receipt?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete this receipt? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setReceiptToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

// Quick helper component for the maximize icon
function MaximizeIcon({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  );
}
