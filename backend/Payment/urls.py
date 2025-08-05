from django.urls import path
from .views import PaymentListCreateView, ChapaInitializePaymentView, ChapaVerifyPaymentView, PaymentSuccessView

urlpatterns = [
    path('', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('chapa/init/', ChapaInitializePaymentView.as_view(), name='chapa-init'),
    path('chapa/verify/', ChapaVerifyPaymentView.as_view(), name='chapa-verify'),
    path('payment-success/', PaymentSuccessView.as_view(), name='payment-success'),
]