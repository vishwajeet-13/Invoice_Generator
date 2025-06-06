from rest_framework import serializers
from .models import Invoice
from item.serializers import ItemSerializer
from contact.serializers import ContactSerializer
from item.models import Item
from contact.models import Contact
from user.models import User

class InvoiceSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True)
    seller = ContactSerializer()
    buyer = ContactSerializer()

    class Meta:
        model = Invoice
        fields = ["inv_number", "inv_date", "is_paid", "notes", "total_amount", "seller", "buyer", "user", "id" ,"items"]


    def create(self, validated_data):
        item_list = validated_data.pop('items', [])
        seller_dict = validated_data.pop('seller', {})
        buyer_dict = validated_data.pop('buyer', {})
        seller = Contact.objects.create(**seller_dict)
        buyer = Contact.objects.create(**buyer_dict)
        invoice = Invoice.objects.create(seller=seller, buyer=buyer, **validated_data)
        for item in item_list:
            Item.objects.create(invoice=invoice, **item)
        return invoice