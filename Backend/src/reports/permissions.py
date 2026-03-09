from rest_framework.permissions import BasePermission
from users.models import Worker


class AllowManager(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            quey = Worker.objects.filter(
                user=request.user.id).values('user_type')
            return bool(quey[0]['user_type'] == 2)
        else:
            return False
