from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Feedback
from .serializers import FeedbackSerializer
from events.models import Event

class FeedbackListCreateView(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(event_id=self.kwargs['event_id'])

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        event = Event.objects.filter(pk=event_id).first()

        if not event:
            raise ValidationError("Event does not exist.")

        user = self.request.user
        if not user or user.is_anonymous:
            raise ValidationError("Authentication required.")

        # Prevent duplicate feedback
        if Feedback.objects.filter(event=event, attendee=user).exists():
            raise ValidationError("You have already submitted feedback for this event.")

        serializer.save(event=event, attendee=user)

   



