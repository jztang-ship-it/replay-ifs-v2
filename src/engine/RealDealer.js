import { supabase } from '../lib/supabaseClient'; 

const SALARY_CAP = 15.0;

const getCost = (p) => parseFloat(p.cost || p.price || 0);

// --- 1. FETCH POOL (Linked to Live DB) ---
export const fetchPlayablePool = async () => {
    try {
        const { data: players, error } = await supabase
            .from('players')
            .select('*')
            .eq('active', true)     
            .gt('cost', 0)          
            .order('cost', { ascending: false }); 

        if (error) {
            console.error("Dealer: Supabase Query Error.", error);
            return [];
        }

        if (!players || players.length === 0) {
            console.warn("Dealer: DB Connection successful, but 'players' table is empty.");
            return [];
        }
        
        return players;
    } catch (err) {
        console.error("Dealer: Critical Fetch Error", err);
        return [];
    }
};

// --- 2. DEAL HAND (Salary Cap Logic) ---
export const dealRealHand = async () => {
    const pool = await fetchPlayablePool();
    
    if (!pool || pool.length < 5) {
        console.warn("Dealer: Pool too small to deal.");
        return null;
    }

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
                return hand.map((p, index) => ({ 
                    ...p, 
                    instanceId: `${p.id}-${Date.now()}-${index}` 
                }));
            }
        }
    }
    
    return null;
};