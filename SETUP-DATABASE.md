# 🗄️ Database Setup Guide

Your app is ready to go! But first, you need to create the database tables. Don't worry - just follow these 3 simple steps.

## Step 1: Open Supabase Dashboard

Go to: https://supabase.com/auth/sign-in

Login with your account (if you don't have one, create one for free).

## Step 2: Select Your Project

In the dashboard, you'll see your project:
- **Project URL**: https://zzztwmicedxnqcuvhpxk.supabase.co
- **Organization**: (whatever you created it under)

Click on it to open.

## Step 3: Create Tables

On the left sidebar, go to **SQL Editor** → Click **New Query**

Copy and paste the entire contents of `supabase-setup.sql` (in the root of this project) into the editor.

Then click **Run** (or press Ctrl+Enter).

You'll see output like:
```
✓ Creating tables...
✓ Enabling RLS...
✓ Adding sample data...
```

That's it! Your database is now set up with:
- ✅ `stocks` table (5 sample stocks)
- ✅ `watchlist` table (empty, ready for you to add)
- ✅ `recommendations` table (2 sample recommendations)
- ✅ `price_history` table (empty, ready for tracking)

## Step 4: Verify It Works

Run the test:
```bash
node test-supabase.js
```

You should see:
```
✅ Found 5 stocks
✅ Found 2 recommendations
✅ Watchlist has 0 items
✨ All tests passed! Database is working.
```

## Done! 🎉

Your app is ready to run:
```bash
npm run dev
```

Open http://localhost:5173 and you'll see the 5 stocks!

---

### Troubleshooting

**"Permission denied" error?**
- Check you're logged into Supabase
- Make sure you selected the right project

**"Table already exists" error?**
- That's fine! Just means you ran it twice
- The SQL includes `IF NOT EXISTS` so it's safe

**Still not working?**
- Check the browser console (F12 → Console tab)
- Look for red errors
- Verify the Supabase URL and key match in `src/lib/supabaseClient.js`

---

**Questions?** The setup is really that simple. SQL code handles everything - no manual database clicks needed after this point!
