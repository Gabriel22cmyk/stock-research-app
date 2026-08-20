# 🎯 Getting Started - Stock Research App

Welcome! This is your complete guide from zero to deployed. Follow in order.

## Timeline
- **5 min**: Database setup
- **5 min**: Test locally  
- **5 min**: Deploy to Vercel
- **Total**: 15 minutes to live on the web!

---

## 1️⃣ Set Up Database (5 min)

**File**: `SETUP-DATABASE.md`

This creates all your database tables with sample data.

```bash
# Quick summary:
1. Go to https://supabase.com
2. Open your project dashboard
3. Go to SQL Editor
4. Copy entire contents of: supabase-setup.sql
5. Click Run
```

**Verify it worked:**
```bash
node test-supabase.js
# Should show: ✅ Found 5 stocks, 2 recommendations
```

---

## 2️⃣ Test Locally (5 min)

**What you're testing**: Does the React app talk to the database?

```bash
npm run dev
```

Open http://localhost:5173

You should see:
- ✅ Home page with 5 stocks
- ✅ "View Details" button shows recommendations
- ✅ Star icon adds to watchlist
- ✅ "Watchlist" tab shows saved stocks

**Not working?**
- F12 → Console tab (look for red errors)
- Check `DEPLOYMENT.md` troubleshooting

---

## 3️⃣ Deploy to Vercel (5 min)

**File**: `VERCEL-DEPLOY.md`

Gets your app live on the internet.

```bash
# Quick summary:
1. Push to GitHub
2. Connect GitHub repo to Vercel
3. Click Deploy
4. Get live URL
```

After deploy, you'll have a live URL:
```
https://stock-research-app-xxxxx.vercel.app
```

**Test it**: Open that URL. If you see your app working, you're done! 🎉

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `SETUP-DATABASE.md` | Database setup instructions |
| `VERCEL-DEPLOY.md` | How to deploy live |
| `DEPLOYMENT.md` | How the app is structured & how to add features |
| `supabase-setup.sql` | Database schema (run this in SQL Editor) |
| `test-supabase.js` | Verify database connection works |

---

## 🎓 After Deployment

Your app is live! Now what?

### Easy Next Steps:

1. **Add real stock data**
   - Replace sample data with real API (Alpha Vantage, Finnhub)
   - Update `src/lib/supabaseClient.js`

2. **Add alerts/notifications**
   - Email when stock hits target price
   - Use SendGrid or Mailgun

3. **Custom styling**
   - Edit CSS files in `src/styles/`
   - Add your own colors, fonts

4. **More features**
   - User accounts (Supabase Auth)
   - Charts/graphs (recharts library)
   - Mobile app (React Native)

See `DEPLOYMENT.md` for detailed ideas.

---

## 💻 Code Structure

```
src/
├── App.jsx              # Routes (Home, Watchlist)
├── pages/
│   ├── HomePage.jsx     # Latest picks page
│   └── WatchlistPage.jsx # Saved stocks page
├── components/
│   ├── StockCard.jsx    # Single stock display
│   └── StockDetail.jsx  # Detail modal popup
├── lib/
│   └── supabaseClient.js # Database connection (Supabase)
└── styles/              # CSS files

Database (Supabase):
├── stocks
├── watchlist
├── recommendations
└── price_history
```

---

## 🚨 If Something Breaks

1. **Blank page?**
   - Check browser console (F12 → Console)
   - Look for red errors
   - Likely: Supabase key is wrong

2. **Can't connect to database?**
   - Run `node test-supabase.js`
   - If that fails, database isn't set up
   - Follow Step 1 again

3. **Build fails locally?**
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

4. **Deployed but broken?**
   - Check Vercel logs (dashboard → Deployments)
   - Roll back to last working version

---

## ❓ Questions?

Everything is in the code. Each file is simple and readable:
- `src/components/StockCard.jsx` - Shows how to display a stock
- `src/lib/supabaseClient.js` - Shows how to query the database
- `src/pages/HomePage.jsx` - Shows how to fetch and render data

Stuck? Read the code first. Comments explain everything.

---

## ✅ Checklist

- [ ] Database tables created (SETUP-DATABASE.md)
- [ ] App runs locally (`npm run dev`)
- [ ] Stock picks show on home page
- [ ] Watchlist works (add/remove stocks)
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Live URL works
- [ ] Sent URL to Gabriel

**If all checked:** 🎉 You're done! Your app is live and ready for features.

---

**You've built a full-stack web app from scratch. That's real development.**

Now the fun part: Adding features and making it your own!

Happy coding! 🚀
