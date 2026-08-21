-- ============================================================
-- MIGRATION: Add address/postcode + update your real properties
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Add address and postcode columns (safe if they already exist)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS postcode VARCHAR(20);

-- 2. Update Property 1 → 17 Meadow Way (Green & Co, Hanney)
UPDATE properties
SET
  property_name = '17 Meadow Way',
  address = '17 Meadow Way',
  postcode = 'OX12 0GY',
  location = 'Hanney',
  management_company = 'Green & Co'
WHERE property_name = 'Property 1' AND user_id = 'gabriel';

-- 3. Update Property 2 → 132 Cornbrash Rise (Ian Bramley, Hillperton)
UPDATE properties
SET
  property_name = '132 Cornbrash Rise',
  address = '132 Cornbrash Rise',
  postcode = 'BA14 7TT',
  location = 'Hillperton',
  management_company = 'Ian Bramley'
WHERE property_name = 'Property 2' AND user_id = 'gabriel';

-- 4. Verify results
SELECT property_name, address, postcode, location, management_company
FROM properties
WHERE user_id = 'gabriel'
ORDER BY property_name;
