from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from django.urls import reverse

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    Welcome to the Wound Assessment API.
    Click the links below to navigate.
    """
    return Response({
        "message": "Welcome to the Wound Assessment API",
        "status": "running",
        "admin_panel": request.build_absolute_uri('/admin/'),
        "authentication": {
            "login": request.build_absolute_uri(reverse('login')),
            "logout": request.build_absolute_uri(reverse('logout')),
            "user_info": request.build_absolute_uri(reverse('user_info')),
        },
        "images": {
            "list_and_create": request.build_absolute_uri(reverse('list_images')),
            "upload_endpoint": request.build_absolute_uri(reverse('upload_image')),
        },
        "documentation": "See README.md for full usage details"
    })
