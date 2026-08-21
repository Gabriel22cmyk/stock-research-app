-- Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  current_price DECIMAL(10, 2),
  target_price DECIMAL(10, 2),
  recommendation_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'gabriel',
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, stock_id)
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  recommendation_text TEXT,
  rating VARCHAR(20),
  recommended_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create price_history table for tracking
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'gabriel',
  asset_name TEXT NOT NULL,
  asset_type VARCHAR(50),
  platform VARCHAR(100),
  currency VARCHAR(3) DEFAULT 'GBP',
  current_value DECIMAL(15, 2),
  purchase_value DECIMAL(15, 2),
  profit_loss DECIMAL(15, 2),
  profit_loss_pct DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'gabriel',
  property_name TEXT NOT NULL,
  address TEXT,
  postcode VARCHAR(20),
  location TEXT,
  property_type VARCHAR(50),
  bedrooms INT,
  current_value DECIMAL(15, 2),
  equity DECIMAL(15, 2),
  mortgage_remaining DECIMAL(15, 2) DEFAULT 0,
  owned_outright BOOLEAN DEFAULT FALSE,
  monthly_income DECIMAL(10, 2) DEFAULT 0,
  monthly_mortgage DECIMAL(10, 2) DEFAULT 0,
  management_company TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read on stocks" ON stocks FOR SELECT USING (true);
CREATE POLICY "Allow public read on recommendations" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read on price_history" ON price_history FOR SELECT USING (true);
CREATE POLICY "Allow public read on watchlist" ON watchlist FOR SELECT USING (true);
CREATE POLICY "Allow public read on portfolio" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Allow public read on properties" ON properties FOR SELECT USING (true);

-- Insert sample data
INSERT INTO stocks (symbol, company_name, current_price, target_price) VALUES
('AAPL', 'Apple Inc.', 185.50, 195.00),
('MSFT', 'Microsoft Corporation', 380.25, 400.00),
('GOOGL', 'Alphabet Inc.', 142.80, 160.00),
('AMZN', 'Amazon.com Inc.', 175.40, 185.00),
('TSLA', 'Tesla Inc.', 245.30, 280.00)
ON CONFLICT (symbol) DO NOTHING;

-- Insert sample recommendations
INSERT INTO recommendations (stock_id, recommendation_text, rating) 
SELECT id, 'Strong buy - excellent growth potential', 'Strong Buy' FROM stocks WHERE symbol = 'AAPL'
ON CONFLICT DO NOTHING;

INSERT INTO recommendations (stock_id, recommendation_text, rating) 
SELECT id, 'Good entry point after recent dip', 'Buy' FROM stocks WHERE symbol = 'MSFT'
ON CONFLICT DO NOTHING;

-- Insert sample portfolio data
INSERT INTO portfolio (user_id, asset_name, asset_type, platform, currency, current_value, purchase_value, profit_loss, profit_loss_pct, notes)
VALUES
  ('gabriel', 'Vanguard FTSE 100', 'ETF', 'Vanguard', 'GBP', 45000, 42000, 3000, 7.14, 'Core UK equity holding'),
  ('gabriel', 'S&P 500 Tracker', 'ETF', 'iShares', 'GBP', 78500, 72000, 6500, 9.03, 'US market exposure'),
  ('gabriel', 'Premium Bonds', 'Premium Bonds', 'NS&I', 'GBP', 25000, 25000, 0, 0, 'No guaranteed return'),
  ('gabriel', 'Bitcoin', 'Cryptocurrency', 'Kraken', 'GBP', 12400, 8000, 4400, 55, 'High volatility'),
  ('gabriel', 'Growth Fund', 'Unit Trust', 'Schroders', 'GBP', 35600, 30000, 5600, 18.67, 'Balanced growth')
ON CONFLICT DO NOTHING;

-- Insert sample properties data
INSERT INTO properties (user_id, property_name, address, postcode, location, property_type, bedrooms, current_value, equity, mortgage_remaining, owned_outright, monthly_income, monthly_mortgage, management_company, notes)
VALUES
  ('gabriel', '17 Meadow Way', '17 Meadow Way', 'OX12 0GY', 'Hanney', 'Detached House', 4, 425000, 325000, 100000, FALSE, 2100, 450, 'Green & Co', 'Primary rental property'),
  ('gabriel', '132 Cornbrash Rise', '132 Cornbrash Rise', 'BA14 7TT', 'Hillperton', 'Semi-Detached', 3, 285000, 285000, 0, TRUE, 1650, 0, 'Ian Bramley', 'Fully owned investment property')
ON CONFLICT DO NOTHING;
