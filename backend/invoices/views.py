from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InvoiceSerializer


class InvoiceAPIView(APIView):
    def post(self, request):
        inv_serd = InvoiceSerializer(data = request.data)                   
        if inv_serd.is_valid():
            invoice = inv_serd.save()
            return Response(InvoiceSerializer(invoice).data, status = status.HTTP_201_CREATED)  
        return Response(inv_serd.errors, status = status.HTTP_400_BAD_REQUEST)