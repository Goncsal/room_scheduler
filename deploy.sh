#!/bin/bash
# Deployment script for cloud platforms

echo "Starting deployment..."

# Install production requirements
pip install -r requirements-production.txt

# Run migrations
python manage.py migrate

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
