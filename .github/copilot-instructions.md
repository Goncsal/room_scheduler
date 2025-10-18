<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Room Scheduler Application

This is a Django + React application for managing university department room schedules with QR code generation.

## Architecture
- **Backend**: Django REST Framework with SQLite database
- **Frontend**: React with Material-UI components
- **QR Codes**: Generated using Python's qrcode library, linking to room schedules

## Key Features
- Room management with department organization
- Schedule creation and management
- Real-time availability checking
- QR code generation for easy mobile access
- Modern responsive UI

## Development Guidelines
- Follow REST API conventions for Django backend
- Use Material-UI components for consistent React frontend styling  
- Implement proper error handling and validation
- Maintain clean separation between backend API and frontend
- Use Django's built-in admin interface for data management

## Database Models
- `Department`: University departments
- `Room`: Physical rooms with QR codes
- `Schedule`: Time-based room bookings

## API Endpoints
- `/api/departments/` - Department CRUD operations
- `/api/rooms/` - Room CRUD operations with availability checking
- `/api/schedules/` - Schedule CRUD operations
- `/api/rooms/{id}/schedule/` - Room-specific schedule views
