// REAL NBA PLAYER DATABASE (2024 Season Data)
// Cost Scale: $1.0 (End of Bench) to $7.0 (MVP Level)

export const REAL_NBA_PLAYERS = [
  // --- TIER 1: ORANGE ($5.00+) ---
  { 
    id: 1, name: "Nikola Jokic", team: "DEN", cost: 6.8, 
    image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png",
    avg: { pts: 26.4, reb: 12.4, ast: 9.0, fp: 65.0 }, 
    gameLog: [
      {date:"2024-01-04", opp:"GSW", score:72.5, rawStats:{pts:34,reb:9,ast:10,stl:2,blk:1}},
      {date:"2024-01-07", opp:"DET", score:60.0, rawStats:{pts:4,reb:7,ast:16,stl:0,blk:5}},
      {date:"2024-01-14", opp:"IND", score:55.5, rawStats:{pts:25,reb:12,ast:9,stl:2,blk:0}}
    ]
  },
  { id: 2, name: "Giannis Antetokounmpo", team: "MIL", cost: 6.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png", avg: { pts: 30.4, reb: 11.5, ast: 6.5, fp: 62.0 }, gameLog: [{date:"2024-01-03", opp:"IND", score:70.0, rawStats:{pts:26,reb:11,ast:8,stl:2,blk:1}}] },
  { id: 3, name: "Luka Doncic", team: "DAL", cost: 6.7, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png", avg: { pts: 33.9, reb: 9.2, ast: 9.8, fp: 64.0 }, gameLog: [{date:"2024-01-26", opp:"ATL", score:95.0, rawStats:{pts:73,reb:10,ast:7,stl:1,blk:0}}] },
  { id: 4, name: "Joel Embiid", team: "PHI", cost: 6.9, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png", avg: { pts: 34.7, reb: 11.0, ast: 5.6, fp: 66.0 }, gameLog: [{date:"2024-01-22", opp:"SAS", score:105.0, rawStats:{pts:70,reb:18,ast:5,stl:1,blk:1}}] },
  { id: 5, name: "Shai Gilgeous-Alexander", team: "OKC", cost: 6.0, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png", avg: { pts: 30.1, reb: 5.5, ast: 6.2, fp: 55.0 }, gameLog: [{date:"2024-01-15", opp:"LAL", score:52.0, rawStats:{pts:31,reb:9,ast:5,stl:2,blk:1}}] },
  { id: 10, name: "Jayson Tatum", team: "BOS", cost: 5.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png", avg: { pts: 26.9, reb: 8.1, ast: 4.9, fp: 48.0 }, gameLog: [{date:"2024-01-10", opp:"MIN", score:55.0, rawStats:{pts:45,reb:4,ast:2}}] },
  { id: 11, name: "Anthony Edwards", team: "MIN", cost: 5.2, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png", avg: { pts: 25.9, reb: 5.4, ast: 5.1, fp: 46.0 }, gameLog: [{date:"2024-01-15", opp:"LAC", score:48.0, rawStats:{pts:33,reb:9,ast:6}}] },
  { id: 12, name: "Jalen Brunson", team: "NYK", cost: 5.1, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628973.png", avg: { pts: 28.7, reb: 3.6, ast: 6.7, fp: 47.0 }, gameLog: [{date:"2024-01-18", opp:"WAS", score:52.0, rawStats:{pts:41,reb:8,ast:8}}] },
  
  // --- TIER 2: PURPLE ($4.00 - $4.99) ---
  { id: 20, name: "Jaylen Brown", team: "BOS", cost: 4.2, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627759.png", avg: { pts: 23.0, reb: 5.5, ast: 3.6, fp: 38.0 }, gameLog: [{date:"2024-02-01", opp:"LAL", score:40.0, rawStats:{pts:25,reb:6,ast:5}}] },
  { id: 21, name: "Domantas Sabonis", team: "SAC", cost: 4.8, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627734.png", avg: { pts: 19.4, reb: 13.7, ast: 8.2, fp: 45.0 }, gameLog: [{date:"2024-02-02", opp:"IND", score:50.0, rawStats:{pts:20,reb:20,ast:10}}] },
  { id: 22, name: "De'Aaron Fox", team: "SAC", cost: 4.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628368.png", avg: { pts: 26.6, reb: 4.6, ast: 5.6, fp: 42.0 }, gameLog: [{date:"2024-02-03", opp:"CHI", score:45.0, rawStats:{pts:41,reb:4,ast:4}}] },
  { id: 23, name: "Bam Adebayo", team: "MIA", cost: 4.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628389.png", avg: { pts: 19.3, reb: 10.4, ast: 3.9, fp: 40.0 }, gameLog: [{date:"2024-02-04", opp:"LAC", score:38.0, rawStats:{pts:14,reb:13,ast:3}}] },
  { id: 24, name: "Paolo Banchero", team: "ORL", cost: 4.4, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631094.png", avg: { pts: 22.6, reb: 6.9, ast: 5.4, fp: 39.0 }, gameLog: [{date:"2024-02-05", opp:"DET", score:42.0, rawStats:{pts:28,reb:6,ast:7}}] },

  // --- TIER 3: BLUE ($3.00 - $3.99) ---
  { id: 30, name: "Cade Cunningham", team: "DET", cost: 3.8, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630595.png", avg: { pts: 22.7, reb: 4.3, ast: 7.5, fp: 36.0 }, gameLog: [{date:"2024-02-07", opp:"SAC", score:39.0, rawStats:{pts:28,reb:5,ast:9}}] },
  { id: 31, name: "LaMelo Ball", team: "CHA", cost: 3.9, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630163.png", avg: { pts: 23.9, reb: 5.1, ast: 8.0, fp: 38.0 }, gameLog: [{date:"2024-01-26", opp:"HOU", score:42.0, rawStats:{pts:30,reb:6,ast:8}}] },
  { id: 32, name: "Scottie Barnes", team: "TOR", cost: 3.7, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630567.png", avg: { pts: 19.9, reb: 8.2, ast: 6.1, fp: 37.0 }, gameLog: [{date:"2024-02-22", opp:"BKN", score:45.0, rawStats:{pts:22,reb:10,ast:8}}] },
  { id: 33, name: "Jalen Williams", team: "OKC", cost: 3.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631114.png", avg: { pts: 19.1, reb: 4.0, ast: 4.5, fp: 34.0 }, gameLog: [{date:"2024-02-13", opp:"ORL", score:36.0, rawStats:{pts:25,reb:5,ast:4}}] },
  { id: 34, name: "Mikal Bridges", team: "NYK", cost: 3.4, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628969.png", avg: { pts: 19.6, reb: 4.5, ast: 3.6, fp: 32.0 }, gameLog: [{date:"2024-02-08", opp:"DAL", score:30.0, rawStats:{pts:22,reb:5,ast:3}}] },

  // --- TIER 4: GREEN ($2.00 - $2.99) ---
  { id: 1001, name: "Christian Braun", team: "DEN", cost: 2.2, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631128.png", avg: { pts: 7.3, reb: 3.7, ast: 1.6, fp: 18.0 } },
  { id: 1002, name: "Payton Pritchard", team: "BOS", cost: 2.0, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630202.png", avg: { pts: 9.6, reb: 3.2, ast: 3.1, fp: 19.5 } },
  { id: 1004, name: "Isaac Okoro", team: "CLE", cost: 2.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630171.png", avg: { pts: 9.4, reb: 3.0, ast: 1.9, fp: 20.0 } },
  { id: 1005, name: "Reggie Jackson", team: "DEN", cost: 2.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/202704.png", avg: { pts: 10.2, reb: 1.9, ast: 3.8, fp: 21.0 } },
  { id: 1006, name: "Obi Toppin", team: "IND", cost: 2.4, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630167.png", avg: { pts: 10.3, reb: 3.9, ast: 1.6, fp: 20.5 } },
  { id: 1007, name: "T.J. McConnell", team: "IND", cost: 2.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/204456.png", avg: { pts: 10.2, reb: 2.7, ast: 5.5, fp: 23.0 } },
  { id: 1008, name: "Norman Powell", team: "LAC", cost: 2.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626181.png", avg: { pts: 13.9, reb: 2.6, ast: 1.1, fp: 21.0 } },
  { id: 1009, name: "Terance Mann", team: "LAC", cost: 2.1, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629611.png", avg: { pts: 8.8, reb: 3.4, ast: 1.6, fp: 17.5 } },
  { id: 1010, name: "Santi Aldama", team: "MEM", cost: 2.4, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630583.png", avg: { pts: 10.7, reb: 5.8, ast: 2.3, fp: 23.5 } },
  { id: 1011, name: "Jaime Jaquez Jr.", team: "MIA", cost: 2.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631170.png", avg: { pts: 11.9, reb: 3.8, ast: 2.6, fp: 22.0 } },
  { id: 1012, name: "Malik Beasley", team: "MIL", cost: 2.1, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627736.png", avg: { pts: 11.3, reb: 3.7, ast: 1.4, fp: 19.0 } },
  { id: 1013, name: "Kyle Anderson", team: "MIN", cost: 2.0, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203937.png", avg: { pts: 6.4, reb: 3.5, ast: 4.2, fp: 18.0 } },
  { id: 1014, name: "Larry Nance Jr.", team: "NOP", cost: 2.2, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626204.png", avg: { pts: 5.7, reb: 5.0, ast: 1.9, fp: 17.5 } },
  { id: 1015, name: "Moritz Wagner", team: "ORL", cost: 2.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629021.png", avg: { pts: 10.9, reb: 4.3, ast: 1.2, fp: 19.5 } },
  { id: 1016, name: "Kelly Oubre Jr.", team: "PHI", cost: 2.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626162.png", avg: { pts: 15.4, reb: 5.0, ast: 1.5, fp: 26.0 } },
  { id: 1017, name: "Eric Gordon", team: "PHX", cost: 2.1, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201569.png", avg: { pts: 11.0, reb: 1.8, ast: 2.0, fp: 18.0 } },
  { id: 1018, name: "Zach Collins", team: "SAS", cost: 2.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628380.png", avg: { pts: 11.2, reb: 5.4, ast: 2.8, fp: 23.0 } },
  { id: 1019, name: "Gary Trent Jr.", team: "TOR", cost: 2.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629018.png", avg: { pts: 13.7, reb: 2.6, ast: 1.7, fp: 21.5 } },

  // --- TIER 5: WHITE ($1.00 - $1.99) ---
  { id: 2001, name: "P.J. Tucker", team: "LAC", cost: 1.0, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/200782.png", avg: { pts: 1.7, reb: 2.9, ast: 0.5, fp: 10.0 } },
  { id: 2002, name: "Thanasis Antetokounmpo", team: "MIL", cost: 1.0, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203648.png", avg: { pts: 0.9, reb: 0.4, ast: 0.5, fp: 5.5 } },
  { id: 2003, name: "DeAndre Jordan", team: "DEN", cost: 1.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201599.png", avg: { pts: 3.9, reb: 4.4, ast: 0.7, fp: 14.5 } },
  { id: 2004, name: "Luke Kornet", team: "BOS", cost: 1.2, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628436.png", avg: { pts: 5.3, reb: 4.1, ast: 1.1, fp: 13.0 } },
  { id: 2005, name: "Sam Hauser", team: "BOS", cost: 1.8, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630573.png", avg: { pts: 9.0, reb: 3.5, ast: 1.0, fp: 16.5 } },
  { id: 2006, name: "Bismack Biyombo", team: "MEM", cost: 1.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/202687.png", avg: { pts: 5.2, reb: 6.4, ast: 1.1, fp: 17.0 } },
  { id: 2007, name: "Georges Niang", team: "CLE", cost: 1.4, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627777.png", avg: { pts: 9.4, reb: 3.4, ast: 1.1, fp: 15.5 } },
  { id: 2008, name: "Dario Saric", team: "GSW", cost: 1.9, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203967.png", avg: { pts: 8.0, reb: 4.4, ast: 2.3, fp: 18.0 } },
  { id: 2009, name: "Moses Moody", team: "GSW", cost: 1.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630541.png", avg: { pts: 8.1, reb: 3.0, ast: 0.9, fp: 14.5 } },
  { id: 2010, name: "Jae'Sean Tate", team: "HOU", cost: 1.2, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630256.png", avg: { pts: 4.1, reb: 3.0, ast: 1.0, fp: 11.5 } },
  { id: 2011, name: "Jeff Green", team: "HOU", cost: 1.1, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201145.png", avg: { pts: 6.5, reb: 2.3, ast: 0.9, fp: 12.0 } },
  { id: 2012, name: "Christian Wood", team: "LAL", cost: 1.7, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626174.png", avg: { pts: 6.9, reb: 5.1, ast: 1.0, fp: 16.0 } },
  { id: 2013, name: "Jaxson Hayes", team: "LAL", cost: 1.1, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629637.png", avg: { pts: 4.3, reb: 3.0, ast: 0.5, fp: 10.0 } },
  { id: 2014, name: "Ziaire Williams", team: "MEM", cost: 1.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630533.png", avg: { pts: 8.2, reb: 3.5, ast: 1.5, fp: 16.0 } },
  { id: 2015, name: "Haywood Highsmith", team: "MIA", cost: 1.6, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629312.png", avg: { pts: 6.1, reb: 3.2, ast: 1.1, fp: 14.0 } },
  { id: 2016, name: "Pat Connaughton", team: "MIL", cost: 1.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626192.png", avg: { pts: 5.6, reb: 3.1, ast: 2.1, fp: 13.5 } },
  { id: 2017, name: "Nickeil Alexander-Walker", team: "MIN", cost: 1.9, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629638.png", avg: { pts: 8.0, reb: 2.0, ast: 2.5, fp: 16.0 } },
  { id: 2018, name: "Jose Alvarado", team: "NOP", cost: 1.7, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630631.png", avg: { pts: 7.1, reb: 2.3, ast: 2.1, fp: 15.0 } },
  { id: 2019, name: "Quentin Grimes", team: "NYK", cost: 1.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630565.png", avg: { pts: 7.3, reb: 2.0, ast: 1.2, fp: 13.0 } },
  { id: 2020, name: "Miles McBride", team: "NYK", cost: 1.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630540.png", avg: { pts: 8.3, reb: 1.5, ast: 1.7, fp: 14.0 } },
  { id: 2021, name: "Isaiah Joe", team: "OKC", cost: 1.8, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630198.png", avg: { pts: 8.2, reb: 2.3, ast: 1.3, fp: 15.0 } },
  { id: 2022, name: "Aaron Wiggins", team: "OKC", cost: 1.6, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630598.png", avg: { pts: 6.9, reb: 2.4, ast: 1.1, fp: 13.5 } },
  { id: 2023, name: "Joe Ingles", team: "ORL", cost: 1.4, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/204060.png", avg: { pts: 4.4, reb: 2.1, ast: 3.0, fp: 12.5 } },
  { id: 2024, name: "Paul Reed", team: "PHI", cost: 1.9, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630194.png", avg: { pts: 7.3, reb: 6.0, ast: 1.3, fp: 18.5 } },
  { id: 2025, name: "Drew Eubanks", team: "PHX", cost: 1.2, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629234.png", avg: { pts: 5.1, reb: 4.3, ast: 0.8, fp: 12.0 } },
  { id: 2026, name: "Duop Reath", team: "POR", cost: 1.8, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1641871.png", avg: { pts: 9.1, reb: 3.7, ast: 1.0, fp: 16.0 } },
  { id: 2027, name: "Jabari Walker", team: "POR", cost: 1.9, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631133.png", avg: { pts: 8.9, reb: 7.1, ast: 1.0, fp: 20.0 } },
  { id: 2028, name: "Trey Lyles", team: "SAC", cost: 1.7, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626168.png", avg: { pts: 7.2, reb: 4.4, ast: 1.2, fp: 15.5 } },
  { id: 2029, name: "Davion Mitchell", team: "SAC", cost: 1.1, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630558.png", avg: { pts: 5.3, reb: 1.3, ast: 1.9, fp: 10.5 } },
  { id: 2030, name: "Cedi Osman", team: "SAS", cost: 1.5, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626224.png", avg: { pts: 6.8, reb: 2.5, ast: 1.7, fp: 13.5 } },
  { id: 2031, name: "Ochai Agbaji", team: "TOR", cost: 1.3, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630534.png", avg: { pts: 5.8, reb: 2.8, ast: 1.1, fp: 12.0 } },
  { id: 2032, name: "Kris Dunn", team: "UTA", cost: 1.6, image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627739.png", avg: { pts: 5.4, reb: 2.9, ast: 3.8, fp: 15.0 } }
];

// --- HELPER FUNCTIONS ---

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const fetchDraftPool = (count, excludeNames = [], maxCost = 999) => {
  const pool = REAL_NBA_PLAYERS.filter(p => 
    !excludeNames.includes(p.name) && p.cost <= maxCost
  );
  if (pool.length === 0) return [];
  return shuffle([...pool]).slice(0, count);
};

export const getPlayerGameLog = (player) => {
  if (!player.gameLog || player.gameLog.length === 0) {
    const variance = (Math.random() * 0.4) + 0.8; // 0.8x to 1.2x
    return {
      date: "2023-11-01",
      opp: "NB",
      score: player.avg.fp * variance,
      rawStats: { 
        pts: Math.round(player.avg.pts * variance), 
        reb: Math.round(player.avg.reb * variance), 
        ast: Math.round(player.avg.ast * variance),
        stl: Math.round(0.5 * variance),
        blk: Math.round(0.5 * variance),
        to: 1
      },
      badges: [] 
    };
  }
  
  const randomIndex = Math.floor(Math.random() * player.gameLog.length);
  const game = player.gameLog[randomIndex];
  
  const badges = [];
  const s = game.rawStats;
  
  const cats10 = [s.pts, s.reb, s.ast, s.stl, s.blk].filter(v => v >= 10).length;
  if (cats10 >= 3) badges.push("👑"); 
  else if (cats10 >= 2) badges.push("✌️"); 
  
  const cats5 = [s.pts, s.reb, s.ast, s.stl, s.blk].filter(v => v >= 5).length;
  if (cats5 >= 5) badges.push("🖐️"); 
  
  if ((s.stl + s.blk) >= 4) badges.push("🔒"); 
  
  if (game.score >= 40 || s.pts >= 30) badges.push("🔥");

  const bonus = badges.length * 5; 

  return { ...game, score: game.score + bonus, bonus, badges };
};