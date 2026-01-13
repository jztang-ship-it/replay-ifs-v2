// src/data/collectData.js

// --- 1. THE MISSIONS (Psychology: Habit Building) ---
export const missions = [
    {
      id: 1,
      title: "The Daily Check-In",
      category: "DAILY",
      desc: "Log in to Replay",
      progress: "1/1",
      reward: 100,
      status: "COMPLETED", // ACTIVE, COMPLETED, LOCKED
      icon: "📅"
    },
    {
      id: 2,
      title: "Voice of the People",
      category: "SOCIAL",
      desc: "Post 3 comments in Pulse News",
      progress: "0/3",
      reward: 50,
      status: "ACTIVE",
      icon: "🗣️",
      note: "Unlocks at VIP 1" 
    },
    {
      id: 3,
      title: "The Long Shot",
      category: "BETTING",
      desc: "Win a Parlay with +500 odds or higher",
      progress: "0/1",
      reward: 500,
      status: "ACTIVE",
      icon: "🚀",
      note: "High Risk, High Reward"
    },
    {
      id: 4,
      title: "Market Mover",
      category: "WEEKLY",
      desc: "Bet a total of 5,000 Coins",
      progress: "1250/5000",
      reward: 1000,
      status: "ACTIVE",
      icon: "💼"
    }
  ];
  
  // --- 2. THE VIP LADDER (Psychology: Status & Access) ---
  export const vipLevels = [
    {
      level: 0,
      name: "Spectator",
      color: "text-gray-400",
      border: "border-gray-600",
      benefits: [
        "✅ Access to Sports News",
        "✅ Place Bets (Limited)",
        "❌ NO Chat Access (Read Only)",
        "❌ Standard Daily Login (100 Coins)"
      ],
      requirements: "Create Account"
    },
    {
      level: 1,
      name: "Rookie",
      color: "text-white",
      border: "border-white",
      benefits: [
        "🔓 UNLOCK: Public Chat Access",
        "🔓 UNLOCK: Comment on News",
        "💰 +10% Daily Login Bonus (110 Coins)"
      ],
      requirements: "Log in 3 days in a row OR Win 1,000 Coins"
    },
    {
      level: 2,
      name: "Pro",
      color: "text-blue-400",
      border: "border-blue-400",
      benefits: [
        "🔓 UNLOCK: Custom Avatar Frame",
        "💰 +25% Daily Login Bonus (125 Coins)",
        "🎫 1 Free Tournament Ticket / Week"
      ],
      requirements: "Reach 50,000 Total Wagered"
    },
    {
      level: 3,
      name: "Baller",
      color: "text-orange-400",
      border: "border-orange-400",
      benefits: [
        "🔓 UNLOCK: Create Private Game Rooms",
        "🔥 'On Fire' Chat Highlight Effect",
        "💰 +50% Daily Login Bonus (150 Coins)"
      ],
      requirements: "Reach 250,000 Total Wagered"
    }
  ];