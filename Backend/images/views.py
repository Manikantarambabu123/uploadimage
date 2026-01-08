from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UploadedImage
from .serializers import UploadedImageSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """
    Upload a new image. Only PNG and JPG files up to 10MB are allowed.
    """
    serializer = UploadedImageSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        # Save the image with the current user
        serializer.save(uploaded_by=request.user)
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
