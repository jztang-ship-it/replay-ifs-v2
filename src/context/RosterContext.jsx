import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // <--- This must match Step 1 path

const RosterContext = createContext();

export function RosterProvider({ children }) {
  const [dbPlayers, setDbPlayers] = useState([]);
  const [isRosterLoading, setIsRosterLoading] = useState(true);

  useEffect(() => {
    async function fetchMasterRoster() {
        console.log("🏀 RosterProvider: Fetching...");
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .gt('cost', 0)
            .order('cost', { ascending: false });

        if (error) console.error("❌ Error:", error);
        if (data) {
            console.log(`✅ Cached ${data.length} players.`);
            setDbPlayers(data);
        }
        setIsRosterLoading(false);
    }
    fetchMasterRoster();
  }, []);

  return (
    <RosterContext.Provider value={{ dbPlayers, isRosterLoading }}>
      {children}
    </RosterContext.Provider>
  );
}

export function useRoster() {
  return useContext(RosterContext);
}