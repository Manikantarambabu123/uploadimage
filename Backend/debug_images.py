
import os
import django
import sys
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wound_backend.settings')
django.setup()

from images.models import Assessment, UploadedImage
from images.serializers import AssessmentSerializer
from rest_framework.test import APIRequestFactory

def debug_assessments():
    print("--- Debugging Assessments ---")
    
    # fake request for context
    factory = APIRequestFactory()
    request = factory.get('/')

    assessments = Assessment.objects.select_related('related_patient').prefetch_related('images').all().order_by('-date')
    
    for assessment in assessments:
        patient_name = assessment.related_patient.name if assessment.related_patient else "Unknown"
        mrn = assessment.related_patient.mrn if assessment.related_patient else assessment.patient_id
        
        print(f"\nAssessment ID: {assessment.id}")
        print(f"Patient: {patient_name} ({mrn})")
        print(f"Date: {assessment.date}")
        
        # Check raw M2M
        images = assessment.images.all()
        print(f"Image Count (DB): {images.count()}")
        for img in images:
            print(f"  - Image ID: {img.id}, Path: {img.image}")

        # Check Serializer Output
        serializer = AssessmentSerializer(assessment, context={'request': request})
        data = serializer.data
        image_details = data.get('image_details', [])
        print(f"Serializer image_details: {len(image_details)} items")
        for img_detail in image_details:
             print(f"  - URL: {img_detail.get('image_url')}")

if __name__ == '__main__':
    debug_assessments()
