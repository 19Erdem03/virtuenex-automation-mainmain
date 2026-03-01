import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const { data, error } = await supabase.from('bookings').select('*, tours (*, properties (title, price)), profiles (full_name, email)');
console.log(error || JSON.stringify(data, null, 2));
