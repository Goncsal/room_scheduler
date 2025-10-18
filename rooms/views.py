from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Department, Room
from .serializers import DepartmentSerializer, RoomSerializer, RoomDetailSerializer
from datetime import date, datetime


class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class RoomListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        queryset = Room.objects.filter(is_active=True)
        department = self.request.query_params.get('department', None)
        room_type = self.request.query_params.get('type', None)
        search = self.request.query_params.get('search', None)

        if department:
            queryset = queryset.filter(department_id=department)
        if room_type:
            queryset = queryset.filter(room_type=room_type)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(number__icontains=search) | 
                Q(equipment__icontains=search)
            )

        return queryset


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomDetailSerializer


@api_view(['GET'])
def room_availability(request, room_id):
    """Get current availability status of a room"""
    room = get_object_or_404(Room, id=room_id, is_active=True)
    
    now = datetime.now()
    current_date = now.date()
    current_time = now.time()
    
    # Get current schedule
    current_schedule = room.schedules.filter(
        date=current_date,
        start_time__lte=current_time,
        end_time__gt=current_time,
        status__in=['scheduled', 'in_progress']
    ).first()
    
    # Get next schedule today
    next_schedule = room.schedules.filter(
        date=current_date,
        start_time__gt=current_time,
        status__in=['scheduled', 'in_progress']
    ).order_by('start_time').first()
    
    # Determine availability status
    is_available = current_schedule is None
    
    data = {
        'room': RoomSerializer(room).data,
        'is_available': is_available,
        'current_schedule': None,
        'next_schedule': None,
        'checked_at': now.isoformat()
    }
    
    if current_schedule:
        from schedules.serializers import ScheduleSerializer
        data['current_schedule'] = ScheduleSerializer(current_schedule).data
    
    if next_schedule:
        from schedules.serializers import ScheduleSerializer
        data['next_schedule'] = ScheduleSerializer(next_schedule).data
    
    return Response(data)


@api_view(['POST'])
def regenerate_qr_code(request, room_id):
    """Regenerate QR code for a room"""
    room = get_object_or_404(Room, id=room_id)
    
    # Delete old QR code if exists
    if room.qr_code:
        room.qr_code.delete()
    
    # Generate new QR code
    room.generate_qr_code()
    
    return Response({
        'message': 'QR code regenerated successfully',
        'qr_code_url': room.qr_code.url if room.qr_code else None
    })
