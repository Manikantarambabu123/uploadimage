
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wound_backend.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth import get_user_model
from patient.views import get_patients

def debug_patient_fields():
    User = get_user_model()
    user = User.objects.first()
    if not user:
        print("No user found")
        return

    factory = APIRequestFactory()
    request = factory.get('/api/patients/list/')
    force_authenticate(request, user=user)
    
    response = get_patients(request)
    
    if response.status_code == 200:
        data = response.data
        if len(data) > 0:
            first_patient = data[0]
            print("Keys in first patient object:")
            for key, value in first_patient.items():
                print(f"{key}: {value}")
        else:
            print("No patients found.")
    else:
        print(f"Error: {response.status_code}")

if __name__ == '__main__':
    debug_patient_fields()
