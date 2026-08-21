-- ============================================================
-- Update 17 Meadow Way with complete utility & council details
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

UPDATE properties
SET
  address = '17 Meadow Way, West Hanney, Wantage, Oxfordshire OX12 0GY',
  postcode = 'OX12 0GY',
  location = 'Hanney',
  property_name = '17 Meadow Way, Hanney',
  notes = 'Completion: 28/7/23 | Council Tax: 0345 302 2315 (Vale Council) | 
Utilities:
- Electricity: E.ON Next (SN: SN22J0351862)
- Gas: E.ON (SN: EBS15209192161)
- Water: Thames Water 01782401140 (Ref: 24345855, SN: 311989623)'
WHERE user_id = 'gabriel' AND property_name LIKE '%17 Meadow%';

-- Verify
SELECT property_name, address, notes FROM properties WHERE user_id = 'gabriel' AND address LIKE '%Meadow%';
