# Deployment Guide

## 🚀 Quick Deploy to Web

### Easiest Option: Railway (Free Tier)

1. **Create GitHub Repository & Push Code**:
   
   **Step 1: Create Repository on GitHub**
   - Go to [GitHub.com](https://github.com)
   - Click "New" or "+" → "New repository"
   - Name: `room-scheduler` (or any name you prefer)
   - Make it **Public** (required for free deployment)
   - ❌ **Don't** initialize with README (you already have files)
   - Click "Create repository"

   **Step 2: Push Your Code**
   ```bash
   # Already done: git init
   git branch -M main
   git add .
   git commit -m "Initial room scheduler application"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy Backend to Railway**:
   - Go to [Railway.app](https://railway.app) and sign up/login
   - Click "New Project" → "Deploy from GitHub repo"
   - Connect your GitHub account and select your repository
   - Railway will automatically detect Django and start building
   - **Wait for deployment to complete** (2-3 minutes)
   - **Copy your Railway URL**: Look for a URL like `https://your-app-name-production-xxxx.up.railway.app`
   - Set environment variables in Railway dashboard:
     - `DJANGO_SETTINGS_MODULE` = `room_scheduler.production_settings`
     - `SECRET_KEY` = `your-secret-key-here` (generate a new one)

3. **Deploy Frontend to Vercel**:
   - Go to [Vercel.com](https://vercel.com) and sign up/login
   - Click "New Project" → Import your GitHub repo
   - Configure project:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   - **Add Environment Variable**:
     - Name: `REACT_APP_API_URL`
     - Value: `https://your-actual-railway-url.up.railway.app` (the FREE auto-generated URL from Railway)
   - Click "Deploy"

**Result**: Your app will be live on the web! 🎉

## 🔍 How to Find Your Railway URL

After deploying to Railway, you'll get a URL automatically generated. Here's where to find it:

### Method 1: Railway Dashboard
1. Go to your Railway project dashboard
2. Click on your deployed service
3. Look for the **"Deployments"** tab
4. Your URL will be shown like: `https://room-scheduler-production-xxxx.up.railway.app`

### Method 2: Settings Tab
1. In your Railway project
2. Click **"Settings"** tab
3. Look for **"Domains"** section
4. Your auto-generated domain is listed there

### Method 3: Copy from Deployment Logs
1. When Railway finishes deploying
2. Check the deployment logs
3. Look for a line like: `Deployed to https://your-app-name.up.railway.app`

**Important**: Use this exact URL (including `https://`) in your Vercel environment variable!

## 💡 Domain Clarification

**You DON'T need to buy a custom domain!** 

### What Railway Gives You FREE:
- **Auto-generated URL**: `https://room-scheduler-production-1a2b3c.up.railway.app`
- **Fully functional**: Works exactly like a custom domain
- **HTTPS included**: Secure by default
- **No setup required**: Generated automatically when you deploy

### Custom Domain (Optional):
- **Only if you want**: `https://yourname.com` instead of the Railway URL
- **Costs money**: You'd need to buy a domain name (~$10-15/year)
- **Not necessary**: The Railway URL works perfectly for your app

**For your project: Just use the FREE Railway-generated URL!**

## Local Development

### Quick Start

### 1. Backend (Django)
```bash
# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate
python manage.py create_sample_data

# Create admin user (if not using sample data)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 2. Frontend (React)
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Interface: http://localhost:8000/admin (admin/admin123)

## Features to Test

1. **Room Management**
   - View all rooms at `/rooms`
   - Click on a room to see details and QR code
   - QR codes link to mobile-friendly schedule views

2. **Schedule Management**
   - Create schedules at `/schedules`
   - View today's schedules on homepage
   - Check room availability

3. **QR Code Functionality**
   - Each room automatically generates a QR code
   - Scan QR codes to view room schedules on mobile
   - QR codes update when room information changes

4. **API Testing**
   - GET `/api/rooms/` - List all rooms
   - GET `/api/rooms/1/availability/` - Check room availability
   - GET `/api/schedules/today/` - Today's schedules
   - POST `/api/schedules/` - Create new schedule

## 🚨 Quick Answer: GitHub Deployment

**No, pushing to GitHub won't make it work automatically.** GitHub is for code storage, not web hosting.

**What you need:**
1. **Code hosting**: GitHub (✅ you have this)
2. **Web hosting**: Railway, Render, Vercel, etc. (separate service)
3. **Database**: PostgreSQL (SQLite doesn't work on cloud)

## GitHub & Version Control

### Ready to Commit
Your project already has a `.gitignore` file that excludes:
- `db.sqlite3` (your local database)
- `venv/` (virtual environment)
- `media/qr_codes/` (generated QR codes)
- `frontend/node_modules/` (React dependencies)

### Database Location
- **Current database**: `db.sqlite3` file in project root
- **QR code images**: `media/qr_codes/` folder
- **Note**: These are created locally and NOT included in Git

## Production Deployment Options

### Option 1: Free Hosting (Railway/Render)
**Backend (Django):**
1. Push code to GitHub
2. Connect Railway/Render to your GitHub repo
3. Set environment variables:
   ```
   DEBUG=False
   SECRET_KEY=your-secret-key
   ALLOWED_HOSTS=your-domain.com
   ```
4. Railway/Render will automatically install requirements.txt

**Frontend (React):**
1. Deploy to Vercel/Netlify
2. Set build command: `npm run build`
3. Set API URL to your backend domain

### Option 2: VPS/Cloud (DigitalOcean, AWS)
**Backend Setup:**
```bash
# On server
git clone your-repo
cd your-repo
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py create_sample_data
python manage.py collectstatic
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run build
# Serve build folder with nginx/apache
```

### Option 3: All-in-One (Heroku style)
1. Set `DEBUG = False` in settings
2. Use PostgreSQL instead of SQLite
3. Configure static file serving
4. Set up media file serving for QR codes
5. Use WhiteNoise for static files

### Environment Variables Needed
- `SECRET_KEY`: Django secret key (generate new one)
- `DATABASE_URL`: Database connection string
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS`: Frontend domain for CORS

### Important Notes
- **Database**: SQLite doesn't work on most cloud platforms - use PostgreSQL
- **QR Codes**: Need persistent file storage or cloud storage (AWS S3)
- **Two Apps**: Backend and frontend deploy separately
- **CORS**: Must configure backend to accept requests from frontend domain

## 🚨 Common Issues & Solutions

### "gunicorn: command not found" Error
- **Problem**: Railway can't find gunicorn to run Django
- **Solution**: Updated requirements.txt includes gunicorn now
- **Fix**: Push latest code with `git push origin main`

### "Can't Access /admin" on Railway
- **Problem**: No admin user exists in production database
- **Solution**: Railway uses fresh PostgreSQL database (not your local SQLite)
- **Fix**: Add admin creation to your deployment script:

**Option 1: Update Railway Environment Variables (Recommended)**
1. Go to Railway dashboard → Your project → Variables
2. Add these environment variables:
   ```
   DJANGO_SETTINGS_MODULE=room_scheduler.production_settings
   DJANGO_SUPERUSER_USERNAME=admin
   DJANGO_SUPERUSER_EMAIL=admin@example.com  
   DJANGO_SUPERUSER_PASSWORD=your-secure-password
   SECRET_KEY=your-django-secret-key-here
   ```
3. Push your latest code: `git push origin main`
4. Railway will automatically redeploy

**Option 2: Use Railway Console**
1. Go to Railway dashboard → Your project
2. Click "Console" or "Shell"
3. Run: `python manage.py createsuperuser`
4. Follow the prompts

### "Can't find Railway URL"
- **Solution**: Wait for Railway deployment to complete first
- **Look for**: A URL ending in `.up.railway.app`
- **Location**: Railway dashboard → Your project → Settings → Domains

### "CORS Error" between Frontend and Backend
- **Problem**: Frontend can't connect to backend API
- **Solution**: Check that `REACT_APP_API_URL` in Vercel matches your Railway URL exactly
- **Format**: Must include `https://` (e.g., `https://your-app.up.railway.app`)

### "500 Error" on Railway
- **Problem**: Django settings issue
- **Solution**: Check environment variables in Railway:
  - `DJANGO_SETTINGS_MODULE=room_scheduler.production_settings`
  - `SECRET_KEY=your-generated-secret-key`

### Frontend Shows "API Connection Error"
- **Check**: Your Railway backend is running (visit the Railway URL directly)
- **Check**: `REACT_APP_API_URL` environment variable in Vercel
- **Check**: No trailing slash in API URL
