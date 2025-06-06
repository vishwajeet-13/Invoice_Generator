from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, UserDTO, UserInvoice
from .models import User
from faker import Faker
from invoices.serializers import InvoiceSerializer
from invoices.models import Invoice
import random



class UserView(APIView):
    def post(self, req):
        serializer = UserSerializer(data=req.data)
        if serializer.is_valid():
            user_ins = serializer.create(serializer.validated_data)
            user_ins.save()
            response = UserSerializer(user_ins) 
            return Response(response.data, status=201)
        return Response(serializer.errors, status=400)
    def get(self, req, pk=None):
        only = req.query_params.get('only')
        if pk is not None and pk > 0 :
            try:
                user = User.objects.get(pk=pk)
                if only is not None:
                    match only:
                        case 'email':
                            return Response({'email': user.email}, status=200)
                        case 'username':
                            return Response({'username': user.username}, status=200)
                        case 'contact_number':
                            return Response({'contact_number': user.contact}, status=200)
                        case 'gst_number':
                            return Response({'gst_number': user.gst_number}, status=200)
                        case 'address':
                            return Response({'address': user.address}, status=200)
                        case _:
                            return Response(serializer.data, status=200) 
                serializer = UserSerializer(user)
                return Response(serializer.data, status=200)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
              return Response({'error': 'User not found'}, status=404)
    def delete(self, request, pk=None):
        if pk is None or pk <= 0 :
            return Response({'error': 'User ID (pk) is required for delete.'}, status=400)
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({'message': 'User deleted successfully.'}, status=204)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)
    
class UserOps(APIView):
    #login_post
    def post(self, req):
        serializer = UserDTO(data=req.data)
        if serializer.is_valid():
            login_details = serializer.data
            try:
                if login_details is not None:
                    user = User.objects.get(username=login_details['username'])
                    if user.password == login_details['password']:
                        res = UserSerializer(user).data
                        return Response(res, status=200)
                    else:
                        return Response({'error': 'Invalid not found.'}, status=404)
            except User.DoesNotExist:
                return Response({'error': 'User not found.'}, status=404)
        return Response(str(login_details), status=400)
    #seed-user
    def get(self, req):
        fake = Faker()

        def generate_gst_number():
            return f"{fake.random_int(10, 99)}{fake.bothify(text='??????????').upper()}{fake.random_uppercase_letter()}{fake.random_int(10,99)}"

        u = {
            "username": fake.user_name(),
            "password": fake.password(length=10),
            "contact_number": fake.msisdn()[:10],
            "email": fake.unique.email(),
            "gst_number": generate_gst_number(),
            "address": fake.address(),
            "company_name": fake.company(),
            }

        serializer = UserSerializer(data=u)
        if serializer.is_valid():
            user_ins = serializer.create(serializer.validated_data)
            user_ins.save()
            response = UserSerializer(user_ins) 
            return Response(response.data, status=201)
        else:
            return Response(serializer.errors, status=400)

class UserInvoiceView(APIView):
    def post(self, request):
        service = UserService()
        processed_data = service.process(request.data['invoice'])

        data_for_serializer = {
            "id": request.data.get("id"),
            "invoice": processed_data
        }

        serializer = UserInvoice(data=data_for_serializer)
        if serializer.is_valid():
            inv = serializer.save()
            inv_dict = InvoiceSerializer(inv).data
            return Response(inv_dict, status=201)
        return Response(serializer.errors, status=400)    
    def get(self, request, uid):
        if uid is None or uid <= 0 :
            return Response({'error': 'Invalid Uid provided .'}, status=400)
        invoices = Invoice.objects.filter(user_id = uid)
        if not invoices.exists():
            return Response({'error': 'No Invoices found for this user.'}, status=404)
        serializer = InvoiceSerializer(invoices, many = True)
        return Response(serializer.data, status = 200)
    
                   
class UserService:
    def process(self, inv_data):
        total = 0
        for item in inv_data.get('items', []):
            base_price = float(item['quantity']) * float(item['unit_price'])
            gst_percent = float(item.get('gst', 0))  
            gst_amount = base_price * (gst_percent / 100)
            item['total_price'] = round(base_price + gst_amount, 2)
            total += item['total_price']
        inv_data['total_amount'] = round(total, 2)
        return inv_data        