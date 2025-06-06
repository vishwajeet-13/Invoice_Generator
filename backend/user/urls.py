from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.User, name='user'),
    path('user/invoice/create', views.UserInvoiceView.as_view(), name= "create-invoice"),
    path('user/invoice/list/<int:uid>', views.UserInvoiceView.as_view(), name='invoices'),
    path('user/create/', views.UserView.as_view(), name='create-user'),
    path('user/login/', views.UserOps.as_view(), name="login-user"),
    path('user/get/<int:pk>', views.UserView.as_view(), name="get-user"),
    path('user/delete/<int:pk>/', views.UserView.as_view(), name="delete-user"),
]
