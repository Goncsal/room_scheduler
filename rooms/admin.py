from django.contrib import admin
from .models import Department, Room


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'number', 'department', 'room_type', 'capacity', 'is_active']
    list_filter = ['department', 'room_type', 'is_active', 'floor']
    search_fields = ['name', 'number', 'equipment']
    readonly_fields = ['qr_code', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'number', 'department', 'room_type')
        }),
        ('Details', {
            'fields': ('capacity', 'equipment', 'floor', 'building')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('QR Code', {
            'fields': ('qr_code',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['regenerate_qr_codes']
    
    def regenerate_qr_codes(self, request, queryset):
        for room in queryset:
            if room.qr_code:
                room.qr_code.delete()
            room.generate_qr_code()
        self.message_user(request, f'QR codes regenerated for {queryset.count()} rooms.')
    
    regenerate_qr_codes.short_description = "Regenerate QR codes for selected rooms"
