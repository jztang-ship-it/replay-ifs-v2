import { supabase } from '../lib/supabaseClient';

// --- CONFIGURATION ---
const CAP_CENTS = 1500;       // $15.00
const MIN_TOTAL_CENTS = 1470; // $14.70
const MAX_ATTEMPTS = 500;     // Retry limit for strict math
const MIN_DB_COST = 100;      // Assume min player cost is $1.00

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
//  THE POSITIONAL SOLVER
//  (Preserves Indices of Held Cards)
// ==========================================================
const solveLineup = (pool, templateHand) => {
    // templateHand is an array of 5: [Player, null, null, Player, null]
    
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        // 1. Create a fresh working copy of the hand
        const hand = [...templateHand];
        
        // 2. Identify which slots are empty (Indices 0-4)
        const emptyIndices = hand.map((p, i) => p === null ? i : -1).filter(i => i !== -1);
        
        // 3. Calculate currently committed budget
        let currentTotal = hand.reduce((sum, p) => sum + (p ? p.costCents : 0), 0);
        let usedIds = new Set(hand.filter(p => p).map(p => p.id));

        // 4. ANCHOR LOGIC (Only if the WHOLE hand was empty to start)
        if (emptyIndices.length === 5) {
            const oranges = pool.filter(p => p.tier === 'ORANGE');
            const purples = pool.filter(p => p.tier === 'PURPLE');
            
            const useOrange = Math.random() < 0.5;
            let anchor = null;

            if (useOrange && oranges.length > 0) {
                anchor = oranges[Math.floor(Math.random() * oranges.length)];
            } else if (purples.length > 0) {
                anchor = purples[Math.floor(Math.random() * purples.length)];
            }

            if (anchor) {
                const randomSlotIndex = Math.floor(Math.random() * 5);
                hand[randomSlotIndex] = anchor;
                usedIds.add(anchor.id);
                currentTotal += anchor.costCents;
                
                const removeIdx = emptyIndices.indexOf(randomSlotIndex);
                if (removeIdx > -1) emptyIndices.splice(removeIdx, 1);
            }
        }

        // 5. FILL REMAINING EMPTY SLOTS
        let possible = true;

        for (let i = 0; i < emptyIndices.length; i++) {
            const slotIndex = emptyIndices[i];
            const slotsLeftToFill = emptyIndices.length - i; 
            const isLastCard = slotsLeftToFill === 1;

            const futureReserve = (slotsLeftToFill - 1) * MIN_DB_COST;
            const maxSpend = CAP_CENTS - currentTotal - futureReserve;
            const maxHelpLater = (slotsLeftToFill - 1) * 600;
            const minSpend = MIN_TOTAL_CENTS - currentTotal - maxHelpLater;

            let actualMin = Math.max(MIN_DB_COST, minSpend);
            let actualMax = maxSpend;

            if (!isLastCard) {
                const idealTotal = 1490;
                const needed = idealTotal - currentTotal;
                const avgNeeded = needed / slotsLeftToFill;
                actualMax = Math.min(actualMax, avgNeeded + 250);
                actualMin = Math.max(actualMin, avgNeeded - 250);
            }

            if (actualMin > actualMax) { possible = false; break; }

            const candidates = pool.filter(p => 
                !usedIds.has(p.id) &&
                p.costCents >= actualMin &&
                p.costCents <= actualMax
            );

            if (candidates.length === 0) { possible = false; break; }

            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            hand[slotIndex] = pick;
            usedIds.add(pick.id);
            currentTotal += pick.costCents;
        }

        // 6. FINAL VALIDATION
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
    const emptyTemplate = Array(5).fill(null);
    return solveLineup(pool, emptyTemplate);
};

export const replaceLineup = async (currentHand, heldIndices) => {
    const pool = await fetchPlayablePool();
    if (!pool) return null;

    // Build Template from Held Indices (Preserving Positions)
    const template = Array(5).fill(null);
    heldIndices.forEach(index => {
        if (currentHand[index]) {
            const poolPlayer = pool.find(p => p.id === currentHand[index].id);
            if (poolPlayer) {
                template[index] = poolPlayer;
            }
        }
    });

    return solveLineup(pool, template);
};