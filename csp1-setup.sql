-- ============================================================
-- Add CSP1 (S&P 500 Tracker) to your portfolio
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Add CSP1 to portfolio table
INSERT INTO portfolio (user_id, asset_name, asset_type, platform, currency, current_value, purchase_value, profit_loss, profit_loss_pct, notes)
VALUES
  ('gabriel', 'CSP1 (S&P 500)', 'ETF', 'IG', 'GBP', 46002.80, 33427.20, 9535.72, 28.52, '76 shares @ 605.30p current')
ON CONFLICT DO NOTHING;

-- 2. Create price history tracking (weekly snapshots)
-- Starting point: today at current price
INSERT INTO price_history_extended (asset_id, asset_name, price, recorded_at, note)
SELECT 
  'csp1' as asset_id,
  'CSP1' as asset_name,
  605.30 as price,
  NOW() as recorded_at,
  'Current: 76 shares at 605.30p' as note
ON CONFLICT DO NOTHING;

-- 3. Verify
SELECT asset_name, current_value, purchase_value, profit_loss, profit_loss_pct
FROM portfolio
WHERE user_id = 'gabriel' AND asset_name LIKE '%CSP1%';
