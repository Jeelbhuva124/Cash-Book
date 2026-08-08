import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <AdminHeader 
          setMobileOpen={setMobileOpen} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
