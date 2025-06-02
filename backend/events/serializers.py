from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    # Organizer is read-only and set from request.user in the view
    organizer = serializers.ReadOnlyField(source='organizer.id')

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'date', 'organizer']
