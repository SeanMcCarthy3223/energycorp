from django.db import models
from django.conf import settings


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        (1, 'info'),
        (2, 'warning'),
        (3, 'alert'),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.PositiveSmallIntegerField(
        choices=NOTIFICATION_TYPES, default=1)
    is_read = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
