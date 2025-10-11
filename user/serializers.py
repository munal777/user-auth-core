import os
import re

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

from django.core.cache import cache

from .models import User, UserProfile


class RegisterUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'password',
            'confirm_password',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_email(self, value):
        """Check if the email is already taken."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def validate_phone_number(self, value):
        """Validate phone number format."""
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if len(value) < 7 or len(value) > 15:
            raise serializers.ValidationError("Phone number length must be between 7 and 15 digits.")
        return value
    
    def validate_password(self, value):
        """Validate password strength"""
        # 1. Minimum length
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        
        # 2. Must contain at least one letter (any case)
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        
        # 3. Must contain at least one number or one special character
        if not re.search(r'[\d@$!%*#?&]', value):
            raise serializers.ValidationError(
                "Password must contain at least one number or one special character"
            )
        
        return value    

    def validate(self, attrs):
        """Check if passwords match."""
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        """Use the custom manager to create the user."""
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user
    

class LoginUserSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        try:
            data = super().validate(attrs)    
        except AuthenticationFailed:
            raise serializers.ValidationError(
                {"detail": "Invalid email or password"}
            )

        data.update({
            "user": {
                "role": self.user.role,
            }
        })

        return data



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model= User
        fields= ['id', 'username', 'email', 'password']
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only':True, 'required': False}
        }
        
    def validate(self, attrs):

        username = attrs.get('username')
        email = attrs.get('email')
        user = self.instance

        if User.objects.filter(username= username).exclude(id=user.id).exists():
            raise serializers.ValidationError("Username Already exists")
        
        if User.objects.filter(email= email).exclude(id=user.id).exists():
            raise serializers.ValidationError("Email already exists")
        
        return attrs
        
    
    def update(self, instance, validated_data):

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'user','profileImage']
        read_only_fields = ['id']
    
    def validate_profileImage(self, value):

        max_size = 5 * 1024 * 1024
        if value.size > max_size:
             raise serializers.ValidationError("Image size should not exceed 5 MB.")
        
        valid_mime_types = ['image/jpeg', 'image/png']
        if value.content_type not in valid_mime_types:
            raise serializers.ValidationError("Unsupported image type. Allowed types: jpg, png.")
        
        valid_extensions = ['.jpg', '.jpeg', '.png']
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError("Unsupported file extension.")

        return value
            
        
    def update(self, instance, validated_data):

        instance.profileImage = validated_data.get('profileImage', instance.profileImage)
        instance.save()
        return instance


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get('email', '')
        if not User.objects.filter(email= email).exists():
            raise serializers.ValidationError("No account exist with this email.")

        return attrs        



class ValidateOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        otp = attrs.get("otp")

        key= f"otp:{email}"
        stored_otp = cache.get(key)

        if stored_otp is None:
            raise serializers.ValidationError("OTP has expired or was not found.")
        
        if stored_otp != otp:
            raise serializers.ValidationError("Invalid OTP.")
        
        # OTP is valid, now mark as verified
        cache.delete(key)
        cache.set(f"otp_verified:{email}", True, timeout=300)
        
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        verified_key = f"otp_verified:{email}"

        if not cache.get(verified_key):
            raise serializers.ValidationError("OTP not verified or expired.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        if user.check_password(password):
            raise serializers.ValidationError("New password can’t be the same as the old one.")

        attrs["user"] = user

        return attrs
    

    def save(self):
        user = self.validated_data["user"]
        new_password = self.validated_data["password"]

        verified_key = f"otp_verified:{user.email}"

        user.set_password(new_password)
        user.save()

        cache.delete(verified_key)