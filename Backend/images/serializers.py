from rest_framework import serializers
from .models import UploadedImage

class UploadedImageSerializer(serializers.ModelSerializer):
    """
    Serializer for uploaded images.
    """
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'image_url', 'uploaded_at', 'description', 'uploaded_by']
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
