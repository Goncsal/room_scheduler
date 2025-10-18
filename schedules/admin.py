from django.contrib import admin
from .models import Schedule


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['title', 'room', 'date', 'start_time', 'end_time', 'status', 'instructor']
    list_filter = ['status', 'date', 'room__department', 'room__room_type']
    search_fields = ['title', 'instructor', 'course_code', 'room__name']
    date_hierarchy = 'date'
    ordering = ['-date', 'start_time']
    
    fieldsets = (
        ('Schedule Information', {
            'fields': ('room', 'title', 'description', 'status')
        }),
        ('Course Details', {
            'fields': ('instructor', 'course_code')
        }),
        ('Time & Date', {
            'fields': ('date', 'start_time', 'end_time')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    actions = ['mark_as_completed', 'mark_as_cancelled']
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
        self.message_user(request, f'{queryset.count()} schedules marked as completed.')
    
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, f'{queryset.count()} schedules marked as cancelled.')
    
    mark_as_completed.short_description = "Mark selected schedules as completed"
    mark_as_cancelled.short_description = "Mark selected schedules as cancelled"
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by when creating new schedule
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
