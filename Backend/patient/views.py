from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Patient, PatientAssignment
from .serializers import PatientSerializer, PatientAssignmentSerializer, AssignPatientSerializer
from authentication.serializers import UserSerializer
from authentication.models import UserProfile

def is_doctor(user):
    return user.is_superuser or (hasattr(user, 'profile') and user.profile.role == 'DOCTOR')

def is_nurse(user):
    return hasattr(user, 'profile') and user.profile.role == 'NURSE'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_patient(request):
    """
    Endpoint for Doctors to add a new patient.
    """
    if not is_doctor(request.user):
        return Response({'message': 'Access denied. Only Doctors can add patients.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_patient(request):
    """
    Endpoint for Doctors to assign a patient to a nurse.
    """
    if not is_doctor(request.user):
        return Response({'message': 'Access denied. Only Doctors can assign patients.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = AssignPatientSerializer(data=request.data)
    if serializer.is_valid():
        try:
            patient = Patient.objects.get(id=serializer.validated_data['patient_id'])
            nurse = User.objects.get(id=serializer.validated_data['nurse_id'])
            
            # Verify the assignee is actually a nurse
            if not is_nurse(nurse):
                 return Response({'message': 'Selected user is not a Nurse.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create assignment
            assignment, created = PatientAssignment.objects.update_or_create(
                patient=patient,
                defaults={'nurse': nurse, 'assigned_by': request.user, 'active': True}
            )
            
            return Response({'message': f'Patient {patient.name} assigned to Nurse {nurse.get_full_name() or nurse.username}'}, status=status.HTTP_200_OK)
            
        except Patient.DoesNotExist:
            return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'message': 'Nurse not found'}, status=status.HTTP_404_NOT_FOUND)
            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patients(request):
    """
    Get patients list.
    - Doctors see all patients.
    - Nurses see only assigned patients.
    """
    user = request.user
    
    if is_doctor(user) or user.is_superuser:
        patients = Patient.objects.all().order_by('-created_at')
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    
    elif is_nurse(user):
        # Get assignments for this nurse
        assignments = PatientAssignment.objects.filter(nurse=user, active=True).values_list('patient_id', flat=True)
        patients = Patient.objects.filter(id__in=assignments).order_by('-created_at')
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
        
    else:
        return Response({'message': 'Role not authorized to view patients.'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_nurses(request):
    """
    Get list of all nurses (for Doctor to select from).
    """
    # Simply return all users with role='NURSE'
    nurses = User.objects.filter(profile__role='NURSE')
    serializer = UserSerializer(nurses, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def get_patient_profile(request, pk):
    """
    Get or update detailed patient profile.
    """
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        # Check permissions - maybe only doctors can edit?
        if not is_doctor(request.user) and not request.user.is_superuser:
             return Response({'message': 'Access denied. Only Doctors can edit patient details.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PatientSerializer(patient, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
