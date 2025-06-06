from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import UserProfile
import os
from django.core.cache import cache

User = get_user_model()

class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=25)
    password = serializers.CharField(write_only=True)


    def validate(self, attrs):

        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid username or password")
        
        attrs['user'] = user

        return attrs

class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=15 ,required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        username = attrs['username']
        email = attrs['email']
        password = attrs['password']

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists.")

        if not password or len(password) < 8:
            raise serializers.ValidationError("Create a Strong password")
        
        return attrs
    
    def create(self, validated_data):

        return User.objects.create_user(**validated_data)
    


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


class ChangePaswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not User.objects.filter(email = email).exists():
            raise serializers.ValidationError("User does not exist.")
        
        stored_verified_otp = cache.get(f"otp_verified:{email}")

        if stored_verified_otp:
            pass