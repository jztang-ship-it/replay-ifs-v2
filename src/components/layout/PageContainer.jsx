import React from 'react';
import TopNav from './TopNav';

export default function PageContainer({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-100">
      <TopNav />
      {/* pt-16 ensures content starts BELOW the fixed header */}
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden relative pt-16 mt-2">
        {children}
      </div>
    </div>
  );
}