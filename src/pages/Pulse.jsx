import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';

// --- MOCK DATA ---
const NEWS_ARTICLES = [
  { id: 1, title: "Jokic makes history with 25th Triple-Double", source: "Bleacher Report", time: "2h ago", image: "🃏", content: "Nikola Jokic continues to defy logic, posting a massive 32/15/12 stat line against the Lakers last night..." },
  { id: 2, title: "Wemby blocks 10 shots in rookie masterclass", source: "ESPN", time: "4h ago", image: "👽", content: "The alien has landed. Victor Wembanyama recorded a rare triple-double with blocks, altering every shot in the paint..." },
  { id: 3, title: "Curry hits 12 threes, breaks own record", source: "The Athletic", time: "6h ago", image: "👨‍🍳", content: "Chef Curry was cooking tonight at Chase Center, hitting 12 of 16 from deep in a blowout win..." },
];

const COMMUNITY_POSTS = [
  { id: 1, user: "CryptoBaller", handle: "@cballer", time: "10m", content: "Just claimed the 'Sniper' reward! Anyone else find the 5-min win streak hard? 😅", likes: 12, replies: 4 },
  { id: 2, user: "LukaMagic", handle: "@mavsfan77", time: "45m", content: "Top tip: Buy low cost players in the Green tier right now. Their value is spiking.", likes: 85, replies: 12 },
  { id: 3, user: "ReplayDev", handle: "@admin", time: "1h", content: "🚨 New VIP Levels dropping next week. Get your XP up now!", likes: 142, replies: 28 },
];

const CHAT_MESSAGES = [
  { id: 1, user: "DunkMaster", msg: "LFG!!! Just hit a 50x multiplier!", color: "text-green-400" },
  { id: 2, user: "SaltySpurs", msg: "My lineup got wrecked by injuries smh", color: "text-slate-400" },
  { id: 3, user: "WhaleWatcher", msg: "Who is holding the $4.50 LeBron?", color: "text-blue-400" },
  { id: 4, user: "System", msg: "User @JokicFan just won $500!", color: "text-yellow-400 font-bold italic" },
];

// --- MAIN EXPORT ---
export default function Pulse() {
  const [activeTab, setActiveTab] = useState('NEWS');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [chatInput, setChatInput] = useState("");

  const handleRead = (id) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <PageContainer>
      {/* LAYOUT FIX: Used h-full + overflow-y-auto instead of min-h-screen */}
      <div className="flex flex-col h-full w-full max-w-xl mx-auto px-4 pt-6 pb-24 overflow-y-auto custom-scrollbar">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
            The Pulse <span className="text-blue-500 not-italic text-lg ml-1">⚡</span>
          </h1>
          <div className="flex gap-2">
            {['NEWS', 'SOCIAL', 'CHAT'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-black border-white' 
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- TAB CONTENT --- */}
        
        {/* 1. NEWS TAB */}
        {activeTab === 'NEWS' && (
          <div className="space-y-4 animate-fade-in-up">
            {NEWS_ARTICLES.map(article => (
              <div key={article.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleRead(article.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">{article.source}</span>
                        <span className="text-[9px] text-slate-500">{article.time}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-tight mb-2">{article.title}</h3>
                    </div>
                    <div className="text-2xl bg-slate-800 w-12 h-12 flex items-center justify-center rounded-lg">{article.image}</div>
                  </div>
                  
                  {expandedArticle === article.id && (
                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed animate-fade-in">
                      {article.content}
                      <button className="block mt-2 text-blue-400 font-bold hover:underline">Read Full Story →</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. SOCIAL TAB */}
        {activeTab === 'SOCIAL' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 shrink-0"></div>
              <input 
                type="text" 
                placeholder="What's on your mind?" 
                className="bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none w-full"
              />
            </div>

            {COMMUNITY_POSTS.map(post => (
              <div key={post.id} className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">👤</div>
                    <span className="text-xs font-bold text-white">{post.user}</span>
                    <span className="text-[10px] text-slate-500">{post.handle} • {post.time}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">{post.content}</p>
                <div className="flex gap-4 border-t border-slate-800/50 pt-2">
                  <button className="text-[10px] font-bold text-slate-500 hover:text-red-400 flex items-center gap-1">❤️ {post.likes}</button>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-blue-400 flex items-center gap-1">💬 {post.replies}</button>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-green-400 flex items-center gap-1 ml-auto">🚀 Share</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. CHAT TAB */}
        {activeTab === 'CHAT' && (
          <div className="flex flex-col h-[65vh] animate-fade-in-up">
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-t-xl p-4 overflow-y-auto space-y-3 shadow-inner">
              {CHAT_MESSAGES.map(msg => (
                <div key={msg.id} className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase mb-0.5">{msg.user}</span>
                  <span className={`text-xs ${msg.color || 'text-white'}`}>{msg.msg}</span>
                </div>
              ))}
              <div className="text-[9px] text-slate-600 text-center py-2">-- Today --</div>
            </div>
            
            <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-xl p-3 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xs font-black uppercase hover:bg-blue-500 transition-colors">
                Send
              </button>
            </div>
          </div>
        )}

      </div>
    </PageContainer>
  );
}