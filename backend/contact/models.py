from django.db import models

class Contact(models.Model):
   
   name = models.CharField(max_length=100)
   address = models.TextField()
   contact = models.CharField(max_length=15)
   gst = models.CharField(max_length=15, blank=True, null=True)

   def __str__(self):
      return self.name