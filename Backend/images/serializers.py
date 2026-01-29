from rest_framework import serializers
from .models import UploadedImage, Assessment

class UploadedImageSerializer(serializers.ModelSerializer):
    """
    Serializer for uploaded images.
    """
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'image_url', 'image_full_url', 'uploaded_at', 'description', 'uploaded_by']
        read_only_fields = ['uploaded_at']
    
    def get_image_url(self, obj):
        """
        Get the full URL of the uploaded image.
        """
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

from patient.serializers import PatientSerializer

class AssessmentSerializer(serializers.ModelSerializer):
    """
    Serializer for physiological assessments.
    """
    image_details = UploadedImageSerializer(source='images', many=True, read_only=True)
    patient_details = PatientSerializer(source='related_patient', read_only=True)
    
    class Meta:
        model = Assessment
        fields = [
            'id', 'patient_id', 'related_patient', 'patient_details', 'clinician', 
            'date', 'notes', 'stage', 'wound_type', 'exudate', 'pain_level', 
            'length', 'width', 'depth', 'location', 'body_part', 'images', 'image_details'
        ]
        read_only_fields = ['date', 'clinician', 'related_patient', 'images']
