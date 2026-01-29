from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import UploadedImage, Assessment

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_id', 'clinician', 'date', 'short_notes']
    list_editable = ['patient_id']
    list_filter = ['date', 'clinician', 'patient_id']
    search_fields = ['patient_id', 'notes']
    # filter_horizontal = ['images'] # Not supported with 'through' model
    
    def short_notes(self, obj):
        return obj.notes[:50] + '...' if obj.notes else ''
    short_notes.short_description = 'Notes'

@admin.register(UploadedImage)
class UploadedImageAdmin(admin.ModelAdmin):
    """
    Admin interface for uploaded images.
    """
    list_display = ['id', 'uploaded_by', 'uploaded_at', 'description', 'image_preview_list']
    list_editable = ['description']
    list_filter = ['uploaded_at', 'uploaded_by']
    search_fields = ['uploaded_by__username', 'description']
    readonly_fields = ['uploaded_at', 'image_preview']
    actions = ['update_selected_metadata']

    @admin.action(description="Update selected images metadata")
    def update_selected_metadata(self, request, queryset):
        # Placeholder for custom logic
        updated = queryset.count()
        self.message_user(request, f"Successfully updated {updated} images.")
    
    fieldsets = (
        (None, {
            'fields': ('image', 'uploaded_by', 'description')
        }),
        ('Info', {
            'fields': ('uploaded_at', 'image_preview')
        }),
    )

    def image_preview_list(self, obj):
        """Image preview for the list view."""
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="max-height: 50px; max-width: 50px; border-radius: 4px;" />')
        return 'No image'
    image_preview_list.short_description = 'Preview'

    def image_preview(self, obj):
        """Image preview for the detail/edit view."""
        if obj.image:
            return mark_safe(f'<img id="image-preview" src="{obj.image.url}" style="max-height: 300px; max-width: 100%; border: 1px solid #ccc; border-radius: 8px; padding: 5px;" />')
        return mark_safe('<img id="image-preview" src="" style="max-height: 300px; max-width: 100%; border: 1px solid #ccc; border-radius: 8px; padding: 5px; display: none;" /><span id="no-image-text">No image</span>')
    
    image_preview.short_description = 'Preview'

    class Media:
        js = ('images/js/admin_image_preview.js',)
