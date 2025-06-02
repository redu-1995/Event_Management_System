from rest_framework import serializers
from .models import Ticket
from users.serializers import CustomUserSerializer
from events.serializers import EventSerializer  # adjust path if needed

class TicketSerializer(serializers.ModelSerializer):
    attendee = CustomUserSerializer(read_only=True)
    event = EventSerializer(read_only=True)  # display full event details
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Ticket._meta.get_field('event').remote_field.model.objects.all(),
        source='event',
        write_only=True
    )

    class Meta:
        model = Ticket
        fields = ['id', 'event', 'event_id', 'attendee', 'purchase_date']
        read_only_fields = ['attendee', 'purchase_date']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['attendee'] = request.user
        return super().create(validated_data)
