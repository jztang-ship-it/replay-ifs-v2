import { supabase } from '../lib/supabaseClient';

const SALARY_CAP = 15.0;
const MIN_SPEND = 14.00;

const getCost = (p) => parseFloat(p.cost || p.price || 0);

// --- 1. FETCH POOL (Direct Database Access) ---
export const fetchPlayablePool = async () => {
    try {
        // Simple query: Get 100 active players with a cost
        const { data: players, error } = await supabase
            .from('players')
            .select('*')
            .gt('cost', 0)
            .limit(100);

        if (error || !players || players.length === 0) {
            console.error("Dealer: DB Error or Empty.", error);
            return [];
        }
        return players;
    } catch (err) {
        return [];
    }
};

// --- 2. DEAL HAND (Salary Cap Logic) ---
export const dealRealHand = async () => {
    const pool = await fetchPlayablePool();
    if (!pool || pool.length < 5) return null;

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (let attempt = 0; attempt < 50; attempt++) {
        let hand = [];
        let currentCost = 0;
        let available = [...pool];

        for (let i = 0; i < 4; i++) {
            let budgetLeft = SALARY_CAP - currentCost;
            let maxSpend = budgetLeft - ((5 - i - 1) * 0.5);
            let candidates = available.filter(p => getCost(p) <= maxSpend);
            
            if (candidates.length === 0) break;
            
            // 50% chance to pick expensive, 50% random
            candidates.sort((a,b) => getCost(b) - getCost(a));
            let pick = Math.random() > 0.5 && candidates.length > 2 
                ? getRandom(candidates.slice(0, Math.ceil(candidates.length/2))) 
                : getRandom(candidates);

            hand.push(pick);
            currentCost += getCost(pick);
            available = available.filter(p => p.id !== pick.id);
        }

        if (hand.length === 4) {
            let budgetLeft = SALARY_CAP - currentCost;
            let perfectFits = available.filter(p => getCost(p) <= budgetLeft);
            if (perfectFits.length > 0) {
                hand.push(getRandom(perfectFits));
                return hand.map(p => ({ 
                    ...p, 
                    instanceId: `${p.id}-${Date.now()}-${Math.random()}` 
                }));
            }
        }
    }
    return null;
};