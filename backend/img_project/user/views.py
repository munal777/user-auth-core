from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializer import LoginSerializer, RegisterSerializer, UserSerializer, UserProfileSerializer, SendOTPSerializer
from django.contrib.auth import login, get_user_model
from django.shortcuts import get_object_or_404
from .models import UserProfile
from utils import send_otp_to_email
from rest_framework.permissions import AllowAny, IsAdminUser
from .permissions import IsOwnerOrReadOnly

User = get_user_model()


class UserListAPIView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):
        queryset = User.objects.all()

        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDetailsAPIView(APIView):
    
    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request, id):
        
        queryset = get_object_or_404(User, id=id)
        serializer = UserSerializer(queryset)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, id):
        user = User.objects.get(id=id)
        serializer = UserSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileAPIView(APIView):

    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request, id):

        queryset = get_object_or_404(UserProfile, id=id)
        serializer = UserProfileSerializer(queryset)

        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def put(self, request, id):

        queryset = get_object_or_404(UserProfile, id=id)
        serializer = UserProfileSerializer(queryset, data=request.data)

        if serializer.is_valid():
            serializer.save()
        
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginAPIView(APIView):

    permission_classes = [AllowAny]    

    def post(self, request):
        serializer = LoginSerializer(data = request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            #creating the sessions
            login(request, user)

            return Response({
                "message": "Login successful",
                "username": user.username,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RegisterAPIView(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({   
                "message": "Register successful",
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

class SendOTPView(APIView):

    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            send_otp_to_email(email)

            return Response({"message": "OTP send to email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)