from django.urls import path
from . import views

app_name = 'rooms'

urlpatterns = [
    # Department URLs
    path('departments/', views.DepartmentListCreateView.as_view(), name='department-list'),
    path('departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    
    # Room URLs
    path('rooms/', views.RoomListCreateView.as_view(), name='room-list'),
    path('rooms/<int:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
    path('rooms/<int:room_id>/availability/', views.room_availability, name='room-availability'),
    path('rooms/<int:room_id>/qr-code/regenerate/', views.regenerate_qr_code, name='regenerate-qr'),
]
