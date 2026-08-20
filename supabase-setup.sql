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

-- Enable RLS (Row Level Security)
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read on stocks" ON stocks FOR SELECT USING (true);
CREATE POLICY "Allow public read on recommendations" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read on price_history" ON price_history FOR SELECT USING (true);
CREATE POLICY "Allow public read on watchlist" ON watchlist FOR SELECT USING (true);

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
