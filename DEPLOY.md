# 🚀 Deployment Guide — Render (Backend) + Vercel (Frontend)

This guide walks you through deploying **NotesReal** so anyone can use it on the internet.

---

## Overview

| Part | Platform | URL you'll get |
|------|----------|---------------|
| Backend (Node/Express/MongoDB) | [Render](https://render.com) | `https://notesreal-api.onrender.com` |
| Frontend (React/Vite) | [Vercel](https://vercel.com) | `https://notesreal.vercel.app` |

---

## ✅ Before You Start

Make sure your project is pushed to **GitHub**:

```bash
cd c:\Users\vishn\NotesReal
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/notesreal.git
git push -u origin main
```

> You'll need a [GitHub account](https://github.com) if you don't have one.

---

## 🟢 Part 1 — Deploy Backend to Render

### Step 1: Sign up / Log in to Render

Go to [https://render.com](https://render.com) and sign in with GitHub.

---

### Step 2: Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account and select the **NotesReal** repository
3. Fill in the settings:

| Field | Value |
|-------|-------|
| **Name** | `notesreal-api` (or anything you like) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |

---

### Step 3: Set Environment Variables on Render

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string, e.g. `mySecretKey123!xyz` |
| `PORT` | `5000` *(Render sets this automatically, but add it to be safe)* |

> 💡 **MongoDB Atlas setup** (if not done yet):
> 1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
> 2. Create a free cluster
> 3. Click **Connect** → **Drivers** → copy the connection string
> 4. Replace `<password>` with your DB user's password
> 5. Paste it as `MONGO_URI` on Render

---

### Step 4: Deploy

Click **"Create Web Service"**. Render will build and deploy your backend.

Once done, copy your backend URL — it looks like:
```
https://notesreal-api.onrender.com
```

> ⚠️ **Free tier note**: Render free instances **go to sleep after 15 minutes of inactivity**. The first request after sleep takes ~30 seconds. Upgrade to a paid plan to avoid this.

---

## 🔵 Part 2 — Deploy Frontend to Vercel

### Step 1: Sign up / Log in to Vercel

Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.

---

### Step 2: Import Your Project

1. Click **"New Project"**
2. Select the **NotesReal** repository from GitHub
3. Vercel will auto-detect Vite. Configure:

| Field | Value |
|-------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

---

### Step 3: Set Environment Variable on Vercel

Under **"Environment Variables"**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://notesreal-api.onrender.com` *(your Render URL from above)* |

> ⚠️ **Important**: This must start with `VITE_` — otherwise Vite won't expose it to the browser.

---

### Step 4: Fix Client-Side Routing (Important!)

Since the app uses React Router, Vercel needs to redirect all routes to `index.html`.

Create a file at `frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures routes like `/dashboard` and `/register` work when the page is refreshed.

---

### Step 5: Deploy

Click **"Deploy"**. Vercel will build and publish your frontend.

Your live URL will be:
```
https://notesreal.vercel.app
```

---

## 🔄 After Deployment — Update CORS on Backend

Once you know your Vercel URL, update `backend/server.js` to restrict CORS to just your frontend (optional but more secure):

```js
app.use(cors({
    origin: "https://notesreal.vercel.app",  // ← your actual Vercel URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
```

Push the change → Render will auto-redeploy.

---

## 🔁 Re-deploying After Changes

| Change type | What to do |
|-------------|------------|
| Code change | Push to GitHub — both Render and Vercel **auto-deploy** on every push |
| New env variable | Add it on Render/Vercel dashboard → manually trigger redeploy |
| `.env` file | Never push `.env` to GitHub — always set vars in the platform dashboard |

---

## 🗂️ Files Created for Deployment

| File | Purpose |
|------|---------|
| `frontend/.env` | Local dev API URL (`http://localhost:5000`) |
| `frontend/vercel.json` | Redirect all routes to `index.html` for React Router |

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created + `MONGO_URI` copied
- [ ] Render Web Service created with `backend` root dir
- [ ] `MONGO_URI` and `JWT_SECRET` set on Render
- [ ] Render deployment succeeded — backend URL copied
- [ ] Vercel project created with `frontend` root dir
- [ ] `VITE_API_URL` set to Render URL on Vercel
- [ ] `frontend/vercel.json` created
- [ ] Vercel deployment succeeded — app is live!

---

> 🎉 Once all steps are done, your app will be fully live at your Vercel URL. Share it with anyone!
