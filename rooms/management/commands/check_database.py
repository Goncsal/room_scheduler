from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from rooms.models import Room, Department
from schedules.models import Schedule


class Command(BaseCommand):
    help = 'Check database connection and show current data counts'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== DATABASE HEALTH CHECK ==='))
        
        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                if result:
                    self.stdout.write(self.style.SUCCESS('✅ Database connection: OK'))
                else:
                    self.stdout.write(self.style.ERROR('❌ Database connection: FAILED'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Database connection error: {e}'))
            return

        # Show database info
        db_config = settings.DATABASES['default']
        self.stdout.write(f"Database Engine: {db_config['ENGINE']}")
        if 'NAME' in db_config:
            self.stdout.write(f"Database Name: {db_config['NAME']}")
        if 'HOST' in db_config:
            self.stdout.write(f"Database Host: {db_config.get('HOST', 'localhost')}")

        # Count existing data
        try:
            dept_count = Department.objects.count()
            room_count = Room.objects.count()
            schedule_count = Schedule.objects.count()
            
            self.stdout.write(self.style.SUCCESS(f'📊 Current data counts:'))
            self.stdout.write(f'  - Departments: {dept_count}')
            self.stdout.write(f'  - Rooms: {room_count}')
            self.stdout.write(f'  - Schedules: {schedule_count}')
            
            if dept_count == 0 and room_count == 0 and schedule_count == 0:
                self.stdout.write(self.style.WARNING('⚠️  No data found - database might be empty!'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error counting data: {e}'))

        # Test write operation
        try:
            test_dept, created = Department.objects.get_or_create(
                code='TEST',
                defaults={
                    'name': 'Test Department',
                    'description': 'Database test department'
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS('✅ Database write test: PASSED (created test department)'))
                # Clean up
                test_dept.delete()
                self.stdout.write('🧹 Cleaned up test data')
            else:
                self.stdout.write(self.style.SUCCESS('✅ Database write test: PASSED (test department already exists)'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Database write test: FAILED - {e}'))
