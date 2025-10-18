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
        # Generate QR code as base64 data URL for cloud deployment
        import qrcode
        from io import BytesIO
        import base64
        
        try:
            # Create QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            
            # Use Vercel frontend URL for production or localhost for development
            frontend_url = "https://room-scheduler-gray.vercel.app"
            room_url = f"{frontend_url}/room/{obj.id}/schedule"
            qr.add_data(room_url)
            qr.make(fit=True)

            # Create QR code image
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64
            buffer = BytesIO()
            qr_image.save(buffer, format='PNG')
            buffer.seek(0)
            
            # Return as data URL
            img_str = base64.b64encode(buffer.getvalue()).decode()
            return f"data:image/png;base64,{img_str}"
            
        except Exception as e:
            print(f"Error generating QR code for room {obj.id}: {e}")
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
