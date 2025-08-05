from django.db import models
from django.conf import settings
from events.models import Event

class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    chapa_tx_ref = models.CharField(max_length=100, unique=True)
    chapa_status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

def save(self, *args, **kwargs):
        if self.event:
            self.amount = self.event.price
        super().save(*args, **kwargs)