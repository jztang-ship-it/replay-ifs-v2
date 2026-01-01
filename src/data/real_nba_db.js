import { supabase } from '../lib/supabaseClient';

export const fetchRealGameLog = async (playerId) => {
    try {
        const { data } = await supabase
            .from('game_logs')
            .select('*')
            .eq('player_id', playerId)
            .limit(20);

        if (!data || data.length === 0) {
            // Safety Fallback: Return zeroes if no data exists yet
            return { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, turnovers: 0, game_date: 'NO DATA' };
        }

        const log = data[Math.floor(Math.random() * data.length)];
        return {
            ...log,
            pts: parseFloat(log.pts || 0),
            reb: parseFloat(log.reb || 0),
            ast: parseFloat(log.ast || 0),
            stl: parseFloat(log.stl || 0),
            blk: parseFloat(log.blk || 0),
            turnovers: parseFloat(log.turnovers || 0)
        };
    } catch (err) {
        return { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, turnovers: 0 };
    }
};