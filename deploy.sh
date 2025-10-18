#!/bin/bash
# Deployment script for cloud platforms

echo "Starting deployment..."

# Install production requirements
pip install -r requirements-production.txt

# Run migrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell -c "
from django.contrib.auth.models import User
import os

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created')
else:
    print('Superuser already exists')
"

# Create sample data if database is empty
python manage.py shell -c "
from rooms.models import Room
if not Room.objects.exists():
    from django.core.management import call_command
    call_command('create_sample_data')
    print('Sample data created')
else:
    print('Database already populated')
"

# Collect static files
python manage.py collectstatic --noinput

echo "Deployment complete!"
