from django.urls import path
from . import views

app_name = 'schedules'

urlpatterns = [
    # Schedule URLs
    path('schedules/', views.ScheduleListCreateView.as_view(), name='schedule-list'),
    path('schedules/<int:pk>/', views.ScheduleDetailView.as_view(), name='schedule-detail'),
    path('schedules/today/', views.today_schedule, name='today-schedule'),
    path('schedules/<int:schedule_id>/status/', views.update_schedule_status, name='update-status'),
    
    # Room schedule URLs
    path('rooms/<int:room_id>/schedule/', views.room_schedule, name='room-schedule'),
]
