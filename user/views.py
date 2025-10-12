from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView

from django.shortcuts import get_object_or_404
from django.core.cache import cache

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from myproject.utils import api_response
from .serializers import (
    LoginUserSerializer,
    RegisterUserSerializer,
    UserSerializer, 
    UserProfileSerializer, 
    SendOTPSerializer, 
    ValidateOTPSerializer, 
    ChangePasswordSerializer
)
from .models import UserProfile, User
from .permissions import IsOwnerOrReadOnly
from .tasks import send_otp
from .utils import generate_otp

class UserListAPIView(APIView):

    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_description="Retrieve a list of all users (admin only).",
        responses={
            200: openapi.Response("List of users", UserSerializer(many=True)),
            403: openapi.Response("Forbidden")
        },
        tags=["User"]
    )
    def get(self, request):
        queryset = User.objects.all()

        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDetailsAPIView(APIView):
    
    permission_classes = [IsOwnerOrReadOnly]

    @swagger_auto_schema(
        operation_description="Retrieve details of a user by ID.",
        responses={
            200: openapi.Response("User details", UserSerializer()),
            404: openapi.Response("User not found")
        },
        tags=["User"]
    )
    def get(self, request, id):
        
        queryset = get_object_or_404(User, id=id)
        serializer = UserSerializer(queryset)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_description="Update user details by ID.",
        request_body=UserSerializer,
        responses={
            200: openapi.Response("User updated successfully", UserSerializer()),
            400: openapi.Response("Validation error"),
            404: openapi.Response("User not found")
        },
        tags=["User"]
    )
    def put(self, request, id):
        user = User.objects.get(id=id)
        serializer = UserSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileAPIView(APIView):

    permission_classes = [IsOwnerOrReadOnly]

    @swagger_auto_schema(
        operation_description="Retrieve user profile by ID.",
        responses={
            200: openapi.Response("Profile details", UserProfileSerializer()),
            404: openapi.Response("Profile not found")
        },
        tags=["User"]
    )
    def get(self, request, id):

        queryset = get_object_or_404(UserProfile, id=id)
        serializer = UserProfileSerializer(queryset)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Update user profile by ID.",
        request_body=UserProfileSerializer,
        responses={
            200: openapi.Response("Profile updated successfully", UserProfileSerializer()),
            400: openapi.Response("Validation error"),
            404: openapi.Response("Profile not found")
        },
        tags=["User"]
    )    
    def put(self, request, id):

        queryset = get_object_or_404(UserProfile, id=id)
        serializer = UserProfileSerializer(queryset, data=request.data)

        if serializer.is_valid():
            serializer.save()
        
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class LoginAPIView(APIView):

#     permission_classes = [AllowAny]    

#     @swagger_auto_schema(
#         operation_description="Login user and create a session.",
#         request_body=LoginSerializer,
#         responses={
#             200: openapi.Response("Login successful"),
#             400: openapi.Response("Invalid credentials")
#         },
#         tags=["Auth"]
#     )
#     def post(self, request):
#         serializer = LoginSerializer(data = request.data)

#         if serializer.is_valid():
#             user = serializer.validated_data['user']

#             #creating the sessions
#             login(request, user)

#             return Response({
#                 "message": "Login successful",
#                 "username": user.username,
#             }, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class RegisterAPIView(APIView):
    
#     permission_classes = [AllowAny]

#     @swagger_auto_schema(
#         operation_description="Register a new user.",
#         request_body=RegisterSerializer,
#         responses={
#             201: openapi.Response("User registered successfully"),
#             400: openapi.Response("Validation error")
#         },
#         tags=["Auth"]
#     )
#     def post(self, request):
#         serializer = RegisterSerializer(data = request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({   
#                 "message": "Register successful",
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Register a new user.",
        request_body=RegisterUserSerializer,
        responses={
            201: openapi.Response("User registered successfully"),
            400: openapi.Response("Validation error")
        },
        tags=["Auth"]
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return api_response(
                result={
                    "message": "User created successfully",
                },
                is_success=True,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            is_success=False,
            error_message=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
   


class LoginView(TokenObtainPairView):
    serializer_class = LoginUserSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Login user and create a session.",
        request_body=LoginUserSerializer,
        responses={
            200: openapi.Response("Login successful"),
            400: openapi.Response("Invalid credentials")
        },
        tags=["Auth"]
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        return api_response(
            result=response.data,
            is_success=True,
            status_code=status.HTTP_200_OK
        )

class SendOTPView(APIView):

    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="Send OTP to email address.",
        request_body=SendOTPSerializer,
        responses={
            200: openapi.Response("OTP sent successfully"),
            400: openapi.Response("Validation error")
        },
        tags=["Auth"]
    )
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = generate_otp()
            cache.set(f"otp:{email}", otp_code, timeout=300)
            send_otp.delay(email, otp_code)

            return Response({"message": "OTP send to email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ValidateOTPView(APIView):

    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Validate the OTP sent to user's email.",
        request_body=ValidateOTPSerializer,
        responses={
            200: openapi.Response("OTP verified successfully"),
            400: openapi.Response("Invalid or expired OTP")
        },
        tags=["Auth"]
    )
    def post(self, request):
        serializer = ValidateOTPSerializer(data=request.data)

        if serializer.is_valid():
            return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordAPIView(APIView):

    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Change user password.",
        request_body=ChangePasswordSerializer,
        responses={
            200: openapi.Response("Password changed successfully"),
            400: openapi.Response("Validation error")
        },
        tags=["Auth"]
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)