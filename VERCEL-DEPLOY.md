# 🚀 Deploy to Vercel (Live on the Web!)

Your app is built and ready. Here's how to get it live in 5 minutes.

## Prerequisites

✅ Database set up (completed `SETUP-DATABASE.md`)  
✅ App runs locally (`npm run dev` works)  
✅ Code committed to git

## Step 1: Push to GitHub

If you don't have GitHub yet:
1. Go to https://github.com/signup (free account)
2. Create it

Then:

```bash
# Go into your project folder
cd /data/.openclaw/workspace/stock-research-app

# Create new repo on GitHub (get the URL from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/stock-research-app.git

# Rename branch to 'main' (Vercel likes this)
git branch -M main

# Push your code
git push -u origin main
```

**✓ Your code is now on GitHub!**

## Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Paste your GitHub URL
5. Click **Import**

Vercel automatically detects:
- ✅ It's a Vite project
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`

No environment variables needed! (Supabase key is already in your code)

6. Click **Deploy**

That's it! Vercel is now building your app. You'll see:
```
✓ Building...
✓ Optimizing...
✓ Finalizing...
✓ Live!
```

Takes about 60 seconds.

## You're Live! 🎉

Vercel gives you a URL like:
```
https://stock-research-app-abc123.vercel.app
```

**Save this URL** - send it to anyone!

## Auto-Deploy Magic

Now whenever you push to GitHub:
```bash
git add .
git commit -m "Add new feature"
git push  # Vercel automatically deploys!
```

No more manual deployments. Just code → git push → live. That's the dream.

## Custom Domain (Optional)

Want your own domain like `stocks.yourname.com`?

In Vercel dashboard:
1. Click your project
2. Go to **Settings → Domains**
3. Add your domain
4. Update your DNS records (instructions provided)
5. Done!

## Monitoring & Logs

**See what's deployed:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click **Deployments** to see history
4. Click any deployment to see logs

**Something broke?**
1. Check the deployment logs
2. Look at browser console (F12)
3. Common issue: Supabase key invalid
   - Check `src/lib/supabaseClient.js` matches your project

## Rollback (Oops)

If you broke something:
1. Go to **Deployments**
2. Click the last good deployment
3. Click **Promote to Production**

Done! Instantly back to the working version.

---

**Your app is now on the live internet!** Share the URL with Gabriel, friends, anyone. It's real and it's yours. 🌐

Next step: Add real stock data and features! See `DEPLOYMENT.md` for ideas.
