import React, { useState, useEffect } from 'react';

// Simple standalone card component
const DemoCardPlaceholder = ({ color, text, animateClass }) => (
    <div className={`w-32 h-44 rounded-xl shadow-2xl flex items-center justify-center text-white font-black text-xl border-2 border-white/20 ${color} ${animateClass}`}>
        {text}
    </div>
);

export default function AnimationDemo() {
    // --- ANIMATION 1: THE "RIFFLE DEAL" ---
    const [dealStage, setDealStage] = useState('idle');
    const [shuffleIndex, setShuffleIndex] = useState(0);
    const shuffleColors = ['bg-slate-800', 'bg-slate-700', 'bg-slate-600', 'bg-slate-900'];

    const triggerDeal = () => {
        if (dealStage !== 'idle') return;
        setDealStage('shuffling');
        let count = 0;
        const interval = setInterval(() => {
            setShuffleIndex(prev => (prev + 1) % shuffleColors.length);
            count++;
            if (count > 10) { 
                clearInterval(interval);
                setDealStage('final');
                setTimeout(() => setDealStage('idle'), 2000);
            }
        }, 50);
    };

    // --- ANIMATION 2: THE "SLAM DRAW" ---
    const [drawTrigger, setDrawTrigger] = useState(false);

    const triggerDraw = () => {
        setDrawTrigger(true);
        setTimeout(() => setDrawTrigger(false), 1000);
    };

    return (
        // Replaced PageContainer with a standard div to prevent import errors
        <div className="min-h-screen w-full bg-[#050b14] pt-20 flex flex-col items-center justify-start">
            <h1 className="text-white font-black text-3xl uppercase mb-8">Animation Concepts</h1>

            <div className="flex gap-16">
                {/* CONCEPT 1: DEAL */}
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-slate-400 font-bold uppercase tracking-widest mb-2">1. The Riffle Deal</h2>
                    <div className="relative w-32 h-44 perspective-1000">
                        {dealStage === 'idle' && (
                            <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 rounded-xl flex items-center justify-center text-slate-600 font-bold">EMPTY SLOT</div>
                        )}
                        {dealStage === 'shuffling' && (
                            <DemoCardPlaceholder color={shuffleColors[shuffleIndex]} text="..." animateClass="animate-pulse" />
                        )}
                        {dealStage === 'final' && (
                            <DemoCardPlaceholder color="bg-gradient-to-b from-amber-600 to-amber-950" text="GIANNIS" animateClass="animate-pop-in" />
                        )}
                    </div>
                    <button onClick={triggerDeal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm active:scale-95 transition-transform">
                        Test Deal
                    </button>
                </div>

                {/* CONCEPT 2: DRAW */}
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-slate-400 font-bold uppercase tracking-widest mb-2">2. The Slam Draw</h2>
                    <div className="relative w-32 h-44 overflow-hidden rounded-xl bg-slate-900 border-2 border-slate-800">
                        <div 
                            className={`w-full h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${drawTrigger ? 'translate-y-0 opacity-100' : '-translate-y-[120%] opacity-0'}`}
                        >
                            <DemoCardPlaceholder color="bg-gradient-to-b from-purple-600 to-purple-950" text="LUKA" animateClass="" />
                        </div>
                    </div>
                    <button onClick={triggerDraw} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm active:scale-95 transition-transform">
                        Test Draw (Slam)
                    </button>
                </div>
            </div>
            
            {/* CSS for the pop animation */}
            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    70% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in {
                    animation: popIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}