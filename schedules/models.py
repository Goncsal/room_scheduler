from django.db import models
from django.contrib.auth.models import User
from rooms.models import Room
from datetime import datetime, time
from django.core.exceptions import ValidationError


class Schedule(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='schedules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    instructor = models.CharField(max_length=100, blank=True)
    course_code = models.CharField(max_length=20, blank=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.room} ({self.date} {self.start_time}-{self.end_time})"

    def clean(self):
        """Validate that end time is after start time and no overlapping schedules"""
        if self.end_time <= self.start_time:
            raise ValidationError("End time must be after start time.")
        
        # Check for overlapping schedules
        overlapping = Schedule.objects.filter(
            room=self.room,
            date=self.date,
            status__in=['scheduled', 'in_progress']
        ).exclude(pk=self.pk)
        
        for schedule in overlapping:
            if (self.start_time < schedule.end_time and self.end_time > schedule.start_time):
                raise ValidationError(f"This time slot overlaps with: {schedule.title}")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def is_current(self):
        """Check if the schedule is currently active"""
        now = datetime.now()
        today = now.date()
        current_time = now.time()
        
        return (self.date == today and 
                self.start_time <= current_time <= self.end_time and
                self.status == 'in_progress')

    @property
    def duration_minutes(self):
        """Calculate duration in minutes"""
        start_datetime = datetime.combine(self.date, self.start_time)
        end_datetime = datetime.combine(self.date, self.end_time)
        return int((end_datetime - start_datetime).total_seconds() / 60)

    class Meta:
        ordering = ['date', 'start_time']
