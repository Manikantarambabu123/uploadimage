from rest_framework import serializers
from .models import Patient, PatientAssignment
from django.contrib.auth.models import User
from authentication.serializers import UserSerializer

class PatientSerializer(serializers.ModelSerializer):
    active_wounds = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ['id', 'name', 'mrn', 'dob', 'gender', 'blood_group', 'bed_number', 'ward', 
                  'admission_date', 'diagnosis', 'created_at', 'updated_at', 'risk_level', 'active_wounds', 
                  'assigning_physician', 'contact_number', 'address', 'emergency_contact_name', 'emergency_contact_number']

    def get_active_wounds(self, obj):
        return obj.assessments.count()

class PatientAssignmentSerializer(serializers.ModelSerializer):
    nurse_details = UserSerializer(source='nurse', read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)
    assigned_by_details = UserSerializer(source='assigned_by', read_only=True)

    class Meta:
        model = PatientAssignment
        fields = ['id', 'patient', 'nurse', 'assigned_by', 'assigned_at', 'active', 'nurse_details', 'patient_details', 'assigned_by_details']
        read_only_fields = ['assigned_by', 'assigned_at']

class AssignPatientSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField()
    nurse_id = serializers.IntegerField()
