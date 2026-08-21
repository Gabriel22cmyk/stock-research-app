import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzztwmicedxnqcuvhpxk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bPUO0NkmzLcmR1fsHXqqGA_He3uqNXG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', 'gabriel');

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data || [];
};
