from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'location', 'category']
    permission_classes = [AllowAny]  # Public can view; auth required to create

    def get_queryset(self):
        try:
            user = self.request.user
            if user.is_authenticated and hasattr(user, 'role') and user.role == 'organizer':
                return Event.objects.filter(organizer=user)
            return Event.objects.all()
        except Exception as e:
            print("Error in get_queryset:", e)
            return Event.objects.none()


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})  # 🔁 Pass request to serializer
        return context

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)
