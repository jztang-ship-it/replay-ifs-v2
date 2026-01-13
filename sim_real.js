// ==========================================================
// 1. SETUP & IMPORTS
// ==========================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnhrpwwznzokkfagfumb.supabase.co';
const supabaseKey = 'sb_publishable_WSIZ6R2jgrSe-hXUCMtP8w_lETzweKx';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================================
// 2. SCORING LOGIC (With Bonus Tracking)
// ==========================================================
const calculateScore = (stats, trackers) => {
    if (!stats) return 0;

    const pts = parseFloat(stats.pts || 0);
    const reb = parseFloat(stats.reb || 0);
    const ast = parseFloat(stats.ast || 0);
    const stl = parseFloat(stats.stl || 0);
    const blk = parseFloat(stats.blk || 0);
    const tov = parseFloat(stats.turnovers || stats.tov || 0);

    let score = (pts * 1) + (reb * 1.25) + (ast * 1.5) + (stl * 2) + (blk * 2) - (tov * 0.5);

    // --- TRACKING BONUSES ---
    
    // A. POINTS
    if (pts >= 50) { score += 10; trackers.godMode++; }
    else if (pts >= 40) { score += 5; trackers.fire++; }
    else if (pts >= 30) { score += 2; trackers.bucket++; }

    // B. REBOUNDS
    if (reb >= 15) { score += 5; trackers.beast++; }
    else if (reb >= 12) { score += 3; trackers.glass++; }

    // C. ASSISTS
    if (ast >= 15) { score += 5; trackers.wizard++; }
    else if (ast >= 12) { score += 3; trackers.dime++; }

    // D. DEFENSE
    if (stl >= 5) { score += 4; trackers.thief++; }
    if (blk >= 5) { score += 4; trackers.swat++; }
    if ((stl + blk) >= 6) { score += 4; trackers.lock++; }

    // E. MILESTONES
    let doubleDigitCount = 0;
    if (pts >= 10) doubleDigitCount++;
    if (reb >= 10) doubleDigitCount++;
    if (ast >= 10) doubleDigitCount++;
    if (stl >= 10) doubleDigitCount++;
    if (blk >= 10) doubleDigitCount++;

    // 5x5
    if (pts>=5 && reb>=5 && ast>=5 && stl>=5 && blk>=5) {
        score += 15;
        trackers.fiveByFive++;
    }

    // Multi-Doubles
    if (doubleDigitCount >= 4) { score += 50; trackers.quad++; }
    else if (doubleDigitCount >= 3) { score += 8; trackers.triple++; }
    else if (doubleDigitCount >= 2) { score += 2; trackers.double++; }

    return Math.round(score * 10) / 10;
};

// ==========================================================
// 3. DEALER LOGIC (Standard)
// ==========================================================
const solveLineup = (pool) => {
    const CAP_CENTS = 1500;
    const MIN_TOTAL_CENTS = 1470;
    
    for (let i = 0; i < 50; i++) {
        let hand = [];
        const oranges = pool.filter(p => p.tier === 'ORANGE');
        const purples = pool.filter(p => p.tier === 'PURPLE');
        
        if (Math.random() < 0.5 && oranges.length > 0) {
            hand.push(oranges[Math.floor(Math.random() * oranges.length)]);
        } else if (purples.length >= 2) {
            const p1 = purples[Math.floor(Math.random() * purples.length)];
            const remaining = purples.filter(p => p.id !== p1.id);
            if (remaining.length > 0) hand.push(p1, remaining[Math.floor(Math.random() * remaining.length)]);
        }
        
        if (hand.length === 0) continue;

        let usedIds = new Set(hand.map(p => p.id));
        let currentTotal = hand.reduce((s, p) => s + p.costCents, 0);
        let possible = true;

        while (hand.length < 5) {
            const slotsLeft = 5 - hand.length;
            const maxSpend = CAP_CENTS - currentTotal - ((slotsLeft - 1) * 100);
            const minSpend = MIN_TOTAL_CENTS - currentTotal - ((slotsLeft - 1) * 600);
            let actualMin = Math.max(100, minSpend);
            let actualMax = maxSpend;

            if (slotsLeft > 1) {
                const avg = (1490 - currentTotal) / slotsLeft;
                actualMax = Math.min(actualMax, avg + 200);
                actualMin = Math.max(actualMin, avg - 200);
            }

            if (actualMin > actualMax) { possible = false; break; }

            const candidates = pool.filter(p => !usedIds.has(p.id) && p.costCents >= actualMin && p.costCents <= actualMax);
            if (candidates.length === 0) { possible = false; break; }

            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            hand.push(pick);
            usedIds.add(pick.id);
            currentTotal += pick.costCents;
        }

        if (possible && currentTotal >= MIN_TOTAL_CENTS && currentTotal <= CAP_CENTS) return hand;
    }
    return null;
};

// ==========================================================
// 4. MAIN RUN
// ==========================================================
const run = async () => {
    console.log("🔌 Connecting...");
    const { data: players } = await supabase.from('players').select('*').eq('active', true);
    const { data: logs } = await supabase.from('game_logs').select('player_id, pts, reb, ast, stl, blk, turnovers').limit(10000);

    if (!players || !logs) return console.error("❌ DB Error");

    const pool = players.map(p => {
        const cost = parseFloat(p.cost || p.price || 0);
        let tier = 'OTHER';
        if (cost >= 5.0) tier = 'ORANGE';
        else if (cost >= 4.0) tier = 'PURPLE';
        return { ...p, cost, costCents: Math.round(cost * 100), tier };
    }).filter(p => p.costCents > 0);

    const logsMap = {};
    logs.forEach(log => {
        if (!logsMap[log.player_id]) logsMap[log.player_id] = [];
        logsMap[log.player_id].push(log);
    });

    console.log(`✅ Ready. Simulating 10,000 Hands...`);

    // --- STAT TRACKERS ---
    const trackers = {
        godMode: 0, fire: 0, bucket: 0, // Pts
        beast: 0, glass: 0,             // Reb
        wizard: 0, dime: 0,             // Ast
        thief: 0, swat: 0, lock: 0,     // Def
        fiveByFive: 0,
        quad: 0, triple: 0, double: 0
    };

    const results = [];
    
    for (let i = 0; i < 10000; i++) {
        const hand = solveLineup(pool);
        if (!hand) continue;

        let handScore = 0;
        hand.forEach(player => {
            const playerLogs = logsMap[player.id];
            let statLine = { pts: 5, reb: 2, ast: 1, stl: 0, blk: 0, tov: 1 };
            if (playerLogs && playerLogs.length > 0) {
                statLine = playerLogs[Math.floor(Math.random() * playerLogs.length)];
            }
            // Pass trackers to accumulate stats
            handScore += calculateScore(statLine, trackers);
        });
        results.push(Math.round(handScore * 10) / 10);
    }

    results.sort((a, b) => a - b);
    const getPercentile = (p) => results[Math.floor(results.length * p)];

    console.log("\n📊 --- BONUS FREQUENCY (Per 50,000 Player Games) ---");
    console.log(`🔥 50+ Pts (God Mode):  ${trackers.godMode}`);
    console.log(`🏀 40+ Pts (Fire):      ${trackers.fire}`);
    console.log(`👑 Triple Doubles:      ${trackers.triple}`);
    console.log(`🦖 Quad Doubles:        ${trackers.quad}`);
    console.log(`🖐️ 5x5 Club:            ${trackers.fiveByFive}`);
    console.log("------------------------------------------------");
    
    console.log("\n🏆 --- RECOMMENDED LINES (Based on Bonuses) ---");
    console.log(`30x Win:  ${getPercentile(0.995)}+`);
    console.log(`10x Win:  ${getPercentile(0.98)}+`);
    console.log(`5x Win:   ${getPercentile(0.92)}+`);
    console.log(`1.5x Win: ${getPercentile(0.80)}+`);
    console.log(`Safety:   ${getPercentile(0.55)}+`);
};

run();