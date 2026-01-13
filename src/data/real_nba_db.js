import { supabase } from '../lib/supabaseClient';

export const fetchRealGameLog = async (playerId) => {
    try {
        const { data, error } = await supabase
            .from('game_logs')
            .select('*')
            .eq('player_id', playerId);

        if (error) throw error;
        
        // Fallback if no data found
        if (!data || data.length === 0) {
            return { 
                pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, turnovers: 0, 
                game_date: 'NO DATA', 
                matchup: 'N/A' 
            };
        }

        // Pick Random Game
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomGame = data[randomIndex];

        return {
            pts: Number(randomGame.pts),
            reb: Number(randomGame.reb),
            ast: Number(randomGame.ast),
            stl: Number(randomGame.stl),
            blk: Number(randomGame.blk),
            turnovers: Number(randomGame.turnovers),
            game_date: randomGame.game_date,
            matchup: randomGame.matchup || 'vs OPP'
        };

    } catch (err) {
        console.error("Log Fetch Error:", err);
        return { 
            pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, turnovers: 0, 
            game_date: 'ERROR', 
            matchup: 'ERR' 
        };
    }
};