from django.shortcuts import render
import requests
import uuid
from django.conf import settings
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from .models import Payment, Event
from .serializers import PaymentSerializer
from django.views.generic import TemplateView
from tickets.models import Ticket


class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChapaInitializePaymentView(generics.GenericAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        event_id = request.data.get('event_id')

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=404)

        # Prevent multiple tickets per user per event
        if Ticket.objects.filter(attendee=request.user, event=event).exists():
            return Response({'error': 'You have already purchased a ticket for this event.'}, status=400)

        amount = event.price  # single ticket price
        tx_ref = str(uuid.uuid4())
        user = request.user

        payment = Payment.objects.create(
            user=user,
            event=event,
            amount=amount,
            chapa_tx_ref=tx_ref,
            chapa_status='pending'
        )

        chapa_url = "https://api.chapa.co/v1/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "amount": str(amount),
            "currency": "ETB",
            "email": user.email,
            "first_name": user.first_name or user.username,
            "last_name": user.last_name or "",
            "tx_ref": tx_ref,
            "callback_url": request.build_absolute_uri("/api/payments/chapa/callback/"),
            "return_url": f"{settings.FRONTEND_URL}/payment-success?tx_ref={tx_ref}",
            "customization[title]": f"1 ticket for {event.title}",
        }

        response = requests.post(chapa_url, json=data, headers=headers)
        resp_json = response.json()

        if resp_json.get('status') == 'success':
            return Response({'payment_url': resp_json['data']['checkout_url'], 'tx_ref': tx_ref})
        else:
            payment.chapa_status = 'failed'
            payment.save()
            return Response({'error': resp_json.get('message', 'Chapa error')}, status=400)


class ChapaCallbackView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        tx_ref = request.data.get('tx_ref') or request.GET.get('tx_ref')
        if not tx_ref:
            return Response({'error': 'tx_ref required'}, status=400)

        try:
            payment = Payment.objects.get(chapa_tx_ref=tx_ref)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)

        chapa_url = f"{settings.CHAPA_BASE_URL}/transaction/verify/{tx_ref}"
        headers = {
            "Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}",
        }

        response = requests.get(chapa_url, headers=headers)
        resp_json = response.json()

        if resp_json.get('status') == 'success' and resp_json['data']['status'] == 'success':
            if payment.chapa_status != 'paid':
                payment.chapa_status = 'paid'
                payment.save()

                # Create exactly one ticket per successful payment
                Ticket.objects.create(
                    attendee=payment.user,
                    event=payment.event,
                    payment=payment
                )

            return Response({'status': 'paid'})
        else:
            payment.chapa_status = 'failed'
            payment.save()
            return Response({'status': 'failed'}, status=400)


class ChapaVerifyPaymentView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tx_ref = request.GET.get('tx_ref')
        if not tx_ref:
            return Response({'error': 'tx_ref required'}, status=400)

        try:
            payment = Payment.objects.get(chapa_tx_ref=tx_ref)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)

        chapa_url = f"{settings.CHAPA_BASE_URL}/transaction/verify/{tx_ref}"
        headers = {
            "Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}",
        }

        response = requests.get(chapa_url, headers=headers)
        resp_json = response.json()

        if resp_json.get('status') == 'success' and resp_json['data']['status'] == 'success':
            if payment.chapa_status != 'paid':
                payment.chapa_status = 'paid'
                payment.save()

                # Create one ticket per payment
                Ticket.objects.create(
                    attendee=payment.user,
                    event=payment.event,
                    payment=payment
                )

            return Response({
                'status': 'paid',
                'amount': payment.amount,
                'event': payment.event.title,
                'user': payment.user.username,
                'tickets': Ticket.objects.filter(payment=payment).count(),
                'tx_ref': payment.chapa_tx_ref,
            })
        else:
            payment.chapa_status = 'failed'
            payment.save()
            return Response({'status': 'failed'}, status=400)


class PaymentSuccessView(TemplateView):
    template_name = 'payment_success.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        tx_ref = self.request.GET.get('tx_ref')
        try:
            payment = Payment.objects.get(chapa_tx_ref=tx_ref)
        except Payment.DoesNotExist:
            payment = None
        context['payment'] = payment
        return context
