// src/engine/historicalRNG.js

// 1. GENERATE STATS (Reverse Engineering)
function generateStatLine(targetFP) {
    let pts = 0, reb = 0, ast = 0, stl = 0, blk = 0, to = 0;
    let currentFP = 0;
  
    // Safety break to prevent infinite loops
    let safety = 0;
    while (currentFP < targetFP && safety < 1000) {
      safety++;
      const roll = Math.random();
  
      if (roll < 0.45) { pts += 2; currentFP += 2; }
      else if (roll < 0.60) { reb += 1; currentFP += 1.2; }
      else if (roll < 0.75) { ast += 1; currentFP += 1.5; }
      else if (roll < 0.85) { pts += 1; currentFP += 1; }
      else if (roll < 0.92) { stl += 1; currentFP += 3; }
      else if (roll < 0.97) { blk += 1; currentFP += 3; }
      else { to += 1; currentFP -= 1; }
    }
  
    return { pts, reb, ast, stl, blk, to };
  }
  
  // 2. GENERATE GAME INFO
  function getRandomGameDetails() {
    const teams = ["LAL", "LAC", "BOS", "MIA", "GSW", "PHX", "NYK", "PHI"];
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomDay = Math.floor(Math.random() * 28) + 1;
  
    return {
      opponent: randomTeam,
      date: `${randomMonth} ${randomDay}`
    };
  }
  
  // 3. MAIN EXPORT (Must match what Play.jsx expects!)
  export function getHistoricalPerformance(player) {
    const volatility = 0.25; 
    
    let noise = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
    let simulatedScore = player.avgFP * (1 + (noise * volatility));
    simulatedScore = Math.max(5, Math.min(simulatedScore, 95));
    
    const stats = generateStatLine(simulatedScore);
    const gameInfo = getRandomGameDetails();
  
    const diff = simulatedScore - player.avgFP;
    
    return {
      score: simulatedScore.toFixed(1),
      isBoom: diff > 8,
      isBust: diff < -8,
      ...gameInfo,
      stats
    };
  }