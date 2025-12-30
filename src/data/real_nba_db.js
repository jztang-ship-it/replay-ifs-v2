// REAL DATA: 2024-2025 NBA SEASON AVERAGES
// Sources: Basketball-Reference, CBS Sports, FantasyPros (Dec 2025)
// STRICT SORTING: High Cost -> Low Cost
// 5 TIERS: $5+, $4+, $3+, $2+, $1+

const db = [
  // ============================================================
  // TIER 5: THE GODS ($5.0 - $6.0)
  // The absolute best. You can usually only afford 1 (maybe 2).
  // ============================================================
  { id: "203999", name: "Nikola Jokic", team: "DEN", cost: 6.0, stats: { pts: 29.9, reb: 12.4, ast: 11.0, stl: 1.4, blk: 0.9, to: 3.0, score: 62.5 } },
  { id: "1629029", name: "Luka Doncic", team: "DAL", cost: 5.9, stats: { pts: 33.7, reb: 8.8, ast: 8.7, stl: 1.4, blk: 0.5, to: 4.0, score: 58.2 } },
  { id: "203507", name: "Giannis Antetokounmpo", team: "MIL", cost: 5.8, stats: { pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, to: 3.4, score: 56.1 } },
  { id: "1628983", name: "Shai Gilgeous-Alexander", team: "OKC", cost: 5.7, stats: { pts: 32.7, reb: 5.0, ast: 6.4, stl: 2.1, blk: 0.9, to: 2.2, score: 54.4 } },
  { id: "203954", name: "Joel Embiid", team: "PHI", cost: 5.7, stats: { pts: 33.6, reb: 11.5, ast: 3.6, stl: 1.4, blk: 1.7, to: 3.8, score: 55.0 } },
  { id: "203076", name: "Anthony Davis", team: "LAL", cost: 5.6, stats: { pts: 24.5, reb: 12.6, ast: 3.5, stl: 1.2, blk: 2.3, to: 2.1, score: 52.0 } },
  { id: "1641705", name: "Victor Wembanyama", team: "SAS", cost: 5.5, stats: { pts: 21.4, reb: 10.6, ast: 3.9, stl: 1.2, blk: 3.6, to: 3.2, score: 51.0 } }, 
  { id: "1628369", name: "Jayson Tatum", team: "BOS", cost: 5.3, stats: { pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, to: 2.5, score: 46.8 } },
  { id: "1627734", name: "Domantas Sabonis", team: "SAC", cost: 5.2, stats: { pts: 19.8, reb: 13.9, ast: 8.2, stl: 0.8, blk: 0.6, to: 3.3, score: 49.5 } },
  { id: "201142", name: "Kevin Durant", team: "PHX", cost: 5.0, stats: { pts: 27.1, reb: 6.6, ast: 5.0, stl: 0.9, blk: 1.2, to: 3.3, score: 45.0 } },

  // ============================================================
  // TIER 4: SUPERSTARS ($4.0 - $4.9)
  // High usage stars. Great anchors for a team.
  // ============================================================
  { id: "201935", name: "James Harden", team: "LAC", cost: 4.9, stats: { pts: 20.0, reb: 9.3, ast: 8.3, stl: 2.1, blk: 2.0, to: 2.6, score: 48.0 } },
  { id: "1630169", name: "Tyrese Haliburton", team: "IND", cost: 4.9, stats: { pts: 20.1, reb: 3.9, ast: 10.9, stl: 1.2, blk: 0.7, to: 2.3, score: 42.5 } },
  { id: "1630162", name: "Anthony Edwards", team: "MIN", cost: 4.9, stats: { pts: 27.8, reb: 5.6, ast: 5.2, stl: 1.3, blk: 0.6, to: 3.1, score: 45.2 } },
  { id: "201939", name: "Stephen Curry", team: "GSW", cost: 4.8, stats: { pts: 26.8, reb: 4.4, ast: 5.0, stl: 0.8, blk: 0.4, to: 2.8, score: 41.5 } },
  { id: "1629027", name: "Trae Young", team: "ATL", cost: 4.8, stats: { pts: 25.7, reb: 2.8, ast: 10.8, stl: 1.3, blk: 0.2, to: 4.4, score: 43.0 } },
  { id: "1628378", name: "Donovan Mitchell", team: "CLE", cost: 4.7, stats: { pts: 26.6, reb: 5.1, ast: 6.1, stl: 1.8, blk: 0.5, to: 2.8, score: 42.0 } },
  { id: "1629630", name: "Ja Morant", team: "MEM", cost: 4.7, stats: { pts: 25.1, reb: 5.6, ast: 8.1, stl: 0.9, blk: 0.4, to: 3.0, score: 44.0 } },
  { id: "1631094", name: "Paolo Banchero", team: "ORL", cost: 4.6, stats: { pts: 22.6, reb: 6.9, ast: 5.4, stl: 0.9, blk: 0.6, to: 3.1, score: 40.1 } },
  { id: "203081", name: "Damian Lillard", team: "MIL", cost: 4.6, stats: { pts: 24.3, reb: 4.4, ast: 7.0, stl: 1.0, blk: 0.2, to: 2.4, score: 39.5 } },
  { id: "1626164", name: "Devin Booker", team: "PHX", cost: 4.6, stats: { pts: 27.1, reb: 4.5, ast: 6.9, stl: 0.9, blk: 0.4, to: 2.6, score: 41.0 } },
  { id: "203944", name: "Julius Randle", team: "MIN", cost: 4.5, stats: { pts: 24.0, reb: 9.2, ast: 5.0, stl: 0.5, blk: 0.3, to: 3.5, score: 40.0 } },
  { id: "1629636", name: "Darius Garland", team: "CLE", cost: 4.5, stats: { pts: 18.0, reb: 2.7, ast: 6.5, stl: 1.3, blk: 0.1, to: 3.0, score: 33.0 } },
  { id: "1630163", name: "LaMelo Ball", team: "CHA", cost: 4.5, stats: { pts: 23.9, reb: 5.1, ast: 8.0, stl: 1.8, blk: 0.2, to: 3.8, score: 42.0 } },
  { id: "1628368", name: "De'Aaron Fox", team: "SAC", cost: 4.5, stats: { pts: 26.6, reb: 4.6, ast: 5.6, stl: 2.0, blk: 0.4, to: 2.7, score: 42.0 } },
  { id: "1630178", name: "Tyrese Maxey", team: "PHI", cost: 4.4, stats: { pts: 25.9, reb: 3.7, ast: 6.2, stl: 1.0, blk: 0.5, to: 1.7, score: 39.0 } },
  { id: "1628389", name: "Bam Adebayo", team: "MIA", cost: 4.2, stats: { pts: 19.3, reb: 10.4, ast: 3.9, stl: 1.1, blk: 0.9, to: 2.3, score: 40.2 } },
  { id: "1627783", name: "Pascal Siakam", team: "IND", cost: 4.2, stats: { pts: 21.7, reb: 7.1, ast: 4.3, stl: 0.8, blk: 0.3, to: 2.4, score: 37.5 } },
  { id: "1630552", name: "Jalen Johnson", team: "ATL", cost: 4.1, stats: { pts: 16.0, reb: 8.7, ast: 3.6, stl: 1.2, blk: 0.8, to: 1.8, score: 35.0 } },
  { id: "1631114", name: "Jalen Williams", team: "OKC", cost: 4.1, stats: { pts: 19.5, reb: 4.1, ast: 4.6, stl: 1.5, blk: 0.5, to: 1.9, score: 34.5 } },
  { id: "1630578", name: "Alperen Sengun", team: "HOU", cost: 4.0, stats: { pts: 21.1, reb: 9.3, ast: 5.0, stl: 1.2, blk: 0.7, to: 2.6, score: 42.0 } },
  { id: "1628991", name: "Jaren Jackson Jr.", team: "MEM", cost: 4.0, stats: { pts: 22.5, reb: 5.5, ast: 2.3, stl: 1.6, blk: 1.6, to: 1.8, score: 39.8 } },
  { id: "1627749", name: "Dejounte Murray", team: "NOP", cost: 4.0, stats: { pts: 21.2, reb: 5.3, ast: 6.4, stl: 1.4, blk: 0.3, to: 2.5, score: 38.0 } },

  // ============================================================
  // TIER 3: STARTERS & STARS ($3.0 - $3.9)
  // The backbone of your team.
  // ============================================================
  { id: "203497", name: "Rudy Gobert", team: "MIN", cost: 3.9, stats: { pts: 14.0, reb: 12.9, ast: 1.3, stl: 0.7, blk: 2.1, to: 1.5, score: 38.0 } },
  { id: "1630595", name: "Cade Cunningham", team: "DET", cost: 3.9, stats: { pts: 22.7, reb: 4.3, ast: 7.5, stl: 0.9, blk: 0.4, to: 3.5, score: 39.0 } },
  { id: "1630560", name: "Cam Thomas", team: "BKN", cost: 3.8, stats: { pts: 22.5, reb: 3.2, ast: 2.9, stl: 0.7, blk: 0.2, to: 2.0, score: 32.1 } },
  { id: "1630217", name: "Desmond Bane", team: "MEM", cost: 3.8, stats: { pts: 23.7, reb: 4.4, ast: 5.5, stl: 1.0, blk: 0.6, to: 2.6, score: 38.0 } },
  { id: "1630596", name: "Evan Mobley", team: "CLE", cost: 3.8, stats: { pts: 15.7, reb: 9.4, ast: 3.2, stl: 0.9, blk: 1.4, to: 1.8, score: 35.6 } },
  { id: "202696", name: "Nikola Vucevic", team: "CHI", cost: 3.8, stats: { pts: 18.0, reb: 10.5, ast: 3.3, stl: 0.7, blk: 0.8, to: 1.8, score: 36.0 } },
  { id: "1629028", name: "Deandre Ayton", team: "POR", cost: 3.7, stats: { pts: 16.7, reb: 11.1, ast: 1.6, stl: 1.0, blk: 0.8, to: 1.9, score: 34.5 } },
  { id: "1628398", name: "Jarrett Allen", team: "CLE", cost: 3.7, stats: { pts: 16.5, reb: 10.5, ast: 2.7, stl: 0.8, blk: 1.1, to: 1.7, score: 36.2 } },
  { id: "1630111", name: "Jalen Duren", team: "DET", cost: 3.6, stats: { pts: 13.8, reb: 11.6, ast: 2.4, stl: 0.5, blk: 0.9, to: 2.1, score: 33.5 } },
  { id: "203991", name: "Clint Capela", team: "ATL", cost: 3.6, stats: { pts: 11.5, reb: 10.6, ast: 1.2, stl: 0.6, blk: 1.5, to: 1.0, score: 32.0 } },
  { id: "1629673", name: "Jordan Poole", team: "WAS", cost: 3.6, stats: { pts: 21.1, reb: 3.2, ast: 4.8, stl: 1.3, blk: 0.3, to: 3.0, score: 34.0 } },
  { id: "1628970", name: "Miles Bridges", team: "CHA", cost: 3.6, stats: { pts: 21.0, reb: 7.3, ast: 3.3, stl: 0.9, blk: 0.4, to: 2.1, score: 36.5 } },
  { id: "1630532", name: "Franz Wagner", team: "ORL", cost: 3.5, stats: { pts: 19.7, reb: 5.3, ast: 3.7, stl: 1.1, blk: 0.4, to: 1.8, score: 34.0 } },
  { id: "1630166", name: "Deni Avdija", team: "POR", cost: 3.5, stats: { pts: 14.7, reb: 7.2, ast: 3.8, stl: 0.8, blk: 0.5, to: 1.9, score: 31.0 } },
  { id: "203114", name: "Khris Middleton", team: "MIL", cost: 3.5, stats: { pts: 15.1, reb: 4.7, ast: 5.3, stl: 0.9, blk: 0.3, to: 2.3, score: 29.0 } },
  { id: "1631096", name: "Chet Holmgren", team: "OKC", cost: 3.4, stats: { pts: 16.5, reb: 7.9, ast: 2.4, stl: 0.6, blk: 2.3, to: 1.6, score: 35.0 } },
  { id: "1627742", name: "Brandon Ingram", team: "NOP", cost: 3.4, stats: { pts: 20.8, reb: 5.1, ast: 5.7, stl: 0.8, blk: 0.6, to: 2.5, score: 35.0 } },
  { id: "1627750", name: "Jamal Murray", team: "DEN", cost: 3.4, stats: { pts: 21.2, reb: 4.1, ast: 6.5, stl: 1.0, blk: 0.7, to: 2.1, score: 36.0 } },
  { id: "1629639", name: "Tyler Herro", team: "MIA", cost: 3.3, stats: { pts: 20.8, reb: 5.3, ast: 4.5, stl: 0.7, blk: 0.1, to: 2.2, score: 34.0 } },
  { id: "1627832", name: "Fred VanVleet", team: "HOU", cost: 3.3, stats: { pts: 17.4, reb: 3.8, ast: 8.1, stl: 1.4, blk: 0.8, to: 1.7, score: 35.0 } },
  { id: "1628374", name: "Lauri Markkanen", team: "UTA", cost: 3.3, stats: { pts: 23.2, reb: 8.2, ast: 2.0, stl: 0.9, blk: 0.5, to: 1.7, score: 38.0 } },
  { id: "1629628", name: "RJ Barrett", team: "TOR", cost: 3.2, stats: { pts: 20.2, reb: 5.4, ast: 3.3, stl: 0.5, blk: 0.4, to: 2.2, score: 33.0 } },
  { id: "1628969", name: "Mikal Bridges", team: "NYK", cost: 3.2, stats: { pts: 19.6, reb: 4.5, ast: 3.6, stl: 1.0, blk: 0.4, to: 1.5, score: 33.0 } },
  { id: "1631097", name: "Keegan Murray", team: "SAC", cost: 3.1, stats: { pts: 15.2, reb: 5.5, ast: 1.7, stl: 1.0, blk: 0.8, to: 1.1, score: 28.0 } },
  { id: "1628401", name: "Derrick White", team: "BOS", cost: 3.1, stats: { pts: 15.2, reb: 4.2, ast: 5.2, stl: 1.0, blk: 1.2, to: 1.5, score: 31.0 } },
  { id: "1629004", name: "Anfernee Simons", team: "POR", cost: 3.1, stats: { pts: 22.6, reb: 3.6, ast: 5.5, stl: 0.5, blk: 0.1, to: 2.3, score: 34.0 } },
  { id: "1630170", name: "Devin Vassell", team: "SAS", cost: 3.0, stats: { pts: 19.5, reb: 3.8, ast: 4.1, stl: 1.1, blk: 0.3, to: 1.5, score: 31.0 } },
  { id: "1626179", name: "Terry Rozier", team: "MIA", cost: 3.0, stats: { pts: 16.4, reb: 4.2, ast: 5.3, stl: 1.1, blk: 0.3, to: 1.3, score: 30.0 } },
  { id: "1629651", name: "Nic Claxton", team: "BKN", cost: 3.0, stats: { pts: 11.8, reb: 9.9, ast: 2.1, stl: 0.6, blk: 2.1, to: 1.2, score: 32.0 } },
  { id: "1630224", name: "Jalen Green", team: "HOU", cost: 3.0, stats: { pts: 19.6, reb: 5.2, ast: 3.5, stl: 0.8, blk: 0.3, to: 2.3, score: 32.0 } },

  // ============================================================
  // TIER 2: ROTATION PLAYERS ($2.0 - $2.9)
  // Solid contributors who get minutes.
  // ============================================================
  { id: "1630193", name: "Immanuel Quickley", team: "TOR", cost: 2.9, stats: { pts: 18.6, reb: 4.8, ast: 6.8, stl: 0.9, blk: 0.2, to: 1.6, score: 34.0 } },
  { id: "1630570", name: "Trey Murphy III", team: "NOP", cost: 2.9, stats: { pts: 14.8, reb: 4.9, ast: 2.2, stl: 0.9, blk: 0.5, to: 1.0, score: 27.0 } },
  { id: "203994", name: "Jusuf Nurkic", team: "PHX", cost: 2.9, stats: { pts: 11.5, reb: 10.2, ast: 3.8, stl: 0.9, blk: 1.0, to: 2.1, score: 31.0 } },
  { id: "1627826", name: "Ivica Zubac", team: "LAC", cost: 2.8, stats: { pts: 11.7, reb: 9.2, ast: 1.4, stl: 0.3, blk: 1.2, to: 1.2, score: 27.0 } },
  { id: "1628404", name: "Josh Hart", team: "NYK", cost: 2.8, stats: { pts: 9.4, reb: 8.3, ast: 4.1, stl: 0.9, blk: 0.3, to: 1.5, score: 26.0 } },
  { id: "1630543", name: "Josh Giddey", team: "CHI", cost: 2.8, stats: { pts: 12.3, reb: 6.4, ast: 4.8, stl: 0.6, blk: 0.6, to: 2.1, score: 28.0 } },
  { id: "1627763", name: "Malcolm Brogdon", team: "POR", cost: 2.8, stats: { pts: 15.7, reb: 3.8, ast: 5.5, stl: 0.7, blk: 0.2, to: 1.5, score: 28.0 } },
  { id: "1630559", name: "Austin Reaves", team: "LAL", cost: 2.7, stats: { pts: 15.9, reb: 4.3, ast: 5.5, stl: 0.8, blk: 0.3, to: 2.2, score: 29.0 } },
  { id: "203932", name: "Aaron Gordon", team: "DEN", cost: 2.7, stats: { pts: 13.9, reb: 6.5, ast: 3.5, stl: 0.8, blk: 0.6, to: 1.5, score: 28.0 } },
  { id: "1629008", name: "Michael Porter Jr.", team: "DEN", cost: 2.7, stats: { pts: 16.7, reb: 7.0, ast: 1.5, stl: 0.5, blk: 0.7, to: 1.1, score: 28.0 } },
  { id: "1631101", name: "Shaedon Sharpe", team: "POR", cost: 2.7, stats: { pts: 15.9, reb: 5.0, ast: 2.9, stl: 0.9, blk: 0.4, to: 1.8, score: 28.0 } },
  { id: "1626156", name: "D'Angelo Russell", team: "LAL", cost: 2.6, stats: { pts: 18.0, reb: 3.1, ast: 6.3, stl: 0.9, blk: 0.5, to: 1.9, score: 32.5 } },
  { id: "1630526", name: "Jalen Suggs", team: "ORL", cost: 2.6, stats: { pts: 12.6, reb: 3.1, ast: 2.7, stl: 1.4, blk: 0.6, to: 2.1, score: 25.0 } },
  { id: "203962", name: "Marcus Smart", team: "MEM", cost: 2.6, stats: { pts: 14.5, reb: 2.7, ast: 4.3, stl: 2.1, blk: 0.3, to: 2.2, score: 29.0 } },
  { id: "203992", name: "Bogdan Bogdanovic", team: "ATL", cost: 2.6, stats: { pts: 16.9, reb: 3.4, ast: 3.1, stl: 1.2, blk: 0.3, to: 1.3, score: 27.0 } },
  { id: "1631093", name: "Jaden Ivey", team: "DET", cost: 2.6, stats: { pts: 15.4, reb: 3.4, ast: 3.8, stl: 0.7, blk: 0.5, to: 2.3, score: 26.0 } },
  { id: "1631095", name: "Jabari Smith Jr.", team: "HOU", cost: 2.6, stats: { pts: 13.7, reb: 8.1, ast: 1.6, stl: 0.7, blk: 0.8, to: 1.2, score: 28.0 } },
  { id: "203952", name: "Andrew Wiggins", team: "GSW", cost: 2.5, stats: { pts: 13.2, reb: 4.5, ast: 1.7, stl: 0.6, blk: 0.6, to: 1.4, score: 24.0 } },
  { id: "1630527", name: "Herbert Jones", team: "NOP", cost: 2.5, stats: { pts: 11.0, reb: 3.6, ast: 2.6, stl: 1.4, blk: 0.8, to: 1.3, score: 22.0 } },
  { id: "1627741", name: "Buddy Hield", team: "GSW", cost: 2.5, stats: { pts: 12.0, reb: 3.2, ast: 2.8, stl: 0.8, blk: 0.5, to: 1.4, score: 22.0 } },
  { id: "1631100", name: "Bennedict Mathurin", team: "IND", cost: 2.5, stats: { pts: 14.5, reb: 4.0, ast: 2.0, stl: 0.6, blk: 0.2, to: 1.7, score: 24.0 } },
  { id: "1627936", name: "Alex Caruso", team: "OKC", cost: 2.4, stats: { pts: 10.1, reb: 3.8, ast: 3.5, stl: 1.7, blk: 1.0, to: 1.3, score: 24.5 } },
  { id: "1629640", name: "Keldon Johnson", team: "SAS", cost: 2.4, stats: { pts: 15.7, reb: 5.5, ast: 2.8, stl: 0.7, blk: 0.1, to: 1.7, score: 28.0 } },
  { id: "1630228", name: "Jonathan Kuminga", team: "GSW", cost: 2.3, stats: { pts: 16.1, reb: 4.8, ast: 2.2, stl: 0.7, blk: 0.5, to: 2.0, score: 26.0 } },
  { id: "1630191", name: "Isaiah Stewart", team: "DET", cost: 2.2, stats: { pts: 10.9, reb: 6.6, ast: 1.6, stl: 0.4, blk: 0.8, to: 1.4, score: 24.0 } },
  { id: "1630583", name: "Santi Aldama", team: "MEM", cost: 2.2, stats: { pts: 10.7, reb: 5.8, ast: 2.3, stl: 0.7, blk: 0.9, to: 1.1, score: 24.0 } },
  { id: "1631110", name: "Jeremy Sochan", team: "SAS", cost: 2.2, stats: { pts: 11.6, reb: 6.4, ast: 3.4, stl: 0.8, blk: 0.5, to: 1.7, score: 25.0 } },
  { id: "1630174", name: "Aaron Nesmith", team: "IND", cost: 2.1, stats: { pts: 12.2, reb: 3.8, ast: 1.5, stl: 0.9, blk: 0.7, to: 0.9, score: 22.0 } },
  { id: "1627827", name: "Dorian Finney-Smith", team: "BKN", cost: 2.1, stats: { pts: 8.5, reb: 4.7, ast: 1.6, stl: 0.8, blk: 0.6, to: 0.9, score: 20.0 } },
  { id: "1630200", name: "Tre Jones", team: "SAS", cost: 2.1, stats: { pts: 10.0, reb: 3.8, ast: 6.2, stl: 1.0, blk: 0.1, to: 1.5, score: 24.0 } },
  { id: "1631109", name: "Mark Williams", team: "CHA", cost: 2.1, stats: { pts: 12.7, reb: 9.7, ast: 1.2, stl: 0.8, blk: 1.1, to: 1.0, score: 28.0 } },
  { id: "1628960", name: "Grayson Allen", team: "PHX", cost: 2.0, stats: { pts: 13.5, reb: 3.9, ast: 3.0, stl: 0.9, blk: 0.6, to: 1.1, score: 26.0 } },
  { id: "1631221", name: "Andrew Nembhard", team: "IND", cost: 2.0, stats: { pts: 9.2, reb: 2.1, ast: 4.1, stl: 0.9, blk: 0.1, to: 1.5, score: 19.0 } },

  // ============================================================
  // TIER 1: FILLERS & SPECIALISTS ($1.0 - $1.9)
  // The crucial "Scrubs" to make the cap math work.
  // ============================================================
  { id: "1630202", name: "Payton Pritchard", team: "BOS", cost: 1.9, stats: { pts: 9.6, reb: 3.2, ast: 3.4, stl: 0.5, blk: 0.1, to: 0.9, score: 19.0 } },
  { id: "1630188", name: "Jalen Smith", team: "IND", cost: 1.9, stats: { pts: 9.9, reb: 5.5, ast: 1.0, stl: 0.3, blk: 0.6, to: 1.1, score: 20.0 } },
  { id: "1629680", name: "Matisse Thybulle", team: "POR", cost: 1.9, stats: { pts: 5.4, reb: 2.1, ast: 1.4, stl: 2.3, blk: 0.9, to: 0.7, score: 18.5 } },
  { id: "1631113", name: "Walker Kessler", team: "UTA", cost: 1.9, stats: { pts: 8.1, reb: 7.5, ast: 0.9, stl: 0.5, blk: 2.4, to: 1.0, score: 24.0 } },
  { id: "1631117", name: "Tari Eason", team: "HOU", cost: 1.9, stats: { pts: 9.8, reb: 7.0, ast: 1.2, stl: 1.4, blk: 0.9, to: 0.8, score: 24.0 } },
  { id: "1630175", name: "Cole Anthony", team: "ORL", cost: 1.8, stats: { pts: 11.6, reb: 3.8, ast: 2.9, stl: 0.8, blk: 0.4, to: 1.8, score: 22.0 } },
  { id: "1626172", name: "Kevon Looney", team: "GSW", cost: 1.8, stats: { pts: 4.5, reb: 5.7, ast: 1.8, stl: 0.4, blk: 0.4, to: 0.7, score: 16.0 } },
  { id: "1629684", name: "Grant Williams", team: "CHA", cost: 1.8, stats: { pts: 8.1, reb: 3.6, ast: 1.7, stl: 0.5, blk: 0.6, to: 1.1, score: 18.0 } },
  { id: "1630180", name: "Saddiq Bey", team: "ATL", cost: 1.8, stats: { pts: 13.7, reb: 6.5, ast: 1.5, stl: 0.8, blk: 0.2, to: 1.3, score: 24.0 } },
  { id: "1631098", name: "Jaden McDaniels", team: "MIN", cost: 1.8, stats: { pts: 10.5, reb: 3.1, ast: 1.4, stl: 0.9, blk: 0.6, to: 1.2, score: 19.0 } },
  { id: "1630172", name: "Patrick Williams", team: "CHI", cost: 1.7, stats: { pts: 10.0, reb: 3.9, ast: 1.5, stl: 0.9, blk: 0.8, to: 1.3, score: 20.0 } },
  { id: "1626166", name: "Cameron Payne", team: "PHI", cost: 1.6, stats: { pts: 9.3, reb: 1.8, ast: 3.1, stl: 0.9, blk: 0.1, to: 1.2, score: 18.0 } },
  { id: "1630198", name: "Isaiah Joe", team: "OKC", cost: 1.5, stats: { pts: 8.2, reb: 2.3, ast: 1.3, stl: 0.6, blk: 0.3, to: 0.6, score: 15.0 } },
  { id: "1630530", name: "Trey Lyles", team: "SAC", cost: 1.5, stats: { pts: 7.2, reb: 4.4, ast: 1.2, stl: 0.3, blk: 0.3, to: 0.9, score: 15.0 } },
  { id: "1630208", name: "Nick Richards", team: "CHA", cost: 1.5, stats: { pts: 9.7, reb: 8.0, ast: 0.8, stl: 0.4, blk: 1.1, to: 0.8, score: 23.0 } },
  { id: "1630173", name: "Precious Achiuwa", team: "NYK", cost: 1.5, stats: { pts: 7.6, reb: 6.6, ast: 1.3, stl: 0.6, blk: 0.9, to: 1.1, score: 20.0 } },
  { id: "1631102", name: "Dyson Daniels", team: "ATL", cost: 1.5, stats: { pts: 5.8, reb: 3.9, ast: 2.7, stl: 1.4, blk: 0.4, to: 0.9, score: 17.0 } },
  { id: "1630686", name: "Simone Fontecchio", team: "DET", cost: 1.5, stats: { pts: 10.5, reb: 3.7, ast: 1.5, stl: 0.7, blk: 0.2, to: 1.3, score: 19.0 } },
  { id: "1630533", name: "Ziaire Williams", team: "MEM", cost: 1.4, stats: { pts: 8.2, reb: 3.5, ast: 1.5, stl: 0.7, blk: 0.2, to: 1.0, score: 16.0 } },
  { id: "1630165", name: "Killian Hayes", team: "DET", cost: 1.3, stats: { pts: 6.9, reb: 2.8, ast: 4.9, stl: 0.9, blk: 0.5, to: 1.4, score: 18.0 } },
  { id: "1629629", name: "Cam Reddish", team: "LAL", cost: 1.3, stats: { pts: 5.4, reb: 2.1, ast: 1.0, stl: 1.0, blk: 0.3, to: 0.7, score: 12.0 } },
  { id: "1630540", name: "Miles McBride", team: "NYK", cost: 1.3, stats: { pts: 8.3, reb: 1.5, ast: 1.7, stl: 0.9, blk: 0.1, to: 0.6, score: 15.0 } },
  { id: "1630573", name: "Aaron Wiggins", team: "OKC", cost: 1.3, stats: { pts: 6.9, reb: 2.4, ast: 1.1, stl: 0.7, blk: 0.2, to: 0.7, score: 13.0 } },
  { id: "1630598", name: "Aaron Wiggins", team: "OKC", cost: 1.3, stats: { pts: 6.9, reb: 2.4, ast: 1.1, stl: 0.7, blk: 0.2, to: 0.7, score: 13.0 } },
  { id: "1630171", name: "Isaac Okoro", team: "CLE", cost: 1.3, stats: { pts: 9.4, reb: 3.0, ast: 1.9, stl: 0.8, blk: 0.5, to: 0.9, score: 18.0 } },
  { id: "1631112", name: "Christian Braun", team: "DEN", cost: 1.3, stats: { pts: 7.3, reb: 3.7, ast: 1.6, stl: 0.5, blk: 0.4, to: 0.8, score: 15.0 } },
  { id: "1629013", name: "Landry Shamet", team: "WAS", cost: 1.2, stats: { pts: 7.1, reb: 1.3, ast: 1.2, stl: 0.5, blk: 0.2, to: 0.8, score: 12.0 } },
  { id: "1629006", name: "Josh Okogie", team: "PHX", cost: 1.2, stats: { pts: 4.6, reb: 2.6, ast: 1.1, stl: 0.8, blk: 0.4, to: 0.8, score: 12.0 } },
  { id: "1630589", name: "Moses Moody", team: "GSW", cost: 1.2, stats: { pts: 8.1, reb: 3.0, ast: 0.9, stl: 0.6, blk: 0.4, to: 0.8, score: 15.0 } },
  { id: "1630546", name: "Day'Ron Sharpe", team: "BKN", cost: 1.2, stats: { pts: 6.8, reb: 6.4, ast: 1.4, stl: 0.4, blk: 0.7, to: 0.9, score: 18.0 } },
  { id: "1629637", name: "Jaxson Hayes", team: "LAL", cost: 1.2, stats: { pts: 4.3, reb: 3.0, ast: 0.5, stl: 0.5, blk: 0.4, to: 0.6, score: 10.0 } },
  { id: "1630631", name: "Jose Alvarado", team: "NOP", cost: 1.2, stats: { pts: 7.1, reb: 2.3, ast: 2.1, stl: 1.1, blk: 0.3, to: 1.0, score: 15.0 } },
  { id: "1630231", name: "KJ Martin", team: "PHI", cost: 1.2, stats: { pts: 3.7, reb: 2.2, ast: 0.9, stl: 0.4, blk: 0.2, to: 0.6, score: 8.0 } },
  { id: "1630227", name: "Day'Ron Sharpe", team: "BKN", cost: 1.2, stats: { pts: 6.8, reb: 6.4, ast: 1.4, stl: 0.4, blk: 0.7, to: 0.9, score: 18.0 } },
  { id: "1630214", name: "Xavier Tillman", team: "BOS", cost: 1.2, stats: { pts: 6.0, reb: 4.6, ast: 1.7, stl: 1.2, blk: 0.5, to: 0.8, score: 18.0 } },
  { id: "1631106", name: "Ochai Agbaji", team: "TOR", cost: 1.2, stats: { pts: 5.8, reb: 2.8, ast: 1.1, stl: 0.6, blk: 0.5, to: 0.7, score: 13.0 } },
  { id: "1631219", name: "Peyton Watson", team: "DEN", cost: 1.2, stats: { pts: 6.7, reb: 3.2, ast: 1.1, stl: 0.5, blk: 1.1, to: 0.9, score: 15.0 } },
  { id: "1631103", name: "Malaki Branham", team: "SAS", cost: 1.2, stats: { pts: 9.2, reb: 2.1, ast: 2.1, stl: 0.4, blk: 0.1, to: 1.3, score: 16.0 } },
  { id: "1630529", name: "Chris Duarte", team: "CHI", cost: 1.1, stats: { pts: 2.5, reb: 1.0, ast: 0.5, stl: 0.2, blk: 0.0, to: 0.6, score: 5.0 } },
  { id: "1630525", name: "Davion Mitchell", team: "TOR", cost: 1.1, stats: { pts: 5.3, reb: 1.3, ast: 1.9, stl: 0.2, blk: 0.0, to: 0.9, score: 10.0 } },
  { id: "1631115", name: "Jaylin Williams", team: "OKC", cost: 1.1, stats: { pts: 4.0, reb: 3.4, ast: 1.6, stl: 0.4, blk: 0.4, to: 0.5, score: 12.0 } },
  { id: "1630225", name: "Isaiah Jackson", team: "IND", cost: 1.1, stats: { pts: 6.5, reb: 4.0, ast: 0.8, stl: 0.6, blk: 1.0, to: 0.9, score: 15.0 } },
  { id: "203493", name: "Reggie Bullock", team: "HOU", cost: 1.0, stats: { pts: 2.2, reb: 1.4, ast: 0.4, stl: 0.3, blk: 0.1, to: 0.3, score: 5.0 } },
  { id: "1630176", name: "Vernon Carey Jr.", team: "WAS", cost: 1.0, stats: { pts: 0.5, reb: 1.0, ast: 0.0, stl: 0.2, blk: 0.2, to: 0.3, score: 3.0 } },
  { id: "1629676", name: "Isaiah Roby", team: "NYK", cost: 1.0, stats: { pts: 4.1, reb: 2.5, ast: 0.9, stl: 0.5, blk: 0.2, to: 0.6, score: 9.0 } },
  { id: "1629685", name: "Dylan Windler", team: "ATL", cost: 1.0, stats: { pts: 1.5, reb: 0.8, ast: 0.5, stl: 0.1, blk: 0.1, to: 0.3, score: 3.0 } },
  { id: "1630177", name: "Theo Maledon", team: "PHX", cost: 1.0, stats: { pts: 4.2, reb: 1.8, ast: 2.5, stl: 0.5, blk: 0.1, to: 1.1, score: 10.0 } },
  { id: "1630235", name: "Trent Forrest", team: "ATL", cost: 1.0, stats: { pts: 2.2, reb: 1.5, ast: 2.4, stl: 0.5, blk: 0.1, to: 0.9, score: 8.0 } },
  { id: "1630240", name: "Saben Lee", team: "PHX", cost: 1.0, stats: { pts: 3.0, reb: 1.3, ast: 1.3, stl: 0.6, blk: 0.1, to: 0.7, score: 7.0 } },
  { id: "1630561", name: "David Duke Jr.", team: "SAS", cost: 1.0, stats: { pts: 1.8, reb: 1.2, ast: 0.8, stl: 0.4, blk: 0.0, to: 0.6, score: 4.0 } },
  { id: "1630547", name: "James Bouknight", team: "CHA", cost: 1.0, stats: { pts: 3.6, reb: 1.1, ast: 0.5, stl: 0.2, blk: 0.1, to: 0.6, score: 7.0 } },
  { id: "1630198", name: "Isaiah Joe", team: "OKC", cost: 1.0, stats: { pts: 8.2, reb: 2.3, ast: 1.3, stl: 0.6, blk: 0.3, to: 0.6, score: 15.0 } }, // Cost Correction to 1.0
  { id: "1630201", name: "Malachi Flynn", team: "DET", cost: 1.0, stats: { pts: 5.5, reb: 1.8, ast: 2.1, stl: 0.5, blk: 0.1, to: 1.2, score: 11.0 } },
  { id: "1630230", name: "Naji Marshall", team: "DAL", cost: 1.0, stats: { pts: 7.1, reb: 3.6, ast: 1.9, stl: 0.7, blk: 0.2, to: 1.0, score: 15.0 } },
  { id: "1630238", name: "Quentin Grimes", team: "DET", cost: 1.0, stats: { pts: 7.0, reb: 2.0, ast: 1.3, stl: 0.7, blk: 0.1, to: 0.9, score: 13.0 } },
  { id: "1630241", name: "Sam Merrill", team: "CLE", cost: 1.0, stats: { pts: 8.0, reb: 2.0, ast: 1.8, stl: 0.3, blk: 0.1, to: 0.6, score: 14.0 } },
  { id: "1630245", name: "Bones Hyland", team: "LAC", cost: 1.0, stats: { pts: 6.9, reb: 1.5, ast: 2.5, stl: 0.7, blk: 0.1, to: 1.4, score: 13.0 } },
  { id: "1630249", name: "Jaden Springer", team: "BOS", cost: 1.0, stats: { pts: 4.0, reb: 1.8, ast: 1.1, stl: 0.8, blk: 0.2, to: 0.7, score: 9.0 } },
  { id: "1630250", name: "Sandro Mamukelashvili", team: "SAS", cost: 1.0, stats: { pts: 4.1, reb: 3.2, ast: 1.1, stl: 0.2, blk: 0.3, to: 0.8, score: 10.0 } },
  { id: "1630256", name: "Keon Johnson", team: "BKN", cost: 1.0, stats: { pts: 6.2, reb: 1.5, ast: 0.9, stl: 0.5, blk: 0.2, to: 0.8, score: 10.0 } },
  { id: "1630264", name: "Anthony Gill", team: "WAS", cost: 1.0, stats: { pts: 3.8, reb: 1.9, ast: 0.7, stl: 0.2, blk: 0.2, to: 0.5, score: 7.0 } },
  { id: "1630267", name: "Facundo Campazzo", team: "DEN", cost: 1.0, stats: { pts: 5.1, reb: 1.8, ast: 3.4, stl: 1.1, blk: 0.4, to: 0.9, score: 15.0 } },
  { id: "1630271", name: "Brodric Thomas", team: "LAC", cost: 1.0, stats: { pts: 1.8, reb: 0.8, ast: 0.4, stl: 0.3, blk: 0.1, to: 0.2, score: 4.0 } },
  { id: "1630273", name: "Freddie Gillespie", team: "TOR", cost: 1.0, stats: { pts: 5.6, reb: 4.9, ast: 0.5, stl: 0.4, blk: 1.0, to: 0.6, score: 14.0 } },
  { id: "1630535", name: "Kai Jones", team: "LAC", cost: 1.0, stats: { pts: 2.7, reb: 2.0, ast: 0.3, stl: 0.2, blk: 0.5, to: 0.5, score: 6.0 } },
  { id: "1630539", name: "Kai Jones", team: "LAC", cost: 1.0, stats: { pts: 2.7, reb: 2.0, ast: 0.3, stl: 0.2, blk: 0.5, to: 0.5, score: 6.0 } }, // Duplicate Removed in real app logic but kept for safety
  { id: "1630541", name: "Moses Brown", team: "POR", cost: 1.0, stats: { pts: 3.4, reb: 3.9, ast: 0.3, stl: 0.1, blk: 0.4, to: 0.5, score: 9.0 } },
  { id: "1630544", name: "Jason Preston", team: "UTA", cost: 1.0, stats: { pts: 1.7, reb: 2.4, ast: 2.3, stl: 0.1, blk: 0.0, to: 0.7, score: 8.0 } },
  { id: "1630550", name: "JT Thor", team: "CHA", cost: 1.0, stats: { pts: 3.2, reb: 2.3, ast: 0.5, stl: 0.2, blk: 0.3, to: 0.6, score: 7.0 } },
  { id: "1630554", name: "Usman Garuba", team: "GSW", cost: 1.0, stats: { pts: 0.5, reb: 1.2, ast: 0.2, stl: 0.2, blk: 0.2, to: 0.3, score: 3.0 } },
  { id: "1630556", name: "Luka Garza", team: "MIN", cost: 1.0, stats: { pts: 4.0, reb: 1.2, ast: 0.2, stl: 0.1, blk: 0.0, to: 0.5, score: 6.0 } },
  { id: "1630558", name: "Charles Bassey", team: "SAS", cost: 1.0, stats: { pts: 3.3, reb: 4.0, ast: 1.1, stl: 0.4, blk: 0.9, to: 0.8, score: 11.0 } },
  { id: "1630563", name: "Joshua Primo", team: "LAC", cost: 1.0, stats: { pts: 1.0, reb: 0.5, ast: 0.0, stl: 0.0, blk: 0.0, to: 0.2, score: 2.0 } },
  { id: "1630568", name: "Luka Samanic", team: "UTA", cost: 1.0, stats: { pts: 4.1, reb: 2.4, ast: 0.4, stl: 0.1, blk: 0.2, to: 0.7, score: 8.0 } },
  { id: "1630572", name: "Sandro Mamukelashvili", team: "SAS", cost: 1.0, stats: { pts: 4.1, reb: 3.2, ast: 1.1, stl: 0.2, blk: 0.3, to: 0.8, score: 10.0 } },
  { id: "1630574", name: "Isaiah Todd", team: "WAS", cost: 1.0, stats: { pts: 1.5, reb: 1.5, ast: 0.5, stl: 0.2, blk: 0.2, to: 0.3, score: 4.0 } },
  { id: "1630580", name: "Jericho Sims", team: "NYK", cost: 1.0, stats: { pts: 2.0, reb: 1.8, ast: 0.4, stl: 0.2, blk: 0.4, to: 0.5, score: 6.0 } },
  { id: "1630586", name: "Usman Garuba", team: "GSW", cost: 1.0, stats: { pts: 0.5, reb: 1.2, ast: 0.2, stl: 0.2, blk: 0.2, to: 0.3, score: 3.0 } },
  { id: "1630587", name: "Isaiah Livers", team: "WAS", cost: 1.0, stats: { pts: 5.0, reb: 2.1, ast: 1.1, stl: 0.6, blk: 0.2, to: 0.6, score: 11.0 } },
  { id: "1630591", name: "Jaden Springer", team: "BOS", cost: 1.0, stats: { pts: 4.0, reb: 1.8, ast: 1.1, stl: 0.8, blk: 0.2, to: 0.7, score: 9.0 } },
  { id: "1630593", name: "Greg Brown III", team: "DAL", cost: 1.0, stats: { pts: 2.5, reb: 1.5, ast: 0.3, stl: 0.3, blk: 0.3, to: 0.4, score: 6.0 } },
  { id: "1630605", name: "Jock Landale", team: "HOU", cost: 1.0, stats: { pts: 4.9, reb: 3.1, ast: 1.2, stl: 0.4, blk: 0.6, to: 0.7, score: 12.0 } },
  { id: "1630613", name: "Duop Reath", team: "POR", cost: 1.0, stats: { pts: 9.1, reb: 3.7, ast: 1.0, stl: 0.5, blk: 0.6, to: 0.8, score: 18.0 } },
  { id: "1630625", name: "Lindy Waters III", team: "OKC", cost: 1.0, stats: { pts: 3.6, reb: 1.1, ast: 0.6, stl: 0.2, blk: 0.2, to: 0.4, score: 7.0 } },
  { id: "1630637", name: "Carlik Jones", team: "CHI", cost: 1.0, stats: { pts: 2.9, reb: 0.7, ast: 0.9, stl: 0.3, blk: 0.0, to: 0.5, score: 5.0 } },
  { id: "1630643", name: "Jay Huff", team: "DEN", cost: 1.0, stats: { pts: 2.5, reb: 1.0, ast: 0.5, stl: 0.2, blk: 0.5, to: 0.4, score: 6.0 } },
  { id: "1630648", name: "Jordan Goodwin", team: "MEM", cost: 1.0, stats: { pts: 6.5, reb: 4.4, ast: 2.7, stl: 0.8, blk: 0.3, to: 1.2, score: 18.0 } },
  { id: "1630656", name: "Terry Taylor", team: "CHI", cost: 1.0, stats: { pts: 1.5, reb: 1.2, ast: 0.3, stl: 0.1, blk: 0.1, to: 0.3, score: 3.0 } },
  { id: "1630658", name: "Micah Potter", team: "UTA", cost: 1.0, stats: { pts: 3.3, reb: 2.7, ast: 0.4, stl: 0.3, blk: 0.4, to: 0.6, score: 8.0 } },
  { id: "1630678", name: "Terry Taylor", team: "CHI", cost: 1.0, stats: { pts: 1.5, reb: 1.2, ast: 0.3, stl: 0.1, blk: 0.1, to: 0.3, score: 3.0 } },
  { id: "1630691", name: "Jamaree Bouyea", team: "SAS", cost: 1.0, stats: { pts: 1.8, reb: 1.3, ast: 1.0, stl: 0.5, blk: 0.0, to: 0.6, score: 5.0 } },
  { id: "1630700", name: "Dragan Bender", team: "MIL", cost: 1.0, stats: { pts: 5.4, reb: 3.9, ast: 1.3, stl: 0.3, blk: 0.6, to: 0.9, score: 13.0 } },
  { id: "1630701", name: "Ante Zizic", team: "CLE", cost: 1.0, stats: { pts: 4.4, reb: 3.0, ast: 0.2, stl: 0.1, blk: 0.2, to: 0.8, score: 8.0 } },
  { id: "1630702", name: "Tyler Dorsey", team: "DAL", cost: 1.0, stats: { pts: 3.0, reb: 0.6, ast: 0.0, stl: 0.0, blk: 0.0, to: 0.4, score: 3.0 } },
  { id: "1630758", name: "Kevin Pangos", team: "CLE", cost: 1.0, stats: { pts: 1.6, reb: 0.2, ast: 1.3, stl: 0.1, blk: 0.0, to: 0.5, score: 4.0 } },
  { id: "1630787", name: "Mamadi Diakite", team: "NYK", cost: 1.0, stats: { pts: 2.0, reb: 1.4, ast: 0.3, stl: 0.2, blk: 0.3, to: 0.4, score: 5.0 } },
  { id: "1630792", name: "Malcolm Hill", team: "CHI", cost: 1.0, stats: { pts: 3.4, reb: 1.8, ast: 0.4, stl: 0.2, blk: 0.1, to: 0.5, score: 6.0 } },
  { id: "1630796", name: "Dru Smith", team: "MIA", cost: 1.0, stats: { pts: 4.3, reb: 1.6, ast: 1.6, stl: 1.0, blk: 0.3, to: 0.9, score: 11.0 } },
  { id: "1630846", name: "Olivier Sarr", team: "OKC", cost: 1.0, stats: { pts: 2.4, reb: 2.4, ast: 0.1, stl: 0.1, blk: 0.4, to: 0.4, score: 6.0 } },
  { id: "1631099", name: "Ousmane Dieng", team: "OKC", cost: 1.0, stats: { pts: 4.0, reb: 1.5, ast: 1.1, stl: 0.2, blk: 0.2, to: 0.8, score: 8.0 } },
  { id: "1631115", name: "Jaylin Williams", team: "OKC", cost: 1.1, stats: { pts: 4.0, reb: 3.4, ast: 1.6, stl: 0.4, blk: 0.4, to: 0.5, score: 12.0 } },
  { id: "1631119", name: "MarJon Beauchamp", team: "MIL", cost: 1.0, stats: { pts: 4.4, reb: 2.1, ast: 0.7, stl: 0.3, blk: 0.1, to: 0.6, score: 8.0 } },
  { id: "1631121", name: "Blake Wesley", team: "SAS", cost: 1.0, stats: { pts: 4.4, reb: 1.5, ast: 2.7, stl: 0.5, blk: 0.1, to: 1.1, score: 10.0 } },
  { id: "1631123", name: "Bryce McGowens", team: "CHA", cost: 1.0, stats: { pts: 5.1, reb: 1.7, ast: 0.9, stl: 0.3, blk: 0.2, to: 0.8, score: 9.0 } },
  { id: "1631128", name: "Christian Koloko", team: "TOR", cost: 1.0, stats: { pts: 3.1, reb: 2.9, ast: 0.5, stl: 0.4, blk: 1.0, to: 0.5, score: 10.0 } },
  { id: "1631222", name: "Caleb Houstan", team: "ORL", cost: 1.0, stats: { pts: 4.3, reb: 1.4, ast: 0.5, stl: 0.2, blk: 0.1, to: 0.5, score: 7.0 } },
];

// HELPER: RANDOM OPPONENTS
const TEAMS = ["LAL", "BOS", "MIA", "GSW", "NYK", "PHI", "DEN", "PHX", "DAL", "CHI"];
const getRandomOpponent = () => {
    const opp = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    const isHome = Math.random() > 0.5;
    return isHome ? `v ${opp}` : `@ ${opp}`;
};

// --- THE FIX: RANDOMIZE STATS FOR GAME LOG ---
const randomizeStat = (val) => {
    if (!val) return 0;
    // Variance between 70% and 130% of average
    const variance = 0.7 + Math.random() * 0.6; 
    const result = Math.floor(val * variance);
    return result < 0 ? 0 : result;
};

export const getPlayerGameLog = (player) => {
    const today = new Date().toLocaleDateString('en-US', {month:'numeric', day:'numeric', year:'2-digit'});
    
    if (!player || !player.stats) {
        return { score: 0, pts:0, reb:0, ast:0, stl:0, blk:0, to:0, matchup: "v OPP", date: today };
    }

    // SIMULATE A LIVE GAME (Variance)
    const pts = randomizeStat(player.stats.pts);
    const reb = randomizeStat(player.stats.reb);
    const ast = randomizeStat(player.stats.ast);
    const stl = randomizeStat(player.stats.stl); // Low numbers might hit 0 or spike
    const blk = randomizeStat(player.stats.blk);
    const to = randomizeStat(player.stats.to);

    // Manual FP Calc based on standard rules (Points=1, Reb=1.2, Ast=1.5, Stl=3, Blk=3, TO=-1)
    // Adjust weights if your scoring engine differs, but this creates the base "Game Score"
    let rawScore = (pts * 1) + (reb * 1.2) + (ast * 1.5) + (stl * 3) + (blk * 3) - (to * 1);
    
    return {
        score: parseFloat(rawScore.toFixed(1)), // This is the LIVE SCORE
        pts, reb, ast, stl, blk, to,
        matchup: getRandomOpponent(),
        date: today,
        is_home: Math.random() > 0.5,
        base_avg: player.stats.score // Save the average for reference
    };
};

export const getAllPlayers = () => {
    return db; 
};