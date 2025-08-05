from django.db import models
from django.conf import settings

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('concert', 'Concert'),
        ('conference', 'Conference'),
        ('festival', 'Festival'),
        ('theater', 'Theater'),
        ('sports', 'Sports'),
        ('workshop', 'Workshop'),
        ('other', 'Other'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    created_at = models.DateTimeField(auto_now_add=True)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')

    def __str__(self):
        return self.title
