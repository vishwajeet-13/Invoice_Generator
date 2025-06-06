from django.urls import path
from .views import InvoiceAPIView
from . import views 

urlpatterns = [
     path('invoice/', views.invoice, name = "invoice"),
     path('invoice/create', InvoiceAPIView.as_view(), name = "create-invoice"),
]
