from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Schedule
from .serializers import ScheduleSerializer, ScheduleCreateSerializer
from rooms.models import Room
from datetime import date, datetime, timedelta


class ScheduleListCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        queryset = Schedule.objects.all()
        room_id = self.request.query_params.get('room', None)
        date_param = self.request.query_params.get('date', None)
        status_param = self.request.query_params.get('status', None)
        
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        
        if date_param:
            try:
                filter_date = datetime.strptime(date_param, '%Y-%m-%d').date()
                queryset = queryset.filter(date=filter_date)
            except ValueError:
                pass  # Invalid date format, ignore filter
        
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset.order_by('date', 'start_time')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ScheduleCreateSerializer
        return ScheduleSerializer


class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ScheduleCreateSerializer
        return ScheduleSerializer


@api_view(['GET'])
def room_schedule(request, room_id):
    """Get schedule for a specific room with date range"""
    room = get_object_or_404(Room, id=room_id, is_active=True)
    
    # Get date parameters
    start_date_param = request.query_params.get('start_date', None)
    end_date_param = request.query_params.get('end_date', None)
    
    # Default to current week if no dates provided
    today = date.today()
    if start_date_param:
        try:
            start_date = datetime.strptime(start_date_param, '%Y-%m-%d').date()
        except ValueError:
            start_date = today
    else:
        # Start from Monday of current week
        start_date = today - timedelta(days=today.weekday())
    
    if end_date_param:
        try:
            end_date = datetime.strptime(end_date_param, '%Y-%m-%d').date()
        except ValueError:
            end_date = start_date + timedelta(days=6)
    else:
        end_date = start_date + timedelta(days=6)
    
    # Get schedules for the date range
    schedules = Schedule.objects.filter(
        room=room,
        date__range=[start_date, end_date]
    ).order_by('date', 'start_time')
    
    # Group schedules by date
    schedule_data = {}
    for schedule in schedules:
        date_str = schedule.date.isoformat()
        if date_str not in schedule_data:
            schedule_data[date_str] = []
        schedule_data[date_str].append(ScheduleSerializer(schedule).data)
    
    return Response({
        'room': {
            'id': room.id,
            'name': room.name,
            'number': room.number,
            'department': room.department.name,
            'capacity': room.capacity,
            'room_type': room.room_type
        },
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'schedules': schedule_data
    })


@api_view(['GET'])
def today_schedule(request):
    """Get all schedules for today across all rooms"""
    today = date.today()
    schedules = Schedule.objects.filter(
        date=today,
        status__in=['scheduled', 'in_progress']
    ).select_related('room', 'room__department').order_by('start_time')
    
    return Response({
        'date': today.isoformat(),
        'schedules': ScheduleSerializer(schedules, many=True).data
    })


@api_view(['POST'])
def update_schedule_status(request, schedule_id):
    """Update the status of a schedule"""
    schedule = get_object_or_404(Schedule, id=schedule_id)
    new_status = request.data.get('status')
    
    if new_status not in dict(Schedule.STATUS_CHOICES):
        return Response(
            {'error': 'Invalid status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    schedule.status = new_status
    schedule.save()
    
    return Response({
        'message': f'Schedule status updated to {new_status}',
        'schedule': ScheduleSerializer(schedule).data
    })
