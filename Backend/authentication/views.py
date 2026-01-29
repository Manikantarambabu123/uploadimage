from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .serializers import LoginSerializer, UserSerializer
from .models import OTP


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login endpoint that authenticates credentials and sends OTP.
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generate and save OTP
        otp_code = OTP.generate_code()
        OTP.objects.create(user=user, code=otp_code)
        
        # Send OTP via email
        try:
            subject = 'Your OTP for Wound Assessment Tool'
            message = f'Hello {user.username},\n\nYour One-Time Password (OTP) for login is: {otp_code}\n\nThis code will expire in 10 minutes.'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]
            
            send_mail(subject, message, from_email, recipient_list)
            
            return Response({
                'message': 'OTP sent to your email',
                'require_otp': True,
                'email': user.email
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'message': 'Failed to send OTP. Please try again later.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'message': 'Login failed',
        'errors': serializer.errors
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verify OTP and issue JWT tokens.
    """
    username = request.data.get('username')
    otp_code = request.data.get('otp')
    
    if not username or not otp_code:
        return Response({'message': 'Username and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    from django.contrib.auth.models import User
    try:
        print(f"Verifying OTP for username: {username} with code: {otp_code}")
        # If username is an email, get the user object first
        if '@' in username:
            # Safe lookup: if multiple users have same email, take the first one
            user = User.objects.filter(email=username).first()
            if not user:
                print("User not found by email")
                return Response({'message': 'User with this email not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            user = User.objects.filter(username=username).first()
            if not user:
                print("User not found by username")
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        print(f"Found user: {user.id}")
        # Get the latest unverified OTP for the user
        otp_obj = OTP.objects.filter(user=user, is_verified=False).order_by('-created_at').first()
        
        if not otp_obj:
            print("No OTP obj found")
            return Response({'message': 'No OTP found. Please login again.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if otp_obj.is_expired():
            print("OTP expired")
            return Response({'message': 'OTP has expired. Please login again.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if otp_obj.code == otp_code:
            print("OTP matches, verifying...")
            otp_obj.is_verified = True
            otp_obj.save()
            print("OTP saved as verified.")
            
            # Update last login time manually
            from django.utils import timezone
            user.last_login = timezone.now()
            print("Updating last_login...")
            user.save(update_fields=['last_login'])
            print("User saved.")
            
            # Generate JWT tokens
            print("Generating tokens...")
            refresh = RefreshToken.for_user(user)
            print("Tokens generated.")
            
            return Response({
                'message': 'Email verified successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        else:
            print("OTP mismatch")
            return Response({'message': 'Invalid OTP code'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        import traceback
        print(traceback.format_exc()) # Print stack trace to console for debugging
        return Response({
            'message': 'An internal error occurred during verification.',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout endpoint (optional).
    """
    return Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def auth_index(request):
    """
    Helper view to list auth endpoints.
    """
    return Response({
        "message": "Authentication Endpoints",
        "endpoints": {
            "login": "/api/auth/login/",
            "verify_otp": "/api/auth/verify-otp/",
            "logout": "/api/auth/logout/",
            "user_info": "/api/auth/me/"
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """
    Get current user information.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
