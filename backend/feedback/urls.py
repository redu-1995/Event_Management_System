# feedback/urls.py
from django.urls import path
from .views import FeedbackListCreateView

urlpatterns = [
    path('events/<int:event_id>/feedback/', FeedbackListCreateView.as_view(), name='event-feedback-list-create'),
   
]
