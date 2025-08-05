from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('organizer', 'Organizer'),
        ('attendee', 'Attendee'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"

    def save(self, *args, **kwargs):
        if self.pk:
            old_role = CustomUser.objects.get(pk=self.pk).role
            if old_role and self.role != old_role:
                raise ValidationError("Role cannot be changed once set.")
        super().save(*args, **kwargs)
