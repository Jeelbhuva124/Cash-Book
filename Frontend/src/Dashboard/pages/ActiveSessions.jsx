import React, { useState, useEffect } from 'react';
import { LogOut, ChevronsUpDown, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export const ActiveSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'MacOS Device Safari',
      active: true,
      location: 'Mumbai, India',
      loginTime: '18-07-2026 10:15 AM',
      isCurrent: false
    }
  ]);

  const [searchFilters, setSearchFilters] = useState({
    device: '',
    active: '',
    location: '',
    loginTime: ''
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const loadSessions = async () => {
      let saved = JSON.parse(localStorage.getItem('active_sessions') || '[]');
      
      // If empty (e.g. testing in dev mode without logging in), generate one
      if (saved.length === 0) {
        const { recordNewSession } = await import('../../utils/sessionManager');
        await recordNewSession();
        saved = JSON.parse(localStorage.getItem('active_sessions') || '[]');
      }

      const currentId = localStorage.getItem('current_session_id');
      
      const formatted = saved.map(s => {
        const isCurrent = s.id === currentId;
        // Ensure only the current device has the "(Current Device)" tag in the UI
        let displayDevice = s.device.replace(' (Current Device)', '');
        if (isCurrent) displayDevice = `${displayDevice} (Current Device)`;

        return {
          ...s,
          isCurrent,
          device: displayDevice,
          active: true
        };
      });

      setSessions(formatted);
    };

    loadSessions();
  }, []);

  const handleSearchChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoutSession = (id) => {
    if (id === 'current' || id === localStorage.getItem('current_session_id')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      // Remove from localStorage as well
      const saved = JSON.parse(localStorage.getItem('active_sessions') || '[]');
      const filtered = saved.filter(session => session.id !== id);
      localStorage.setItem('active_sessions', JSON.stringify(filtered));
      
      setSessions(prev => prev.filter(session => session.id !== id));
    }
  };

  // Filter logic (mock)
  const filteredSessions = sessions.filter(session => {
    return (
      session.device.toLowerCase().includes(searchFilters.device.toLowerCase()) &&
      session.location.toLowerCase().includes(searchFilters.location.toLowerCase()) &&
      session.loginTime.toLowerCase().includes(searchFilters.loginTime.toLowerCase())
    );
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    // Convert active to string for sorting
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    
    if (sortConfig.key === 'active') {
      valA = a.active ? 'active' : 'inactive';
      valB = b.active ? 'active' : 'inactive';
    }
    
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown className="w-3.5 h-3.5" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  return (
    <div className="p-6 w-full text-foreground">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Active Session Manager</h1>
        <p className="text-muted-foreground text-sm">Manage Login activity for your account</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border/80 flex items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            Login activity <span className="text-muted-foreground text-sm font-medium ml-1">• {sessions.length} Records</span>
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] text-foreground/90 font-semibold border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap align-top pt-6 hover:text-primary transition-colors cursor-default">No</th>
                
                <th className="px-4 py-4 font-semibold align-top min-w-[250px] group">
                  <div 
                    onClick={() => handleSort('device')}
                    className="flex items-center justify-center gap-2 mb-3 group-hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    Device <SortIcon columnKey="device" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-transparent border border-border/80 rounded-md px-3 py-1.5 text-[13px] font-normal text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 transition-colors"
                    value={searchFilters.device}
                    onChange={(e) => handleSearchChange('device', e.target.value)}
                  />
                </th>
                
                <th className="px-4 py-4 font-semibold align-top min-w-[120px] group">
                  <div 
                    onClick={() => handleSort('active')}
                    className="flex items-center justify-center gap-2 mb-3 group-hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    Active <SortIcon columnKey="active" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-transparent border border-border/80 rounded-md px-3 py-1.5 text-[13px] font-normal text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 transition-colors"
                    value={searchFilters.active}
                    onChange={(e) => handleSearchChange('active', e.target.value)}
                  />
                </th>
                
                <th className="px-4 py-4 font-semibold align-top min-w-[150px] group">
                  <div 
                    onClick={() => handleSort('location')}
                    className="flex items-center justify-center gap-2 mb-3 group-hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    Location <SortIcon columnKey="location" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-transparent border border-border/80 rounded-md px-3 py-1.5 text-[13px] font-normal text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 transition-colors"
                    value={searchFilters.location}
                    onChange={(e) => handleSearchChange('location', e.target.value)}
                  />
                </th>
                
                <th className="px-4 py-4 font-semibold align-top min-w-[180px] group">
                  <div 
                    onClick={() => handleSort('loginTime')}
                    className="flex items-center justify-center gap-2 mb-3 group-hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    Login Time <SortIcon columnKey="loginTime" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-transparent border border-border/80 rounded-md px-3 py-1.5 text-[13px] font-normal text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 transition-colors"
                    value={searchFilters.loginTime}
                    onChange={(e) => handleSearchChange('loginTime', e.target.value)}
                  />
                </th>
                
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap align-top pt-6 hover:text-primary transition-colors cursor-default">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedSessions.map((session, index) => (
                <tr key={session.id} className="hover:bg-muted/10 hover:shadow-sm transform hover:-translate-y-0.5 transition-all duration-200 group">
                  <td className="px-6 py-5 text-muted-foreground text-center">{index + 1}</td>
                  <td className="px-4 py-5 text-foreground text-center">{session.device}</td>
                  <td className="px-4 py-5 text-center">
                    {session.active && (
                      <div className="flex justify-center">
                         <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                           <CheckCircle2 className="w-5 h-5 text-primary" strokeWidth={2.5} />
                         </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-5 text-center">{session.location}</td>
                  <td className="px-4 py-5 whitespace-nowrap text-center">{session.loginTime}</td>
                  <td className="px-6 py-5 text-center flex justify-center">
                    {session.isCurrent && (
                      <button 
                        onClick={() => handleLogoutSession(session.id)}
                        className="p-1.5 rounded-md border border-expense/50 text-expense hover:bg-expense/10 hover:border-expense transition-colors flex items-center justify-center"
                        title="Logout Device"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                    No active sessions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

