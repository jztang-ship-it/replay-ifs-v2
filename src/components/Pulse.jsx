// src/components/Pulse.jsx
import React, { useState } from 'react';
import PageContainer from './layout/PageContainer'; 
import PulseTicker from './Pulse/PulseTicker'; 
import { pulseTickerData, pulseFeedData } from '../data/pulseData';

// --- 1. Define Helper Components (These were missing!) ---

const ExternalNewsCard = ({ item }) => (
  <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4 shadow-lg">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs text-blue-400 font-bold uppercase">{item.source}</span>
      <span className="text-xs text-gray-500">{item.timestamp}</span>
    </div>
    <h3 className="text-white font-bold text-lg leading-tight mb-2">{item.headline}</h3>
    <p className="text-gray-300 text-sm mb-3 line-clamp-3">{item.summary}</p>
    
    <div className="flex items-center gap-4 border-t border-gray-700 pt-3">
      <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
        💬 {item.comments} Comments
      </button>
      <button className="text-xs text-gray-400 hover:text-white">Share</button>
    </div>
  </div>
);

const InternalWinCard = ({ item }) => (
  <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600/50 rounded-lg p-4 mb-4 relative overflow-hidden">
    <div className="absolute top-0 right-0 bg-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
      REPLAY EVENT
    </div>
    
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl">
        🧢
      </div>
      <div>
        <p className="text-white font-bold text-sm">{item.user}</p>
        <p className="text-yellow-400 text-xs font-bold">{item.event}</p>
      </div>
    </div>

    <p className="text-gray-200 text-sm mb-3">
      {item.highlight} <span className="text-gray-400">- {item.details}</span>
    </p>

    <div className="flex items-center gap-4 border-t border-gray-700 pt-3">
       <button className="text-xs text-yellow-500 hover:text-yellow-300 font-bold uppercase">
         🔥 Cheer
       </button>
       <button className="text-xs text-gray-400 hover:text-white">
         💬 {item.comments}
       </button>
    </div>
  </div>
);

// --- 2. Main Component ---

export default function Pulse() {
  const [activeTab, setActiveTab] = useState('ALL');

  return (
    <PageContainer>
      
      {/* Ticker */}
      <PulseTicker items={pulseTickerData} />

      {/* Tabs */}
      <div className="flex gap-4 p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur z-10">
        {['ALL', 'NEWS', 'REPLAY'].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`text-sm font-bold pb-1 transition-colors ${
               activeTab === tab 
               ? 'text-white border-b-2 border-orange-500' 
               : 'text-gray-500 hover:text-gray-300'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-4 pb-24"> 
        {pulseFeedData.map((item) => {
          if (activeTab === 'NEWS' && item.type !== 'EXTERNAL') return null;
          if (activeTab === 'REPLAY' && item.type !== 'INTERNAL') return null;

          return item.type === 'EXTERNAL' 
            ? <ExternalNewsCard key={item.id} item={item} />
            : <InternalWinCard key={item.id} item={item} />;
        })}
        
        <div className="text-center text-gray-600 text-xs py-4">
          — End of Pulse —
        </div>
      </div>

    </PageContainer>
  );
}