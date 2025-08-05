from django.db import models
from events.models import Event
from django.conf import settings

class Feedback(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='feedbacks')
    attendee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='feedbacks')
    comment = models.TextField()
    rating = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'attendee')  # Prevent duplicate feedbacks from same user per event

    def __str__(self):
        return f'Feedback by {self.attendee.username} on {self.event.title}'
