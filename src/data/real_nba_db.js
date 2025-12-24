// src/data/real_nba_db.js

// ==========================================
// 1. SCORING UTILS (DraftKings Model)
// ==========================================
const calculateFantasyPoints = (stats) => {
  // Pts=1, Reb=1.25, Ast=1.5, Stl=2, Blk=2, TO=-0.5
  const fp = 
    (stats.pts * 1) + 
    (stats.reb * 1.25) + 
    (stats.ast * 1.5) + 
    (stats.stl * 2) + 
    (stats.blk * 2) + 
    (stats.to * -0.5);
    
  // Bonus: Double-Double (1.5), Triple-Double (3.0)
  const doubleDigitCats = [stats.pts, stats.reb, stats.ast, stats.stl, stats.blk].filter(v => v >= 10).length;
  let bonus = 0;
  if (doubleDigitCats >= 3) bonus = 3;
  else if (doubleDigitCats >= 2) bonus = 1.5;
  
  return Math.max(0, fp + bonus);
};

const calculateSalary = (fp) => {
  // Map ~60fp to $5.9 and ~10fp to $1.0
  let cost = fp / 10;
  return Math.max(1.0, Math.min(5.9, cost)).toFixed(1);
};

// ==========================================
// 2. REAL PLAYER DATA (2023-24 Averages)
// ==========================================
const RAW_ROSTER = [
  // --- TIER 5: MVP CANDIDATES ---
  { id: "203954", name: "Joel Embiid", team: "PHI", avg: { pts: 34.7, reb: 11.0, ast: 5.6, stl: 1.2, blk: 1.7, to: 3.8 } },
  { id: "1629029", name: "Luka Doncic", team: "DAL", avg: { pts: 33.9, reb: 9.2, ast: 9.8, stl: 1.4, blk: 0.5, to: 4.0 } },
  { id: "203507", name: "Giannis Antetokounmpo", team: "MIL", avg: { pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, to: 3.4 } },
  { id: "1628983", name: "Shai Gilgeous-Alexander", team: "OKC", avg: { pts: 30.1, reb: 5.5, ast: 6.2, stl: 2.0, blk: 0.9, to: 2.2 } },
  { id: "203999", name: "Nikola Jokic", team: "DEN", avg: { pts: 26.4, reb: 12.4, ast: 9.0, stl: 1.4, blk: 0.9, to: 3.0 } },
  { id: "203076", name: "Anthony Davis", team: "LAL", avg: { pts: 24.7, reb: 12.6, ast: 3.5, stl: 1.2, blk: 2.3, to: 2.1 } },
  { id: "1641705", name: "Victor Wembanyama", team: "SAS", avg: { pts: 21.4, reb: 10.6, ast: 3.9, stl: 1.2, blk: 3.6, to: 3.7 } },
  { id: "1627734", name: "Domantas Sabonis", team: "SAC", avg: { pts: 19.4, reb: 13.7, ast: 8.2, stl: 0.9, blk: 0.6, to: 3.3 } },

  // --- TIER 4: ALL-STARS ---
  { id: "1628973", name: "Jalen Brunson", team: "NYK", avg: { pts: 28.7, reb: 3.6, ast: 6.7, stl: 0.9, blk: 0.2, to: 2.4 } },
  { id: "201142", name: "Kevin Durant", team: "PHX", avg: { pts: 27.1, reb: 6.6, ast: 5.0, stl: 0.9, blk: 1.2, to: 3.3 } },
  { id: "1626164", name: "Devin Booker", team: "PHX", avg: { pts: 27.1, reb: 4.5, ast: 6.9, stl: 0.9, blk: 0.4, to: 2.6 } },
  { id: "1628369", name: "Jayson Tatum", team: "BOS", avg: { pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, to: 2.5 } },
  { id: "1628368", name: "De'Aaron Fox", team: "SAC", avg: { pts: 26.6, reb: 4.6, ast: 5.6, stl: 2.0, blk: 0.4, to: 2.7 } },
  { id: "1628378", name: "Donovan Mitchell", team: "CLE", avg: { pts: 26.6, reb: 5.1, ast: 6.1, stl: 1.8, blk: 0.5, to: 2.8 } },
  { id: "201939", name: "Stephen Curry", team: "GSW", avg: { pts: 26.4, reb: 4.5, ast: 5.1, stl: 0.7, blk: 0.4, to: 2.8 } },
  { id: "1630162", name: "Anthony Edwards", team: "MIN", avg: { pts: 25.9, reb: 5.4, ast: 5.1, stl: 1.3, blk: 0.5, to: 3.1 } },
  { id: "1630178", name: "Tyrese Maxey", team: "PHI", avg: { pts: 25.9, reb: 3.7, ast: 6.2, stl: 1.0, blk: 0.5, to: 1.7 } },
  { id: "2544", name: "LeBron James", team: "LAL", avg: { pts: 25.7, reb: 7.3, ast: 8.3, stl: 1.3, blk: 0.5, to: 3.5 } },
  { id: "1629027", name: "Trae Young", team: "ATL", avg: { pts: 25.7, reb: 2.8, ast: 10.8, stl: 1.3, blk: 0.2, to: 4.4 } },
  { id: "202681", name: "Kyrie Irving", team: "DAL", avg: { pts: 25.6, reb: 5.0, ast: 5.2, stl: 1.3, blk: 0.5, to: 1.8 } },
  { id: "203081", name: "Damian Lillard", team: "MIL", avg: { pts: 24.3, reb: 4.4, ast: 7.0, stl: 1.0, blk: 0.2, to: 2.6 } },
  { id: "202695", name: "Kawhi Leonard", team: "LAC", avg: { pts: 23.7, reb: 6.1, ast: 3.6, stl: 1.6, blk: 0.9, to: 1.8 } },
  { id: "1630217", name: "Desmond Bane", team: "MEM", avg: { pts: 23.7, reb: 4.4, ast: 5.5, stl: 1.0, blk: 0.5, to: 2.7 } },
  { id: "1628374", name: "Lauri Markkanen", team: "UTA", avg: { pts: 23.2, reb: 8.2, ast: 2.0, stl: 0.9, blk: 0.5, to: 1.4 } },
  { id: "1627759", name: "Jaylen Brown", team: "BOS", avg: { pts: 23.0, reb: 5.5, ast: 3.6, stl: 1.2, blk: 0.5, to: 2.4 } },
  { id: "1629627", name: "Zion Williamson", team: "NOP", avg: { pts: 22.9, reb: 5.8, ast: 5.0, stl: 1.1, blk: 0.7, to: 2.5 } },
  { id: "1631094", name: "Paolo Banchero", team: "ORL", avg: { pts: 22.6, reb: 6.9, ast: 5.4, stl: 0.9, blk: 0.6, to: 3.1 } },
  { id: "202331", name: "Paul George", team: "LAC", avg: { pts: 22.6, reb: 5.2, ast: 3.5, stl: 1.5, blk: 0.5, to: 2.1 } },

  // --- TIER 3: HIGH VALUE ---
  { id: "1627749", name: "Dejounte Murray", team: "ATL", avg: { pts: 22.5, reb: 5.3, ast: 6.4, stl: 1.4, blk: 0.3, to: 2.6 } },
  { id: "1628398", name: "Kyle Kuzma", team: "WAS", avg: { pts: 22.2, reb: 6.6, ast: 4.2, stl: 0.5, blk: 0.7, to: 2.7 } },
  { id: "1626157", name: "Karl-Anthony Towns", team: "MIN", avg: { pts: 21.8, reb: 8.3, ast: 3.0, stl: 0.7, blk: 0.7, to: 2.9 } },
  { id: "1627783", name: "Pascal Siakam", team: "IND", avg: { pts: 21.7, reb: 7.1, ast: 4.3, stl: 0.8, blk: 0.3, to: 1.8 } },
  { id: "1627750", name: "Jamal Murray", team: "DEN", avg: { pts: 21.2, reb: 4.1, ast: 6.5, stl: 1.0, blk: 0.7, to: 2.1 } },
  { id: "1630578", name: "Alperen Sengun", team: "HOU", avg: { pts: 21.1, reb: 9.3, ast: 5.0, stl: 1.2, blk: 0.7, to: 2.6 } },
  { id: "1629001", name: "Miles Bridges", team: "CHA", avg: { pts: 21.0, reb: 7.3, ast: 3.3, stl: 0.9, blk: 0.5, to: 2.0 } },
  { id: "1629639", name: "Tyler Herro", team: "MIA", avg: { pts: 20.8, reb: 5.3, ast: 4.5, stl: 0.7, blk: 0.1, to: 2.2 } },
  { id: "1630169", name: "Tyrese Haliburton", team: "IND", avg: { pts: 20.1, reb: 3.9, ast: 10.9, stl: 1.2, blk: 0.7, to: 2.3 } },
  { id: "1630567", name: "Scottie Barnes", team: "TOR", avg: { pts: 19.9, reb: 8.2, ast: 6.1, stl: 1.3, blk: 1.5, to: 2.8 } },
  { id: "1628969", name: "Mikal Bridges", team: "BKN", avg: { pts: 19.6, reb: 4.5, ast: 3.6, stl: 1.0, blk: 0.4, to: 2.0 } },
  { id: "1628389", name: "Bam Adebayo", team: "MIA", avg: { pts: 19.3, reb: 10.4, ast: 3.9, stl: 1.1, blk: 0.9, to: 2.3 } },
  { id: "1631114", name: "Jalen Williams", team: "OKC", avg: { pts: 19.1, reb: 4.0, ast: 4.5, stl: 1.1, blk: 0.6, to: 1.7 } },
  { id: "203078", name: "Bradley Beal", team: "PHX", avg: { pts: 18.2, reb: 4.4, ast: 5.0, stl: 1.0, blk: 0.5, to: 2.5 } },
  { id: "1629636", name: "Darius Garland", team: "CLE", avg: { pts: 18.0, reb: 2.7, ast: 6.5, stl: 1.3, blk: 0.1, to: 3.0 } },
  { id: "1627832", name: "Fred VanVleet", team: "HOU", avg: { pts: 17.4, reb: 3.8, ast: 8.1, stl: 1.4, blk: 0.8, to: 1.7 } },
  { id: "1626167", name: "Myles Turner", team: "IND", avg: { pts: 17.1, reb: 6.9, ast: 1.3, stl: 0.5, blk: 1.9, to: 1.4 } },
  { id: "1631096", name: "Chet Holmgren", team: "OKC", avg: { pts: 16.5, reb: 7.9, ast: 2.4, stl: 0.6, blk: 2.3, to: 1.6 } },
  { id: "1628386", name: "Jarrett Allen", team: "CLE", avg: { pts: 16.5, reb: 10.5, ast: 2.7, stl: 0.7, blk: 1.1, to: 1.6 } },
  { id: "1630596", name: "Evan Mobley", team: "CLE", avg: { pts: 15.7, reb: 9.4, ast: 3.2, stl: 0.9, blk: 1.4, to: 1.8 } },

  // --- TIER 2: SOLID ROTATION ---
  { id: "1630559", name: "Austin Reaves", team: "LAL", avg: { pts: 15.9, reb: 4.3, ast: 5.5, stl: 0.8, blk: 0.3, to: 2.1 } },
  { id: "1628401", name: "Derrick White", team: "BOS", avg: { pts: 15.2, reb: 4.2, ast: 5.2, stl: 1.0, blk: 1.2, to: 1.5 } },
  { id: "203497", name: "Rudy Gobert", team: "MIN", avg: { pts: 14.0, reb: 12.9, ast: 1.3, stl: 0.7, blk: 2.1, to: 1.6 } },
  { id: "1641709", name: "Scoot Henderson", team: "POR", avg: { pts: 14.0, reb: 3.1, ast: 5.4, stl: 0.8, blk: 0.2, to: 3.4 } },
  { id: "203932", name: "Aaron Gordon", team: "DEN", avg: { pts: 13.9, reb: 6.5, ast: 3.5, stl: 0.8, blk: 0.6, to: 1.4 } },
  { id: "1641718", name: "Keyonte George", team: "UTA", avg: { pts: 13.0, reb: 2.8, ast: 4.4, stl: 0.5, blk: 0.1, to: 2.5 } },
  { id: "1631097", name: "Bennedict Mathurin", team: "IND", avg: { pts: 14.5, reb: 4.0, ast: 2.0, stl: 0.6, blk: 0.2, to: 1.5 } },
  { id: "1630541", name: "Moses Moody", team: "GSW", avg: { pts: 8.1, reb: 3.0, ast: 0.9, stl: 0.6, blk: 0.4, to: 0.6 } },
  { id: "1629675", name: "Naz Reid", team: "MIN", avg: { pts: 13.5, reb: 5.2, ast: 1.3, stl: 0.8, blk: 0.9, to: 1.7 } },
  { id: "1630532", name: "Franz Wagner", team: "ORL", avg: { pts: 19.7, reb: 5.3, ast: 3.7, stl: 1.1, blk: 0.4, to: 2.1 } },
  { id: "1641738", name: "GG Jackson", team: "MEM", avg: { pts: 14.6, reb: 4.1, ast: 1.2, stl: 0.6, blk: 0.5, to: 1.4 } },
  { id: "1631100", name: "AJ Griffin", team: "ATL", avg: { pts: 2.4, reb: 0.9, ast: 0.3, stl: 0.1, blk: 0.1, to: 0.3 } },
  { id: "1641734", name: "Brandin Podziemski", team: "GSW", avg: { pts: 9.2, reb: 5.8, ast: 3.7, stl: 0.8, blk: 0.2, to: 1.2 } },
  { id: "1641717", name: "Cam Whitmore", team: "HOU", avg: { pts: 12.3, reb: 3.8, ast: 0.7, stl: 0.6, blk: 0.4, to: 1.0 } },
  { id: "1631128", name: "Jabari Smith Jr.", team: "HOU", avg: { pts: 13.7, reb: 8.1, ast: 1.6, stl: 0.7, blk: 0.8, to: 1.1 } },
  { id: "1630595", name: "Trey Murphy III", team: "NOP", avg: { pts: 14.8, reb: 4.9, ast: 2.2, stl: 0.9, blk: 0.5, to: 1.0 } },
  { id: "1631219", name: "Peyton Watson", team: "DEN", avg: { pts: 6.7, reb: 3.2, ast: 1.1, stl: 0.5, blk: 1.1, to: 0.7 } },
  { id: "1630583", name: "Santi Aldama", team: "MEM", avg: { pts: 10.7, reb: 5.8, ast: 2.3, stl: 0.7, blk: 0.9, to: 1.2 } },
  { id: "1631093", name: "Jaden Ivey", team: "DET", avg: { pts: 15.4, reb: 3.4, ast: 3.8, stl: 0.7, blk: 0.5, to: 2.2 } },
  { id: "1630180", name: "Saddiq Bey", team: "ATL", avg: { pts: 13.7, reb: 6.5, ast: 1.5, stl: 0.8, blk: 0.2, to: 1.1 } },
  { id: "1630166", name: "Deni Avdija", team: "WAS", avg: { pts: 14.7, reb: 7.2, ast: 3.8, stl: 0.8, blk: 0.5, to: 2.1 } },
  { id: "1630174", name: "Aaron Nesmith", team: "IND", avg: { pts: 12.2, reb: 3.8, ast: 1.5, stl: 0.9, blk: 0.7, to: 0.9 } },
  { id: "1629637", name: "Jaxson Hayes", team: "LAL", avg: { pts: 4.3, reb: 3.0, ast: 0.5, stl: 0.5, blk: 0.4, to: 0.5 } },
  { id: "1629642", name: "Nassir Little", team: "PHX", avg: { pts: 3.4, reb: 1.7, ast: 0.5, stl: 0.2, blk: 0.2, to: 0.4 } },

  // --- TIER 1: BENCH / SPECIALISTS ---
  { id: "1631105", name: "Jaime Jaquez Jr.", team: "MIA", avg: { pts: 11.9, reb: 3.8, ast: 2.6, stl: 1.0, blk: 0.3, to: 1.5 } },
  { id: "204456", name: "T.J. McConnell", team: "IND", avg: { pts: 10.2, reb: 2.7, ast: 5.5, stl: 1.0, blk: 0.1, to: 1.5 } },
  { id: "1630529", name: "Herbert Jones", team: "NOP", avg: { pts: 11.0, reb: 3.6, ast: 2.6, stl: 1.4, blk: 0.8, to: 1.3 } },
  { id: "1630167", name: "Obi Toppin", team: "IND", avg: { pts: 10.3, reb: 3.9, ast: 1.6, stl: 0.6, blk: 0.5, to: 0.9 } },
  { id: "1630202", name: "Payton Pritchard", team: "BOS", avg: { pts: 9.6, reb: 3.2, ast: 3.1, stl: 0.5, blk: 0.1, to: 0.7 } },
  { id: "1628404", name: "Josh Hart", team: "NYK", avg: { pts: 9.4, reb: 8.3, ast: 4.1, stl: 0.9, blk: 0.3, to: 1.5 } },
  { id: "1631117", name: "Walker Kessler", team: "UTA", avg: { pts: 8.1, reb: 7.5, ast: 0.9, stl: 0.5, blk: 2.4, to: 0.8 } },
  { id: "1641723", name: "Amen Thompson", team: "HOU", avg: { pts: 9.5, reb: 6.6, ast: 2.6, stl: 1.3, blk: 0.6, to: 1.5 } },
  { id: "1641726", name: "Dereck Lively II", team: "DAL", avg: { pts: 8.8, reb: 6.9, ast: 1.1, stl: 0.7, blk: 1.4, to: 0.9 } },
  { id: "1641708", name: "Ausar Thompson", team: "DET", avg: { pts: 8.8, reb: 6.4, ast: 1.9, stl: 1.1, blk: 0.9, to: 1.8 } },
  { id: "201143", name: "Al Horford", team: "BOS", avg: { pts: 8.6, reb: 6.4, ast: 2.6, stl: 0.6, blk: 1.0, to: 0.9 } },
  { id: "1641731", name: "Bilal Coulibaly", team: "WAS", avg: { pts: 8.4, reb: 4.1, ast: 1.7, stl: 0.9, blk: 0.8, to: 1.3 } },
  { id: "1630170", name: "Devin Vassell", team: "SAS", avg: { pts: 19.5, reb: 3.8, ast: 4.1, stl: 1.1, blk: 0.3, to: 1.5 } },
  { id: "1630558", name: "Davion Mitchell", team: "SAC", avg: { pts: 5.3, reb: 1.3, ast: 1.9, stl: 0.2, blk: 0.0, to: 0.7 } },
  { id: "1630193", name: "Immanuel Quickley", team: "TOR", avg: { pts: 18.6, reb: 4.8, ast: 6.8, stl: 0.9, blk: 0.2, to: 1.7 } },
  { id: "1627936", name: "Alex Caruso", team: "CHI", avg: { pts: 10.1, reb: 3.8, ast: 3.5, stl: 1.7, blk: 1.0, to: 1.3 } },
  { id: "1630631", name: "Jose Alvarado", team: "NOP", avg: { pts: 7.1, reb: 2.3, ast: 2.1, stl: 1.1, blk: 0.3, to: 1.0 } },
  { id: "1630552", name: "Jalen Johnson", team: "ATL", avg: { pts: 16.0, reb: 8.7, ast: 3.6, stl: 1.2, blk: 0.8, to: 1.8 } },
  { id: "1631109", name: "Mark Williams", team: "CHA", avg: { pts: 12.7, reb: 9.7, ast: 1.2, stl: 0.8, blk: 1.1, to: 0.9 } },
  { id: "1630533", name: "Ziaire Williams", team: "MEM", avg: { pts: 8.2, reb: 3.5, ast: 1.5, stl: 0.7, blk: 0.2, to: 1.3 } },
  { id: "1631095", name: "Jabari Walker", team: "POR", avg: { pts: 8.9, reb: 7.1, ast: 1.0, stl: 0.6, blk: 0.3, to: 0.8 } },
  { id: "1630171", name: "Isaac Okoro", team: "CLE", avg: { pts: 9.4, reb: 3.0, ast: 1.9, stl: 0.8, blk: 0.5, to: 0.8 } },
  { id: "1631103", name: "Malaki Branham", team: "SAS", avg: { pts: 9.2, reb: 2.0, ast: 2.1, stl: 0.4, blk: 0.1, to: 1.1 } },
  { id: "1630598", name: "Aaron Wiggins", team: "OKC", avg: { pts: 6.9, reb: 2.4, ast: 1.1, stl: 0.7, blk: 0.2, to: 0.6 } },
  { id: "1631170", name: "Tari Eason", team: "HOU", avg: { pts: 9.8, reb: 7.0, ast: 1.2, stl: 1.4, blk: 0.9, to: 0.8 } },
  { id: "1630528", name: "Jason Preston", team: "UTA", avg: { pts: 1.7, reb: 2.4, ast: 2.3, stl: 0.1, blk: 0.1, to: 0.4 } },
  { id: "1631106", name: "Nikola Jovic", team: "MIA", avg: { pts: 7.7, reb: 4.2, ast: 2.0, stl: 0.5, blk: 0.3, to: 0.9 } },
  { id: "1631099", name: "Ousmane Dieng", team: "OKC", avg: { pts: 4.0, reb: 1.5, ast: 1.1, stl: 0.2, blk: 0.2, to: 0.5 } },
  { id: "1641724", name: "Cason Wallace", team: "OKC", avg: { pts: 6.8, reb: 2.3, ast: 1.5, stl: 0.9, blk: 0.5, to: 0.5 } },
  { id: "1630540", name: "Miles McBride", team: "NYK", avg: { pts: 8.3, reb: 1.5, ast: 1.7, stl: 0.9, blk: 0.1, to: 0.5 } },
  { id: "1631211", name: "Christian Braun", team: "DEN", avg: { pts: 7.3, reb: 3.7, ast: 1.6, stl: 0.5, blk: 0.4, to: 0.6 } },
  { id: "1631223", name: "Sam Hauser", team: "BOS", avg: { pts: 9.0, reb: 3.5, ast: 1.0, stl: 0.5, blk: 0.3, to: 0.4 } },
  { id: "1630238", name: "Naji Marshall", team: "NOP", avg: { pts: 7.1, reb: 3.6, ast: 1.9, stl: 0.7, blk: 0.2, to: 1.0 } },
  { id: "1629669", name: "Jaylen Nowell", team: "MEM", avg: { pts: 5.7, reb: 1.6, ast: 1.8, stl: 0.3, blk: 0.1, to: 0.5 } },
  { id: "1629631", name: "De'Andre Hunter", team: "ATL", avg: { pts: 15.6, reb: 3.9, ast: 1.5, stl: 0.7, blk: 0.3, to: 1.4 } }
];

// ==========================================
// 3. MASTER ROSTER EXPORT
// ==========================================
export const MASTER_ROSTER = RAW_ROSTER.map(p => {
  const avgFP = calculateFantasyPoints(p.avg);
  const cost = calculateSalary(avgFP);
  
  return {
    ...p,
    cost: parseFloat(cost),
    // Fallback image using ID, logic assumes standard NBA CDN format
    image: `https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`, 
  };
});

// ==========================================
// 4. API SIMULATION
// ==========================================
export const fetchDraftPool = (count, excludeNames = [], maxCost = 15.0) => {
  let pool = MASTER_ROSTER.filter(p => !excludeNames.includes(p.name) && p.cost <= maxCost);
  
  // Shuffle (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count).map(p => ({
    ...p, 
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }));
};

export const getPlayerGameLog = (player) => {
  // Use REAL AVG stats + Variance to simulate a game
  // This guarantees performance is "Real-ish" (LeBron won't score 2 pts)
  const volatility = 0.7 + Math.random() * 0.6; // 0.7x to 1.3x
  const s = player.avg;
  
  const stats = {
    pts: Math.round(s.pts * volatility),
    reb: Math.round(s.reb * (volatility * 0.9 + Math.random()*0.2)),
    ast: Math.round(s.ast * (volatility * 0.8 + Math.random()*0.4)),
    stl: Math.random() > 0.6 ? Math.round(s.stl + Math.random()) : 0,
    blk: Math.random() > 0.7 ? Math.round(s.blk + Math.random()) : 0,
    to:  Math.round(s.to * volatility)
  };

  const fp = calculateFantasyPoints(stats);
  const date = `${["Nov","Dec","Jan","Feb","Mar"][Math.floor(Math.random()*5)]} ${Math.floor(Math.random()*28)+1}`;
  
  const badges = [];
  let bonus = 0;
  if (stats.pts >= 30) { badges.push('🔥'); bonus += 3; }
  if (stats.stl + stats.blk >= 4) { badges.push('🔒'); bonus += 3; }
  
  return {
    score: fp + bonus,
    rawStats: stats,
    date: date,
    badges,
    bonus
  };
};