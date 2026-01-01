export const calculateScore = (stats) => {
    // 1. Safety Check
    if (!stats) return { score: 0, bonuses: [], rawStats: {} };

    // 2. Safe Parsing
    const pts = parseFloat(stats.pts || 0);
    const reb = parseFloat(stats.reb || 0);
    const ast = parseFloat(stats.ast || 0);
    const stl = parseFloat(stats.stl || 0);
    const blk = parseFloat(stats.blk || 0);
    const tov = parseFloat(stats.turnovers || stats.tov || 0);

    // 3. Base Calculation
    let score = (pts * 1) + 
                (reb * 1.25) + 
                (ast * 1.5) + 
                (stl * 2) + 
                (blk * 2) - 
                (tov * 0.5);

    const bonuses = [];

    // --- 4. BONUS LOGIC (With Emojis) ---

    // A. POINTS TIERS (Highest One Only)
    if (pts >= 50) { 
        score += 10; 
        bonuses.push({ label: "GOD MODE", icon: "⚡", score: 10 }); 
    } else if (pts >= 40) { 
        score += 5; 
        bonuses.push({ label: "FIRE", icon: "🔥", score: 5 }); 
    } else if (pts >= 30) { 
        score += 2; 
        bonuses.push({ label: "BUCKET", icon: "🏀", score: 2 }); 
    }

    // B. REBOUND TIERS (Highest One Only)
    if (reb >= 15) { 
        score += 5; 
        bonuses.push({ label: "BEAST", icon: "🦍", score: 5 }); 
    } else if (reb >= 12) { 
        score += 3; 
        bonuses.push({ label: "GLASS", icon: "🧲", score: 3 }); 
    }

    // C. ASSIST TIERS (Highest One Only)
    if (ast >= 15) { 
        score += 5; 
        bonuses.push({ label: "WIZARD", icon: "🪄", score: 5 }); 
    } else if (ast >= 12) { 
        score += 3; 
        bonuses.push({ label: "DIME", icon: "🧠", score: 3 }); 
    }

    // D. DEFENSIVE (Stackable)
    if (stl >= 5) { 
        score += 4; 
        bonuses.push({ label: "THIEF", icon: "🧤", score: 4 }); 
    }
    if (blk >= 5) { 
        score += 4; 
        bonuses.push({ label: "SWAT", icon: "🚫", score: 4 }); 
    }
    // Lockdown (Stocks >= 6)
    if ((stl + blk) >= 6) { 
        score += 4; 
        bonuses.push({ label: "LOCK", icon: "🔒", score: 4 }); 
    }

    // E. MILESTONES (Stackable)
    let doubleDigitCount = 0; // FIXED: Variable name matches usage now
    if (pts >= 10) doubleDigitCount++;
    if (reb >= 10) doubleDigitCount++;
    if (ast >= 10) doubleDigitCount++;
    if (stl >= 10) doubleDigitCount++;
    if (blk >= 10) doubleDigitCount++;

    // 5x5
    if (pts>=5 && reb>=5 && ast>=5 && stl>=5 && blk>=5) {
        score += 15;
        bonuses.push({ label: "5x5", icon: "🖐️", score: 15 });
    }

    // Quad/Triple/Double
    if (doubleDigitCount >= 4) {
        score += 50;
        bonuses.push({ label: "QUAD", icon: "🦕", score: 50 });
    } else if (doubleDigitCount >= 3) {
        score += 8;
        bonuses.push({ label: "TRIP", icon: "👑", score: 8 });
    } else if (doubleDigitCount >= 2) {
        score += 2;
        bonuses.push({ label: "DBL", icon: "✌️", score: 2 });
    }

    return {
        score: Math.round(score * 10) / 10,
        bonuses: bonuses, // Array of objects {label, icon, score}
        rawStats: { pts, reb, ast, stl, blk, tov }
    };
};