from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'attendee', 'rating', 'created_at',
                     'comment')
    list_filter = ('event', 'rating', 'created_at')
    search_fields = ('event__title', 'attendee__username', 'comment')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
