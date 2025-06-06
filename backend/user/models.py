from django.db import models

class User(models.Model):

    username = models.CharField(max_length=100)
    password = models.CharField(max_length=125)
    email = models.EmailField(max_length=254, unique=True)
    contact = models.CharField(max_length=15)
    company_name = models.CharField(max_length=50, null=True, blank=True)
    gst_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    address = models.TextField()

    def __str__(self):
     return self.username

