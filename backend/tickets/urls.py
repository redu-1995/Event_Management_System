from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet
from .views import UserTicketedEventsView
from .views import OrganizerTicketsView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('my-ticketed-events/', UserTicketedEventsView.as_view(), name='my-ticketed-events'),
    path('organizer/tickets/', OrganizerTicketsView.as_view(), name='organizer-tickets'),
]
