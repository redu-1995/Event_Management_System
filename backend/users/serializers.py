from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    is_organizer = serializers.SerializerMethodField()
    is_attendee = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'is_organizer', 'is_attendee']

    def get_is_organizer(self, obj):
        return obj.role == 'organizer'

    def get_is_attendee(self, obj):
        return obj.role == 'attendee'


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'attendee'),  # default role is 'attendee'
        )
        return user
