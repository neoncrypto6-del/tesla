import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nygoldzcmohcfqhdqfzm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ctvtvfAyq55---Mz9R7Skg_O6Dh_Vbz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);