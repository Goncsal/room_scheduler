# 🏫 University Room Scheduler

I built this Django + React app to solve the common problem of managing university room schedules. Students and staff can scan QR codes to instantly check room availability and upcoming classes - no more standing around wondering if a room is free!

## 🚀 Live Demo

- **Frontend**: https://room-scheduler-gray.vercel.app/
- **Backend API**: https://roomscheduler-production.up.railway.app/
- **Admin Panel**: https://roomscheduler-production.up.railway.app/admin/ (admin/admin123)

## ✨ What I Built

This started as a learning project but turned into something pretty useful:

- **Smart Room Management** - Organize rooms by department with capacity, equipment, and location details
- **Dynamic QR Codes** - Each room gets a unique QR code that links to its mobile schedule page
- **Real-time Scheduling** - Create, edit, and check schedules with conflict detection
- **Mobile-First Design** - Built with Material-UI, works great on phones (perfect for QR code scanning)
- **RESTful API** - Clean Django REST Framework backend that could power other apps too

## 🛠️ Tech Stack

I chose these technologies for good reasons:

- **Django 5.2 + DRF** - Solid backend with built-in admin, great for rapid development
- **React 18 + Material-UI** - Modern frontend that looks professional out of the box
- **Railway + Vercel** - Free hosting that actually works (learned this the hard way!)
- **PostgreSQL** - Production database (SQLite for local development)
- **Base64 QR Codes** - Learned that file storage doesn't work well on free hosting 😅

## 🔧 Local Development Setup

Want to run this locally? Here's how I set it up:

### Prerequisites
- Python 3.8+ (I used 3.11)
- Node.js 16+ (for the React frontend)
- A decent code editor (VS Code recommended)

### Quick Start

**Backend (Django)**
```bash
# Clone and enter the project
git clone https://github.com/Goncsal/room_scheduler.git
cd room_scheduler

# Set up Python virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies (I included everything in requirements.txt)
pip install -r requirements.txt

# Set up database and sample data
python manage.py migrate
python manage.py create_sample_data  # Creates test departments, rooms, and schedules

# Start the Django server
python manage.py runserver
```

**Frontend (React)**
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start React development server
npm start
```

Now you can access:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000/api
- **Admin**: http://localhost:8000/admin (admin/admin123)

## 🎯 How It Works

### The Problem I Solved
Ever walked into a university building looking for an empty room? Or wondered if that classroom you're heading to is actually free? This app solves that with QR codes posted outside each room.

### User Experience
1. **Scan QR Code** - Each room has a unique code posted by the door
2. **Instant Info** - See current availability and today's schedule  
3. **Mobile Optimized** - Works great on phones (no app needed!)
4. **Real-time Data** - Always up-to-date from the central database

### Admin Features
The Django admin panel lets you:
- **Manage Departments** - CS, Math, Physics, etc.
- **Add Rooms** - Name, capacity, equipment, location
- **Schedule Classes** - Time slots with conflict detection
- **Generate QR Codes** - Automatic creation and updates

### Developer Features
- **RESTful API** - Clean endpoints for integration
- **Real-time Updates** - Frontend syncs with backend changes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Sample Data** - Built-in command to populate test data

## 🔌 API Reference

I built a clean RESTful API that you can use for other integrations:

### Key Endpoints
```bash
# Get all rooms with availability
GET /api/rooms/

# Check specific room availability  
GET /api/rooms/1/availability/

# Today's schedule across all rooms
GET /api/schedules/today/

# Room-specific schedule for date range
GET /api/rooms/1/schedule/?start_date=2024-01-15&end_date=2024-01-22
```

### Sample Response
```json
{
  "id": 1,
  "name": "Computer Lab 1",
  "number": "CS201",
  "department_name": "Computer Science",
  "capacity": 30,
  "room_type": "laboratory",
  "equipment": "30 computers, projector, whiteboard",
  "qr_code_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "current_schedule": {
    "title": "Web Development",
    "instructor": "Prof. Smith",
    "start_time": "10:00:00",
    "end_time": "12:00:00"
  }
}
```

### Full API Documentation
Check out the [complete API docs](DEPLOYMENT.md) for all endpoints, filters, and examples.

## 📁 Project Architecture

I organized this as a clean separation between backend and frontend:

```
room_scheduler/
├── 🐍 Backend (Django)
│   ├── room_scheduler/     # Main project settings
│   ├── rooms/              # Room & department management
│   │   ├── models.py       # Database models
│   │   ├── serializers.py  # API serialization (including QR generation)
│   │   ├── views.py        # API endpoints
│   │   └── admin.py        # Django admin customization
│   ├── schedules/          # Schedule management
│   │   ├── models.py       # Schedule model with conflict detection
│   │   ├── views.py        # Schedule API endpoints
│   │   └── serializers.py  # Schedule serialization
│   └── requirements.txt    # Python dependencies
│
├── ⚛️ Frontend (React)
│   ├── src/
│   │   ├── pages/          # HomePage, RoomsPage, SchedulePage
│   │   ├── components/     # Reusable UI components  
│   │   └── services/       # API integration layer
│   └── package.json        # Node dependencies
│
└── 🚀 Deployment
    ├── Procfile            # Railway deployment config
    ├── railway.json        # Railway settings
    └── DEPLOYMENT.md       # Deployment guide I wrote
```

## 💡 What I Learned

This project taught me a lot about full-stack development:

### Technical Challenges
- **QR Code Storage**: Initially used file storage, learned it doesn't work on free hosting. Switched to base64 data URLs.
- **CORS Issues**: Spent time figuring out frontend-backend communication in production.
- **Mobile Optimization**: Made sure QR scanning experience works well on phones.
- **Railway Deployment**: Learned about environment variables, production settings, and database migrations.

### Cool Features I'm Proud Of
- **Dynamic QR Generation**: QR codes are created on-demand with proper frontend URLs
- **Real-time Availability**: Shows current room status and next upcoming class
- **Conflict Detection**: Won't let you double-book a room
- **Sample Data Command**: Easy setup with realistic test data
- **Responsive Design**: Works great on desktop and mobile

## 🚀 Deployment

This is deployed on free hosting:
- **Backend**: Railway.app (Django + PostgreSQL)
- **Frontend**: Vercel.com (React build)
- **Total Cost**: $0/month 🎉

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete deployment guide I wrote.

## 🤝 Contributing

Feel free to fork this project! Some ideas for improvements:
- Add email notifications for schedule changes
- Implement room booking requests/approval workflow  
- Add calendar integration (Google Calendar, Outlook)
- Create a mobile app version
- Add analytics dashboard for room usage

## 📄 License

MIT License - feel free to use this for your own projects!
