from rest_framework import serializers
from .models import Department, Room


class DepartmentSerializer(serializers.ModelSerializer):
    rooms_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'created_at', 'rooms_count']

    def get_rooms_count(self, obj):
        return obj.rooms.filter(is_active=True).count()


class RoomSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    qr_code_url = serializers.SerializerMethodField()
    current_schedule = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'id', 'name', 'number', 'department', 'department_name', 
            'room_type', 'capacity', 'equipment', 'floor', 'building', 
            'is_active', 'qr_code_url', 'current_schedule', 'created_at', 'updated_at'
        ]

    def get_qr_code_url(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None

    def get_current_schedule(self, obj):
        from schedules.serializers import ScheduleSerializer
        from datetime import date, datetime
        
        current_schedules = obj.schedules.filter(
            date=date.today(),
            status__in=['scheduled', 'in_progress']
        ).order_by('start_time')
        
        # Find the currently active schedule
        now = datetime.now().time()
        for schedule in current_schedules:
            if schedule.start_time <= now <= schedule.end_time:
                return ScheduleSerializer(schedule).data
        
        # If no current schedule, return the next one today
        next_schedule = current_schedules.filter(start_time__gt=now).first()
        if next_schedule:
            return ScheduleSerializer(next_schedule).data
        
        return None


class RoomDetailSerializer(RoomSerializer):
    schedules = serializers.SerializerMethodField()

    class Meta(RoomSerializer.Meta):
        fields = RoomSerializer.Meta.fields + ['schedules']

    def get_schedules(self, obj):
        from schedules.serializers import ScheduleSerializer
        from datetime import date, timedelta
        
        # Get schedules for the next 7 days
        start_date = date.today()
        end_date = start_date + timedelta(days=7)
        
        schedules = obj.schedules.filter(
            date__range=[start_date, end_date],
            status__in=['scheduled', 'in_progress']
        ).order_by('date', 'start_time')
        
        return ScheduleSerializer(schedules, many=True).data
