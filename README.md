# Daily Accountability Dashboard

A personal dashboard for tracking resolutions, daily reflection, and to-dos — designed to be your browser homepage.

## Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
# In your terminal:
cd accountability-dashboard
git init
git add .
git commit -m "Initial commit"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/accountability-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New → Project"**
3. Import your `accountability-dashboard` repo
4. Click **Deploy** — no configuration needed, Vercel auto-detects Next.js
5. Your dashboard will be live at `https://accountability-dashboard.vercel.app` (or similar)

### Step 3: Set as browser homepage

**Chrome:**
1. Settings → On startup → Open a specific page
2. Add your Vercel URL

**Safari:**
1. Preferences → General → Homepage
2. Paste your Vercel URL
3. Set "New windows/tabs open with" → Homepage

**Firefox:**
1. Settings → Home → Homepage and new windows
2. Select "Custom URLs" and paste your Vercel URL

**Arc:**
1. Settings → General → New Tab Page → Custom URL

## Local development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## How it works

- **Data persistence**: All data is stored in your browser's `localStorage` — nothing is sent to a server. Your data stays on your device.
- **Resolutions**: Add one new resolution per month. They accumulate (Jan has 1, Dec has 12). Each can have a custom day-of-week schedule.
- **Daily Reflection**: 80/20 mix of atomic-habits behaviour-change prompts and gratitude prompts. Never repeats until the full pool is exhausted.
- **To-dos**: Three collapsible lists for Nate, Raph, and Life Admin.
- **Quote**: A daily rotating quote from strong women throughout history.

## Important note on data

Since data lives in `localStorage`, it is **per-browser, per-device**. If you use Chrome on your laptop, that's where your data lives. Using Safari on your phone would be a separate, empty dashboard. Pick one browser and stick with it.
