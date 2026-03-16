from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'title', 'message',
            'notification_type', 'is_read', 'is_active', 'created_at'
        ]


class CreateNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'user', 'title', 'message', 'notification_type'
        ]


class UpdateNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['title', 'message', 'notification_type']


class InactivateNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_active']
