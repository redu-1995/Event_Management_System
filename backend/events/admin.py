# admin.py
from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'date', 'location', 'organizer')
    list_filter = ('category', 'date', 'location', 'organizer')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "organizer":
            kwargs["queryset"] = db_field.related_model.objects.filter(role='organizer')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Event, EventAdmin)

