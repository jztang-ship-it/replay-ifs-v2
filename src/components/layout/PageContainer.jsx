// src/components/layout/PageContainer.jsx
import React from 'react';

export default function PageContainer({ children, className = '' }) {
  return (
    // THE HARD RULES:
    // 1. h-screen w-screen: Forces app to be mobile size, no scrolling the whole window.
    // 2. pt-[70px]: AUTOMATICALLY clears your Top Header (no more squeezing).
    // 3. bg-gray-900: Sets the standard background color.
    // 4. overflow-hidden: Prevents weird scrollbars appearing on the body.
    <div className={`h-screen w-screen bg-gray-900 pt-[70px] overflow-hidden flex flex-col ${className}`}>
      {children}
    </div>
  );
}