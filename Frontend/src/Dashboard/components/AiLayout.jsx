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
        <div className="lg:hidden flex items-center p-4 border-b border-slate-100 bg-white z-10 sticky top-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-bold text-sm text-slate-800">Daily Chalan</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto relative h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
