# events/serializers.py

from rest_framework import serializers
from .models import Event
from feedback.serializers import FeedbackSerializer

class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.CharField(source='organizer.username', read_only=True)
    tickets = serializers.SerializerMethodField()
    feedbacks = FeedbackSerializer(many=True, read_only=True)

    def get_tickets(self, obj):
        request = self.context.get('request')
        # Avoid circular import
        if request and request.user == obj.organizer:
            from tickets.serializers import BasicTicketSerializer
            return BasicTicketSerializer(obj.tickets.all(), many=True, context={'request': request}).data
        return []

    def get_feedbacks(self, obj):
        request = self.context.get('request')
        # Only allow event organizer to view feedbacks
        if request and request.user == obj.organizer:
            return FeedbackSerializer(obj.feedbacks.all(), many=True).data
        return []

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location', 'date',
            'category', 'organizer', 'price', 'tickets','feedbacks'
        ]


# Lightweight serializer to avoid circular import
class LightEventSerializer(serializers.ModelSerializer):
    organizer = serializers.CharField(source='organizer.username', read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'location', 'date', 'category', 'organizer', 'price']
