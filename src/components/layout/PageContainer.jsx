import React from 'react';
import TopNav from './TopNav';
import MenuOverlay from './MenuOverlay'; // Keeping this if you use it, otherwise can remove

export default function PageContainer({ children }) {
  return (
    // H-SCREEN: Locks to viewport height. OVERFLOW-HIDDEN: Kills global scrollbar.
    <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. HEADER (Fixed height, never shrinks) */}
      <TopNav />

      {/* 2. MAIN CONTENT (Takes all remaining space)
          min-h-0 is CRITICAL for nested scrolling to work in Flexbox.
          relative allows absolute positioning inside (like overlays).
      */}
      <main className="flex-1 w-full relative flex flex-col min-h-0">
        {children}
      </main>

      {/* Menu Overlay (Optional, sits on top if active) */}
      <MenuOverlay /> 
    </div>
  );
}