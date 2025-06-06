from django.db import models
from contact.models import Contact
from user.models import User

class Invoice(models.Model):

    inv_number = models.CharField(max_length=50, unique=True)
    inv_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=12 ,decimal_places=2)
    user = models.ForeignKey(User,related_name='invoices', on_delete=models.CASCADE, null=True)
    seller = models.ForeignKey(Contact,related_name='seller', on_delete=models.CASCADE, null=True)
    buyer = models.ForeignKey(Contact,related_name='buyer', on_delete=models.CASCADE, null=True)

def __str__(self):
    return f"Invoice no. #{self.inv_number}"

