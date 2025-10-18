# University Room Scheduler

A Django + React application for managing university department room schedules with QR code generation for easy mobile access.

## Features

- **Room Management**: Create and manage rooms with department organization
- **Schedule Management**: Create, edit, and view room schedules
- **QR Code Generation**: Automatic QR code generation for each room that links to mobile-friendly schedule views
- **Real-time Availability**: Check current room availability and upcoming schedules
- **Responsive Design**: Modern Material-UI interface that works on desktop and mobile
- **Department Organization**: Organize rooms by university departments

## Technology Stack

- **Backend**: Django 5.2 + Django REST Framework
- **Frontend**: React 18 + Material-UI
- **Database**: SQLite (development)
- **QR Codes**: Python qrcode library with PIL
- **API**: RESTful API with JSON responses

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+ (for frontend development)

### Backend Setup

1. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install django djangorestframework django-cors-headers qrcode[pil] pillow
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create a superuser:
```bash
python manage.py createsuperuser
```

5. Start the Django development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000/`

## Usage

### Admin Interface
Access the Django admin at `http://localhost:8000/admin/` to:
- Manage departments
- Add/edit rooms
- View and manage schedules
- Regenerate QR codes

### Web Interface
Use the React frontend at `http://localhost:3000/` to:
- Browse all rooms
- View room details and availability
- Create and manage schedules
- Access QR codes for mobile viewing

### QR Code Access
Each room automatically generates a QR code that:
- Links to a mobile-friendly schedule view
- Shows current availability
- Displays upcoming schedules
- Updates in real-time

## API Endpoints

### Departments
- `GET /api/departments/` - List all departments
- `POST /api/departments/` - Create new department
- `GET /api/departments/{id}/` - Get department details
- `PUT /api/departments/{id}/` - Update department
- `DELETE /api/departments/{id}/` - Delete department

### Rooms
- `GET /api/rooms/` - List all rooms (with filters)
- `POST /api/rooms/` - Create new room
- `GET /api/rooms/{id}/` - Get room details
- `PUT /api/rooms/{id}/` - Update room
- `DELETE /api/rooms/{id}/` - Delete room
- `GET /api/rooms/{id}/availability/` - Check room availability
- `POST /api/rooms/{id}/qr-code/regenerate/` - Regenerate QR code

### Schedules
- `GET /api/schedules/` - List all schedules (with filters)
- `POST /api/schedules/` - Create new schedule
- `GET /api/schedules/{id}/` - Get schedule details
- `PUT /api/schedules/{id}/` - Update schedule
- `DELETE /api/schedules/{id}/` - Delete schedule
- `GET /api/schedules/today/` - Get today's schedules
- `POST /api/schedules/{id}/status/` - Update schedule status
- `GET /api/rooms/{id}/schedule/` - Get room schedule for date range

## Project Structure

```
qrCodeLearning/
├── manage.py
├── room_scheduler/          # Django project settings
├── rooms/                   # Rooms and departments app
│   ├── models.py           # Room and Department models
│   ├── views.py            # API views
│   ├── serializers.py      # API serializers
│   └── admin.py            # Admin interface
├── schedules/               # Schedules app
│   ├── models.py           # Schedule model
│   ├── views.py            # API views
│   ├── serializers.py      # API serializers
│   └── admin.py            # Admin interface
├── frontend/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API service layer
│   └── package.json
└── media/                   # QR code images
```

## Development

### Adding New Features
1. Backend changes go in the Django apps (`rooms/` or `schedules/`)
2. Frontend changes go in the React app (`frontend/src/`)
3. API changes require updating both serializers and views
4. Database changes require new migrations

### Testing the QR Codes
1. Create a room through the admin or API
2. A QR code will be automatically generated
3. Scan the QR code with a mobile device
4. It should open the mobile-friendly schedule view

## Deployment Considerations

For production deployment:
- Use PostgreSQL instead of SQLite
- Configure static file serving
- Set up CORS properly for your domain
- Use environment variables for sensitive settings
- Set up proper media file serving for QR codes

## License

This project is open source and available under the MIT License.
