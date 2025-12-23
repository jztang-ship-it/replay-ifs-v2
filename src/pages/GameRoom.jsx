// src/pages/GameRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

export default function GameRoom() {
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('CHAT');
  
  // --- CHAT LOGIC STARTS HERE ---
  
  // 1. The List of Messages (We start with 2 fake ones so it's not empty)
  const [messages, setMessages] = useState([
    { id: 1, user: 'JohnM (VIP)', avatar: 'JM', color: 'bg-blue-600', text: 'LeBron is absolutely taking over right now.' },
    { id: 2, user: 'ZoeFan', avatar: 'Z', color: 'bg-purple-600', text: 'Tatum needs to wake up.' }
  ]);

  // 2. The Text You Are Typing
  const [inputText, setInputText] = useState('');

  // 3. Auto-scroll to bottom helper
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. The Function to Send
  const handleSend = () => {
    if (!inputText.trim()) return; // Don't send empty messages

    const newMessage = {
      id: Date.now(), // Unique ID
      user: 'You', // Your name
      avatar: 'ME', 
      color: 'bg-orange-500', 
      text: inputText
    };

    setMessages([...messages, newMessage]); // Add to list
    setInputText(''); // Clear the input box
  };

  // 5. Allow pressing "Enter" key to send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // --- CHAT LOGIC ENDS HERE ---

  return (
    <PageContainer>
      
      {/* HEADER */}
      <div className="bg-black border-b border-gray-700 p-4 shrink-0">
        <div className="flex justify-between items-center text-white mb-2">
          <Link to="/pulse" className="text-gray-400 text-sm hover:text-white flex items-center gap-1">
            <span>←</span> Back
          </Link>
          <span className="text-red-500 font-bold animate-pulse text-xs">● LIVE Q4 2:38</span>
          <button className="text-gray-400 text-sm">⚙️</button>
        </div>
        
        <div className="flex justify-between items-center px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">LAL</h2>
            <p className="text-gray-400 text-sm">102</p>
          </div>
          <div className="text-gray-600 text-sm font-mono pt-2">vs</div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">BOS</h2>
            <p className="text-gray-400 text-sm">98</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-gray-800 border-b border-gray-700 shrink-0">
        {['CHAT', 'PLAY-BY-PLAY', 'STATS'].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-colors ${
              activeTab === tabName 
                ? 'text-white bg-gray-700 border-b-2 border-orange-500' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 pb-20">
        
        {/* VIEW A: CHAT - Now Dynamic! */}
        {activeTab === 'CHAT' && (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full ${msg.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {msg.avatar}
                </div>
                <div className="bg-gray-800 p-3 rounded-r-lg rounded-bl-lg max-w-[85%]">
                  <span className={`${msg.user === 'You' ? 'text-orange-400' : 'text-blue-400'} text-xs font-bold block mb-1`}>
                    {msg.user}
                  </span>
                  <p className="text-gray-200 text-sm break-words">{msg.text}</p>
                </div>
              </div>
            ))}
            {/* Invisible element to force scroll to bottom */}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* VIEW B: PLAY BY PLAY (Static for now) */}
        {activeTab === 'PLAY-BY-PLAY' && (
          <div className="space-y-4">
             <div className="flex gap-4 border-l-2 border-yellow-500 pl-4">
               <span className="text-yellow-500 font-bold text-xs pt-1">2:38</span> 
               <p className="text-gray-300 text-sm">LeBron James makes 26-foot three point jumper.</p>
            </div>
          </div>
        )}

        {/* VIEW C: STATS */}
        {activeTab === 'STATS' && (
           <div className="text-center text-gray-500 mt-10">
             <p>Stats View Coming Soon</p>
           </div>
        )}

      </div>

      {/* CHAT INPUT AREA - Wired Up! */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-3 border-t border-gray-700 z-50">
        <div className="relative">
            <input 
              type="text" 
              placeholder="Trash talk goes here..." 
              value={inputText} // <--- Controlled Input
              onChange={(e) => setInputText(e.target.value)} // <--- Updates State
              onKeyDown={handleKeyPress} // <--- Listen for Enter Key
              className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-full border border-gray-600 focus:outline-none focus:border-orange-500"
            />
            <button 
              onClick={handleSend} // <--- Trigger Send
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all"
            >
              ↑
            </button>
        </div>
      </div>

    </PageContainer>
  );
}