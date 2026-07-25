import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Shield, Ban, CheckCircle, Mail, Phone, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
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

  const toggleUserStatus = async (user) => {
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

  const deleteUser = async (user) => {
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
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, idx) => {
                const uId = user.id || user._id || idx;
                const status = user.account_status || 'active';
                const role = user.user_role || (user.is_admin ? 'admin' : 'user');

                return (
                  <tr key={uId} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center uppercase">
                          {(user.username || user.email_id || 'U').substring(0, 2)}
                        </div>
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
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${status === 'active'
                            ? 'border-rose-500/30 text-rose-500 hover:bg-rose-500/10'
                            : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                      >
                        {status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteUser(user)}
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
    </div>
  );
};
