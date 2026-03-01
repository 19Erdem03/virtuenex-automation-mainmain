import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/erdem/virtuenex-automation-mainmain-1/.env.local' });
if (!process.env.VITE_SUPABASE_URL) dotenv.config({ path: '/Users/erdem/virtuenex-automation-mainmain-1/.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
    const { data } = await supabase.from('bookings').select('*, tours(*, properties(title, price)), profiles(full_name, email)').limit(2);
    console.log(JSON.stringify(data, null, 2));
}
run();
