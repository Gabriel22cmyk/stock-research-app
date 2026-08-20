import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzztwmicedxnqcuvhpxk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bPUO0NkmzLcmR1fsHXqqGA_He3uqNXG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const fetchStocks = async () => {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .order('recommendation_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
  return data || [];
};

export const fetchWatchlist = async () => {
  const { data, error } = await supabase
    .from('watchlist')
    .select('stock_id, stocks(*)')
    .eq('user_id', 'gabriel');
  
  if (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
  return data?.map(item => item.stocks) || [];
};

export const addToWatchlist = async (stockId) => {
  const { data, error } = await supabase
    .from('watchlist')
    .insert([{ user_id: 'gabriel', stock_id: stockId }])
    .select();
  
  if (error) {
    console.error('Error adding to watchlist:', error);
    return null;
  }
  return data;
};

export const removeFromWatchlist = async (stockId) => {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('stock_id', stockId)
    .eq('user_id', 'gabriel');
  
  if (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
  return true;
};

export const fetchRecommendations = async (stockId) => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('stock_id', stockId)
    .order('recommended_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
  return data || [];
};

export const fetchPriceHistory = async (stockId) => {
  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('stock_id', stockId)
    .order('recorded_at', { ascending: true })
    .limit(30);
  
  if (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
  return data || [];
};

export const fetchPortfolio = async () => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('user_id', 'gabriel')
    .order('current_value', { ascending: false });
  
  if (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
  return data || [];
};

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
