from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event', 'amount', 'chapa_tx_ref', 'chapa_status', 'created_at')
    search_fields = ('user__username', 'event__title', 'chapa_tx_ref')
    list_filter = ('chapa_status', 'created_at')
