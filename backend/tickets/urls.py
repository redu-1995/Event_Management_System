# tickets/urls.py
from django.urls import path
from . import views  # Make sure views.py exists in the tickets app

urlpatterns = [
    path('test/', views.ticket_test, name='ticket_test'),
]
