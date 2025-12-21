// --- RNG ENGINE V4 (Rich Stats) ---

const OPPONENTS = ['GSW', 'BOS', 'MIA', 'LAL', 'PHX', 'DEN', 'PHI', 'MIL', 'DAL', 'NYK', 'CLE', 'MIN'];

const getRandomDate = () => {
  const start = new Date(2023, 9, 24).getTime();
  const end = new Date(2024, 3, 14).getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().split('T')[0];
};

export const getHistoricalPerformance = (player) => {
  if (!player || !player.avg) {
    return { score: 0, date: '2023-01-01', opp: '---', stats: { pts:0, reb:0, ast:0, stl:0, blk:0, to:0 } };
  }

  // 1. Variance
  const variance = 0.8 + (Math.random() * 0.45); // Bigger swing potential
  
  // 2. Final Score
  const finalScore = Math.round((player.avg * variance) * 10) / 10;

  // 3. Generate 6 Stats (Reverse engineered roughly from score)
  // FP approx formula: PTS + 1.2*REB + 1.5*AST + 3*STL + 3*BLK - 1*TO
  
  const pts = Math.max(0, Math.round(finalScore * 0.55));
  const reb = Math.max(0, Math.round(finalScore * 0.15));
  const ast = Math.max(0, Math.round(finalScore * 0.15));
  
  // Random defensive stats
  const stl = Math.floor(Math.random() * 4); 
  const blk = Math.floor(Math.random() * 3);
  const to = Math.floor(Math.random() * 5);

  return {
    score: finalScore,
    date: getRandomDate(),
    opp: OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)],
    stats: { 
      pts, 
      reb, 
      ast,
      stl,
      blk,
      to
    }
  };
};