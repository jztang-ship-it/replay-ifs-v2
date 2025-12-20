import { MOCK_PLAYERS } from '../utils/constants';

export const dealExactBudgetHand = (handSize, salaryCap, excludedIds = []) => {
  // 1. Filter out excluded players (e.g. from previous hands if we had that feature)
  const pool = MOCK_PLAYERS.filter(p => !excludedIds.includes(p.id));
  
  let bestHand = [];
  let bestCost = 0;
  
  // Try 2000 times to find a hand that hits the Salary Cap EXACTLY ($15)
  // or as close as possible.
  for (let i = 0; i < 2000; i++) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const candidate = shuffled.slice(0, handSize);
    const cost = candidate.reduce((sum, p) => sum + p.cost, 0);

    // If we hit the cap exactly, return immediately (Best Case)
    if (cost === salaryCap) {
      return candidate;
    }

    // Otherwise, keep track of the best "under budget" hand we found
    if (cost < salaryCap && cost > bestCost) {
      bestCost = cost;
      bestHand = candidate;
    }
  }

  // If we couldn't hit $15 exactly after 2000 tries, return the closest hand we found.
  // With 200 players, we will almost always hit $15.
  return bestHand.length > 0 ? bestHand : pool.slice(0, handSize);
};