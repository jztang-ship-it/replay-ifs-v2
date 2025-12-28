import React from 'react';
import TopNav from './TopNav'; // Importing the correct file name now

export default function PageContainer({ children }) {
  return (
    // Flex column layout: TopNav at top, content fills the rest
    <div className="flex flex-col h-screen w-full bg-slate-950 text-white overflow-hidden">
      
      {/* 1. The New Top Navigation */}
      <TopNav />

      {/* 2. Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>

    </div>
  );
}