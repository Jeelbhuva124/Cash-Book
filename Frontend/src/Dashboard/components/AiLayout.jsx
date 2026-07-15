import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AiSidebar } from './AiSidebar';
import { Menu, BookOpen } from 'lucide-react';

export const AiLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <AiSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-border bg-card z-10 sticky top-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
            <span className="font-bold text-sm text-foreground">Daily Chalan</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto relative h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
