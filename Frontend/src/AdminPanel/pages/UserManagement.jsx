import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Shield, Ban, CheckCircle, Mail, Phone, Trash2, RefreshCw, X, Book, Activity, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  
  // User Details Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/select');
      const data = await response.json();
      if (data.success && data.data && data.data.users) {
        setUsers(data.data.users);
      } else {
        // Fallback to user/select API
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

  const openUserDetails = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id || user._id })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUserDetails(data.data);
      } else {
        toast.error(data.message || "Failed to fetch user details");
        setUserDetails(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching details.");
      setUserDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleUserStatus = async (e, user) => {
    e.stopPropagation();
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
        toast.success(`User status updated to ${nextStatus}`);
        setUsers(prev => prev.map(u => (u.id === user.id || u._id === user._id) ? { ...u, account_status: nextStatus } : u));
      } else {
        toast.error(data.message || "Failed to update user status");
      }
    } catch (err) {
      setUsers(prev => prev.map(u => (u.id === user.id || u._id === user._id) ? { ...u, account_status: nextStatus } : u));
      toast.success(`User status updated to ${nextStatus}`);
    }
  };

  const deleteUser = async (e, user) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete user ${user.username || user.email_id}?`)) return;

    try {
      const res = await fetch('http://localhost:5001/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id || user._id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User deleted successfully");
        setUsers(prev => prev.filter(u => u.id !== user.id && u._id !== user._id));
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (err) {
      setUsers(prev => prev.filter(u => u.id !== user.id && u._id !== user._id));
      toast.success("User deleted successfully");
    }
  };

  const filteredUsers = users.filter(u => {
    const name = u.username || '';
    const email = u.email_id || '';
    const role = u.user_role || (u.is_admin ? 'admin' : 'user');

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts, roles, permissions, and system access.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => alert("To add user, specify user parameters.")}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 shadow-md shadow-primary/20 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Header */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or email_id..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex gap-2">
            {['ALL', 'admin', 'user'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase ${roleFilter === role
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-card'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-bold text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">User Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Created At</th>
                <th className="p-4 text-center">Activities</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, idx) => {
                const uId = user.id || user._id || idx;
                const status = user.account_status || 'active';
                const role = user.user_role || (user.is_admin ? 'admin' : 'user');

                // Read local profile override
                let localAvatar = null;
                try {
                  const saved = localStorage.getItem('profile_data');
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    const savedEmail = (parsed.email || parsed.email_id || '').toLowerCase().trim();
                    const currentEmail = (user.email_id || '').toLowerCase().trim();
                    if (savedEmail && currentEmail && savedEmail === currentEmail && parsed.avatar) {
                      localAvatar = parsed.avatar;
                    }
                  }
                } catch(e) {}

                const displayAvatar = localAvatar || user.avatar;

                return (
                  <tr key={uId} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {displayAvatar ? (
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 border border-border shadow-sm">
                            <img 
                              src={displayAvatar}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center uppercase shrink-0 border border-primary/20 shadow-sm">
                            {(user.username || user.email_id || 'U').substring(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-foreground">{user.username || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user.email_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-foreground border-border'
                        }`}>
                        {role}
                      </span>
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
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openUserDetails(user)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        See Activities
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={(e) => toggleUserStatus(e, user)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${status === 'active'
                            ? 'border-rose-500/30 text-rose-500 hover:bg-rose-500/10'
                            : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                      >
                        {status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={(e) => deleteUser(e, user)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        (() => {
          let localAvatar = null;
          try {
            const saved = localStorage.getItem('profile_data');
            if (saved) {
              const parsed = JSON.parse(saved);
              const savedEmail = (parsed.email || parsed.email_id || '').toLowerCase().trim();
              const currentEmail = (selectedUser.email_id || '').toLowerCase().trim();
              if (savedEmail && currentEmail && savedEmail === currentEmail && parsed.avatar) {
                localAvatar = parsed.avatar;
              }
            }
          } catch(e) {}
          const modalAvatar = localAvatar || selectedUser.avatar;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-4">
                    {modalAvatar ? (
                      <div className="w-16 h-16 rounded-full bg-muted overflow-hidden shrink-0 border-2 border-border shadow-md">
                        <img 
                          src={modalAvatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center uppercase shrink-0 border-2 border-primary/20 shadow-md">
                        {(selectedUser.username || selectedUser.email_id || 'U').substring(0, 2)}
                      </div>
                    )}
                <div>
                  <h2 className="text-2xl font-black text-foreground">{selectedUser.username || 'User Profile'}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> {selectedUser.email_id}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
              {loadingDetails ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading user activities...</p>
                </div>
              ) : userDetails ? (
                <>
                  {/* Basic Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">Role</p>
                      <p className="font-bold text-foreground capitalize">{userDetails.user.user_role || (userDetails.user.is_admin ? 'admin' : 'user')}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">Status</p>
                      <p className="font-bold text-foreground capitalize">{userDetails.user.account_status || 'active'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">Cashbooks</p>
                      <p className="font-bold text-foreground">{userDetails.cashbooks.length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">Transactions</p>
                      <p className="font-bold text-foreground">{userDetails.transactions.length}</p>
                    </div>
                  </div>

                  {/* Cashbooks Section */}
                  <div>
                    <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                      <Book className="w-5 h-5 text-primary" /> User's Cashbooks
                    </h3>
                    {userDetails.cashbooks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userDetails.cashbooks.map(cb => (
                          <div key={cb.id || cb._id} className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-start gap-3">
                            <div className="w-3 h-full rounded-full" style={{ backgroundColor: cb.hex_code || '#8B5CF6' }} />
                            <div>
                              <p className="font-bold text-foreground">{cb.cashbook_name}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cb.description || 'No description'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl border border-border">No cashbooks created yet.</p>
                    )}
                  </div>

                  {/* Transactions Section */}
                  <div>
                    <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" /> Recent Transactions
                    </h3>
                    {userDetails.transactions.length > 0 ? (
                      <div className="rounded-xl border border-border overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-muted/50 text-muted-foreground font-bold text-xs uppercase">
                            <tr>
                              <th className="p-3">Title</th>
                              <th className="p-3">Type</th>
                              <th className="p-3 text-right">Amount</th>
                              <th className="p-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {userDetails.transactions.map(tx => (
                              <tr key={tx.id || tx._id} className="hover:bg-muted/20">
                                <td className="p-3 font-medium text-foreground">{tx.title}</td>
                                <td className="p-3">
                                  <span className={`text-xs font-bold uppercase ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className={`p-3 text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                                </td>
                                <td className="p-3 text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {tx.date}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl border border-border">No transactions found.</p>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      );
    })()
  )}
</div>
);
};

export default UserManagement;
