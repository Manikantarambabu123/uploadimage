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
    image_full_url = models.CharField(max_length=500, blank=True, null=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Image uploaded on {self.uploaded_at.strftime('%Y-%m-%d %H:%M')}"

class AssessmentImage(models.Model):
    assessment = models.ForeignKey('Assessment', on_delete=models.CASCADE)
    uploaded_image = models.ForeignKey(UploadedImage, on_delete=models.CASCADE, db_column='uploadedimage_id')
    image_url = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'images_assessment_images' # Attempt to keep the table name similar if desired, or let Django default.
                                             # Using specific name to match user expectation if possible.

class Assessment(models.Model):
    """
    Clinical assessment model linking images and notes.
    """
    patient_id = models.CharField(max_length=100, default="Unknown")
    related_patient = models.ForeignKey('patient.Patient', on_delete=models.SET_NULL, related_name='assessments', null=True, blank=True)
    clinician = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    stage = models.CharField(max_length=50, default="Stage 1")
    wound_type = models.CharField(max_length=100, blank=True, null=True)
    exudate = models.CharField(max_length=50, blank=True, null=True)
    pain_level = models.IntegerField(default=0)
    length = models.CharField(max_length=20, blank=True, null=True)
    width = models.CharField(max_length=20, blank=True, null=True)
    depth = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    body_part = models.CharField(max_length=100, blank=True, null=True)
    # Use through model for custom fields on the relationship
    images = models.ManyToManyField(UploadedImage, related_name='assessments', blank=True, through='AssessmentImage')
    
    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"Assessment {self.id} - {self.patient_id} ({self.date.strftime('%Y-%m-%d')})"
