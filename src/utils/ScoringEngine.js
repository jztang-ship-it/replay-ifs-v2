// src/utils/ScoringEngine.js

// --- 1. DEFINITIONS: BADGE RULES ---
export const BONUS_RULES = {
    // --- SCORING TIERS (Highest One Only) ---
    BUCKET:        { id: '30PT', label: 'BUCKET', score: 2.0,  icon: '🏀' }, // 30+ Pts
    SCORING_KING:  { id: '40PT', label: 'FIRE',   score: 5.0,  icon: '🔥' }, // 40+ Pts
    GOD_MODE:      { id: '50PT', label: 'GOD',    score: 10.0, icon: '⚡' }, // 50+ Pts
  
    // --- REBOUND TIERS (Highest One Only) ---
    GLASS_CLEANER: { id: 'REB1', label: 'GLASS',  score: 3.0,  icon: '🧲' }, // 12+ Reb
    BOARD_BEAST:   { id: 'REB2', label: 'BEAST',  score: 5.0,  icon: '🦍' }, // 15+ Reb
  
    // --- ASSIST TIERS (Highest One Only) ---
    DIMER:         { id: 'AST1', label: 'DIME',   score: 3.0,  icon: '🧠' }, // 12+ Ast
    WIZARD:        { id: 'AST2', label: 'WIZARD', score: 5.0,  icon: '🪄' }, // 15+ Ast
  
    // --- DEFENSIVE SPECIALISTS (Stackable) ---
    THIEF:         { id: 'STL',  label: 'THIEF',  score: 4.0,  icon: '🧤' }, // 5+ Stl
    SWAT_TEAM:     { id: 'BLK',  label: 'SWAT',   score: 4.0,  icon: '🚫' }, // 5+ Blk
    LOCKDOWN:      { id: 'LOCK', label: 'LOCK',   score: 4.0,  icon: '🔒' }, // 6+ Stocks (Stl+Blk)
  
    // --- MULTI-STAT MILESTONES (Stackable) ---
    DOUBLE_DOUBLE: { id: 'DBL',  label: 'DBL',    score: 2.0,  icon: '✌️' }, // 2 Stats ≥ 10
    TRIPLE_DOUBLE: { id: 'TRIP', label: 'TRIP',   score: 8.0,  icon: '👑' }, // 3 Stats ≥ 10
    FIVE_BY_FIVE:  { id: '5x5',  label: '5x5',    score: 15.0, icon: '🖐️' }, // 5 Stats ≥ 5
    QUAD_DOUBLE:   { id: 'QUAD', label: 'QUAD',   score: 50.0, icon: '🦕' }, // 4 Stats ≥ 10
  };
  
  // --- 2. CALCULATOR ENGINE ---
  export const calculateScore = (baseStats) => {
    if (!baseStats) return { score: 0, badges: [] };
  
    // Capture Original Projection
    const projectedScore = parseFloat(baseStats.score || 0);
    let finalScore = projectedScore;
    const badges = [];
  
    // SAFELY EXTRACT STATS
    const pts = parseFloat(baseStats.pts || 0);
    const reb = parseFloat(baseStats.reb || 0);
    const ast = parseFloat(baseStats.ast || 0);
    const blk = parseFloat(baseStats.blk || 0);
    const stl = parseFloat(baseStats.stl || 0);
    
    // LOGIC: Count categories >= 10
    const cats = [pts, reb, ast, blk, stl];
    const doubleDigits = cats.filter(c => c >= 10.0).length;
  
    // --- 3. TRIGGER CHECKS ---
  
    // A. SCORING TIERS (Highest One Only)
    if (pts >= 50) {
        finalScore += BONUS_RULES.GOD_MODE.score;
        badges.push(BONUS_RULES.GOD_MODE);
    } else if (pts >= 40) {
        finalScore += BONUS_RULES.SCORING_KING.score;
        badges.push(BONUS_RULES.SCORING_KING);
    } else if (pts >= 30) {
        finalScore += BONUS_RULES.BUCKET.score;
        badges.push(BONUS_RULES.BUCKET);
    }
  
    // B. REBOUND TIERS (Highest One Only)
    if (reb >= 15) {
        finalScore += BONUS_RULES.BOARD_BEAST.score;
        badges.push(BONUS_RULES.BOARD_BEAST);
    } else if (reb >= 12) {
        finalScore += BONUS_RULES.GLASS_CLEANER.score;
        badges.push(BONUS_RULES.GLASS_CLEANER);
    }
  
    // C. ASSIST TIERS (Highest One Only)
    if (ast >= 15) {
        finalScore += BONUS_RULES.WIZARD.score;
        badges.push(BONUS_RULES.WIZARD);
    } else if (ast >= 12) {
        finalScore += BONUS_RULES.DIMER.score;
        badges.push(BONUS_RULES.DIMER);
    }
  
    // D. DEFENSIVE SPECIALISTS (Stackable)
    if (stl >= 5) {
        finalScore += BONUS_RULES.THIEF.score;
        badges.push(BONUS_RULES.THIEF);
    }
    if (blk >= 5) {
        finalScore += BONUS_RULES.SWAT_TEAM.score;
        badges.push(BONUS_RULES.SWAT_TEAM);
    }
    
    // STOCKS (Steals + Blocks >= 6) - Stacks with Thief/Swat
    if ((stl + blk) >= 6) {
        finalScore += BONUS_RULES.LOCKDOWN.score;
        badges.push(BONUS_RULES.LOCKDOWN);
    }
  
    // E. MULTI-STAT MILESTONES
    if (doubleDigits >= 2) { 
        finalScore += BONUS_RULES.DOUBLE_DOUBLE.score; 
        badges.push(BONUS_RULES.DOUBLE_DOUBLE); 
    }
    
    if (doubleDigits >= 3) { 
        finalScore += BONUS_RULES.TRIPLE_DOUBLE.score; 
        badges.push(BONUS_RULES.TRIPLE_DOUBLE); 
    }
  
    if (doubleDigits >= 4) { 
        finalScore += BONUS_RULES.QUAD_DOUBLE.score; 
        badges.push(BONUS_RULES.QUAD_DOUBLE); 
    }
    
    if (pts>=5 && reb>=5 && ast>=5 && blk>=5 && stl>=5) { 
        finalScore += BONUS_RULES.FIVE_BY_FIVE.score; 
        badges.push(BONUS_RULES.FIVE_BY_FIVE); 
    }
  
    return {
      ...baseStats,
      projectedScore: projectedScore, 
      score: parseFloat(finalScore.toFixed(1)), 
      badges: badges
    };
  };