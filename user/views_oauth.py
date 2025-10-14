from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny

from .models import User
from myproject.utils import api_response

@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth(request):
    token = request.data.get("token")

    if not token:
        return api_response(
            result=None,
            is_success=False,
            error_message="Token not provided",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    try:
        id_info = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_OAUTH_CLIENT_ID
        )

        email = id_info['email']
        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')

        try:
            user = User.objects.get(email=email)
            created = False
        except User.DoesNotExist:
            created = True
            user = User(
                email=email,
            )

        if created:
            user.set_unusable_password()

            # Generate unique username
            base_username = f"{first_name.lower()}.{last_name.lower()}".replace(' ', '_')
            if not base_username or base_username == ".":
                base_username = email.split('@')[0]
            
            # Ensure uniqueness
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            
            user.username = username
            
            user.registration_method = User.REGISTRATION_CHOICES.GOOGLE
            user.save()
        else:
            if user.registration_method != User.REGISTRATION_CHOICES.GOOGLE:
                return api_response(
                    result=None,
                    is_success=False,
                    error_message="User needs to sign in through email",
                    status_code=status.HTTP_403_FORBIDDEN
                )

        refresh = RefreshToken.for_user(user)
        return api_response(
            result={
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            is_success=True,
            error_message=None,
            status_code=status.HTTP_200_OK
        )

    except ValueError:
        return api_response(
            result=None,
            is_success=False,
            error_message="Invalid token",
            status_code=status.HTTP_400_BAD_REQUEST
        )