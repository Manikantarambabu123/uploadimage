from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UploadedImage, Assessment
from .serializers import UploadedImageSerializer, AssessmentSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """
    Upload a new image. Only PNG and JPG files up to 10MB are allowed.
    """
    serializer = UploadedImageSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        # Save the image with the current user
        instance = serializer.save(uploaded_by=request.user)
        
        # Save the full absolute URL to the database
        if instance.image:
             full_url = request.build_absolute_uri(instance.image.url)
             instance.image_full_url = full_url
             instance.save(update_fields=['image_full_url'])
        return Response(
            {
                'message': 'Image uploaded successfully',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        {
            'message': 'Image upload failed',
            'errors': serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_images(request):
    """
    List all images uploaded by the current user.
    """
    images = UploadedImage.objects.filter(uploaded_by=request.user)
    serializer = UploadedImageSerializer(images, many=True, context={'request': request})
    
    return Response(
        {
            'count': images.count(),
            'images': serializer.data
        },
        status=status.HTTP_200_OK
    )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_image(request, image_id):
    """
    Delete a specific image by ID.
    """
    try:
        image = UploadedImage.objects.get(id=image_id, uploaded_by=request.user)
        image.delete()
        return Response(
            {'message': 'Image deleted successfully'},
            status=status.HTTP_200_OK
        )
    except UploadedImage.DoesNotExist:
        return Response(
            {'message': 'Image not found or you do not have permission to delete it'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_assessment(request):
    """
    Create a new assessment with uploaded images and notes.
    """
    serializer = AssessmentSerializer(data=request.data)
    if serializer.is_valid():
        from .models import AssessmentImage, UploadedImage
        
        # Try to link to a Patient record using the provided MRN (patient_id field)
        patient_mrn = serializer.validated_data.get('patient_id')
        related_patient = None
        if patient_mrn:
            from patient.models import Patient
            try:
                related_patient = Patient.objects.get(mrn=patient_mrn)
            except Patient.DoesNotExist:
                pass

        # Save assessment first without M2M field
        details = request.data.get('clinical_details', {})
        measurements = details.get('measurements', {})
        
        assessment = serializer.save(
            clinician=request.user, 
            related_patient=related_patient,
            stage=request.data.get('stage', details.get('stage', 'Stage 1')),
            wound_type=details.get('woundType'),
            exudate=details.get('exudate'),
            pain_level=details.get('painLevel', 0),
            length=measurements.get('length'),
            width=measurements.get('width'),
            depth=measurements.get('depth'),
            location=details.get('location'),
            body_part=details.get('part')
        )
        
        # Manually handle the M2M through model
        image_ids = request.data.get('images', [])
        for img_id in image_ids:
            try:
                img_obj = UploadedImage.objects.get(id=img_id)
                # Create the through model instance with the explicit URL
                full_url = img_obj.image_full_url
                if not full_url and img_obj.image:
                     full_url = request.build_absolute_uri(img_obj.image.url)

                AssessmentImage.objects.create(
                    assessment=assessment,
                    uploaded_image=img_obj,
                    image_url=full_url
                )
            except UploadedImage.DoesNotExist:
                 continue

        return Response(
            {
                'message': 'Assessment created successfully',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_assessments(request):
    """
    List all assessments for the current clinician.
    """
    assessments = Assessment.objects.filter(clinician=request.user)
    serializer = AssessmentSerializer(assessments, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_assessment(request, assessment_id):
    """
    Delete a specific assessment by ID.
    """
    try:
        assessment = Assessment.objects.get(id=assessment_id, clinician=request.user)
        assessment.delete()
        return Response(
            {'message': 'Assessment deleted successfully'},
            status=status.HTTP_200_OK
        )
    except Assessment.DoesNotExist:
        return Response(
            {'message': 'Assessment not found or you do not have permission to delete it'},
            status=status.HTTP_404_NOT_FOUND
        )
