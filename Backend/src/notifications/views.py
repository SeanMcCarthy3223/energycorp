"""
Views for the notifications app.

Standard patterns:
- All views use TokenAuthentication
- All views set permission_classes explicitly
- Use DRF generics for CRUD, APIView for custom logic
"""
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication

from .permissions import AllowAdmin, AllowManager
from .models import Notification
from .serializers import (
    NotificationSerializer,
    CreateNotificationSerializer,
    UpdateNotificationSerializer,
    InactivateNotificationSerializer,
)


class NotificationList(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowManager]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()


class NotificationDetail(generics.RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowManager]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()


class NotificationCreate(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAdmin]
    serializer_class = CreateNotificationSerializer


class NotificationUpdate(generics.UpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAdmin]
    serializer_class = UpdateNotificationSerializer
    queryset = Notification.objects.all()


class NotificationDelete(generics.DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAdmin]
    queryset = Notification.objects.all()


class NotificationInactivate(generics.UpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAdmin]
    serializer_class = InactivateNotificationSerializer
    queryset = Notification.objects.all()
