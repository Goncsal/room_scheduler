web: python manage.py migrate && python manage.py create_superuser_if_none_exists && python manage.py create_sample_data && gunicorn room_scheduler.wsgi:application
