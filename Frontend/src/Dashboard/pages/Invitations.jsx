import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  ChevronDown, 
  ChevronsUpDown, 
  X, 
  CheckCircle2, 
  Edit2, 
  Trash2, 
  Check, 
  XCircle, 
  Mail, 
  Send, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  FileText,
  Book 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from '../components/Dropdown';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const Invitations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sent'); // 'sent' or 'received'
  const [selectedBook, setSelectedBook] = useState('');
  const [cashbooks, setCashbooks] = useState([]);
  
  // Lists
  const [sentInvitations, setSentInvitations] = useState([]);
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState('View Only');
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvite, setEditingInvite] = useState(null);
  const [editingPermission, setEditingPermission] = useState('View Only');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingInviteId, setDeletingInviteId] = useState(null);

  const { addToast } = useToast();
  
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // Sync with Backend DB
  const fetchInvitations = async () => {
    if (!user?.id) return;
    try {
      // Fetch all invitations directly from the base URL
      const res = await axios.get('http://localhost:5001/api/invitation/select');
      if (res.data.success) {
        const allInvites = res.data.data || [];
        const userEmailLower = user?.email_id?.toLowerCase() || '';

        // Filter Sent Invitations (by current user's ID or inviter_email)
        const sent = allInvites.filter(i => i.inviter_id === user.id || i.inviter_email?.toLowerCase() === userEmailLower);
        setSentInvitations(sent);
        
        // Filter Received Invitations (by current user's Email)
        const received = allInvites.filter(i => i.email?.toLowerCase() === userEmailLower);

        // Include ALL invited users and collaborators in Inbox
        const inboxList = [...received];
        sent.forEach(s => {
          if (!inboxList.some(r => r.id === s.id)) {
            inboxList.push(s);
          }
        });
        setReceivedInvitations(inboxList);

        // Check for URL accept_id parameter (from email link) or session storage (saved when logged out)
        const queryParams = new URLSearchParams(window.location.search);
        let urlAcceptId = queryParams.get('accept_id');
        if (!urlAcceptId) {
          urlAcceptId = sessionStorage.getItem('pending_accept_id');
        }

        if (urlAcceptId) {
          setActiveTab('received');
          const matchingInvite = received.find(i => i.id === urlAcceptId);
          if (matchingInvite) {
            if (matchingInvite.status === 'Pending') {
              try {
                // Immediately accept the invitation
                await axios.put('http://localhost:5001/api/invitation/update', { 
                  id: urlAcceptId, 
                  status: 'Accepted' 
                });
                addToast("Invitation accepted successfully! Welcome to the cashbook.", "success");
              } catch (err) {
                console.error("Auto accept error:", err);
                addToast("Failed to auto-accept invitation.", "error");
              }
            } else {
              addToast(`This invitation has already been ${matchingInvite.status.toLowerCase()}.`, "info");
            }
          }
          // Clear URL parameter and session storage
          window.history.replaceState({}, document.title, window.location.pathname);
          sessionStorage.removeItem('pending_accept_id');
          
          // Re-fetch all invitations to reflect accepted status
          const updatedRes = await axios.get('http://localhost:5001/api/invitation/select');
          if (updatedRes.data.success) {
            const updatedInvites = updatedRes.data.data || [];
            const updatedSent = updatedInvites.filter(i => i.inviter_id === user.id || i.inviter_email?.toLowerCase() === userEmailLower);
            const updatedRec = updatedInvites.filter(i => i.email?.toLowerCase() === userEmailLower);
            setSentInvitations(updatedSent);
            
            const updatedInbox = [...updatedRec];
            updatedSent.forEach(s => {
              if (!updatedInbox.some(r => r.id === s.id)) {
                updatedInbox.push(s);
              }
            });
            setReceivedInvitations(updatedInbox);
          }
        }
      }
    } catch (error) {
      console.error("Sync Error:", error);
      addToast("Could not sync with live database.", "error");
    }
  };

  useEffect(() => {
    // Load local cashbooks list
    const chalansStorageKey = `cashbook_chalans_${user?.email_id || 'guest'}`;
    const savedChalans = localStorage.getItem(chalansStorageKey);
    if (savedChalans) {
      setCashbooks(JSON.parse(savedChalans));
    } else {
      setCashbooks([{ id: '1', name: 'Home', createdAt: new Date().toISOString() }]);
    }

    fetchInvitations();
  }, [user?.email_id]);

  // Send Invitation (POST)
  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!selectedBook) {
      addToast("Please select a Cashbook first from the dropdown.", "error");
      setShowModal(false);
      return;
    }
    
    if (!inviteName || !inviteName.trim()) {
      addToast("Please enter a valid User Name.", "error");
      return;
    }

    if (!inviteEmail || !inviteEmail.trim() || !inviteEmail.includes('@')) {
      addToast("Please enter a valid Email Address.", "error");
      return;
    }
    
    const bookName = cashbooks.find(c => c.id === selectedBook)?.name || 'Unknown';
    
    try {
      addToast("Sending invitation...", "info");
      
      await axios.post('http://localhost:5001/api/invitation/insert', {
        email: inviteEmail.trim(),
        invite_name: inviteName.trim(),
        inviter_email: user?.email_id || '',
        inviter_id: user?.id || '',
        cashbook_name: bookName,
        permissions: invitePermission
      });

      addToast(`Invitation sent to ${inviteEmail}`, "success");
      setShowModal(false);
      setInviteName('');
      setInviteEmail('');
      setInvitePermission('View Only');
      
      // Refresh list
      fetchInvitations();
    } catch (error) {
      console.error("Invite API error:", error);
      addToast("Failed to create invitation in DB.", "error");
    }
  };

  // Accept Invitation (PUT Status to Accepted)
  const handleAcceptInvite = async (inviteId) => {
    try {
      const res = await axios.put('http://localhost:5001/api/invitation/update', { id: inviteId, status: 'Accepted' });
      if (res.data.success) {
        addToast("Invitation accepted successfully!", "success");
        fetchInvitations();
      }
    } catch (error) {
      addToast("Failed to accept invitation.", "error");
    }
  };

  // Reject Invitation (PUT Status to Rejected)
  const handleRejectInvite = async (inviteId) => {
    try {
       const res = await axios.put('http://localhost:5001/api/invitation/update', { id: inviteId, status: 'Rejected' });
      if (res.data.success) {
        addToast("Invitation declined.", "info");
        fetchInvitations();
      }
    } catch (error) {
      addToast("Failed to decline invitation.", "error");
    }
  };

  // Update Permission (PUT Permission)
  const handleUpdatePermission = async () => {
    if (!editingInvite?.id) return;
    try {
      const res = await axios.put('http://localhost:5001/api/invitation/update', { 
        id: editingInvite.id, 
        permissions: editingPermission 
      });
      if (res.data.success) {
        addToast("Permissions updated successfully!", "success");
        setShowEditModal(false);
        setEditingInvite(null);
        fetchInvitations();
      }
    } catch (error) {
      addToast("Failed to update permissions.", "error");
    }
  };

  // Confirm Cancel / Remove Invitation (DELETE)
  const handleConfirmDelete = async () => {
    if (!deletingInviteId) return;
    try {
      const res = await axios.delete('http://localhost:5001/api/invitation/delete', { data: { id: deletingInviteId } });
      if (res.data.success) {
        addToast("Invitation removed successfully", "info");
        setShowDeleteModal(false);
        setDeletingInviteId(null);
        fetchInvitations();
      }
    } catch (error) {
      addToast("Failed to remove invitation.", "error");
    }
  };

  const SortIcon = () => (
    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/40 inline-block ml-1" />
  );

  // Render Permission Badge with Premium Design
  const renderPermissionBadge = (perm) => {
    let classes = "";
    let icon = null;
    
    if (perm === "Admin") {
      classes = "bg-rose-50/70 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30";
      icon = <ShieldCheck className="w-3 h-3 text-rose-500" />;
    } else if (perm === "Edit") {
      classes = "bg-indigo-50/70 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30";
      icon = <FileText className="w-3 h-3 text-indigo-500" />;
    } else {
      classes = "bg-sky-50/70 text-sky-700 border-sky-200/50 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30";
      icon = <Eye className="w-3 h-3 text-sky-500" />;
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] font-bold tracking-wide shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${classes}`}>
        {icon}
        {perm}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'Jul 26, 2026', time: '12:00 PM' };
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return { date: 'Jul 26, 2026', time: '12:00 PM' };
      const date = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');
      const time = `${formattedHours}:${minutes} ${ampm}`;
      return { date, time };
    } catch (e) {
      return { date: 'Jul 26, 2026', time: '12:00 PM' };
    }
  };

  // Render Status Badge with Premium Pill Design
  const renderStatusBadge = (status) => {
    let classes = "";
    let dotClass = "";
    
    if (status === "Accepted") {
      classes = "bg-emerald-50/80 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
      dotClass = "bg-emerald-500";
    } else if (status === "Rejected") {
      classes = "bg-rose-50/80 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30";
      dotClass = "bg-rose-500";
    } else {
      classes = "bg-amber-50/80 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
      dotClass = "bg-amber-500 animate-pulse";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${classes}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 text-foreground bg-[#f8fafc] dark:bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-[24px] font-bold tracking-tight text-[#2b3674] dark:text-foreground">
            User Collaborators & Permissions
          </h1>
          <p className="text-[13.5px] text-muted-foreground mt-1 font-medium">
            Invite colleagues, coordinate cashbooks and manage access privileges dynamically
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 dark:bg-muted p-1 rounded-xl border border-slate-200/50">
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sent' 
                ? 'bg-white dark:bg-card text-[#2b3674] dark:text-foreground shadow-sm' 
                : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Sent Invites
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'received' 
                ? 'bg-white dark:bg-card text-[#2b3674] dark:text-foreground shadow-sm' 
                : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Inbox ({receivedInvitations.length})
          </button>
        </div>
      </div>

      {/* Select Cashbook and Invite Action Bar (Only visible for Outbox tab) */}
      {activeTab === 'sent' && (
        <div className="bg-white dark:bg-card border border-border/60 rounded-2xl shadow-[0_2px_15px_-3px_rgba(6,81,237,0.04)] p-6">
          <h2 className="text-[16px] font-bold text-[#2b3674] dark:text-foreground mb-4 tracking-tight">Select Cashbook to Invite</h2>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:flex-1 space-y-2 relative">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wide">Choose Cashbook</label>
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
                  addToast("Please select a Cashbook first.", "error");
                  return;
                }
                setShowModal(true);
              }}
              className="w-full md:w-auto px-6 py-2.5 bg-[#5a75f6] hover:bg-[#4661df] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] transition-colors whitespace-nowrap h-[42px] shadow-sm cursor-pointer"
            >
              <UserPlus className="w-[18px] h-[18px]" />
              Invite Collaborator
            </button>
          </div>
        </div>
      )}

      {/* Lists */}
      <div className="bg-white dark:bg-card border border-border/60 rounded-2xl shadow-[0_2px_15px_-3px_rgba(6,81,237,0.04)] overflow-hidden">
        {activeTab === 'sent' ? (
          <div>
            <div className="p-6 border-b border-border/40 flex justify-between items-center bg-slate-50/50 dark:bg-muted/10">
              <h2 className="text-[16px] font-bold text-[#2b3674] dark:text-foreground tracking-tight">Collaborators Sent List</h2>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-muted/30 border-b border-border/40 text-[12px] font-bold uppercase tracking-wider text-[#64748b] dark:text-muted-foreground">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Cashbook</th>
                    <th className="px-6 py-4">Permissions</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Invited On</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/45">
                  {sentInvitations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-sm text-muted-foreground font-medium">
                        No invitations sent yet. Select a cashbook to invite users.
                      </td>
                    </tr>
                  ) : (
                    sentInvitations.map((invite) => (
                      <tr key={invite.id} className="hover:bg-slate-50/30 dark:hover:bg-muted/5 text-sm font-medium text-foreground transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 dark:text-foreground">{invite.invite_name}</div>
                          <div className="text-[12px] text-muted-foreground font-normal">{invite.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-muted-foreground">{invite.cashbook_name}</td>
                        <td className="px-6 py-4">
                          {renderPermissionBadge(invite.permissions)}
                        </td>
                        <td className="px-6 py-4">{renderStatusBadge(invite.status)}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground font-normal">
                          {(() => {
                            const { date, time } = formatDateTime(invite.createdAt);
                            return (
                              <div>
                                <div className="font-semibold text-slate-800 dark:text-slate-200">{date}</div>
                                <div className="text-[11px] text-muted-foreground font-normal mt-0.5">{time}</div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            <button 
                              onClick={() => {
                                setEditingInvite(invite);
                                setEditingPermission(invite.permissions);
                                setShowEditModal(true);
                              }}
                              className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/20 rounded-xl transition-all cursor-pointer"
                              title="Edit Permission"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setDeletingInviteId(invite.id);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50/80 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-6 border-b border-border/40 flex justify-between items-center bg-slate-50/50 dark:bg-muted/10">
              <h2 className="text-[16px] font-bold text-[#2b3674] dark:text-foreground tracking-tight">Received Invitations (Inbox)</h2>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-muted/30 border-b border-border/40 text-[12px] font-bold uppercase tracking-wider text-[#64748b] dark:text-muted-foreground">
                    <th className="px-6 py-4">User Details / Shared By</th>
                    <th className="px-6 py-4">Cashbook</th>
                    <th className="px-6 py-4">Permission Offered</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Received / Invited On</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/45">
                  {receivedInvitations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-sm text-muted-foreground font-medium">
                        No invitations in Inbox yet. Shared cashbooks and invited collaborators will appear here.
                      </td>
                    </tr>
                  ) : (
                    receivedInvitations.map((invite) => {
                      const isRecipient = invite.email?.toLowerCase() === user?.email_id?.toLowerCase();
                      const primaryName = invite.invite_name || (isRecipient ? invite.inviter_email : invite.email);

                      return (
                        <tr key={invite.id} className="hover:bg-slate-50/30 dark:hover:bg-muted/5 text-sm font-medium text-foreground transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800 dark:text-foreground">{primaryName}</div>
                            <div className="text-[12px] text-muted-foreground font-normal">
                              {isRecipient ? `Shared by ${invite.inviter_email}` : invite.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-muted-foreground">{invite.cashbook_name}</td>
                          <td className="px-6 py-4">{renderPermissionBadge(invite.permissions)}</td>
                          <td className="px-6 py-4">{renderStatusBadge(invite.status)}</td>
                          <td className="px-6 py-4 text-xs text-muted-foreground font-normal">
                            {(() => {
                              const { date, time } = formatDateTime(invite.createdAt);
                              return (
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">{date}</div>
                                  <div className="text-[11px] text-muted-foreground font-normal mt-0.5">{time}</div>
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {invite.status === 'Pending' && isRecipient ? (
                              <div className="flex justify-end gap-2.5">
                                <button 
                                  onClick={() => handleAcceptInvite(invite.id)}
                                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleRejectInvite(invite.id)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-muted dark:hover:bg-muted/80 dark:text-foreground rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Decline
                                </button>
                              </div>
                            ) : invite.status === 'Accepted' ? (
                              <div className="flex items-center justify-end gap-2.5">
                                <span className="text-xs text-muted-foreground font-semibold italic">Closed</span>
                                <button 
                                  onClick={() => navigate('/dashboard/cashbooks')}
                                  className="px-3 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                                  title="Open Cashbook"
                                >
                                  <Book className="w-3.5 h-3.5" />
                                  Open
                                </button>
                              </div>
                            ) : invite.status === 'Pending' ? (
                              <div className="flex justify-end items-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingInvite(invite);
                                    setEditingPermission(invite.permissions);
                                    setShowEditModal(true);
                                  }}
                                  className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/20 rounded-xl transition-all cursor-pointer"
                                  title="Edit Permission"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setDeletingInviteId(invite.id);
                                    setShowDeleteModal(true);
                                  }}
                                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50/80 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                                  title="Remove"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground font-semibold italic">
                                Declined
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowModal(false);
                setInviteName('');
                setInviteEmail('');
              }}
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] p-6 w-full max-w-[400px] z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2 text-[#2b3674] dark:text-foreground">
                  <UserPlus className="w-5 h-5 text-[#5a75f6]" />
                  Invite Collaborator
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setInviteName('');
                    setInviteEmail('');
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Collaborator Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Enter user name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Access Level / Permissions</label>
                  <Dropdown
                    value={invitePermission}
                    onChange={(e) => setInvitePermission(e.target.value)}
                  >
                    <option value="View Only">View Only</option>
                    <option value="Edit">Edit</option>
                    <option value="Admin">Admin</option>
                  </Dropdown>
                </div>
                
                <button
                  type="button"
                  onClick={handleInvite}
                  className="w-full py-3 bg-[#5a75f6] hover:bg-[#4661df] text-white font-bold rounded-xl text-sm shadow-[0_4px_12px_rgba(90,117,246,0.25)] transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowEditModal(false);
                setEditingInvite(null);
              }}
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] p-6 w-full max-w-[400px] z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2 text-[#2b3674] dark:text-foreground">
                  <ShieldCheck className="w-5 h-5 text-[#5a75f6]" />
                  Update Permission
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingInvite(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Collaborator Name</label>
                  <input
                    type="text"
                    value={editingInvite?.invite_name || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-border text-sm font-medium text-slate-400 bg-slate-50 dark:bg-muted/10 cursor-not-allowed select-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={editingInvite?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-border text-sm font-medium text-slate-400 bg-slate-50 dark:bg-muted/10 cursor-not-allowed select-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Access Level / Permissions</label>
                  <Dropdown
                    value={editingPermission}
                    onChange={(e) => setEditingPermission(e.target.value)}
                  >
                    <option value="View Only">View Only</option>
                    <option value="Edit">Edit</option>
                    <option value="Admin">Admin</option>
                  </Dropdown>
                </div>
                
                <button
                  type="button"
                  onClick={handleUpdatePermission}
                  className="w-full py-3 bg-[#5a75f6] hover:bg-[#4661df] text-white font-bold rounded-xl text-sm shadow-[0_4px_12px_rgba(90,117,246,0.25)] transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Update Permission
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingInviteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Invitation"
        message="Are you sure you want to delete this collaborator invitation? This action cannot be undone."
      />
    </div>
  );
};

export default Invitations;
