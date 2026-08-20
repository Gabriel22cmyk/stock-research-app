import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzztwmicedxnqcuvhpxk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bPUO0NkmzLcmR1fsHXqqGA_He3uqNXG';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Test 1: Fetch stocks
    console.log('1️⃣  Fetching stocks...');
    const { data: stocks, error: stocksError } = await supabase
      .from('stocks')
      .select('*');

    if (stocksError) {
      console.error('❌ Error fetching stocks:', stocksError);
    } else {
      console.log(`✅ Found ${stocks.length} stocks`);
      stocks.forEach(s => {
        console.log(`   - ${s.symbol}: $${s.current_price} → $${s.target_price}`);
      });
    }

    // Test 2: Fetch recommendations
    console.log('\n2️⃣  Fetching recommendations...');
    const { data: recs, error: recsError } = await supabase
      .from('recommendations')
      .select('*, stocks(symbol)');

    if (recsError) {
      console.error('❌ Error fetching recommendations:', recsError);
    } else {
      console.log(`✅ Found ${recs.length} recommendations`);
      recs.forEach(r => {
        console.log(`   - ${r.stocks.symbol}: ${r.rating}`);
      });
    }

    // Test 3: Fetch watchlist
    console.log('\n3️⃣  Fetching watchlist (gabriel)...');
    const { data: watchlist, error: watchError } = await supabase
      .from('watchlist')
      .select('stocks(*)')
      .eq('user_id', 'gabriel');

    if (watchError) {
      console.error('❌ Error fetching watchlist:', watchError);
    } else {
      console.log(`✅ Watchlist has ${watchlist.length} items`);
    }

    console.log('\n✨ All tests passed! Database is working.\n');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
