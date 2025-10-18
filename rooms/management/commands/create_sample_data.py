from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rooms.models import Department, Room
from schedules.models import Schedule
from datetime import date, time, timedelta


class Command(BaseCommand):
    help = 'Create sample data for the Room Scheduler application'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating sample data...'))

        # Create departments
        departments_data = [
            {'name': 'Computer Science', 'code': 'CS', 'description': 'Computer Science Department'},
            {'name': 'Mathematics', 'code': 'MATH', 'description': 'Mathematics Department'},
            {'name': 'Physics', 'code': 'PHYS', 'description': 'Physics Department'},
            {'name': 'Chemistry', 'code': 'CHEM', 'description': 'Chemistry Department'},
        ]

        departments = {}
        for dept_data in departments_data:
            dept, created = Department.objects.get_or_create(
                code=dept_data['code'],
                defaults=dept_data
            )
            departments[dept_data['code']] = dept
            if created:
                self.stdout.write(f'Created department: {dept.name}')

        # Create rooms
        rooms_data = [
            {'name': 'Lecture Hall A', 'number': 'A101', 'department': 'CS', 'room_type': 'auditorium', 'capacity': 150, 'floor': '1', 'building': 'Main Building', 'equipment': 'Projector, Sound System, Microphones'},
            {'name': 'Computer Lab 1', 'number': 'CS201', 'department': 'CS', 'room_type': 'laboratory', 'capacity': 30, 'floor': '2', 'building': 'CS Building', 'equipment': '30 Computers, Projector, Whiteboard'},
            {'name': 'Computer Lab 2', 'number': 'CS202', 'department': 'CS', 'room_type': 'laboratory', 'capacity': 25, 'floor': '2', 'building': 'CS Building', 'equipment': '25 Computers, Projector'},
            {'name': 'Classroom 1', 'number': 'CS301', 'department': 'CS', 'room_type': 'classroom', 'capacity': 40, 'floor': '3', 'building': 'CS Building', 'equipment': 'Projector, Whiteboard'},
            {'name': 'Seminar Room', 'number': 'CS401', 'department': 'CS', 'room_type': 'conference', 'capacity': 20, 'floor': '4', 'building': 'CS Building', 'equipment': 'Conference Table, Projector, Video Conferencing'},
            {'name': 'Mathematics Classroom A', 'number': 'M101', 'department': 'MATH', 'room_type': 'classroom', 'capacity': 35, 'floor': '1', 'building': 'Math Building', 'equipment': 'Blackboard, Projector'},
            {'name': 'Mathematics Classroom B', 'number': 'M102', 'department': 'MATH', 'room_type': 'classroom', 'capacity': 35, 'floor': '1', 'building': 'Math Building', 'equipment': 'Blackboard, Projector'},
            {'name': 'Physics Lab', 'number': 'P201', 'department': 'PHYS', 'room_type': 'laboratory', 'capacity': 20, 'floor': '2', 'building': 'Physics Building', 'equipment': 'Lab Equipment, Fume Hoods'},
            {'name': 'Chemistry Lab', 'number': 'C301', 'department': 'CHEM', 'room_type': 'laboratory', 'capacity': 18, 'floor': '3', 'building': 'Chemistry Building', 'equipment': 'Lab Benches, Fume Hoods, Safety Equipment'},
        ]

        rooms = {}
        for room_data in rooms_data:
            dept_code = room_data.pop('department')
            room_data['department'] = departments[dept_code]
            
            room, created = Room.objects.get_or_create(
                number=room_data['number'],
                department=room_data['department'],
                defaults=room_data
            )
            rooms[room_data['number']] = room
            if created:
                self.stdout.write(f'Created room: {room.name} ({room.number})')

        # Create sample schedules for the current week
        today = date.today()
        current_week_start = today - timedelta(days=today.weekday())  # Monday
        
        schedules_data = [
            # Monday schedules
            {'room': 'A101', 'title': 'Introduction to Programming', 'instructor': 'Dr. Smith', 'course_code': 'CS101', 'date': current_week_start, 'start_time': time(9, 0), 'end_time': time(10, 30)},
            {'room': 'CS201', 'title': 'Database Systems Lab', 'instructor': 'Prof. Johnson', 'course_code': 'CS301', 'date': current_week_start, 'start_time': time(11, 0), 'end_time': time(12, 30)},
            {'room': 'M101', 'title': 'Calculus I', 'instructor': 'Dr. Brown', 'course_code': 'MATH101', 'date': current_week_start, 'start_time': time(14, 0), 'end_time': time(15, 30)},
            
            # Tuesday schedules
            {'room': 'CS301', 'title': 'Data Structures', 'instructor': 'Dr. Wilson', 'course_code': 'CS201', 'date': current_week_start + timedelta(days=1), 'start_time': time(9, 0), 'end_time': time(10, 30)},
            {'room': 'P201', 'title': 'Physics Lab I', 'instructor': 'Prof. Davis', 'course_code': 'PHYS201', 'date': current_week_start + timedelta(days=1), 'start_time': time(10, 0), 'end_time': time(12, 0)},
            {'room': 'CS202', 'title': 'Web Development', 'instructor': 'Ms. Garcia', 'course_code': 'CS350', 'date': current_week_start + timedelta(days=1), 'start_time': time(13, 0), 'end_time': time(15, 0)},
            
            # Wednesday schedules
            {'room': 'A101', 'title': 'Algorithms Lecture', 'instructor': 'Dr. Taylor', 'course_code': 'CS401', 'date': current_week_start + timedelta(days=2), 'start_time': time(10, 0), 'end_time': time(11, 30)},
            {'room': 'C301', 'title': 'Organic Chemistry Lab', 'instructor': 'Prof. Martinez', 'course_code': 'CHEM301', 'date': current_week_start + timedelta(days=2), 'start_time': time(9, 0), 'end_time': time(12, 0)},
            {'room': 'M102', 'title': 'Linear Algebra', 'instructor': 'Dr. Anderson', 'course_code': 'MATH201', 'date': current_week_start + timedelta(days=2), 'start_time': time(14, 0), 'end_time': time(15, 30)},
            
            # Thursday schedules
            {'room': 'CS401', 'title': 'Software Engineering Meeting', 'instructor': 'Dr. Smith', 'course_code': 'CS451', 'date': current_week_start + timedelta(days=3), 'start_time': time(9, 0), 'end_time': time(10, 0)},
            {'room': 'CS201', 'title': 'Machine Learning Lab', 'instructor': 'Prof. Lee', 'course_code': 'CS461', 'date': current_week_start + timedelta(days=3), 'start_time': time(11, 0), 'end_time': time(13, 0)},
            {'room': 'M101', 'title': 'Statistics', 'instructor': 'Dr. White', 'course_code': 'MATH301', 'date': current_week_start + timedelta(days=3), 'start_time': time(15, 0), 'end_time': time(16, 30)},
            
            # Friday schedules
            {'room': 'A101', 'title': 'Computer Science Seminar', 'instructor': 'Various Speakers', 'course_code': 'CS499', 'date': current_week_start + timedelta(days=4), 'start_time': time(14, 0), 'end_time': time(16, 0)},
            {'room': 'CS202', 'title': 'Mobile App Development', 'instructor': 'Ms. Thompson', 'course_code': 'CS380', 'date': current_week_start + timedelta(days=4), 'start_time': time(10, 0), 'end_time': time(12, 0)},
        ]

        # Get or create a user for schedules
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            user.set_password('admin123')
            user.save()

        for schedule_data in schedules_data:
            room_number = schedule_data.pop('room')
            schedule_data['room'] = rooms[room_number]
            schedule_data['created_by'] = user
            
            schedule, created = Schedule.objects.get_or_create(
                room=schedule_data['room'],
                date=schedule_data['date'],
                start_time=schedule_data['start_time'],
                defaults=schedule_data
            )
            if created:
                self.stdout.write(f'Created schedule: {schedule.title} in {schedule.room.name}')

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Created {Department.objects.count()} departments'))
        self.stdout.write(self.style.SUCCESS(f'Created {Room.objects.count()} rooms'))
        self.stdout.write(self.style.SUCCESS(f'Created {Schedule.objects.count()} schedules'))
        self.stdout.write(self.style.WARNING('Admin user: admin / admin123'))
