from rest_framework import serializers
from .models import Schedule
from rooms.models import Room


class ScheduleSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source='room.name', read_only=True)
    room_number = serializers.CharField(source='room.number', read_only=True)
    department_name = serializers.CharField(source='room.department.name', read_only=True)
    is_current = serializers.ReadOnlyField()
    duration_minutes = serializers.ReadOnlyField()

    class Meta:
        model = Schedule
        fields = [
            'id', 'room', 'room_name', 'room_number', 'department_name',
            'title', 'description', 'instructor', 'course_code', 
            'date', 'start_time', 'end_time', 'status', 'is_current',
            'duration_minutes', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the created_by field to the current user if available
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class ScheduleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = [
            'room', 'title', 'description', 'instructor', 'course_code', 
            'date', 'start_time', 'end_time', 'status'
        ]

    def validate(self, data):
        """Validate schedule data"""
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time.")
        
        # Check for overlapping schedules
        room = data['room']
        date = data['date']
        start_time = data['start_time']
        end_time = data['end_time']
        
        overlapping = Schedule.objects.filter(
            room=room,
            date=date,
            status__in=['scheduled', 'in_progress']
        )
        
        # If updating, exclude current instance
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        
        for schedule in overlapping:
            if (start_time < schedule.end_time and end_time > schedule.start_time):
                raise serializers.ValidationError(
                    f"This time slot overlaps with: {schedule.title} "
                    f"({schedule.start_time}-{schedule.end_time})"
                )
        
        return data
