export const getHistoricalPerformance = (player) => {
    const variance = (Math.random() * 0.6) + 0.7; 
    const simAvg = player.avg * variance;
    
    const pts = Math.round(simAvg * 0.65);
    const reb = Math.round(simAvg * 0.15);
    const ast = Math.round(simAvg * 0.15);
    const stl = Math.round(Math.random() * 4);
    const blk = Math.round(Math.random() * 3);
    const to = Math.round(Math.random() * 5);
    
    // INTERNAL SIMULATION FOR BADGES
    const threePointers = Math.floor(Math.random() * 6); 
    const fgPercent = 0.35 + (Math.random() * 0.35); 
    
    // Base Score
    let rawScore = (pts * 1) + (reb * 1.2) + (ast * 1.5) + (stl * 3) + (blk * 3) - (to * 1);
    
    // BONUSES & BADGES
    const bonuses = [];
    let totalBonus = 0;
  
    // 1. Efficiency Badges
    if (fgPercent >= 0.60 && pts > 15) {
        bonuses.push('HOT'); 
        totalBonus += 3;
    }
    if (threePointers >= 4) {
        bonuses.push('SNIPER'); 
        totalBonus += 3;
    }

    // 2. Standard Badges
    const doubles = [pts >= 10, reb >= 10, ast >= 10, stl >= 10, blk >= 10].filter(Boolean).length;
    if (doubles >= 3) {
      bonuses.push('TD'); 
      totalBonus += 5;
    } else if (doubles >= 2) {
      bonuses.push('DD'); 
      totalBonus += 2;
    }
  
    if (to === 0 && pts > 10) {
      bonuses.push('CLEAN');
      totalBonus += 2;
    }
  
    if (stl + blk >= 4) {
      bonuses.push('LOCK'); 
      totalBonus += 3;
    }
  
    const finalScore = Math.max(0, Math.round((rawScore + totalBonus) * 10) / 10);
  
    return {
      score: finalScore,
      totalBonus: totalBonus, // Return the total bonus amount
      bonuses: bonuses,
      stats: { pts, reb, ast, stl, blk, to },
      opp: getRandomOpponent(),
      date: getRandomDate()
    };
  };
  
  const getRandomOpponent = () => {
    const teams = ['LAL','BOS','MIA','GSW','NYK','PHI','DEN','DAL','PHX','MIL'];
    return teams[Math.floor(Math.random() * teams.length)];
  };
  
  const getRandomDate = () => {
    const start = new Date(2023, 10, 1);
    const end = new Date(2024, 4, 1);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };