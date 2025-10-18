from django.db import models
from django.urls import reverse
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image
import os


class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        ordering = ['name']


class Room(models.Model):
    ROOM_TYPES = [
        ('classroom', 'Classroom'),
        ('laboratory', 'Laboratory'),
        ('auditorium', 'Auditorium'),
        ('conference', 'Conference Room'),
        ('office', 'Office'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    number = models.CharField(max_length=20)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='rooms')
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, default='classroom')
    capacity = models.PositiveIntegerField()
    equipment = models.TextField(blank=True, help_text="Available equipment (projector, computers, etc.)")
    floor = models.CharField(max_length=10, blank=True)
    building = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.number})"

    def get_absolute_url(self):
        return reverse('room_schedule', kwargs={'room_id': self.id})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.generate_qr_code()

    def generate_qr_code(self):
        """Generate QR code for room schedule access"""
        if not self.qr_code:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            
            # Create URL for room schedule (will work when frontend is deployed)
            room_url = f"http://localhost:3000/room/{self.id}/schedule"
            qr.add_data(room_url)
            qr.make(fit=True)

            # Create QR code image
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Save to BytesIO
            buffer = BytesIO()
            qr_image.save(buffer, format='PNG')
            buffer.seek(0)
            
            # Save to model
            filename = f'room_{self.id}_qr.png'
            self.qr_code.save(filename, File(buffer), save=False)
            super().save(update_fields=['qr_code'])

    class Meta:
        ordering = ['department', 'name']
        unique_together = ['department', 'number']
