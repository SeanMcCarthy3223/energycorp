"""
Views for the {app_name} app.

Standard patterns:
- All views use TokenAuthentication
- All views set permission_classes explicitly
- Use DRF generics for CRUD, APIView for custom logic
"""
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import AllowAdmin, AllowManager, AllowOperator
from .models import  # TODO: import models
from .serializers import  # TODO: import serializers


# Example: List + Create
class {ModelName}ListCreateView(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowManager]
    # serializer_class = {ModelName}Serializer
    # queryset = {ModelName}.objects.all()