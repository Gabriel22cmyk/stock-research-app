# 📈 Stock Research Dashboard

A modern web app to track stock picks, build watchlists, and stay on top of market opportunities.

**Built with:** React + Supabase + Vercel

## 🎯 Features

✅ **Latest Stock Picks** - See recommended stocks with current & target prices  
✅ **Watchlist** - Save and track your favorite stocks  
✅ **Price Tracking** - View historical price data  
✅ **Recommendations** - Read analyst ratings and insights  
✅ **Real-time Updates** - Prices sync with your Supabase database  

## 🚀 Quick Start

### Run Locally
```bash
npm install
npm run dev
```
Visit http://localhost:5173

### Deploy to Vercel
```bash
git push  # Push to GitHub first
```
Then connect your repo in Vercel dashboard. Auto-deploys on every push!

## 📊 Database

Uses Supabase PostgreSQL. Tables:
- `stocks` - Stock picks
- `watchlist` - User watchlist
- `recommendations` - Buy/sell ratings
- `price_history` - Historical prices

See `DEPLOYMENT.md` for full setup guide.

## 📁 Project Structure

```
src/
├── components/     # Reusable React components
├── pages/          # Page components (Home, Watchlist)
├── lib/            # Supabase client & utilities
├── styles/         # CSS
└── App.jsx         # Router & main app
```

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Backend | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Styling | CSS3 |

## 📚 Learn More

- [React Docs](https://react.dev)
- [Supabase Guide](https://supabase.com/docs)
- [Vercel Deploy](https://vercel.com/docs)
- See `DEPLOYMENT.md` for detailed setup

## 🎓 For Gabriel

This project is built to teach you full-stack development:
- **Frontend**: React components, hooks, routing
- **Backend**: Database design, APIs, real-time sync
- **DevOps**: Git, GitHub, continuous deployment

Start small, iterate fast, ship often. You've got this! 🚀

---

**Status**: Live on Vercel  
**Last Updated**: 2026-08-20
