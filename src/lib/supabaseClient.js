import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnhrpwwznzokkfagfumb.supabase.co';
const supabaseKey = 'sb_publishable_WSIZ6R2jgrSe-hXUCMtP8w_lETzweKx';

export const supabase = createClient(supabaseUrl, supabaseKey);