// Card Back Component - UPDATED WITH LOGO & CAPTION
const CardBack = () => (
  <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl backface-hidden rotate-y-180">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
      
      {/* Main Gradient Background */}
      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center relative gap-4 p-4">
          {/* Radial Glow effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
          
          {/* NEW LOGO ON CARD BACK */}
          <img 
              src="/images/logo-frenchie.png" 
              alt="Replay Logo" 
              // Sized appropriately for the card back, with a slight drop shadow to pop
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] relative z-10"
          />
          
          {/* NEW CAPTION */}
          <span className="text-xs md:text-sm font-black italic uppercase text-slate-300 drop-shadow-sm tracking-widest relative z-10 text-center leading-tight">
              sports IS social
          </span>
      </div>
  </div>
);