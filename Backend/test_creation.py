
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wound_backend.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth import get_user_model
from images.views import create_assessment
from images.models import UploadedImage, Assessment

def test_creation():
    User = get_user_model()
    user = User.objects.first() # Get a user to authenticate
    if not user:
        print("No user found!")
        return

    # Find an image
    img = UploadedImage.objects.first()
    if not img:
        print("No images found!")
        return

    print(f"Testing with Image ID: {img.id}, User: {user.username}")

    factory = APIRequestFactory()
    data = {
        'patient_id': 'TEST-MRN',
        'notes': 'Debug Assessment Creation',
        'images': [img.id]
    }
    
    request = factory.post('/api/images/assessments/create/', data, format='json')
    force_authenticate(request, user=user)
    
    print("Sending Request...")
    response = create_assessment(request)
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.data}")

    if response.status_code == 201:
        # Check if linked
        assess_id = response.data['data']['id']
        assess = Assessment.objects.get(id=assess_id)
        print(f"Assessment Created: {assess.id}")
        print(f"Linked Images Count: {assess.images.count()}")
        if assess.images.count() > 0:
            print("SUCCESS: Image linked!")
        else:
            print("FAILURE: Image NOT linked.")

if __name__ == '__main__':
    test_creation()
