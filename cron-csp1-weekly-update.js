#!/usr/bin/env node

/**
 * CSP1 Weekly Price Tracker
 * Fetches live CSP1 price, calculates portfolio value, logs to database
 * Runs every Monday at 09:00 UTC via cron
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zzztwmicedxnqcuvhpxk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY not set in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CSP1 holdings
const SHARES = 76;
const COST_BASIS = 33427.20;
const USER_ID = 'gabriel';

/**
 * Fetch CSP1 price from Yahoo Finance
 * CSP1 ticker on LSE
 */
async function fetchCSP1Price() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'query1.finance.yahoo.com',
      path: '/v10/finance/quoteSummary/CSP1.L?modules=price',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const price = json.quoteSummary.result[0].price.regularMarketPrice.raw;
          resolve(price);
        } catch (e) {
          reject(new Error(`Failed to parse Yahoo Finance response: ${e.message}`));
        }
      });
    }).on('error', reject).end();
  });
}

/**
 * Calculate portfolio metrics
 */
function calculateMetrics(price) {
  const totalValue = price * SHARES;
  const profitLoss = totalValue - COST_BASIS;
  const profitLossPct = (profitLoss / COST_BASIS) * 100;
  
  return {
    price: parseFloat(price.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    profitLoss: parseFloat(profitLoss.toFixed(2)),
    profitLossPct: parseFloat(profitLossPct.toFixed(2))
  };
}

/**
 * Log price snapshot to database
 */
async function logPriceSnapshot(metrics) {
  const { error } = await supabase
    .from('portfolio_price_history')
    .insert([{
      user_id: USER_ID,
      asset_name: 'CSP1',
      price: metrics.price,
      total_value: metrics.totalValue,
      profit_loss: metrics.profitLoss,
      profit_loss_pct: metrics.profitLossPct,
      note: `Weekly snapshot: ${SHARES} shares @ £${metrics.price}`
    }]);

  if (error) throw error;
  return true;
}

/**
 * Update portfolio current values
 */
async function updatePortfolio(metrics) {
  const { error } = await supabase
    .from('portfolio')
    .update({
      current_value: metrics.totalValue,
      profit_loss: metrics.profitLoss,
      profit_loss_pct: metrics.profitLossPct
    })
    .eq('user_id', USER_ID)
    .eq('asset_name', 'CSP1');

  if (error) throw error;
  return true;
}

/**
 * Main runner
 */
async function run() {
  try {
    console.log(`[${new Date().toISOString()}] Fetching CSP1 price...`);
    const price = await fetchCSP1Price();
    console.log(`[${new Date().toISOString()}] CSP1 price: £${price}`);

    const metrics = calculateMetrics(price);
    console.log(`[${new Date().toISOString()}] Calculated:`, metrics);

    await logPriceSnapshot(metrics);
    console.log(`[${new Date().toISOString()}] Logged to price_history`);

    await updatePortfolio(metrics);
    console.log(`[${new Date().toISOString()}] Updated portfolio`);

    console.log(`[${new Date().toISOString()}] ✓ CSP1 weekly update complete`);
    console.log(`  Price: £${metrics.price}`);
    console.log(`  Value: £${metrics.totalValue}`);
    console.log(`  Profit: £${metrics.profitLoss} (${metrics.profitLossPct}%)`);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ERROR:`, error.message);
    process.exit(1);
  }
}

run();
