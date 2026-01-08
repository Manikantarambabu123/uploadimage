from django.db import models
from django.contrib.auth.models import User
from .validators import validate_image_format, validate_image_size

class UploadedImage(models.Model):
    """
    Model for storing uploaded images with validation.
    Only PNG and JPG files up to 10MB are allowed.
    """
    image = models.ImageField(
        upload_to='wounds/%Y/%m/%d/',
        validators=[validate_image_format, validate_image_size]
    )
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='uploaded_images',
        null=True,
        blank=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Image uploaded on {self.uploaded_at.strftime('%Y-%m-%d %H:%M')}"

class Assessment(models.Model):
    """
    Clinical assessment model linking images and notes.
    """
    patient_id = models.CharField(max_length=100, default="Unknown")
    clinician = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    images = models.ManyToManyField(UploadedImage, related_name='assessments', blank=True)
    
    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"Assessment {self.id} - {self.patient_id} ({self.date.strftime('%Y-%m-%d')})"
