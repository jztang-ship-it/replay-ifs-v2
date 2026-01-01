import { supabase } from '../lib/supabaseClient';

// --- CONFIGURATION ---
const CAP_CENTS = 1500;       // $15.00
const MIN_TOTAL_CENTS = 1470; // $14.70
const MAX_ATTEMPTS = 500;     // Retry limit for strict math

// --- HELPERS ---
const toCents = (d) => Math.round(parseFloat(d || 0) * 100);

const cleanCost = (val) => {
    if (val === undefined || val === null) return 0;
    const stringVal = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(stringVal);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};

const getTier = (cost) => {
    if (cost >= 5.0) return 'ORANGE';
    if (cost >= 4.0) return 'PURPLE';
    return 'OTHER';
};

// --- FETCH POOL ---
export const fetchPlayablePool = async () => {
    try {
        const { data: players, error } = await supabase
            .from('players')
            .select('*')
            .eq('active', true);

        if (error) return [];

        return (players || []).map(p => {
            const finalCost = cleanCost(p.cost || p.price);
            return {
                ...p,
                cost: finalCost,
                tier: getTier(finalCost),
                costCents: toCents(finalCost)
            };
        }).filter(p => p.costCents > 0);
    } catch (err) {
        return [];
    }
};

// ==========================================================
//  THE UNIFIED SOLVER
//  (Handles New Game, Zero Holds, and Partial Holds)
// ==========================================================
const solveLineup = (pool, initialHeldCards) => {
    const MIN_DB_COST = 100; // Assume min player is $1.00

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        // 1. SETUP HAND
        let hand = [...initialHeldCards];
        
        // 2. CHECK: DO WE NEED ANCHORS?
        // If the hand is empty (New Game OR Zero Holds selected), we MUST add anchors.
        if (hand.length === 0) {
            const oranges = pool.filter(p => p.tier === 'ORANGE');
            const purples = pool.filter(p => p.tier === 'PURPLE');
            
            // 50/50 Chance
            const useOrange = Math.random() < 0.5;

            if (useOrange && oranges.length > 0) {
                // Option A: 1 Orange
                hand.push(oranges[Math.floor(Math.random() * oranges.length)]);
            } else if (purples.length >= 2) {
                // Option B: 2 Purples (Distinct)
                const p1 = purples[Math.floor(Math.random() * purples.length)];
                const remaining = purples.filter(p => p.id !== p1.id);
                if (remaining.length > 0) {
                    hand.push(p1, remaining[Math.floor(Math.random() * remaining.length)]);
                }
            }
            
            // Critical: If anchors failed (e.g. pool issue), restart loop.
            if (hand.length === 0) continue;
        }

        // 3. FILL REMAINING SLOTS
        let usedIds = new Set(hand.map(p => p.id));
        let currentTotal = hand.reduce((s, p) => s + p.costCents, 0);
        let possible = true;

        // If held cards already broke the budget, give up on this attempt
        if (currentTotal > CAP_CENTS) continue; 

        while (hand.length < 5) {
            const slotsLeft = 5 - hand.length;
            const isLastCard = slotsLeft === 1;

            // Strict Math Constraints (Tunneling)
            // "Don't spend so much we can't afford cheap players for the remaining slots"
            const futureReserve = (slotsLeft - 1) * MIN_DB_COST; 
            const maxSpend = CAP_CENTS - currentTotal - futureReserve;
            
            // "Don't spend so little we can't reach the target even with max players later"
            const maxHelpLater = (slotsLeft - 1) * 600; 
            const minSpend = MIN_TOTAL_CENTS - currentTotal - maxHelpLater;

            let actualMin = Math.max(MIN_DB_COST, minSpend);
            let actualMax = maxSpend;

            // Steering (Aim for perfect landing)
            if (!isLastCard) {
                const idealTotal = 1490;
                const needed = idealTotal - currentTotal;
                const avgNeeded = needed / slotsLeft;
                // Allow +/- 200 cents variance to find players
                actualMax = Math.min(actualMax, avgNeeded + 200);
                actualMin = Math.max(actualMin, avgNeeded - 200);
            }

            if (actualMin > actualMax) { possible = false; break; }

            const candidates = pool.filter(p => 
                !usedIds.has(p.id) &&
                p.costCents >= actualMin &&
                p.costCents <= actualMax
            );

            if (candidates.length === 0) { possible = false; break; }

            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            hand.push(pick);
            usedIds.add(pick.id);
            currentTotal += pick.costCents;
        }

        // 4. FINAL VALIDATION
        if (possible && currentTotal >= MIN_TOTAL_CENTS && currentTotal <= CAP_CENTS) {
            return hand.map((p, idx) => ({ 
                ...p, 
                instanceId: `${p.id}-${Date.now()}-${idx}` 
            }));
        }
    }
    return null;
};

// ==========================================================
//  EXPORTS
// ==========================================================

export const dealRealHand = async () => {
    const pool = await fetchPlayablePool();
    if (!pool || pool.length < 5) return null;
    // Pass empty array -> Triggers Anchor Logic
    return solveLineup(pool, []);
};

export const replaceLineup = async (currentHand, heldCardsInput) => {
    const pool = await fetchPlayablePool();
    if (!pool) return null;

    // Filter out any null/undefined IDs
    const validHeld = (heldCardsInput || []).filter(c => c && c.id);
    
    // Re-hydrate held cards from pool (Fixes cost bugs from UI state)
    const heldCards = validHeld
        .map(h => pool.find(p => p.id === h.id) || h) 
        .filter(p => p.costCents > 0);

    // If heldCards is empty (Zero Holds), solveLineup sees [] and forces Anchors.
    // If heldCards has cards (Partial), solveLineup respects them and fills the rest.
    return solveLineup(pool, heldCards);
};