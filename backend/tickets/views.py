from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer
from events.serializers import EventSerializer
from rest_framework.response import Response

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(attendee=self.request.user)
class UserTicketedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tickets = Ticket.objects.filter(attendee=user).select_related('event')
        events = [ticket.event for ticket in tickets]
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    
class OrganizerTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_staff and not hasattr(user, 'role') or user.role != 'organizer':
            return Response({"detail": "Not authorized."}, status=403)

        # Get tickets where the event's organizer is the current user
        tickets = Ticket.objects.filter(event__organizer=user).select_related('event', 'attendee')
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)