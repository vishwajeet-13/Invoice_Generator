from rest_framework import serializers
from .models import User
from item.models import Item
from contact.models import Contact
from invoices.models import Invoice
from invoices.serializers import InvoiceSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserDTO(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UserInvoice(serializers.Serializer):
    id = serializers.IntegerField()
    invoice = InvoiceSerializer() 

    def create(self, validated_data):
        user_id= validated_data['id']
        user= User.objects.get(id= user_id)
        invoice_data= validated_data['invoice']
        item_list= invoice_data['items']  
        seller_dict= invoice_data['seller']  
        buyer_dict= invoice_data['buyer']

        seller = Contact.objects.create(**seller_dict)
        buyer = Contact.objects.create(**buyer_dict)

        invoice = Invoice.objects.create(
            user= user,
            inv_number=invoice_data['inv_number'],
            inv_date=invoice_data['inv_date'],
            is_paid=invoice_data['is_paid'],
            notes=invoice_data['notes'],
            total_amount=invoice_data['total_amount'],
            seller = seller,
            buyer= buyer,
    )

        for item in item_list:
         Item.objects.create(invoice=invoice, **item)
        return invoice
