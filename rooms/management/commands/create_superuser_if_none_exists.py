from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os


class Command(BaseCommand):
    help = 'Create superuser for production deployment'

    def handle(self, *args, **options):
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

        if username and password:
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(username=username, email=email, password=password)
                self.stdout.write(
                    self.style.SUCCESS(f'Superuser "{username}" created successfully')
                )
            else:
                self.stdout.write(
                    self.style.WARNING('Superuser already exists')
                )
        else:
            self.stdout.write(
                self.style.ERROR('DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD environment variables required')
            )
