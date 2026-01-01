// src/utils/GameMath.js

// --- 1. BADGE DEFINITIONS ---
export const BONUS_RULES = {
    // SCORING
    BUCKET:        { id: '30PT', label: 'BUCKET', score: 2.0,  icon: '🏀' },
    SCORING_KING:  { id: '40PT', label: 'FIRE',   score: 5.0,  icon: '🔥' },
    GOD_MODE:      { id: '50PT', label: 'GOD',    score: 10.0, icon: '⚡' },

    // REBOUNDS
    GLASS_CLEANER: { id: 'REB1', label: 'GLASS',  score: 3.0,  icon: '🧲' },
    BOARD_BEAST:   { id: 'REB2', label: 'BEAST',  score: 5.0,  icon: '🦍' },

    // ASSISTS
    DIMER:         { id: 'AST1', label: 'DIME',   score: 3.0,  icon: '🧠' },
    WIZARD:        { id: 'AST2', label: 'WIZARD', score: 5.0,  icon: '🪄' },

    // DEFENSE
    THIEF:         { id: 'STL',  label: 'THIEF',  score: 4.0,  icon: '🧤' },
    SWAT_TEAM:     { id: 'BLK',  label: 'SWAT',   score: 4.0,  icon: '🚫' },
    LOCKDOWN:      { id: 'LOCK', label: 'LOCK',   score: 4.0,  icon: '🔒' },

    // MILESTONES
    DOUBLE_DOUBLE: { id: 'DBL',  label: 'DBL',    score: 2.0,  icon: '✌️' }, 
    TRIPLE_DOUBLE: { id: 'TRIP', label: 'TRIP',   score: 8.0,  icon: '👑' }, 
    QUAD_DOUBLE:   { id: 'QUAD', label: 'QUAD',   score: 50.0, icon: '🦕' }, 
    FIVE_BY_FIVE:  { id: '5x5',  label: '5x5',    score: 15.0, icon: '🖐️' }, 
};

// --- 2. CALCULATOR ENGINE ---
export const calculateScore = (stats) => {
    if (!stats) return { score: 0, bonuses: [], rawStats: {} };

    const pts = parseFloat(stats.pts || 0);
    const reb = parseFloat(stats.reb || 0);
    const ast = parseFloat(stats.ast || 0);
    const stl = parseFloat(stats.stl || 0);
    const blk = parseFloat(stats.blk || 0);
    const tov = parseFloat(stats.turnovers || 0);

    // Base Score
    let baseScore = (pts * 1) + (reb * 1.25) + (ast * 1.5) + (stl * 2) + (blk * 2) - (tov * 0.5);

    const badges = [];
    let bonusScore = 0;

    // --- LOGIC: Pass the OBJECT (BONUS_RULES.XYZ), not a string ---

    // SCORING
    if (pts >= 50) { bonusScore += BONUS_RULES.GOD_MODE.score; badges.push(BONUS_RULES.GOD_MODE); }
    else if (pts >= 40) { bonusScore += BONUS_RULES.SCORING_KING.score; badges.push(BONUS_RULES.SCORING_KING); }
    else if (pts >= 30) { bonusScore += BONUS_RULES.BUCKET.score; badges.push(BONUS_RULES.BUCKET); }

    // REBOUNDS
    if (reb >= 15) { bonusScore += BONUS_RULES.BOARD_BEAST.score; badges.push(BONUS_RULES.BOARD_BEAST); }
    else if (reb >= 12) { bonusScore += BONUS_RULES.GLASS_CLEANER.score; badges.push(BONUS_RULES.GLASS_CLEANER); }

    // ASSISTS
    if (ast >= 15) { bonusScore += BONUS_RULES.WIZARD.score; badges.push(BONUS_RULES.WIZARD); }
    else if (ast >= 12) { bonusScore += BONUS_RULES.DIMER.score; badges.push(BONUS_RULES.DIMER); }

    // DEFENSE
    if (stl >= 5) { bonusScore += BONUS_RULES.THIEF.score; badges.push(BONUS_RULES.THIEF); }
    if (blk >= 5) { bonusScore += BONUS_RULES.SWAT_TEAM.score; badges.push(BONUS_RULES.SWAT_TEAM); }
    if ((stl + blk) >= 6) { bonusScore += BONUS_RULES.LOCKDOWN.score; badges.push(BONUS_RULES.LOCKDOWN); }

    // MILESTONES
    let doubleDigits = 0;
    if (pts >= 10) doubleDigits++;
    if (reb >= 10) doubleDigits++;
    if (ast >= 10) doubleDigits++;
    if (stl >= 10) doubleDigits++;
    if (blk >= 10) doubleDigits++;

    if (doubleDigits >= 4) { bonusScore += BONUS_RULES.QUAD_DOUBLE.score; badges.push(BONUS_RULES.QUAD_DOUBLE); }
    else if (doubleDigits >= 3) { bonusScore += BONUS_RULES.TRIPLE_DOUBLE.score; badges.push(BONUS_RULES.TRIPLE_DOUBLE); }
    else if (doubleDigits >= 2) { bonusScore += BONUS_RULES.DOUBLE_DOUBLE.score; badges.push(BONUS_RULES.DOUBLE_DOUBLE); }

    if (pts>=5 && reb>=5 && ast>=5 && blk>=5 && stl>=5) { 
        bonusScore += BONUS_RULES.FIVE_BY_FIVE.score; 
        badges.push(BONUS_RULES.FIVE_BY_FIVE); 
    }

    return {
        score: Math.round((baseScore + bonusScore) * 10) / 10,
        bonuses: badges, // Returns Objects now!
        rawStats: { pts, reb, ast, stl, blk, tov }
    };
};