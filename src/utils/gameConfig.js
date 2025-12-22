// GLOBAL GAME CONFIGURATION
// Change 'ACTIVE_SPORT' to switch modes in the future (NBA, NFL, SOCCER)

export const ACTIVE_SPORT = 'NBA';

export const SPORT_CONFIGS = {
  NBA: {
    rosterSize: 5,
    salaryCap: 15.0,
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    // Dynamic Stats Configuration
    statsMap: [
      { key: 'pts', label: 'P', color: 'text-white' },
      { key: 'reb', label: 'R', color: 'text-white' },
      { key: 'ast', label: 'A', color: 'text-white' },
      { key: 'stl', label: 'S', color: 'text-slate-300' },
      { key: 'blk', label: 'B', color: 'text-slate-300' },
      { key: 'to',  label: 'T', color: 'text-red-400' }
    ]
  },
  // Example for future expansion
  SOCCER: {
    rosterSize: 11,
    salaryCap: 25.0,
    positions: ['FW', 'MF', 'MF', 'DF', 'GK'], 
    statsMap: [
      { key: 'gls', label: 'G', color: 'text-green-400' },
      { key: 'ast', label: 'A', color: 'text-blue-400' },
      { key: 'sot', label: 'S', color: 'text-white' },
      { key: 'pass', label: 'P%', color: 'text-slate-300' }
    ]
  }
};

// Helper to get current config
export const getGameConfig = () => SPORT_CONFIGS[ACTIVE_SPORT];