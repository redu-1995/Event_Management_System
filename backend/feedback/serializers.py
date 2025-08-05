# feedback/serializers.py
from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    attendee_username = serializers.ReadOnlyField(source='attendee.username')

    class Meta:
        model = Feedback
        fields = ['id', 'event', 'attendee', 'attendee_username', 'comment', 'rating', 'created_at']
        read_only_fields = ['event', 'attendee', 'created_at']

