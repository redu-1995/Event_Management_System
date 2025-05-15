# tickets/views.py
from django.http import JsonResponse

def ticket_test(request):
    return JsonResponse({'message': 'Tickets app is working!'})
