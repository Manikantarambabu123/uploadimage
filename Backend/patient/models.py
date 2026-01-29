from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    name = models.CharField(max_length=100)
    mrn = models.CharField(max_length=50, unique=True, verbose_name="Medical Record Number")
    dob = models.DateField(verbose_name="Date of Birth")
    gender = models.CharField(max_length=20, blank=True, null=True) # Added
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    bed_number = models.CharField(max_length=20, blank=True, null=True)
    ward = models.CharField(max_length=50, blank=True, null=True) # Added
    admission_date = models.DateField(null=True, blank=True) # Changed from auto_now_add
    diagnosis = models.TextField(blank=True, null=True) # Added
    assigning_physician = models.CharField(max_length=100, blank=True, null=True)

    # Contact Details
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_number = models.CharField(max_length=15, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Risk Analysis (can be updated by AI or manually)
    RISK_LEVEL_CHOICES = (
        ('High', 'High'),
        ('Moderate', 'Moderate'),
        ('Low', 'Low'),
    )
    risk_level = models.CharField(max_length=10, choices=RISK_LEVEL_CHOICES, default='Low')

    def __str__(self):
        return f"{self.name} ({self.mrn})"

class PatientAssignment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='assignments')
    nurse = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_patients')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assignments_made')
    assigned_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.patient} assigned to {self.nurse} by {self.assigned_by}"
