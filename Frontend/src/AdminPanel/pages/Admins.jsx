import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, UserCheck, ShieldCheck, Mail, Phone, Trash2, RefreshCw, X, AlertTriangle, Plus, ShieldCheck as ShieldIcon, Pencil, Lock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Admins = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState('promote'); // 'promote' or 'create'
  
  // Security PIN state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSecurityPin, setEditSecurityPin] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);
  
  // Create Form State
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSecurityPin, setNewSecurityPin] = useState('');
  const [submittingCreate, setSubmittingCreate] = useState(false);
  
  // Promote Form State
  const [selectedUserId, setSelectedUserId] = useState('');
  const [submittingPromote, setSubmittingPromote] = useState(false);
  
  const { toast } = useToast();

  // Retrieve current logged-in admin email & ID to block self-modifications
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    try {
      const storedUserStr = sessionStorage.getItem('cashbook_admin_user') || localStorage.getItem('cashbook_admin_user');
      if (storedUserStr) {
        const parsed = JSON.parse(storedUserStr);
        // User record might be an array or object
        const adminObj = Array.isArray(parsed) ? parsed[0] : parsed;
        if (adminObj) {
          setCurrentAdmin(adminObj);
        }
      }
    } catch (e) {
      console.warn('Failed to parse current admin session', e);
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/select');
      const data = await response.json();
      if (data.success && data.data) {
        const combined = [...(data.data.users || []), ...(data.data.admins || [])];
        setUsers(combined);
      } else {
        // Fallback to generic user select API
        const fallbackRes = await fetch('http://localhost:5001/api/user/select');
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success && Array.isArray(fallbackData.data)) {
          setUsers(fallbackData.data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch users from server", err.message);
      // Demo fallback users
      setUsers([
        { id: 'usr-1', username: 'Rahul Sharma', email_id: 'rahul@kirana.in', user_role: 'user', account_status: 'active', created_at: '2026-01-15' },
        { id: 'usr-2', username: 'Priya Patel', email_id: 'priya.dev@gmail.com', user_role: 'user', account_status: 'active', created_at: '2026-02-04' },
        { id: 'usr-3', username: 'Admin Root', email_id: 'superadmin@cashbook.io', user_role: 'admin', account_status: 'active', created_at: '2025-11-18' },
        { id: 'usr-4', username: 'Suresh Kumar', email_id: 'suresh@shop.com', user_role: 'user', account_status: 'suspended', created_at: '2025-12-22' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter lists: admins vs normal users
  const adminUsers = users.filter(u => {
    const role = u.user_role || (u.is_admin ? 'admin' : 'user');
    return role === 'admin';
  });

  const regularUsers = users.filter(u => {
    const role = u.user_role || (u.is_admin ? 'admin' : 'user');
    return role !== 'admin';
  });

  // Apply search & status filters on client-side (conforming to GET /select guidelines)
  const filteredAdmins = adminUsers.filter(u => {
    const name = u.username || '';
    const email = u.email_id || '';
    const status = u.account_status || 'active';

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // Action handlers
  const handleToggleStatus = async (user) => {
    const isSelf = currentAdmin && (user.id === currentAdmin.id || user._id === currentAdmin.id || user.email_id?.toLowerCase() === currentAdmin.email_id?.toLowerCase());
    if (isSelf) {
      toast.error("You cannot suspend your own admin account.");
      return;
    }

    const nextStatus = user.account_status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('http://localhost:5001/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || user._id,
          account_status: nextStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Admin account ${user.username || user.email_id} has been ${nextStatus === 'active' ? 'activated' : 'suspended'}.`);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to update admin account status.");
      }
    } catch (err) {
      toast.error("An error occurred during updating status.");
    }
  };

  const handleDemoteAdmin = async (user) => {
    const isSelf = currentAdmin && (user.id === currentAdmin.id || user._id === currentAdmin.id || user.email_id?.toLowerCase() === currentAdmin.email_id?.toLowerCase());
    if (isSelf) {
      toast.error("You cannot demote your own admin account. Please use another administrator account.");
      return;
    }

    if (!confirm(`Are you sure you want to demote ${user.username || user.email_id} back to a regular user?`)) return;

    try {
      const res = await fetch('http://localhost:5001/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || user._id,
          user_role: 'user',
          is_admin: false
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`User ${user.username || user.email_id} demoted to regular user.`);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to demote administrator.");
      }
    } catch (err) {
      toast.error("An error occurred while demoting.");
    }
  };

  const handleDeleteAdmin = async (user) => {
    const isSelf = currentAdmin && (user.id === currentAdmin.id || user._id === currentAdmin.id || user.email_id?.toLowerCase() === currentAdmin.email_id?.toLowerCase());
    if (isSelf) {
      toast.error("You cannot delete your own admin account.");
      return;
    }

    if (!confirm(`CRITICAL WARNING: Are you sure you want to permanently delete admin account ${user.username || user.email_id}?`)) return;

    try {
      const res = await fetch('http://localhost:5001/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || user._id
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Administrator account deleted successfully.");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete administrator account.");
      }
    } catch (err) {
      toast.error("An error occurred while deleting.");
    }
  };

  const handlePromoteExisting = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a user to promote.");
      return;
    }

    setSubmittingPromote(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUserId,
          user_role: 'admin',
          is_admin: true
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User successfully promoted to Administrator!");
        setIsAddModalOpen(false);
        setSelectedUserId('');
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to promote user.");
      }
    } catch (err) {
      toast.error("An error occurred during promotion.");
    } finally {
      setSubmittingPromote(false);
    }
  };

  const handleCreateNewAdmin = async (e) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmittingCreate(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          email_id: newEmail,
          password: newPassword,
          user_role: 'admin',
          phone_number: newPhone,
          security_pin: newSecurityPin || '1234'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("New Admin account provisioned successfully!");
        setIsAddModalOpen(false);
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setNewPhone('');
        setNewSecurityPin('');
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to create Admin account.");
      }
    } catch (err) {
      toast.error("An error occurred while creating admin account.");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleOpenEditModal = (admin) => {
    setEditingAdmin(admin);
    setEditUsername(admin.username || '');
    setEditEmail(admin.email_id || admin.email || '');
    setEditPassword(admin.password || '');
    setEditPhone(admin.phone_number || '');
    setEditSecurityPin(admin.security_pin || '1234');
    setIsEditModalOpen(true);
  };

  const handleEditAdminSubmit = async (e) => {
    e.preventDefault();
    if (!editUsername || !editEmail || !editPassword) {
      toast.error("Username, Email ID, and Password are required.");
      return;
    }

    setSubmittingEdit(true);
    const targetUserId = editingAdmin.id || editingAdmin._id;

    try {
      const res = await fetch('http://localhost:5001/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: targetUserId,
          username: editUsername,
          email_id: editEmail,
          password: editPassword,
          phone_number: editPhone,
          security_pin: editSecurityPin
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Administrator updated successfully!");
        setIsEditModalOpen(false);

        // Check if editing self, to keep state/session synchronized
        const isSelf = currentAdmin && (editingAdmin.id === currentAdmin.id || editingAdmin._id === currentAdmin.id || editingAdmin.email_id?.toLowerCase() === currentAdmin.email_id?.toLowerCase());
        if (isSelf) {
          const updatedSessionUser = {
            ...currentAdmin,
            username: editUsername,
            email_id: editEmail,
            phone_number: editPhone,
            security_pin: editSecurityPin
          };
          sessionStorage.setItem('cashbook_admin_user', JSON.stringify(updatedSessionUser));
          localStorage.setItem('cashbook_admin_user', JSON.stringify(updatedSessionUser));
          setCurrentAdmin(updatedSessionUser);
        }

        fetchUsers();
      } else {
        toast.error(data.message || "Failed to update administrator.");
      }
    } catch (err) {
      toast.error("An error occurred while updating administrator.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Stats calculation
  const totalAdmins = adminUsers.length;
  const activeAdmins = adminUsers.filter(a => (a.account_status || 'active') === 'active').length;
  const suspendedAdmins = totalAdmins - activeAdmins;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = currentAdmin?.security_pin || '1234';
    if (pinInput === correctPin) {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPinInput('');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-card border border-border p-8 rounded-3xl shadow-xl w-full max-w-sm flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">Secure Access</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your 4-digit Special Code to access the Control Center.</p>
          
          <form onSubmit={handlePinSubmit} className="w-full space-y-4">
            <div>
              <input
                type="password"
                maxLength="4"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                  setPinError('');
                }}
                className={`w-full px-4 py-3 text-center tracking-[1em] text-2xl rounded-2xl bg-muted border font-black focus:outline-none focus:ring-2 focus:ring-primary/40 ${pinError ? 'border-rose-500' : 'border-border'}`}
                placeholder="••••"
                required
              />
              {pinError && <p className="text-rose-500 text-xs font-bold mt-2">{pinError}</p>}
            </div>
            <button
              type="submit"
              disabled={pinInput.length !== 4}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Unlock Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            <ShieldIcon className="w-8 h-8 text-primary" />
            <span>Admin Accounts</span>
          </h1>
          <p className="text-sm text-muted-foreground">Manage administrator roles, security profiles, and system access rights.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Administrators</p>
          <h3 className="text-3xl font-black mt-2 text-foreground">{totalAdmins}</h3>
          <p className="text-xs text-muted-foreground mt-1">Platform management tier</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active Admins</p>
          <h3 className="text-3xl font-black mt-2 text-emerald-500">{activeAdmins}</h3>
          <p className="text-xs text-muted-foreground mt-1">Operational accounts</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Suspended Admins</p>
          <h3 className="text-3xl font-black mt-2 text-rose-500">{suspendedAdmins}</h3>
          <p className="text-xs text-muted-foreground mt-1">Suspended permissions</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search admins by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex gap-2">
            {['ALL', 'ACTIVE', 'SUSPENDED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer ${statusFilter === status
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-card'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-bold text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="p-4">Admin Profile</th>
                <th className="p-4">Status</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Created At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground font-semibold">Loading administrators...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins.map((user, idx) => {
                  const uId = user.id || user._id || idx;
                  const status = user.account_status || 'active';
                  const isSelf = currentAdmin && (user.id === currentAdmin.id || user._id === currentAdmin.id || user.email_id?.toLowerCase() === currentAdmin.email_id?.toLowerCase());

                  return (
                    <tr key={uId} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 border border-border shadow-sm">
                              <img 
                                src={user.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center uppercase shrink-0 border border-primary/20 shadow-sm">
                              {(user.username || user.email_id || 'A').substring(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-foreground">{user.username || 'Admin User'}</p>
                              {isSelf && (
                                <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black tracking-widest uppercase rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{user.email_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {user.phone_number || 'N/A'}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {/* Status Toggle Button */}
                        <button
                          disabled={isSelf}
                          onClick={() => handleToggleStatus(user)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${status === 'active'
                              ? 'border-rose-500/30 text-rose-500 hover:bg-rose-500/10'
                              : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                        >
                          {status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        {/* Demote Button */}
                        <button
                          disabled={isSelf}
                          onClick={() => handleDemoteAdmin(user)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Demote to Regular User"
                        >
                          Demote
                        </button>
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Edit Admin Credentials"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Delete Button */}
                        <button
                          disabled={isSelf}
                          onClick={() => handleDeleteAdmin(user)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors inline-flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Delete Admin Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-muted-foreground">
                    No administrators found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black text-foreground">Add Administrator</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-2 border-b border-border bg-muted/10">
              <button
                onClick={() => setAddMode('promote')}
                className={`py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${addMode === 'promote' 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Promote Existing User
              </button>
              <button
                onClick={() => setAddMode('create')}
                className={`py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${addMode === 'create' 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Create New Admin
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {addMode === 'promote' ? (
                <form onSubmit={handlePromoteExisting} className="space-y-4">
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-2.5 mb-2">
                    <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary font-semibold leading-relaxed">
                      Promoting a user grants them full administrative controls to the server control center, including access to registries, system settings, and user accounts.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1.5">Select regular user to promote</label>
                    {regularUsers.length > 0 ? (
                      <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        required
                      >
                        <option value="">-- Choose User --</option>
                        {regularUsers.map(u => (
                          <option key={u.id || u._id} value={u.id || u._id}>
                            {u.username || 'User'} ({u.email_id})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-4 bg-muted/40 border border-border rounded-xl text-center">
                        <p className="text-xs text-muted-foreground">No regular user accounts available to promote.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingPromote || !selectedUserId}
                      className="px-5 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingPromote ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                      <span>Promote to Admin</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCreateNewAdmin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. Administrator 1"
                      className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Email ID</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. admin.new@cashbook.io"
                      className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter administrative password"
                      className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="e.g. +91 9988776655"
                      className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Special Code (4 digits)</label>
                    <input
                      type="text"
                      maxLength="4"
                      value={newSecurityPin}
                      onChange={(e) => setNewSecurityPin(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="1234"
                      className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingCreate}
                      className="px-5 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {submittingCreate ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      <span>Provision Admin</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {isEditModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black text-foreground">Edit Administrator</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleEditAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="e.g. Administrator"
                    className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Email ID / Gmail</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="e.g. admin@cashbook.io"
                    className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Password</label>
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. +91 9988776655"
                    className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Special Code (4 digits)</label>
                  <input
                    type="text"
                    maxLength="4"
                    value={editSecurityPin}
                    onChange={(e) => setEditSecurityPin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="1234"
                    className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEdit}
                    className="px-5 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submittingEdit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
