-- ============================================================
-- Add CSP1 price tracking to portfolio
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Add CSP1 to portfolio (if not already there)
INSERT INTO portfolio (user_id, asset_name, asset_type, platform, currency, current_value, purchase_value, profit_loss, profit_loss_pct, notes)
VALUES
  ('gabriel', 'CSP1 (S&P 500)', 'ETF', 'IG', 'GBP', 46002.80, 33427.20, 9535.72, 28.52, '76 shares @ 605.30p current')
ON CONFLICT (user_id, asset_name) DO UPDATE SET
  current_value = 46002.80,
  profit_loss = 9535.72,
  profit_loss_pct = 28.52,
  updated_at = NOW();

-- 2. Create portfolio_price_history table for weekly tracking
CREATE TABLE IF NOT EXISTS portfolio_price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'gabriel',
  asset_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total_value DECIMAL(15, 2),
  profit_loss DECIMAL(15, 2),
  profit_loss_pct DECIMAL(5, 2),
  recorded_at TIMESTAMP DEFAULT NOW(),
  note TEXT
);

-- Enable RLS
ALTER TABLE portfolio_price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on portfolio_price_history" ON portfolio_price_history FOR SELECT USING (true);

-- 3. Insert CSP1 price history (starting points for weekly tracking)
-- Week 0 (Today)
INSERT INTO portfolio_price_history (user_id, asset_name, price, total_value, profit_loss, profit_loss_pct, recorded_at, note)
VALUES
  ('gabriel', 'CSP1', 605.30, 46002.80, 9535.72, 28.52, NOW(), 'Current week')
ON CONFLICT DO NOTHING;

-- 4. Verify
SELECT asset_name, price, profit_loss_pct, recorded_at
FROM portfolio_price_history
WHERE user_id = 'gabriel' AND asset_name = 'CSP1'
ORDER BY recorded_at DESC;
