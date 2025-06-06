from django.db import models
from invoices.models import Invoice

class Item(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    description = models.TextField(max_length=255)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    GST_CHOICES = [
        (0,'Nil(0%)'),
        (5, '5%'),
        (12, '12%'),
        (18, '18%'),
        (28, '28%'),
    ]
    gst = models.IntegerField(choices=GST_CHOICES, default=0)

def __str__(self):
    return f"{self.description}"
    