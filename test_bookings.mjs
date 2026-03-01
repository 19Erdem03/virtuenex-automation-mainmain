import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const { data, error } = await supabase.from('bookings').select('*, tours (*, properties (title, price)), profiles (full_name, email)');
if (error) console.error(error);
else console.log(data);
