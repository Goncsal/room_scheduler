#!/bin/bash
# Post-deployment script for Railway

echo "Running post-deployment setup..."

# Run migrations
python manage.py migrate

# Create superuser if environment variables are set
if [ ! -z "$DJANGO_SUPERUSER_USERNAME" ]; then
    python manage.py shell -c "
from django.contrib.auth.models import User
import os

username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if username and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f'Superuser {username} created')
    else:
        print('Superuser already exists')
else:
    print('No superuser credentials provided')
"
fi

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

echo "Setup complete!"
