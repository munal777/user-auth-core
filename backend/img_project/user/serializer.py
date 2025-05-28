from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

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
        fields= ['id', 'username', 'password']
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
        
        if User.objects.filter(email= email).exclude(email=user.email).exists():
            raise serializers.ValidationError("Email already exists")
        
        return attrs
        
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance