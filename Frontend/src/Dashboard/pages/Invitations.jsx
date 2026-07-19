import React, { useState, useEffect } from 'react';
import { UserPlus, ChevronDown, ChevronsUpDown, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from '../components/Dropdown';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const Invitations = () => {
  const [selectedBook, setSelectedBook] = useState('');
  const [cashbooks, setCashbooks] = useState([]);
  const [invitations, setInvitations] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [invitePermission, setInvitePermission] = useState('View Only');
  
  const { showToast } = useToast();
  
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const invitationsStorageKey = `cashbook_invitations_${user?.email_id || 'guest'}`;

  useEffect(() => {
    const chalansStorageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;
    
    const savedChalans = localStorage.getItem(chalansStorageKey);
    if (savedChalans) {
      setCashbooks(JSON.parse(savedChalans));
    } else {
      setCashbooks([{ id: '1', name: 'Home', createdAt: new Date().toISOString() }]);
    }
    
    const savedInvites = localStorage.getItem(invitationsStorageKey);
    if (savedInvites) {
      setInvitations(JSON.parse(savedInvites));
    }
  }, [invitationsStorageKey, user?.email_id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!selectedBook) {
      showToast("Please select a Cashbook first from the dropdown.", "error");
      setShowModal(false);
      return;
    }
    
    const bookName = cashbooks.find(c => c.id === selectedBook)?.name || 'Unknown';
    const inviterName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Admin';
    
    try {
      showToast("Sending invitation email...", "info");
      
      await axios.post('http://localhost:5000/api/invite', {
        email: inviteName,
        inviteeName: inviteName,
        inviterName: inviterName || 'A Cash Book user',
        cashbookName: bookName,
        permissions: invitePermission
      });

      const newInvite = {
        id: Date.now().toString(),
        name: inviteName,
        cashbookId: selectedBook,
        cashbookName: bookName,
        permissions: invitePermission,
        status: 'Pending',
        date: new Date().toISOString()
      };
      
      const updatedInvites = [newInvite, ...invitations];
      setInvitations(updatedInvites);
      localStorage.setItem(invitationsStorageKey, JSON.stringify(updatedInvites));
      
      showToast(`Invitation sent to ${inviteName}`, "success");
      setShowModal(false);
      setInviteName('');
      setInvitePermission('View Only');
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send email. Please try again.", "error");
    }
  };

  const SortIcon = () => (
    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/40 inline-block ml-1" />
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 text-foreground bg-[#f8fafc] dark:bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-[22px] font-bold tracking-tight text-[#2b3674] dark:text-foreground">
          User Invitation & Cash Book Management
        </h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 font-medium">
          Invite users to your cashbooks and manage their permissions
        </p>
      </div>

      {/* Select Cashbook Card */}
      <div className="bg-white dark:bg-card border border-border/60 rounded-xl shadow-[0_2px_15px_-3px_rgba(6,81,237,0.05)] p-6">
        <h2 className="text-[22px] font-bold text-[#2b3674] dark:text-foreground mb-6 tracking-tight">Select Cashbook</h2>
        
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full md:flex-1 space-y-2 relative">
            <label className="text-[13px] font-semibold text-[#1e293b] dark:text-foreground">Cashbook</label>
            <Dropdown
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <option value="">Select Cashbook</option>
              {cashbooks.map(book => (
                <option key={book.id} value={book.id}>{book.name}</option>
              ))}
            </Dropdown>
          </div>
          
          <button 
            onClick={() => {
              if (!selectedBook) {
                showToast("Please select a Cashbook first.", "error");
                return;
              }
              setShowModal(true);
            }}
            className="w-full md:w-auto px-5 py-2.5 bg-[#8186c6] hover:bg-[#7075b5] text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-[14px] transition-colors whitespace-nowrap h-[42px] shadow-sm"
          >
            <UserPlus className="w-[18px] h-[18px]" />
            Invite User
          </button>
        </div>
      </div>

      {/* Invite List Card */}
      <div className="bg-white dark:bg-card border border-border/60 rounded-xl shadow-[0_2px_15px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="p-6 border-b border-border/40">
          <h2 className="text-[17px] font-bold text-[#2b3674] dark:text-foreground tracking-tight">Invite List</h2>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-muted/30 border-b border-border/40 text-[13.5px] font-semibold text-[#475569] dark:text-muted-foreground">
                <th className="px-6 py-4 cursor-pointer whitespace-nowrap">User Name <SortIcon /></th>
                <th className="px-6 py-4 cursor-pointer whitespace-nowrap">Cashbook <SortIcon /></th>
                <th className="px-6 py-4 cursor-pointer whitespace-nowrap">Permissions <SortIcon /></th>
                <th className="px-6 py-4 cursor-pointer whitespace-nowrap">Status <SortIcon /></th>
                <th className="px-6 py-4 cursor-pointer whitespace-nowrap">Invited Date <SortIcon /></th>
                <th className="px-6 py-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#2b3674] dark:text-foreground font-medium text-[16px]">
                    No Data Found
                  </td>
                </tr>
              ) : (
                invitations.map(invite => (
                  <tr key={invite.id} className="hover:bg-muted/10 transition-colors bg-white dark:bg-card text-[13.5px]">
                    <td className="px-6 py-4 font-semibold text-[#1e293b] dark:text-foreground">{invite.name}</td>
                    <td className="px-6 py-4 text-[#64748b]">{invite.cashbookName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full border border-border/80 text-[12px] font-medium text-[#64748b] tracking-wide">
                        {invite.permissions}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[12px] font-medium tracking-wide">
                        {invite.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#64748b]">
                      {new Date(invite.date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          const updated = invitations.filter(i => i.id !== invite.id);
                          setInvitations(updated);
                          localStorage.setItem(invitationsStorageKey, JSON.stringify(updated));
                          showToast("Invitation canceled.", "success");
                        }}
                        className="text-xs font-semibold text-[#ef4444] hover:underline"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-sm p-6 w-full max-w-[400px] z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2 text-[#2b3674] dark:text-foreground">
                  <UserPlus className="w-5 h-5 text-[#8186c6]" />
                  Invite User
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wide">User Name / Email</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Enter name or email"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wide">Permissions</label>
                  <Dropdown
                    value={invitePermission}
                    onChange={(e) => setInvitePermission(e.target.value)}
                    required
                  >
                    <option value="View Only">View Only</option>
                    <option value="Edit">Edit</option>
                    <option value="Admin">Admin</option>
                  </Dropdown>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-[#8186c6] hover:bg-[#7075b5] text-white font-semibold rounded-xl text-sm hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Send Invitation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invitations;
