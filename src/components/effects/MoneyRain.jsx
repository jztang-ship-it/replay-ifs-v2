import React from 'react';

const CONFIGS = {
  'BETTER LUCK NEXT TIME': { icons: ['💧', '😢', '💔', '📉'], count: 15, speed: '3s', spin: false }, // Sad Rain
  'OH SO CLOSE':           { icons: ['🪙', '🤏', '😶'],       count: 10, speed: '4s', spin: true },  // Light Sprinkle
  'ROOKIE WIN':            { icons: ['💵', '🪙'],             count: 20, speed: '3s', spin: true },  // Standard Rain
  'A STAR IS BORN':        { icons: ['💵', '💸', '💰'],       count: 40, speed: '2s', spin: true },  // Heavy Rain
  'ALL STAR WIN!!!':       { icons: ['💸', '💰', '🔥', '🚀'], count: 70, speed: '1.5s', spin: true },// Storm
  'LEGENDARY!!!':          { icons: ['💎', '👑', '💰', '🦁'], count: 150, speed: '1s', spin: true }  // Hurricane
};

const MoneyRain = ({ tierLabel }) => {
  const config = CONFIGS[tierLabel] || CONFIGS['ROOKIE WIN'];

  const items = Array.from({ length: config.count }).map((_, i) => ({
    id: i,
    icon: config.icons[Math.floor(Math.random() * config.icons.length)],
    left: Math.random() * 100 + '%',
    animationDuration: config.speed, // Base speed
    animationDelay: Math.random() * 2 + 's',
    fontSize: Math.random() * 20 + 20 + 'px',
    // Randomize fall speed slightly per particle
    durationOverride: (parseFloat(config.speed) + Math.random()).toFixed(2) + 's' 
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(${config.spin ? '360deg' : '0deg'}); opacity: 0; }
          }
        `}
      </style>
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute top-[-50px]"
          style={{
            left: item.left,
            animation: `fall ${item.durationOverride} linear infinite`,
            animationDelay: item.animationDelay,
            fontSize: item.fontSize
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default MoneyRain;