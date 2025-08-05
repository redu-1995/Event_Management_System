# tickets/serializers.py

from rest_framework import serializers
from .models import Ticket
from users.serializers import CustomUserSerializer
from events.serializers import LightEventSerializer

class TicketSerializer(serializers.ModelSerializer):
    attendee = CustomUserSerializer(read_only=True)
    event = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all())  # For POST
    event_info = LightEventSerializer(source='event', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'event', 'event_info', 'attendee', 'purchase_date']
        read_only_fields = ['attendee', 'purchase_date']


# Minimal version to avoid infinite loop in EventSerializer
class BasicTicketSerializer(serializers.ModelSerializer):
    attendee = serializers.CharField(source='attendee.username', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'purchase_date', 'attendee']

