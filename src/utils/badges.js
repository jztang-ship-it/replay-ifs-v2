// Define badge types, their emojis, and descriptions for the legend.
export const BADGE_DEFINITIONS = {
    'TD': { emoji: '👑', label: 'Triple Double (+5 FP)' },
    'DD': { emoji: '⚡', label: 'Double Double (+2 FP)' },
    'CLEAN': { emoji: '🧼', label: 'No Turnovers (+2 FP)' },
    'LOCK': { emoji: '🔒', label: '4+ Stocks (Stl+Blk) (+3 FP)' },
    'HOT': { emoji: '🔥', label: '60%+ FG Efficiency (+3 FP)' },
    'SNIPER': { emoji: '🎯', label: '4+ Threes Made (+3 FP)' },
  };
  
  // Helper to get the emoji for a given badge code
  export const getBadgeEmoji = (badgeCode) => {
    return BADGE_DEFINITIONS[badgeCode]?.emoji || badgeCode;
  };