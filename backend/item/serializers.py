from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['description', 'quantity', 'unit_price', 'total_price', 'gst']