import React from 'react';

export default function PageContainer({ children }) {
  return (
    // Relative positioning ensures z-index works, but low z-index keeps it below header
    <div className="relative w-full min-h-full animate-fade-in z-0">
      {children}
    </div>
  );
}