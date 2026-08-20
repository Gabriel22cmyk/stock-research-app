# Stock Research App - Deployment Guide

## 🚀 Quick Start for Gabriel

This is your stock research web app! Here's how it all works:

### 📁 Project Structure

```
stock-research-app/
├── src/
│   ├── components/        # Reusable React components
│   │   ├── StockCard.jsx  # Individual stock display
│   │   └── StockDetail.jsx # Stock detail modal
│   ├── pages/             # Full page components
│   │   ├── HomePage.jsx   # Latest picks
│   │   └── WatchlistPage.jsx # Your watchlist
│   ├── lib/
│   │   └── supabaseClient.js # Database connection
│   ├── styles/            # CSS files
│   └── App.jsx           # Main router
├── package.json          # Dependencies
└── vite.config.js        # Build config
```

### 🛠 Tech Stack

- **Frontend**: React 18 + Vite (super fast bundler)
- **Backend**: Supabase (PostgreSQL database + API)
- **Hosting**: Vercel (serverless deployment)
- **Database**: PostgreSQL (managed by Supabase)

### 🔑 Credentials (Already Set Up)

```
Supabase Project: https://zzztwmicedxnqcuvhpxk.supabase.co
Anon Key: sb_publishable_bPUO0NkmzLcmR1fsHXqqGA_He3uqNXG
```

This key is already in `src/lib/supabaseClient.js` - no manual setup needed!

### 💾 Database Tables

Already created in Supabase:

- **stocks** - Stock picks with current & target prices
- **watchlist** - Your tracked stocks
- **recommendations** - Buy/sell ratings
- **price_history** - Historical price tracking

### 🧪 Testing Locally

```bash
npm run dev
# Open http://localhost:5173
```

You'll see:
- Latest stock picks on the home page
- Click "View Details" for recommendations & price history
- Click the star icon to add/remove from watchlist
- Navigate between "Latest Picks" and "Watchlist"

### 📤 Deploy to Vercel

#### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/stock-research-app.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Connect your GitHub repo
4. Vercel auto-detects it's a Vite project ✓
5. No env vars needed (Supabase key is public/anon-only)
6. Click "Deploy"

Done! Your app is live in ~60 seconds.

### 🔄 Making Changes

After any code changes:
```bash
git add .
git commit -m "Your change description"
git push
# Vercel auto-deploys when you push to main! 🎉
```

### 🎯 Next Steps / Feature Ideas

Easy wins to add later:

1. **Real Stock Prices**
   - Replace hardcoded prices with API call (Alpha Vantage, Finnhub)
   - Add to `src/lib/supabaseClient.js`

2. **Cron Job for Recommendations**
   - Use Vercel Cron or AWS Lambda
   - Insert new stock picks daily into Supabase
   - Update recommendations table

3. **User Authentication**
   - Use Supabase Auth
   - Store per-user watchlists
   - Different users, different picks

4. **Email Alerts**
   - Send daily digests
   - Alert on price milestones
   - Use SendGrid or Mailgun

5. **Better Charts**
   - Install `recharts` or `chart.js`
   - Display price history as graphs
   - Show trends over time

### 📊 Database Queries

Need to see what's in the database?

```bash
# In Supabase Dashboard:
1. Go to https://supabase.com
2. Click your project
3. Go to SQL Editor
4. Paste your query
5. Run it
```

Example:
```sql
SELECT * FROM stocks ORDER BY recommendation_date DESC;
SELECT * FROM watchlist WHERE user_id = 'gabriel';
```

### 🐛 Debugging

**"Blank page?" Check browser console:**
```bash
npm run dev
# Open DevTools (F12)
# Look for errors in Console tab
```

**"Can't connect to Supabase?"**
- Verify key in `src/lib/supabaseClient.js`
- Check Supabase project is active
- Check RLS policies allow public read (already set up)

**"Build fails?"**
```bash
npm install  # Reinstall deps
npm run build # Test build locally
```

### 💡 Code Tips

To add a new page:
```javascript
// 1. Create src/pages/NewPage.jsx
// 2. Import it in App.jsx
// 3. Add a route:
<Route path="/newpage" element={<NewPage />} />
```

To fetch data:
```javascript
// Already set up in src/lib/supabaseClient.js
import { fetchStocks, fetchWatchlist } from '../lib/supabaseClient';

const stocks = await fetchStocks();
```

To add more fields to stocks table:
```sql
-- In Supabase SQL Editor
ALTER TABLE stocks ADD COLUMN new_field TEXT;
```

---

**You've got this!** Questions? Look at the code - it's commented and straightforward. Happy building! 🚀
