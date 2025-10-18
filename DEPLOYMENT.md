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

2. **Deploy Backend**:
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repo
   - Select "Deploy from GitHub repo"
   - Railway will automatically detect Django and install requirements
   - Set environment variable: `DJANGO_SETTINGS_MODULE=room_scheduler.production_settings`

3. **Deploy Frontend**:
   - Go to [Vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/build`
   - Set environment variable: `REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app`

**Result**: Your app will be live on the web! 🎉

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
